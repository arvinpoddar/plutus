
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/home',
    name: 'home',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') }
    ],
    meta: {
      autoLogin: true
    }
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ],
    meta: {
      autoLogin: true
    }
  },

  {
    path: '/sign-up',
    name: 'signUp',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SignUp.vue') }
    ],
    meta: {
      autoLogin: true
    }
  },

  {
    path: '/accept-notifications',
    name: 'acceptNotifications',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AcceptNotifications.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/onboard-categories',
    name: 'onboardCategories',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OnboardCategories.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/onboard-payments',
    name: 'onboardPayments',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OnboardPaymentMethods.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/add-category',
    name: 'addCategory',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OnboardPaymentMethods.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/category/:categoryId',
    name: 'viewCategory',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ViewCategory.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/category/:categoryId/add-expense',
    name: 'addExpense',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AddExpense.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/expense/:expenseId',
    name: 'viewExpense',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ViewExpense.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
