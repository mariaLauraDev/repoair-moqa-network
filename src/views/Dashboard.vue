<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="dashboard">
        <h1
          class="page-title space__medium--bottom"
        >
          {{ $t('routes.dashboard.title') }}
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
                <option
                  v-for="(option, index) in timeRangeOptions"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="refreshg--btn"
            :class="{ 'refreshing': fetchingDocuments }"
            @click="refreshPage"
          >
            <span class="material-symbols-outlined" style="font-size: 1.15rem;"> sync </span>
          </div>
        </div>

        <p
          style="font-weight: 400; margin: 15px 0px; font-style: italic; font-size: 0.8rem; text-align: center;"
        >
          {{ $t('showing_data')}} {{period}} (GTM{{ this.calculateBrowserTimezoneOffset() }})
        </p>

        <div
          style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;"
          v-if="fetchingDocuments"
        >
          <TreeDotsLoading />
        </div>
        <div
          v-else-if="hasFetchedDocuments && documents.length === 0"
        >
          <p
            style="font-weight: 400; margin: 15px 0px; font-style: italic; font-size: 0.8rem; text-align: center;"
          >
            {{ $t('not_found_on_period')}}
          </p>
        </div>
        <div
          v-else-if="hasFetchedDocuments && documents.length > 0"
        >
          <div>
            <div v-if="markersLoaded" class="feed__map">
              <BubbleMap
                v-if="markers.length > 0"
                :markers="markers"
                :time-filter="timeRange"
                :marker-clicked="markerClicked"
              />
            </div>
            <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <TreeDotsLoading />
            </div>
          </div>

          <p style="font-weight: 700;"> {{ $t('resume')}} </p>

          <section
            v-if="hasFetchedDocuments"
            class="dashboard__summary"
          >
            
            <!-- <bar-chart
              :data="bargraph"
              xAxisLabel="MoqaID"
              :yAxisLabel="`${$t('quantity_of_data')}`"
              :title="`${$t('quantity_of_data_by_monitor')}`"
              :subtitle="`${this.formatTimestamp(this.timestampRanges.start.seconds)} ${this.$t('components.table_paginated.until')} ${this.formatTimestamp(this.timestampRanges.end.seconds)}`"
            /> -->
            <Card :title="`${$t('total_of_data')}`" :value="numberOfDocuments + ` ${$t('documents')}`" :description="$t('on_selected_period')"/>
            <Card :title="`${$t('total_of_monitors')}`" :value="numberOfMonitors" :description="$t('on_selected_period')"/>
            <div
              style="display: flex; flex-direction: column; align-items: center; gap: 1.25rem;"
            >
            </div>
          </section>

          <TablePaginated
            v-if="hasFetchedDocuments"
            :selected-start-date="selectedStartDate"
            :selected-end-date="selectedEndDate"
            :header-columns="summaryMonitorsHeader"
            :rows="bargraph"
            :rows-props="summaryMonitorsProps"
            :table-title="`${$t('quantity_of_data_by_monitor')}`"
            :enableSearch="false"
            @clickedRow="setMarkerClicked"
          />

          <transition name="fade">
            <div>
              <TablePaginated
                v-if="hasFetchedDocuments"
                :isTimeExport="true"
                :selected-start-date="selectedStartDate"
                :selected-end-date="selectedEndDate"
                :header-columns="getDocumentFields()"
                :rows="documents"
                :rows-props="getDocumentFields()"
                :table-title="`${$t('data_found')}`"
                :enableSearch="true"
                @clickedRow="setMarkerClicked"
              />
              <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <TreeDotsLoading />
              </div>

              <TablePaginated
                v-if="hasFetchedDocuments"
                :isTimeExport="true"
                :selected-start-date="selectedStartDate"
                :selected-end-date="selectedEndDate"
                :header-columns="getMonitorsProps()"
                :rows="monitorsFound"
                :rows-props="getMonitorsProps()"
                :table-title="`${$t('last_monitors_data')}`"
                :enableSearch="false"
                @clickedRow="setMarkerClicked"
              />
              <div v-else style="height: calc(50vh); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <TreeDotsLoading />
              </div>
            </div>
          </transition>

          <p style="font-weight: 700;"> {{ $t('errors')}} </p>
          <section
            v-if="hasFetchedDocuments"
            class="dashboard__summary"
          >
            <scatter-chart
              v-for="(data, index) in errorsChartData" 
              :key="index"
              :data="data.data"
              :isHourSeries="true"
              :xAxisLabel="data.xAxisLabel"
              :yAxisLabel="data.yAxisLabel"
              :title="data.title"
              :subtitle="data.subtitle"
            ></scatter-chart>
          </section>

          <p style="font-weight: 700;"> {{ $t('metereological_parameters')}} </p>
          <section
            v-if="hasFetchedDocuments"
            class="dashboard__summary"
          >
            <scatter-chart
              v-for="(data, index) in scatterWeatherChartData" 
              :key="index"
              :data="data.data"
              :isHourSeries="true"
              :xAxisLabel="data.xAxisLabel"
              :yAxisLabel="data.yAxisLabel"
              :title="data.title"
              :subtitle="data.subtitle"
            ></scatter-chart>
          </section>

          <p style="font-weight: 700;"> {{ $t('pollutants_parameters')}} </p>
          <section
            v-if="hasFetchedDocuments"
            class="dashboard__summary"
          >
            <scatter-chart
              v-for="(data, index) in scatterPollutionChartData" 
              :key="index"
              :data="data.data"
              :isHourSeries="true"
              :xAxisLabel="data.xAxisLabel"
              :yAxisLabel="data.yAxisLabel"
              :title="data.title"
              :subtitle="data.subtitle"
            ></scatter-chart>
          </section>
        </div>
        <div v-else>
          <p style="font-weight: 400; margin: 15px 0px; font-style: italic; font-size: 0.8rem; text-align: center;">
            {{ $t('unexpected_error')}}
          </p>
        </div>
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
import BubbleMap from '../components/BubbleMap.vue'
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
    MarkerFeed,
    BubbleMap
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
      timestampRanges: {
        start: null,
        end: null
      },
      monitorsInList: [],
    }
  },
  mounted() {
    this.calculateTimestampRanges()
    this.fetchDocuments()
    this.pageLoaded = true
  },
  computed: {
    ...mapState(['locale']),
    summaryMonitorsProps() {
      return ['moqaID', 'quantity'].concat(logFields)
    },
    browserTimezoneOffset() {
      return new Date().getTimezoneOffset()
    },
    summaryMonitorsHeader() {
      return [
        'moqaID',
        this.$t('quantity')
      ].concat(logFields)
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
    period() {
      return `${this.formatTimestamp(this.timestampRanges.start.seconds)} ${this.$t('components.table_paginated.until')} ${this.formatTimestamp(this.timestampRanges.end.seconds)}`
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
      this.calculateTimestampRanges()
      this.markers = []
      this.fetchDocuments()
    },
    documents(newDocuments) {
      this.bargraph = this.groupDataByMoqaIDAndLogs(this.documents)
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
    calculateTimestampRanges() {
      const browserTimezoneOffset = new Date().getTimezoneOffset()
      const nowInTimestamp = Math.floor(Date.now()/ 1000) - (browserTimezoneOffset * 60)
      const rangeStartTimestamp = nowInTimestamp - (this.timeRange * 60)
      this.timestampRanges = {
        start: this.calculateFirebaseTimestamp(rangeStartTimestamp),
        end: this.calculateFirebaseTimestamp(nowInTimestamp),
      }
    },
    calculateBrowserTimezoneOffset() {
      return -new Date().getTimezoneOffset() / 60
    },
    getMarkersProps() {
      return markersProps
    },
    getDocumentFields() {
      return documentFields
    },
    formatTimestamp(timestamp) {
      return new Date(timestamp * 1000).toLocaleString( this.locale, { timeZone: 'UTC' });
    },
    setMarkerClicked(row) {
      this.markerClicked = this.markers.find(marker => marker.moqaID === row.moqaID)
    },
    async fetchMonitors() {

      try {
        const firestore = getFirestore()
        const markersCollection = collection(firestore, 'monitoring-control')

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
          this.updateMarkers()
          this.markersLoaded = true
        })
      } catch (error) {
        console.error('Erro ao buscar marcadores:', error)
      }
    },
    refreshPage() {
      this.calculateTimestampRanges()
      this.markers = []
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
        this.monitorsInList = this.transformeInList(this.groupDataByMoqaID(this.documents))
        this.documents.length > 0 ? this.fetchMonitors() : null
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
    createQuantityMap(data) {
      const quantityMap = {}

      data.forEach((item) => {
        const { moqaID, quantity } = item
        quantityMap[moqaID] = quantity
      })

      return quantityMap
    },
    updateMarkers() {

      const newMarkers = this.markers.map((marker) => {
        const markerDocument = this.monitorsInList.find((document) => document.moqaID === marker.idDb);

        if (markerDocument) {
          return {
            moqaID: markerDocument.moqaID,
            quantity: markerDocument.quantity,
            name: marker.name,
            lat: marker.lat,
            long: marker.long,
          };
        }

        return null
      })
    
      this.markers = newMarkers.filter((marker) => marker !== null)
    },
    transformeInList(obj) {
      return Object.keys(obj).map(key => {
        return {
          moqaID: key,
          quantity: obj[key]
        }
      })
    },
    groupDataByMoqaID(docs) {
      const dataCounts = {}

      docs.forEach(item => {
        const moqaID = item.moqaID;

        if (!dataCounts[moqaID]) {
          dataCounts[moqaID] = 0
        }

        dataCounts[moqaID]++
      })

      return dataCounts
    },
    groupDataByMoqaIDAndLogs(docs) {
      const groupedData = {}
      docs.forEach(doc => {
        const moqaID = doc.moqaID

        if (!groupedData[moqaID]) {
          groupedData[moqaID] = {
            moqaID,
            quantity: 0
          }

          logFields.forEach(field => {
            groupedData[moqaID][`${field}`] = 0
          })
        }

        groupedData[moqaID].quantity++

        logFields.forEach(field => {
          groupedData[moqaID][`${field}`] += doc[field]
        })
      })

      return Object.values(groupedData)
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

.feed__map {
  margin-bottom: 1.25rem;
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