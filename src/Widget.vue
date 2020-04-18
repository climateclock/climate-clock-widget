<template>
  <!-- Reject IE9 entirely (better to display nothing than something broken) -->
  <div v-if="!($browserDetect.isIE && $browserDetect.meta.version < 10)">
    <!-- Main Widget -->
    <div class="cleanslate">
      <ccw-w :id="`ccw-container-${_uid}`" :size="size" :dark="dark" @click="showChart = !showChart">
        <ccw-brand>
          <img logo svg-inline src="./climateclockurl.svg">
          <ccw-div>
            <img science svg-inline src="./seethescience.svg">
            <ccw-div>FLATTEN THE<br>CURVES</ccw-div>
          </ccw-div>
        </ccw-brand>
        <ccw-flexwrap>
          <ccw-panel deadline>
            <ccw-div>
              <ccw-span>DEADLINE</ccw-span>
              <ccw-span>We must achieve zero emissions in:</ccw-span>
            </ccw-div>
            <ccw-readout>
              {{ remaining.years }}<ccw-span>YRS</ccw-span>{{ pad(remaining.days, 3) }}<ccw-span>DAYS</ccw-span>{{ pad(remaining.hours, 2) }}<ccw-span>:</ccw-span>{{ pad(remaining.minutes, 2) }}<ccw-span>:</ccw-span>{{ pad(remaining.seconds, 2) }}
            </ccw-readout>
          </ccw-panel>
          <ccw-panel lifeline>
            <ccw-div>
              <ccw-span>LIFELINE</ccw-span>
              <ccw-span>% of world's energy now renewable:</ccw-span>
            </ccw-div>
            <ccw-readout decimal>{{ renewablePercent }}%</ccw-readout>
          </ccw-panel>
          <ccw-ticker>
            <ccw-div one :style="animationDuration">{{ feedText }}</ccw-div>
            <ccw-div two :style="animationDuration">{{ feedText }}</ccw-div>
          </ccw-ticker>
        </ccw-flexwrap>
      </ccw-w>
    </div>

    <!-- Chart portion (component is lazy loaded) -->
    <transition name="slide">
      <ccw-chart-wrapper v-if="kiosk || showChart" id="ccw-chart-wrapper" :size="size">
        <ccw-div>
          <h2>1.5°C Global Temperature Rise</h2>
          <ccw-chart 
            :height="400" 
            :factorA="factorA" :factorB="speeds[factorB]"
            :weightA="weightA" :weightB="weightB"
            ></ccw-chart>
        </ccw-div>
        <ccw-control-panel id="ccw-slider">
          Investment
          <vue-slider
            v-model="factorA"
            :marks="true"
            :interval="10"
            :adsorb="true"
            v-bind:class="{good: factorA >= 90}"
            ></vue-slider>
          Speed of action
          <vue-slider 
            v-model="factorB"
            :marks="true"
            :data="Object.keys(speeds)"
            :included="true"
            :adsorb="true"
            v-bind:class="{good: speeds[factorB] >= 90}"
            ></vue-slider>
          <p>This is a mockup, the data is still missing.</p>
          <p>Here's a blurb explaining what this chart means and some dynamically changing text. Currently "investment" is {{ factorA }} and "speed" is {{ speeds[factorB] }}. This paragraph will show implications of these values.</p>
        </ccw-control-panel>
      </ccw-chart-wrapper>
    </transition>
  </div>
</template>


<script>
//import VueRangeSlider from 'vue-range-slider'
import countdown from 'countdown'
import debounce from 'lodash.debounce'

// Import defaults from json file to keep them in sync
import clock from './clock.json'


const SECONDS_PER_YEAR = 365.25 * 24 * 3600

