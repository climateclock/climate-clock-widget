<template>
  <div id="climate-clock-widget" class="cleanslate">
    <div class="container">
      <div class="header">
        <div class="title"><span>CLIMATECLOCK.WORLD</span></div>
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
            {{ timeleft.years | plural('YEAR', 'S') }}
            {{ timeleft.days | plural('DAY', 'S') }} 
            {{ timeleft.hours | pad2 }}:{{ timeleft.minutes | pad2 }}:{{ timeleft.seconds | pad2 }}
          </span>
          <span class="hide-md hide-lg digits">
            {{ timeleft.years }}Y
            {{ timeleft.days }}D 
            {{ timeleft.hours | pad2 }}:{{ timeleft.minutes | pad2 }}:{{ timeleft.seconds | pad2 }}
          </span>
        </div>
      </div>
      <div class="lifeline">
        <div class="title"><span>LIFELINE</span></div>
        <div class="feed">
          <span class="lead">{{ feed }}&nbsp;</span>
          <span class="follow">{{ feed }}&nbsp;</span>
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
    feed: "4+ million take to the streets in global #climatestrike | Germany considering \"putting a price on carbon\" | Friday Sept. 20 - #climatestrike in 120+ countries |",
    startDateUTC: [2018, 1, 1, 0, 0, 0],
    // TODO: This clock synchronization will drift; update rate from IPCC data
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
    timeleft() {
      return this.countdown(this.deadline, this.now,
        this.countdown.YEARS | 
        this.countdown.DAYS | 
        this.countdown.HOURS | 
        this.countdown.MINUTES | 
        this.countdown.SECONDS)
    },
  },
  props: {
    size: {type: Number, default: 30},
  },
  filters: {
    pad2(n) { return ('00' + n).slice(-2) },
    plural(n, pre, suf) { return n > 1 ? `${n} ${pre + suf}` : `${n} ${pre}` },
  },
  methods: {
    imp(val) { return `${val}!important` },
    githubToJSON(res) { return JSON.parse(atob(res.data.content)) },
  },
  created() {
    this.usingNetworkData = false
    this.$http.get(this.githubUrl).then(res => {
      let d = this.githubToJSON(res)
      if (d.feed && d.startDateCO2Budget && d.startDateUTC && d.tonsPerSecond) {
        this.feed = d.feed
        this.startDateCO2Budget = d.startDateCO2Budget
        this.startDateUTC = d.startDateUTC
        this.tonsPerSecond = d.tonsPerSecond
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

// TODO: Get Gotham
@import url('https://fonts.googleapis.com/css?family=Raleway:600,800&display=swap');

$accent: #f51a25;
$secondary: #b0d155;
$dark: #231f20;
$light: #8c8d91;
$text: #080808;

$narrow: 5;
$wide: 11;
$short: 10;
$tall: 21;

$duration: 20s;

#climate-clock-widget {
  .hide-sm { @include breakpoint($sm) { display: none; } }
  .hide-md { @include breakpoint($md) { display: none; } }
  .hide-lg { @include breakpoint($lg) { display: none; } }

  span {
    text-align: center;
    letter-spacing: .04em;
    white-space: nowrap;
  }
  .digits {
    // Try to keep the numbers from skipping all over the place
    font-weight: bold;
    font-family: 'Gotham', Helvetica, Arial, sans-serif;
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
    @include breakpoint($sm) {
      letter-spacing: -.05em;
    }
  }
  .container { // Flex column of 3 rows
    height: 3.5em;
    display: flex;
    flex-direction: column;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Raleway', Helvetica, Arial, sans-serif;
    font-weight: 600;
    font-size: 30px;

    @include breakpoint($md) {
      font-size: 26px;
    }
    @include breakpoint($sm) {
      font-size: 20px;
      position: relative;
      &:before {
        content: "CLIMATECLOCK.WORLD";
        position: absolute;
        font-size: 50%;
        font-weight: 800;
        letter-spacing: .04em;
        bottom: -1.25em;
      }
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
    color: $light;
    flex: $tall 0 0;
  }
  .deadline {
    margin-bottom: .1em;
  }
  .header {
    flex: $short 0 0;
    font-size: 35%;
    background-color: $light;
    div {
      color: $dark;
      font-weight: 800;
    }
    .title {
      color: $dark;
      background-color: white;
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
    text-transform: none;
    .lead {
      position: absolute;
      transform: translateX(0%);
      animation: feed-lead $duration linear infinite;
    }
    .follow {
      position: absolute;
      transform: translateX(100%);
      animation: feed-follow $duration linear infinite;
    }
  }
  @keyframes feed-lead {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes feed-follow {
    0% { transform: translateX(100%); }
    100% { transform: translateX(0%); }
  }
  @supports (-ms-ime-align: auto) { // Come on IE
    .lifeline > div.feed {
      justify-content: flex-start;
      margin-top: .2em;
    }
  }
}
</style>
