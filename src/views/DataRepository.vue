<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="download-view">
        <div class="download-view__container">
          <p style="font-weight: 600"> Selecione um período para exportar os dados:</p>
          <div
            class="download-header__container"
            style="border-width: 1px; border-radius: 0.375rem; padding-bottom: 1.25rem; padding-top: 1.25rem; padding-left: 1rem; padding-right: 1rem;"
          >
            <!-- <div class="download-header__title">
              <h2 id="instructions"> CONSULTA DE DADOS</h2>
            </div> -->
            <div class="download-header__options-container">

              <!-- <div class="download-header__options-group" style="display: flex; flex-direction: column; align-items: leaft; justify-content: flex-start; gap: 5px"> -->
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
              <!-- </div> -->

              <!-- <div class="download-header__options-group" style="display: flex; flex-direction: column; align-items: leaft; justify-content: flex-start; gap: 5px"> -->
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
              <!-- </div> -->
            </div>
            <div class="download-header__actions" style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: 10px">
              <button
                @click.prevent="fetchData"
                :disabled="!canSearchData"
                class="btn-action"
                :class="{ 'disabled': !canSearchData }"
                style="display: flex; align-items: center ; padding: 0.3rem 0.3rem;"
              >
                <span class="material-symbols-outlined" style="color: #fff"> search </span>
              </button>
              <button
                @click.prevent="downloadCsv"
                :class="{ 'disabled': !canDownloadData }"
                :disabled="!canDownloadData"
                class="btn-action"
                style="display: flex; align-items: center ; padding: 0.3rem 0.3rem;"
              >
                <span class="material-symbols-outlined" style="color: #fff"> arrow_downward </span>
              </button>
            </div>
          </div>
          
          <!-- <label for="startDate">Data de Início:</label>
          <input type="date" id="startDate" v-model="selectedStartDate" aria-labelledby="instructions" /> -->
          <!-- <label for="endDate">Data de Término:</label>
          <input type="date" id="endDate" v-model="selectedEndDate" aria-labelledby="instructions" /> -->
    
          <div class="download-body">
            <div class="download-body__summary">
              <div class="download-body__count">
                <p v-if="numberOfDocuments > 0" aria-live="polite">{{ numberOfDocuments }} documentos encontrados</p>
              </div>
            </div>
            <div class="downlod-body__data">
              <summary-data :documents="documents" :message="message" :header-columns="summaryHeader"/>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
import SummaryData from '../components/SummaryData.vue';

export default {
  components: {
    SummaryData
  },
  data() {
    return {
      pageLoaded: false,
      selectedStartDate: null,
      selectedEndDate: null,
      selectedStartTime: '00:00',
      selectedEndTime: '23:59',
      documents: [],
      message: '',
      numberOfDocuments: 0,
      downloading: false,
      fetching: false,
      user: null,
      today: new Date().toISOString().slice(0, 10),
      messages: ['Selecione um período para exportar os dados', 'Carregando dados...', 'Nenhum dado encontrado para os filtros selecionados'],
      summaryHeader: ["Nº", "moqaID", "Timestamp", "extTemp", "alt", "codeID", "boardID", "Pres", "hum", "intTemp", "pm1", "pm25", "adc0", "co2", "adc1", "adc2", "adc3", "tvocs", "adsLog", "ccsLog", "bmeLog", "pmsLog", "msdLog", "rtcLog"]
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
        this.fetching = true
        this.message = this.messages[1]
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

        this.documents.length === 0 ? this.message = this.messages[2] : this.message = this.messages[1]
      } finally {
        this.fetching = false
      }
    },
    async downloadCsv () {
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
  margin: 15px 0;
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

@media (max-width: 780px) {
  .download-header__container {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    align-items: center;
    gap:10px
  }

  .download-header__options-container {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    align-items: center;
    width: 250px;
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
}

</style>