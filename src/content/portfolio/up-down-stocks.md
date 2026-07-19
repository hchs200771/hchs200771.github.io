---
title: 台股盤後自動分析報告
description: 收盤後自動抓資料、分析強弱族群，一封盤後報告寄到你信箱。
url: https://hchs200771.github.io/100-up-and-down-stocks/
repo: https://github.com/hchs200771/100-up-and-down-stocks
cover: /images/up-down-stocks.jpg
tags: [投資工具, AI 分析, 自動化]
order: 3
---

## 這個專案在解決什麼

認真做功課的投資人，每天收盤後都在重複同一套苦工：整理今天哪些股票強、哪些弱，強的是不是同一個族群、背後有沒有題材。這件事每天要花一小時以上，而且很容易漏看。

## 我的解法

把整套盤後功課變成一條指令：

- **自動抓資料**：收盤後抓當日市場行情與漲跌幅排行
- **AI 族群分析**：讓 AI 從漲跌名單裡歸納出當天的強勢與弱勢族群，並且記住歷史脈絡——今天的新族群、延續幾天的舊題材，分得清清楚楚
- **自動寄報告**：產出一份排版好的 HTML 盤後報告，自動寄到信箱，打開信箱就完成當天功課

搭配排程執行，每天收盤後報告自己送上門。

## 幕後技術

TypeScript 抓取市場資料；以 Claude Code Skill 驅動 AI 分析流程並平行化族群研究；Google Apps Script webhook 寄信。
