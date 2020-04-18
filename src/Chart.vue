<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveData } = mixins

// These plugins seem to register themselves so we don't actually use the variables
// eslint-disable-next-line 
import ChartDataLabels from 'chartjs-plugin-datalabels'
// eslint-disable-next-line 
import ChartAnnotations from 'chartjs-plugin-annotation'

import { E, T } from './data'


export default {
  mixins: [
    Line,
    reactiveData,
  ],
  data: () => ({
    green: '#00dd72',
    ltGreen: '#80edbb',
    red: '#ff0000',
    ltRed: '#ff7f80',
    brown: '#bd8760',
    //brown: '#a16b4b',
    ltBrown: '#ceb5a4',

    nirvana: 50,
    nirvanaTimeout: null,
    xLabels: [...Array(13).keys()].map(i => `${1980 + 10*i}`),
    options: {
      elements: {
        line: {tension: .4},
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {left: 16, right: 48, top: 32, bottom: 16},
      },
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          offset: 0,
          color: 'black',
          font: {
            size: '22',
            family: 'katwijk_monoblack',
          },
          display: context => {
            return context.dataIndex == 9
          },
          formatter: (value, context) => {
            return [null, 'EMISSIONS', '', 'TEMPERATURE'][context.dataset.order]
          },
        },
      },
      annotation: { // Documentation shows this nested under plugins. THAT'S WRONG.
        drawTime: 'beforeDatasetsDraw',
        annotations: [{
          id: 'crossover',
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis',
          borderColor: '#666',
          borderWidth: 1,
          label: {
            backgroundColor: 'transparent',
            fontColor: '#666',
            enabled: true,
            position: 'top',
            xAdjust: -35,
          }
        }],
      },
      responsive: true,
      //responsiveAnimationDuration: 2000,
      scales: {
        yAxes: [{
          id: 'y-axis',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'CONSEQUENCES',
            fontFamily: 'katwijk_monoblack',
            fontSize: 14,
            fontColor: 'black',
          },
          ticks: {
            fontFamily: 'katwijk_monolight',
            fontSize: 14,
            fontColor: 'black',
            min: 0,
            max: 100,
            maxTicksLimit: 2,
            callback: (value, index) => (['Worse', 'Better'][index]),
          },
          gridLines: {
            lineWidth: 1,
            zeroLineWidth: 1,
            drawBorder: false,
          },
        }],
        xAxes: [{
          id: 'x-axis',
          // Implied by the xLabels in the data
          //type: 'category',
          position: 'bottom',
          scaleLabel: {
            display: false,
          },
          ticks: {
            fontFamily: 'katwijk_monolight',
            fontSize: 14,
            fontColor: 'black',
          },
          gridLines: {
            lineWidth: 1,
            zeroLineWidth: 1,
            drawBorder: false,
          },
        }],
      },
      title: {
        display: false,
      },
      tooltips: {
        titleFontSize: 20,
        titleFontFamily: 'katwijk_monolight',
        bodyFontSize: 14,
        bodyFontFamily: 'katwijk_monolight',
        //position: 'nearest',
        mode: 'nearest', // Show a tooltip no matter what you're pointing at
        intersect: false,
        // Exclude 1.5°C line from tooltip
        filter: tooltip => tooltip.datasetIndex != 0,
      },
    },
  }),
  props: {
    factorA: {type: Number, default: 0},
    factorB: {type: Number, default: 0},
    weightA: {type: Number, default: 0},
    weightB: {type: Number, default: 0},
  },
  watch: {
    factorA() { this.updateData() },
    factorB() { this.updateData() },
    weightA() { this.updateData() },
    weightB() { this.updateData() },
    nirvana(newVal) {
      if (this.nirvanaTimeout !== null) clearTimeout(this.nirvanaTimeout)
      this.nirvanaTimeout = setTimeout(() => {
        console.log('nirvana changed')
        clearTimeout(this.nirvanaTimeout)
        this.$data._chart.annotation.elements['crossover'].options.value = parseFloat(newVal)
        this.$data._chart.annotation.elements['crossover'].options.label.content = `${newVal * 10} years`
        this.$data._chart.update() 
      }, 500)
    },
  },
  methods: {
    color(k, bold = true) {
      if (bold)
        return k > 90 ? this.green : (k > 40 ? this.brown : this.red)
      return k > 90 ? this.ltGreen : (k > 40 ? this.ltBrown : this.ltRed)
    },
    getAlignmentOptions() {
      // Configuration junk: { axisSide, paddingRight, paddingLeft }
      if (/xs|sm|md/.test(this.size)) {
        return ['right', 0, 32]
      } else {
        return ['left', 16, 0]
      }
    },
    updateData() {
      // Apply weights to the factors
      let wA = this.weightA
      let wB = this.weightB
      let k = 100 - Math.max((this.factorA * wA + this.factorB * wB), 1)
      console.log(k, Math.round(k/10), Math.floor(k/10), Math.ceil(k/10))
      console.log(E[k])

      this.chartData = {
        xLabels: this.xLabels,
        datasets: [
          {
            label: '1.5°C ceiling',
            data: [17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17],
            fill: false,
            borderColor: this.ltRed,
            borderWidth: 2,
            pointStyle: 'dash',
            order: 2,
          },
          {
            label: 'Emissions',
            borderWidth: 6,
            borderCapStyle: 'round',
            borderColor: this.color(k),
            backgroundColor: this.color(k),
            pointBorderColor: 'transparent',
            pointStyle: 'dash',
            clip: 0,
            fill: false,
            data: E[k],
            order: 1,
          },
          {
            label: 'Temperature',
            borderWidth: 14,
            borderCapStyle: 'round',
            borderColor: this.color(k, false),
            backgroundColor: this.color(k, false),
            pointBorderColor: 'transparent',
            pointStyle: 'dash',
            fill: false,
            clip: 0,
            data: T[k],
            order: 3,
          },
        ]
      }

      // Kludge the point of no return line
      this.$nextTick(() => {
        this.nirvana = Math.min((100 - k) / 5, 20) 
      })
    },
  },
  mounted() {
    this.updateData()
    this.renderChart(this.chartData, this.options)
  },
}
</script>

<style lang="scss">
</style>
