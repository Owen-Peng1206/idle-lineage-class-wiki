---
name: update-wiki
description: 依據 submodule `idle-lineage-class` 的更新內容，自動更新 wiki 內的各頁面以跟上遊戲主程式進度。當使用者輸入「更新wiki」或類似關鍵字時觸發。
---

# Update Wiki (自動跟進遊戲主程式)

這個技能的作用是協助 wiki 同步更新至 `idle-lineage-class` (遊戲主程式) 的最新版本。

## 執行步驟

當觸發此技能時，請依照下列步驟依序執行：

1. **確認前一次更新的 Git 序列號碼 (Old Commit)**:
   請先讀取 `CHANGELOG.md` 中紀錄的前一次 Git 序列號碼（commit hash）。若找不到，則在主專案下執行以下指令找出目前的 submodule commit hash：
   ```bash
   git ls-tree HEAD idle-lineage-class
   ```
   (記下這個 commit hash，這是比對用的起點版本)

2. **拉取遊戲主程式最新版本**:
   進入 submodule 目錄，或使用以下指令將 submodule 更新到最新版：
   ```bash
   git submodule update --remote idle-lineage-class
   ```
   這會讓 submodule 更新到遠端最新的 commit。

3. **確認最新版本 (New Commit)**:
   再次查看 submodule 目前的 commit hash，或是直接進入 `idle-lineage-class` 目錄內使用 `git rev-parse HEAD` 取得最新版本 hash。

4. **比較並分析差異 (Diff 分析)**:
   使用 `git diff` 或 `git log` 比較兩者的差異，例如：
   ```bash
   git -C idle-lineage-class diff <Old Commit> <New Commit>
   ```
   或查看更新了哪些檔案：
   ```bash
   git -C idle-lineage-class diff --name-status <Old Commit> <New Commit>
   ```
   仔細閱讀修改的原始碼內容 (例如 js/ 內的邏輯、參數、新職業或裝備等調整)。

5. **更新 Wiki 頁面內容**:
   - 根據剛剛找到的程式碼差異，找出 wiki 中相對應需要更新的頁面（例如 `index.html`、`item_attributes_list.md` 等介紹頁面或 markdown 文件）。
   - 修改並更新這些 wiki 文件，確保數值、公式或系統行為的描述與最新版的程式碼一致。

6. **紀錄更新日誌 (Changelog)**:
   - 在專案根目錄下找到 `CHANGELOG.md` 檔案。
   - 將本次更新的最新遊戲版本號（從 `idle-lineage-class/js/00-data.js` 的 `GAME_VERSION` 擷取）、本次更新的 **Git 序列號碼 (New Commit)**、日期，以及這次 Wiki 主要跟進的重點內容以繁體中文條列出來，寫入 `CHANGELOG.md` 的最上方。這樣下次更新時，`git diff` 就能明確依據這個紀錄的序列號碼(commit hash)進行比對。

7. **總結與提交 (Commit)**:
   將修改後的 wiki 檔案、`CHANGELOG.md` 以及 submodule 的新 commit 加到暫存區 (`git add`)。
   以清楚的訊息進行 commit，例如：
   `Update wiki based on game updates from <Old Commit> to <New Commit>`
   
8. **回報使用者**:
   將剛剛更新了哪些部分、新增了哪些內容總結後，回報給使用者。
