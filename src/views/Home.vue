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
    min-height: 100vh; 
    background: transparent;
    padding: 20px;
  }

  &__title {
    text-align: center;
    white-space: nowrap;
    
    h1 {
      color: $color-primary;
      margin-bottom: 10px;
      font-size: 24px;
    }
  }
  
  &__subtitle {
    h2 {
      font-size: 18px;
      font-weight: $semibold-font-weight;
      color: $color-secondary;
    }
  }
}

@media (min-width: 768px) {
  .home-page {
    &__content {
      padding: 40px;
    }

    &__title {
      h1 {
        font-size: 36px;
      }
    }
    
    &__subtitle {
      h2 {
        font-size: 24px;
      }
    }
  }
}
</style>
