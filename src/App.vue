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
        <div class="carbon"><span>{{ tonnage }}</span></div>
        <div class="time"><span>{{ time }}</span></div>
      </div>
      <div class="lifeline">
        <div class="title"><span>{{ content.lifeline }}</span></div>
        <div class="feed"><span>{{ content.feed }}</span></div>
      </div>
      <!--
      <h1 :style="{color: imp(deadline)}">CLIMATECLOCK</h1>
      <h1 :style="{color: imp(lifeline)}" @click="change">{{ tagline }}</h1>
      -->
    </div>
  </div>
</template>


<script>
import content from './content.aml'

const lifeline = '#b0d155'
const deadline = '#c42a30'

export default {
  name: 'climate-clock-widget',
  data: () => ({
    content: content,
    tagline: 'this is the second line',
    tonnage: 'manny ton',
    time: '8 years',
  }),
  props: {
    deadline: {type: String, default: deadline},
    lifeline: {type: String, default: lifeline},
    size: {type: Number, default: 30},
  },
  methods: {
    imp(value) { 
      return value.toString() + '!important' 
    },
    smallFont() {
      return `${this.size * .3}px!important`
    },
    bigFont() {
      return this.size + 'px'
    },
    change() {
      this.tagline = 'clicked'
      setTimeout(this.reset, 1000)
    },
    reset() {
      this.tagline = 'the 2nd line'
    },
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

#climate-clock-widget {
  font-family: 'Raleway', Helvetica, Arial, sans-serif;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  div span {
    text-align: center;
    text-transform: uppercase;
    letter-spacing: .04rem;
  }
  .container {
    height: 105px;
    display: flex;
    flex-direction: column;
  }
  .header {
    flex: $short 0 0;
    > div {
      background-color: $light;
      color: $dark;
      > span {
        font-weight: 800;
      }
    }
    .title {
      color: $dark;
      background-color: white;
    }
  }
  .carbon, .time, .feed {
    border-left: 1px solid $light;
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
  .deadline {
    margin-bottom: .2rem;
  }
  .deadline, .lifeline {
    background-color: $dark;
    color: $light;
    flex: $tall 0 0;
  }
  .title {
    flex: $narrow 0 0;
  }
  .carbon, .time {
    flex: $wide 0 0;
    color: $accent;
  }
  .feed {
    flex: $wide * 2 0 0;
    overflow: hidden;
    color: $secondary;
  }
}
</style>
