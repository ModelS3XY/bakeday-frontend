import { http } from './http'

// 所有後端 API 集中在這裡；元件與 store 不直接寫 URL
export const authApi = {
  register: (payload) => http.post('/auth/register', payload).then((r) => r.data.data),
  login: (payload) => http.post('/auth/login', payload).then((r) => r.data.data),
  me: () => http.get('/auth/me').then((r) => r.data.data.user),
}

export const productApi = {
  list: (params) => http.get('/products', { params }).then((r) => r.data),
  get: (id) => http.get(`/products/${id}`).then((r) => r.data.data),
  categories: () => http.get('/categories').then((r) => r.data.data),
}

// 購物車每支 API 都回傳「最新的整台購物車」，前端直接用它覆蓋狀態，確保與後端一致
export const cartApi = {
  get: () => http.get('/cart').then((r) => r.data.data),
  add: (productId, qty = 1) => http.post('/cart/items', { productId, qty }).then((r) => r.data),
  update: (productId, qty) => http.patch(`/cart/items/${productId}`, { qty }).then((r) => r.data),
  remove: (productId) => http.delete(`/cart/items/${productId}`).then((r) => r.data),
  clear: () => http.delete('/cart').then((r) => r.data),
}
