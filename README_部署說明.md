# COCA 商圈活動設計框架｜V30

## 上傳檔案
請將以下檔案與資料夾上傳至 GitHub repo 根目錄：

- assets
- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_V33.md

## Cloudflare 設定
D1 binding 維持：

- Variable name：DB
- D1 database：coc_activity_db

若要啟用 AI 即時生成候選方案，請在 Cloudflare Pages 環境變數設定：

- OPENAI_API_KEY
- OPENAI_MODEL，未填時預設 gpt-5-mini

若未設定 OPENAI_API_KEY，網站仍可使用規則式暫用方案，不會中斷課堂流程。

## 通關碼
- Step 1：看見顧客
- Step 2：盤點我們
- Step 3：看懂限制
- Step 4：設計行動

前台不會明示通關碼。


## V33 API 設定補充
Step 4 候選方案使用 `/api/generate-actions`。

Cloudflare Pages 環境變數：
- `OPENAI_API_KEY`：必填，未設定時不會產生 AI 候選方案。
- `OPENAI_MODEL`：可選，未填則使用程式預設值。
- `ALLOW_RULE_FALLBACK`：可選；若設為 `true`，API 失敗時會回傳臨時備援方案，但正式課堂建議不要開啟，以避免誤用罐頭方案。

部署後可開啟 `/api/action-health` 檢查 API Key 是否已設定。
