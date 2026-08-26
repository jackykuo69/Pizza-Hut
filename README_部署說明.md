# COC 商圈活動設計引導工具｜V28

## 本版重點

1. 本版以 V27 為基礎。
2. 本次主要修正講師後台，不修改前台填答頁面的操作邏輯。
3. 後台「查看」功能已修正，可相容新舊資料格式。
4. 後台查看內容會整理成完整 COC 與 Action Design，而不是只看摘要或原始 JSON。
5. 「下載 CSV」改為「下載完整 Excel」。
6. 下載檔為 Excel 可開啟的 .xls 多工作表檔案，包含：
   - 總覽
   - COC完整資料
   - 候選行動
   - 方案評估
   - 最終ActionDesign
7. 前台仍保留 V27 的修正：
   - Q1 顧客選項定義。
   - Q4 顧客視角。
   - 候選行動表移除建議判斷。
   - 方案評估表五構面等寬。
   - 分數讀取與 Action Design 整理流程。

## GitHub 需要上傳的檔案

若只想更新後台，理論上只需上傳：

- admin.html
- README_部署說明.md
- CHANGELOG_V28.md

但為了避免版本混淆，建議仍上傳完整 V28 檔案：

- assets
- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_V28.md

## Cloudflare 設定提醒

D1 binding 必須維持：

- Variable name：DB
- D1 database：coc_activity_db
