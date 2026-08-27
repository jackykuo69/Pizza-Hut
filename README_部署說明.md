# COCA 商圈活動設計框架｜V29

## 本版重點

V29 是架構升級版，依據高階會議後的共識重設前台流程與後台資料結構。

### 前台流程

1. Step 0｜先看這家店的生意從哪裡來
   - 不再直接請主管選商圈類型。
   - Q1～Q4 採「主要 1 項＋次要 1 項」判讀商圈主型與副型。
   - Q5 單選最想強化的生意，作為 Action Design 的經營目標校準。
2. Step 1｜三類顧客需求地圖
   - 既有回訪客
   - 商圈機會客
   - 組織／團體客
3. Step 2｜四層作戰條件
   - 店總經理個人
   - 門店條件
   - 總部資源與支援
   - 商圈可用條件
4. Step 3｜限制、影響與處理方向
5. 客群經營優先判斷表
6. Step 4｜AI 整合 COC 產生候選方案

## OpenAI API 設定

若要使用 AI 即時整合產生候選方案，請在 Cloudflare Pages 的環境變數新增：

- `OPENAI_API_KEY`：OpenAI API key
- `OPENAI_MODEL`：選填，預設為 `gpt-5-mini`

若未設定 `OPENAI_API_KEY`，網站仍可運作，但 Step 4 會使用規則式暫用方案，不是真正 AI 生成。

## D1 設定

D1 binding 維持：

- Variable name：`DB`
- D1 database：`coc_activity_db`

## GitHub 上傳建議

請上傳完整 V29 檔案：

- assets
- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_V29.md
