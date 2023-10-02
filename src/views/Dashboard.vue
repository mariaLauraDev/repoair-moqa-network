<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="dashboard">
        <div>
          <l-map v-if="markersLoaded" :markers="markers" />
          <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <TreeDotsLoading />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import LMap from '@/components/LMap.vue';
import TablePaginated from '../components/TablePaginated.vue';
import TreeDotsLoading from '../components/TreeDotsLoading.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'

export default {
  components: {
    LMap,
    TablePaginated,
    TreeDotsLoading,
  },
  data() {
    return {
      markers: [],
      markersLoaded: false,
      pageLoaded: false,
      timeRange: 5,
      monitors: [],
      user: null,
      summaryHeader: ["moqaID", "Timestamp", "extTemp", "alt", "codeID", "boardID", "Pres", "hum", "intTemp", "pm1", "pm25", "adc0", "co2", "adc1", "adc2", "adc3", "tvocs", "adsLog", "ccsLog", "bmeLog", "pmsLog", "msdLog", "rtcLog"],
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

        const markersQuery = query(
          markersCollection,
          limit(25)
        )

        onSnapshot(markersQuery, (querySnapshot) => {
          const docs = []
          querySnapshot.forEach((doc) => {
            docs.push(doc.data())
          })
          this.markers = docs
          this.markersLoaded = true
        })
      } catch (error) {
        console.error('Erro ao buscar marcadores:', error)
      }
    },
    calculateFirebaseTimestamp(date) {
      return new Timestamp(date, 0)
    },
  }
};
</script>


<style lang="scss" scoped>

</style>