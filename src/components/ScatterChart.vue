<template>
  <div class="chart-container">
    <canvas class="scatter-chart" ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';

export default {
  props: ['data', 'title', 'xAxisLabel', 'yAxisLabel', 'isHourSeries'],
  mounted() {
    this.renderChart();
  },
  data() {
    return {
      colorPalette: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(255, 100, 100, 0.2)',
        'rgba(100, 100, 255, 0.2)'
      ],
      borderColorPalette: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(255, 100, 100, 1)',
        'rgba(100, 100, 255, 1)'
      ]
    }
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

      const groupedData = this.data;

      this.datasets = Object.entries(groupedData).map(([moqaID, data], index) => {
        this.labels = this.isHourSeries
          ? data.map(item => new Date(item.x.seconds * 1000))
          : data.map(item => item.x);

        const dataset = this.isHourSeries
          ? data.map(item => ({
              x: new Date(item.x.seconds * 1000),
              y: item.y
            }))
          : data.map(item => ({
              x: item.x,
              y: item.y
            }));
        const randomColor = this.getRandomColor(index);

        return {
          label: moqaID,
          data: dataset,
          backgroundColor:  this.colorPalette[index % this.colorPalette.length],
          borderColor:  this.borderColorPalette[index % this.colorPalette.length],
          borderWidth: 1,
          fill: true,
          yAxisKey: 'y'
        };
      });

      const ctx = this.$refs.chart.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'scatter',
        data: {
          labels: this.labels,
          datasets: this.datasets
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'nearest'
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
              },
              min: this.labels[0]
            },
            y: {
              title: {
                display: true,
                text: this.yAxisLabel
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: this.title
            }
          },
          elements: {
            line: {
              fill: true
            }
          }
        }
      });
    },
    groupDataByMoqaID() {
      const groupedData = {};

      this.data.forEach(item => {
        if (!groupedData[item.moqaID]) {
          groupedData[item.moqaID] = [];
        }
        groupedData[item.moqaID].push(item);
      });

      return groupedData;
    },
    getRandomColor(index) {
      // Escolha aleatoriamente uma cor da paleta e modifique ligeiramente para variar
      const baseColor = this.colorPalette[index % this.colorPalette.length];
      const variation = Math.floor(Math.random() * 16) - 8; // -8 a +8

      const rgbValues = baseColor
        .substring(5, baseColor.length - 1)
        .split(',')
        .map(value => parseInt(value) + variation);

      // Garante que os valores RGB permaneçam dentro do intervalo [0, 255]
      const finalRgbValues = rgbValues.map(value => Math.min(255, Math.max(0, value)));

      return finalRgbValues.join(',');
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
  border-radius: 0.5rem;
}
</style>
