<template>
  <!-- Reject IE9 entirely (better to display nothing than something broken) -->
  <div v-if="!($browserDetect.isIE && $browserDetect.meta.version < 10)">
    <!-- Main Widget -->
    <div class="cleanslate">
      <ccw-wrapper 
        :id="`ccw-container-${_uid}`" 
        :size="size" 
        :dark="dark" 
        @click="showChart = !showChart">
        <ccw-brand>
          <img logo svg-inline src="./climateclockurl.svg">
          <ccw-div>
            <img science svg-inline src="./seethescience.svg">
            <ccw-div>
              FLATTEN THE<br>CURVES
            </ccw-div>
          </ccw-div>
        </ccw-brand>
        <ccw-flexwrap>
          <ccw-panel deadline>
            <ccw-div>
              <ccw-span>DEADLINE</ccw-span>
              <ccw-span>We must achieve net zero emissions in:</ccw-span>
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
      </ccw-wrapper>
    </div>

    <!-- Chart portion (component is lazy loaded) -->
    <transition name="slide">
      <ccw-chart-wrapper v-if="showChart" id="ccw-chart-wrapper" :size="size">
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


    <div class="mockup-control-panel">
      <h1>NON-WORKING PARTIAL DEMO</h1>
      <p>Resize your browser until the widget appears properly, it's in the middle of being redesigned and won't work properly almost anywhere.</p>

      <h2>Experimental features</h2>
      <p>You are looking at an experimental, non-functioning CLIMATECLOCK widget. It is designed for testing the program code and does not depict accurate information.</p>
      <hr>
      <input type="checkbox" v-model="dark"><label>Dark</label><br>
      <!--
      <h3>* Investment Weighting</h3>
      <vue-slider 
        v-model="weightA"
        :min="0"
        :max="1"
        :interval=".1"
        ></vue-slider>
      <h3>* Speed Weighting</h3>
      <vue-slider 
        v-model="weightB"
        :min="0"
        :max="1"
        :interval=".1"
        ></vue-slider>
      -->
    </div>
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
  },
  components: {
    // Lazy-load this component
    'ccw-chart': () => import(/* webpackChunkName: "flatten" */ './Chart.vue'),
    //'range-slider': VueRangeSlider,
  },
  data: () => ({
    // Component loading
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
        //.replace('.', '\u200a')
    },

    // Items below are skin/theme-specific
    animationDuration() {
      return {animationDuration: .15 * this.feedText.length + 's'}
    },
    feedText() {
      return (this.lifeline ? `${this.lifeline} | ` : '') + this.feed
    },
    /*
    budgetLabelText() {
      return 'CARBON BUDGET' 
        + (/xs|lg|xl/.test(this.size) ? ' REMAINING' : '') 
        + (/xs|sm|md/.test(this.size) ? ' (TONS)' : '')
    },
    budgetText() {
      return `${Math.floor(this.CO2Budget).toLocaleString()}${/xs|sm|md/.test(this.size) ? '' : ' TONS'}`
    },
    clockText() {
      let r = this.remaining, p = this.pad, pl = this.plural
      return /xs|sm|md/.test(this.size)
        ? `${r.years}Y ${r.days}D ${p(r.hours)}:${p(r.minutes)}:${p(r.seconds)}`
        : `${pl(r.years, 'YEAR', 'S')} ${pl(r.days, 'DAY', 'S')} ${p(r.hours)}:${p(r.minutes)}:${p(r.seconds)}`
    },
    */
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
  mounted() {
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

// <ccw-wrapper>
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

ccw-wrapper {
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

  *, *:before, *:after {
    box-sizing: border-box;
  }

  height: $cubit;
  &[size="lg"] {
    font-size: 14.5px;
  }
  &[size="md"]{
    font-size: 18px;
    height: 2 * ($cubit - 1rem);
    flex-direction: row; 
  }
  &[size="sm"] {
    font-size: 13px;
    height: ($cubit - 3rem) * 2;
    flex-direction: row; 
  }
  &[size="xs"] {
    font-size: 9px;
    height: ($cubit - 4rem) * 2;
    flex-direction: row; 
  }
}

ccw-flexwrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  //align-items: stretch;
  position: relative; // nested <ccw-ticker> needs this, yeah?
  width: 100%;
  //height: $cubit;

  flex: 10 0 0;
  ccw-wrapper[size="lg"] & {
    //height: $cubit - 1rem;
  }
  ccw-wrapper[size="md"] & {
    //height: ($cubit - 1rem) * 2;
    flex-direction: column;
  }
  ccw-wrapper[size="sm"] & {
    //height: ($cubit - 3rem) * 2;
    flex-direction: column;
  }
  ccw-wrapper[size="xs"] & {
    //height: ($cubit - 4rem) * 2;
    flex-direction: column;
  }
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
  ccw-wrapper[size="lg"] & {
    ccw-span {
      padding: $txtPad $txtPad * 2 - 2px;
    }
  }
  ccw-wrapper[size="md"] & {
    height: $cubit - 1.5rem;
  }
  ccw-wrapper[size="sm"] & {
    height: $cubit - 1.5rem;
  }
  ccw-wrapper[size="xs"] & {
    height: $cubit - 1.5rem;
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
    ccw-wrapper[dark] & {
      color: $accent;
      background: $accentDark;
      ccw-span:first-of-type {
        background: $accentDark;
        color: $accent;
      }
    }
    ccw-wrapper[size="lg"] & {
      flex: 1 0 53%;
    }
  }
  &[lifeline] {
    //flex: 1 0 45%;
    background: $secondary;
    ccw-div {
      background: black;
      color: $secondary;
    }
    ccw-span:first-of-type {
      background: $secondary;
      color: black;
    }
    ccw-wrapper[dark] & {
      color: $secondary;
      background: $secondaryDark;
      ccw-span:first-of-type {
        background: $secondaryDark;
        color: $secondary;
      }
    }
    ccw-wrapper[size="lg"] & {
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
  ccw-wrapper[size="lg"] & {
    line-height: 1.3;
    font-size: 52px;
  }
  ccw-wrapper[size="md"] & {
    font-size: 57px;
  }
  ccw-wrapper[size="sm"] & {
    font-size: 40px;
  }
  ccw-wrapper[size="xs"] & {
    line-height: 1.2;
    font-size: 27px;
  }
  ccw-span { // Smaller labels
    line-height: 1;
    margin-bottom: -6px;
    margin-right: 2px;
    font-size: 27px;
    padding: 0;
    background: transparent;

    ccw-wrapper[size="lg"] & {
      font-size: 20px;
      margin-bottom: -4px;
      padding: 0;
    }
    ccw-wrapper[size="md"] & {
      font-size: 30px;
      margin-bottom: -5px;
      padding: 0;
    }
    ccw-wrapper[size="sm"] & {
      font-size: 24px;
      margin-bottom: -3px;
      padding: 0;
    }
    ccw-wrapper[size="xs"] & {
      font-size: 15px;
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

  ccw-div {
    position: absolute;
    top: 1px;
    ccw-wrapper[size="lg"] & {
      top: 2px;
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

  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;

  font-size: 10px;

  ccw-wrapper[size="lg"] & {
    width: $cubit;
  }
  ccw-wrapper[size="md"] & {
    width: $cubit - 1rem;
    flex-direction: column;
  }
  ccw-wrapper[size="sm"] &, ccw-wrapper[size="xs"] & {
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
////////////////////////////////////////////////////////////
ccw-life-and-death { // now a mere span
  margin: .3rem .5rem;
  ccw-wrapper[size="sm"] & {
    margin: .2rem .3rem;
  }
  ccw-wrapper[size="xs"] & {
    margin: .1rem .2rem;
  }
}
ccw-cta { // now a mere "span"
  position: relative;
  text-align: left;
  flex: 2 0 0;
  font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 1;
  background: black;
  padding-top: 6px;

  ccw-wrapper[size="lg"] & {
    font-size: 17px;
  }
  ccw-wrapper[size="sm"] & {
    padding-top: 2px;
  }
  ccw-wrapper[size="xs"] & {
    padding-top: 1px;
  }
}
////////////////////////////////////////////////////////////

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



// Mockup page (this junk goes in index.html)
div.mockup-control-panel {
  background-color: #fff6cd;
  display: block;
  padding: 2rem;
  font-family: Helvetica, Arial, sans-serif;
  h2, h3 { 
    margin: .25rem 0; 
  }
  h3 {
    margin-top: 1rem;
  }
  hr {
    border-top: 5px dashed orange;
    margin: 2rem 0;
  }
  .vue-slider {
    max-width: 30rem;
  }
  textarea {
    width: 30rem;
    height: 5rem;
  }
}
</style>
