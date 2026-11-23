<template>
  <footer class="mt-20 border-t border-roast-100 bg-roast-900 text-roast-100">
    <div class="container-page grid gap-8 py-12 sm:grid-cols-3">
      <section>
        <h2 class="text-lg font-bold text-white">焙日 Bakeday</h2>
        <p class="mt-2 text-sm leading-relaxed text-roast-300">每天清晨出爐，用簡單的原料做好吃的麵包。</p>
      </section>
      <nav aria-label="頁尾導覽">
        <h2 class="text-sm font-semibold text-white">逛逛</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li><RouterLink to="/products?category=toast" class="hover:text-white">吐司</RouterLink></li>
          <li><RouterLink to="/products?category=artisan" class="hover:text-white">歐式麵包</RouterLink></li>
          <li><RouterLink to="/products?category=pastry" class="hover:text-white">可頌與丹麥</RouterLink></li>
        </ul>
      </nav>
      <section>
        <h2 class="text-sm font-semibold text-white">關於本站</h2>
        <p class="mt-3 text-sm leading-relaxed text-roast-300">本網站為作品集專題，商品與價格皆為示意，不提供實際交易。</p>
      </section>
    </div>
    <p class="border-t border-white/10 py-4 text-center text-xs text-roast-300">© 2026 Bakeday</p>
  </footer>
</template>
