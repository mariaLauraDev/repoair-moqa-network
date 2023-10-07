<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="download-view">
        <div class="download-view__container">
          <h1
            class="page-title space__medium--bottom"
            style="font-weight: 600"
          >
            Baixar relatórios
          </h1>
          <div
            class="download-header__container"
            style="padding-top: 0.25rem; padding-bottom: 1.25rem;"
          >
            <div class="download-header__options-container">

              <div class="download-header__options-group">
                <div class="download-header__option">
                  <label for="startDate">
                    <div>
                      <small> Data inicial </small>
                      <input
                        type="date"
                        id="startDate"
                        v-model="selectedStartDate"
                        aria-labelledby="instructions"
                        min="2023-07-15" :max="today"
                        pattern="\d{4}-\d{2}-\d{2}"
                        required>
                    </div>
                  </label>
                </div>
  
                <div class="download-header__option">
                  <label for="startTime">
                    <div>
                      <small> Hora inicial </small>
                      <input
                        v-model="selectedStartTime"
                        type="time"
                        id="startTime"
                        name="startTime"
                        max="23:59"
                        aria-labelledby="instructions"
                        required >
                    </div>
                  </label>
                </div>
              </div>

              <div class="download-header__options-group">
                <div class="download-header__option">
                  <label for="endDate">
                    <div>
                      <small> Data Final </small>
                      <input
                        type="date"
                        id="endDate"
                        v-model="selectedEndDate"
                        aria-labelledby="instructions"
                        :min="selectedStartDate"
                        :max="today"
                        pattern="\d{4}-\d{2}-\d{2}"
                        required
                      >
                    </div>
                  </label>
                </div>
  
                <div class="download-header__option">
                  <label for="endTime">
                    <div>
                      <small> Hora final </small>
                      <input
                      v-model="selectedEndTime"
                        type="time"
                        id="endTime"
                        name="endTime"
                        min="00:00"
                        max="23:59"
                        aria-labelledby="instructions"
                        required
                      >
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div class="download-header__actions">
              <button
                @click.prevent="fetchData"
                class="btn-action--search"
                :class="{ 'fetching': !canSearchData }"
                :disabled="!canSearchData"
                >
                <span class="material-symbols-outlined" style="padding: 0.1rem 0; color: #fff"> search </span>
              </button>
            </div>
          </div>
          
          <!-- <hr class="divider" /> -->

          <div v-if="fetching" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; margin-top: 2rem;">
            <TreeDotsLoading />
          </div>
          <div v-if="numberOfDocuments > 0">
            <p class="title"> Resumo </p>
            <section
              class="download-header__summary"
            >
              <Card title="Total de dados" :value="numberOfDocuments + ' documentos'" description="no período selecionado"/>
              <Card title=" Total de monitores" :value="numberOfMonitors" description="no período selecionado"/>
            </section>
      
            <TablePaginated
              :header-columns="monitorsHeader"
              :rows="monitorsFound"
              :rows-props="monitorsProps"
              table-title="Últimos dados dos monitores"
              :user="user"
              :selected-start-date="selectedStartDate"
              :selected-end-date="selectedEndDate"
            />

            <TablePaginated
              :header-columns="summaryHeader"
              :rows="documents"
              :rows-props="summaryHeader"
              table-title="Dados encontrados"
              :user="user"
              :selected-start-date="selectedStartDate"
              :selected-end-date="selectedEndDate"
            />
          </div>
          <div v-else>
            <p style="margin-top: 2rem;"> {{ message }} </p>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Card from '../components/Card.vue'
