<template>
  <div class="profile-container">
    <transition name="fade">
      <div v-if="pageLoaded" class="profile-form-container">
        <h1 class="page-title">{{ $t('routes.profile.title') }}</h1>

        <div class="settings-container">
          <div class="settings-item">
            <span class="option"> {{ $t('routes.profile.name') }} </span>
            <span class="status"> {{ userName }}</span>
            <button class="arrow-button" @click="changeEditEmailState">
              <i
                class="material-symbols-outlined"
                style="vertical-align: middle; display: inline-block;font-size: 1.30rem; color: #1c3c1f"
              >
                edit
              </i>
            </button>
          </div>
          <div class="settings-item" >
            <span class="option">  {{ $t('routes.login.email') }} </span>
            <span class="status"> {{ userEmail }} </span>
          </div>

          <div class="settings-item" >
            <span class="option">  {{ $t('routes.login.password') }} </span>
            <span> {{ $t('routes.profile.change_password') }} </span>
            <button class="arrow-button"  @click="changeEditPasswordState">
              <i
                class="material-symbols-outlined"
                style="vertical-align: middle; display: inline-block;font-size: 1.30rem; color: #1c3c1f"
              >
                edit
              </i>
            </button>
          </div>
        </div>

        <transition name="fade" >
          <form v-if="editingEmail" @submit.prevent="updateUserName" >
            <h3
              style="margin-top: 1rem"
            > {{ $t('routes.profile.update_your_name')}} </h3>
            <div>
              <div class="form-group">
                <label for="userName"> {{$t('routes.profile.new_name')}} </label>
                <input
                  v-model="userName"
                  :placeholder="$t('routes.profile.placeholder_name')"
                  id="userName"
                  @input="clearStatus"
                />
              </div>
              <button v-if="editingEmail" type="submit"> {{$t('routes.profile.save_changes')}}</button>
            </div>
          </form>
        </transition>

        <transition name="fade" >
          <form v-if="editingPassword" @submit.prevent="reauthenticate" >
            <h3
              style="margin-top: 1rem"
            > {{ $t('routes.profile.update_your_password')}} </h3>
            <div>
              <div class="form-group">
                <label for="userEmailTyped"> {{$t('routes.profile.your_email')}} </label>
                <input
                  v-model="userEmailTyped"
                  type="email"
                  id="userEmailTyped"
                  @input="clearStatus"
                />
              </div>

              <div class="form-group">
                <label for="currentPassword"> {{$t('routes.profile.last_password')}} </label>
                <input
                  v-model="currentPassword"
                  type="password"
                  id="currentPassword"
                  @input="clearStatus"
                />
              </div>

              <div class="form-group">
                <label for="userPassword"> {{$t('routes.profile.new_password')}} </label>
                <input
                  v-model="userPassword"
                  type="password"
                  id="userPassword"
                  @input="clearStatus"
                />
              </div>

              
              <button v-if="editingPassword" type="submit"> {{$t('routes.profile.save_changes')}}</button>
            </div>
          </form>
        </transition>
        <p v-if="statusMessage" :class="statusType">{{ statusMessage }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAuth, reauthenticateWithCredential, updateProfile, EmailAuthProvider, updatePassword } from "firebase/auth";

export default {
  data() {
    return {
      userName: "",
      userEmail: "",
      userEmailTyped: "",
      userPassword: '',
      currentPassword: '',
      editingEmail: false,
      editingPassword: false,
      pageLoaded: false,
      statusMessage: '',
      statusType: 'info', // 'info', 'success', 'error'
    }
  },
  mounted() {
    this.pageLoaded = true;
    const auth = getAuth()
    const user = auth.currentUser;
    if (user) {
      this.userName = user.displayName;
      this.userEmail = user.email;
    }
  },
  methods: {
    changeEditEmailState() {
      this.editingEmail = !this.editingEmail
      this.editingPassword = false
    },
    changeEditPasswordState() {
      this.editingEmail = false
      this.editingPassword = !this.editingPassword
    },
    clearStatus() {
      this.statusMessage = ''
    },
    updateUserName() {
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: this.userName
      })
        .then(() => {
          
          this.statusMessage = 'Nome atualizado com sucesso!';
          //wait 3s before this.$router.go()
          setTimeout(() => {
            this.$router.go(0);
          }, 1000);
          this.statusType = 'success';
          this.editing = false;
        })
        .catch(error => {
          this.statusMessage = 'Erro ao atualizar o nome.';
          this.statusType = 'error';
        });
    },
    updateUserPassword() {
      const auth = getAuth();
      const user = auth.currentUser;
      const newPassword = this.userPassword;

      updatePassword(user, newPassword).then(() => {
        this.statusMessage = 'Senha atualizada com sucesso!';
        this.statusType = 'success';
        setTimeout(() => {
            this.$router.go(0);
          }, 1000);
        this.userPassword = '';
      }).catch((error) => {
        if (error.code === 'auth/weak-password') {
          this.statusMessage = 'A senha fornecida é muito fraca.';
          this.statusType = 'error';
        } else if (error.code === 'auth/requires-recent-login') {
          this.showReauthDialog = true;
        } else {
          this.statusMessage = 'Erro ao atualizar a senha: ' + error.message;
          this.statusType = 'error';
        }
      });
    },
    reauthenticate() {
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        this.userEmail,
        this.currentPassword
      );

      reauthenticateWithCredential(user, credential).then(() => {
        this.showReauthDialog = false;
        this.updateUserPassword(); // Tenta atualizar a senha novamente após a reautenticação
      }).catch((error) => {
        this.statusMessage = 'Reautenticação falhou: ' + error.message;
        this.statusType = 'error';
      });
    }
  }
}
</script>

<style lang="scss" scoped>

.settings-container {
  display: grid;
  border-width: 1px;
  border-radius: 0.5rem;
  margin-top: 2.0rem;
  gap: 10px; // This adds space between grid items
}

.settings-item {
  display: grid;
  grid-template-columns: repeat(3, 1fr); // Three columns with equal size
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  .option, .status {
    text-align: left; // Center the text in their respective cells
  }

  .arrow-button {
    background: none;
    color: $color-primary;
    border: none;
    font-size: 24px;
    cursor: pointer;
    justify-self: center;
  }
}

.status-button {
  background: $color-primary;
  color: #fff;
  text-align: center;
  padding: .5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-form-container {
  width: 100%;
}

.form-group {
  margin: 1rem 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  background-color: $color-primary;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: darken($color-primary, 10%);
}

.info { color: #0174DF; }
.success { color: #04B404; }
.error { color: #DF0101; }

@media (max-width: 768px) {
  .profile-form-container {
    max-width: 100%;
  }
}

input[readonly] {
  background-color: #f9f9f9;
  cursor: not-allowed;
}
</style>