export default {
  props: {
    bottom: {type: Boolean, default: false},
    lifeline: {type: String, default: null},
    kiosk: {type: Boolean, default: false},
  },
  components: {
    // Lazy-load this component
    'ccw-chart': () => import(/* webpackChunkName: "flatten" */ './Chart.vue'),
    //'range-slider': VueRangeSlider,
  },
  data: () => ({
    // Component loading
    // Github currently limits to 60req/hr so can we poll this every 90 seconds? What's reasonable?
    githubUrl: 'https://api.github.com/repos/BeautifulTrouble/climate-clock-widget/contents/src/clock.json',
    ready: false,
    usingNetworkData: false,

    // All clock action is invoked by changing this.now in an interval function
    now: null,

    // Deadline
    annualGrowth: clock.annualGrowth,
    feed: clock.feed,
    startDateUTC: clock.startDateUTC,
    startDateCO2Budget: clock.startDateCO2Budget,
    tonsPerSecond: clock.tonsPerSecond,
    
    // Lifeline
    renewPlaces: 7,
    renewStartDate: new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
    renewStartPct: 26.2,
    renewIncPerYear: (45 - 26.2)/(2040 - 2019), // Expected rise to 45% by 2040 w/26.2% by 2019
    
    // Chart 
    factorA: 0, factorB: 0,
    showChart: false,
    speeds: {'Slow':0, ' ':20, '  ':40, '   ':60, '    ':80, 'Fast':100},
    weightA: .4, weightB: .6,

    // To become a prop when the mockup is done
    dark: false,

    // Items below are skin/theme-specific (TODO: settle on defaults for all skins/themes)
    // Ascending sizes work like breakpoints, adding an html attribute to the container
    size: 'hide',
    sizes: [[0, 'hide'], [224, 'xs'], [320, 'sm'], [540, 'md'], [960, 'lg'], [1200, 'xl']], 
    lastSize: 0,
  }),
  computed: {
    // Deadline calculation
    CO2Budget() {
      let tElapsed = this.now - this.startDate.getTime()
      return this.startDateCO2Budget - tElapsed / 1000 * this.tonsPerSecond
    },
    deadline() {
      let msRemainingAtStartDate = (this.startDateCO2Budget / this.tonsPerSecond * 1000)
      return new Date(this.startDate.getTime() + msRemainingAtStartDate)
    },
    startDate() {
      return new Date(Date.UTC(...this.startDateUTC))
    },
    remaining() {
      return countdown(this.deadline, this.now,
        countdown.YEARS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS)
    },
    
    // Lifeline calculation
    renewIncPerSecond() {
      return this.renewIncPerYear / SECONDS_PER_YEAR
    },
    renewablePercent() {
      let tElapsed = this.now - this.renewStartDate.getTime()
      return (this.renewStartPct + (tElapsed / 1000 * this.renewIncPerSecond)).toFixed(this.renewPlaces)
    },

    // Items below are skin/theme-specific
    animationDuration() {
      return {animationDuration: .15 * this.feedText.length + 's'}
    },
    feedText() {
      return (this.lifeline ? `${this.lifeline} | ` : '') + this.feed
    },
  },
  methods: {
    setSize() {
      // Toggle this to force-re-render (hack: https://michaelnthiessen.com/force-re-render/)
      let chartShouldBeShown = this.showChart
      let currentViewportSize = window.innerWidth
      // Don't force-re-render before the first view, or when size hasn't changed
      if (this.ready && this.lastSize != currentViewportSize) { 
        this.showChart = false
      }
      this.lastSize = currentViewportSize

      this.$nextTick(() => {
        let width = document.getElementById(`ccw-container-${this._uid}`).clientWidth
        for (let sz of this.sizes) {
          if (width < sz[0]) break
          this.size = sz[1]
        }
        this.ready = true
        this.showChart = chartShouldBeShown
      })
    },
    // Items below are skin/theme-specific
    pad(i, n = 2, c = '0') {
      return (c.repeat(n) + i).slice(-n)
    },
    plural(n, pre, suf) {
      return (n == 0 || n > 1) ? `${n} ${pre + suf}` : `${n} ${pre}`
    },
    openHomepage() {
      window.location.hostname != 'climateclock.world' && window.open('https://climateclock.world')
    },
  },
  created() {
    // Data is fetched from the network because browsers may cache this script
    this.usingNetworkData = false
    this.$http.get(this.githubUrl).then(res => {
      let d = JSON.parse(atob(res.data.content))
      if (d.annualGrowth && d.feed && d.startDateCO2Budget && d.startDateUTC && d.tonsPerSecond) {
        Object.assign(this, d)
        this.usingNetworkData = true
      }
    }).catch(err => { // eslint-disable-next-line
      console.log(err)
    })

    // Watch for container size changes and update sizing classes
    let resizeInterval = 0, tickInterval = 997
    if (this.$browserDetect.isEdge) { // Slow down for the special browser
      resizeInterval = 250
      tickInterval = 250
    }
    window.addEventListener('load', this.setSize)
    window.addEventListener('resize', this.resizeInterval ? debounce(this.setSize, resizeInterval) : this.setSize)
    setInterval(() => { this.now = new Date() }, tickInterval)
  },
  watch: {
    ready() {
      if (!this.bottom || window.climateClockWidgetPaddingAdded) return
      window.climateClockWidgetPaddingAdded = true
      this.$nextTick(() => {
        let pb = window.getComputedStyle(document.body).getPropertyValue('padding-bottom'),
            ch = document.getElementById(`ccw-container-${this._uid}`).clientHeight
        document.body.style.paddingBottom = `calc(${pb} + ${ch}px)`
      })
    },
  },
}
</script>


