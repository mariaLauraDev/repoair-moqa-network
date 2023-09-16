<template>
  <nav>
    <div v-if="!isLoggedIn && !isLoginRoute">
      <!-- Opção de login e logo para usuários não logados e não na rota de login -->
    </div>
    <div v-else>
      <!-- Navegação lateral para usuários logados -->
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true
    },
    isLoginRoute: {
      type: Boolean,
      required: true
    }
  },
};
</script>

<style scoped>
/* Estilos para desktop, se necessário */
</style>
