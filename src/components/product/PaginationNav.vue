<script setup>
import { computed } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})
const emit = defineEmits(['change'])

// 頁數多時只顯示 1 … 4 5 6 … 10，避免手機版擠爆
const pages = computed(() => {
  const { page, totalPages: total } = props
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...set].sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i && p - sorted[i - 1] > 1 ? ['…', p] : [p]))
})

const go = (p) => p !== props.page && p >= 1 && p <= props.totalPages && emit('change', p)
const btn = 'grid size-10 cursor-pointer place-items-center rounded-full text-sm transition disabled:cursor-not-allowed disabled:opacity-30'
</script>

<template>
  <nav v-if="totalPages > 1" class="flex justify-center" aria-label="分頁">
    <ul class="flex items-center gap-1">
      <li>
        <button type="button" :class="[btn, 'hover:bg-roast-50']" :disabled="page <= 1" aria-label="上一頁" @click="go(page - 1)">
          <BaseIcon name="chevronLeft" size="size-4" />
        </button>
      </li>
      <li v-for="(p, i) in pages" :key="`${p}-${i}`">
        <span v-if="p === '…'" class="grid size-10 place-items-center text-roast-300">…</span>
        <button
          v-else
          type="button"
          :class="[btn, p === page ? 'bg-roast-700 font-semibold text-white' : 'hover:bg-roast-50']"
          :aria-current="p === page ? 'page' : undefined"
          :aria-label="`第 ${p} 頁`"
          @click="go(p)"
        >
          {{ p }}
        </button>
      </li>
      <li>
        <button type="button" :class="[btn, 'hover:bg-roast-50']" :disabled="page >= totalPages" aria-label="下一頁" @click="go(page + 1)">
          <BaseIcon name="chevronRight" size="size-4" />
        </button>
      </li>
    </ul>
  </nav>
</template>
