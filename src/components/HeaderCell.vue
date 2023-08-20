<template>
  <th class="table__cell--header">{{ label }}</th>
</template>

<script>
export default {
  name: 'HeaderCell',
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.table__cell--header {
  text-align: left;
}
</style>