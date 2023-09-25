<template>
  <div>
    <!-- Header -->
    <Header />

    <div
      v-if="isLoggedIn && !isLoginRoute && !isHomeRoute"
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
      <router-view
    />
  </div>
  </div>
</template>

<script >
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'

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
  computed: {
    isLoginRoute() {
      return this.$route.path === '/log-in'
    },
    isHomeRoute() {
      return this.$route.path === '/'
    },
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
