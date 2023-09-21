<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="dashboard">
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageLoaded: false,
    }
  },
  mounted() {
    this.pageLoaded = true
  },
}
</script>

<style lang="scss" scoped>

</style>