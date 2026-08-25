# COC 商圈診斷工具｜Cloudflare Pages 部署包

## 目前版本定位
這是「COC 商圈診斷工具」的 MVP 靜態網頁原型，適合先上傳到 Cloudflare Pages 測試課堂操作流程。

目前版本：
- 工具名稱：COC 商圈診斷工具
- 商圈分類：R1 住宅區、COM 商辦區、Sub 第三城鎮／One store town
- 四階段流程：需求與痛點、資源與做法、條件與限制、下一步行動
- AI 產出目前為前端模擬結果，尚未串接 OpenAI API
- 正式版若要讓 AI 真正產出內容，需增加後端 API，API Key 不可放在前端

## 建議部署架構
- GitHub：原始碼與版本管理
- Cloudflare Pages：正式課程網址
- Cloudflare Workers / Pages Functions：未來處理 OpenAI API 呼叫
- Cloudflare D1 / KV / Supabase：未來儲存小組資料與後台資料

一句話：GitHub 管程式，Cloudflare 管上線。

## Cloudflare Pages 部署步驟

### 方法 A：直接上傳
1. 登入 Cloudflare。
2. 進入 Workers & Pages。
3. 選擇 Pages。
4. 建立新專案。
5. 選擇 Upload assets。
6. 上傳本資料夾內容，或直接上傳 `index.html`。
7. 完成後取得 Cloudflare Pages 網址。
8. 將網址轉成 QR Code，供學員掃描。

### 方法 B：連接 GitHub
1. 在 GitHub 建立 repository，例如 `coc-diagnosis-tool`。
2. 將本資料夾內容上傳到 repository。
3. 到 Cloudflare Pages 建立新專案。
4. 選擇 Connect to Git。
5. 選取 repository。
6. Build command 留空。
7. Output directory 設為 `/`。
8. Deploy。

## 正式版 API 原則
正式版不要讓前端直接呼叫 OpenAI API。

建議流程：
前端網頁 → Cloudflare Pages Function / Worker → OpenAI API → 回傳結果 → 前端顯示

OpenAI API Key 應放在 Cloudflare 環境變數中，例如 `OPENAI_API_KEY`。

## 課程現場建議
400 位學員不建議每人各自操作。

建議：
- 每組 6–8 人
- 每組 1 台手機或筆電操作
- 約 50–70 組
- 每組只在指定階段按 AI 按鈕
- 每個 AI 按鈕需設計 loading 狀態與防連點機制

## 後續開發優先順序
第一優先：
1. 上 Cloudflare Pages，確認所有裝置可開啟。
2. 讓助教用手機測試完整流程。
3. 產出 QR Code。

第二優先：
1. 加入資料儲存。
2. 加入講師後台。
3. 可匯出 CSV / Excel。

第三優先：
1. 串接 OpenAI API。
2. 增加防連點與錯誤處理。
3. 加入每組進度狀態。


## 必勝客門店空間限制規則

本工具以必勝客門店情境為主。多數門店以外帶、外送與取餐為主要功能，通常不具備完整內用座位或長時間停留空間。

因此，後續 AI 在產出 COC 診斷與候選行動時，應避免預設門店可以承接長時間內用、久坐、聚會或大型店內活動。

候選行動應優先考慮：
1. 社區試吃活動
2. 社區市集擺攤
3. 外部場地合作
4. 門店短時段取餐互動
5. 預購、外帶、外送導流
6. 熟客邀請與社區回訪

若候選行動涉及門店前場，必須提醒：
需確認門店是否有足夠前場空間，且活動不得干擾取餐、外送與尖峰營運動線。
