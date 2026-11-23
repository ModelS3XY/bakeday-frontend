import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '登入', guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: '註冊', guestOnly: true },
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

// 已登入的人不需要再看到登入/註冊頁
router.beforeEach(async (to) => {
  if (!to.meta.guestOnly) return
  const auth = useAuthStore()
  await auth.init()
  if (auth.isLoggedIn) return { name: 'home' }
})

router.afterEach((to) => {
  document.title = `${to.meta.title ? `${to.meta.title}｜` : ''}焙日 Bakeday`
})

export default router
