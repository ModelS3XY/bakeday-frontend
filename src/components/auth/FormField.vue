<script setup>
// 其餘屬性（autocomplete、required…）轉給 input，而不是外層 div
defineOptions({ inheritAttrs: false })
const model = defineModel({ type: String, default: '' })
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: String,
  hint: String,
})
</script>

<template>
  <div>
    <label :for="id" class="mb-1.5 block text-sm font-medium">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      class="input"
      :class="{ 'border-red-400! focus:ring-red-100!': error }"
      :aria-invalid="!!error"
      :aria-describedby="error || hint ? `${id}-msg` : undefined"
      v-bind="$attrs"
    />
    <p v-if="error || hint" :id="`${id}-msg`" class="mt-1 text-xs" :class="error ? 'text-red-600' : 'text-roast-500'">
      {{ error || hint }}
    </p>
  </div>
</template>
