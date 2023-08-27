import { createApp } from 'vue'
import App from './MoqaPortal.vue'
import router from './router'
import store from './store'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { config } from './config'
import './assets/styles/main.scss';
import 'particles.js';

// import dotenv from 'dotenv'

// dotenv.config()
const app = createApp(App)

app.use(store)
app.use(router)

const firebaseApp = initializeApp(config.firebase);
getFirestore(firebaseApp);

app.mount('#moqa-portal')
