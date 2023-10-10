<template>
  <div class="chart-container">
    <canvas class="bar-chart" ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  props: ['data', 'title', 'xAxisLabel', 'yAxisLabel'],
  mounted() {
    this.renderChart();
  },
  data() {
    return {
      colorPalette: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(255, 100, 100, 0.2)',
        'rgba(100, 100, 255, 0.2)'
      ],
      borderColorPalette: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(255, 100, 100, 1)',
        'rgba(100, 100, 255, 1)'
      ]
    };
  },
  watch: {
    data: 'renderChart'
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const moqaIDs = Object.keys(this.data);
      const dataCounts = Object.values(this.data);

      const ctx = this.$refs.chart.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: moqaIDs,
          datasets: [
            {
              label: this.yAxisLabel,
              data: dataCounts,
              backgroundColor: this.colorPalette,
              borderColor: this.borderColorPalette,
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text:  this.xAxisLabel
              }
            },
            y: {
              title: {
                display: true,
                text: this.yAxisLabel
              },
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: this.title
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
  border-radius: 0.5rem;
}

.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
