<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/portal"> Portal </router-link>
    <!-- <router-link to="/register">Register</router-link> | -->
    <button @click="handleSignOut" v-if="isLoggedIn"> Sign out</button>
  </nav>
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
    console.log('VUE_APP_FIRESTORE_COLLECTION_PATH', process.env.VUE_APP_FIRESTORE_COLLECTION_PATH)
    this.auth = getAuth()
    onAuthStateChanged(this.auth, (currentUser) => {
      if (currentUser) {
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    })
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

<style>
#app {
  text-align: center;
}

#app, html, body, main { height: 100%; }
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

body {
  background-color: #f8f9fa;
  color: #495057;
  font-family: 'Open Sans', sans-serif;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
