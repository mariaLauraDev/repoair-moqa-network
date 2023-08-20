<template>
  <div>
    <p>Selecione um período para visualizar os dados.</p>
    <label for="startDate">Start Date:</label>
    <input type="date" id="startDate" v-model="selectedStartDate" />
    <label for="endDate">End Date:</label>
    <input type="date" id="endDate" v-model="selectedEndDate" />
    <button @click="fetchData" :disabled="!isValidDateRange"> Download </button>

    <p v-if="numberOfDocuments > 0"> {{numberOfDocuments}} documents found</p>
    <summary-data :documents="documents" :message="message" />
  </div>
</template>

<script>
import { getFirestore } from 'firebase/firestore'
import {
  collection,
  getDocs,
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
      message: 'Sem dados para exibir',
      numberOfDocuments: 0,
    };
  },
  computed: {
    isValidDateRange() {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        return false
      }
      return this.selectedStartDate <= this.selectedEndDate
    },
  },
  methods: {
    fetchData() {
      if (!this.isValidDateRange) return

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
        download(csvData, `MOQA-${this.selectedStartDate}-${this.selectedEndDate}.csv`, 'text/csv')
      } else {
        this.message = 'Nenhum documento encontrado'
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
