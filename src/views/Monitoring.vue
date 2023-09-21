<template>
  <div>
    <transition name="fade">
      <l-map v-if="markersLoaded && pageLoaded" :markers="markers" />
    </transition>
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
      pageLoaded: false,
    }
  },
  mounted() {
    this.fetchMonitors()
    this.pageLoaded = true
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
