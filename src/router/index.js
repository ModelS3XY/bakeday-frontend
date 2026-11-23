import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: '首頁' } },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductListView.vue'),
      meta: { title: '所有商品' },
    },
    {
      path: '/products/:id',
      name: 'product',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { title: '商品內容' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '找不到頁面' },
    },
  ],
  scrollBehavior: (to, from, saved) => saved || (to.path !== from.path ? { top: 0 } : undefined),
})

router.afterEach((to) => {
  document.title = `${to.meta.title ? `${to.meta.title}｜` : ''}焙日 Bakeday`
})

export default router
