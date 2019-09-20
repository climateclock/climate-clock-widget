<template>
  <div id="climate-clock-widget" class="cleanslate">
    <div ref="container" :style="{fontSize: imp(size + 'px')}">
      <h1 :style="{color: imp(deadline)}">CLIMATECLOCK</h1>
      <h1 :style="{color: imp(lifeline)}" @click="change">{{ tagline }}</h1>
    </div>
  </div>
</template>


<script>
import './content.aml'

const lifeline = '#b0d155'
const deadline = '#c42a30'

export default {
  name: 'climate-clock-widget',
  data: () => ({
    tagline: 'this is the second line',
  }),
  props: {
    deadline: {type: String, default: deadline},
    lifeline: {type: String, default: lifeline},
    size: {type: Number, default: 4},
  },
  methods: {
    imp(value) { 
      return value.toString() + '!important' 
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

$accent: #c42a30;
$dark: #231f20;
$light: #8d8c91;

#climate-clock-widget {
  h1 {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    padding: 0;
    background: $dark;
    font-size: 10em;
  }
}
</style>
