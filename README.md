# 焙日 Bakeday｜手作麵包電商 — 前端

手作麵包選物電商的前端，所有資料皆來自自行開發的後端 API（無假資料、無 JSON Server）。

- **網站網址**：https://bakeday.pages.dev
- **後端 API**：https://bakeday-backend.onrender.com（API 文件：https://bakeday-backend.onrender.com/api-docs）
- **後端 Repo**：https://github.com/ModelS3XY/bakeday-backend

> 後端部署在 Render 免費方案，閒置後第一次載入可能需要等待約 30–60 秒喚醒，畫面會顯示載入中。

## 測試帳號

| 角色 | Email | 密碼 |
| --- | --- | --- |
| 一般會員 | `user@bakeday.test` | `user12345` |
| 管理員 | `admin@bakeday.test` | `<部署時設定的 ADMIN_PASSWORD>` |

> 管理員的商品新增/編輯/刪除為 API 功能（依題目要求未製作後台頁面），請透過後端 `/api-docs` 測試。

## 技術選擇

| 項目 | 選擇 |
| --- | --- |
| 建置工具 | Vite |
| 框架 | Vue 3（Composition API、`<script setup>`） |
| 路由 | Vue Router（History mode） |
| 狀態管理 | Pinia（auth / cart / toast 三個 store） |
| HTTP | axios（攔截器統一帶 token、統一錯誤訊息） |
| CSS | Tailwind CSS v4 |
| 部署 | Cloudflare Pages |

## 功能

- **頁面**：首頁、商品列表、商品內容、登入、註冊、購物車（右側 Offcanvas）、404
- **商品列表**：分類篩選、關鍵字搜尋、排序、分頁；條件同步到網址 query，重新整理或分享連結都能保留
- **狀態提示**：載入中（骨架畫面）、查無結果、API 錯誤（可重新載入）
- **登入狀態**：token 存於 localStorage，重新整理後呼叫 `/api/auth/me` 驗證並恢復；token 過期自動登出並提示
- **未登入加入購物車**：提示後導向登入頁，登入成功自動回到原本的頁面
- **購物車同步**：每次加入/增減/移除都呼叫 API，並以後端回傳的整台購物車覆蓋本地狀態，前後端永遠一致；處理中按鈕會鎖定，避免連點
- **操作回饋**：Toast 通知、購物車數量徽章動畫、按鈕 loading、Hover 效果
- **RWD**：手機 2 欄 → 平板 3 欄 → 桌機 4 欄；手機版漢堡選單、分類橫向捲動

## 專案結構

```
src/
├── api/                 # http.js（axios 實例與攔截器）、index.js（所有 API 呼叫）
├── stores/              # Pinia：auth、cart、toast
├── composables/         # useAddToCart（未登入引導 + 加入購物車回饋）
├── router/              # 路由與守衛（已登入者不能進登入/註冊頁）
├── views/               # 頁面
├── components/
│   ├── layout/          # AppHeader、AppFooter
│   ├── product/         # ProductCard、ProductGrid、CategoryFilter、SearchBox、PaginationNav
│   ├── cart/            # CartDrawer、CartItem
│   ├── auth/            # AuthCard、FormField
│   └── ui/              # BaseIcon、StatusBlock、QtyStepper、ToastList
└── utils/format.js      # 價格格式化
```

## 本機啟動

需要 Node.js 20 以上，並先啟動後端（預設 `http://localhost:3000`）。

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 輸出到 dist/
```

## 環境變數

| 變數 | 說明 | 預設 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 後端網址（不含 `/api`） | `http://localhost:3000` |

本機若後端不在預設位置，建立 `.env.local` 設定即可；部署時在 Cloudflare Pages 的環境變數設定。

## 部署（Cloudflare Pages）

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → 連結此 GitHub repo
2. Framework preset：Vue（或 None）；Build command：`npm run build`；Build output directory：`dist`
3. 環境變數：`VITE_API_BASE_URL=https://<後端網址>`（Vite 在 **build 時**把它寫進 JS，修改後需重新部署）
4. `public/_redirects` 已設定 SPA fallback，直接重新整理子頁面不會 404
5. 記得把前端網址（`https://<專案>.pages.dev`）加入後端的 `CORS_ORIGIN`
