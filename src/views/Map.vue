<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="dashboard">
        <h1
          class="page-title space__medium--bottom"
        >
          {{ $t('routes.map.title') }}
        </h1>

        <div>
          <div v-if="markersLoaded" class="feed__map">
            <l-map
              :markers="markers"
              :marker-clicked="markerClicked"
            />
            <!-- <marker-feed
              v-if="documents.length > 0"
              :marker="markerClicked"
              :last-document="lastMarkerDocument"
            /> -->
          </div>
          <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <TreeDotsLoading />
          </div>
        </div>

        <TablePaginated
          v-if="markers.length > 0"
          :header-columns="markersHeader"
          :rows="markers"
          :rows-props="getMarkersProps()"
          :enable-search="true"
          :table-title="`${$t('monitors_relation')}`"
          @clickedRow="setMarkerClicked"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import LMap from '../components/LMap.vue';
import TablePaginated from '../components/TablePaginated.vue';
import TreeDotsLoading from '../components/TreeDotsLoading.vue';
import Card from '../components/Card.vue'
import ScatterChart from '../components/ScatterChart.vue';
import BarChart from '../components/BarChart.vue';
import MarkerFeed from '../components/MarkerFeed.vue';
import markersProps from '../utils/markersProps.js'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  limit,
  getDocs,
} from 'firebase/firestore'
import { mapState } from 'vuex'

export default {
  components: {
    LMap,
    TablePaginated,
    TreeDotsLoading,
    Card,
    ScatterChart,
    BarChart,
    MarkerFeed
  },
  data() {
    return {
      markers: [],
      markersLoaded: false,
      pageLoaded: false,
      timeRange: 5,
      fetchingDocuments: false,
      hasFetchedDocuments: false,
      documents: [],
      numberOfDocuments: 0,
      numberOfMonitors: 0,
      monitorsFound: [],
      markerClicked: null,
      user: null,
      lastMarkerDocument: null,
    }
  },
  async mounted() {
    this.fetchMonitors()
    this.pageLoaded = true
  },
  computed: {
    ...mapState(['locale']),
    markersHeader() {
      return [
        'id',
        this.$t('name'),
        'MoqaID',
        this.$t('latitude'),
        this.$t('longitude'),
      ]
    },
  },
  methods: {
    getMarkersProps() {
      return markersProps
    },
    setMarkerClicked(marker) {
      this.markerClicked = marker
    },
    async fetchMonitors() {
      try {
        const firestore = getFirestore()
        const markersCollection = collection(firestore, process.env.VUE_APP_MARKERS_COLLECTION_NAME)

        const markersQuery = query(
          markersCollection,
          orderBy('id', 'asc')
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
    async fetchLastConnection(moqaID) {
      try {
        const firestore = getFirestore()
        const system1Collection = collection(firestore, process.env.VUE_APP_DATA_COLLECTION_NAME)
        
        const lastConnectionQuery = query(
          system1Collection,
          where('moqaID', '==', moqaID),
          limit(1)
        )

        const querySnapshot = await getDocs(lastConnectionQuery)

        if (!querySnapshot.empty) {
          console.log('querySnapshot.docs[0].data()', querySnapshot.docs[0].data())
          return querySnapshot.docs[0].data()
        } else {
          return null
        }
      } catch (error) {
        console.error('Erro ao buscar a última conexão:', error)
        return null
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.actions-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.refreshg--btn {
  height: 100%;
  padding: 0.3rem 0.5rem;
  border-radius: 0.375rem;
  border-width: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #1c3c1f;
  background-color: #e8eeca;
}

.refreshing {
  opacity: 0.5;
  cursor: not-allowed;
}

select {
  background-color: transparent;
}

.dashboard__summary {
  margin: 1.25rem 0px;
  display: grid;
  gap: 1.25rem;
}

.feed__map {
  margin: 1.25rem 0px;
}

.select {
  padding: 0.1rem 0.5rem;
  border-radius: 0.375rem;
  border-width: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 500;
  //font-size: .75rem;
  line-height: 1rem;
  text-align: left;
  color: $color-primary;
  background-color: rgba(178, 199, 78, 0.3);
}

@media (min-width: 780px) {
  .dashboard__summary {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}
</style>