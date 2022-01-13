import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { getCurrentUser, isAuthenticated } from '../requests'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../pages/Login.vue'),
    beforeEnter: async (to, from, next) => {
      if (!(await isAuthenticated())) {
        next()
      } else {
        next(from.path)
      }
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackChunkName: "signup" */ '../pages/SignUp.vue'),
    beforeEnter: async (to, from, next) => {
      if (!(await isAuthenticated())) {
        next()
      } else {
        next(from.path)
      }
    }
  },
  {
    path: '/create-delivery',
    name: 'create-delivery',
    component: () => import(/* webpackChunkName: "create-delivery" */ '../pages/CreateDelivery.vue'),
    beforeEnter: async (to, from, next) => {
      const user = await getCurrentUser()
      if (!user) {
        next({
          name: 'login',
          query: {
            redirect: 'create-delivery'
          }
        })
      } else if (user.role === 'user') {
        next()
      } else {
        next({
          name: from.name === 'create-delivery' ? 'admin-dashboard' : from.name
        })
      }
    }
  },
  {
    path: '/console',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin-console" */ '../pages/admin/Index.vue'),
    redirect: '/console/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import(/* webpackChunkName: "admin-dashboard" */ '../pages/admin/Dashboard.vue')
      }
    ],
    meta: {
      requiresAuth: true,
    },
    beforeEnter: async (to, from, next) => {
      const user = await getCurrentUser()
      if (user.role === 'admin') {
        next()
      } else {
        next(from.path)
      }
    }
  },
  {
    path: '/u',
    name: 'user',
    component: () => import(/* webpackChunkName: "user-console" */ '../pages/user/Index.vue'),
    redirect: '/u/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'user-dashboard',
        component: () => import(/* webpackChunkName: "user-dashboard" */ '../pages/user/Dashboard.vue')
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import(/* webpackChunkName: "user-profile" */ '../pages/user/Profile.vue')
      }
    ],
    meta: {
      requiresAuth: true,
    },
    beforeEnter: async (to, from, next) => {
      const user = await getCurrentUser()
      if (user.role === 'user') {
        next()
      } else {
        next(from.path)
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !(await isAuthenticated())) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
