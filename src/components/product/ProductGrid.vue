<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: { type: Array, default: () => [] },
  loading: Boolean,
  skeletonCount: { type: Number, default: 8 },
})
</script>

<template>
  <!-- 載入中用骨架畫面，版面不會在資料回來時跳動 -->
  <ul v-if="loading" class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="商品載入中">
    <li v-for="n in skeletonCount" :key="n" class="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-roast-100">
      <div class="aspect-square bg-roast-50" />
      <div class="space-y-2 p-4">
        <div class="h-3 w-1/3 rounded bg-roast-50" />
        <div class="h-4 w-4/5 rounded bg-roast-50" />
        <div class="h-4 w-1/4 rounded bg-roast-50" />
      </div>
    </li>
  </ul>
  <ul v-else class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
    <li v-for="p in products" :key="p._id">
      <ProductCard :product="p" class="h-full" />
    </li>
  </ul>
</template>
