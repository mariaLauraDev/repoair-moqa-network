<template>
  <transition name="fade">
    <div v-if="pageLoaded" class="login-area">
      <ParticlesBackground />

      <div class="login-container">
        <div class="login-card">
          <h2 class="title"> {{ $t('routes.login.title')}}</h2>
          <form @submit.prevent="signIn">
            <label for="email">
              <div>
                <small> {{ $t('routes.login.email') }} </small>
                <input type="text" id="email" v-model="email" :placeholder="$t('routes.login.email_placeholder')" required>
              </div>
            </label>
            <label for="password">
              <div>
                <small>
                  <small> {{ $t('routes.login.password') }} </small>
                </small>
                <input type="password" id="password" v-model="password" :placeholder="$t('routes.login.password_placeholder')" required>
              </div>
            </label>
            <transition name="fade">
              <p class="error-message" >{{ errorMessage }}</p>
            </transition>
            <button
              type="submit"
              :class="{ 'disabled': logInLoading }"
              :disabled="logInLoading"
              class="btn-action"
            >
              {{ $t('routes.login.action') }}
            </button>
            <!-- <button @click="signInWithGoogle">Entrar com o Google</button> -->
          </form>
        </div>
        
      </div>
    </div>
  </transition>
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
      pageLoaded: false,
      hasError: false,
      errorMessage: "",
      email: "",
      password: "",
    }
  },
  mounted() {
    this.pageLoaded = true
  },
  methods: {
    showErrorMessage(errorCode) {
      this.hasError = true
      this.errorMessage = this.getErrorMessage(errorCode)
      setTimeout(() => {
        this.errorMessage = ""
      }, 3000)
    },
    getErrorMessage(errorCode) {
      console.log(this.$i18n.messages[this.$i18n.locale].routes.login.errors[errorCode])
      return this.$i18n.messages[this.$i18n.locale].routes.login.errors[errorCode] || "An unexpected error has occurred.";
    },
    signIn() {
      this.logInLoading = true
      signInWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user
          this.$store.dispatch('setUser', user)
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          this.logInLoading = false
          console.log(error.code)
          this.showErrorMessage(error.code)
        })
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
        .then((userCredential) => {
          // console.log("Successfully signed in with Google!")
          const user = userCredential.user
          this.$store.dispatch('setUser', user)
          this.$router.push('/dashboard')
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

.error-message {
  color: red;
  font-size: 0.8rem;
  text-align: center;
  min-height: 1.2rem; /* Defina uma altura mínima para o espaço da mensagem de erro */
}


.login-card {
  max-height: 45rem;
  padding: 20px 20px;
  border-radius: 10px;
  display: flex;
  width: 20rem;
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

.btn-action {
  width: 100%;
}

.disabled {
  background: #1a82ff !important;
  border-color:  #1a82ff !important;
  opacity: 0.5;
  cursor: not-allowed;
}

.login-container {
  position: relative;
  margin-top: 50px;
  z-index: 10;
  letter-spacing: .5px;
  box-shadow: 0 0 15px 4px rgb(0 0 0 / 8%);
  background-color: $color-background;
}

@media (min-width: 780px) {
  label {
    width: 100%;
  }

  .login-card {
    width: 28rem;
  }
}
</style>