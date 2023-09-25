<template>
  <div class="table_container">
    <p class="table__title"> {{ tableTitle }} </p>
    <div class="table__content">
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
              {{ row[rowProp] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="rows.length > rowsPerPage" class="pagination">
      <button v-if="!isFirstPage" @click.prevent="firstPage" :disabled="currentPage === 1">Primeira</button>
      <button v-if="!isFirstPage" @click.prevent="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button v-if="!isLastPage" @click.prevent="nextPage" :disabled="currentPage === totalPages">Próxima</button>
      <button v-if="!isLastPage" @click.prevent="lastPage" :disabled="currentPage === totalPages">Última</button>
    </div>
  </div>
</template>

<script>
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
      }
    },
    data() {
      return {
        currentPage: 1,
        rowsPerPage: 10
      };
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
      }
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
</style>