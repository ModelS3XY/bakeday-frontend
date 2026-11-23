<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' }, // 分類 slug，空字串代表全部
})
defineEmits(['update:modelValue'])
</script>

<template>
  <!-- 手機版可橫向捲動，不會擠成多行 -->
  <div class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="商品分類">
    <div class="flex w-max gap-2">
      <button
        v-for="c in [{ slug: '', name: '全部' }, ...categories]"
        :key="c.slug"
        type="button"
        class="cursor-pointer rounded-full border px-4 py-2 text-sm whitespace-nowrap transition"
        :class="
          modelValue === c.slug
            ? 'border-roast-700 bg-roast-700 text-white'
            : 'border-roast-100 bg-white text-roast-700 hover:border-roast-300'
        "
        :aria-pressed="modelValue === c.slug"
        @click="$emit('update:modelValue', c.slug)"
      >
        {{ c.name }}
      </button>
    </div>
  </div>
</template>
