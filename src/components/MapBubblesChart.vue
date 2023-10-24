<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';

HighchartsMap(Highcharts);

export default {
  props: ['data'],
  mounted() {
    this.renderMap();
  },
  methods: {
    renderMap() {
      // Seus dados com informações de latitude, longitude, moqaID e quantidade de dados
      const mapData = [
        {
          name: 'Ponto 1',
          lat: 51.5074,
          lon: -0.1278,
          z: 10, // Tamanho da bolha com base na quantidade de dados
          moqaID: 'ID1',
          quantidadeDados: 10,
        },
        // Adicione mais pontos de dados aqui
      ];

      Highcharts.mapChart(this.$refs.chart, {
        chart: {
          type: 'map',
          map: 'countries/us/us-all',
        },
        title: {
          text: 'Gráfico de Mapa de Bolhas',
        },
        series: [
          {
            name: 'Monitor Data',
            type: 'mapbubble',
            data: mapData.map((point) => ({
              name: point.name,
              lat: point.lat,
              lon: point.lon,
              z: point.z,
              moqaID: point.moqaID,
              quantidadeDados: point.quantidadeDados,
            })),
          },
        ],
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom',
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.chart {
  height: 100%;
  width: 100%;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: left;
}
</style>
