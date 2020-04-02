<script>
import { Line, mixins } from 'vue-chartjs'

// Automatically handles a prop called chartData
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
      title: {
        display: true,
        text: '#FLATTENTHECURVE ON CLIMATE',
        fontSize: 30,
      },
    },
  }),
  props: {
    //'options',
  },
  watch: {
    green() {

    }
  },
  methods: {
    fillData () {
      this.chartData = {
        labels: [this.getRandomInt(), this.getRandomInt(), 100, 200],
        datasets: [
          {
            label: 'Current Trajectory',
            backgroundColor: this.red,
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            borderColor: 'black',
          }, {
            label: 'Green New Deal',
            backgroundColor: this.green,
            //data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            data: [0, 20, 100, 30, 0],
            borderColor: 'black',
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * 100)
    },
  },
  mounted() {
    this.fillData()
    this.renderChart(this.chartData, this.options)
  },
}
</script>

<style>
</style>
