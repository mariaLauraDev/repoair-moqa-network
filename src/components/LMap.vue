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
      default: () => ({ lat: -3.783112, long: -38.513393, zoom: 11 })
    },
    markerClicked: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data() {
    return {
      map: null
    }
  },
  watch: {
    markerClicked() {
      if (this.markerClicked.lat && this.markerClicked.long) {
        this.zoomMoqaClicked(this.markerClicked.lat, this.markerClicked.long);
      } else {
        this.resetMapView();
      }
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
      const { lat, long, zoom } = this.initialView;

      this.map = L.map('mapContainer').setView([lat, long], zoom);
      L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      if (this.markers.length) {
        this.setMarkers();
      }
    },
    setMarkers() {
      this.markers.forEach((marker) => {
        const customIcon = L.divIcon({
          html: `<span class="material-symbols-outlined"> memory </span>`,
          iconSize: [40, 40],
        });

        L.marker([marker.lat, marker.long], { icon: customIcon })
          .addTo(this.map)
          .bindPopup('MoqaID: ' + marker.idDb)
          .bindTooltip(`${marker.name}`, {
            permanent: true,
            direction: 'bottom'
          })
          .on('click', () => {
            this.zoomMoqaClicked(marker.lat, marker.long)
            this.$emit('markerClicked', marker);
          });
      });
    },
    resetMapView() {
      const { lat, long, zoom } = this.initialView;
      this.map.setView([lat, long], zoom);
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
