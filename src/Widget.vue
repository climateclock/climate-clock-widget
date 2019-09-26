<template>
  <div id="climate-clock-widget">
    <div :class="['container', glow ? 'glow' : null, bottom ? 'bottom' : null]">
      <div class="header">
        <div class="title" @click="etGoHome"><span>CLIMATECLOCK.WORLD</span></div>
        <div class="carbon">
          <span class="hide-sm">CARBON BUDGET REMAINING</span>
          <span class="hide-md hide-lg">CARBON BUDGET (TONS)</span>
        </div>
        <div class="time"><span>TIME TO ACT</span></div>
      </div>
      <div class="deadline">
        <div class="title"><span>DEADLINE</span></div>
        <div class="carbon">
          <span class="hide-sm digits">{{ Math.floor(CO2Budget).toLocaleString() }} TONS</span>
          <span class="hide-md hide-lg digits">{{ Math.floor(CO2Budget).toLocaleString() }}</span>
        </div>
        <div class="time">
          <span class="hide-sm digits">
            {{ remaining.years | plural('YEAR', 'S') }}
            {{ remaining.days | plural('DAY', 'S') }}
            {{ remaining.hours | pad2 }}:{{ remaining.minutes | pad2 }}:{{ remaining.seconds | pad2 }}
          </span>
          <span class="hide-md hide-lg digits">
            {{ remaining.years }}Y
            {{ remaining.days }}D
            {{ remaining.hours | pad2 }}:{{ remaining.minutes | pad2 }}:{{ remaining.seconds | pad2 }}
          </span>
        </div>
      </div>
      <div class="lifeline">
        <div class="title"><span>LIFELINE</span></div>
        <div class="feed" :style="$browserDetect.isIE ? {flexDirection: I('row'), marginTop: I('.2em')} : {}">
          <scrolling-feed class="lead" :style="animationDuration">{{ feedText }}&nbsp;</scrolling-feed>
          <scrolling-feed class="follow" :style="animationDuration">{{ feedText }}&nbsp;</scrolling-feed>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'climate-clock-widget',
  data: () => ({
    githubUrl: 'https://api.github.com/repos/BeautifulTrouble/climate-clock-widget/contents/src/clock.json',
    jsonUrl: 'https://cdn.jsdelivr.net/gh/BeautifulTrouble/climate-clock-widget/src/clock.json',
    now: null,
    usingNetworkData: false,
    // Defaults for clock.json data
    annualGrowth: 1,
    feed: "4+ million take to the streets in global #climatestrike | Germany considering \"putting a price on carbon\" | Friday Sept. 20 - #climatestrike in 120+ countries |",
    startDateUTC: [2018, 1, 1, 0, 0, 0],
    startDateCO2Budget: 420000000000 - 3521159000,
    tonsPerSecond: 1331,
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
    feedText() {
      return (this.lifeline ? `${this.lifeline} | ` : '') + this.feed
    },
    animationDuration() {
      return {animationDuration: .15 * this.feedText.length + 's'}
    },
  },
  props: {
    glow: {type: Boolean, default: false},
    bottom: {type: Boolean, default: false},
    lifeline: {type: String, default: null},
  },
  filters: {
    pad2(n) { return ('00' + n).slice(-2) },
    plural(n, pre, suf) { return n > 1 ? `${n} ${pre + suf}` : `${n} ${pre}` },
  },
  methods: {
    I(val) {
      return `${val}!important`
    },
    githubToJSON(res) {
      return JSON.parse(atob(res.data.content))
    },
    etGoHome() {
      window.location.hostname != 'climateclock.world' && window.open('https://climateclock.world')
    },
  },
  created() {
    this.usingNetworkData = false
    // Data is fetched from the network because browsers may cache the widget's script
    this.$http.get(this.githubUrl).then(res => {
      let d = this.githubToJSON(res)
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
// All styles are marked !important by postcss-importantly for use w/cleanslate, 
// an aggressive reset stylesheet designed for embedding external widgets.
@import 'cleanslate/cleanslate';

// Breakpoints
@import 'breakpoint-sass/stylesheets/_breakpoint';
$lg-width: 1280px;
$md-width: 960px;
$sm-width: 0px; // real min-width might be 480px
$lg: $lg-width;
$md: $md-width $lg-width - 1px;
$sm: $sm-width $md-width - 1px;
$upper: $md-width;
$lower: $sm-width $lg-width - 1px;

@import 'scoreboard';

$accent: #f51a25;
$secondary: #b0d155;
$dark: #231f20;
$light: #8c8d91;
$text: #080808;

$narrow: 6;
$wide: 14;
$short: 10;
$tall: 21;

$duration: 20s;

#climate-clock-widget {
  .hide-sm { @include breakpoint($sm) { display: none; } }
  .hide-md { @include breakpoint($md) { display: none; } }
  .hide-lg { @include breakpoint($lg) { display: none; } }

  box-sizing: border-box;
  *, *:before, *:after {
    box-sizing: inherit;
  }

  span, scrolling-feed {
    // <scrolling-feed> is used to avoid cleanslate's "transform: none !important"
    text-align: center;
    letter-spacing: .02em;
    white-space: nowrap;
  }
  scrolling-feed {
    padding-top: .05em;
    position: relative;
  }
  .digits {
    // Try to keep the numbers from skipping all over the place
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
    @include breakpoint($sm) {
      letter-spacing: -.05em;
    }
  }
  .container { // Flex column of 3 rows
    display: flex;
    flex-direction: column;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Scoreboard', 'Lucida Console', Monaco, monospace;
    font-weight: 600;
    font-size: 35px;

    @include breakpoint($md) {
      font-size: 30px;
    }
    @include breakpoint($sm) {
      font-size: 20px;
      position: relative;
      &:before {
        content: "CLIMATECLOCK.WORLD";
        font-family: Helvetica, Arial, sans-serif;
        position: absolute;
        color: rgba(0, 0, 0, .2);
        font-size: 50%;
        font-weight: 800;
        letter-spacing: .04em;
        bottom: -1.25em;
      }
    }
    &.glow {
      @mixin glow($color) {
        font-weight: 400;
        color: lighten($color, 20%);
        text-shadow:  .5px  .5px .1em $color,
                     -.5px -.5px .1em $color,
                     -.5px  .5px .1em $color,
                      .5px -.5px .1em $color;
      }
      scrolling-feed {
        @include glow($secondary);
      }
      .digits {
        @include glow($accent);
      }
      .deadline, .lifeline {
        .title span {
          @include glow(darken(white, 5%));
        }
      }
      .deadline .title span {
        animation: widget-flicker 3s linear infinite;
      }
      @keyframes widget-flicker {
        0%, 8% { opacity:0.1; }
        2%, 9%, 20%, 30% { opacity:1; }
        25%, 72% { opacity:0.8; }
        77%, 100% { opacity:.9; }
      }
    }
    &.bottom {
      background-color: white;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: 0 20px 30px rgba(black, 50%);
    }
  }
  .header, .deadline, .lifeline { // Flex rows of 3 items
    display: flex;
    flex-direction: row;
    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .deadline, .lifeline {
    background-color: $dark;
    color: lighten($light, 20%);
    flex: $tall 0 0;
  }
  .deadline {
    margin-bottom: .1em;
  }
  .header {
    flex: $short 0 0;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 35%;
    font-weight: 800;
    background-color: $light;
    > div {
      color: $dark;
      padding-top: .2em;
    }
    .title {
      color: $dark;
      background-color: white;
      cursor: pointer;
    }
    @include breakpoint($sm) {
      flex: $short + 5 0 0;
      font-size: 55%;
    }
  }
  .carbon, .time, .title, .feed {
    overflow: hidden;
  }
  .carbon, .time, .feed {
    border-left: 1px solid $light;
  }
  .carbon, .time {
    color: $accent;
  }
  .carbon {
    flex: $wide - 1 0 0;
    @include breakpoint($sm) {
      flex: $wide 0 0;
    }
  }
  .time {
    flex: $wide + 1 0 0;
    @include breakpoint($sm) {
      flex: $wide 0 0;
    }
  }
  .title {
    flex: $narrow 0 0;
    @include breakpoint($sm) {
      flex: 0 0 0;
    }
  }
  .feed {
    flex: $wide * 2 0 0;
    overflow: hidden;
    color: $secondary;
    position: relative;
    .lead {
      position: absolute;
      animation-name: widget-feed-lead;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .follow {
      position: absolute;
      animation-name: widget-feed-follow;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  }
  @keyframes widget-feed-lead {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-100%, 0); }
  }
  @keyframes widget-feed-follow {
    0% { transform: translate(100%, 0); }
    100% { transform: translate(0%, 0); }
  }
}
</style>
