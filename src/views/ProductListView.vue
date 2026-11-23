<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi } from '@/api'
import ProductGrid from '@/components/product/ProductGrid.vue'
import CategoryFilter from '@/components/product/CategoryFilter.vue'
import SearchBox from '@/components/product/SearchBox.vue'
import PaginationNav from '@/components/product/PaginationNav.vue'
import StatusBlock from '@/components/ui/StatusBlock.vue'

const route = useRoute()
const router = useRouter()

// 篩選條件存在網址 query（?category=&q=&page=&sort=），
// 好處：重新整理不會遺失、可分享連結、瀏覽器上一頁會回到上一個篩選狀態
const filters = computed(() => ({
  page: Math.max(1, Number(route.query.page) || 1),
  category: route.query.category || '',
  q: route.query.q || '',
  sort: route.query.sort || 'newest',
}))

function setFilter(patch) {
  // 換分類/關鍵字/排序時回到第 1 頁
  const next = { ...filters.value, page: 1, ...patch }
  const query = {}
  if (next.page > 1) query.page = next.page
  if (next.category) query.category = next.category
  if (next.q) query.q = next.q
  if (next.sort !== 'newest') query.sort = next.sort
  router.push({ query })
}

const categories = ref([])
const products = ref([])
const pagination = ref({ page: 1, totalPages: 0, total: 0 })
const loading = ref(true)
const error = ref('')

let requestId = 0
async function load() {
  // 使用者快速切換條件時，只採用「最後一次」請求的結果，避免舊資料覆蓋新資料（race condition）
  const id = ++requestId
  loading.value = true
  error.value = ''
  try {
    const res = await productApi.list({ ...filters.value, limit: 8 })
    if (id !== requestId) return
    products.value = res.data
    pagination.value = res.pagination
  } catch (e) {
    if (id === requestId) error.value = e.message
  } finally {
    if (id === requestId) loading.value = false
  }
}

watch(filters, load, { immediate: true })
onMounted(async () => {
  try {
    categories.value = await productApi.categories()
  } catch {
    /* 分類載入失敗不影響商品列表 */
  }
})

const currentCategoryName = computed(
  () => categories.value.find((c) => c.slug === filters.value.category)?.name ?? '所有商品',
)

function changePage(page) {
  setFilter({ ...filters.value, page })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="container-page py-8 sm:py-10">
    <header class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold sm:text-3xl">{{ currentCategoryName }}</h1>
      <p class="text-sm text-roast-500" aria-live="polite">
        <template v-if="!loading && !error">
          <span v-if="filters.q">「{{ filters.q }}」的搜尋結果，</span>共 {{ pagination.total }} 件商品
        </template>
        <template v-else>&nbsp;</template>
      </p>
    </header>

    <section class="mt-6 flex flex-col gap-4" aria-label="篩選條件">
      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <div class="md:w-96"><SearchBox :model-value="filters.q" @update:model-value="setFilter({ q: $event })" /></div>
        <label class="flex items-center gap-2 text-sm md:ml-auto">
          <span class="shrink-0 text-roast-500">排序</span>
          <select :value="filters.sort" class="input w-auto! py-2!" @change="setFilter({ sort: $event.target.value })">
            <option value="newest">最新上架</option>
            <option value="price_asc">價格低到高</option>
            <option value="price_desc">價格高到低</option>
          </select>
        </label>
      </div>
      <CategoryFilter :categories="categories" :model-value="filters.category" @update:model-value="setFilter({ category: $event })" />
    </section>

    <section class="mt-6" aria-label="商品列表">
      <StatusBlock v-if="error" type="error" :message="error" @retry="load" />
      <StatusBlock
        v-else-if="!loading && !products.length"
        type="empty"
        title="找不到符合條件的商品"
        message="試試其他關鍵字，或切換到其他分類。"
      >
        <button type="button" class="btn-outline mt-2" @click="setFilter({ q: '', category: '' })">清除篩選條件</button>
      </StatusBlock>
      <ProductGrid v-else :products="products" :loading="loading" :skeleton-count="8" />
    </section>

    <div class="mt-10">
      <PaginationNav
        v-if="!error && !loading"
        :page="pagination.page"
        :total-pages="pagination.totalPages"
        @change="changePage"
      />
    </div>
  </div>
</template>
