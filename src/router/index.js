import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Portal from '../views/Portal.vue'
import LogIn from '../views/LogIn.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: 'MoQa | Register'
      }
    },
    {
      path:'/portal',
      name: 'portal',
      component: Portal,
      meta: {
        requiresAuth: true,
        title: 'MoQa | Portal'
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
