import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cartApi } from '@/api'

const emptyCart = () => ({ items: [], totalQty: 0, totalPrice: 0 })

// 原則：購物車的「真實狀態」在後端。每次操作都送 API，成功後用後端回傳的整台購物車覆蓋本地狀態，
// 不在前端自己加減數量 —— 這樣就不會出現前後端不一致（例如庫存不足被後端拒絕，前端卻已經 +1）。
export const useCartStore = defineStore('cart', () => {
  const cart = ref(emptyCart())
  const loading = ref(false)
  const error = ref('')
  const open = ref(false) // 購物車側欄是否開啟
  const pendingIds = ref(new Set()) // 正在處理中的商品，用來 disable 按鈕避免連點

  const isPending = (productId) => pendingIds.value.has(productId)

  async function fetch() {
    loading.value = true
    error.value = ''
    try {
      cart.value = await cartApi.get()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // 包住每個寫入操作：標記 pending → 呼叫 API → 用回應覆蓋狀態
  async function mutate(productId, request) {
    pendingIds.value.add(productId)
    try {
      const res = await request()
      cart.value = res.data
      return res
    } finally {
      pendingIds.value.delete(productId)
    }
  }

  const add = (productId, qty = 1) => mutate(productId, () => cartApi.add(productId, qty))
  const update = (productId, qty) => mutate(productId, () => cartApi.update(productId, qty))
  const remove = (productId) => mutate(productId, () => cartApi.remove(productId))
  const clear = () => mutate('__all__', () => cartApi.clear())

  function reset() {
    cart.value = emptyCart()
    open.value = false
  }

  return { cart, loading, error, open, isPending, fetch, add, update, remove, clear, reset }
})
