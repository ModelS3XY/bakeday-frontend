<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseIcon from '@/components/ui/BaseIcon.vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)

const links = [
  { to: { name: 'home' }, label: '首頁' },
  { to: { name: 'products' }, label: '所有商品' },
]

// 換頁後自動收起手機選單
watch(() => route.fullPath, () => (menuOpen.value = false))

function logout() {
  auth.logout()
  toast.success('已登出')
  router.push({ name: 'home' })
}
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

      <div class="ml-auto flex items-center gap-2">
        <template v-if="auth.ready">
          <template v-if="auth.isLoggedIn">
            <span class="hidden items-center gap-1.5 text-sm text-roast-700 sm:flex">
              <BaseIcon name="user" size="size-4" />
              {{ auth.user.name }}
              <span v-if="auth.user.role === 'admin'" class="rounded bg-roast-700 px-1.5 py-0.5 text-[10px] text-white">管理員</span>
            </span>
            <button type="button" class="hidden cursor-pointer rounded-full px-3 py-2 text-sm text-roast-500 hover:bg-roast-50 hover:text-roast-900 sm:block" @click="logout">
              登出
            </button>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'login' }" class="hidden rounded-full px-3 py-2 text-sm hover:bg-roast-50 sm:block">登入</RouterLink>
            <RouterLink :to="{ name: 'register' }" class="btn-primary hidden px-4! py-2! sm:inline-flex">註冊</RouterLink>
          </template>
        </template>
      </div>
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
          <li class="mt-2 border-t border-roast-100 pt-2">
            <template v-if="auth.isLoggedIn">
              <p class="px-3 py-2 text-sm text-roast-500">嗨，{{ auth.user.name }}</p>
              <button type="button" class="w-full cursor-pointer rounded-xl px-3 py-3 text-left hover:bg-roast-50" @click="logout">登出</button>
            </template>
            <div v-else class="flex gap-2 px-3 py-2">
              <RouterLink :to="{ name: 'login' }" class="btn-outline flex-1">登入</RouterLink>
              <RouterLink :to="{ name: 'register' }" class="btn-primary flex-1">註冊</RouterLink>
            </div>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>
