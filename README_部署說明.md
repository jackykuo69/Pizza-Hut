# COC 商圈活動設計引導工具｜V23

## 本版重點

1. 本版以 V22 為基礎。
2. 修正方案評估表的核心 bug：
   - 已勾選五項分數後，總分不再停留在「尚未完成」。
   - 總分欄只會顯示數字或「尚未完成」。
   - 不會再因分數讀取錯誤而無法整理 Action Design。
3. 方案當選邏輯：
   - 先比較總分。
   - 若總分相同，依序比較：效益 → 可行性 → 成本 → 風險性 → 測試性。
   - 若所有分數完全相同，才由使用者人工選定一個方案。
4. 保留 V22 功能：
   - 候選行動依 COC 情境篩選，不固定湊滿 5 個。
   - 明顯不適配的活動會被排除。
   - 使用者選定的所有候選行動都會進入方案評估。
   - 至少選 2 個候選行動。
   - 按「確認候選行動，進入方案評估」後才顯示評估表。
   - 最終只產出一個當選方案。
   - COC 商圈活動脈絡策劃表與 Action Design 表。
   - 後台只保存完成第四階段後的有效資料。

## GitHub 需要上傳的檔案

請將以下檔案／資料夾上傳到 GitHub 根目錄：

- assets
- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_V23.md

## Cloudflare 設定提醒

D1 binding 必須維持：

- Variable name：DB
- D1 database：coc_activity_db
