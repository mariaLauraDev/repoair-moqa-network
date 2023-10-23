import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import ExportData from '../views/ExportData.vue'
import LogIn from '../views/LogIn.vue'
import Dashboard from '../views/Dashboard.vue'
import Analyze from '../views/Analyze.vue'
import NotFound from '../views/NotFound.vue';
import i18n from '../plugins/i18n'
import store from '../store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'not-found',
    //   component: NotFound,
    //   meta: {
    //     title: 'routes.not_found.title'
    //   },
    //   beforeEnter(to, from, next) {
    //     store.commit('SET_NOT_FOUND', true)
    //     next()
    //   }
    // },
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
  //colocar ou aqui na rota de register gera um bug
  if ( to.fullPath === '/log-in' && await getCurrentUser() ) {
    next('/dashboard')
  }
  
  if (to.meta.title) {
    document.title = 'MoQa | ' + i18n.global.t(to.meta.title);
  }

  if (from.name === 'not-found') {
    store.commit('SET_NOT_FOUND', false);
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(await getCurrentUser()) {
      next()
    } else {
      alert(i18n.global.t('alerts.you_must_sign_in'))
      next('/log-in')
    }
  } else {
    next()
  }
})


export default router
