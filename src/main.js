import { createApp } from 'vue'
import App from './MoqaPortal.vue'
import router from './router'
import store from './store'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { config } from './config'
import './assets/styles/main.scss';
import 'particles.js';
import { v4 as uuidv4 } from 'uuid';


// import dotenv from 'dotenv'
const nonce = uuidv4(); // Gere um nonce único

// dotenv.config()
const app = createApp(App)
app.config.globalProperties.$nonce = nonce

app.use(store)
app.use(router)

const firebaseApp = initializeApp(config.firebase);
getFirestore(firebaseApp);

app.mount('#moqa-portal')
