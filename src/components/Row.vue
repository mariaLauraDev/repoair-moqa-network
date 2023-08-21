<template>
  <tr class="table__row">
    <Cell :content="index" />
    <Cell :content="rowContent.moqaID" />
    <Cell :content="formatedDate" />
    <Cell :content="rowContent.extTemp"/>
    <Cell :content="rowContent.alt" />
    <Cell :content="rowContent.rtcLog" />
    <Cell :content="rowContent.codeID" />
    <Cell :content="rowContent.boardID" />
    <Cell :content="rowContent.Pres" />
    <Cell :content="rowContent.hum" />
    <Cell :content="rowContent.intTemp" />
    <Cell :content="rowContent.pm1" />
    <Cell :content="rowContent.pm25" />
    <Cell :content="rowContent.adc0" />
    <Cell :content="rowContent.co2" />
    <Cell :content="rowContent.adc1" />
    <Cell :content="rowContent.adc2" />
    <Cell :content="rowContent.adc3" />
    <Cell :content="rowContent.tvocs" />
    <Cell :content="rowContent.adsLog" />
    <Cell :content="rowContent.ccsLog" />
    <Cell :content="rowContent.bmeLog" />
    <Cell :content="rowContent.pmsLog" />
    <Cell :content="rowContent.msdLog" />
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
  computed: {
    formatedDate () {
        return new Date(this.rowContent?.Timestamp?.seconds * 1000).toISOString()
    }
  }
}
</script>

<style scoped>

</style>