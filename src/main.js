import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { onUnauthorized } from './api/http'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useToastStore } from './stores/toast'

const app = createApp(App)
app.use(createPinia())

const auth = useAuthStore()
const cart = useCartStore()

// 任何 API 回 401（token 過期）→ 清掉登入狀態並提示
onUnauthorized(() => {
  if (!auth.token) return
  auth.logout()
  cart.reset()
  useToastStore().error('登入已過期，請重新登入')
  router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
})

// 用 localStorage 的 token 恢復登入狀態。不 await：
// 後端冷啟動可能要數十秒，不能讓整個網站因此空白，畫面先出來、登入狀態確認後再更新
auth.init().then(() => {
  if (auth.isLoggedIn) cart.fetch()
})

app.use(router)
app.mount('#app')
