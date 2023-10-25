<template>
  <div>
    <div id="mapContainer">
      <!-- <button @click="resetZoom" id="resetZoomButton">Reset Zoom</button> -->
    </div>
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
      default: () => ({ lat: -3.783112, lng: -38.513393, zoom: 12 })
    },
    timeFilter: {
      type: Number,
      required: true,
      default: 5 // Default para 5 minutos
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
    };
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
    console.log('[this.initialView.lat, this.initialView.lng]', [this.initialView.lat, this.initialView.lng]);

  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    resetZoom() {
      this.map = L.map('mapContainer').setView([this.initialView.lat, this.initialView.lng], this.initialView.zoom);
    },
    createMapLayer() {
      this.map = L.map('mapContainer').setView([this.initialView.lat, this.initialView.lng], this.initialView.zoom);
      L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      if (this.markers.length) {
        this.setMarkers();
      }
    },
    resetMapView() {
      const { lat, long, zoom } = this.initialView;
      this.map.setView([lat, long], zoom);
    },
    getBubbleSize(quantity) {      
      const ratio = quantity / 10;
      console.log('ratio', ratio);
      console.log('quantity', quantity)
      const baseSize = 10
      const scaleFactor = 10
      
      const size = baseSize + Math.log2(ratio + 1) * scaleFactor
      console.log('Math.log2(ratio + 1)', Math.log2(ratio + 1))
      console.log('size', size);
      
      return Math.min(Math.max(size, 10), 150);
    },
    setMarkers() {
      this.markers.forEach((marker) => {
        const markerSize = this.getBubbleSize(marker.quantity)
        console.log(marker.name, markerSize)
        
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
          });
      });
    },
    zoomMoqaClicked(latitude, longitude, zoom = 13) {
      this.map.setView([latitude, longitude], zoom);
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

#resetZoomButton {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  padding: 5px 10px;
  background-color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

@media (min-width: 768px) {
  #mapContainer {
    height: calc(50vh);
  }
}
</style>