<style lang="scss">
@mixin debug($color, $text) {
  &:after {
    content: $text;
    position: absolute;
    bottom: 0; left: 0;
    background-color: $color;
    padding: .25rem;
  }
}
@if $NODE_ENV == 'development' {
  [size="xs"] { @include debug(pink, 'xs'); }
  [size="sm"] { @include debug(red, 'sm'); }
  [size="md"] { @include debug(orange, 'md'); }
  [size="lg"] { @include debug(yellow, 'lg'); }
  [size="xl"] { @include debug(green, 'xl'); }
}

@import 'cleanslate';
//@import '../node_modules/vue-range-slider/dist/vue-range-slider.css';
@import 'matthewha';

$accent: #ff0000;
$accentDark: #940000;
$secondary: #00dd72;
$secondaryDark: #008040;

@mixin glow($color) {
  font-weight: 400;
  color: lighten($color, 20%);
  text-shadow:  .5px  .5px .1em $color,
               -.5px -.5px .1em $color,
               -.5px  .5px .1em $color,
                .5px -.5px .1em $color;
}

// <ccw-w>
ccw-fixed { // For "fixed" prop ;not yet used
  position: fixed;
  bottom: 0; 
  left: 0; right: 0;
  z-index: 1000;
  box-shadow: 0 20px 30px rgba(black, 50%);
}

ccw-div {
  display: block;
}
ccw-span {
  display: inline-block;
}

// An arbitrary measure which nevertheless gets used a lot (16 * 7 = 112)
$cubit: 7rem; 

ccw-w {
  cursor: pointer;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse; 
  justify-content: space-between;
  font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
  font-weight: normal;
  font-size: 18px;
  position: relative;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;

  *, *:before, *:after {
    box-sizing: border-box;
  }

  height: $cubit;
  &[size="lg"] {
    font-size: 14.5px;
  }
  &[size="md"]{
    font-size: 14.25px;
    height: 2 * ($cubit - 1.5rem);
    flex-direction: row; 
  }
  &[size="sm"] {
    font-size: 12px;
    height: 2 * ($cubit - 2.25rem);
    flex-direction: row; 
  }
  &[size="xs"] {
    font-size: 7px;
    height: 2 * ($cubit - 3.5rem);
    flex-direction: row; 
  }
}

ccw-flexwrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative; // <ccw-ticker> needs this, yeah?
  width: 100%;

  flex: 10 0 0;
}

// Used in deadline/lifeline headings and ticker
$txtPad: 5px;

