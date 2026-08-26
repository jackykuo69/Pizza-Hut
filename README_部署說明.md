# COC 商圈活動設計引導工具｜V5 含後台版

## 本版重點

1. 移除學員頁面上可見的預設通關碼，避免學員提前看到後續階段口令。
2. 保留階段解鎖機制：學員必須等待講師公布通關碼後才能進入下一階段。
3. Step 3「相對價值或處理方向」修正：
   - 刪除「不硬把限制變優勢，只降低它對顧客的影響」這個可勾選項。
   - 改為提醒文字：若某限制無法形成相對價值，就承認它仍是限制，改用降低影響、改善流程或避開限制的方式處理。
4. 第四階段候選行動會依第一層商圈類型與第二層細分情境調整：
   - R1 住宅區：社區試吃、社區市集、熟客回訪、預購外帶、陪伴型家庭活動
   - COM 商辦區：午餐快取、企業團訂試吃、下班外帶、取餐外送分流
   - Sub 第三城鎮：地方活動、在地熟客、社區預購、在地合作試吃、觀光補給
5. 「選定候選行動」新增格式說明：
   - 建議輸入：1,5 或 1、5
   - 可用半形逗號、頓號或空格分隔
   - 支援中文數字，例如：一、五
6. 後台維持 `/admin.html`，資料庫 binding 名稱仍為 `DB`。

## 部署方式

將本資料夾內容上傳到 GitHub repository，Cloudflare Pages 會重新部署。

Cloudflare Pages 設定：
- Framework preset：None
- Build command：留空
- Build output directory：/
- Root directory：留空

## D1 設定提醒

若要讓後台看到不同裝置資料，需要：
- D1 database：coc_activity_db
- Pages Functions binding name：DB
- schema.sql 已執行
