<template>
  <h1>Log in to an Account</h1>
  <p><input type="text" placeholder="E-mail" v-model="email"></p>
  <p><input type="password" placeholder="Password" v-model="password"></p>
  <p v-if="errorMessage"> {{ errorMessage }}</p>
  <p><button @click="signIn">Submit</button></p>
  <!-- <p><button @click="signInWithGoogle">Sign In With Google</button></p> -->
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'

export default {
  methods: {
    signIn() {
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