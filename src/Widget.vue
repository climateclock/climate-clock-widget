<template>
  <div v-if="!($browserDetect.isIE && $browserDetect.meta.version < 10)" class="cleanslate">
    <!-- time/renewable -->
    <ccw-ixed v-if="showJW">
      <ccw-jw :size="size" :dark="dark" @click="showChart = !showChart">
        <ccw-brand adrian>
          <img v-if="roundEarth" svg-inline src="./earth-round.svg">
          <img v-if="!roundEarth" svg-inline src="./earth.svg">
          <span>Climate<span lifeline>Clock</span></span>
          <input type="button" :value="`${!showChart ? '🡻' : '🡹'}`">
        </ccw-brand>
        <ccw-flexwrap>
          <ccw-panel deadline>
            <ccw-div>
              <ccw-text>DEADLINE:</ccw-text>
              <ccw-ticker-wrap>
                <ccw-ticker-label solid>{{ actText }}</ccw-ticker-label>
              </ccw-ticker-wrap>
            </ccw-div>
            <ccw-numbers>{{ remaining.years }}<ccw-lb>Y</ccw-lb>{{ pad(remaining.days, 3) }}<ccw-lb>D</ccw-lb>{{ pad(remaining.hours, 2) }}<ccw-lb>H</ccw-lb>{{ pad(remaining.minutes, 2) }}<ccw-lb>M</ccw-lb>{{ pad(remaining.seconds, 2) }}<ccw-lb>S</ccw-lb>
            </ccw-numbers>
          </ccw-panel>
          <ccw-panel lifeline>
            <ccw-div>
              <ccw-text>LIFELINE:</ccw-text>
              <ccw-ticker-wrap>
                <ccw-ticker-label>{{ renewText }}</ccw-ticker-label>
                <ccw-ticker one :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
                <ccw-ticker two :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
              </ccw-ticker-wrap>
            </ccw-div>
            <ccw-numbers>{{ renewablePercent }}%</ccw-numbers>
          </ccw-panel>
        </ccw-flexwrap>
      </ccw-jw>
      <transition name="slide">
        <ccw-chart-wrapper v-if="showChart" id="ccw-chart-wrapper">
          <h1>#FLATTENTHECURVE</h1>
          <ccw-chart :width="chartWidth" :height="200" :factor="factor"></ccw-chart>
          <ccw-chart-control-panel>
            Scaling Factor
            <vue-slider 
              v-model="factor"
              :marks="true"
              :interval="10"
              :adsorb="true"
              ></vue-slider>
            <vue-slider 
              v-model="factor"
              :marks="true"
              :interval="10"
              :adsorb="true"
              :included="true"
              ></vue-slider>
          </ccw-chart-control-panel>
        </ccw-chart-wrapper>
      </transition>
    </ccw-ixed>
    <br><br>

    <ccw-jw v-if="showJW" size="md">
      <ccw-brand>
        <ccw-c>c</ccw-c>
        <ccw-c>C</ccw-c>
      </ccw-brand>
      <ccw-flexwrap>
        <ccw-panel deadline>
          <ccw-div>
            <ccw-text>DEADLINE:</ccw-text>
            <ccw-ticker-wrap>
              <ccw-ticker-label>{{ actText }}</ccw-ticker-label>
              <ccw-ticker one :style="animationDuration">{{ badFeed }}&nbsp;</ccw-ticker>
              <ccw-ticker two :style="animationDuration">{{ badFeed }}&nbsp;</ccw-ticker>
            </ccw-ticker-wrap>
          </ccw-div>
          <ccw-numbers>{{ remaining.years }}<ccw-lb>Y</ccw-lb>{{ pad(remaining.days, 3) }}<ccw-lb>D</ccw-lb>{{ pad(remaining.hours, 2) }}<ccw-lb>H</ccw-lb>{{ pad(remaining.minutes, 2) }}<ccw-lb>M</ccw-lb>{{ pad(remaining.seconds, 2) }}<ccw-lb>S</ccw-lb>
          </ccw-numbers>
        </ccw-panel>
        <ccw-panel lifeline>
          <ccw-div>
            <ccw-text>LIFELINE:</ccw-text>
            <ccw-ticker-wrap>
              <ccw-ticker-label>{{ renewText }}</ccw-ticker-label>
              <ccw-ticker one :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
              <ccw-ticker two :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
            </ccw-ticker-wrap>
          </ccw-div>
          <ccw-numbers>{{ renewablePercent }}%</ccw-numbers>
        </ccw-panel>
      </ccw-flexwrap>
    </ccw-jw>
    <ccw-jw v-if="showJW" limit size="md">
      <ccw-brand>
        <ccw-c>c</ccw-c>
        <ccw-c>C</ccw-c>
      </ccw-brand>
      <ccw-flexwrap>
        <ccw-panel deadline>
          <ccw-div>
            <ccw-text>DEADLINE:</ccw-text>
            <ccw-ticker-wrap>
              <ccw-ticker-label>{{ actText }}</ccw-ticker-label>
              <ccw-ticker one :style="animationDuration">{{ badFeed }}&nbsp;</ccw-ticker>
              <ccw-ticker two :style="animationDuration">{{ badFeed }}&nbsp;</ccw-ticker>
            </ccw-ticker-wrap>
          </ccw-div>
          <ccw-numbers>{{ remaining.years }}<ccw-lb>Y</ccw-lb>{{ pad(remaining.days, 3) }}<ccw-lb>D</ccw-lb>{{ pad(remaining.hours, 2) }}<ccw-lb>H</ccw-lb>{{ pad(remaining.minutes, 2) }}<ccw-lb>M</ccw-lb>{{ pad(remaining.seconds, 2) }}<ccw-lb>S</ccw-lb>
          </ccw-numbers>
        </ccw-panel>
        <ccw-panel lifeline>
          <ccw-div>
            <ccw-text>LIFELINE:</ccw-text>
            <ccw-ticker-wrap>
              <ccw-ticker-label>{{ renewText }}</ccw-ticker-label>
              <ccw-ticker one :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
              <ccw-ticker two :style="animationDuration">{{ feedText }}&nbsp;</ccw-ticker>
            </ccw-ticker-wrap>
          </ccw-div>
          <ccw-numbers>{{ renewablePercent }}%</ccw-numbers>
        </ccw-panel>
      </ccw-flexwrap>
    </ccw-jw>
    <ccw-container mockup
      v-if="showA"
      :size="size"
      :glow="glow">
      <ccw-row header>
        <ccw-label brand >Option A</ccw-label>
        <ccw-label time>TIME TO ACT</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock time>{{ clockText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
    </ccw-container>
    <p/><!-- time/renewable/feed -->
    <ccw-container mockup
      v-if="showB"
      :size="size"
      :glow="glow">
      <ccw-row header>
        <ccw-label brand >Option B</ccw-label>
        <ccw-label time>TIME TO ACT</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock time>{{ clockText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock feed>
          <ccw-feed one :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
    </ccw-container>
    <p/><!-- temp/renewable -->
    <ccw-container mockup
      v-if="showC"
      :size="size"
      :glow="glow">
      <ccw-row header>
        <ccw-label brand >Option C</ccw-label>
        <ccw-label time contenteditable>GLOBAL TEMPERATURE RISE</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock time>{{ tempIncrease | fixed(tempPlaces) }}°C {{ tempText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
    </ccw-container>
    <p/><!-- temp/renewable/feed -->
    <ccw-container mockup
      v-if="showD"
      :size="size"
      :glow="glow">
      <ccw-row header>
        <ccw-label brand >Option D</ccw-label>
        <ccw-label time contenteditable>GLOBAL TEMPERATURE RISE</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock time>{{ tempIncrease | fixed(tempPlaces) }}°C {{ tempText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock feed>
          <ccw-feed one :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
    </ccw-container>
    <p/><!-- feed/temp/renewable/feed -->
    <ccw-container mockup
      v-if="showE"
      :size="size"
      :glow="glow">
      <ccw-row header>
        <ccw-label brand >Option E</ccw-label>
        <ccw-label time contenteditable>&nbsp;</ccw-label>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock feed mockup>
          <ccw-feed one :style="animationDurationMockup">{{ badFeed }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDurationMockup">{{ badFeed }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock time>{{ tempIncrease | fixed(tempPlaces) }}°C {{ tempText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock feed>
          <ccw-feed one :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
    </ccw-container>
    <p/><!-- budget/time/renewable/feed -->
    <ccw-container 
      v-if="showF"
      :size="size"
      :glow="glow">
      <ccw-row header>
        <ccw-label brand >Option F</ccw-label>
        <ccw-label budget contenteditable>CARBON BUDGET REMAINING</ccw-label>
        <ccw-label time contenteditable>TIME TO ACT</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock budget>{{ budgetText }}</ccw-clock>
        <ccw-clock time>{{ clockText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock feed>
          <ccw-feed one :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
    </ccw-container>
    <p/><!-- temp/time/renewable/feed -->
    <ccw-container 
      v-if="showG"
      :size="size"
      :glow="glow">
      <ccw-row header>
        <ccw-label brand >Option G</ccw-label>
        <ccw-label budget contenteditable>GLOBAL TEMPERATURE RISE</ccw-label>
        <ccw-label time contenteditable>TIME TO ACT</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock budget>{{ tempIncrease | fixed(tempPlaces) }}°C</ccw-clock>
        <ccw-clock time>{{ clockText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock feed>
          <ccw-feed one :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
    </ccw-container>
    <ccw-control-panel>
      <h2>Experimental features</h2>
      <p>You are looking at an experimental, non-functioning CLIMATECLOCK widget. It is designed for testing the program code and does not depict accurate information.</p>
      <b>Show/Hide mockups: </b>
      <input type="checkbox" v-model="showJW"><label>JW23&nbsp;</label>
      <input type="checkbox" v-model="showA"><label>A&nbsp;</label>
      <input type="checkbox" v-model="showB"><label>B&nbsp;</label>
      <input type="checkbox" v-model="showC"><label>C&nbsp;</label>
      <input type="checkbox" v-model="showD"><label>D&nbsp;</label>
      <input type="checkbox" v-model="showE"><label>E&nbsp;</label>
      <input type="checkbox" v-model="showF"><label>F&nbsp;</label>
      <input type="checkbox" v-model="showG"><label>G&nbsp;</label>
      <hr>
      <h3>Josiah edition tunables!</h3>
      <input type="checkbox" v-model="roundEarth"><label>Round earth</label>
      <input type="checkbox" v-model="dark"><label>Dark</label>
      <h3>* Renewables decimal places {{renewPlaces}} –> {{ renewablePercent | fixed(renewPlaces) }}%</h3>
      <vue-slider 
        v-model="renewPlaces"
        :min="1"
        :max="15"
        :interval="1"
        ></vue-slider>
      <h3>* Time to act text –> {{ actText }}</h3>
      <input type="text" v-model="actText"/>
      <h3>* Renewable text –> {{ renewText }}</h3>
      <input type="text" v-model="renewText"/>
      <h3>* Lifeline feed (should be wide as widget)</h3>
      <textarea type="text" v-model="feed"></textarea>
      <hr>
      <h3>* Temperature increase per year {{ tempIncPerYear | fixed(3) }}°C ({{ .5 / tempIncPerYear | fixed(1) }} years from 2018 for .5°C increase)</h3>
      <vue-slider 
        v-model="tempIncPerYear"
        :min=".018"
        :max=".3"
        :interval=".0005"
        ></vue-slider>
      <h3>* Temperature decimal places {{ tempPlaces }} –> {{ tempIncrease | fixed(tempPlaces) }}°C</h3>
      <vue-slider 
        v-model="tempPlaces"
        :min="9"
        :max="20"
        :interval="1"
        ></vue-slider>
      <h3>* Temperature text (goes at the end, e.g. <input type="button" value="global temperature rise" @click="tempText = 'global temperature rise'"> <input type="button" value="global climate warming" @click="tempText = 'global climate warming'"> <input type="button" value="(blank)" @click="tempText = ''">) –> {{ tempText }}</h3>
      <input type="text" v-model="tempText"/>
      <hr>
      <!--
      <h3>* CO2 PPM Start value {{ ppmStart }}ppm</h3>
      <vue-slider 
        v-model="ppmStart"
        :min="375"
        :max="470"
        :interval="5"
        ></vue-slider>
      <h3>* CO2 PPM/yr {{ ppmIncrease | fixed(2) }}ppm</h3>
      <vue-slider 
        v-model="ppmIncrease"
        :min="0.85"
        :max="3.0"
        :interval=".01"
        ></vue-slider>
      <h3>* CO2 PPM decimal places {{ppmPlaces}} -> {{ ppmNow }}</h3>
      <vue-slider 
        v-model="ppmPlaces"
        :min="1"
        :max="15"
        :interval="1"
        ></vue-slider>
      <hr>
      -->
      <h3>* Deadline feed (should be wide as widget)</h3>
      <textarea type="text" v-model="badFeed"></textarea>
    </ccw-control-panel>
    <h1>The original "GAN TRON" widget, for reference</h1>
    <ccw-container
      :id="`ccw-container-${_uid}`"
      :size="size"
      :glow="true"
      :bottom="bottom">
      <ccw-row header>
        <ccw-label brand >CLIMATECLOCK.WORLD</ccw-label>
        <ccw-label budget>{{ budgetLabelText }}</ccw-label>
        <ccw-label time>TIME TO ACT</ccw-label>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>DEADLINE</ccw-clock>
        <ccw-clock budget>{{ budgetText }}</ccw-clock>
        <ccw-clock time>{{ clockText }}</ccw-clock>
      </ccw-row>
      <ccw-row deadline>
        <ccw-clock deadline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock budget>{{ tempIncrease | fixed(tempPlaces) }}°C</ccw-clock>
        <ccw-clock time>{{ ppmNow }} CO2 PPM</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock feed mockup>
          <ccw-feed one :style="animationDurationMockup">{{ badFeed }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDurationMockup">{{ badFeed }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>LIFELINE</ccw-clock>
        <ccw-clock renew>{{ renewablePercent | fixed(renewPlaces) }}% {{ renewText }}</ccw-clock>
      </ccw-row>
      <ccw-row lifeline>
        <ccw-clock lifeline contenteditable>&nbsp;</ccw-clock>
        <ccw-clock feed>
          <ccw-feed one :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
          <ccw-feed two :style="animationDuration">{{ feedText }}&nbsp;</ccw-feed>
        </ccw-clock>
      </ccw-row>
    </ccw-container>
  </div>
</template>


<script>
import countdown from 'countdown'
import debounce from 'lodash.debounce'

import Chart from './Chart.vue'

// Import defaults from json file to keep them in sync
import clock from './clock.json'


const SECONDS_PER_YEAR = 365.25 * 24 * 3600

export default {
  props: {
    glow: {type: Boolean, default: false},
    bottom: {type: Boolean, default: false},
    lifeline: {type: String, default: null},
  },
  components: {
    'ccw-chart': Chart,
  },
  data: () => ({
    githubUrl: 'https://api.github.com/repos/BeautifulTrouble/climate-clock-widget/contents/src/clock.json',
    now: null,
    ready: false,
    usingNetworkData: false,

    annualGrowth: clock.annualGrowth,
    feed: clock.feed,
    startDateUTC: clock.startDateUTC,
    startDateCO2Budget: clock.startDateCO2Budget,
    tonsPerSecond: clock.tonsPerSecond,
    
    // Items below are for experimental mockups
    tempPlaces: 15,
    tempIncStart: 1.0,
    tempIncPerYear: .05,
    tempStartDate: new Date(Date.UTC(2018, 0, 1, 0, 0, 0)),
    tempText: "global temperature rise",
    renewText: "global energy now renewable",
    actText: "how much time we have to act",
    renewPlaces: 9,
    renewStartDate: new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
    renewStartPct: 26.2,
    renewIncPerYear: (45 - 26.2)/(2040 - 2019), // Expected rise to 45% by 2040 w/26.2% by 2019
    ppmIncrease: 2.4,
    ppmStart: 410,
    ppmStartDate: new Date(),
    ppmPlaces: 8,
    badFeed: "AUS PM attempts to exploit loophole in Paris Agreement | Kenyan locusts find ideal conditions to hatch | US election could further delay climate goals |",
    showA: false, showB: false, showC: false, showD: false, showE: false, showF: false, showG: false,
    showJW: true, 
    showChart: false,
    roundEarth: false,
    dark: true,
    chartWidth: 0,
    factor: 100,

    // Items below are skin/theme-specific (TODO: settle on defaults for all skins/themes)
    // Ascending sizes work like breakpoints, adding an html attribute to the container
    size: 'hide',
    sizes: [[0, 'hide'], [224, 'xs'], [320, 'sm'], [540, 'md'], [960, 'lg'], [1200, 'xl']], 
  }),
  // Items below are for experimental mockups
  filters: {
    fixed(n, places) {
      return Number.parseFloat(n).toFixed(places)
    },
  },
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
      return countdown(this.deadline, this.now,
        countdown.YEARS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS )
    },
    
    // Items below are for experimental mockups
    tempIncPerSecond() {
      return this.tempIncPerYear / SECONDS_PER_YEAR
    },
    tempIncrease() {
      let tElapsed = this.now - this.tempStartDate.getTime()
      return this.tempIncStart + (tElapsed / 1000 * this.tempIncPerSecond)
    },
    renewIncPerSecond() {
      return this.renewIncPerYear / SECONDS_PER_YEAR
    },
    renewablePercent() {
      let tElapsed = this.now - this.renewStartDate.getTime()
      return (this.renewStartPct + (tElapsed / 1000 * this.renewIncPerSecond)).toFixed(this.renewPlaces)
    },
    ppmIncPerSecond() {
      return this.ppmIncrease / SECONDS_PER_YEAR
    },
    ppmNow() {
      let tElapsed = this.now - this.ppmStartDate.getTime()
      return (this.ppmStart + (tElapsed / 1000 * this.ppmIncPerSecond)).toFixed(this.ppmPlaces) 
    },

    // Items below are skin/theme-specific
    animationDuration() {
      return {animationDuration: .15 * this.feedText.length + 's'}
    },
    animationDurationMockup() {
      return {animationDuration: .15 * this.badFeed.length + 's'}
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
      let r = this.remaining, p = this.pad, pl = this.plural
      return /xs|sm|md/.test(this.size)
        ? `${r.years}Y ${r.days}D ${p(r.hours)}:${p(r.minutes)}:${p(r.seconds)}`
        : `${pl(r.years, 'YEAR', 'S')} ${pl(r.days, 'DAY', 'S')} ${p(r.hours)}:${p(r.minutes)}:${p(r.seconds)}`
    },
    // mockup
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
        this.ready = true

        // chart mockup
        //this.chartWidth = width
        this.chartWidth = document.getElementById('ccw-chart-wrapper').clientWidth
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
    let resizeInterval = 0, tickInterval = 100
    // mockup
    //let resizeInterval = 0, tickInterval = 97
    if (this.$browserDetect.isEdge) { // Slow down for the special browser
      resizeInterval = 250
      tickInterval = 250
    }
    window.addEventListener('load', this.setSize)
    window.addEventListener('resize', 
      this.resizeInterval ? debounce(this.setSize, resizeInterval) : this.setSize)
    setInterval(() => { this.now = new Date() }, tickInterval)
  },
  watch: {
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

// Don't mess up the control panel
//@import 'cleanslate';
@import 'scoreboard';
@import 'matthewha';

$accent: #ff0000;
$secondary: #00dd72;
$dark: #231f20;
$light: #8c8d91;

$narrow: 6;
$wide: 14;

@mixin glow($color) {
  font-weight: 400;
  color: lighten($color, 20%);
  text-shadow:  .5px  .5px .1em $color,
               -.5px -.5px .1em $color,
               -.5px  .5px .1em $color,
                .5px -.5px .1em $color;
}

// <ccw-jw>
ccw-fixed {
  position: fixed;
  bottom: 0; 
  left: 0; right: 0;
  z-index: 1000;
  box-shadow: 0 20px 30px rgba(black, 50%);
}
ccw-jw {
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse; 
  justify-content: space-between;
  font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
  font-size: 23px;
  //font-weight: 600;
  position: relative;
  width: 100%;
  white-space: nowrap;
  //padding-bottom: 1rem;

  *, *:before, *:after {
    box-sizing: inherit;
    display: inline-block;
    overflow: hidden;
    text-align: center;
  }
  &[size="lg"] {
    font-size: 20px;
  }
  &[size="md"]{
    font-size: 25px;
  }
  &[limit][size="md"]{
    max-width: 700px;
    font-size: 25px;
  }
  &[size="sm"] {
    font-size: 20px;
  }
  &[size="xs"] {
    font-size: 25px;
  }
  &[size="md"], &[size="sm"], &[size="xs"] {
    flex-direction: row; 
  }
}

$panelH: 8rem;

ccw-flexwrap {
  display: flex;
  flex-direction: row;
  flex: 10 0 0;
  width: 100%;
  height: $panelH;
  ccw-jw[size="md"] &, ccw-jw[size="sm"] &, ccw-jw[size="xs"] & {
    height: $panelH * 2;
    flex-direction: column;
  }

}
ccw-panel {
  height: 100%;
  flex: 1 0 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: .5rem .75rem;
  &[deadline] {
    background: $accent;
    ccw-jw[dark] & {
      color: $accent;
      background-color: black;
    }
  }
  &[lifeline] {
    background: $secondary;
    ccw-jw[dark] & {
      color: $secondary;
      background-color: black;
    }
  }
}
ccw-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1 0 0;
}
ccw-numbers {
  flex: 2 0 0;
  font-size: 72px;
  line-height: 1;
  text-align: left;
  &[size="md"] {
    font-size: 80px;
  }
}
ccw-lb {
  line-height: 1;
  margin-bottom: -6px;
  font-size: 35px;
}
ccw-ticker-wrap {
  position: relative;
  text-align: left;
  height: 100%;
  flex: 2 0 0;
  font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
  text-transform: uppercase;
  ccw-jw[dark] & {
    font-weight: 600;
  }
}
ccw-ticker {
  position: absolute;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  &[one] { animation-name: widget-feed-one; }
  &[two] { animation-name: widget-feed-two; }
}
ccw-ticker-label {
  position: absolute;
  z-index: 1;
  width: 100%;
  text-align: left;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-name: feed-fade;
  animation-duration: 10s;
  &[solid] {
    animation: none;
  }
  ccw-panel[deadline] & {
    ccw-jw[dark] & {
      color: $accent;
      background-color: black;
    }
    background-color: $accent;
  }
  ccw-panel[lifeline] & {
    ccw-jw[dark] & {
      color: $secondary;
      background-color: black;
    }
    background-color: $secondary;
  }
  ccw-panel:hover & {
    animation-name: none;
  }
}
@keyframes feed-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  30% { opacity: 0; }
  95% { opacity: 0; }
  100% { opacity: 1; }
}

ccw-text {
  flex: 1 0 1;
  padding-right: .5rem;
}
ccw-brand {
  font-family: 'folsomblack', 'Lucida Console', Monaco, monospace;
  font-size: 90px;
  line-height: .85;
  flex: 1.5 0 0;
  background: black;
  color: $secondary;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;

  &[adrian] {
    flex-direction: column;
    font-size: 10px;
    color: $accent;
    span[lifeline] {
      color: $secondary;
    }
  }
  ccw-c:first-of-type {
    color: $accent;
    margin-right: 7px;
  }
  ccw-jw[size="md"] &, ccw-jw[size="sm"] &, ccw-jw[size="xs"] & {
    ccw-c:first-of-type {
      margin-right: 0;
    }
    flex-direction: column;
    //flex: 2 0 0;
    min-width: 80px;
    //max-width: 80px;
    font-size: 5vw;
    svg {
      max-height: 100px;
    }
    span {
      display: none;
    }
  }
  input[type="button"] {
    position: absolute;
    bottom: 0rem;
    right: 0rem;
    cursor: pointer;
    z-index: 2001;

  }
  svg {
    outline: none;
    max-height: 80px;
    max-width: 80%;
    margin-bottom: 7px;
  }
}
ccw-chart-wrapper {
  $chartWidth: 1rem;

  font-family: 'katwijk_monolight', 'Lucida Console', Monaco, monospace;
  font-size: 23px;
  width: calc(100% - #{$chartWidth * 2});
  //border: $chartWidth solid lighten(black, 35%);
  padding: $chartWidth;

  box-shadow: 0 10px 80px rgba(black, .1) inset;
  display: block;
  background: lighten(black, 90%);
  border-bottom: 1rem solid black;
  position: relative;
  canvas {
    // Allows the text to go behind the graph
    background: rgba(0,0,0,0);
    position: relative;
  }
  h1 {
    font-family: 'katwijk_monoblack', 'Lucida Console', Monaco, monospace;
    font-weight: normal;
    text-align: center;
    left: 0;
    width: 100%;
    position: absolute;
    opacity: .1;
    font-size: 72px;
    margin-top: 1.3rem;
    //color: transparent;
    //text-shadow: 1px 3px 6px #ddd, 0 0 0 #000, 1px 3px 6px #ddd;
  }
}
ccw-chart-control-panel {
  font-weight: normal;
  padding: 0rem 3rem;
  display: block;
  .vue-slider {
    margin-bottom: 1.5rem;
  }
  .vue-slider-dot-handle, 
  .vue-slider-dot-handle::after,
  .vue-slider-dot-tooltip-inner,
  .vue-slider-mark-step,
  .vue-slider-process {
    background-color: $accent;
  }
  .vue-slider-dot-handle::after,
  .vue-slider-rail {
    background-color: rgba(lighten($accent, 35%), .5);
  }
}
.slide-enter-active {
   transition-duration: .2s;
   //transition-timing-function: ease-out;
}
.slide-leave-active {
   transition-duration: .2s;
   //transition-timing-function: ease-out; //cubic-bezier(0, 1, 0.5, 1);
}
.slide-enter-to, .slide-leave {
   max-height: 310px;
   overflow: hidden;
   opacity: 1;
}
.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
   opacity: 0;
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
  //margin-bottom: 1px;
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
    ccw-clock[mockup] {
      ccw-container[glow] & {
        @include glow(desaturate($accent, 50%))
      }
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
  ccw-container[size="lg"] & {
    flex: $narrow - 1 0 0;
  }
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
    ccw-container[size="lg"] & {
      flex: $wide - 2 0 0;
    }
    ccw-container[size="sm"] & {
      flex: $wide 0 0;
    }
  }
  &[time] { 
    flex: $wide + 1 0 0; 
    ccw-container[size="lg"] & {
      flex: $wide + 1 0 0;
    }
    ccw-container[size="md"] & {
      flex: $wide 0 0;
    }
    ccw-container[size="sm"] & {
      flex: $wide 0 0;
    }

    ccw-container[size="xl"][mockup] & {
      flex: $wide * 2 0 0
    }
    ccw-container[size="lg"][mockup] & {
      flex: $wide * 2 - 1 0 0;
    }
    ccw-container[size="md"][mockup] & {
      flex: $wide * 2 - 1 0 0;
    }
    ccw-container[size="sm"][mockup] & {
      flex: $wide * 2 0 0;
    }
    .two-column {
      flex: 30 0 0;
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
    ccw-container[size="lg"] & {
      flex: $wide * 2 - 1 0 0;
    }
    ccw-container[size="md"] & {
      flex: $wide * 2 - 1 0 0;
    }
  }
  // Mockup
  &[renew] {
    flex: $wide * 2 0 0;
    position: relative;
    text-align: center;
    ccw-container[size="lg"] & {
      flex: $wide * 2 - 1 0 0;
    }
    ccw-container[size="md"] & {
      flex: $wide * 2 - 1 0 0;
    }
  }
  &[feed][mockup] {
    color: $accent;
  }
  // mockup
  &[lifeline] {
    ccw-feed[one] {
      animation: widget-flicker 3s linear infinite;
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
  }
  // Mockup
  &[renew] {
    border-left: 1px solid $light;
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

p.mockup {
  margin: 2rem 0 0 0;
}
@import 'vue-slider-component/theme/material';
ccw-control-panel {
  background-color: #fff6cd;
  display: block;
  padding: 2rem;
  font-family: Helvetica, Arial, sans-serif;
  h2, h3 { 
    margin: .25rem 0; 
  }
  h3 {
    margin-top: 1rem;
  }
  hr {
    border-top: 5px dashed orange;
    margin: 2rem 0;
  }
  .vue-slider {
    max-width: 30rem;
  }
  textarea {
    width: 30rem;
    height: 5rem;
  }
}
</style>
