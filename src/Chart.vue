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
    ltGreen: '#b1f7d7',
    red: '#ff0000',
    ltRed: '#ffb9b9',
    brown: '#bd8760',
    ltBrown: '#f0d7c7',

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
            return [null, 'EMISSIONS', 'TEMPERATURE'][context.dataset.order]
          },
        },
      },
      annotation: { // Documentation shows this nested under plugins. THAT'S WRONG.
        drawTime: 'afterDatasetsDraw',
        annotations: [{
          id: 'zero',
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis',
          borderColor: '#666',
          borderWidth: 1,
          label: {
            backgroundColor: 'transparent',
            fontColor: '#666',
            fontFamily: 'katwijk_monolight',
            enabled: true,
            position: 'top',
            xAdjust: -35,
          }
        }, {
          id: 'temperature',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis',
          borderColor: 'black',
          borderWidth: 1,
          borderDash: [6, 6],
          value: 34,
          label: {
            content: 'Global Temperature Rise',
            backgroundColor: 'transparent',
            fontColor: '#666',
            fontFamily: 'katwijk_monolight',
            enabled: true,
            position: 'right',
            yAdjust: 10,
          }
        }, {
          id: 'temperature_label',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis',
          borderColor: 'transparent',
          borderWidth: 0,
          value: 34,
          label: {
            content: '1.5°C',
            backgroundColor: 'transparent',
            fontColor: 'black',
            fontSize: 21,
            fontStyle: 'normal',
            fontFamily: 'katwijk_monoblack',
            enabled: true,
            position: 'right',
            yAdjust: -12,
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
            labelString: 'RISKS',
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
            //callback: (value, index) => (['Worse', 'Better'][index]),
            callback: (value, index) => (['', ''][index]),
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
        callbacks: {
          label: (item, data) => {
            if (item.datasetIndex == 1) {
              return `+${(item.yLabel / 22.222).toString().slice(0,4)}°C`
            }
          },
        },
      },
    },
    action: {0:'zero', 25:'small', 50:'medium', 75:'high', 100:'maximum'},
    investment: {0:'zero', 25:'low', 50:'medium', 75:'serious', 100:'maximum'},
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
        clearTimeout(this.nirvanaTimeout)
        this.$data._chart.annotation.elements['zero'].options.value = parseFloat(newVal)
        this.$data._chart.annotation.elements['zero'].options.label.content = `${newVal * 10} years`
        this.$data._chart.update() 
      }, 500)
    },
  },
  methods: {
    color(k, bold = true) {
      if (bold)
        return k > 50 ? this.red : (k > 20 ? this.brown : this.green)
      return k > 50 ? this.ltRed : (k > 20 ? this.ltBrown : this.ltGreen)
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
      let A = {1: 0, 2: 25, 3: 50, 4: 75, 5: 100}[this.factorA]
      let B = {1: 0, 2: 25, 3: 50, 4: 75, 5: 100}[this.factorB]
      let k = 100 - Math.max((A * wA + B * wB), 1)

      /*
      for (let value, i of E[k]) {
        console.log(value, i)
      }
      */

      this.chartData = {
        xLabels: this.xLabels,
        datasets: [
          {
            label: 'Emissions',
            borderWidth: 14,
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
            borderWidth: 32,
            borderCapStyle: 'round',
            borderColor: this.color(k, false),
            backgroundColor: this.color(k, false),
            pointBorderColor: 'transparent',
            pointStyle: 'dash',
            fill: false,
            clip: 0,
            data: T[k],
            order: 2,
          },
        ]
      }

      // Kludge the no emissions line
      /*
      this.$nextTick(() => {
        this.nirvana = k < 10 ? 7.5 : 50
      })
      */
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
