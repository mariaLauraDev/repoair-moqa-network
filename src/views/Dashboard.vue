<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="dashboard">
        <h1
          class="page-title space__medium--bottom"
          style="font-weight: 600"
        >
          Dashboard
        </h1>

        <div class="actions-btn">
          <div
            class="time-range--btn"
          >
            <div class="select">
              <span class="material-symbols-outlined" style="font-size: 1.15rem;"> history </span>
              <select
                v-model="timeRange"
              >
                <option value="5">5 min</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hora</option>
                <option value="360">6 horas</option>
                <option value="1440">24 horas</option>
              </select>
            </div>
          </div>
          <div
            class="refreshg--btn"
            :class="{ 'refreshing': fetchingDocuments }"
            @click="fetchDocuments"
          >
            <span class="material-symbols-outlined" style="font-size: 1.15rem;"> sync </span>
          </div>
        </div>

        <div>
          <l-map v-if="markersLoaded" :markers="markers" />
          <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <TreeDotsLoading />
          </div>
        </div>

        <section
          v-if="hasFetchedDocuments"
          class="dashboard__summary"
        >
          <Card title="Total de dados" :value="numberOfDocuments + ' documentos'" description="no período selecionado"/>
          <Card title=" Total de monitores" :value="numberOfMonitors" description="no período selecionado"/>
        </section>

        <div>
          <scatter-chart
            :data="pm10GraphData"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="PM10"
            title="Concentração de PM10 ao longo do tempo"
          ></scatter-chart>
        </div>

        <transition name="fade">
          <div>
            <!-- <TablePaginated
              :header-columns="getMonitorsProps()"
              :rows="monitorsFound"
              :rows-props="getMonitorsProps()"
              selected-start-date="1000"
              selected-end-date="1000"
              table-title="Últimos dados dos monitores"
            /> -->

            <TablePaginated
              v-if="hasFetchedDocuments"
              :selected-start-date="selectedStartDate"
              :selected-end-date="selectedEndDate"
              :header-columns="getMonitorsProps()"
              :rows="monitorsFound"
              :rows-props="getMonitorsProps()"
              table-title="Últimos dados dos monitoress"
            />

            <TablePaginated
              v-if="hasFetchedDocuments"
              per-page="3"
              :selected-start-date="selectedStartDate"
              :selected-end-date="selectedEndDate"
              :header-columns="summaryHeader"
              :rows="documents"
              :rows-props="summaryHeader"
              table-title="Dados encontrados"
            />

            <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <TreeDotsLoading />
            </div>
          </div>
        </transition>
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
    Card,
    ScatterChart
  },
  data() {
    return {
      markers: [],
      markersLoaded: false,
      pageLoaded: false,
      timeRange: 1440,
      fetchingDocuments: false,
      hasFetchedDocuments: false,
      documents: [],
      numberOfDocuments: 0,
      numberOfMonitors: 0,
      monitorsFound: [],
      pm10GraphData: [],
      user: null,
      summaryHeader: ["moqaID", "Timestamp", "extTemp", "alt", "codeID", "boardID", "Pres", "hum", "intTemp", "pm1", "pm10", "pm25", "adc0", "co2", "adc1", "adc2", "adc3", "tvocs", "adsLog", "ccsLog", "bmeLog", "pmsLog", "msdLog", "rtcLog"],
    }
  },
  mounted() {
    this.fetchMonitors()
    this.fetchDocuments()
    this.pageLoaded = true
  },
  computed: {
    timestampRanges() {
      const nowInTimestamp = Math.floor(Date.now() / 1000);  
      const rangeStartTimestamp = nowInTimestamp - this.timeRange * 60
      return {
        start: this.calculateFirebaseTimestamp(rangeStartTimestamp),
        end: this.calculateFirebaseTimestamp(nowInTimestamp),
      }
    },
    selectedStartDate () {
      return new Date(this.timestampRanges.start.seconds*1000).toISOString().slice(0, 10)
    },
    selectedEndDate () {
      return new Date(this.timestampRanges.end.seconds*1000).toISOString().slice(0, 10)
    },
  },
  watch: {
    timeRange(newTimeRange) {
      this.fetchDocuments()
    },
    documents(newDocuments) {
      this.pm10GraphData = this.prepareGraphData('Timestamp', 'pm10')
    }
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
          orderBy('Timestamp', 'desc'),
          limit(3000)
        )

        const querySnapshot = await getDocs(documentsQuery)

        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push(doc.data())
        })
        
        this.documents = docs
        this.monitorsFound = extractMonitorsFound(docs)
        this.numberOfDocuments = docs.length
        this.numberOfMonitors = this.monitorsFound.length
      } catch (error) {
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
    prepareGraphData (xField, yField) {
      const chartData = []

      this.documents.forEach((doc) => {
        const x = doc[xField]
        const y = doc[yField]
        chartData.push({ x, y })
      })

      return chartData.reverse()
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
  display: grid;
  gap: 1.25rem;
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
    margin-top: 1.25rem;
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}
</style>