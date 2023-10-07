<template>
  <div>
    <h1>Crie uma Conta</h1>
    <form @submit.prevent="register">
      <label for="email">E-mail</label>
      <input type="email" id="email" v-model="email" placeholder="E-mail" required>
      <label for="password">Senha</label>
      <input type="password" id="password" v-model="password" placeholder="Senha" required>
      <button type="submit">Enviar</button>
    </form>
    <button @click="signInWithGoogle">Entrar com o Google</button>
  </div>
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
          this.$router.push('/data')
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
          this.$router.push('/data')
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