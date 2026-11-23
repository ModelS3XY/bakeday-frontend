<script setup>
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
  disabled: Boolean,
  label: { type: String, default: '數量' },
})
const emit = defineEmits(['update:modelValue'])

function change(delta) {
  const next = props.modelValue + delta
  if (next >= props.min && next <= props.max) emit('update:modelValue', next)
}
</script>

<template>
  <div
    class="inline-flex items-center rounded-full border border-roast-100 bg-white"
    role="group"
    :aria-label="label"
  >
    <button
      type="button"
      class="grid size-8 cursor-pointer place-items-center rounded-full text-roast-700 transition hover:bg-roast-50 disabled:cursor-not-allowed disabled:opacity-30"
      :disabled="disabled || modelValue <= min"
      aria-label="減少數量"
      @click="change(-1)"
    >
      <BaseIcon name="minus" size="size-4" />
    </button>
    <output class="w-8 text-center text-sm tabular-nums" aria-live="polite">{{ modelValue }}</output>
    <button
      type="button"
      class="grid size-8 cursor-pointer place-items-center rounded-full text-roast-700 transition hover:bg-roast-50 disabled:cursor-not-allowed disabled:opacity-30"
      :disabled="disabled || modelValue >= max"
      aria-label="增加數量"
      @click="change(1)"
    >
      <BaseIcon name="plus" size="size-4" />
    </button>
  </div>
</template>
