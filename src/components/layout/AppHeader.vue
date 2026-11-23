<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const route = useRoute()
const menuOpen = ref(false)

const links = [
  { to: { name: 'home' }, label: '首頁' },
  { to: { name: 'products' }, label: '所有商品' },
]

// 換頁後自動收起手機選單
watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-roast-100/70 bg-cream/90 backdrop-blur">
    <div class="container-page flex h-16 items-center gap-4">
      <button
        type="button"
        class="-ml-2 grid size-10 cursor-pointer place-items-center rounded-full hover:bg-roast-50 md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        aria-label="開啟選單"
        @click="menuOpen = !menuOpen"
      >
        <BaseIcon :name="menuOpen ? 'close' : 'menu'" />
      </button>

      <RouterLink :to="{ name: 'home' }" class="flex items-baseline gap-2 font-bold tracking-wide">
        <span class="text-xl text-roast-700">焙日</span>
        <span class="text-xs font-medium tracking-[0.2em] text-roast-500">BAKEDAY</span>
      </RouterLink>

      <nav class="ml-6 hidden md:block" aria-label="主要導覽">
        <ul class="flex gap-1">
          <li v-for="link in links" :key="link.label">
            <RouterLink
              :to="link.to"
              class="rounded-full px-4 py-2 text-sm transition hover:bg-roast-50"
              exact-active-class="bg-roast-100 font-medium text-roast-900"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 手機版選單 -->
    <Transition enter-from-class="opacity-0 -translate-y-2" leave-to-class="opacity-0" enter-active-class="transition" leave-active-class="transition">
      <nav v-if="menuOpen" id="mobile-menu" class="border-t border-roast-100 bg-cream md:hidden" aria-label="行動版導覽">
        <ul class="container-page flex flex-col py-2">
          <li v-for="link in links" :key="link.label">
            <RouterLink :to="link.to" class="block rounded-xl px-3 py-3 hover:bg-roast-50" exact-active-class="font-medium text-roast-700">
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>
