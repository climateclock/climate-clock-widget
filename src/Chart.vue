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
    height: 100,
    options: {
      responsive: true,
      title: {
        display: false,
        fontSize: 30,
        text: '#FLATTENTHECURVE ON CLIMATE',
        fontColor: 'black',
      },
      scales: {
        yAxes: [{
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
          ticks: {
            suggestedMin: 0, 
            suggestedMax: 10000,
            maxTicksLimit: 3,
          },
        }],
      },
      legend: {
        display: false,
      }
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
    green() {

    },
  },
  methods: {
    updateData() {
      this.chartData = {
        //labels: [...Array(6).keys()].map(i => (2020 + 2 * i)),
        labels: [2020, 2022, 2024, 2026, 2028, 2030],
        datasets: [
          {
            label: 'Green New Deal',
            backgroundColor: '#00dd77',
            //data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            data: [0, 20, 100, 30, 0],
            borderColor: '#00dd77',
          }, {
            label: 'Current Trajectory',
            backgroundColor: this.factor > 30 ? '#ff0000' : '#00dd77',
            //data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            data: [0 + this.factor, 20 + this.factor * this.factor, 100 + this.factor, 30, 0],
            borderColor: this.factor > 30 ? '#ff0000' : '#00dd77',
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
