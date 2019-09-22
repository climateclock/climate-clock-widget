<template>
  <div id="climate-clock-widget" class="cleanslate">
    <div class="container" :style="{fontSize: imp(size + 'px')}">
      <div class="header" :style="{fontSize: imp('35%')}">
        <div class="title"><span>CLIMATECLOCK.WORLD</span></div>
        <div class="carbon"><span>CARBON BUDGET REMAINING</span></div>
        <div class="time"><span>TIME TO ACT</span></div>
      </div>
      <div class="deadline">
        <div class="title"><span>DEADLINE</span></div>
        <div class="carbon"><span>{{ Math.floor(CO2Budget).toLocaleString() }} TONS</span></div>
        <div class="time">
          <span>
            {{ timeleft.years | plural('YEAR', 'S') }}
            {{ timeleft.days | plural('DAY', 'S') }} 
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
let jsonUrl = 'https://cdn.jsdelivr.net/gh/BeautifulTrouble/climate-clock-widget/src/clock.json'

export default {
  name: 'climate-clock-widget',
  data: () => ({
    now: null,
    usingNetworkData: false,
    // Defaults for clock.json data
    feed: "#climatestrike in over 150 countries engages over 4 million people for largest climate action to date",
    startDateUTC: [2018, 1, 1, 0, 0, 0],
    startDateCO2Budget: 420000000000,
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
  },
  created() {
    this.usingNetworkData = false
    this.$http.get(jsonUrl).then(res => {
      let d = res.data
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
  font-family: 'Raleway', Helvetica, Arial, sans-serif;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  span {
    text-align: center;
    letter-spacing: .04rem;
    white-space: nowrap;
  }
  .container {
    height: 105px;
    display: flex;
    flex-direction: column;
  }
  .header, .deadline, .lifeline {
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
    margin-bottom: .2rem;
  }
  .header {
    flex: $short 0 0;
    background-color: $light;
    div {
      color: $dark;
      font-weight: 800;
    }
    .title {
      color: $dark;
      background-color: white;
    }
  }
  .carbon, .time, .title, .feed {
    overflow: hidden;
  }
  .carbon, .time, .feed {
    border-left: 1px solid $light;
  }
  .carbon, .time {
    flex: $wide 0 0;
    color: $accent;
  }
  .title {
    flex: $narrow 0 0;
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
}
</style>
