<template>
  <header class="header">
    <div
      v-if="componentLoaded"
      class="header__container"
      :class="{ 'centered-container': isLoginRoute }"
      >
      <div class="logo">
        <router-link to="/" style="justify-content: center">
          <img
            width="auto"
            height="100px"
            loading="lazy"
            class="logo__img"
            src="../assets/svg/logo.svg"
            alt="Logo Moqa Portal"
            title="Logo Moqa Portal">
        </router-link>
      </div>
      <nav v-if="!isLoginRoute">
        <ul
          class="header__menu"
        >
          <li
          v-for="(route, index) in routes"
          :key="index"
          >
            <router-link
              v-if="isLoggedIn"
              :to="route.path"
            >
              {{ route.name }}
            </router-link>
          </li>
          <li>
            <router-link
              v-if="!isLoggedIn"
              to="/log-in"
              class="btn-submit"
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
        <div
          @click.prevent="changeModalState"
          class="menu-icon menu-icon-mobile"
          :class="{ 'menu-icon--active': isModalOpen }"
        >
          <div class="menu-icon__line menu-icon__line--top"></div>
          <div class="menu-icon__line menu-icon__line--middle"></div>
          <div class="menu-icon__line menu-icon__line--bottom"></div>
        </div>
        <div
          class="header__menu-modal"
          :class="{ 'header__menu-modal--open': isModalOpen }"
        >
          <ul class="header__menu-mobile">
            <li 
              v-if="isLoggedIn"
              :class="{ 'header__menu-li-active': isModalOpen }"
            >
              <router-link
                v-for="(route, index) in routes"
                :key="index"
                :class="{ 'header__menu-li-active': isModalOpen }"
                :to="route.path"
              >
                {{ route.name }}
              </router-link>
            </li>
            <li :class="{ 'header__menu-li-active': isModalOpen }">
              <router-link
                v-if="!isLoggedIn"
                class="btn-submit"
                :class="{ 'header__menu-li-active': isModalOpen }"
                to="/log-in"
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
            <!-- <li :class="{ 'header__menu-li-active': isModalOpen }">
              <router-link to="/register">Register</router-link :class="{ 'header__menu-li-active': isModalOpen }"> |
            </li> -->
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>

<script >
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import DesktopNavbar from './DesktopNavbar.vue';
import MobileNavbar from './MobileNavbar.vue';

export default {
  data() {
    return {
      auth: null,
      isLoggedIn: false,
      isModalOpen: false,
      showNavbar: false,
      componentLoaded: false,
    }
  },
  components: {
    DesktopNavbar,
    MobileNavbar
  },
  props: {
    routes: {
      type: Array,
      required: true,
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
    this.componentLoaded = true
  },
  computed: {
    isLoginRoute() {
      return this.$route.path === '/log-in'
    },
    isDesktop() {
      return window.innerWidth >= 768
    }
  },
  methods: {
    async handleSignOut() {
      try {
        await signOut(this.auth)
        this.$router.push('/')
        this.$router.go(0)
        console.log('Signed out successfully.')
      } catch (error) {
        console.error('Error signing out:', error.message)
      }
    },
    changeModalState() {
      this.isModalOpen = !this.isModalOpen
    },
  }
}
</script>

<style lang="scss">

</style>
