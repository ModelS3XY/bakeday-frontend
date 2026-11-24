import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

// 「加入購物車」在商品卡、商品詳情都會用到，邏輯集中在這裡：
// 未登入 → 提示並導向登入頁，登入後回到原本頁面；已登入 → 呼叫 API 並給回饋
export function useAddToCart() {
  const auth = useAuthStore()
  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()
  const route = useRoute()

  return async function addToCart(product, qty = 1) {
    await auth.init() // 重新整理後登入狀態還在確認中時，先等確認完，避免把已登入的人當成未登入
    if (!auth.isLoggedIn) {
      toast.info('請先登入會員才能加入購物車')
      router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }
    try {
      await cart.add(product._id, qty)
      toast.success(`已將「${product.name}」加入購物車`)
    } catch (e) {
      toast.error(e.message)
    }
  }
}
