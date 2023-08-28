<template>
  <div class="login-area">
    <ParticlesBackground />

    <div class="login-container">
      <div class="login-card">
        <h2 class="title">Acesse sua Conta</h2>
        <form @submit.prevent="signIn">
          <label for="email">
            <div>
              <small> E-mail</small>
              <input type="text" id="email" v-model="email" placeholder="Digite seu e-mail" required>
            </div>
          </label>
          <label for="password">
            <div>
              <small>
                <small> Senha</small>
              </small>
              <input type="password" id="password" v-model="password" placeholder="Digite sua senha" required>
            </div>
          </label>
          <p v-if="errorMessage">{{ errorMessage }}</p>
          <button
            type="submit"
            :disabled="logInLoading"
            class="btn-submit"
          >
            Entrar
          </button>
          <!-- <button @click="signInWithGoogle">Entrar com o Google</button> -->
        </form>
      </div>
      
    </div>

  </div>
</template>

<script>
import ParticlesBackground from "@/components/ParticlesBackground.vue";

import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'

export default {
  components: {
    ParticlesBackground
  },
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

<style lang="scss" scoped>
.login-area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-card {
  max-height: 45rem;
  width: 25rem;
  padding: 20px 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title{
    margin-bottom: 2.5rem;
    font-size: $subtitle-font-size;
    color: $color-primary;
    font-weight: $semibold-font-weight;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    grid-gap: 10px;
    gap: 10px;
  }
}

.btn-submit {
  width: 100%;
}

label {
  margin-bottom: 5px;
  border-radius: 5px;
  max-width: 500px;

  input, span {
    height: 50px;
  }

  div {
    display: flex;
    flex-direction: column;
    width: 100%;

    small {
      font-size: 12px;
      margin-bottom: 3px;
      margin-left: 1px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      grid-gap: 5px;
      gap: 5px;
    }

    input {
      width: 100%;
      border: none;
      outline: none;
      border-radius: 5px;
      padding: 15px;
      background: hsla(0,0%,100%,.5);
      font-size: 17px;
      color: $color-text;
      height: 50px;
    }
  }
}

.login-container {
  position: relative;
  margin-top: 50px;
  z-index: 10;
  letter-spacing: .5px;
  box-shadow: 0 0 15px 4px rgb(0 0 0 / 8%);
}

@media (max-width: 780px) {
  label {
    max-width: 250px;
  }

  .login-card {
    width: 20rem;
  }
}
</style>