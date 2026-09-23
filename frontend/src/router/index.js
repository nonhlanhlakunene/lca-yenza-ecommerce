import { createRouter, createWebHistory } from 'vue-router'

import ApiTest from '@/components/ApiTest.vue'
import AboutView from '../components/AboutView.vue'
import BookFormView from '../views/BookFormView.vue'
import BookingsView from '../views/BookingsView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import workerlogin from '@/components/workerlogin.vue'
import workersignup from '@/components/workersignup.vue'
import Login from '@/components/login.vue'
import Signup from '@/components/signup.vue'
import Home from '@/views/home.vue'
import HandymanProfileView from '../views/HandymanProfileView.vue'
import ServicesView from '../views/ServicesView.vue'
import Admin from '@/components/Admin.vue'
import workerDashboardView from '../views/workerDashboardView.vue'
import SettingsView from '../views/SettingsView.vue'
import WorkerSettingsView from '../views/WorkerSettingsView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },

  {
    path: '/workersignup',
    name: 'workersignup',
    component: workersignup
  },

  {
    path: '/workerlogin',
    name: 'workerlogin',
    component: workerlogin
  },

  {
    path: '/',
    name: 'home',
    component: Home
  },

  {
    path: '/profiles/:slug',
    name: 'profile',
    component: HandymanProfileView
  },

  {
    path: '/about',
    name: 'about',
    component: AboutView
  },

  {
    path: '/bookings',
    name: 'bookings',
    component: BookingsView,
    meta: {
      requiresAuth: true,
      roles: ['customer']
    }
  },

  {
    path: '/admin',
    name: 'admin',
    component: Admin
  },

  {
    path: '/book/:slug',
    name: 'book',
    component: BookFormView,
    meta: {
      requiresAuth: true,
      roles: ['customer']
    }
  },

  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: {
      requiresAuth: true,
      roles: ['customer']
    }
  },

  {
    path: '/services',
    name: 'services',
    component: ServicesView
  },

  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/worker',
    name: 'workerDashboardView',
    component: workerDashboardView,
    meta: {
      requiresAuth: true,
      roles: ['professional', 'worker']
    }
  },

  {
    path: '/worker/settings',
    name: 'worker-settings',
    component: WorkerSettingsView,
    meta: { requiresAuth: true, roles: ['professional', 'worker'] }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue')
  },

  {
    path: '/report-test',
    name: 'report-test',
    component: () => import('../components/ReportPopup.vue')
  },

  {
    path: '/review-test',
    name: 'review-test',
    component: () => import('../components/ReviewPopup.vue')
  },

  {
    path: '/verification',
    name: 'verification',
    component: () => import('../components/VerifyIdentity.vue'),
    props: {
      showVerification: true,
      userType: 'worker'
    },
    meta: {
      requiresAuth: true,
      roles: ['professional', 'worker']
    }
  },

  {
    path: '/api-test',
    name: 'api-test',
    component: ApiTest
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')
  } catch (error) {
    localStorage.removeItem('user')
    user = null
  }

  /*
   * ADMIN ROUTE
   *
   * /admin is allowed to open directly.
   *
   * This must come BEFORE the normal role checking below.
   * Otherwise, if a worker is currently logged in, the router
   * would see their role and send them to /worker.
   */
  if (to.path === '/admin') {
    return true
  }

  /*
   * If a token exists without a valid user,
   * remove the invalid token.
   */
  if (token && !user) {
    localStorage.removeItem('token')
  }

  /*
   * Normal protected routes
   */
  if (to.meta.requiresAuth) {
    /*
     * User is not logged in
     */
    if (!token || !user) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      }
    }

    /*
     * User is logged in but does not have
     * permission for this route.
     */
    if (to.meta.roles && !to.meta.roles.includes(user.role)) {

      /*
       * Admin users go to admin
       */
      if (user.role === 'admin') {
        return '/admin'
      }

      /*
       * Professional / worker users go to worker dashboard
       */
      if (user.role === 'professional' || user.role === 'worker') {
        return '/worker'
      }

      /*
       * Customers go home
       */
      if (user.role === 'customer') {
        return '/'
      }

      /*
       * Unknown role
       */
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      return '/login'
    }
  }

  return true
})

export default router
