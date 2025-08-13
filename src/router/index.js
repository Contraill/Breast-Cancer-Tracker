import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import 'primeicons/primeicons.css'

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: AuthView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Function to get current authentication status
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

// Route Guard with proper authentication state handling
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const user = await getCurrentUser()
      if (user) {
        next()
      } else {
        next({ name: 'Auth' })
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      next({ name: 'Auth' })
    }
  } else {
    next()
  }
})

export default router
