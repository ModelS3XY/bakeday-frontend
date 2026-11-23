<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/utils/format'
import QtyStepper from '@/components/ui/QtyStepper.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const props = defineProps({ item: { type: Object, required: true } })
const cart = useCartStore()
const toast = useToastStore()
const pending = computed(() => cart.isPending(props.item.product._id))

async function setQty(qty) {
  try {
    await cart.update(props.item.product._id, qty)
  } catch (e) {
    toast.error(e.message)
  }
}

async function remove() {
  try {
    await cart.remove(props.item.product._id)
    toast.success(`已移除「${props.item.product.name}」`)
  } catch (e) {
    toast.error(e.message)
  }
}
</script>

<template>
  <li class="flex gap-4 py-4 transition" :class="{ 'opacity-60': pending }" :aria-busy="pending">
    <RouterLink
      :to="{ name: 'product', params: { id: item.product._id } }"
      class="size-20 shrink-0 overflow-hidden rounded-xl bg-latte"
      @click="cart.open = false"
    >
      <img :src="item.product.imageUrl" :alt="item.product.name" class="size-full object-cover" loading="lazy" />
    </RouterLink>
    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <div class="flex items-start justify-between gap-2">
        <h3 class="line-clamp-2 text-sm font-medium">{{ item.product.name }}</h3>
        <button
          type="button"
          class="-mt-1 -mr-1 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-roast-300 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
          :disabled="pending"
          :aria-label="`移除 ${item.product.name}`"
          @click="remove"
        >
          <BaseIcon name="trash" size="size-4" />
        </button>
      </div>
      <p class="text-xs text-roast-500">{{ formatPrice(item.product.price) }} / 件</p>
      <div class="mt-auto flex items-center justify-between">
        <QtyStepper
          :model-value="item.qty"
          :max="Math.min(99, item.product.stock)"
          :disabled="pending"
          :label="`${item.product.name} 數量`"
          @update:model-value="setQty"
        />
        <data :value="item.subtotal" class="text-sm font-semibold tabular-nums">{{ formatPrice(item.subtotal) }}</data>
      </div>
    </div>
  </li>
</template>
