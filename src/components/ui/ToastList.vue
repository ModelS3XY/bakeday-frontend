<script setup>
import { useToastStore } from '@/stores/toast'
import BaseIcon from './BaseIcon.vue'

const toast = useToastStore()
const styles = {
  success: { icon: 'check', cls: 'bg-roast-900 text-white' },
  error: { icon: 'alert', cls: 'bg-red-600 text-white' },
  info: { icon: 'info', cls: 'bg-white text-roast-900 ring-1 ring-roast-100' },
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    aria-live="polite"
  >
    <TransitionGroup
      enter-from-class="translate-y-3 opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition duration-200"
      leave-active-class="transition duration-200"
    >
      <div
        v-for="t in toast.toasts"
        :key="t.id"
        class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-lg"
        :class="styles[t.type].cls"
        :role="t.type === 'error' ? 'alert' : 'status'"
      >
        <BaseIcon :name="styles[t.type].icon" />
        <span class="flex-1">{{ t.message }}</span>
        <button type="button" class="cursor-pointer opacity-70 hover:opacity-100" aria-label="關閉通知" @click="toast.dismiss(t.id)">
          <BaseIcon name="close" size="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
