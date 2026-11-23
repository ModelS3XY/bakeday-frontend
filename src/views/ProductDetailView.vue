<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productApi } from '@/api'
import { formatPrice } from '@/utils/format'
import StatusBlock from '@/components/ui/StatusBlock.vue'

const route = useRoute()

const product = ref(null)
const loading = ref(true)
const error = ref('')
const notFound = ref(false)

async function load() {
  loading.value = true
  error.value = ''
  notFound.value = false
  try {
    product.value = await productApi.get(route.params.id)
    document.title = `${product.value.name}｜焙日 Bakeday`
  } catch (e) {
    if (e.status === 404 || e.status === 400) notFound.value = true
    else error.value = e.message
  } finally {
    loading.value = false
  }
}
watch(() => route.params.id, load, { immediate: true })

const soldOut = computed(() => product.value?.stock <= 0)
</script>

<template>
  <div class="container-page py-8 sm:py-12">
    <StatusBlock v-if="loading" type="loading" />
    <StatusBlock v-else-if="notFound" type="empty" title="找不到這個商品" message="商品可能已下架或不存在。">
      <RouterLink :to="{ name: 'products' }" class="btn-primary mt-2">回到商品列表</RouterLink>
    </StatusBlock>
    <StatusBlock v-else-if="error" type="error" :message="error" @retry="load" />

    <article v-else-if="product" class="grid gap-8 md:grid-cols-2 md:gap-12">
      <figure class="overflow-hidden rounded-3xl bg-latte">
        <img :src="product.imageUrl" :alt="product.name" class="aspect-square size-full object-cover" />
      </figure>

      <div class="flex flex-col">
        <nav aria-label="麵包屑" class="text-sm text-roast-500">
          <ol class="flex flex-wrap gap-1">
            <li><RouterLink :to="{ name: 'products' }" class="hover:text-roast-900">所有商品</RouterLink> /</li>
            <li>
              <RouterLink :to="{ name: 'products', query: { category: product.category?.slug } }" class="hover:text-roast-900">
                {{ product.category?.name }}
              </RouterLink>
            </li>
          </ol>
        </nav>
        <h1 class="mt-3 text-2xl leading-snug font-bold sm:text-3xl">{{ product.name }}</h1>
        <data :value="product.price" class="mt-4 text-2xl font-semibold text-roast-700">{{ formatPrice(product.price) }}</data>
        <p class="mt-6 leading-relaxed text-roast-700">{{ product.description }}</p>

        <p class="mt-6 text-sm" :class="soldOut ? 'text-red-600' : 'text-roast-500'">
          {{ soldOut ? '目前已售完' : `庫存 ${product.stock} 件` }}
        </p>
      </div>
    </article>
  </div>
</template>
