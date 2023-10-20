<template>
  <div>
    <div id="mapContainer" />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
  name: 'LMap',
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
    this.createMapLayer()
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove()
    }
  },
  //[ -3.783112, -38.513393]
  methods: {
    createMapLayer() {
      this.map = L.map('mapContainer').setView([ -3.783112, -38.513393], 11)
      L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map)

      if (this.markers.length) {
        this.setMarkers()
      }
    },
    setMarkers() {
      this.markers.forEach((marker) => {
        // Defina um ícone personalizado para o marcador
        const customIcon = L.divIcon({
          html: `<span class="material-symbols-outlined"> memory </span>`, // Substitua 'marker.icon' pelo ícone desejado
          iconSize: [40, 40], // Tamanho do ícone
        });

        L.marker([marker.lat, marker.long], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(marker.name)
          .bindTooltip(`${marker.idDb}`, {
            permanent: true,
            direction: 'bottom'
          })
          .on('click', () => {
            this.zoomMoqaClicked(marker.lat, marker.long);
            this.$emit('markerClicked', marker)
          })
      });
    },
    zoomMoqaClicked(latitude, longitude) {
      this.map.setView([latitude, longitude], 13);
    }
  }
}
</script>

<style scoped lang="scss">
#mapContainer {
  width: 100%;
  height: calc(50vh);
  //box-shadow: rgb(0 0 0 / 10%) 0px 10px 26px 0px;
  border: 3px solid rgb(222, 226, 230);
  border-radius: 0.375rem;
  z-index: 1;
}

.yellow {
  color: #f1c40f;
}

@media (min-width: 768px) {
  #mapContainer {
    height: calc(50vh);
  }
}
</style>