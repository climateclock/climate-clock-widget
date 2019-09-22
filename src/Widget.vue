<template>
  <div id="climate-clock-widget" class="cleanslate">
    <div class="container" :style="{fontSize: imp(size + 'px')}">
      <div class="header" :style="{fontSize: imp('35%')}">
        <div class="title"><span>{{ content.header }}</span></div>
        <div class="carbon"><span>{{ content.header_carbon }}</span></div>
        <div class="time"><span>{{ content.header_time }}</span></div>
      </div>
      <div class="deadline">
        <div class="title"><span>{{ content.deadline }}</span></div>
        <div class="carbon"><span>{{ co2Budget.toLocaleString() }} TONS</span></div>
        <div class="time"><span>{{ years }} YEARS {{ days }} DAYS {{ hours | pad }}:{{ minutes | pad }}:{{ seconds | pad }}</span></div>
      </div>
      <div class="lifeline">
        <div class="title"><span>{{ content.lifeline }}</span></div>
        <div class="feed">
          <span class="lead">{{ content.feed }}&nbsp;</span>
          <span class="follow">{{ content.feed }}&nbsp;</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import content from './content.aml'
import countdown from 'countdown/countdown.js'

//const lifeline = '#b0d155'
//const deadline = '#c42a30'

export default {
  name: 'climate-clock-widget',
  data: () => ({
    content: content,
    tagline: 'this is the second line',
    time: '8 years',
    co2Budget: 420000000000,
    tonsPerSecond: 1332,
    startdate: new Date("Oct08, 2018 00:00:00"),
    deadline: new Date("Jun10, 2028 00:00:00"),
    interval: 100,
    years: null,
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  }),
  props: {
    size: {type: Number, default: 30},
  },
  filters: {
    pad(n) {
      return ('00' + n).slice(-2)
    }
  },
  methods: {
    imp(value) { 
      return value.toString() + '!important' 
    },
    updateClock() {
      let timeleft = countdown(this.deadline, new Date(),
        countdown.YEARS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS)
      this.seconds = timeleft.seconds
      this.minutes = timeleft.minutes
      this.hours = timeleft.hours
      this.days = timeleft.days
      this.years = timeleft.years
      this.co2Budget -= Math.floor(this.tonsPerSecond * (this.interval / 1000))
    }
  },
  created() {
    let now = (new Date()).getTime()
    let start = this.startdate.getTime()
    let seconds = Math.floor((now - start)/1000)
    this.co2Budget -= seconds * this.tonsPerSecond
    setInterval(() => this.updateClock(), this.interval)
  }
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
  .carbon, .time, .title {
    span {
      text-transform: uppercase;
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
