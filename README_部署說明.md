# COC 商圈活動設計引導工具｜V15

## 本版重點

1. 後台只保存「完成第四階段」的有效資料。
2. Step 0、Step 1、Step 2、Step 3 與候選行動產出過程，都不會寫入後台。
3. 使用者按下「整理成 Action Design」並產出最終結果後，才會正式送出後台。
4. 這樣可以避免後台出現大量 Step 0／尚未完成的草稿紀錄。
5. 舊版已產生的尚未完成資料不會自動消失，可在後台用「刪除」按鈕清掉。
6. 保留 V14 功能：
   - Q3 顧客單選
   - Q3 顧客說明依 R1／COM／Sub 動態切換
   - Q2／Q3／Q4／Step 3 的其他欄位
   - 候選行動編號直接點選
   - COC 商圈活動脈絡策劃表
   - Action Design 表
   - PDF 匯出／列印
   - Pizza Hut logo
   - 後台查看／刪除／下載 CSV
   - D1 資料庫架構

## GitHub 需要上傳的檔案

請將以下檔案／資料夾上傳到 GitHub 根目錄：

- assets
- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_V15.md

## Cloudflare 設定提醒

D1 binding 必須維持：

- Variable name：DB
- D1 database：coc_activity_db
