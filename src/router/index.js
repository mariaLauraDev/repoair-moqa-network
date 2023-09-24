import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import DataRepository from '../views/DataRepository.vue'
import LogIn from '../views/LogIn.vue'
import Monitoring from '../views/Monitoring.vue'
import Dashboard from '../views/Dashboard.vue'
import Analyze from '../views/Analyze.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'MoQa | Home'
      }
    },
    {
      path:'/log-in',
      name: 'log-in',
      component: LogIn,
      meta: {
        title: 'MoQa | LogIn'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: 'MoQa | Register'
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
      path:'/monitoring-control',
      name: 'monitoring control',
      component: Monitoring,
      meta: {
        requiresAuth: true,
        title: 'MoQa | Monitoring'
      }
    },
    {
      path:'/data-repository',
      name: 'dados',
      component: DataRepository,
      meta: {
        requiresAuth: true,
        title: 'MoQa | Dados'
      }
    },
    {
      path:'/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: 'MoQa | Dashboard'
      }
    },
    {
      path:'/analyze',
      name: 'analyze',
      component: Analyze,
      meta: {
        requiresAuth: true,
        title: 'MoQa | Análise'
      }
    },
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

router.beforeEach( async (to, from, next) => {
  const title = to.meta.title

  // if ( to.fullPath === '/' && await getCurrentUser() ) {
  //   next('/dashboard')
  // }

  if (title) {
    document.title = title
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(await getCurrentUser()) {
      next()
    } else {
      alert('You must be signed in to see this page')
      next('/log-in')
    }
  } else {
    next()
  }
})

export default router
