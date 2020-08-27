<template>
  <!-- Reject IE9 entirely (better to display nothing than something broken) -->
  <div v-if="!($browserDetect.isIE && $browserDetect.meta.version < 10)">

    <!-- Main Widget -->
    <div class="cleanslate">
      <ccw-w :class="{flatten: flatten}" :id="`ccw-container-${_uid}`" :size="size" :dark="dark">
        <ccw-brand>
          <img logo svg-inline src="./climateclocktrio.svg">
          <img science svg-inline src="./how.svg">
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
              <ccw-span>% of world's energy from renewables:</ccw-span>
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
    flatten: {type: Boolean, default: false},
    dark: {type: Boolean, default: false},
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

    // Items below should be skin/theme-specific
    animationDuration() {
      return {animationDuration: .15 * this.feedText.length + 's'}
    },
    feedText() {
      return (this.lifeline ? `${this.lifeline} | ` : '') + this.feed
    },
  },
  methods: {
    setSize() {
      // Assign a size attribute to the html (we can't use css media queries)
      this.$nextTick(() => {
        let width = document.getElementById(`ccw-container-${this._uid}`).clientWidth
        for (let sz of this.sizes) {
          if (width < sz[0]) break
          this.size = sz[1]
        }
        // Trigger the ready watcher
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
    updatePreset(preset) {
      this.preset = preset
    },
    setPreset(preset) {
      switch(preset) {
        case 'bad':     this.A = 2; this.B = 2; break
        case 'middle':  this.A = 3; this.B = 3; break
        case 'good':    this.A = 5; this.B = 5; break
      }
      this.preset = preset
    }
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
      tickInterval = 997
    }
    window.addEventListener('load', this.setSize)
    window.addEventListener('resize', this.resizeInterval ? debounce(this.setSize, resizeInterval) : this.setSize)
    setInterval(() => { this.now = new Date() }, tickInterval)
  },
  watch: {
    ready() {
      // Add padding to the bottom of the page when we do the fixed position <climate-clock bottom>
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

  &.flatten, 
  &[size="xl"].flatten, 
  &[size="lg"].flatten, 
  &[size="md"].flatten, 
  &[size="sm"].flatten, 
  &[size="xs"].flatten {
    height: 1px;
    opacity: 0;
  }
  *, *:before, *:after {
    box-sizing: border-box;
  }

  height: $cubit;
  &[size="lg"] {
    font-size: 13.75px;
  }
  &[size="md"]{
    font-size: 14.25px;
    height: 2 * ($cubit - 1.5rem);
    flex-direction: row; 
  }
  &[size="sm"] {
    font-size: 11px;
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
      padding: $txtPad $txtPad * 2 - 4px;
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
      padding: $txtPad $txtPad * 2 - 4px;
    }
    >ccw-div >ccw-span:nth-of-type(1) {
      font-size: 13.5px;
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
      flex: 1 0 52%;
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
    font-size: 50px;
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
      font-size: 21px;
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
      top: 3px;
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
    max-height: 60%;
    max-width: 90%;
    padding-top: .5rem;
  }
  svg[science] {
    max-width: 80%;
    max-height: 25%;
    margin-bottom: 4px;
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

</style>
