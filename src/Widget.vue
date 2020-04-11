<template>
  <div v-if="!($browserDetect.isIE && $browserDetect.meta.version < 10)" class="cleanslate">
    <!-- Main Widget -->
    <ccw-wrapper :id="`ccw-container-${_uid}`" :size="size" :dark="dark" @click="showChart = !showChart">
      <ccw-brand @click="showChart = !showChart" adrian>
        <img svg-inline src="./earth.svg">
        <span>Climate<span lifeline>Clock</span></span>
        <input type="button" :value="`${!showChart ? '🡻' : '🡹'}`">
      </ccw-brand>
      <ccw-flexwrap>
        <ccw-panel deadline>
          <ccw-div>
            <ccw-text>DEADLINE:</ccw-text>
            <ccw-ticker-wrap>
              <ccw-ticker-label solid>{{ deadlineLabel }}</ccw-ticker-label>
            </ccw-ticker-wrap>
          </ccw-div>
          <ccw-display>{{ remaining.years }}<ccw-span>Y</ccw-span>{{ pad(remaining.days, 3) }}<ccw-span>D</ccw-span>{{ pad(remaining.hours, 2) }}<ccw-span>:</ccw-span>{{ pad(remaining.minutes, 2) }}<ccw-span>:</ccw-span>{{ pad(remaining.seconds, 2) }}
          </ccw-display>
        </ccw-panel>
        <ccw-panel lifeline>
          <ccw-div>
            <ccw-text>LIFELINE:</ccw-text>
            <ccw-ticker-wrap>
              <ccw-ticker-label>{{ lifelineLabel }}</ccw-ticker-label>
              <ccw-ticker one :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
              <ccw-ticker two :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
            </ccw-ticker-wrap>
          </ccw-div>
          <ccw-display>{{ renewablePercent }}%</ccw-display>
        </ccw-panel>
      </ccw-flexwrap>
    </ccw-wrapper>

    <!-- Chart portion (component is lazy loaded) -->
    <transition name="slide">
      <ccw-chart-wrapper v-if="showChart" id="ccw-chart-wrapper">
        <ccw-div>
          <h1>#FLATTENTHECURVE</h1>
          <h2>1.5°C Global Temperature Rise</h2>
          <ccw-chart 
            :width="chartWidth" :height="400" 
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
          <p>This is a mockup, the data is fake and bad.</p>
          <p>Here's a blurb explaining what this chart means and some dynamically changing text. Currently "investment" is {{ factorA }} and "speed" is {{ speeds[factorB] }}. This paragraph will show implications of these values.</p>
        </ccw-control-panel>
      </ccw-chart-wrapper>
    </transition>


    <div class="mockup-control-panel">
      <h2>Experimental features</h2>
      <p>You are looking at an experimental, non-functioning CLIMATECLOCK widget. It is designed for testing the program code and does not depict accurate information.</p>
      <hr>
      <input type="checkbox" v-model="dark"><label>Dark</label>
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
    'ccw-chart': () => import(/* webpackChunkName: "flatten" */ './Chart.vue')
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
    lifelineLabel: "global energy now renewable",
    startDateUTC: clock.startDateUTC,
    startDateCO2Budget: clock.startDateCO2Budget,
    tonsPerSecond: clock.tonsPerSecond,
    
    // Lifeline
    deadlineLabel: "how much time we have to act",
    renewPlaces: 9,
    renewStartDate: new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
    renewStartPct: 26.2,
    renewIncPerYear: (45 - 26.2)/(2040 - 2019), // Expected rise to 45% by 2040 w/26.2% by 2019
    
    // Chart 
    chartWidth: 0,
    factorA: 0, factorB: 0,
    showChart: true,
    speeds: {'Slow':0, ' ':20, '  ':40, '   ':60, '    ':80, 'Fast':100},
    weightA: .7, weightB: .3,

    // Items below are for experimental mockups
    dark: true,

    // Items below are skin/theme-specific (TODO: settle on defaults for all skins/themes)
    // Ascending sizes work like breakpoints, adding an html attribute to the container
    size: 'hide',
    sizes: [[0, 'hide'], [224, 'xs'], [320, 'sm'], [540, 'md'], [960, 'lg'], [1200, 'xl']], 
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
        countdown.YEARS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS )
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
    setChartRatio(width) {
      width = width || document.getElementById(`ccw-container-${this._uid}`).clientWidth
      this.chartWidth = width * .666 // XXX: Based on 2/3rds layout
    },
    setSize() {
      this.$nextTick(() => {
        let width = document.getElementById(`ccw-container-${this._uid}`).clientWidth
        for (let sz of this.sizes) {
          if (width < sz[0]) break
          this.size = sz[1]
        }
        this.setChartRatio(width)
        this.ready = true
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
    let resizeInterval = 0, tickInterval = 100
    if (this.$browserDetect.isEdge) { // Slow down for the special browser
      resizeInterval = 250
      tickInterval = 250
    }
    window.addEventListener('load', this.setSize)
    window.addEventListener('resize', 
      this.resizeInterval ? debounce(this.setSize, resizeInterval) : this.setSize)
    setInterval(() => { this.now = new Date() }, tickInterval)
  },
  mounted() {
    this.setChartRatio()
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
//@import 'vue-slider-component/theme/material';
@import 'matthewha';

$accent: #ff0000;
$secondary: #00dd72;

@mixin glow($color) {
  font-weight: 400;
  color: lighten($color, 20%);
  text-shadow:  .5px  .5px .1em $color,
               -.5px -.5px .1em $color,
               -.5px  .5px .1em $color,
                .5px -.5px .1em $color;
}

// <ccw-wrapper>
ccw-fixed {
  position: fixed;
  bottom: 0; 
  left: 0; right: 0;
  z-index: 1000;
  box-shadow: 0 20px 30px rgba(black, 50%);
}
ccw-wrapper {
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse; 
  justify-content: space-between;
  font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
  font-size: 22px;
  //font-weight: 600;
  position: relative;
  width: 100%;
  white-space: nowrap;
  //padding-bottom: 1rem;

  *, *:before, *:after {
    box-sizing: inherit;
    display: inline-block;
    overflow: hidden;
    text-align: center;
  }
  &[size="lg"] {
    font-size: 20px;
  }
  &[size="md"]{
    font-size: 25px;
  }
  &[limit][size="md"]{
    max-width: 700px;
    font-size: 25px;
  }
  &[size="sm"] {
    font-size: 20px;
  }
  &[size="xs"] {
    font-size: 25px;
  }
  &[size="md"], &[size="sm"], &[size="xs"] {
    flex-direction: row; 
  }
}

$panelH: 7rem;

ccw-flexwrap {
  display: flex;
  flex-direction: row;
  flex: 10 0 0;
  width: 100%;
  height: $panelH;
  ccw-wrapper[size="md"] &, ccw-wrapper[size="sm"] &, ccw-wrapper[size="xs"] & {
    height: $panelH * 2;
    flex-direction: column;
  }

}
ccw-panel {
  height: 100%;
  flex: 1 0 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  //padding: .5rem .75rem;
  &[deadline] {
    background: $accent;
    ccw-wrapper[dark] & {
      color: $accent;
      background-color: black;
    }
  }
  &[lifeline] {
    background: $secondary;
    ccw-wrapper[dark] & {
      color: $secondary;
      background-color: black;
    }
  }
  ccw-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex: 1 0 0;
  }
}
ccw-display {
  flex: 2 0 0;
  font-size: 70px;
  line-height: 1;
  text-align: left;
  &[size="md"] {
    font-size: 80px;
  }
}
ccw-span {
  line-height: 1;
  margin-bottom: -6px;
  font-size: 35px;
}
ccw-ticker-wrap {
  position: relative;
  text-align: left;
  height: 100%;
  flex: 2 0 0;
  font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
  text-transform: uppercase;
  ccw-wrapper[dark] & {
    font-weight: 600;
  }
}
ccw-ticker {
  position: absolute;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  &[one] { animation-name: widget-feed-one; }
  &[two] { animation-name: widget-feed-two; }
}
ccw-ticker-label {
  position: absolute;
  z-index: 1;
  width: 100%;
  text-align: left;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-name: feed-fade;
  animation-duration: 10s;
  &[solid] {
    animation: none;
  }
  ccw-panel[deadline] & {
    ccw-wrapper[dark] & {
      color: $accent;
      background-color: black;
    }
    background-color: $accent;
  }
  ccw-panel[lifeline] & {
    ccw-wrapper[dark] & {
      color: $secondary;
      background-color: black;
    }
    background-color: $secondary;
  }
  ccw-panel:hover & {
    animation-name: none;
  }
}
@keyframes feed-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  30% { opacity: 0; }
  95% { opacity: 0; }
  100% { opacity: 1; }
}

ccw-text {
  flex: 1 0 1;
  padding-right: .5rem;
}
ccw-brand {
  font-family: 'folsomblack', 'Lucida Console', Monaco, monospace;
  line-height: .85;
  flex: 1.5 0 0;
  background: black;
  color: $secondary;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  flex-direction: column;
  font-size: 10px;
  span[lifeline] {
    color: $accent;
  }

  ccw-wrapper[size="md"] &, ccw-wrapper[size="sm"] &, ccw-wrapper[size="xs"] & {
    flex-direction: column;
    //flex: 2 0 0;
    min-width: 80px;
    //max-width: 80px;
    font-size: 5vw;
    svg {
      max-height: 100px;
    }
    span {
      display: none;
    }
  }
  input[type="button"] {
    position: absolute;
    bottom: 0rem;
    right: 0rem;
    cursor: pointer;
    z-index: 2001;

  }
  svg {
    outline: none;
    max-height: 80px;
    max-width: 80%;
    margin-bottom: 7px;
  }
}
@import "slider";
#ccw-chart-wrapper { // Use id to increase specificity over cleanslate
  //@import "node_modules/vue-slider-component/lib/styles/dot.scss";
  //@import "node_modules/vue-slider-component/lib/styles/mark.scss";
  //@import "node_modules/vue-slider-component/lib/styles/slider.scss";
  //@import "node_modules/vue-slider-component/lib/theme/material.scss";

  $chartWidth: 1rem;

  font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
  font-size: 23px;
  //width: calc(100% - #{$chartWidth * 2});
  //border: $chartWidth solid lighten(black, 35%);
  //padding: $chartWidth;

  border-bottom: 1rem solid black;
  box-shadow: 0 10px 80px rgba(black, .1) inset;
  background: lighten(black, 90%);
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  canvas {
    // Allows the text to go behind the graph
    background: rgba(0,0,0,0);
    position: relative;
  }
  h1, h2 {
    font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
    font-weight: normal;
    text-align: center;
    left: 0;
    width: 100%;
    position: absolute;
    opacity: .1;
    font-size: 70px;
    margin-top: 2rem;
    margin-right: 30px;
    //color: transparent;
    //text-shadow: 1px 3px 6px #ddd, 0 0 0 #000, 1px 3px 6px #ddd;
  }
  h2 {
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-size: 14px;
    margin-top: 15rem;
    opacity: 1;
    text-transform: uppercase;
  }
  ccw-div {
    flex: 3 0 0;
    position: relative;
    box-sizing: border-box;
  }
  ccw-control-panel {
    box-sizing: border-box;
    flex: 1 0 0;
    font-weight: normal;
    padding: 2rem 3rem;
    display: block;
    p {
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
.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
   opacity: 0;
}


@keyframes widget-feed-one {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}
@keyframes widget-feed-two {
  0% { transform: translate(100%, 0); }
  100% { transform: translate(0%, 0); }
}

// Mockup
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
