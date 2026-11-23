<script setup>
import { onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/utils/format'
import CartItem from './CartItem.vue'
import StatusBlock from '@/components/ui/StatusBlock.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const cart = useCartStore()
const toast = useToastStore()
const panel = ref(null)

const close = () => (cart.open = false)
const onKeydown = (e) => e.key === 'Escape' && close()

// 開啟時：鎖住背景捲動、聚焦面板、監聽 Esc
watch(
  () => cart.open,
  async (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      panel.value?.focus()
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
)
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

async function clearAll() {
  if (!confirm('確定要清空購物車嗎？')) return
  try {
    await cart.clear()
    toast.success('已清空購物車')
  } catch (e) {
    toast.error(e.message)
  }
}

function checkout() {
  toast.info('本專題不含結帳流程，感謝試用！')
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition duration-300" leave-active-class="transition duration-200">
      <div v-if="cart.open" class="fixed inset-0 z-50 bg-roast-900/40" aria-hidden="true" @click="close" />
    </Transition>

    <Transition enter-from-class="translate-x-full" leave-to-class="translate-x-full" enter-active-class="transition duration-300 ease-out" leave-active-class="transition duration-200 ease-in">
      <aside
        v-if="cart.open"
        ref="panel"
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabindex="-1"
      >
        <header class="flex items-center justify-between border-b border-roast-100 px-5 py-4">
          <h2 id="cart-title" class="text-lg font-bold">
            購物車 <span class="text-sm font-normal text-roast-500">（{{ cart.cart.totalQty }} 件）</span>
          </h2>
          <button type="button" class="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-roast-50" aria-label="關閉購物車" @click="close">
            <BaseIcon name="close" />
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-5">
          <StatusBlock v-if="cart.loading && !cart.cart.items.length" type="loading" message="正在取得購物車…" />
          <StatusBlock v-else-if="cart.error" type="error" :message="cart.error" @retry="cart.fetch()" />
          <StatusBlock v-else-if="!cart.cart.items.length" type="empty" title="購物車是空的" message="去逛逛，挑幾個今天想吃的麵包吧！">
            <RouterLink :to="{ name: 'products' }" class="btn-primary mt-2" @click="close">開始選購</RouterLink>
          </StatusBlock>
          <ul v-else class="divide-y divide-roast-100">
            <CartItem v-for="item in cart.cart.items" :key="item.product._id" :item="item" />
          </ul>
        </div>

        <footer v-if="cart.cart.items.length" class="space-y-3 border-t border-roast-100 bg-white px-5 py-4">
          <dl class="flex items-center justify-between">
            <dt class="text-sm text-roast-500">小計</dt>
            <dd class="text-xl font-bold tabular-nums">{{ formatPrice(cart.cart.totalPrice) }}</dd>
          </dl>
          <button type="button" class="btn-primary w-full" @click="checkout">前往結帳</button>
          <button type="button" class="w-full cursor-pointer text-center text-xs text-roast-500 underline-offset-2 hover:text-red-600 hover:underline" @click="clearAll">
            清空購物車
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>
