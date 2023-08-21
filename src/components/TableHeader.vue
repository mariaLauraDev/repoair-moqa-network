<template>
  <thead>
    <tr class="table__header">
      <HeaderCell label="Nº" />
      <HeaderCell label="moqaID" />
      <HeaderCell label="Timestamp" />
      <HeaderCell label="extTemp" />
      <HeaderCell label="alt" />
      <HeaderCell label="codeID" />
      <HeaderCell label="boardID" />
      <HeaderCell label="Pres" />
      <HeaderCell label="hum" />
      <HeaderCell label="intTemp" />
      <HeaderCell label="pm1" />
      <HeaderCell label="pm25" />
      <HeaderCell label="adc0" />
      <HeaderCell label="co2" />
      <HeaderCell label="adc1" />
      <HeaderCell label="adc2" />
      <HeaderCell label="adc3" />
      <HeaderCell label="tvocs" />
      <HeaderCell label="adsLog" />
      <HeaderCell label="ccsLog" />
      <HeaderCell label="bmeLog" />
      <HeaderCell label="pmsLog" />
      <HeaderCell label="msdLog" />
      <HeaderCell label="rtcLog" />
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
