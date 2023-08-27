<template>
  <header class="header" v-if="showNavbar">
    <div class="header__container">
      <div class="logo">
        <router-link to="/" style="justify-content: center">
          <img
            width="auto"
            height="100px"
            loading="lazy"
            class="logo__img"
            src="./assets/images/logo.webp"
            alt="Logo Moqa Portal"
            title="Logo Moqa Portal">
        </router-link>
      </div>
      <nav>
        <ul class="header__menu">
          <li>
            <router-link
              v-if="isLoggedIn"
              to="/portal"
            > 
              Portal
            </router-link>
          </li>
          <li>
            <router-link
              v-if="!isLoggedIn"
              to="/log-in"
              class="btn-login"
            > 
              Entrar 
            </router-link>

            <div
              v-else
              @click="handleSignOut"
              class="btn-logout"
            >
              Sair
          </div>
          </li>
          <!-- <li>
            <router-link to="/register">Register</router-link> |
          </li> -->
        </ul>
      </nav>
    </div>
  </header>
  <router-view/>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

export default {
  data() {
    return {
      auth: null,
      isLoggedIn: false,
    }
  },
  mounted() {
    this.auth = getAuth()
    onAuthStateChanged(this.auth, (currentUser) => {
      if (currentUser) {
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    })
  },
  computed: {
    showNavbar() {
      return this.$route.path !== '/log-in'
    },
  },
  methods: {
    async handleSignOut() {
      try {
        await signOut(this.auth)
        this.$router.push('/')
        console.log('Signed out successfully.')
      } catch (error) {
        console.error('Error signing out:', error.message)
      }
    }
  }
}
</script>

<style lang="scss">
.header {
  &__container {
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .logo {
    width: auto;
    display: flex;
    align-items: center;
    z-index: 500;
    
    &__img {
      height: 60px;
      margin-right: 2px;
      width: auto;
      z-index: 600;
    }
  }

  ul {
    list-style: none;
  }

  .header__menu, .header__menu-modal{
    display: flex;
    justify-content: center;
    align-items: center;

    li {
      display: list-item;
      text-align: -webkit-match-parent;
    }

    a {
      margin-left: 30px;
    }
  }
} 

</style>