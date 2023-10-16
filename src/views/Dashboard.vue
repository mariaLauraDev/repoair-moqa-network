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

        <div style="margin-bottom: 1.25rem">
          <l-map v-if="markersLoaded" :markers="markers" />
          <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <TreeDotsLoading />
          </div>
        </div>

        <p style="font-weight: 700;"> Resumo </p>
        <section
          v-if="hasFetchedDocuments"
          class="dashboard__summary"
        >
          <Card title="Total de dados" :value="numberOfDocuments + ' documentos'" description="no período selecionado"/>
          <Card title=" Total de monitores" :value="numberOfMonitors" description="no período selecionado"/>
          <bar-chart
            :data="bargraph"
            xAxisLabel="MoqaID"
            yAxisLabel="Quantidade de dados"
            title="Quantidade de dados por monitor"
          />
        </section>
        
        <p style="font-weight: 700;"> Parâmetros metereológicos </p>
        <section
          v-if="documents.length > 0"
          class="dashboard__summary"
        >
          <scatter-chart
            :data="pres"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="Pressão"
            title="Pressão ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="hum"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="hum"
            title="Humidade ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="extTemp"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="Temperatura externa"
            title="Temperatura externa ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="intTemp"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="Temperatura interna"
            title="Temperatura interna ao longo do tempo"
          ></scatter-chart>
        </section>

        <p style="font-weight: 700;"> Parâmetros poluentes </p>
        <section
          v-if="documents.length > 0"
          class="dashboard__summary"
        >
          <scatter-chart
            :data="pm1"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="pm1"
            title="PM1 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="pm10"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="PM10"
            title="PM10 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="pm25"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="PM25"
            title="PM25 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="adc0"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="ADC0"
            title="ADC0 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="adc1"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="ADC1"
            title="ADC1 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="adc2"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="ADC2"
            title="ADC2 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="adc3"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="ADC3"
            title="ADC3 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="co2"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="CO2"
            title="CO2 ao longo do tempo"
          ></scatter-chart>
          <scatter-chart
            :data="tvocs"
            isHourSeries="true"
            xAxisLabel="Hora"
            yAxisLabel="TVOCs"
            title="TVOCs ao longo do tempo"
          ></scatter-chart>
        </section>

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
              table-title="Últimos dados dos monitores"
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
import BarChart from '../components/BarChart.vue';
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
    ScatterChart,
    BarChart
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

      user: null,
      summaryHeader: ["moqaID", "Timestamp", "extTemp", "alt", "codeID", "boardID", "Pres", "hum", "intTemp", "pm1", "pm10", "pm25", "adc0", "co2", "adc1", "adc2", "adc3", "tvocs", "adsLog", "ccsLog", "bmeLog", "pmsLog", "msdLog", "rtcLog"],
    }
  },
  mounted() {
    console.log('timestampRanges', this.timestampRanges)
    this.fetchMonitors()
    this.fetchDocuments()
    this.pageLoaded = true
  },
  computed: {
    timestampRanges() {
      const browserTimezoneOffset = new Date().getTimezoneOffset()
      const nowInTimestamp = Math.floor(Date.now()/ 1000)
      const rangeStartTimestamp = nowInTimestamp - (this.timeRange * 60) - (browserTimezoneOffset * 60);
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
      this.bargraph = this.groupDataByMoqaID()
      this.pm10 = this.prepareGraphData('Timestamp', 'pm10')
      this.pm1 = this.prepareGraphData('Timestamp', 'pm1')
      this.pm25 = this.prepareGraphData('Timestamp', 'pm25')
      this.pres = this.prepareGraphData('Timestamp', 'Pres')
      this.hum = this.prepareGraphData('Timestamp', 'hum')
      this.intTemp = this.prepareGraphData('Timestamp', 'intTemp')
      this.alt = this.prepareGraphData('Timestamp', 'alt')
      this.extTemp = this.prepareGraphData('Timestamp', 'extTemp')
      this.co2 = this.prepareGraphData('Timestamp', 'co2')
      this.tvocs = this.prepareGraphData('Timestamp', 'tvocs')
      this.adc0 = this.prepareGraphData('Timestamp', 'adc0')
      this.adc1 = this.prepareGraphData('Timestamp', 'adc1')
      this.adc2 = this.prepareGraphData('Timestamp', 'adc2')
      this.adc3 = this.prepareGraphData('Timestamp', 'adc3')      
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
    groupDataByMoqaID() {
      const dataCounts = {};

      this.documents.forEach(item => {
        const moqaID = item.moqaID;

        if (!dataCounts[moqaID]) {
          dataCounts[moqaID] = 0;
        }

        dataCounts[moqaID]++;
      });

      return dataCounts;
    },
    prepareGraphData (xField, yField) {
      const groupedData = {};

      this.documents.forEach((item) => {
        if (!groupedData[item.moqaID]) {
          groupedData[item.moqaID] = [];
        }

        const x = item[xField]
        const y = item[yField]

        groupedData[item.moqaID].push({x, y});
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