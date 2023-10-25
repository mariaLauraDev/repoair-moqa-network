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
          v-if="enableExportButton" 
          @click.prevent="downloadCsv"
          class="btn-action--download"
          :class="{ 'downloading': !canDownloadData }"
          :disabled="!canDownloadData"
        >
          <span class="material-symbols-outlined" style="padding: 0.1rem 0"> download </span>
          <span style="margin-left: .5rem"> {{$t('components.table_paginated.export')}} </span>
        </button>
        </div>
      </div>

      <div v-if="enableSearch">
        <input
          class="search-input"
          v-model="searchText"
          @input="filterRows"
          :placeholder="$t('components.table_paginated.type_to_search')"
        />
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
            <tbody
              v-if="enableSearch"
            >
              <tr
                @click.prevent="handleClickRow(row)"
                v-for="(row, index) in filteredRowsBySearch"
                :key="index"
                class="row"
              >
                <td
                  v-for="(rowProp, index) in rowsProps"
                  :key="index"
                  class="cell"
                >
                {{ rowProp ==='Timestamp' ? row[rowProp]?.seconds : row[rowProp] }}
                </td>
              </tr>
            </tbody>
            <tbody
              v-else
            >
              <tr
                @click.prevent="handleClickRow(row)"
                v-for="(row, index) in displayedRows"
                :key="index"
                class="row"
              >
                <td
                  v-for="(rowProp, index) in rowsProps"
                  :key="index"
                  class="cell"
                >
                {{ rowProp ==='Timestamp' ? row[rowProp]?.seconds : row[rowProp] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="rows.length > rowsPerPage" class="pagination">
          <button @click.prevent="firstPage" :disabled="currentPage === 1">{{$t('components.table_paginated.first')}}</button>
          <button @click.prevent="prevPage" :disabled="currentPage === 1"> {{ $t('components.table_paginated.before') }}</button>
          <span> {{ $t('components.table_paginated.page') }} {{ currentPage }} {{ $t('components.table_paginated.of') }} {{ totalPages }}</span>
          <button @click.prevent="nextPage" :disabled="currentPage === totalPages">{{ $t('components.table_paginated.next') }}</button>
          <button @click.prevent="lastPage" :disabled="currentPage === totalPages">{{ $t('components.table_paginated.last') }}</button>
        </div>
      </div>
      <div v-else>
        <p> {{ $t('components.table_paginated.without_data_to_show')}} </p>
      </div>
    </div>
  </div>
</template>

<script>
import download from 'downloadjs';

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
      default: () => ''
    },
    selectedEndDate: {
      type: String,
      default: () => ''
    },
    isTimeExport: {
      type: Boolean,
      default: false
    },
    enableExportButton: {
      type: Boolean,
      default: true
    },
    enableSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPage: 1,
      rowsPerPage: 5,
      downloading: false,
      searchText: '',
      filteredRows: []
    }
  },
  mounted() {
    this.filterRows()
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
    filteredRowsBySearch() {
      const start = (this.currentPage - 1) * this.rowsPerPage
      const end = start + this.rowsPerPage;

      return this.filteredRows.slice(start, end)
    },
    canDownloadData () {
      return this.rows.length > 0 && !this.downloading
    }
  },
  methods: {
    filterRows() {
      console.log(this.searchText)
      if (this.searchText === "") {
        this.currentPage = 1;
        this.filteredRows = [...this.rows]
        return
      }

      const search = this.searchText.toLowerCase()

      this.currentPage = 1
      this.filteredRows = this.rows.filter((row) => {
        const rowText = this.rowsProps.map((rowProp) => {
          const cellValue = row[rowProp]
          return cellValue ? cellValue.toString().toLowerCase() : ""
        }).join(" ")

        return rowText.includes(search)
      })
    },
    handleClickRow(row) {
      this.$emit('clickedRow', row)
    },
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
        return
      }

      try {
        this.downloading = true
        const csvData = this.convertToCsv(this.rows)
        const documentTitleExport =
          this.isTimeExport ?
          `${this.tableTitle.replace(/\s+/g, '-').toUpperCase()}-${this.selectedStartDate}-${this.$t('components.table_paginated.until')}-${this.selectedEndDate}.csv`
          :
          `${this.tableTitle.replace(/\s+/g, '-').toUpperCase()}.csv`
        download(csvData, documentTitleExport, 'text/csv')
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
            const formattedTimestamp = timestamp.seconds
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
  margin-bottom: 1.25rem;
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

.row:hover {
  background-color: rgba(178, 199, 78, 0.3);
  cursor: pointer;
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

.search-input {
  width: 100%;
  margin-top: .8rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border-width: 1px;
  font-size: .875rem;
  line-height: 1.25rem;
  text-align: left;
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