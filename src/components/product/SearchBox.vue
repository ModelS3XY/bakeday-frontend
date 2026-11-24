<script setup>
import { ref, watch } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

// 本地先存輸入值，送出（Enter）才通知父層，避免每打一個字就打一次 API
const draft = ref(props.modelValue)
watch(() => props.modelValue, (v) => (draft.value = v))

const submit = () => emit('update:modelValue', draft.value.trim())
function clear() {
  draft.value = ''
  submit()
}
</script>

<template>
  <search>
    <form class="relative" @submit.prevent="submit">
      <label for="product-search" class="sr-only">搜尋商品</label>
      <BaseIcon name="search" size="size-4" class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-roast-300" />
      <input
        id="product-search"
        v-model="draft"
        type="search"
        maxlength="50"
        placeholder="搜尋商品，例如：可頌、生吐司"
        class="input rounded-full! pr-20! pl-10!"
        enterkeyhint="search"
      />
      <button v-if="draft" type="button" class="absolute top-1/2 right-16 -translate-y-1/2 cursor-pointer p-1 text-roast-300 hover:text-roast-700" aria-label="清除搜尋" @click="clear">
        <BaseIcon name="close" size="size-4" />
      </button>
      <button type="submit" class="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer rounded-full bg-roast-700 px-3.5 py-1.5 text-xs text-white hover:bg-roast-900">
        搜尋
      </button>
    </form>
  </search>
</template>
