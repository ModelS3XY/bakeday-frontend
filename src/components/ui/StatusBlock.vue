<script setup>
import BaseIcon from './BaseIcon.vue'

// 統一呈現「載入中 / 查無結果 / 錯誤」三種狀態
defineProps({
  type: { type: String, required: true, validator: (v) => ['loading', 'empty', 'error'].includes(v) },
  title: String,
  message: String,
})
defineEmits(['retry'])
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center"
    :role="type === 'error' ? 'alert' : 'status'"
    aria-live="polite"
  >
    <template v-if="type === 'loading'">
      <span class="size-9 animate-spin rounded-full border-3 border-roast-100 border-t-roast-500" />
      <p class="text-sm text-roast-500">{{ message || '載入中…' }}</p>
    </template>

    <template v-else>
      <span
        class="grid size-12 place-items-center rounded-full"
        :class="type === 'error' ? 'bg-red-50 text-red-600' : 'bg-roast-50 text-roast-500'"
      >
        <BaseIcon :name="type === 'error' ? 'alert' : 'search'" />
      </span>
      <p class="font-medium">{{ title || (type === 'error' ? '資料載入失敗' : '查無結果') }}</p>
      <p v-if="message" class="max-w-sm text-sm text-roast-500">{{ message }}</p>
      <button v-if="type === 'error'" type="button" class="btn-outline mt-2" @click="$emit('retry')">
        重新載入
      </button>
      <slot />
    </template>
  </div>
</template>
