<template>
    <flatten-div v-if="showChart">
      <flatten-chart-wrapper :class="{flatten: flatten}" id="flatten-chart-wrapper" :size="size">
        <flatten-div>
          <flatten-chart :height="650" 
            @newK="k = $event"
            :factorA="parseInt(A)" 
            :factorB="parseInt(B)"
            :size="size"
            ></flatten-chart>
        </flatten-div>
        <flatten-control-panel id="flatten-slider">
          <flatten-div>SIZE OF INVESTMENT</flatten-div>
          <flatten-slider>
            <input type="range" v-model="A" min="1" max="5">
            <flatten-div>
              <flatten-span v-for="(v, k) in action" :key="k">{{ v }}</flatten-span>
            </flatten-div>
          </flatten-slider>
          <flatten-div>SPEED OF ACTION</flatten-div>
          <flatten-slider>
            <input type="range" v-model="B" min="1" max="5">
            <flatten-div>
              <flatten-span v-for="(v, k) in investment" :key="k">{{ v }}</flatten-span>
            </flatten-div>
          </flatten-slider>
          <flatten-hr>Scenario</flatten-hr>
          <flatten-scenario>
            <flatten-div>
              <flatten-radio @click="setPreset('bad')">
                <img svg-inline v-if="preset == 'bad'" src="./checked.svg">
                <img svg-inline v-else src="./unchecked.svg">
                <flatten-span class="flatten-bad" @click="setPreset('bad')">BUSINESS AS USUAL</flatten-span>
              </flatten-radio>
              <flatten-radio @click="setPreset('middle')">
                <img svg-inline v-if="preset == 'middle'" src="./checked.svg">
                <img svg-inline v-else src="./unchecked.svg">
                <flatten-span class="flatten-middle" @click="setPreset('middle')">"MIDDLE GROUND"</flatten-span>
              </flatten-radio>
              <flatten-radio @click="setPreset('good')">
                <img svg-inline v-if="preset == 'good'" src="./checked.svg">
                <img svg-inline v-else src="./unchecked.svg">
                <flatten-span class="flatten-good" @click="setPreset('good')">GREEN NEW DEAL</flatten-span>
              </flatten-radio>
            </flatten-div>

            <flatten-div class="flatten-text">
              <flatten-span>With the level of climate action you chose (<flatten-span>{{ action[A] }}</flatten-span> investment; with <flatten-span>{{ investment[B] }}</flatten-span> speed of action), the model suggests that {{ scenarios[preset] }}. If we shift our priorities now, we can change the future.</flatten-span>
              <flatten-span v-if="!flatten">Model derived from peer-reviewed science, including: <a href="https://www.ipcc.ch/sr15/chapter/spm/" target="_blank">IPCC 2018 special report on the impacts of global warming of 1.5 °C</a>; and “Emissions – the ‘business as usual’ story is misleading” in <a href="https://www.nature.com/articles/d41586-020-00177-3" target="_blank"><i>Nature</i>, Issue 577</a>, 618-620 (2020); Zeke Hausfather & Glen P. Peters.</flatten-span>
            </flatten-div>
          </flatten-scenario>
        </flatten-control-panel>
      </flatten-chart-wrapper>

    </flatten-div>
</template>


<script>
import Chart from './Chart.vue'

export default {
  components: {
    'flatten-chart': Chart,
  },
  data: () => ({
    now: null,
    flatten: true,
    
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

    // Items below are skin/theme-specific (TODO: settle on defaults for all skins/themes)
    // Ascending sizes work like breakpoints, adding an html attribute to the container
    size: 'hide',
    sizes: [[0, 'hide'], [224, 'xs'], [320, 'sm'], [540, 'md'], [960, 'lg'], [1200, 'xl']], 
    lastSize: 0,
  }),
  computed: {
    // Chart thing
    scenarioText() {
      return this.scenarios[this.preset]
    }, 
  },
  methods: {
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
    if (this.flatten) {
      this.showChart = true
    }
  },
  watch: {
    k(newK) {
      this.preset = newK < 20 ? 'good' : (newK < 60 ? 'middle' : 'bad')
    },
  },
}
</script>


<style lang="scss">
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

// <flatten-w>
flatten-fixed { // For "fixed" prop ;not yet used
  position: fixed;
  bottom: 0; 
  left: 0; right: 0;
  z-index: 1000;
  box-shadow: 0 20px 30px rgba(black, 50%);
}

flatten-div {
  display: block;
}
flatten-span {
  display: inline-block;
}

// An arbitrary measure which nevertheless gets used a lot (16 * 7 = 112)
//$cubit: 7rem; 
$cubit: 112px;

flatten-w {
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

flatten-flexwrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative; // <flatten-ticker> needs this, yeah?
  width: 100%;

  flex: 10 0 0;
}

// Used in deadline/lifeline headings and ticker
$txtPad: 5px;

