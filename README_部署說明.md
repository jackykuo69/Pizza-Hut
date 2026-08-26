# COC 商圈活動設計引導工具｜V12

## 本版重點

1. Q2、Q3、Q4、Step 3 條件與限制、Step 3 相對價值或處理方向，都新增「其他」選項。
2. 勾選「其他」後，必須補充具體文字，否則不能產出下一步。
3. 第四階段候選行動不再手動輸入編號，改為直接點選編號按鈕。
4. 候選行動只能選擇實際存在的編號，避免輸入不存在的編號。
5. 第四階段最終輸出可匯出／列印 PDF。
6. 每次開啟頁面會建立新的資料 ID，避免同一台裝置多次測試時覆蓋舊資料。
7. 保留 V11：
   - Pizza Hut logo
   - COC 商圈活動脈絡策劃表
   - Action Design 下一步行動表
   - 後台查看與刪除功能
   - D1 後台資料庫功能

## GitHub 需要上傳的檔案

請將以下檔案／資料夾上傳到 GitHub 根目錄：

- assets
- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_V12.md

## Cloudflare 設定提醒

D1 binding 必須維持：

- Variable name：DB
- D1 database：coc_activity_db
