<template>
  <div class="container not-found">
    <div class="not-found__container">
      <div class="not-found__content">
        <div class="not-found__title">
          <h1> {{$t('routes.not_found.title')}} </h1>
        </div>
        <div class="not-found__subtitle">
          <h2> {{$t('routes.not_found.subtitle')}} </h2>
        </div>
        <router-link
          class="btn-route"
          to="/"
        >
          {{$t('routes.not_found.action')}}
        </router-link>
      </div>
      
      <NotFoundVector />
    </div>
  </div>
</template>

<script>
import NotFoundVector from '../components/NotFoundVector.vue'

export default {
  components: {
    NotFoundVector
  }
}
</script>

<style lang="scss">
.not-found__container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-route {
  margin: 1rem 0px;
  background-color: #588E4D;
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: $semibold-font-weight;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.not-found {
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
    max-width: 300px;


    h2 {
      font-size: 18px;
      text-align: center;
      font-weight: $semibold-font-weight;
      color: $color-secondary;
    }
  }
}

@media (min-width: 768px) {
  .not-found__container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .not-found {
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
      max-width: 100%;

      h2 {
        text-align: left;
        font-size: 24px;
      }
    }
  }
}
</style>