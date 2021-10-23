
const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },

  {
    path: '/sign-up',
    name: 'signUp',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SignUp.vue') }
    ]
  },

  {
    path: '/accept-notifications',
    name: 'acceptNotifications',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AcceptNotifications.vue') }
    ]
  },

  {
    path: '/onboard-categories',
    name: 'onboardCategories',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OnboardCategories.vue') }
    ]
  },

  {
    path: '/onboard-payments',
    name: 'onboardPayments',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OnboardPaymentMethods.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
