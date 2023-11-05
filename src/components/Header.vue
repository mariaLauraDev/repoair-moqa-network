<template>
  <header class="header">
    <!-- Container of flex -->
    <div class="container header__container">
      <!-- Logo and page title -->
      <div class="header__logo">
        <!-- Logo -->
        <router-link
          style="background-color: transparent;"
          :to="homeLink"
        >
          <img
            height="600px"
            style="positon: relative; width: 200px;"
            loading="lazy"
            class="logo__img"
            src="../assets/svg/logo-trama.svg"
            alt="Logo Moqa Portal"
            title="Logo Moqa Portal">
        </router-link>
      </div>

      <!-- Right side of header -->
      <div class="header__actions">
        <!-- <button
          class="header__actions__mode"
        >
          <span class="material-symbols-outlined" style="font-size: 1.15rem; color: #3c3c3b; font-weight: normal; font-style: normal; line-height: 1; text-transform: none; font-weight: 400; fill:0"> light_mode </span>
        </button> -->

        <!-- Change Locales -->
        <div
          class="header__actions__locale"
          :class="{'open': isLocaleMenuOpen}"
        >
          <button
            @click.prevent="isLocaleMenuOpen = true"
            class="header__actions__user-icon"
          >
            <span class="material-symbols-outlined" style="font-size: 1.15rem; color: #3c3c3b;"> translate </span>
          </button>

          
          <transition name="modal">
            <div
              v-if="isLocaleMenuOpen"
              class="header__actions__modal"
              style="right: 0px; margin-top: 2.75rem; width: 6rem;"
            >
              <div
                class="profile-options"
              >
                <div
                  v-for="(option, index) in localeMenuOptions"
                  :key="index"
                  class="profile-options__item"
                  :class="{'active': option.code === locale}"
                  @click.prevent="setLanguage(option.code)"
                >
                  {{ option.code }}
                </div>
              </div>
            </div>
          </transition>
          <div
            v-if="isLocaleMenuOpen"
            class="modal-overlay"
            @click.prevent="isLocaleMenuOpen = false"
          ></div>
        </div>

        <!-- Profile -->
        <div
          v-if="showLoginButton"
          class="header__actions__portal"
          :class="{'open': isUserModalOpen}"
        >
          <button
            @click.prevent="changeUserModalState"
            class="header__actions__user-icon"
          >
            <span class="material-symbols-outlined" style="font-size: 1.15rem; color: #3c3c3b;"> person </span>
          </button>

          <transition name="modal">
            <div
              v-if="isUserModalOpen"
              class="header__actions__modal"
              style="right: 0px; margin-top: 2.75rem"
            >
              <div
                v-if="isLoggedIn"
                class="user"
              >
                <p style="font-weight: 600;font-size: .875rem;line-height: 1.25rem;">{{ $t('components.header.hi')}} {{currentUser?.displayName}}</p>
                <a
                  class="leading-none text-muted-foreground"
                  style="color: #64748b; line-height: 1; text-decoration: none; font-size: .7rem;   overflow-x: auto;"
                >
                  {{ currentUser.email }}
                </a>
              </div>
              <div
                v-if="isLoggedIn"
                class="profile-options"
              >
                <router-link
                  v-for="(option, index) in profileDesktopMenuOptions"
                  :key="index"
                  class="profile-options__item"
                  @click.prevent="changeUserModalState"
                  :to="option.path"
                >
                  {{ option.title }}
                </router-link>
                <hr
                  v-if="isHomePath"
                  class="divider" />
                <button
                  @click.prevent="handleSignOut"
                  class="profile-options__item"
                >
                  {{ $t('components.header.logout') }}
                </button>
              </div>
              <div
                v-else
                class="profile-options"
              >
                <router-link
                  v-for="(option, index) in deafultProfileOptions"
                  :key="index"
                  :to="option.path"
                  @click.prevent="changeUserModalState"
                  class="profile-options__item"
                >
                  {{ option.title }}
                </router-link>
              </div>
            </div>
          </transition>
          <div v-if="isUserModalOpen" class="modal-overlay" @click.prevent="changeUserModalState"></div>
        </div>

        <!-- Mobile Dropdown menu -->
        <div
          v-if="showLoginButton"
          class="header__actions__user"
          :class="{'open': isModalOpen}"
        >
          <button
            @click.prevent="changeModalState"
            class="header__actions__user-icon">
            <span class="material-symbols-outlined" style="font-size: 1.15rem; color: #3c3c3b;"> menu </span>
          </button>

          <transition name="modal">
            <div
              v-if="isModalOpen"
              class="header__actions__modal"
            >
              <div
                v-if="isLoggedIn"
                class="user"
              >
                <p style="font-weight: 600;font-size: .875rem;line-height: 1.25rem;">{{ $t('components.header.hi')}} {{currentUser?.displayName}}</p>
                <a
                  class="leading-none text-muted-foreground"
                  style="color: #64748b; line-height: 1; text-decoration: none; font-size: .7rem;   overflow-x: auto;"
                >
                  {{ currentUser.email }}
                </a>
              </div>
              <div
                v-if="isLoggedIn"
                class="profile-options"
              >
                <router-link
                  v-for="(option, index) in loggedProfileMenuOptions"
                  :key="index"
                  class="profile-options__item"
                  @click.prevent="changeModalState"
                  :to="option.path"
                >
                  {{ option.title }}
                </router-link>
                <hr class="divider" />
                <button
                  @click.prevent="handleSignOut"
                  class="profile-options__item"
                >
                {{ $t('components.header.logout') }}
              </button>
              </div>
              <div
                v-else
                class="profile-options"
              >
                <button
                  v-for="(option, index) in deafultProfileOptions"
                  :key="index"
                  class="profile-options__item"
                >
                  <router-link
                    @click.prevent="changeModalState"
                    :to="option.path"
                  >
                    {{ option.title }}
                  </router-link>
                </button>
              </div>
            </div>
          </transition>
          <div v-if="isModalOpen" class="modal-overlay" @click.prevent="changeModalState"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { mapMutations } from 'vuex'