ccw-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-transform: uppercase;
  color: black;

  flex: 1 0 49%; // 50% causes wrapping!
  overflow: hidden;

  height: $cubit - 1.5rem;
  ccw-w[size="lg"] & {
    ccw-span {
      padding: $txtPad $txtPad * 2 - 2px;
    }
    >ccw-div >ccw-span:nth-of-type(1) {
      font-size: 16px;
    }
  }
  ccw-w[size="md"] & {
    height: $cubit - 2.25rem;
    flex: 1 0 100%; // also ccw-ticker
    >ccw-div >ccw-span:nth-of-type(1) {
      font-size: 16px;
    }
  }
  ccw-w[size="sm"] & {
    height: $cubit - 3rem;
    flex: 1 0 100%; // also ccw-ticker
    ccw-span {
      padding: $txtPad $txtPad * 2 - 2px;
    }
  }
  ccw-w[size="xs"] & {
    height: $cubit - 4.25rem;
    flex: 1 0 100%; // also ccw-ticker
    ccw-span {
      padding: $txtPad $txtPad;
    }
    >ccw-div >ccw-span:nth-of-type(1) {
      font-size: 9px;
    }
  }
  ccw-span {
    padding: $txtPad $txtPad * 2;
  }
  >ccw-div >ccw-span:nth-of-type(2) {
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-weight: bold;
  }
  &[deadline] {
    background: $accent;
    ccw-div {
      background: black;
      color: $accent;
    }
    ccw-span:first-of-type {
      background: $accent;
      color: black;
    }
    ccw-w[dark] & {
      color: $accent;
      background: $accentDark;
      ccw-span:first-of-type {
        background: $accentDark;
        color: $accent;
      }
    }
    ccw-w[size="lg"] & {
      flex: 1 0 53%;
    }
  }
  &[lifeline] {
    background: $secondary;
    ccw-div {
      background: black;
      color: $secondary;
    }
    ccw-span:first-of-type {
      background: $secondary;
      color: black;
    }
    ccw-w[dark] & {
      color: $secondary;
      background: $secondaryDark;
      ccw-span:first-of-type {
        background: $secondaryDark;
        color: $secondary;
      }
    }
    ccw-w[size="lg"] & {
      flex: 1 0 45%;
    }
  }
}

$ccwFont: 70px;
ccw-readout {
  flex: 2 0 0;
  font-size: 59px;
  line-height: 1.1;
  text-align: left;
  margin: 0rem .75rem;
  position: relative;
  overflow: hidden;
  ccw-w[size="lg"] & {
    line-height: 1.3;
    font-size: 52px;
  }
  ccw-w[size="md"] & {
    font-size: 50px;
  }
  ccw-w[size="sm"] & {
    font-size: 35px;
    line-height: 1.3;
  }
  ccw-w[size="xs"] & {
    font-size: 23px;
  }
  ccw-span { // Smaller labels
    line-height: 1;
    margin-bottom: -6px;
    margin-right: 2px;
    font-size: 27px;
    padding: 0;
    background: transparent;

    ccw-w[size="lg"] & {
      font-size: 20px;
      margin-bottom: -4px;
      padding: 0;
    }
    ccw-w[size="md"] & {
      font-size: 20px;
      margin-bottom: -5px;
      padding: 0;
    }
    ccw-w[size="sm"] & {
      font-size: 14px;
      margin-bottom: -3px;
      padding: 0;
    }
    ccw-w[size="xs"] & {
      font-size: 9px;
      margin-bottom: -3px;
      padding: 0;
    }
  }
}
ccw-ticker {
  position: relative;
  height: 1.5rem;
  font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
  font-weight: bold;
  text-transform: uppercase;
  text-align: left;
  overflow: hidden;
  background: black;
  color: $secondary;
  flex: 2 0 100%;

  ccw-w[size="md"] & {
    flex: 1 0 100%; // also ccw-panel
  }
  ccw-w[size="sm"] & {
    flex: 1 0 100%; // also ccw-panel
  }
  ccw-w[size="xs"] & {
    flex: 1 0 100%; // also ccw-panel
  }
  ccw-div {
    position: absolute;
    top: 1px;
    ccw-w[size="lg"] & {
      top: 2px;
    }
    ccw-w[size="md"] & {
      top: 2px;
    }
    ccw-w[size="sm"] & {
      top: 4px;
    }
    ccw-w[size="xs"] & {
      top: 7px;
    }
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    padding: .15rem .5rem;
    &[one] { animation-name: widget-feed-one; }
    &[two] { animation-name: widget-feed-two; }
  }
  @keyframes widget-feed-one {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-100%, 0); }
  }
  @keyframes widget-feed-two {
    0% { transform: translate(100%, 0); }
    100% { transform: translate(0%, 0); }
  }
}
ccw-brand {
  font-family: 'folsomblack', 'Lucida Console', Monaco, monospace;
  line-height: .85;
  width: 8rem;
  background: black;
  color: $secondary;
  font-size: 10px;

  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;

  ccw-w[size="lg"] & {
    width: $cubit;
  }
  ccw-w[size="md"] & {
    width: $cubit - 1rem;
    flex-direction: column;
  }
  ccw-w[size="sm"] &, ccw-w[size="xs"] & {
    display: none;
  }
  svg {
    outline: none;
    display: block;
  }
  svg[logo] {
    max-height: 45%;
    max-width: 80%;
    padding-top: .5rem;
  }
  svg[science] {
    margin-right: .5rem;
  }
  > ccw-div {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    font-size: .75rem;
  }
}

