<template>
  <div>
    <h2 style="margin-top: 40px">CONTROLE DE MONITORAMENTO</h2>
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
    }
  },
  mounted() {
    this.createMapLayer()

    console.log(this.markers)
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    createMapLayer() {
      this.map = L.map('mapContainer').setView([ -3.783112, -38.513393], 12)
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
          html: `<i class="material-icons"> memory </i>`, // Substitua 'marker.icon' pelo ícone desejado
          iconSize: [40, 40], // Tamanho do ícone
        });

        L.marker([marker.lat, marker.long], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(marker.name)
      });
    }
  }
}
</script>

<style scoped lang="scss">
#mapContainer {
  width: 90vw;
  height: calc(80vh - 50px);
  margin-top: 25px;
  box-shadow: rgb(0 0 0 / 10%) 0px 10px 26px 0px;
  border: 5px solid rgb(222, 226, 230);
  border-radius: 15px;
}

.yellow {
  color: #f1c40f;
}
</style>