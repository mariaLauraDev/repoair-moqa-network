import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import ExportData from '../views/ExportData.vue'
import LogIn from '../views/LogIn.vue'
import Dashboard from '../views/Dashboard.vue'
import Analyze from '../views/Analyze.vue'
import NotFound from '../views/NotFound.vue'
import Map from '../views/Map.vue'
import i18n from '../plugins/i18n'
import store from '../store'
import Admin from '../views/Admin.vue'
import { getFirestore, doc, getDoc } from "firebase/firestore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: {
        title: 'routes.not_found.title'
      },
      beforeEnter(to, from, next) {
        store.commit('SET_NOT_FOUND', true)
        next()
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: 'routes.admin.title'
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: `routes.home.title`
      }
    },
    {
      path:'/log-in',
      name: 'log-in',
      component: LogIn,
      meta: {
        title: 'components.header.login'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: 'components.header.signup'
      }
    },
    {
      path:'/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true,
        title: 'MoQa | Profile'
      }
    },
    {
      path:'/export-data',
      name: 'export-data',
      component: ExportData,
      meta: {
        requiresAuth: true,
        title: `routes.data.title`
      }
    },
    {
      path:'/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: `routes.dashboard.title`
      }
    },
    {
      path:'/analyze',
      name: 'analyze',
      component: Analyze,
      meta: {
        requiresAuth: true,
        title:  `routes.analyze.title`
      }
    },
    {
      path:'/map',
      name: 'map',
      component: Map,
      meta: {
        requiresAuth: true,
        title:  `routes.map.title`
      }
    }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (to.fullPath === '/log-in' && user) {
    return next('/dashboard');
  }
  
  if (to.meta.title) {
    document.title = 'MoQA | ' + i18n.global.t(to.meta.title);
  }
  
  if (from.name === 'not-found') {
    store.commit('SET_NOT_FOUND', false)
  }
  
  if (requiresAuth && !user) {
    alert(i18n.global.t('alerts.you_must_sign_in'));
    return next('/log-in');
  }
  
  if (requiresAdmin && user) {
    const db = getFirestore()
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return next()
    } else {
      alert(i18n.global.t('alerts.no_permission'))
      return next('/')
    }
  }

  next()
})

export default router
