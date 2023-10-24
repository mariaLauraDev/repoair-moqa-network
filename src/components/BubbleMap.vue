<template>
  <div>
    <div id="mapContainer" />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  props: {
    markers: {
      type: Array,
      required: false,
      default: () => []
    },
    initialView: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  mounted() {
    this.createMapLayer();
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    createMapLayer() {
      this.map = L.map('mapContainer').setView([-3.783112, -38.513393], 12);
      L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      if (this.markers.length) {
        this.setMarkers()
      }
    },
    normalize(value, minVal, maxVal, minRange, maxRange) {
      return ((value - minVal) / (maxVal - minVal)) * (maxRange - minRange) + minRange;
    },
    setMarkers() {
      const minSize = 10;
      const maxSize = 100;
      
      // Encontre o valor mínimo e máximo da quantidade de dados
      const minQuantity = Math.min(...this.markers.map((marker) => marker.quantity));
      const maxQuantity = Math.max(...this.markers.map((marker) => marker.quantity));
      
      this.markers.forEach((marker) => {
        // Normalize a quantidade de dados para o intervalo de tamanho da bolha
        const normalizedSize = this.normalize(marker.quantity, minQuantity, maxQuantity, minSize, maxSize)
        let markerSize = Math.round(normalizedSize) // Arredonda para o tamanho inteiro

        const customIcon = L.divIcon({
          html: `<div class="bubble" style="width:${markerSize}px; height:${markerSize}px;background-color: rgba(52, 152, 219, .8);border-radius: 50%;"></div>`,
          iconSize: [markerSize, markerSize],
        });

        L.marker([marker.lat, marker.long], { icon: customIcon })
          .addTo(this.map)
          .bindPopup('MoqaID: ' + marker.moqaID)
          .bindTooltip(`${marker.name}`, {
            permanent: true,
            direction: 'bottom',
          })
          .on('click', () => {
            this.zoomMoqaClicked(marker.lat, marker.long);
            this.$emit('markerClicked', marker);
          })
      })
    },
    normalize(value, minVal, maxVal, minRange, maxRange) {
      if (maxVal === minVal) {
        // Lida com o caso de minVal e maxVal serem iguais
        return minRange*value/10 < 100 ? minRange*value/10 : 100
      }
      return ((value - minVal) / (maxVal - minVal)) * (maxRange - minRange) + minRange;
    }
    ,
    zoomMoqaClicked(latitude, longitude) {
      this.map.setView([latitude, longitude], 13)
    }
  }
};
</script>

<style scoped lang="scss">
#mapContainer {
  width: 100%;
  height: calc(50vh);
  border: 3px solid rgb(222, 226, 230);
  border-radius: 0.375rem;
  z-index: 1;
}

.bubble {
  
}

@media (min-width: 768px) {
  #mapContainer {
    height: calc(50vh);
  }
}
</style>
