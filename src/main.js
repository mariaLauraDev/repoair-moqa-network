import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { config } from './config';
// import dotenv from 'dotenv'

// dotenv.config()
const firebaseApp = initializeApp(config.firebase);
getFirestore(firebaseApp);
createApp(App).use(store).use(router).mount('#app')