flatten-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-transform: uppercase;
  color: black;
  letter-spacing: -1px;

  flex: 1 0 49%; // 50% causes wrapping!
  overflow: hidden;

  height: $cubit - 24px;
  flatten-w[size="lg"] & {
    flatten-span {
      padding: $txtPad $txtPad * 2 - 4px;
    }
    >flatten-div >flatten-span:nth-of-type(1) {
      font-size: 16px;
    }
  }
  flatten-w[size="md"] & {
    height: $cubit - 36px;
    flex: 1 0 100%; // also flatten-ticker
    >flatten-div >flatten-span:nth-of-type(1) {
      font-size: 16px;
    }
  }
  flatten-w[size="sm"] & {
    height: $cubit - 48px;
    flex: 1 0 100%; // also flatten-ticker
    flatten-span {
      padding: $txtPad $txtPad * 2 - 4px;
    }
    >flatten-div >flatten-span:nth-of-type(1) {
      font-size: 13.5px;
    }
  }
  flatten-w[size="xs"] & {
    height: $cubit - 68px;
    flex: 1 0 100%; // also flatten-ticker
    flatten-span {
      padding: $txtPad $txtPad;
    }
    >flatten-div >flatten-span:nth-of-type(1) {
      font-size: 9px;
    }
  }
  flatten-span {
    padding: $txtPad $txtPad * 2;
  }
  >flatten-div >flatten-span:nth-of-type(2) {
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-weight: bold;
  }
  &[deadline] {
    background: $accent;
    flatten-div {
      background: black;
      color: $accent;
    }
    flatten-span:first-of-type {
      background: $accent;
      color: black;
    }
    flatten-w[dark] & {
      color: $accent;
      background: $accentDark;
      flatten-span:first-of-type {
        background: $accentDark;
        color: $accent;
      }
    }
    flatten-w[size="lg"] & {
      flex: 0 1 48%;
    }
  }
  &[lifeline] {
    background: $secondary;
    flatten-div {
      background: black;
      color: $secondary;
    }
    flatten-span:first-of-type {
      background: $secondary;
      color: black;
    }
    flatten-w[dark] & {
      color: $secondary;
      background: $secondaryDark;
      flatten-span:first-of-type {
        background: $secondaryDark;
        color: $secondary;
      }
    }
    flatten-w[size="lg"] & {
      flex: 1 0 45%;
    }
  }
}

$ccwFont: 70px;
flatten-readout {
  flex: 2 0 0;
  font-size: 59px;
  letter-spacing: -2px;
  line-height: 1.1;
  text-align: left;
  margin: 0 12px;
  position: relative;
  overflow: hidden;
  flatten-w[size="lg"] & {
    line-height: 1.3;
    font-size: 50px;
  }
  flatten-w[size="md"] & {
    font-size: 50px;
  }
  flatten-w[size="sm"] & {
    font-size: 35px;
    line-height: 1.3;
  }
  flatten-w[size="xs"] & {
    font-size: 23px;
  }
  flatten-span { // Smaller labels
    line-height: 1;
    margin-bottom: -6px;
    margin-right: 2px;
    font-size: 27px;
    padding: 0;
    background: transparent;

    flatten-w[size="lg"] & {
      font-size: 21px;
      margin-bottom: -4px;
      padding: 0;
    }
    flatten-w[size="md"] & {
      font-size: 20px;
      margin-bottom: -5px;
      padding: 0;
    }
    flatten-w[size="sm"] & {
      font-size: 14px;
      margin-bottom: -3px;
      padding: 0;
    }
    flatten-w[size="xs"] & {
      font-size: 9px;
      margin-bottom: -3px;
      padding: 0;
    }
  }
}
flatten-ticker {
  position: relative;
  height: 32px;
  text-transform: uppercase;
  text-align: left;
  overflow: hidden;
  background: black;
  color: $secondary;
  flex: 2 0 100%;

  flatten-w[size="md"] & {
    flex: 1 0 100%; // also flatten-panel
  }
  flatten-w[size="sm"] & {
    flex: 1 0 100%; // also flatten-panel
  }
  flatten-w[size="xs"] & {
    flex: 1 0 100%; // also flatten-panel
  }
  flatten-div {
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-weight: bold;
    position: absolute;
    top: 1px;
    flatten-w[size="lg"] & {
      top: 3px;
    }
    flatten-w[size="md"] & {
      top: 2px;
    }
    flatten-w[size="sm"] & {
      top: 4px;
    }
    flatten-w[size="xs"] & {
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
flatten-brand {
  line-height: .85;
  width: 128px;
  background: black;
  color: $secondary;
  font-size: 14px;

  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;

  flatten-span {
    font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
    font-weight: bold;
  }
  flatten-w[size="lg"] & {
    width: $cubit - 8px;
  }
  flatten-w[size="md"] & {
    width: $cubit - 16px;
    flex-direction: column;
  }
  flatten-w[size="sm"] &, flatten-w[size="xs"] & {
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

#flatten-chart-wrapper { // Use id to increase specificity over cleanslate
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
  > flatten-div {
    flex: 4 0 0;
    position: relative;
  }
  flatten-control-panel {
    flex: 3 0 0;
    display: block;
    padding: 16px 48px 32px 0;
    > flatten-div {
      font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
      font-weight: normal;
      font-size: 22px;
      text-align: center;
    }
    flatten-slider {
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
      flatten-div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        text-align: center;
        margin: 0 -10%;
        font-size: 14px;
        flatten-span {
          width: 20%;
        }
      }
    }
  }
  flatten-scenario {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    flatten-div:nth-of-type(1) {
      padding: 0 32px 16px 0;
      flex: 1 0 auto;
    }
    flatten-div:nth-of-type(2) {
      flex: 1 0 50%;
    }
    flatten-div {
      display: block;
    }
    .flatten-text flatten-span {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: normal;
      font-size: 14px;
      margin-bottom: 16px;
      flatten-span {
        font-weight: bold;
        font-size: 16px;
        margin: 0;
      }
    }
  }
  flatten-radio {
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
  flatten-hr {
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
    flatten-control-panel {
      padding: 32px 48px;
    }
  }
}
.flatten-good { color: $secondary; }
.flatten-middle { color: #bd8760; }
.flatten-bad { color: $accent; }
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
flatten-chart-wrapper[size="xs"], flatten-chart-wrapper[size="sm"], flatten-chart-wrapper[size="md"] {
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

</style>
