<template>
  <div class="chart-container">
    <div ref="chart"></div>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import moment from 'moment';
exporting(Highcharts);

Highcharts.setOptions({
  exporting: {
    accessibility: {
      enabled: true
    },
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"],
        symbol: 'menu',
        symbolFill: '#666666',
        symbolSize: 14,
        symbolStroke: '#666666',
        symbolStrokeWidth: 3,
        symbolX: 14.5,
        symbolY: 13.5,
      }
    }
  }
});

export default {
  props: ['data', 'title', 'xAxisLabel', 'yAxisLabel'],
  mounted() {
    this.renderChart();
  },
  watch: {
    data: 'renderChart'
  },
  methods: {
    renderChart() {
      const moqaIDs = Object.keys(this.data);
      const dataCounts = Object.values(this.data);

      const options = {
        chart: {
          type: 'bar',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          spacingTop: 20,
          spacingLeft:20,
          spacingRight:20,
          spacingBottom: 20,
          style:
          {
            fontFamily: 'Poppins',
            fontSize: '0.75rem',
            fontWeight: '400',
            color: '#333333'
          }
        },
        title: {
          text: this.title,
          align: 'center',
          margin: 40,
          style: {
            color: '#333333',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          categories: moqaIDs,
          title: {
            text: this.xAxisLabel
          }
        },
        yAxis: {
          title: {
            text: this.yAxisLabel
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 5
          }
        },
        series: [{
          name: this.yAxisLabel,
          data: dataCounts,
          color: 'rgba(75, 192, 192, 0.8)'
        }],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 400
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      };

      const chartElement = this.$refs.chart;
      this.chart = Highcharts.chart(chartElement, options);
    }
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: left;
}
</style>
