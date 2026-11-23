<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import AuthCard from '@/components/auth/AuthCard.vue'
import FormField from '@/components/auth/FormField.vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const submitting = ref(false)
const error = ref('')

// 只接受站內路徑，避免 ?redirect=https://evil.com 這種開放重新導向
const redirectTarget = () => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') && !r.startsWith('//') ? r : '/'
}

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    await auth.login(form)
    toast.success(`歡迎回來，${auth.user.name}`)
    router.replace(redirectTarget())
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthCard title="會員登入" subtitle="登入後即可使用購物車">
    <form class="space-y-5" novalidate @submit.prevent="submit">
      <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ error }}</p>
      <FormField id="login-email" v-model="form.email" label="Email" type="email" autocomplete="email" required />
      <FormField id="login-password" v-model="form.password" label="密碼" type="password" autocomplete="current-password" required />
      <button type="submit" class="btn-primary w-full" :disabled="submitting || !form.email || !form.password">
        <span v-if="submitting" class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        {{ submitting ? '登入中…' : '登入' }}
      </button>
    </form>

    <template #footer>
      還不是會員？
      <RouterLink :to="{ name: 'register', query: route.query }" class="font-medium text-roast-700 underline-offset-2 hover:underline">立即註冊</RouterLink>
    </template>
  </AuthCard>
</template>
