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
    green: '#00dd72',
    red: '#ff0000',
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
            suggestedMin: 0, 
            suggestedMax: 100,
            maxTicksLimit: 2,
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
        padding: {left: 0, right: 0, top: 0, bottom: 0},
      },
      tooltips: {
        titleFontSize: 20,
        titleFontFamily: 'katwijk_monolight',
        bodyFontSize: 14,
        bodyFontFamily: 'katwijk_monolight',
        position: 'average',
        mode: 'index',
        intersect: false,
      },
      elements: {
        line: {tension: .4},
      },
    },
  }),
  props: {
    //'options',
    factor: {type: Number, default: 1},
  },
  watch: {
    factor() {
      this.updateData()
    },
    width() {
      this.updateData()
    },
  },
  computed: {
    actualChartWidth() {
      return this.width - 95
    }
  },
  methods: {
    updateData() {
      this.chartData = {
        //labels: [...Array(6).keys()].map(i => (2020 + 2 * i)),
        labels: [2020, 2022, 2024, 2026, 2028, 2030],
        datasets: [
          {
            label: 'Clipped thing',
            fill: false,
            data: [0, 0 + this.factor * 2, 20 + this.factor * (this.factor / 4), 100 + this.factor, 30, 0],
            //data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            borderColor: 'black',
            borderDash: [10, 5],
            clip: {left: false, top: false, right: this.actualChartWidth * -.4, bottom: false}
          }, {
            label: 'Green New Deal',
            backgroundColor: '#00dd77',
            data: [0, 0 + this.factor * 2, 20 + this.factor * (this.factor / 4), 100 + this.factor, 30, 0],
            //data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            borderColor: '#00dd77',
          }, {
            label: 'Current Trajectory',
            backgroundColor: this.factor > 50 ? '#ff0000' : '#00dd77',
            data: [0, 0 + this.factor, Math.pow(this.factor, 2), 100 + this.factor, 30, 0],
            //data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            borderColor: this.factor > 50 ? '#ff0000' : '#00dd77',
            yAxisID: 'right-y-axis',
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * 100)
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
