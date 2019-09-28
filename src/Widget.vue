<template>
  <div v-if="!($browserDetect.isIE && $browserDetect.meta.version < 10)" class="cleanslate" v-cloak>
    <ccw-container
      @click="openHomepage"
      :id="`ccw-container-${_uid}`"
      :size="size"
      :glow="glow"
      :bottom="bottom">
      <ccw-row header>
        <ccw-label brand >CLIMATECLOCK.WORLD</ccw-label>
        <ccw-label budget>{{ budgetLabelText }}</ccw-label>
        <ccw-label time>TIME TO ACT</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline>DEADLINE</ccw-clock>
        <ccw-clock budget>{{ budgetText }}</ccw-clock>
        <ccw-clock time>{{ clockText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline>LIFELINE</ccw-clock>
        <ccw-clock feed>
          <ccw-feed one :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
    </ccw-container>
  </div>
</template>


<script>
export default {
  props: {
    glow: {type: Boolean, default: false},
    bottom: {type: Boolean, default: false},
    lifeline: {type: String, default: null},
  },
  data: () => ({
    githubUrl: 'https://api.github.com/repos/BeautifulTrouble/climate-clock-widget/contents/src/clock.json',
    now: null,
    usingNetworkData: false,

    // Defaults for clock.json data
    annualGrowth: 1,
    feed: "4+ million take to the streets in global #climatestrike | Germany considering \"putting a price on carbon\" | Friday Sept. 20 - #climatestrike in 120+ countries |",
    startDateUTC: [2018, 1, 1, 0, 0, 0],
    startDateCO2Budget: 420000000000 - 3521159000,
    tonsPerSecond: 1331,

    // Items below are skin/theme-specific (TODO: settle on defaults for all skins/themes)
    // Ascending sizes work like breakpoints, adding an html attribute to the container
    size: 'hide',
    sizes: [[0, 'hide'], [224, 'xs'], [320, 'sm'], [540, 'md'], [960, 'lg'], [1200, 'xl']], 
  }),
  computed: {
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
      return this.countdown(this.deadline, this.now, this.countdown.YEARS
        | this.countdown.DAYS | this.countdown.HOURS
        | this.countdown.MINUTES | this.countdown.SECONDS)
    },
    // Items below are skin/theme-specific
    animationDuration() {
      return {animationDuration: .15 * this.feedText.length + 's'}
    },
    budgetLabelText() {
      return 'CARBON BUDGET' 
        + (/xs|lg|xl/.test(this.size) ? ' REMAINING' : '') 
        + (/xs|sm|md/.test(this.size) ? ' (TONS)' : '')
    },
    budgetText() {
      return `${Math.floor(this.CO2Budget).toLocaleString()}${/xs|sm|md/.test(this.size) ? '' : ' TONS'}`
    },
    clockText() {
      let r = this.remaining, p2 = this.pad2, pl = this.plural
      return /xs|sm|md/.test(this.size)
        ? `${r.years}Y ${r.days}D ${p2(r.hours)}:${p2(r.minutes)}:${p2(r.seconds)}`
        : `${pl(r.years, 'YEAR', 'S')} ${pl(r.days, 'DAY', 'S')} ${p2(r.hours)}:${p2(r.minutes)}:${p2(r.seconds)}`
    },
    feedText() {
      return (this.lifeline ? `${this.lifeline} | ` : '') + this.feed
    },
  },
  methods: {
    setSize() {
      this.$nextTick(() => {
        let width = document.getElementById(`ccw-container-${this._uid}`).clientWidth
        for (let sz of this.sizes) {
          if (width < sz[0]) break
          this.size = sz[1]
        }
      })
    },
    // Items below are skin/theme-specific
    pad2(n) { 
      return ('00' + n).slice(-2) 
    },
    plural(n, pre, suf) { 
      return n > 1 ? `${n} ${pre + suf}` : `${n} ${pre}` 
    },
    openHomepage() {
      window.location.hostname != 'climateclock.world' && window.open('https://climateclock.world')
    },
    addBodyPadding() {
      this.$nextTick(() => {
        let pb = window.getComputedStyle(document.body).getPropertyValue('padding-bottom'),
            ch = document.getElementById(`ccw-container-${this._uid}`).clientHeight
        document.body.style.paddingBottom = `calc(${pb} + ${ch}px)`
      })
    },
  },
  created() {
    // Watch for container size changes and update sizing classes
    window.addEventListener('load', this.setSize)
    //window.addEventListener('resize', this.debounce(this.setSize, 50))
    window.addEventListener('resize', this.setSize)

    // Add padding for fixed widget
    this.bottom && window.addEventListener('load', this.addBodyPadding)

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

    // This produces a "tick" every 100ms which triggers computed properties
    setInterval(() => { this.now = new Date() }, 100)
  },
}
</script>


<style lang="scss">
@mixin debug($color, $text) {
  &:after {
    content: $text;
    position: absolute;
    bottom: 0; right: 0;
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
@import 'scoreboard';

$accent: #f51a25;
$secondary: #b0d155;
$dark: #231f20;
$light: #8c8d91;

$narrow: 6;
$wide: 14;

[v-cloak] {
  display: none;
}

@mixin glow($color) {
  font-weight: 400;
  color: lighten($color, 20%);
  text-shadow:  .5px  .5px .1em $color,
               -.5px -.5px .1em $color,
               -.5px  .5px .1em $color,
                .5px -.5px .1em $color;
}

// <ccw-container> is a column of 3 flex rows
ccw-container {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column; 
  font-family: 'Scoreboard', 'Lucida Console', Monaco, monospace;
  font-size: 37px;
  font-weight: 600;
  position: relative;
  width: 100%;
  white-space: nowrap;

  *, *:before, *:after {
    box-sizing: inherit;
    display: inline-block;
    overflow: hidden;
    text-align: center;
  }
  &[size="lg"] {
    font-size: 32px;
  }
  &[size="md"]{
    font-size: 25px;
  }
  &[size="sm"] {
    font-size: 20px;
    &:before {
      content: "CLIMATECLOCK.WORLD";
      font-family: Helvetica, Arial, sans-serif;
      position: absolute;
      color: rgba(0, 0, 0, .3);
      font-size: 50%;
      font-weight: 800;
      letter-spacing: .04em;
      bottom: -1.25em;
    }
  }
  &[size="xs"] {
    font-size: 25px;
    /*
    &:before {
      content: "CLIMATECLOCK.WORLD";
      font-family: Helvetica, Arial, sans-serif;
      position: absolute;
      color: rgba(0, 0, 0, .3);
      font-size: 50%;
      font-weight: 800;
      letter-spacing: .04em;
      bottom: -1.25em;
    }
    */
  }
  &[bottom] {
    background-color: $light;
    box-shadow: 0 20px 30px rgba(black, 50%);
    bottom: 0;
    left: 0; right: 0;
    max-width: 100vw;
    position: fixed;
    z-index: 10000;
  }
}

// <ccw-row>s are rows of 3 columns
ccw-row {
  background-color: $dark;
  display: flex;
  flex-direction: row;
  &[header] {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 35%;
    font-weight: 800;
    background-color: $light;
    ccw-label[brand] {
      background-color: white;
    }
    ccw-container[size="sm"] & {
      font-size: 50%;
    }
    ccw-label {
      padding-top: .2em;
    }
  }
  &[deadline] {
    color: $accent;
    margin-bottom: .07em;
    ccw-container[glow] & {
      @include glow($accent)
    }
    // This rule also needs the rule on ccw-label[budget]
    ccw-container[size="xs"] & {
      flex-direction: column;
      flex-wrap: wrap;
      height: 2em;
    }
  }
  &[lifeline] {
    color: $secondary;
    ccw-container[glow] & {
      @include glow($secondary)
    }
  }
  // Leave the container
  ccw-container[size="hide"] & {
    display: none;
  }
}

// I'm reluctant to overuse * selectors, but this is "ccw-row > *:first-child"
ccw-label[brand], ccw-clock[deadline], ccw-clock[lifeline] {
  flex: $narrow 0 0;
  ccw-container[size="md"] & {
    flex: $narrow + 1 0 0;
  }
  ccw-container[size="sm"] &, ccw-container[size="xs"] & {
    flex: 0 0 0;
    //display: none;
  }
}
ccw-label, ccw-clock {
  &[budget] { 
    flex: $wide - 1 0 0;
    ccw-container[size="sm"] & {
      flex: $wide 0 0;
    }
  }
  &[time] { 
    flex: $wide + 1 0 0; 
    ccw-container[size="md"] & {
      flex: $wide - 2 0 0;
    }
    ccw-container[size="sm"] & {
      flex: $wide 0 0;
    }
  }
}
ccw-label[time] {
  ccw-container[size="xs"] & {
    flex: 0 0 0;
  }
}
ccw-clock {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  letter-spacing: .02em;
  &[feed] {
    flex: $wide * 2 0 0;
    position: relative;
    text-align: left;
    ccw-feed {
      position: absolute;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      &[one] { animation-name: widget-feed-one; }
      &[two] { animation-name: widget-feed-two; }
    }
    ccw-container[size="md"] & {
      flex: $wide * 2 - 3 0 0;
    }
  }
  &[deadline] {
    ccw-container[glow] & {
      animation: widget-flicker 3s linear infinite;
    }
  }
  &[deadline], &[lifeline] {
    color: lighten($light, 20%);
    ccw-container[glow] & {
      @include glow(white)
    }
  }
  &[budget], &[time], &[feed] {
    border-left: 1px solid $light;
    ccw-container[bottom] & {
      border-left: none;
    }
  }
  &[budget], &[time] {
    ccw-container[size="xs"] & {
      flex: 1 0 50%; // basis is 50% of height (flex column)
    }
  }
  ccw-container[size="sm"] & {
    letter-spacing: -.02em;
  }
}

@keyframes widget-feed-one {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}
@keyframes widget-feed-two {
  0% { transform: translate(100%, 0); }
  100% { transform: translate(0%, 0); }
}
@keyframes widget-flicker {
  0%, 8% { opacity:0.1; }
  2%, 9%, 20%, 30% { opacity:1; }
  25%, 72% { opacity:0.8; }
  77%, 100% { opacity:.9; }
}
</style>
