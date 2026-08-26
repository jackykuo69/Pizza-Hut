# COC 商圈活動設計引導工具｜V27

## 本版重點

1. Step 1｜Q1 顧客選項加入定義，並移除上方長版定義。
2. Q1 上方只保留：
   - 請單選本次活動最想優先服務的一類顧客。請聚焦一類主要顧客，不要一次服務所有顧客。
3. Step 1｜Q4 改為顧客視角：
   - 可以預購、外帶或外送，不一定要現場等待。
   - 在原本活動場域就能接觸或購買，不必特地繞路。
4. Step 4｜候選行動表移除「建議判斷」欄位。
5. Step 4｜方案評估表五個評量指標欄位等寬：
   - 效益
   - 可行性
   - 成本
   - 風險性
   - 測試性
6. 方案評估表分數讀取修正：
   - 直接依 radio group name 讀取畫面已勾選分數。
   - 按「整理成 Action Design」前會重新計算。
   - 若仍未完成，會列出尚未完成的候選方案。
7. 保留後台只保存完成第四階段後有效資料的規則。

## GitHub 需要上傳的檔案

請將以下檔案／資料夾上傳到 GitHub 根目錄：

- assets
- functions
- _headers
- admin.html
- index.html
- schema.sql
- README_部署說明.md
- CHANGELOG_V27.md

## Cloudflare 設定提醒

D1 binding 必須維持：

- Variable name：DB
- D1 database：coc_activity_db