import { mapState } from 'vuex'

export default {
  props:{
    deafultProfileOptions: {
      type: Array,
      default: () => []
    },
    loggedProfileMenuOptions: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      auth: null,
      isModalOpen: false,
      isUserModalOpen: false,
      currentUser: null,
      isLoggedIn: false,
      isLocaleMenuOpen: false,
      localeMenuOptions: [
        {
          code: 'pt-BR',
        },
        {
          code: 'en',
        }
      ],
    }
  },
  computed: {
    ...mapState(['locale']),
    homeLink () {
      if (this.isLoggedIn) {
        return '/'
      } else {
        return '/'
      }
    },
    profileDesktopMenuOptions () {
      if (this.isLoggedIn) {
        return this.isHomePath? this.loggedProfileMenuOptions : []
      } else {
        return this.deafultProfileOptions
      }
    },
    isHomePath () {
      return this.$route.path === '/'
    },
    isLoginOrRegisterPath () {
      return this.$route.path === '/log-in' || this.$route.path === '/register'
    },
    showLoginButton () {
      return this.$route.path !== '/log-in' && this.$route.path !== '/register'
    }
  },
  mounted() {
    this.auth = getAuth()
    this.isUserModalOpen = false
    this.isModalOpen = false
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
  methods: {
    ...mapMutations(['SET_LOCALE']),
    setLanguage(lang) {
      this.isLocaleMenuOpen = false
      this.reloadPage()
      this.SET_LOCALE(lang)
    },
    reloadPage() {
      this.$router.go()
    },
    changeModalState() {
      return this.isModalOpen = !this.isModalOpen
    },
    changeUserModalState() {
      return this.isUserModalOpen = !this.isUserModalOpen
    },
    async handleSignOut() {
      try {
        await signOut(this.auth)
        this.$router.push('/')
        this.$router.go(0)
        console.log('Signed out successfully.')
      } catch (error) {
        console.error('Error signing out:', error.message)
      } finally {
        this.isModalOpen = false
      }
    },
  }
}
</script>

<style lang="scss">
.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5rem;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo__img{
  object-fit: contain;
  width: 6rem;
  height: 6rem;
}

.header__actions{
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header__actions__mode {
  border-radius: 9999px;
  border-width: 1px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
}

.header__actions__portal {
  display: none;
}

.header__actions__locale {
  display: flex;
  position: relative;
  background-color: transparent;
}

.header__actions__user {
  position: relative;
}

.header__actions__user-icon {
  display: flex;
  border-radius: 9999px;
  overflow: hidden;
  width: 2.25rem;
  height: 2.25rem;
  border-width: 1px;
  justify-content: center;
  align-items: center;
  background-color: rgba(178, 199, 78, 0.3);
}

.header__actions__modal {
  border-width: 1px;
  background-color: #fff;
  border-radius: 0.375rem;
  width: 12rem;
  margin-top: 0.75rem;
  z-index: 10;
  right: 0;
  position: absolute;
}

.user {
  font-size: .875rem;
  line-height: 1.25rem;
  border-bottom-width: 1px;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-bottom: 0.375rem;
  padding-top: 0.375rem;
}

.profile-options {
  padding: 0.25rem;
}

.profile-options__item {
  font-weight: 500;
  font-size: .875rem;
  line-height: 1.25rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  width: 100%;
  display: inline-flex;
  font-weight: 500
}

.profile-options__item:hover {
  background-color: rgba(178, 199, 78, 0.3);
  cursor: pointer;
}

.divider {
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  margin: 0;
  border-top-width: 1px;
  color: inherit;
  height: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: transparent;
}

.profile-options__item.active {
  background-color: rgba(178, 199, 78, 0.3) !important;
}

@media (min-width: 768px) {
  .header__actions__user {
    display: none;
  }

  .header__actions__portal{
    display: flex;
    position: relative;
  }
}
</style>