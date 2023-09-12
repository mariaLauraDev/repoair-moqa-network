<template>
  <div>
    <l-map v-if=markersLoaded :markers="markers" />
  </div>
</template>

<script>
import LMap from '@/components/LMap.vue';

import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit
} from 'firebase/firestore'

export default {
  components: {
    LMap,
  },
  data() {
    return {
      markers: [],
      markersLoaded: false,
      markersData: [
        {name: 'Laura', lat: -3.825437152584873, long: -38.48425019484144 },
        { lat: -3.789, long: -38.520, name: 'Marcador 2' },
      ]
    }
  },
  mounted() {
    this.fetchMonitors()
    console.log('markersData', this.markersData)
  },
  methods: {
    async fetchMonitors() {
      try {
        const firestore = getFirestore()
        const markersCollection = collection(firestore, 'monitoring-control')

        let markersQuery = null

        markersQuery = query(
          markersCollection,
          limit(25)
        )

        const querySnapshot = await getDocs(markersQuery)

        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push(doc.data())
        });
        this.markers = docs
        this.markersLoaded = true
      } catch (error) {
        console.error('Erro ao buscar marcadores:', error)
      }
    }
  }
};
</script>

<style>
#mapContainer { height: 180px; }
</style>
