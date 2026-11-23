<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAddToCart } from '@/composables/useAddToCart'
import { formatPrice } from '@/utils/format'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const props = defineProps({ product: { type: Object, required: true } })
const cart = useCartStore()
const addToCart = useAddToCart()
const soldOut = computed(() => props.product.stock <= 0)
const pending = computed(() => cart.isPending(props.product._id))
</script>

<template>
  <article class="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-roast-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-roast-900/5">
    <div class="relative aspect-square overflow-hidden bg-latte">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        loading="lazy"
        class="size-full object-cover transition duration-500 group-hover:scale-105"
        :class="{ 'grayscale-[60%]': soldOut }"
      />
      <span v-if="soldOut" class="absolute top-3 left-3 rounded-full bg-roast-900/80 px-2.5 py-1 text-xs text-white">已售完</span>
    </div>

    <div class="flex flex-1 flex-col gap-1 p-3 sm:p-4">
      <p v-if="product.category" class="text-xs text-roast-500">{{ product.category.name }}</p>
      <h3 class="line-clamp-2 text-sm leading-snug font-medium sm:text-base">
        <!-- 用 after:inset-0 讓整張卡片可點，同時保留按鈕可以獨立點擊 -->
        <RouterLink :to="{ name: 'product', params: { id: product._id } }" class="after:absolute after:inset-0">
          {{ product.name }}
        </RouterLink>
      </h3>
      <div class="mt-auto flex items-center justify-between pt-2">
        <data :value="product.price" class="font-semibold text-roast-700 tabular-nums">{{ formatPrice(product.price) }}</data>
        <button
          type="button"
          class="relative z-10 grid size-9 cursor-pointer place-items-center rounded-full bg-roast-700 text-white transition hover:bg-roast-900 active:scale-90 disabled:cursor-not-allowed disabled:bg-roast-100 disabled:text-roast-300"
          :disabled="soldOut || pending"
          :aria-label="soldOut ? `${product.name} 已售完` : `將 ${product.name} 加入購物車`"
          @click="addToCart(product)"
        >
          <span v-if="pending" class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <BaseIcon v-else name="plus" size="size-4" />
        </button>
      </div>
    </div>
  </article>
</template>
