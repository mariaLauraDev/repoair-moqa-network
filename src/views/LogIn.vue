<template>
  <div>
    <h1>Acesse sua Conta</h1>
    <form @submit.prevent="signIn">
      <label for="email">E-mail</label>
      <input type="text" id="email" v-model="email" placeholder="E-mail" required>
      <label for="password">Senha</label>
      <input type="password" id="password" v-model="password" placeholder="Senha" required>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <button type="submit" :disabled="logInLoading">Entrar</button>
      <!-- <button @click="signInWithGoogle">Entrar com o Google</button> -->
    </form>
  </div>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'

export default {
  data() {
    return {
      logInLoading: false,
    }
  },
  methods: {
    signIn() {
      this.logInLoading = true
      signInWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((userCredential) => {
          // console.log("Successfully signed in!")
          const user = userCredential.user
          this.$store.dispatch('setUser', user)
          this.$router.push('/portal')
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              this.errorMessage = "Invalid email address."
              break
            case "auth/user-not-found":
              this.errorMessage = "User not found."
              break
            case "auth/wrong-password":
              this.errorMessage = "Wrong password."
              break
            default:
              this.errorMessage = "E-mail or password was incorrect."
              break
          }
        })
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
        .then((userCredential) => {
          // console.log("Successfully signed in with Google!")
          const user = userCredential.user
          this.$store.dispatch('setUser', user)
          this.$router.push('/portal')
        })
        .catch((error) => {
          // console.log(error)
        })
    },
  },
}
</script>

<style>

</style>