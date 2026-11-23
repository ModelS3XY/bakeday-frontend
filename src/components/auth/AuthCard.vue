<script setup>
// 登入與註冊頁共用的外框
defineProps({ title: String, subtitle: String })
</script>

<template>
  <div class="container-page grid place-items-center py-12 sm:py-20">
    <section class="w-full max-w-md rounded-3xl bg-white p-6 ring-1 ring-roast-100 sm:p-10">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 text-sm text-roast-500">{{ subtitle }}</p>
      <div class="mt-8"><slot /></div>
      <footer class="mt-6 border-t border-roast-100 pt-6 text-center text-sm text-roast-500">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>