import TablePaginated from '../components/TablePaginated.vue';
import TreeDotsLoading from '../components/TreeDotsLoading.vue';
import {
  collection,
  getDocs,
  addDoc,
  limit,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'

import download from 'downloadjs';

export default {
  components: {
    TablePaginated,
    Card,
    TreeDotsLoading
  },
  data() {
    return {
      pageLoaded: false,
      selectedStartDate: null,
      selectedEndDate: null,
      selectedStartTime: '00:00',
      selectedEndTime: '23:59',
      documents: [],
      monitorsFound: [],
      message: '',
      tableTitle: 'Dados encontrados',
      numberOfDocuments: 0,
      numberOfMonitors: 0,
      downloading: false,
      fetching: false,
      user: null,
      today: new Date().toISOString().slice(0, 10),
      messages: ['Selecione um período para exportar os dados', 'Carregando dados...', 'Nenhum dado encontrado para os filtros selecionados'],
      summaryHeader: ["moqaID", "Timestamp", "extTemp", "alt", "codeID", "boardID", "Pres", "hum", "intTemp", "pm1", "pm25", "adc0", "co2", "adc1", "adc2", "adc3", "tvocs", "adsLog", "ccsLog", "bmeLog", "pmsLog", "msdLog", "rtcLog"],
      monitorsHeader: ["moqaID", "lastTimestamp", "extTemp", "alt", "codeID", "boardID", "Pres", "hum", "intTemp", "pm1", "pm25", "adc0", "co2", "adc1", "adc2", "adc3", "tvocs", "adsLog", "ccsLog", "bmeLog", "pmsLog", "msdLog", "rtcLog"],
      monitorsProps: ["moqaID", "lastTimestamp", "extTemp", "alt", "codeID", "boardID", "Pres", "hum", "intTemp", "pm1", "pm25", "adc0", "co2", "adc1", "adc2", "adc3", "tvocs", "adsLog", "ccsLog", "bmeLog", "pmsLog", "msdLog", "rtcLog"]
    }
  },
  computed: {
    isValidDateRange() {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        return false
      }
      return this.selectedStartDate <= this.selectedEndDate
    },
    canSearchData () {
      return this.isValidDateRange && !this.fetching && !this.downloading
    },
    canDownloadData () {
      return this.documents.length > 0 && !this.fetching && !this.downloading
    }
  }, 
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user.email
      }
    })
    this.pageLoaded = true
  },
  methods: {
    fetchData() {
      if (!this.isValidDateRange) {
        this.message = 'Período de datas inválido. \n A data de início deve ser anterior à data de término.'
        return
      }

      return this.fetchDataFromFirestore()
    },
    getFirebaseTimeStamps() {
      const startDate = new Date(this.selectedStartDate + "T" + this.selectedStartTime + ":00").getTime()/1000
      const endDate = new Date(this.selectedEndDate + "T"+ this.selectedEndTime+ ":59").getTime()/1000 
      const startTimestamp = new Timestamp(startDate, 0)
      const endTimestamp = new Timestamp(endDate, 0)

      return {
        startTimestamp,
        endTimestamp
      }
    },
    async fetchDataFromFirestore() {
      try {
        this.documents = []
        this.monitorsFound = []
        this.numberOfDocuments = 0
        this.numberOfMonitors = 0
        this.message = ''
        this.fetching = true
        const firestore = getFirestore()
        const pollutantsCollection = collection(firestore, 'system-1')

        let documentsQuery = null
        const firebaseTimeStamps = this.getFirebaseTimeStamps()

        documentsQuery = query(
          pollutantsCollection,
          where("Timestamp", ">=", firebaseTimeStamps.startTimestamp),
          where("Timestamp", "<=", firebaseTimeStamps.endTimestamp),
          orderBy('Timestamp', 'desc'),
          limit(10000)
        )
        const querySnapshot = await getDocs(documentsQuery);

        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push(doc.data())
        });
        this.numberOfDocuments = querySnapshot.size
        this.documents = docs
        this.extractMonitorsFound()

        this.documents.length === 0 ? this.message = this.messages[2] : ''
      } finally {
        this.fetching = false
      }
    },
    async downloadCsv() {
      if (!this.documents || this.documents.length === 0) {
        this.message = "Não é possível exportar dados vazios."
        return
      }

      try {
        this.downloading = true
        const csvData = this.convertToCsv(this.documents)
        download(csvData, `MoQa-${this.selectedStartDate}-${this.selectedEndDate}.csv`, 'text/csv')
        const firestore = getFirestore()
        const firebaseTimeStamps = this.getFirebaseTimeStamps()
        const downloadHistoryCollection = collection(firestore, 'download-history')
        const downloadRecord = {
          user: this.user,
          startDate: firebaseTimeStamps.startTimestamp,
          endDate: firebaseTimeStamps.endTimestamp,
          numberOfDocuments: this.numberOfDocuments,
          timestamp: new Date()
        }
        await addDoc(downloadHistoryCollection, downloadRecord)
      } finally {
        this.downloading = false
      }
    },
    extractMonitorsFound() {
      const monitors = [];
      const moqaIDs = new Set()

      this.documents.forEach((document) => {
        const {
          moqaID,
          Timestamp,
          extTemp,
          alt,
          codeID,
          boardID,
          Pres,
          hum,
          intTemp,
          pm1,
          pm25,
          adc0,
          co2,
          adc1,
          adc2,
          adc3,
          tvocs,
          adsLog,
          ccsLog,
          bmeLog,
          pmsLog,
          msdLog,
          rtcLog } = document

        if (!moqaIDs.has(moqaID)) {
          monitors.push({
            moqaID,
            lastTimestamp: new Date(Timestamp.seconds * 1000).toISOString(),
            extTemp,
            alt,
            codeID,
            boardID,
            Pres,
            hum,
            intTemp,
            pm1,
            pm25,
            adc0,
            co2,
            adc1,
            adc2,
            adc3,
            tvocs,
            adsLog,
            ccsLog,
            bmeLog,
            pmsLog,
            msdLog,
            rtcLog
          })
          moqaIDs.add(moqaID)
        }
      });
      
      this.monitorsFound = monitors
      this.numberOfMonitors = monitors.length
    },
    convertToCsv(data) {
      const fields = Object.keys(data[0])

      const csvHeader = fields.join(',')

      const csvData = data.map((row) => {
        return fields.map((field) => {
          if (field === 'Timestamp') {
            const timestamp = row[field]
            const formattedTimestamp = new Date(timestamp.seconds * 1000).toISOString()
            return formattedTimestamp
          } else {
            return row[field]
          }
        }).join(',')
      }).join('\n')

      return `${csvHeader}\n${csvData}`
    },
  },
};
</script>

