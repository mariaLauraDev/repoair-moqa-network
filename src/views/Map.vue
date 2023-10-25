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
import monitorsProps from '../utils/monitorsProps.js'
import extractMonitorsFound from '../utils/extractMonitorsFound.js'
import ScatterChart from '../components/ScatterChart.vue';
import BarChart from '../components/BarChart.vue';
import MarkerFeed from '../components/MarkerFeed.vue';
import weatherFields from '../utils/weatherFields.js'
import pollutionFields from '../utils/pollutionFields.js'
import fieldsUnits from '../utils/fieldsUnits.js'
import logFields from '../utils/logFields.js'
import documentFields from '../utils/documentFields.js'
import markersProps from '../utils/markersProps.js'
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
  mounted() {
    this.fetchMonitors()
    this.pageLoaded = true
  },
  computed: {
    ...mapState(['locale']),
    timestampRanges() {
      const browserTimezoneOffset = new Date().getTimezoneOffset()
      const nowInTimestamp = Math.floor(Date.now()/ 1000) - (browserTimezoneOffset * 60)
      const rangeStartTimestamp = nowInTimestamp - (this.timeRange * 60)
      return {
        start: this.calculateFirebaseTimestamp(rangeStartTimestamp),
        end: this.calculateFirebaseTimestamp(nowInTimestamp),
      }
    },
    markersHeader() {
      return [
        'id',
        this.$t('name'),
        'MoqaID',
        this.$t('latitude'),
        this.$t('longitude'),
      ]
    },
    selectedStartDate () {
      return new Date(this.timestampRanges.start.seconds*1000).toISOString().slice(0, 10)
    },
    selectedEndDate () {
      return new Date(this.timestampRanges.end.seconds*1000).toISOString().slice(0, 10)
    },
    timeRangeOptions() {
      return [
        {
          name: `5 ${this.$t('time.min')}`,
          value: 5
        },
        {
          name: `15 ${this.$t('time.min')}`,
          value: 15
        },
        {
          name: `30 ${this.$t('time.min')}`,
          value: 30
        },
        {
          name: `1 ${this.$t('time.hour')}`,
          value: 60
        },
        {
          name: `6 ${this.$t('time.hours')}`,
          value: 360
        },
        {
          name: `24 ${this.$t('time.hours')}`,
          value: 1440
        }
      ]
    }
  },
  watch: {
    timeRange(newTimeRange) {
      this.fetchDocuments()
    },
    documents(newDocuments) {
      this.bargraph = this.groupDataByMoqaID()
      //na rota de dashboard irao os dados brutos e em analise faz-se a conversão

      this.scatterWeatherChartData = weatherFields.map(fieldName => ({
        data: this.prepareGraphData('Timestamp', fieldName),
        xAxisLabel: this.$t('time.hour'),
        yAxisLabel: `${fieldName} (${fieldsUnits[fieldName].unit})`,
        title: `${fieldName} ${this.$t('over_time')}`,
        subtitle: `${this.formatTimestamp(this.timestampRanges.start.seconds)} ${this.$t('components.table_paginated.until')} ${this.formatTimestamp(this.timestampRanges.end.seconds)}`
      }));

      this.scatterPollutionChartData = pollutionFields.map(fieldName => ({
        data: this.prepareGraphData('Timestamp', fieldName),
        xAxisLabel: this.$t('time.hour'),
        yAxisLabel: `${fieldName} (${fieldsUnits[fieldName].unit})`,
        title: `${fieldName} ${this.$t('over_time')}`,
        subtitle: `${this.formatTimestamp(this.timestampRanges.start.seconds)} ${this.$t('components.table_paginated.until')} ${this.formatTimestamp(this.timestampRanges.end.seconds)}`
      }));

      this.errorsChartData = logFields.map(fieldName => ({
        data: this.prepareGraphData('Timestamp', fieldName),
        xAxisLabel: this.$t('time.hour'),
        yAxisLabel: `${fieldName}`,
        title: `${fieldName} ${this.$t('over_time')}`,
        subtitle: `${this.formatTimestamp(this.timestampRanges.start.seconds)} ${this.$t('components.table_paginated.until')} ${this.formatTimestamp(this.timestampRanges.end.seconds)}`
      }));
    }
  },
  methods: {
    getMarkersProps() {
      return markersProps
    },
    getDocumentFields() {
      return documentFields
    },
    formatTimestamp(timestamp) {
      return new Date(timestamp * 1000).toLocaleString( this.locale, { timeZone: 'UTC' });
    },
    setMarkerClicked(marker) {
      this.markerClicked = marker
    },
    async fetchMonitors() {
      try {
        const firestore = getFirestore()
        const markersCollection = collection(firestore, 'monitoring-control')

        const markersQuery = query(
          markersCollection,
          orderBy('id', 'asc'),
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
    refreshPage() {
      this.fetchDocuments()
      this.monitorsFound = []
      this.markerClicked = null
      this.lastMarkerDocument = null
      this.numberOfDocuments = 0
      this.numberOfMonitors = 0
    },
    async fetchDocuments() {
      try {
        this.fetchingDocuments = true
        this.markersLoaded = false
        this.hasFetchedDocuments = false
        const { start, end } = this.timestampRanges
        const firestore = getFirestore()
        const documentsCollection = collection(firestore, 'system-1')

        let documentsQuery = null
        documentsQuery = query(
          documentsCollection,
          where('Timestamp', '>=', start),
          where('Timestamp', '<=', end),
          orderBy('Timestamp', 'desc')
        )

        const querySnapshot = await getDocs(documentsQuery)

        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push(doc.data())
        })
        
        this.documents = docs
        this.numberOfDocuments = docs.length
        this.monitorsFound = extractMonitorsFound(docs)
        this.numberOfMonitors = this.monitorsFound.length
        //aqui as vezes da errado se nao tiver atualizado
        //a coleção de moqas com a transmissao
        //porque nao vai encontrar o moqaID
        //na coleção de monitoring
        this.markerClicked =
          this.markers.find(marker => marker?.idDb === this.monitorsFound[0].moqaID)
        this.lastMarkerDocument = this.documents.find(document => document.moqaID === this.markerClicked?.idDb)

      } catch (error) {
        console.log('Erro ao buscar documentos:', error)
        return []
      } finally {
        this.fetchingDocuments = false
        this.hasFetchedDocuments = true
        this.markersLoaded = true
      }
    },
    calculateFirebaseTimestamp(date) {
      return new Timestamp(date, 0)
    },
    getMonitorsProps() {
      return monitorsProps
    },
    groupDataByMoqaID() {
      const dataCounts = {};

      this.documents.forEach(item => {
        const moqaID = item.moqaID;

        if (!dataCounts[moqaID]) {
          dataCounts[moqaID] = 0
        }

        dataCounts[moqaID]++;
      })

      return dataCounts;
    },
    prepareGraphData (xField, yField) {
      const groupedData = {}

      this.documents.forEach((item) => {
        if (!groupedData[item.moqaID]) {
          groupedData[item.moqaID] = []
        }

        const x = item[xField]
        const y = item[yField]

        groupedData[item.moqaID].push({x, y})
      })

      return groupedData
    }
  }
};
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