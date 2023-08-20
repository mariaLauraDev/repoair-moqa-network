<template>
  <td class="table__cell">{{ content }}</td>
</template>

<script>
export default {
  name: 'Cell',
  props: {
      content: {
      type: [String, Number],
      required: true
      }
  }
}
</script>


<style scoped>
</style>