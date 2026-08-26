# COC 商圈活動設計引導工具｜B10

## 本版重點

1. 學員前台移除左側階段進度卡片。
2. 前台不顯示通關碼，也不把階段名稱寫成通關碼。
3. 通關碼仍維持原設定：
   - 看見顧客
   - 盤點我們
   - 看懂限制
   - 設計行動
4. 前台顯示完整階段概念：
   - Step 1｜C. 顧客的需求與痛點
   - Step 2｜O. 我們的資源與做法
   - Step 3｜C. 商圈條件與限制
   - Step 4｜A. 下一步行動設計
5. 後台 `/admin.html` 新增：
   - 查看：查看單筆詳細內容
   - 刪除：刪除測試或不必要資料
6. 保留 D1 後台資料庫架構與後台密碼保護。

## GitHub 需要上傳的檔案

請將以下檔案／資料夾上傳到 GitHub 根目錄：

- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_B10.md

## Cloudflare 設定提醒

D1 binding 必須維持：

- Variable name：DB
- D1 database：coc_activity_db
