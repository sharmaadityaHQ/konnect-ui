import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ServiceCatalog.vue'),
    },
    {
      path: '/services/:id',
      name: 'service-versions',
      component: () => import('../views/ServiceVersions.vue'),
    },
  ],
})

export default router