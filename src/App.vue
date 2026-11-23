<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import ToastList from '@/components/ui/ToastList.vue'
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
  <CartDrawer />
  <ToastList />
</template>
