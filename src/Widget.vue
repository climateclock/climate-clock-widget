<template>
  <!-- Reject IE9 entirely (better to display nothing than something broken) -->
  <div v-if="!($browserDetect.isIE && $browserDetect.meta.version < 10)">
    <!-- Main Widget -->
    <div class="cleanslate">
      <ccw-w :class="{flatten: flatten}" :id="`ccw-container-${_uid}`" :size="size" :dark="dark" @click="handleClick">
        <ccw-brand>
          <img logo svg-inline src="./climateclock.svg">
          <ccw-span>#ActInTime</ccw-span>
        </ccw-brand>
        <ccw-flexwrap>
          <ccw-panel deadline>
            <ccw-div>
              <ccw-span>DEADLINE</ccw-span>
              <ccw-span>{{ carbon.labels && carbon.labels[0] }}</ccw-span>
            </ccw-div>
            <ccw-readout>
              {{ remaining.years }}<ccw-span>YRS</ccw-span>{{ pad(remaining.days, 3) }}<ccw-span>DAYS</ccw-span>{{ pad(remaining.hours, 2) }}<ccw-span>:</ccw-span>{{ pad(remaining.minutes, 2) }}<ccw-span>:</ccw-span>{{ pad(remaining.seconds, 2) }}
            </ccw-readout>
          </ccw-panel>
          <ccw-panel lifeline>
            <ccw-div>
              <ccw-span>LIFELINE</ccw-span>
              <ccw-span v-if="current_module == 0">{{ renewables.labels && renewables.labels[0] }}</ccw-span>
              <ccw-span v-else-if="current_module == 1">{{ gcf.labels && gcf.labels[0] }}</ccw-span>
              <ccw-span v-else-if="current_module == 2">{{ debt.labels && debt.labels[0] }}</ccw-span>
              <ccw-span v-else>{{ indie.labels && indie.labels[0] }}</ccw-span>
            </ccw-div>
            <ccw-readout v-if="current_module == 0">{{ renewableValue.split('.')[0] }}<ccw-span>.</ccw-span>{{ renewableValue.split('.')[1]}}%</ccw-readout>
            <ccw-readout v-else-if="current_module == 1">${{ gcfValue }}<ccw-span v-if="size != 'lg'">&nbsp;</ccw-span>Billion</ccw-readout>
            <ccw-readout v-else-if="current_module == 2">${{ debtValue[0] }}<ccw-span>.</ccw-span>{{ debtValue[1] }}<ccw-span>Trillion</ccw-span></ccw-readout>
            <ccw-readout v-else>{{ indieValue }}<ccw-span v-if="size != 'lg'"> </ccw-span>KM²</ccw-readout>
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
      <ccw-div v-if="showChart">
        <ccw-flatten-header :size="size" v-if="flatten">
          <div>
          #FlattenThe<span>Climate</span>Curve
          <img v-if="/xl|lg/.test(size)" svg-inline src="./flatten_logo.svg">
          </div>
          <div>
            <span v-if="/xl|lg/.test(size)">A project of</span>
            <a href="https://climateclock.world" target="_blank">
              <img svg-inline src="./climateclock_logo.svg">
            </a>
          </div>
        </ccw-flatten-header>

        <ccw-chart-wrapper :class="{flatten: flatten}" id="ccw-chart-wrapper" :size="size">
          <ccw-div>
            <ccw-chart :height="650" 
              @newK="k = $event"
              :factorA="parseInt(A)" 
              :factorB="parseInt(B)"
              :size="size"
              ></ccw-chart>
          </ccw-div>
          <ccw-control-panel id="ccw-slider">
            <ccw-div>SIZE OF INVESTMENT</ccw-div>
            <ccw-slider>
              <input type="range" v-model="A" min="1" max="5">
              <ccw-div>
                <ccw-span v-for="(v, k) in action" :key="k">{{ v }}</ccw-span>
              </ccw-div>
            </ccw-slider>
            <ccw-div>SPEED OF ACTION</ccw-div>
            <ccw-slider>
              <input type="range" v-model="B" min="1" max="5">
              <ccw-div>
                <ccw-span v-for="(v, k) in investment" :key="k">{{ v }}</ccw-span>
              </ccw-div>
            </ccw-slider>
            <ccw-hr>Scenario</ccw-hr>
            <ccw-scenario>
              <ccw-div>
                <ccw-radio @click="setPreset('bad')">
                  <img svg-inline v-if="preset == 'bad'" src="./checked.svg">
                  <img svg-inline v-else src="./unchecked.svg">
                  <ccw-span class="ccw-bad" @click="setPreset('bad')">BUSINESS AS USUAL</ccw-span>
                </ccw-radio>
                <ccw-radio @click="setPreset('middle')">
                  <img svg-inline v-if="preset == 'middle'" src="./checked.svg">
                  <img svg-inline v-else src="./unchecked.svg">
                  <ccw-span class="ccw-middle" @click="setPreset('middle')">"MIDDLE GROUND"</ccw-span>
                </ccw-radio>
                <ccw-radio @click="setPreset('good')">
                  <img svg-inline v-if="preset == 'good'" src="./checked.svg">
                  <img svg-inline v-else src="./unchecked.svg">
                  <ccw-span class="ccw-good" @click="setPreset('good')">GREEN NEW DEAL</ccw-span>
                </ccw-radio>
              </ccw-div>

              <ccw-div class="ccw-text">
                <ccw-span>With the level of climate action you chose (<ccw-span>{{ action[A] }}</ccw-span> investment; with <ccw-span>{{ investment[B] }}</ccw-span> speed of action), the model suggests that {{ scenarios[preset] }}. If we shift our priorities now, we can change the future.</ccw-span>
                <ccw-span v-if="!flatten">Model derived from peer-reviewed science, including: <a href="https://www.ipcc.ch/sr15/chapter/spm/" target="_blank">IPCC 2018 special report on the impacts of global warming of 1.5 °C</a>; and “Emissions – the ‘business as usual’ story is misleading” in <a href="https://www.nature.com/articles/d41586-020-00177-3" target="_blank"><i>Nature</i>, Issue 577</a>, 618-620 (2020); Zeke Hausfather & Glen P. Peters.</ccw-span>
              </ccw-div>
            </ccw-scenario>
          </ccw-control-panel>
        </ccw-chart-wrapper>

        <ccw-flatten-footer v-if="flatten">
          <p>Conceptual model derived from peer-reviewed science, including: <a href="https://www.ipcc.ch/sr15/chapter/spm/" target="_blank">IPCC 2018 special report on the impacts of global warming of 1.5 °C</a>; and “Emissions – the ‘business as usual’ story is misleading” in <a href="https://www.nature.com/articles/d41586-020-00177-3" target="_blank"><i>Nature</i>, Issue 577</a>, 618-620 (2020); Zeke Hausfather & Glen P. Peters. Curves are smoothed to reflect broad trends in available data.</p>
          <p>This is a beta version of #FlattenTheClimateCurve ©2020. Tool designed by Gan Golan and Andrew Boyd; programming by Adrian Carpentər; video-explainer by Alex Cequea; science advising by Richard Heinberg (Senior Policy Analyst, Post-Carbon Institute) and Bill Becker (Executive Director, Presidential Climate Action Project); a project of <a href="https://climateclock.world" target="_blank">ClimateClock.world</a> and <a href="https://beautifultrouble.org" target="_blank">Beautiful Trouble</a>.</p>
          <p>This tool is free and available to the public under a creative commons license.</p>
          <iframe src="https://drive.google.com/file/d/1uXboC4JZHDLWqNE4zmGmmeGq7AoCbBjF/preview" width="400" height="225"></iframe>
        </ccw-flatten-footer>
      </ccw-div>
    </transition>
  </div>
