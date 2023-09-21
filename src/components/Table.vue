<template>
  <table class="table">
    <TableHeader :header-columns="headerColumns"/>
    <tbody>
      <Row v-for="(row, index) in rows" :rowContent="row" :key="index" :index="index"/>
    </tbody>
  </table>
</template>

<script>
import Row from './Row.vue';
import TableHeader from './TableHeader.vue';

export default {
  name: 'Table',
  components: {
    Row,
    TableHeader
  },
  props: {
    rows: {
      type: Array,
      required: true
    },
    headerColumns: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
