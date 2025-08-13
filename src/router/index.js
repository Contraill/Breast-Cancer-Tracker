import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'

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
    path: '/auth-action',
    name: 'AuthAction',
    component: AuthAction
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//Route Guard
router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (to.meta.requiresAuth && !user) {
    next({ name: 'Auth' }) // giriş yapılmamışsa giriş sayfasına yönlendir
  } else {
    next() // sorun yoksa devam et
  }
})

export default router
