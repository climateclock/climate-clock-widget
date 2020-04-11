<script>
import { Line, mixins } from 'vue-chartjs'

// Adds a watcher on chartData
const { reactiveData } = mixins


export default {
  mixins: [
    Line,
    reactiveData,
  ],
  data: () => ({
    renderTimeout: null,
    green: '#00dd72',
    red: '#ff0000',
    xLabels: [...Array(9).keys()].map(i => `${2020 + 10*i}?`),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      //responsiveAnimationDuration: 2000,
      title: {
        display: false,
      },
      scales: {
        yAxes: [{
          id: 'right-y-axis',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'CONSEQUENCES',
          },
          ticks: {
            min: 0,
            max: 105,
            maxTicksLimit: 2,
            //beginAtZero: true,
            callback: (value, index) => (['Worse', 'Better'][index]),
          },
          gridLines: {
            lineWidth: 1,
            zeroLineWidth: 1,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {left: 16, right: 16, top: 32, bottom: 16},
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
      elements: {
        line: {tension: .4},
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
    width() {
      // TODO: I'd love to debounce this with a timeout, but it doesn't seem to work.
      //if (this.renderTimeout) clearTimeout(this.renderTimeout)
      //this.renderTimeout = setTimeout(() => this.renderChart(this.chartData, this.options), 200)
      this.renderChart(this.chartData, this.options)
    },
  },
  methods: {
    updateData() {
      // Apply weights to the factors
      let wA = this.weightA
      let wB = this.weightB
      let k = (this.factorA * wA + this.factorB * wB)
      
      let curve = [...Array(8).keys()].map(x =>
        -Math.pow((x*10 / (4 + .05*k)) - 10 + .05*k, 2) + 100 - .75*k
      )
      let curve2 = [...Array(7).keys()].map(x =>
        -Math.pow((x*10 / (4 + .09*k)) - 10 + .04*k, 2) + 90 - .75*k
      )
      let curve3 = [...Array(7).keys()].map(x =>
        -Math.pow((x*8.9 / (4 + .13*k)) - 10 + .04*k, 2) + 90 - .75*k
      )

      this.chartData = {
        labels: this.xLabels,
        datasets: [
          {
            label: '1.5°C ceiling',
            data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            fill: false,
            borderColor: 'black',
            borderWidth: 2,
            pointStyle: 'dash',
            order: 4,
          }, {
            label: 'Another Metric',
            fill: false,
            data: curve2,
            borderColor: 'black',
            backgroundColor: 'red',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            borderDash: [10, 5],
            order: 1,
          }, {
            label: 'Another Metric',
            fill: false,
            data: curve3,
            borderColor: 'black',
            backgroundColor: 'red',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            borderDash: [10, 5],
            order: 2,
          }, {
            label: 'Big cost, emissions, etc.',
            borderWidth: 10,
            borderColor: k < 90 ? '#ff0000' : '#00dd77',
            backgroundColor: k < 90 ? '#ff0000' : '#00dd77',
            pointBorderColor: 'transparent',
            fill: false,
            data: curve,
            //data: [0, 0 + this.factorA, Math.pow(this.factorA, 2), 100 + this.factorA, 30, 0],
            //data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            yAxisID: 'right-y-axis',
            order: 3,
          }
        ]
      }
    },
  },
  mounted() {
    this.updateData()
    this.renderChart(this.chartData, this.options)
  },
}
</script>

<style lang="scss">

$accent: #ff0000;
$secondary: #00dd72;

</style>
