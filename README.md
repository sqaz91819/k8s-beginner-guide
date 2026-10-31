# Kubernetes 新手圖解教學

從 VM、Container、Docker 一路到大型 AWS EKS 架構的 Kubernetes 入門課程，給沒有 K8s 經驗的工程師。全書共 17 堂課，搭配 200 多張圖解、IDE 風格的程式碼範例、逐欄位 YAML 說明與互動小工具。

## 怎麼閱讀

**線上閱讀：https://sqaz91819.github.io/k8s-beginner-guide/**

也可以下載 [`K8S新手圖解教學.html`](K8S新手圖解教學.html)，用瀏覽器開啟。這是單一 HTML 檔，不需要安裝任何東西；圖表元件（Mermaid、highlight.js）從 CDN 載入，所以閱讀時需要網路連線。

- 預設深色主題，左側目錄最下方可切換成淺色。
- 虛線底線的名詞可以用滑鼠移上去看解釋，附錄 B 是可搜尋的名詞辭典。

## 課程內容

| 篇章 | 課程 |
|---|---|
| 基礎篇 | 01 為什麼需要 Container・02 Docker 實戰・03 Pod／Node／Deployment・04 Service／Ingress・05 設定、Secret 與儲存・06 資源、健康檢查與自動擴展・07 發布、回滾、Helm 與 CI/CD |
| 進階架構篇 | 08 大型 EKS 系統全貌・09 Envoy Gateway／Gateway API・10 Gateway 架構選型・11 藍綠部署、Canary 與 Argo Rollouts・12 多租戶與安全隔離・13 Service Mesh・14 Multi-AZ 高可用・15 Multi-Region 與災難復原・16 Observability 與故障診斷 |
| 延伸篇 | 17 Job 與 CronJob |
| 附錄 | A 指令與故障速查表・B 名詞辭典 |

## 撰寫新章節用的 Skill

[`.claude/skills/illustrated-tutorial/`](.claude/skills/illustrated-tutorial/SKILL.md) 是給 Claude Code 使用的 Skill，記錄了這份教學的設計風格與撰寫規則：面向新手、圖解類型多樣、每張圖前都有導讀、YAML 逐欄位說明、深淺主題都清楚可讀。內含 HTML 模板、元件與圖表參考，以及建置與檢查腳本。在這個資料夾用 Claude Code 要求「用同樣風格新增一堂課」時就會自動套用。

## 說明

內容依個人 Kubernetes 學習筆記整理改寫，範例中的帳號、網域、IP 與數字皆為教學示意值。
