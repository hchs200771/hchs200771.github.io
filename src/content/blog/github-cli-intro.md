---
title: 什麼是 GitHub CLI？Vibe Coding 必備的命令列工具
description: 認識 gh 指令：不用開瀏覽器就能開 PR、管 issue、看 CI，讓你和 AI 協作寫程式時效率翻倍。
pubDate: 2026-07-19
tags: [GitHub, 工具， Vibe Coding]
---

如果你正在用 AI 寫程式（也就是俗稱的 Vibe Coding），GitHub CLI 是你一定要認識的工具。它讓你——還有你的 AI 助手——不用離開終端機就能完成 GitHub 上的大部分操作。

## GitHub CLI 是什麼？

GitHub CLI（指令是 `gh`）是 GitHub 官方出的命令列工具。以前你要開 Pull Request、看 issue、查 CI 狀態，都得打開瀏覽器點來點去；有了 `gh`，這些事情一行指令就能完成。

## 安裝

macOS 用 Homebrew：

```bash
brew install gh
```

裝好之後先登入：

```bash
gh auth login
```

跟著提示走，選 GitHub.com、用瀏覽器授權，一分鐘搞定。

## 最常用的幾個指令

### 建立 Repo

```bash
gh repo create my-project --public --source=. --push
```

一行就把本地專案推上 GitHub，不用去網頁上點「New repository」。

### 開 Pull Request

```bash
gh pr create --title "新增登入功能" --body "實作 email 登入流程"
```

### 看 CI 跑得怎麼樣

```bash
gh run watch
```

即時看著 GitHub Actions 跑，失敗了直接看 log：

```bash
gh run view --log-failed
```

### 管理 Issue

```bash
gh issue list
gh issue create --title "修正手機版排版" --body "在 iPhone 上按鈕跑版"
```

## 為什麼 Vibe Coding 特別需要它？

當你用 Claude Code 這類 AI 工具開發時，AI 是在終端機裡工作的。如果操作 GitHub 要靠你手動開瀏覽器，整個流程就斷掉了。有了 `gh`，AI 可以直接：

1. 幫你開好分支、發 PR、寫好 PR 描述
2. 盯著 CI 跑完，失敗了自己讀 log 修好
3. 從 issue 讀需求，做完自動關聯

換句話說，`gh` 就是 AI 和 GitHub 之間的橋樑。裝好它，你的 AI 助手才能真正「一條龍」把事情做完。

## 小結

GitHub CLI 學習成本很低，但對開發流程的加速非常有感。先把 `gh auth login` 做完，接著在日常開發裡刻意用 `gh pr create` 和 `gh run watch` 取代開瀏覽器，一兩週後你就回不去了。

有問題歡迎透過[聯絡頁](/contact/)找我聊。
