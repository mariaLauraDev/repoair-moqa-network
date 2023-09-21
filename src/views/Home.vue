<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="home-page">
        <ParticlesBackground />
    
        <div class="home-page__content">
          <div class="home-page__title">
            <h1>Repositório de Dados</h1>
          </div>
          <div class="home-page__subtitle">
            <h2>Monitoramento da Qualidade do Ar - Rede MoQA</h2>
          </div>
        </div>
      </div>
    </transition>
  </div>
  
</template>

<script>
import ParticlesBackground from "@/components/ParticlesBackground.vue";

export default {
  components: {
    ParticlesBackground
  },
  data() {
    return {
      pageLoaded: false,
    }
  },
  mounted() {
    this.pageLoaded = true
  },
};
</script>

<style lang="scss">
.home-page {
  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: transparent;
  }

  &__title {
    text-align: center;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background: transparent;
    
    h1 {
      color: $color-primary;
      margin-bottom: 10px;
      font-size: $title-font-size;
      background: transparent;
    }
  }
  
  &__subtitle {
    background-color: transparent;

    h2 {
      font-size: $subtitle-font-size;
      font-weight: $semibold-font-weight;
      color: $color-secondary;
      background-color: transparent;
    }
  }
}

</style>
