# Idle Lineage Class Wiki

這是一個專為開源網頁遊戲 **Idle Lineage Class** 打造的圖鑑與資料查詢網站。

## 🌟 功能特色 (Features)

*   **職業與任務 (Classes)**: 瀏覽各職業的詳細能力與相關資訊。
*   **魔法圖鑑 (Magics)**: 查詢各職業可學習的魔法與技能效果，支援名稱搜尋與職業過濾。
*   **道具裝備 (Items)**: 瀏覽遊戲內的武器、防具、飾品與雜項道具，並支援套裝組合篩選。
*   **怪物地圖 (Monsters)**: 查詢各個地圖的出沒怪物資訊。
*   **製作菜單 (Crafting)**: 查詢裝備、道具合成材料與 NPC 資訊，支援名稱與城鎮篩選。
*   **寵物圖鑑 (Pets)**: 查詢寵物的屬性與技能。
*   **掉落雙向查詢 (Drop Search)**: 強大的雙向查詢系統，可輸入「怪物名稱」查詢會掉落什麼道具，或輸入「道具名稱」查詢哪些怪物會掉落，並支援機率排序。

## 🛠️ 技術棧 (Tech Stack)

*   **核心**: HTML5 / JavaScript (Vanilla)
*   **樣式**: [Tailwind CSS](https://tailwindcss.com/)
*   **圖示與字型**: [FontAwesome](https://fontawesome.com/), Google Fonts (Inter, Noto Sans TC)

## 🚀 如何運行 (How to Run)

本專案為純靜態網頁，無需複雜的編譯或後端環境。

1. 將本專案 Clone 到本地：
   ```bash
   git clone https://github.com/Owen-Peng1206/idle-lineage-class-wiki.git
   ```
2. 進入專案目錄。
3. 直接使用瀏覽器開啟 `index.html` 即可瀏覽。

## 📂 專案結構 (Project Structure)

*   `index.html`: 網站主進入點與 UI 介面。
*   `README.md`: 網站說明文檔。
*   `js/`: 存放 Wiki 專屬的應用邏輯。
    *   `wiki-app.js`: 共用邏輯與主程式。
    *   `wiki-classes.js`, `wiki-magics.js`, `wiki-maps.js`, `wiki-craft.js`, `wiki-pets.js`, `wiki-collections.js`: 各模組的處理邏輯。
*   `idle-lineage-class/`: 存放遊戲原始資料 (作為資料庫來源)。
    *   `js/00-data.js`, `js/01-drops-config.js`: 遊戲的核心資料庫。
    *   `js/12-npc-quests.js`, `js/13-shop-save.js`, `js/14-craft-pandora.js`: NPC 與製作系統相關資料。
## ⚖️聲明
* 遊戲創意及美術設計歸屬於原作者 秋玥(https://github.com/shines871)。
* 本專案為學習用途，僅供參考，不提供任何商業用途。
* 不保證所有資料正確性。

## 📝參考資料
* [Idle Lineage class](https://github.com/shines871/idle-lineage-class)