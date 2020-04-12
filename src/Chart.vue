<script>
import { Line, mixins } from 'vue-chartjs'
// This plugin seems to register itself so we don't actually use the variable
// eslint-disable-next-line 
import ChartDataLabels from 'chartjs-plugin-datalabels'


// Adds a watcher on chartData
const { reactiveData } = mixins

// Baked-in goodness
const E = [[2.0, 7.3, 16.2, 28.5, 41.4, 52.3, 60.4, 65.7, 68.7, 69.5, 68.8, 66.6, 62.2, 55.2, 45.5, 32.9, 19.5, 7.0, 0.5], [2.0, 7.2, 15.28, 26.28, 37.82, 47.699999999999996, 55.26, 60.24, 63.02, 63.4, 61.94, 58.58, 52.900000000000006, 44.42, 32.8, 20.72, 8.0, -4.0, -11.200000000000001], [2.0, 7.1, 14.36, 24.06, 34.239999999999995, 43.099999999999994, 50.12, 54.78, 57.34, 57.3, 55.08, 50.559999999999995, 43.6, 33.64, 20.099999999999998, 8.54, -3.5, -15.0, -22.900000000000002], [2.0, 7.0, 13.44, 21.84, 30.66, 38.5, 44.980000000000004, 49.32, 51.66, 51.2, 48.22, 42.54, 34.300000000000004, 22.86, 7.399999999999999, -3.6400000000000006, -15.0, -26.0, -34.6], [2.0, 6.8999999999999995, 12.52, 19.619999999999997, 27.08, 33.9, 39.84, 43.86, 45.98, 45.099999999999994, 41.36, 34.519999999999996, 25.0, 12.079999999999998, -5.300000000000004, -15.82, -26.5, -37.0, -46.300000000000004], [2.0, 6.8, 11.6, 17.4, 23.5, 29.3, 34.7, 38.4, 40.3, 39.0, 34.5, 26.5, 15.7, 1.3, -18.0, -28.0, -38.0, -48.0, -58.0], [2.0, 6.22, 10.56, 15.599999999999998, 20.66, 25.08, 28.46, 29.759999999999998, 29.239999999999995, 25.2, 18.6, 9.2, -3.4400000000000013, -18.96, -38.400000000000006, -52.400000000000006, -66.4, -82.4, -96.4], [2.0, 5.64, 9.52, 13.799999999999999, 17.82, 20.86, 22.22, 21.12, 18.179999999999996, 11.399999999999999, 2.6999999999999993, -8.100000000000001, -22.580000000000002, -39.220000000000006, -58.800000000000004, -76.80000000000001, -94.80000000000001, -116.8, -134.8], [2.0, 5.06, 8.48, 12.0, 14.98, 16.64, 15.98, 12.48, 7.119999999999997, -2.3999999999999986, -13.199999999999996, -25.4, -41.72, -59.48, -79.19999999999999, -101.2, -123.2, -151.2, -173.2], [2.0, 4.48, 7.44, 10.2, 12.14, 12.419999999999998, 9.739999999999998, 3.8400000000000034, -3.940000000000005, -16.200000000000003, -29.1, -42.7, -60.86, -79.74000000000001, -99.60000000000001, -125.60000000000001, -151.60000000000002, -185.6, -211.60000000000002], [2.0, 3.9, 6.4, 8.4, 9.3, 8.2, 3.5, -4.8, -15.0, -30.0, -45.0, -60.0, -80.0, -100.0, -120.0, -150.0, -180.0, -220.0, -250.0]]
const T = [[4.8, 9.3, 16.3, 31.9, 46.6, 58.4, 67.2, 73.5, 78.8, 82.7, 86.1, 89.0, 90.7, 91.6, 92.6, 92.7, 92.6, 92.1, 90.8], [4.8, 8.96, 15.540000000000001, 29.799999999999997, 43.17, 53.9, 61.88, 67.63, 72.41, 75.95, 79.05, 81.66, 83.2, 84.00999999999999, 84.89999999999999, 84.97, 84.86999999999999, 84.39999999999999, 83.2], [4.8, 8.620000000000001, 14.780000000000001, 27.7, 39.74, 49.4, 56.56, 61.76, 66.02, 69.2, 72.0, 74.32, 75.7, 76.41999999999999, 77.19999999999999, 77.24000000000001, 77.13999999999999, 76.69999999999999, 75.6], [4.8, 8.280000000000001, 14.02, 25.599999999999998, 36.31, 44.9, 51.24, 55.89, 59.629999999999995, 62.45, 64.94999999999999, 66.98, 68.2, 68.83, 69.5, 69.51, 69.41, 69.0, 68.0], [4.8, 7.94, 13.26, 23.5, 32.88, 40.4, 45.92, 50.019999999999996, 53.239999999999995, 55.7, 57.89999999999999, 59.64, 60.7, 61.239999999999995, 61.8, 61.78, 61.67999999999999, 61.3, 60.39999999999999], [4.8, 7.6000000000000005, 12.5, 21.4, 29.450000000000003, 35.9, 40.6, 44.15, 46.849999999999994, 48.95, 50.849999999999994, 52.3, 53.2, 53.65, 54.099999999999994, 54.050000000000004, 53.949999999999996, 53.599999999999994, 52.8], [4.8, 7.260000000000001, 11.74, 19.299999999999997, 26.020000000000003, 31.4, 35.28, 38.28, 40.46, 42.2, 43.8, 44.96, 45.7, 46.06, 46.4, 46.32000000000001, 46.22, 45.9, 45.199999999999996], [4.8, 6.920000000000001, 10.98, 17.2, 22.590000000000003, 26.900000000000002, 29.96, 32.410000000000004, 34.07, 35.45, 36.75, 37.62, 38.2, 38.470000000000006, 38.699999999999996, 38.59000000000001, 38.49, 38.199999999999996, 37.6], [4.8, 6.58, 10.219999999999999, 15.099999999999998, 19.160000000000004, 22.4, 24.64, 26.539999999999992, 27.679999999999993, 28.700000000000003, 29.69999999999999, 30.279999999999994, 30.700000000000003, 30.879999999999995, 30.999999999999993, 30.86, 30.75999999999999, 30.499999999999993, 29.999999999999993], [4.8, 6.24, 9.459999999999999, 12.999999999999996, 15.730000000000004, 17.9, 19.32, 20.669999999999995, 21.29, 21.950000000000003, 22.64999999999999, 22.939999999999998, 23.200000000000003, 23.290000000000006, 23.299999999999997, 23.13000000000001, 23.03, 22.799999999999997, 22.39999999999999], [4.8, 5.9, 8.7, 10.9, 12.3, 13.4, 14.0, 14.8, 14.9, 15.2, 15.6, 15.6, 15.7, 15.7, 15.6, 15.4, 15.3, 15.1, 14.8]]



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

    xLabels: [...Array(19).keys()].map(i => `${2020 + 10*i}?`),
    options: {
      elements: {
        line: {tension: .4},
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {left: 16, right: 16, top: 32, bottom: 16},
      },
      maintainAspectRatio: false,
      plugins: {
        'datalabels': {
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
            return [, 'EMISSIONS', '', 'TEMPERATURE'][context.dataset.order]
          },
        },
      },
      responsive: true,
      //responsiveAnimationDuration: 2000,
      scales: {
        yAxes: [{
          id: 'right-y-axis',
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
  },
  methods: {
    color(k, bold = true) {
      if (bold)
        return k > 90 ? this.green : (k > 40 ? this.brown : this.red)
      return k > 90 ? this.ltGreen : (k > 40 ? this.ltBrown : this.ltRed)
    },
    updateData() {
      // Apply weights to the factors
      let wA = this.weightA
      let wB = this.weightB
      let k = (this.factorA * wA + this.factorB * wB)
      
      this.chartData = {
        labels: this.xLabels,
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
            borderWidth: 14,
            borderColor: this.color(k),
            backgroundColor: this.color(k),
            pointBorderColor: 'transparent',
            pointStyle: 'dash',
            fill: false,
            data: E[Math.floor(k / 10)],
            yAxisID: 'right-y-axis',
            order: 1,
          },
          {
            label: 'Temperature',
            borderWidth: 14,
            borderColor: this.color(k, false),
            backgroundColor: this.color(k, false),
            pointBorderColor: 'transparent',
            pointStyle: 'dash',
            fill: false,
            data: T[Math.floor(k / 10)],
            yAxisID: 'right-y-axis',
            order: 3,
          },
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
