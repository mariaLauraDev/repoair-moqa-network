<template>
  <div>
    <transition name="fade">
      <div v-if="pageLoaded" class="container home-page">
        <ParticlesBackground />

        <div class="home-page__container">
          <div class="home-page__content">
            <div class="home-page__title">
              <h1> {{ $t('routes.home.title') }} </h1>
            </div>
            <div class="home-page__subtitle">
              <h2> {{ $t('routes.home.subtitle') }} </h2>
            </div>
          </div>
          
          <PeopleWithDashboard />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ParticlesBackground from "@/components/ParticlesBackground.vue"
import PeopleWithDashboard from  "@/components/PeopleWithDashboard.vue"

export default {
  components: {
    ParticlesBackground,
    PeopleWithDashboard
  },
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

<style lang="scss">
.people-with-dashboard {
  position: relative;
  z-index: 5;
  margin-top: 20px;
}

.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh; 

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
  }

  &__title {
    text-align: center;
    white-space: nowrap;
    background-color: white;
    
    h1 {
      color: $color-primary;
      margin-bottom: 10px;
      font-size: 24px;
    }
  }
  
  &__subtitle {
    background-color: white;

    h2 {
      font-size: 18px;
      font-weight: $semibold-font-weight;
      color: $color-secondary;
    }
  }
}

@media (min-width: 768px) {
  .people-with-dashboard {
    height: 100%;
    width: 800px;
    margin-top: 0px;
  }

  .home-page__container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .home-page {
    &__content {
      padding: 40px;
      align-items: flex-start;
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
