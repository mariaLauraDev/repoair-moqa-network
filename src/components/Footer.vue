<template>
  <footer class="footer">
    <!-- <section class="footer__header container">
      <article>
        <h3>Sobre o site</h3>
        <ul class="footer__policies">
          <li>Termos de uso</li>
          <li>Contato</li>
          <li>Política de privacidade</li>
          <li>Sobre nós</li>
        </ul>
      </article>
    </section> -->
    <div class="footer__finalize container">
      <p data-v-79f4cbe3="">Copyright © 2023 TRAMA Labs. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #DEDFE0;
  padding: 30px 0 15px;
  color: $color-text;
  position: relative;
  z-index: 1000 !important;
}

.footer .footer__header{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 30px;
  flex-wrap: wrap;
  text-align: left;
  margin-top: 20px;
}

.footer section{
  grid-gap: 20px;
  gap: 20px;
}

.container {
  width: 100%;
  max-width: 1520px;
}

.container {
  margin: 0 auto;
  padding: 0 15px;
}

.footer section article {
  margin: 10px 0;
  max-width: 260px;
  min-width: 200px;
}

.footer h2, .footer h3 {
  background: #333;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
}

.footer__header h3 {
  margin-bottom: 5px;
}

.footer .footer__finalize {
  color: $color-primary;
  font-weight: bold;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
}


</style>