@import "slider";
#ccw-chart-wrapper { // Use id to increase specificity over cleanslate
  //@import "node_modules/vue-slider-component/lib/styles/dot.scss";
  //@import "node_modules/vue-slider-component/lib/styles/mark.scss";
  //@import "node_modules/vue-slider-component/lib/styles/slider.scss";
  //@import "node_modules/vue-slider-component/lib/theme/material.scss";

  font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
  font-size: 23px;

  border-bottom: 1rem solid black;
  box-shadow: 0 10px 80px rgba(black, .1) inset;
  background: #e3e4e5;
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  &[size="md"], &[size="sm"], &[size="xs"] {
    flex-direction: column; 
  }
  canvas {
    // Allows the text to go behind the graph
    background: rgba(0,0,0,0);
    position: relative;
  }
  h2 { // TODO: no h2-type elements!
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-weight: normal;
    right: 7rem;
    position: absolute;
    opacity: 1;
    font-size: 14px;
    margin-top: 17rem;
    text-transform: uppercase;
    z-index: 1;
  }
  ccw-div {
    flex: 3 0 0;
    position: relative;
  }
  ccw-control-panel {
    flex: 1 0 0;
    font-weight: normal;
    display: block;
    padding: 2rem 3rem 2rem 0;
    p { // TODO: no p-type elements
      font-size: 14px; // just match the sliders
    }
    .vue-slider {
      margin-bottom: 2rem;
    }
    .vue-slider-dot-handle, 
    .vue-slider-dot-handle::after,
    .vue-slider-dot-tooltip-inner,
    .vue-slider-mark-step,
    .vue-slider-process {
      background-color: $accent;
    }
    .vue-slider-dot-handle::after,
    .vue-slider-rail {
      background-color: rgba(lighten($accent, 35%), .5);
    }
    .good {
      .vue-slider-dot-handle, 
      .vue-slider-dot-handle::after,
      .vue-slider-dot-tooltip-inner,
      .vue-slider-mark-step,
      .vue-slider-process {
        background-color: $secondary;
      }
      .vue-slider-dot-handle::after,
      .vue-slider-rail {
        background-color: rgba(lighten($secondary, 35%), .5);
      }
    }
  }
  &[size="md"], &[size="sm"], &[size="xs"] {
    ccw-control-panel {
      padding: 2rem 3rem;
    }
  }
}
.slide-enter-active {
   transition-duration: .2s;
}
.slide-leave-active {
   transition-duration: .2s;
}
.slide-enter-to, .slide-leave {
   max-height: 400px;
   overflow: hidden;
   opacity: 1;
}
ccw-chart-wrapper[size="xs"], ccw-chart-wrapper[size="sm"], ccw-chart-wrapper[size="md"] {
  &.slide-enter-to, &.slide-leave {
     max-height: 724px; // slide height
     overflow: hidden;
     opacity: 1;
  }
}
.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
   opacity: 0;
}
</style>
