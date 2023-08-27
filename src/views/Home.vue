<template>
  <div class="home-page">
    <ParticlesBackground />

    <div class="home-page__content">
      <div class="home-page__title">
        <h1>Portal de Qualidade do ar</h1>
        <h2>Dispositivos Moqa</h2>
      </div>
    </div>
  </div>
</template>

<script>
import ParticlesBackground from "@/components/ParticlesBackground.vue";

export default {
  components: {
    ParticlesBackground
  },
};
</script>

<style lang="scss">
.home-page__content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.home-page__title {
  text-align: center;
  color: $color-primary;
}

.home-page__title h1 {
  margin-bottom: 10px;
  font-size: 36px;
}

.home-page__title h2 {
  font-size: 24px;
  font-weight: normal;
  color: $color-secondary; /* Defina a cor do subtítulo */
}
</style>
