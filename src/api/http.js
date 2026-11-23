import axios from 'axios'

export const TOKEN_KEY = 'bakeday_token'

// 後端網址由環境變數 VITE_API_BASE_URL 決定（部署時在 Cloudflare Pages 設定），本機預設 localhost:3000
const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const http = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 60000, // Render 免費方案冷啟動可能要 30 秒以上
})

// 每個請求自動帶上 token，各支 API 不用自己處理
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// token 過期/失效時要通知 auth store 登出；用 callback 注入，避免 http 層反過來依賴 store
let unauthorizedHandler = () => {}
export const onUnauthorized = (fn) => {
  unauthorizedHandler = fn
}

// 把各種錯誤整理成一句人看得懂的訊息，元件只要顯示 err.message
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const data = err.response?.data
    let message = data?.message
    // 帶著 token 卻被拒 → token 已失效。登入 API 本身的 401（密碼錯）不算
    const isLoginCall = err.config?.url?.startsWith('/auth/')
    if (status === 401 && err.config?.headers?.Authorization && !isLoginCall) {
      unauthorizedHandler()
    }
    if (!err.response) {
      message = err.code === 'ECONNABORTED' ? '連線逾時，請稍後再試' : '無法連線到伺服器，請稍後再試'
    }
    const wrapped = new Error(message || '發生未知錯誤')
    wrapped.status = status
    wrapped.errors = data?.errors
    return Promise.reject(wrapped)
  },
)
