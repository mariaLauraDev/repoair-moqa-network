<template>
  <div>
    <transition name="fade" >
      <div
        v-if="pageLoaded"
      >
        <h1
          class="page-title space__medium--bottom"
        >
          {{ $t('routes.admin.title') }}
        </h1>
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
