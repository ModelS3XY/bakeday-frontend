<template>
  <section class="container-page grid place-items-center py-24 text-center">
    <p class="text-6xl font-bold text-roast-100">404</p>
    <h1 class="mt-4 text-xl font-bold">找不到這個頁面</h1>
    <p class="mt-2 text-sm text-roast-500">網址可能打錯了，或頁面已經移除。</p>
    <RouterLink :to="{ name: 'home' }" class="btn-primary mt-6">回到首頁</RouterLink>
  </section>
</template>
