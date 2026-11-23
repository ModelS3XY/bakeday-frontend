<script setup>
import { onMounted, ref } from 'vue'
import { productApi } from '@/api'
import ProductGrid from '@/components/product/ProductGrid.vue'
import StatusBlock from '@/components/ui/StatusBlock.vue'

const products = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [list, cats] = await Promise.all([
      productApi.list({ limit: 8, sort: 'newest' }),
      productApi.categories(),
    ])
    products.value = list.data
    categories.value = cats
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
onMounted(load)

const categoryCopy = {
  toast: '每天早餐的基本款，柔軟又百搭',
  artisan: '長時間發酵，越嚼越有麥香',
  pastry: '層層酥皮，配咖啡或下午茶剛好',
  bagel: '先燙後烤的 Q 彈口感',
}
</script>

<template>
  <section class="relative overflow-hidden bg-roast-900 text-white" aria-labelledby="hero-title">
    <img
      src="https://picsum.photos/seed/bakeday-hero/1600/900"
      alt=""
      class="absolute inset-0 size-full object-cover opacity-30"
      fetchpriority="high"
    />
    <div class="relative container-page py-20 sm:py-28 lg:py-36">
      <p class="text-sm tracking-[0.3em] text-roast-300">FRESHLY BAKED · SINCE 2026</p>
      <h1 id="hero-title" class="mt-4 text-3xl leading-tight font-bold sm:text-5xl">
        每一天，<br class="sm:hidden" />都值得一口好麵包
      </h1>
      <p class="mt-4 max-w-md text-roast-100 sm:text-lg">嚴選麵粉與天然酵母，每天清晨小批次出爐，新鮮送到你手上。</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <RouterLink :to="{ name: 'products' }" class="btn bg-white text-roast-900 hover:bg-roast-100">探索所有商品</RouterLink>
        <RouterLink :to="{ name: 'products', query: { category: 'pastry' } }" class="btn border border-white/40 text-white hover:bg-white/10">
          人氣可頌
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="container-page mt-14" aria-labelledby="cat-title">
    <h2 id="cat-title" class="text-xl font-bold sm:text-2xl">依分類選購</h2>
    <ul class="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      <li v-for="(c, i) in categories" :key="c._id">
        <RouterLink
          :to="{ name: 'products', query: { category: c.slug } }"
          class="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-latte"
        >
          <img
            :src="`https://picsum.photos/seed/bakeday-cat-${i}/600/450`"
            alt=""
            loading="lazy"
            class="size-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-roast-900/80 to-transparent p-4 text-white">
            <h3 class="font-bold sm:text-lg">{{ c.name }}</h3>
            <p class="hidden text-xs text-roast-100 sm:block">{{ categoryCopy[c.slug] }}</p>
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>

  <section class="container-page mt-14" aria-labelledby="new-title">
    <div class="flex items-end justify-between">
      <h2 id="new-title" class="text-xl font-bold sm:text-2xl">最新上架</h2>
      <RouterLink :to="{ name: 'products' }" class="text-sm text-roast-500 hover:text-roast-900">查看全部 →</RouterLink>
    </div>
    <div class="mt-5">
      <StatusBlock v-if="error" type="error" :message="error" @retry="load" />
      <ProductGrid v-else :products="products" :loading="loading" />
    </div>
  </section>
</template>
