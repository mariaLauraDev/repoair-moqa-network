import { createApp } from 'vue';
import App from './MoqaPortal.vue'
import router from './router'
import store from './store'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import i18n from './plugins/i18n'
import { config } from './config'
import './assets/styles/main.scss'
import 'particles.js'

const firebaseApp = initializeApp(config.firebase)
getFirestore(firebaseApp)

let app
const auth = getAuth(firebaseApp)

onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App);
    app.use(store).use(router).use(i18n).mount('#moqa-portal')
  }
});
