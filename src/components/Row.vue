<template>
  <tr class="table__row">
    <Cell :content="index" />
    <Cell :content="rowContent.moqaID" />
    <Cell :content="rowContent.Timestamp.seconds" />
    <Cell :content="rowContent.Pres" />
    <Cell :content="rowContent.co2" />
    <Cell :content="rowContent.pm25" />
    <Cell :content="rowContent.pm10" />
  </tr>
</template>

<script>
import Cell from './Cell.vue'

export default {
  name: 'Row',
  props: {
      rowContent: Object,
      index: Number
  },
  components: {
    Cell
  },
  methods: {
    formatDate () {
      const date = new Date(this.rowContent.Timestamp.seconds * 1000)
      return date.toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped>

</style>