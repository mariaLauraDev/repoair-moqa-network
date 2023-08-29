<template>
  <div class="download-view">
    <div class="download-view__container">
      <div class="download-header__container">
        <div class="download-header__title">
          <h2 id="instructions"> EXPORTAR RELATÓRIO CSV</h2>
        </div>
        <div class="download-header__options-container">
          <div class="download-header__option">
            <label for="startDate">
              <div>
                <small> Data inicial </small>
                <input type="date" id="startDate" v-model="selectedStartDate" aria-labelledby="instructions" required>
              </div>
            </label>
          </div>

          <div class="download-header__option">
            <label for="endDate">
              <div>
                <small> Data Final </small>
                <input type="date" id="endDate" v-model="selectedEndDate" aria-labelledby="instructions" required>
              </div>
            </label>
          </div>

          <button @click.prevent="fetchData" class="btn-action"> Download </button>
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
          <summary-data :documents="documents" :message="message" />
        </div>
      </div>
    </div>
    
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
      selectedStartDate: null,
      selectedEndDate: null,
      documents: [],
      message: 'Selecione um período para exportar os dados',
      numberOfDocuments: 0,
      downloading: false,
      user: null,
    }
  },
  computed: {
    isValidDateRange() {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        return false
      }
      return this.selectedStartDate <= this.selectedEndDate
    },
  }, 
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user.email
      }
    })
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
      const startDate = new Date(this.selectedStartDate + "T00:00:00").getTime()/1000
      const endDate = new Date(this.selectedEndDate + "T23:59:59").getTime()/1000 
      
      const startTimestamp = new Timestamp(startDate, 0)
      const endTimestamp = new Timestamp(endDate, 0)

      return {
        startTimestamp,
        endTimestamp
      }
    },
    async fetchDataFromFirestore() {
      try {
        this.downloading = true
        this.message = 'Carregando dados...'
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
        
        if(!!this.documents && this.documents.length > 0) {
          const csvData = this.convertToCsv(this.documents)
          download(csvData, `MoQa-${this.selectedStartDate}-${this.selectedEndDate}.csv`, 'text/csv')

          const downloadHistoryCollection = collection(firestore, 'download-history');
          const downloadRecord = {
            user: this.user,
            startDate: firebaseTimeStamps.startTimestamp,
            endDate: firebaseTimeStamps.endTimestamp,
            numberOfDocuments: this.numberOfDocuments,
            timestamp: new Date()
          };
          await addDoc(downloadHistoryCollection, downloadRecord);
        } else {
          this.message = 'Nenhum documento encontrado'
        }
      } finally {
        this.downloading = false
      }
    },
    saveHistoryDownloadUser () {

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
  justify-content: space-between;
  flex-wrap: nowrap;
  align-content: flex-start;
  width: 100%;
  margin: 30px 0;
}

.download-header__options-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end; //flex-end
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