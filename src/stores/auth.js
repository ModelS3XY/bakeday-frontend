import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/api'
import { TOKEN_KEY } from '@/api/http'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const user = ref(null)
  // 重新整理後要先用 token 向後端確認身分，確認完成前 ready=false，避免畫面閃一下「未登入」
  const ready = ref(false)

  const isLoggedIn = computed(() => !!user.value)

  function setSession(data) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem(TOKEN_KEY, data.token)
  }

  let initPromise = null
  // 只執行一次；路由守衛等地方可以 await 它，確保拿到的是確認過的登入狀態
  function init() {
    initPromise ??= (async () => {
      if (token.value) {
        try {
          user.value = await authApi.me()
        } catch (e) {
          // 只有 401（token 過期或無效）才登出；網路錯誤或後端冷啟動逾時不代表 token 失效，保留登入狀態
          if (e.status === 401) clear()
        }
      }
      ready.value = true
    })()
    return initPromise
  }

  async function login(credentials) {
    setSession(await authApi.login(credentials))
  }

  async function register(payload) {
    setSession(await authApi.register(payload))
  }

  function clear() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, user, ready, isLoggedIn, init, login, register, logout: clear }
})
