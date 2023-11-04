<template>
  <div>
    <!-- Header -->
    <Header
      :deafult-profile-options="deafultProfileOptions"
      :logged-profile-menu-options="loggedProfileMenuOptions"
    />

    <div v-if="$store.state.notFound">
      <router-view/>
    </div>
    <div
      v-else-if="isLoggedIn && !isLoginRoute && !isHomeRoute"
      class="container router-content"
    >
      <Sidebar />
      <main class="views-container">
        <router-view />
      </main>
    </div>
    <div
      v-else-if="isLoginRoute || isHomeRoute"
    >
      <router-view/>
    </div>
    <div v-else>
      Bug aqui
    </div>
  </div>
</template>

<script >
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      auth: null,
      isLoggedIn: false,
      isModalOpen: false,
      showNavbar: false,
      currentUser: null,
    }
  },
  mounted() {
    this.auth = getAuth()
    onAuthStateChanged(this.auth, (currentUser) => {
      this.currentUser =  {
        displayName: currentUser?.displayName,
        email: currentUser?.email,
        photoURL: currentUser?.photoURL,
        createdAt: currentUser?.metadata?.createdAt,

      }
      if (currentUser) {
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    })
  },
  watch: {
    locale(newLocale) {
      this.$i18n.locale = newLocale
    },
  },
  computed: {
    ...mapState(['locale']),
    isLoginRoute() {
      return this.$route.path === '/log-in'
    },
    isHomeRoute() {
      return this.$route.path === '/'
    },
    deafultProfileOptions() {
      return [
        {
          title:  this.$t('components.header.login'),
          path: '/log-in',
        },
        // {
        //   title: 'Registra-se',
        //   path: '/register',
        // }
      ]
    },
    loggedProfileMenuOptions() {
      return [
        {
          title: this.$t('routes.dashboard.title'),
          path: '/dashboard',
        },
        {
          title: this.$t('routes.map.title'),
          path: '/map',
        },
        {
          title: this.$t('routes.data.title'),
          path: '/export-data',
        },
        {
          title: this.$t('routes.profile.title'),
          path: '/profile',
        },
        // {
        //   title: this.$t('routes.analyze.title'),
        //   path: '/analyze',
        // }
      ]}
  },
  methods: {
    async handleSignOut() {
      try {
        await signOut(this.auth)
        this.$router.push('/')
        this.$router.go(0)
        .log('Signed out successfully.')
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
.views-container {
  padding-bottom: 1.25rem;
  padding-top: 1.25rem;
}

@media (min-width: 768px) {
  .router-content {
    gap: 2.5rem;
    display: grid;
    grid-template-columns: repeat(12,minmax(0,1fr));
  }

  .views-container {
    grid-column: 4 / span 10;
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
  }
}
</style>
