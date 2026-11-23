<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import AuthCard from '@/components/auth/AuthCard.vue'
import FormField from '@/components/auth/FormField.vue'

const auth = useAuthStore()
const cart = useCartStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const touched = reactive({})
const submitting = ref(false)
const serverError = ref('')
const serverFieldErrors = ref({})

// 前端驗證只是為了即時回饋，真正把關的是後端
const errors = computed(() => ({
  name: !form.name.trim() ? '請輸入名稱' : '',
  email: !/^\S+@\S+\.\S+$/.test(form.email) ? '請輸入有效的 email' : '',
  password: form.password.length < 8 ? '密碼至少 8 碼' : '',
  confirm: form.confirm !== form.password ? '兩次輸入的密碼不一致' : '',
}))
const valid = computed(() => Object.values(errors.value).every((e) => !e))
const fieldError = (key) => serverFieldErrors.value[key] || (touched[key] ? errors.value[key] : '')

const redirectTarget = () => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') && !r.startsWith('//') ? r : '/'
}

async function submit() {
  Object.keys(form).forEach((k) => (touched[k] = true))
  serverError.value = ''
  serverFieldErrors.value = {}
  if (!valid.value) return

  submitting.value = true
  try {
    await auth.register({ name: form.name, email: form.email, password: form.password })
    cart.fetch()
    toast.success('註冊成功，歡迎加入焙日！')
    router.replace(redirectTarget())
  } catch (e) {
    serverError.value = e.message
    // 後端回傳的欄位錯誤顯示在對應欄位下
    serverFieldErrors.value = Object.fromEntries((e.errors || []).map((x) => [x.field, x.message]))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthCard title="註冊會員" subtitle="加入焙日，每天都有剛出爐的好麵包">
    <form class="space-y-5" novalidate @submit.prevent="submit">
      <p v-if="serverError" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ serverError }}</p>
      <FormField id="reg-name" v-model="form.name" label="名稱" autocomplete="name" maxlength="50" :error="fieldError('name')" @blur="touched.name = true" />
      <FormField id="reg-email" v-model="form.email" label="Email" type="email" autocomplete="email" :error="fieldError('email')" @blur="touched.email = true" />
      <FormField
        id="reg-password"
        v-model="form.password"
        label="密碼"
        type="password"
        autocomplete="new-password"
        maxlength="72"
        hint="至少 8 碼"
        :error="fieldError('password')"
        @blur="touched.password = true"
      />
      <FormField id="reg-confirm" v-model="form.confirm" label="確認密碼" type="password" autocomplete="new-password" :error="fieldError('confirm')" @blur="touched.confirm = true" />
      <button type="submit" class="btn-primary w-full" :disabled="submitting">
        <span v-if="submitting" class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        {{ submitting ? '註冊中…' : '註冊' }}
      </button>
    </form>

    <template #footer>
      已經有帳號了？
      <RouterLink :to="{ name: 'login', query: route.query }" class="font-medium text-roast-700 underline-offset-2 hover:underline">前往登入</RouterLink>
    </template>
  </AuthCard>
</template>
