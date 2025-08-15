import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { AdminManager } from '../utils/AdminManager'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import AdminView from '../views/AdminView.vue'

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
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
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
        // Check if route requires admin access
        if (to.meta.requiresAdmin) {
          try {
            // Use AdminManager for free admin check
            const isAdmin = await AdminManager.isUserAdmin(user.email)
            
            if (isAdmin) {
              console.log(`Admin access approved: ${user.email}`)
              
              // Initialize admin status if needed
              await AdminManager.initializeAdminStatus()
              
              next()
            } else {
              console.warn(`Unauthorized admin access attempt: ${user.email}`)
              // Redirect non-admin users to home
              next({ name: 'Home' })
            }
          } catch (adminError) {
            console.error('Admin check failed:', adminError)
            // If there's an admin check problem, redirect to home
            next({ name: 'Home' })
          }
        } else {
          // Normal kullanıcı sayfası
          next()
        }
      } else {
        // Kullanıcı giriş yapmamış
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
