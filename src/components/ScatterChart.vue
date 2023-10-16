<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
    <!-- <p class="highcharts-description">The following chart demonstrates some accessibility features  of Highcharts, including use of the <code>linkedDescription</code> option.</p> -->
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import moment from 'moment';

import accessibility from 'highcharts/modules/accessibility';
accessibility(Highcharts);
Highcharts.setOptions({
  accessibility: {
    enabled: true
  }
})

import exporting from 'highcharts/modules/exporting';
exporting(Highcharts);
Highcharts.setOptions({
  exporting: {
    accessibility:{
      enabled:true
    },
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"],
        symbol: 'menu',
        symbolFill: '#666666',
        symbolSize:14,
        symbolStroke:'#666666',
        symbolStrokeWidth:3,
        symbolX:14.5,
        symbolY:13.5,
      }
    }
  }
})

export default {
  props: ['data', 'title', 'xAxisLabel', 'yAxisLabel', 'isHourSeries'],
  mounted() {
    this.renderChart();
  },
  watch: {
    data: 'renderChart'
  },
  methods: {
    renderChart() {
    const groupedData = this.data;

    const options = {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
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
        style:{
          color: '#333333',
          fontWeight: 'bold'
        },
        VerticalAlign: 'middle',
        widthAdjust: -40
      },
      xAxis: {
        type: this.isHourSeries ? 'datetime' : 'linear',
        title: {
          text: this.xAxisLabel
        },
        labels: {
          formatter: function() {
            return moment(this.value).format('DD/MM HH:mm');
          }
        }
      },
      yAxis: {
        title: {
          text: this.yAxisLabel
        }
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 4
          }
        }
      },
      series: Object.entries(groupedData).map(([moqaID, data], index) => ({
        name: moqaID,
        data: this.isHourSeries
          ? data.map(item => [item.x * 1000, item.y])
          : data.map(item => [item.x, item.y])
      })),
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
  },
    groupDataByMoqaID() {
      const groupedData = {};

      this.data.forEach(item => {
        if (!groupedData[item.moqaID]) {
          groupedData[item.moqaID] = [];
        }
        groupedData[item.moqaID].push(item);
      })

      return groupedData;
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
