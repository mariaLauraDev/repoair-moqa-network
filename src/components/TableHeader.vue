<template>
  <thead>
    <tr class="table__header">
      <HeaderCell label="Nº" />
      <HeaderCell label="moqaID" />
      <HeaderCell label="Timestamp" />
      <HeaderCell label="Pressure" />
      <HeaderCell label="co2" />
      <HeaderCell label="pm25" />
      <HeaderCell label="pm10" />
    </tr>
  </thead>
</template>

<script>
import HeaderCell from './HeaderCell.vue';

export default {
  name: 'TableHeader',
  components: {
    HeaderCell
  }
}
</script>