</template>


<script>
//import VueRangeSlider from 'vue-range-slider'
import countdown from 'countdown'
import debounce from 'lodash.debounce'

// https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset
/*
let isDST = (d) => {
    let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) != d.getTimezoneOffset(); 
}
*/

export default {
  props: {
    bottom: {type: Boolean, default: false},
    lifeline: {type: String, default: null},
    flatten: {type: Boolean, default: false},
    module: {type: Number, default: null},
  },
  components: {
    // Lazy-load this component
    'ccw-chart': () => import(/* webpackChunkName: "flatten" */ './Chart.vue'),
  },
  data: () => ({
    // Component loading
    ready: false,

    // All clock action is invoked by changing this.now in an interval function
    now: null,

    // The computed feed
    feed: '',

    // Modules
    newsfeed: {},
    carbon: {},
    renewables: {},
    gcf: {},
    
    // Chart 
    A: 2, B: 2, k: 0, preset: 'bad',
    action: {1: 'zero', 2: 'low', 3: 'medium', 4: 'serious', 5: 'maximum'},
    investment: {1: 'zero', 2: 'small', 3: 'medium', 4: 'high', 5: 'maximum'},
    showChart: false,
    scenarios: {
      good: "average global surface temperature could skirt just under 1.5°C around 2040 and level off for the rest of the century, avoiding the worst climate impacts, and preserving a habitable planet for future generations.",
      middle: "average global surface temperature would likely reach ~2°C by 2100 with devastating (and permanent) impacts on humanity and the biosphere, including: floods, droughts, mass extinctions, 100s of millions of climate refugees, and millions dead. Crossing 1.5°C, we also risk triggering a series of catastrophic feedback loops that could spiral beyond our ability to ever remedy.",
      bad: "average global surface temperature would likely reach 3-4°C by 2100 with catastrophic (and permanent) impacts on humanity and the biosphere, including: floods, droughts, mass extinctions, permanently uninhabitable regions, billions of climate refugees, and 100s of millions dead. Civilization as we know it will no longer be possible.",
    },

    // To become a prop when the mockup is done
    dark: false,

    // Items below are skin/theme-specific (TODO: settle on defaults for all skins/themes)
    // Ascending sizes work like breakpoints, adding an html attribute to the container
    size: 'hide',
    sizes: [[0, 'hide'], [224, 'xs'], [320, 'sm'], [540, 'md'], [960, 'lg'], [1200, 'xl']], 
    lastSize: 0,
  }),
  computed: {
    remaining() {
      return countdown(this.deadline, this.now,
        countdown.YEARS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS)
    },
    // In a less quick-and-dirty version, a single rate calculation function would be called for each module value here
    renewableValue() {
      let tElapsed = this.now - (new Date(this.renewables.timestamp)).getTime()
      return (this.renewables.initial + (tElapsed / 1000 * this.renewables.rate)).toFixed(9)
    },
    gcfValue() {
      let tElapsed = this.now - (new Date(this.gcf.timestamp)).getTime()
      return (this.gcf.initial + (tElapsed / 1000 * this.gcf.rate)).toFixed(2)
    },
    indieValue() {
      let tElapsed = this.now - (new Date(this.indie.timestamp)).getTime()
      return ((this.indie.initial + (tElapsed / 1000 * this.indie.rate)) * 1e6).toLocaleString()
    },
    debtValue() {
      let tElapsed = this.now - (new Date(this.debt.timestamp)).getTime()
      let val = (this.debt.initial + (tElapsed / 1000 * this.debt.rate))
      return [parseInt(val), (val - parseInt(val)).toFixed(8).slice(2)]
    },
    current_module() {
      if (!this.now) {
        return false
      }
      if (this.module !== null) {
        return this.module
      }
      let x = this.now.getSeconds() % 30
      return x < 7 ? 0
           : x < 15 ? 1
           : x < 21 ? 2
           : 3
    },

    // Items below are skin/theme-specific
    animationDuration() {
      return {animationDuration: .15 * this.feedText.length + 's'}
    },
    feedText() {
      return (this.lifeline ? `${this.lifeline} | ` : '') + this.feed
    },

    // Chart thing
    scenarioText() {
      return this.scenarios[this.preset]
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
    handleClick() {
      if (!window.location.hostname.includes('climateclock.world')) {
        window.open('https://climateclock.world')
      } else {
        this.showChart = !this.showChart
      }
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
    this.$http.get('https://api.climateclock.world/v2/widget/clock.json').then(res => {
      let modules = res.data.data.modules
      this.carbon = modules.carbon_deadline_1
      this.renewables = modules.renewables_1
      this.newsfeed = modules.newsfeed_1
      this.gcf = modules.green_climate_fund_1
      this.indie = modules.indigenous_land_1
      this.debt = modules.loss_damage_g20_debt

      // Countdownjs has the annoying feature of introducing daylight savings
      // time to otherwise "pure" UTC timestamp comparisons, so we'll need to
      // get rid of that. For simplicity, I'm just "shoring up" the deadline,
      // making it slightly closer if we're in DST. This is NOT a complete and
      // proper way to calculate arbitrary timers in the past or future
      // between disparate states of DST-ness. If this widget is expanded to
      // cover the full ClimateClock spec including arbitrary timers, all
      // those cases should be addressed carefully. As it stands, adjusting 
      // the timestamp is already a little bit wrong. I believe, but have not
      // tested to prove, that if now is in DST and the timestamp is not, it's
      // more correct to adjust every "now" than to adjust the timestamp,
      // however I'm not going to write logic for all those cases when we have
      // one planet and one IPCC report and one deadline. If you think that's 
      // unreasonable, open a github issue or make a pull request! :)
      this.deadline = new Date(this.carbon.timestamp)
      // UGH. This issue needs revisiting after the IPCC AR6 update.
      /*
      if (isDST(new Date())) {
        this.deadline = this.deadline.setTime(this.deadline.getTime() + (60*60*1000))
      }
      */

      // Join all the news items into a convenient string
      this.feed = this.newsfeed.newsfeed.map(n => n.headline).join(' | ') + ' | '
    }).catch(err => { // eslint-disable-next-line
      console.log(err)
    })

    // Watch for container size changes and update sizing classes
    let resizeInterval = 100, tickInterval = 250
    if (this.$browserDetect.isEdge) { // Slow down for the special browser
      resizeInterval = 250
      tickInterval = 997
    }
    window.addEventListener('load', this.setSize)
    window.addEventListener('resize', this.resizeInterval ? debounce(this.setSize, resizeInterval) : this.setSize)
    setInterval(() => { this.now = new Date() }, tickInterval)

    if (this.flatten) {
      this.showChart = true
    }
  },
  watch: {
    k(newK) {
      this.preset = newK < 20 ? 'good' : (newK < 60 ? 'middle' : 'bad')
    },
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
    padding: 4px;
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

$accent: #eb1c23;
$accentDark: #940000;
$secondary: #4aa1cc;
$secondaryDark: #1362a1;

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
//$cubit: 7rem; 
$cubit: 112px;

ccw-w {
  cursor: pointer;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse; 
  justify-content: space-between;
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
    font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
  }

  height: $cubit;
  &[size="lg"] {
    font-size: 13.75px;
  }
  &[size="md"]{
    font-size: 14.25px;
    height: 2 * ($cubit - 24px);
    flex-direction: row; 
  }
  &[size="sm"] {
    font-size: 11px;
    height: 2 * ($cubit - 36px);
    flex-direction: row; 
  }
  &[size="xs"] {
    font-size: 7px;
    height: 2 * ($cubit - 56px);
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
  letter-spacing: -1px;

  flex: 1 0 49%; // 50% causes wrapping!
  overflow: hidden;

  height: $cubit - 24px;
  ccw-w[size="lg"] & {
    ccw-span {
      padding: $txtPad $txtPad * 2 - 4px;
    }
    >ccw-div >ccw-span:nth-of-type(1) {
      font-size: 16px;
    }
  }
  ccw-w[size="md"] & {
    height: $cubit - 36px;
    flex: 1 0 100%; // also ccw-ticker
    >ccw-div >ccw-span:nth-of-type(1) {
      font-size: 16px;
    }
  }
  ccw-w[size="sm"] & {
    height: $cubit - 48px;
    flex: 1 0 100%; // also ccw-ticker
    ccw-span {
      padding: $txtPad $txtPad * 2 - 4px;
    }
    >ccw-div >ccw-span:nth-of-type(1) {
      font-size: 13.5px;
    }
  }
  ccw-w[size="xs"] & {
    height: $cubit - 68px;
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
      flex: 0 1 48%;
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
  letter-spacing: -2px;
  line-height: 1.1;
  text-align: left;
  margin: 0 12px;
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
  height: 32px;
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
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-weight: bold;
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
    padding: 2.4px 8px;
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
  line-height: .85;
  width: 128px;
  background: black;
  color: $secondary;
  font-size: 14px;

  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;

  ccw-span {
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-weight: bold;
  }
  ccw-w[size="lg"] & {
    width: $cubit - 8px;
  }
  ccw-w[size="md"] & {
    width: $cubit - 16px;
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
    padding-top: 8px;
  }
}

#ccw-chart-wrapper { // Use id to increase specificity over cleanslate
  box-sizing: border-box;
  overflow: hidden;
  font-family: 'katwijk_monobold', 'Lucida Console', Monaco, monospace;
  font-weight: bold;
  text-align: left;
  border-bottom: 16px solid black;
  box-shadow: 0 10px 80px rgba(black, .1) inset;
  background: white;
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  &.flatten {
    border: none;
  }
  &[size="md"], &[size="sm"], &[size="xs"] {
    flex-direction: column; 
  }
  canvas {
    // Allows the text to go behind the graph
    background: rgba(0,0,0,0);
    position: relative;
  }
  a:link, a:visited, a:hover {
    color: #009dff;
    font-weight: bold;
    text-decoration: none;
  }
  > ccw-div {
    flex: 4 0 0;
    position: relative;
  }
  ccw-control-panel {
    flex: 3 0 0;
    display: block;
    padding: 16px 48px 32px 0;
    > ccw-div {
      font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
      font-weight: normal;
      font-size: 22px;
      text-align: center;
    }
    ccw-slider {
      margin-bottom: 16px;
      display: block;
      input[type="range"] {
        appearance: none;
        width: 100%;
        height: 16px;
        outline: none;
        margin: 16px 0;
        cursor: pointer;
        background: #bd8760;
        background: linear-gradient(90deg, rgba(241,101,33,1) 4%, rgba(255,255,255,0) 4.1%, rgba(255,255,255,0) 4.9%, rgba(255,0,0,1) 5%, rgba(255,0,0,1) 36%, rgba(255,255,255,0) 36.1%, rgba(255,255,255,0) 36.9%, rgba(189,135,96,1) 37%, rgba(189,135,96,1) 68%, rgba(255,255,255,0) 68.1%, rgba(255,255,255,0) 68.9%, rgba(0,221,114,1) 69%);
        &::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 48px;
          background: white;
          border: 2px solid black;
          cursor: pointer;
        }
        &::-moz-range-thumb {
          border-radius: 0;
          width: 24px;
          height: 48px;
          background: white;
          border: 2px solid black;
          cursor: pointer;
        }
      }
      ccw-div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        text-align: center;
        margin: 0 -10%;
        font-size: 14px;
        ccw-span {
          width: 20%;
        }
      }
    }
  }
  ccw-scenario {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    ccw-div:nth-of-type(1) {
      padding: 0 32px 16px 0;
      flex: 1 0 auto;
    }
    ccw-div:nth-of-type(2) {
      flex: 1 0 50%;
    }
    ccw-div {
      display: block;
    }
    .ccw-text ccw-span {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: normal;
      font-size: 14px;
      margin-bottom: 16px;
      ccw-span {
        font-weight: bold;
        font-size: 16px;
        margin: 0;
      }
    }
  }
  ccw-radio {
    cursor: pointer;
    font-size: 20px;
    display: block;
    margin: 8px 0;
    svg {
      max-width: 20px;
      max-height: 20px;
      margin-right: 8px;
    }
  }
  ccw-hr {
    text-transform: uppercase;
    font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
    font-weight: normal;
    font-size: 20px;
    display: flex;
    align-items: center;
    margin: 32px 0 16px 0;
    &::after {
      content: "";
      flex: 1 0 0;
      margin-left: 16px;
      border-bottom: 1px solid #666;
    }
  }
  &[size="md"], &[size="sm"], &[size="xs"] {
    ccw-control-panel {
      padding: 32px 48px;
    }
  }
}
.ccw-good { color: $secondary; }
.ccw-middle { color: #bd8760; }
.ccw-bad { color: $accent; }
.slide-enter-active {
   transition-duration: .2s;
}
.slide-leave-active {
   transition-duration: .2s;
}
.slide-enter-to, .slide-leave {
   max-height: 778px;
   overflow: hidden;
   opacity: 1;
}
ccw-chart-wrapper[size="xs"], ccw-chart-wrapper[size="sm"], ccw-chart-wrapper[size="md"] {
  &.slide-enter-to, &.slide-leave {
     max-height: 1600px; // slide height
     overflow: hidden;
     opacity: 1;
  }
}
.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
   opacity: 0;
}

ccw-flatten-header[size="lg"] div:first-of-type { font-size: 50px; }
ccw-flatten-header[size="md"] div:first-of-type { font-size: 35px; }
ccw-flatten-header[size="sm"] div:first-of-type { font-size: 20px; }
ccw-flatten-header[size="sm"] div:nth-of-type(2) svg { max-width: 48px; max-height: 48px; }
ccw-flatten-header[size="sm"] { padding-top: 0; }
ccw-flatten-header {
  padding-top: 32px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  div:first-of-type {
    font-size: 60px;
    color: #666;
    span {
      color: $secondary;
    }
    svg {
      margin-left: 16px
    }
  }
  div:nth-of-type(2) {
    svg {
      max-height: 96px;
      max-width: 96px;
      margin-left: 16px
    }
  }
  div {
    display: flex;
    align-items: center;
  }
  svg {
    max-height: 48px;
    max-width: 48px;
  }
}
ccw-flatten-footer {
  display: block;
  max-width: 800px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-size: 14px;
  padding: 16px 0 160px 0;
}
</style>
