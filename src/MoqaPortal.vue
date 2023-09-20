<template>
  <Navbar :routes="routes"/>
  <router-view class="router-view"/>
  <!-- <Footer v-if="!isLoginRoute" /> -->
</template>

<script >
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

import Navbar from '@/components/Navbar.vue'
export default {
  components: {
    Navbar
  },
  data() {
    return {
      auth: null,
      isLoggedIn: false,
      isModalOpen: false,
      showNavbar: false,
      routes: [
        {
          name: 'Mapa',
          path: '/monitoring-control',
        },
        {
          name: 'Dados',
          path: '/data-repository',
        },
        {
          name: 'Dashboard',
          path: '/dashboard',
        }
      ]
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
    isLoginRoute() {
      return this.$route.path === '/log-in'
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
    },
    changeModalState() {
      this.isModalOpen = !this.isModalOpen
    },
  }
}
</script>

<style lang="scss">
.header {
  background-color: $color-background;

  &__container {
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1520px;
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

  .header__menu, .header__menu-modal, .header__menu-modal{
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

  .header__menu {
    &-modal {
      flex-direction: column;
      z-index: 500;
      position: fixed;
      height: 100vh;
      top: 0;
      right: -80%;
      transition: right .3s ease-in-out;

      &--open{
        right: 0!important;
      }
    }

    &-active {
      font-weight: bold;
      transition: font-weight .3s ease;
    }

    &-mobile {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-direction: column;
      margin-top: -50px;
      grid-gap: 20px;
      gap: 20px;
      margin-right: 20px;

      li {
        //background: $color-primary;
        transform: translateX(150%);
        font-size: 18px;
        //box-shadow: 0 10px 26px 0 rgb(0 0 0 / 30%);
        border-radius: 10px;
        transition: transform .3s ease-in-out;
        //border-radius: 5px;
      }
    }

    &-li-active {
      transform: translateX(0)!important;
    }
  }
}

.menu-icon {
  z-index: 600;
  height: 30px;
  width: 30px;
  display: none;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  cursor: pointer;
  transition: height .5s ease;
  position: relative;

  &__line {
    height: 2px;
    background: $color-text;
    border-radius: 5px;
    position: absolute;
    top: 0;
    transition: width .5s ease,transform .5s ease,bottom .5s ease,top .5s ease;

    &--top {
      width: 100%;
      top: 10px;
    }

    &--middle {
      width: 100%;
      top: 15px;
    }

    &--bottom {
      width: 100%;
      top: 20px;
    }
  }
}

.menu-icon--active .menu-icon__line--top {
  transform: rotate(-45deg);
  top: 15px;
}

.menu-icon--active .menu-icon__line--middle {
  width: 0;
}

.menu-icon--active .menu-icon__line--bottom {
  transform: rotate(45deg);
  top: 15px;
}

.centered-container {
  justify-content: center;
}

.btn-submit {
  margin-left: 10px;
  background: $color-primary;
}

@media (max-width: 780px) {
  .header__menu {
    display: none!important;
  }

  .menu-icon-mobile {
    display: flex!important;
  }
}
</style>
