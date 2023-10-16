<template>
  <div class="table_container">
    <div>
      <div
        style="display: flex; justify-content: space-between; align-items: center;"
      >
        <p class="table__title"> {{ tableTitle }} </p>
        <div
          v-if="rows.length > 0"
        >
          <button
          @click.prevent="downloadCsv"
          class="btn-action--download"
          :class="{ 'downloading': !canDownloadData }"
          :disabled="!canDownloadData"
        >
          <span class="material-symbols-outlined" style="padding: 0.1rem 0"> download </span>
          <span style="margin-left: .5rem"> Exportar </span>
        </button>
        </div>
      </div>
      
      <div
        v-if="rows.length > 0"
      >
        <div
          class="table__content"
        >
          <table class="table">
            <thead>
              <tr class="row-header">
                <th
                  v-for="(column, index) in headerColumns"
                  :key="index"
                  class="header-cell">
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in displayedRows"
                :key="index"
                class="row"
              >
                <td
                  v-for="(rowProp, index) in rowsProps"
                  :key="index"
                  class="cell"
                >
                '{{ row[rowProp] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="rows.length > rowsPerPage" class="pagination">
          <button @click.prevent="firstPage" :disabled="currentPage === 1">Primeira</button>
          <button @click.prevent="prevPage" :disabled="currentPage === 1">Anterior</button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button @click.prevent="nextPage" :disabled="currentPage === totalPages">Próxima</button>
          <button @click.prevent="lastPage" :disabled="currentPage === totalPages">Última</button>
        </div>
      </div>
      <div v-else>
        <p>Não há dados para exibir.</p>
      </div>
    </div>
  </div>
</template>

<script>
import download from 'downloadjs';
import { getFirestore, collection, addDoc,Timestamp } from 'firebase/firestore'

export default {
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    rowsProps: {
      type: Array,
      required: true
    },
    headerColumns: {
      type: Array,
      required: true
    },
    tableTitle: {
      type: String,
      required: true
    },
    selectedStartDate: {
      type: String,
      required: true
    },
    selectedEndDate: {
      type: String,
      required: true
    },
    // user: {
    //   type: Object,
    //   required: true
    // },
  },
  data() {
    return {
      currentPage: 1,
      rowsPerPage: 5,
      downloading: false,
    }
  },
  computed: {
    isFirstPage() {
      return this.currentPage === 1;
    },
    isLastPage() {
      return this.currentPage === this.totalPages;
    },
    totalPages() {
      return Math.ceil(this.rows.length / this.rowsPerPage);
    },
    displayedRows() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.rows.slice(start, end);
    },
    canDownloadData () {
      return this.rows.length > 0 && !this.downloading
    }
  },
  methods: {
    firstPage () {
      this.currentPage = 1
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    lastPage () {
      this.currentPage = this.totalPages
    },
    async downloadCsv() {
      if (!this.rows || this.rows.length === 0) {
        console.log("Não é possível exportar dados vazios.")
        return
      }

      try {
        this.downloading = true
        const csvData = this.convertToCsv(this.rows)
        download(csvData, `${this.tableTitle.replace(/\s+/g, '-').toUpperCase()}-${this.selectedStartDate}-ate-${this.selectedEndDate}.csv`, 'text/csv')
        // const firestore = getFirestore()
        // const downloadHistoryCollection = collection(firestore, 'download-history')
        // const downloadRecord = {
        //   user: this.user,
        //   tableTitle: this.tableTitle,
        //   startDate: this.selectedStartDate,
        //   endDate: this.selectedEndDate,
        //   numberOfDocuments: this.rows.length,
        //   timestamp: new Date()
        // }
        // await addDoc(downloadHistoryCollection, downloadRecord)
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
            //to ISOString é deslocamento zero, to String é mais adequado porque considera o fuso
            const formattedTimestamp = timestamp.seconds*1000
            return formattedTimestamp
          } else {
            return row[field]
          }
        }).join(',')
      }).join('\n')

      return `${csvHeader}\n${csvData}`
    },
  }
}
</script>

<style lang="scss" scoped>
.table_container {
  margin-top: 1.25rem;
}

.table__title {
  font-weight: 700;
}

.table__content {
  display: flex;
  --scrollbar-thumb-radius: 0.375rem;
  border-width: 1px;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-top: 1.25rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.row-header {
  font-size: .75rem;
  line-height: 1rem;
  text-align: left;
  border-bottom-width: 1px;
}

.header-cell {
  text-transform: uppercase;
  color: #64748b;
  font-weight: 500;
  padding: 1rem;
}

.row {
  font-size: .875rem;
  line-height: 1.25rem;
  text-align: left;
  border-bottom-width: 1px;
}

.cell {
  padding: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem;
  margin: 0 0.25rem;
  border-radius: 0.375rem;
  border-width: 1px;
  cursor: pointer;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 500;
  font-size: .75rem;
  line-height: 1rem;
  text-align: left;
}

.pagination button:hover {
  color: $color-primary;
  background-color: rgba(178, 199, 78, 0.3);
}

.pagination button[disabled] {
  cursor: not-allowed;
}

.pagination span {
  margin: 0 0.5rem;
  text-transform: uppercase;
  font-weight: 500;
  font-size: .75rem;
  line-height: 1rem;
}

.btn-action--download {
  display: flex;
  align-items: center;
  padding: 0.1rem 0.5rem;
  border-radius: 0.375rem;
  border-width: 1px;
  cursor: pointer;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 500;
  font-size: .75rem;
  line-height: 1rem;
  text-align: left;
  color: $color-primary;
  background-color: rgba(178, 199, 78, 0.3);
}

.btn-action--download:hover {
  color: #64748b;
  background-color: #fff;
}

.downloading {
  cursor: not-allowed;
  color: #64748b;
  background-color: #fff;
}
</style>