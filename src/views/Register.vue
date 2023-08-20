<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="E-mail" v-model="email"></p>
  <p><input type="password" placeholder="Password" v-model="password"></p>
  <p><button @click="register">Submit</button></p>
  <p><button @click="signInWithGoogle">Sign In With Google</button></p>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    register() {
      createUserWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((data) => {
          // console.log(data)
          // console.log(data.user)
          // console.log("Successfully registered!")
          this.$router.push('/portal')
        })
        .catch((error) => {
          // console.log(error)

          switch (error.code) {
            case "auth/invalid-email":
              this.errorMessage = "Invalid email address."
              break
            case "auth/weak-password":
              this.errorMessage = "Password should be at least 6 characters"
              break
            default:
              this.errorMessage = "E-mail or password was invalid."
              break
          }
        })
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
        .then((result) => {
          console.log("Successfully signed in with Google!")
          console.log(result.user)
          this.$router.push('/portal')
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<style>

</style>