<style lang="scss">

.download-header__container {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  gap:10px;
  background-color: whitesmoke;
  padding: 15px;
}

.download-header__options-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  width: 250px;
}

.download-header__options-group{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 20px;
  margin-top: 0.75rem;
}

.download-header__option {
  width: 100%;
}

.btn-action{
  width: 100%;
}

.download-header__title {
  text-align: center;
}

.download-header__summary {
  display: grid;
  gap: 1.25rem;
}

.title {
  font-weight: 700;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
}

.divider {
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  margin: 0;
  border-top-width: 1px;
  color: inherit;
  height: 0;
}

.download-header__actions {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  align-items: right;
  gap: 10px;
  width: 100%;
}

.btn-action--search {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.5rem;
  border-radius: 0.375rem;
  border-width: 1px;
  margin-top: .75rem;
  cursor: pointer;
  text-transform: uppercase;
  color: #fff;
  font-weight: 500;
  font-size: .75rem;
  line-height: 1rem;
  text-align: left;
  width: 100%;
  color: $color-primary;
  background-color: $color-primary;
}

h1 {
  font-size: 1.5em;
}

h1 {
  display: block;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

label div input {
  background: #fff !important;
}


.fetching {
  background: $color-primary !important;
  border-color:  $color-primary !important;
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 780px) {
  .download-view{
    margin: 0;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  
    &__container {
      padding: 0 20px;
      box-sizing: border-box;
      max-width: 1520px;
      margin: 0 auto;
      width: 100%;
      gap:10px
    }
  }
  
  .download-header__title {
    font-size: $subtitle-font-size;
    color: $color-primary;
    font-weight: $semibold-font-weight;
    width: 100%;
    text-align: left;
  }
  
  .download-header__container{
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-content: flex-start;
    width: 100%;
    margin-top: 15px;
  }
  
  .download-header__options-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start; //flex-end
    align-items: right; //right
    gap: 20px;
    width: 100%;
  }

  .download-header__summary {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .btn-action--search {
    width: 42px;
    height: 42px;
  }
}

</style>