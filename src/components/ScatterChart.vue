<template>
  <div
    class="chart-container"
  >
    <canvas
    class="scatter-chart" ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';

export default {
  props: ['data', 'title', 'xAxisLabel' ,'yAxisLabel', 'isHourSeries'],
  mounted() {
    this.renderChart();
  },
  computed: {
  },
  watch: {
    data: 'renderChart'
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      if (this.data.length === 0) {
        return;
      }

      const labels = this.isHourSeries ?
        this.data.map(item => new Date(item.x.seconds * 1000))
        : this.data.map(item => item.x);

      const dataset = this.isHourSeries ? 
        this.data.map(item => ({
          x: new Date(item.x.seconds * 1000),
          y: item.y
        })) :
        this.data.map(item => ({
          x: item.x,
          y: item.y
        }));

      const ctx = this.$refs.chart.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'scatter',
        data: {
          labels,
          datasets: [
            {
              label: this.yAxisLabel,
              data: dataset,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: true,
              yAxisKey: 'y'
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'nearest',
          },
          scales: {
            x: {
              offset: true,
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'HH:mm'
                }
              },
              title: {
                display: true,
                text: this.xAxisLabel
              },
              ticks: {
                source: 'labels',
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                maxTicksLimit: 10,
                callback: function(value, index, values) {
                  return moment(value).format('HH:mm');
                }
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: this.yAxisLabel
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: this.title,
            }
          },
          elements: {
            line: {
              fill: true,
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: left;
  border-width: 1px;
  margin-top: 1.25rem;
}
</style>