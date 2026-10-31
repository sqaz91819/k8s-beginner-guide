# Writing guide

Contents: 1. Who you are writing for · 2. Language conventions · 3. The lead-in formula (most important) ·
4. Introducing terms · 5. YAML / config guides · 6. Commands and expected output · 7. Analogies and callouts ·
8. Recaps and self-checks · 9. Text-to-figure balance

## 1. Who you are writing for

An entry-level engineer: has written some Python/Go, maybe used AWS Lambda, but doesn't know how VM, Container,
Docker and Kubernetes relate. They read carefully, but they get lost as soon as two unexplained words show up in one sentence.
They want to know **what is happening, why it is needed, and what to watch out for**. A picture without that context
leaves them thinking "I understand the picture, but not where it fits".

Write so that someone reading top to bottom never needs a term that hasn't been introduced yet. When advanced material depends
on earlier lessons, say which lesson ("第 6 堂的 Probe") so the reader can go back to it.

## 2. Language conventions

- Output language follows the user. The existing tutorial uses **Traditional Chinese (Taiwan usage)**: 程式, 伺服器, 設定, 網路, 預設, 資料庫, 執行 (not 程序/服務器/配置/網絡/默認/數據庫/運行).
- Full-width punctuation in Chinese text (，。：；「」（）), half-width inside code. Use 「」 for quoting a phrase or a mental model.
- Keep official English names for technical objects (Pod, Deployment, HTTPRoute, Readiness Probe), followed by a Chinese gloss on first use: `Readiness Probe（就緒檢查）`.
- Put a space between CJK and Latin words or numbers only where the existing text does (mostly around code and English terms: `把 Pod 刪掉`).
- Use `<b>` for the one phrase per paragraph the reader must not miss. Don't bold whole sentences.

## 3. The lead-in formula

Every figure gets `p.lead` + `p.look`. This is what turned "complete but disconnected" figures into a narrative the user accepted.

**`p.lead`: 2–4 full sentences, roughly in this order:**
1. **Bridge or situation:** where we are in the story, or what the previous figure left unanswered ("知道怎麼分流之後，下一個問題是：權重要怎麼調？").
2. **Need:** why this matters and what goes wrong without it ("如果一下子從 5% 跳到 100%，就和藍綠部署沒有差別了").
3. **Details and constraints:** the one or two facts needed to read the figure correctly (time windows, assumptions, which numbers are illustrative, what is out of scope).

**`p.look`: one or two sentences starting with `<b>看圖重點：</b>`:**
where to look first (color, arrow, dashed line, a column) and what conclusion to take away.

Bad (heading + figure, no context):
> `<h4>Canary 階段</h4>` → figure

Good:
> `p.lead` 知道怎麼分流之後，下一個問題是：權重要怎麼調？如果一下子從 5% 跳到 100%，就和藍綠部署沒有差別了。Canary 的做法是把放量切成幾個階段，每個階段停留一段時間，確認新版的錯誤率、延遲等指標都正常，才進入下一個階段。只要任何一個階段發現異常，就停止並把流量退回舊版。
> `p.look` **看圖重點：** 上排是正常推進的四個階段；虛線代表「指標異常」時的退出路徑，可以發生在任何一個階段。越早發現問題，受影響的使用者越少。

When two figures show the same idea in a row, the second lead must explain *why another view is needed*:
> 上一張流程圖說明了「有哪些階段」，這張圖把同樣的過程放到時間軸上，讓你看到新版在每個時間點承擔多少流量……

Other patterns that worked well:
- Static then dynamic: "上一張圖是靜態的「有哪些元件」，這張圖則是動態的「它們怎麼合作」。了解這個順序對除錯很有幫助：……"
- Clear up a misconception first: "新手最常混淆的，是把 Deployment 當成一台機器……其實它們分屬兩種不同的關係。"
- Tie to a practical decision or debugging step: "如果 Pod 一直是 Pending，代表卡在 Scheduler……"

**Caption (`figcaption`)** = the conclusion in one sentence, which may restate the look-hint more briefly. It's what a skimming reader takes away.

## 4. Introducing terms

- First appearance of an important term → a term card right where it's needed:
  `<div class="defs"><div class="def"><b>Pod</b>Kubernetes 能建立與管理的<b>最小部署單位</b>。……</div></div>`
  Define it in 1–3 sentences: what it is, then what it's for, then (optionally) a familiar comparison ("AWS EC2 本質上就是雲端的 VM").
- Minor or repeated terms → inline hover tip: `<span class="term" tabindex="0" data-tip="簡短解釋">名詞</span>`.
- Abbreviations: expand once (`HPA（Horizontal Pod Autoscaler，水平自動擴展）`).
- Every term also goes into the glossary appendix with the lesson it first appears in (`<i>第 N 堂</i>`).
- Don't introduce a term you won't use again in this lesson. Mention it later, when it's needed.
- Term cards stack vertically at full width (`.defs` is a flex column). Never lay them out in a grid.

## 5. YAML / config guides

Directly after every config block (outside widgets), add a `div.yg`:

```html
<div class="yg"><div class="yg-h">📖 逐欄位說明：deployment.yaml</div><dl>
  <dt>apiVersion: apps/v1</dt><dd>……</dd>
  <dt>spec</dt><dd>……</dd>
  <dt class="i1">selector.matchLabels</dt><dd>……<b>必須和下方 template 的 labels 完全一致</b>……</dd>
  <dt class="i2">spec.containers</dt><dd>……</dd>
  <dd class="yg-note">💡 記憶法：外層 spec 管「幾份、管誰、照什麼樣板」；template.spec 管「每個 Pod 裡跑什麼」。</dd>
</dl></div>
```

- One `<dt>` per meaningful field, in file order; nest with `i1`–`i4` to mirror YAML indentation. Collapse trivial paths into dotted names (`ports.containerPort`).
- Each `<dd>` answers: what it is, **why it exists**, common values (`IfNotPresent`／`Always`／`Never`), and what breaks if it's wrong or mismatched.
- Explain list syntax the first time (`每個 - 代表一個容器`), and quoting rules (env values are strings).
- Point to the lesson where a field becomes important ("真正讓別人連進來要靠 Service（第 4 堂）").
- Finish with a `yg-note` mnemonic or a "how to look it up yourself" tip (`kubectl explain deployment.spec --recursive`).
- Inline `# comments` in the YAML are still welcome for orientation; the guide is where the explanation lives.
- For nested structures, consider adding a small tree figure (Mermaid `flowchart LR`) showing the nesting, with its own lead.

## 6. Commands and expected output

- One command block per step, `data-lang="bash"` (or `powershell`). Use `<名稱>` for placeholders; the runtime colors them.
- Follow with expected output in `data-lang="text"` and `data-file="預期輸出"`, using `← 說明` annotations on the important lines.
- State what success looks like in prose, then the most common mistake with symptom → cause → fix in `.call.warn`.
- Safety: before any command that changes a cluster or cloud resource, remind readers to check the target (`kubectl config current-context`) and use a practice environment.

## 7. Analogies and callouts

- `🧩 .call.ana` analogies come from everyday life (便當盒 for Pod, 銀行叫號機 for load balancer, 房子 vs 公寓 for VM vs Container). Follow each analogy with the precise technical statement, and say where it stops working if that matters.
- `💡 tip`: shortcuts and good habits. `⚠️ warn`: misconceptions and incident risks. `📌 note`: background that can be skipped. `🎯 key`: the one sentence to remember. `λ lambda`: mapping to serverless concepts for readers who know Lambda.
- Don't stack more than two callouts in a row; prose should carry the explanation.

## 8. Recaps and self-checks

- `.recap` "🎒 第 N 堂重點回顧": 3–6 bullets, each a complete takeaway sentence with the key term in bold. Add a practical closing line if useful (how to pause the lab).
- 2–4 `details.q` self-checks per lesson. Ask *why* or *what happens if* ("為什麼刪掉的 Pod 回來後名字不一樣？"), not definitions. The answer starts with the conclusion, then one sentence of reasoning.

## 9. Text-to-figure balance

The user wants plenty of figures **and** enough text. A healthy section looks like:
scenario paragraph → term card(s) → lead → look → figure → explanation/table/callout → (next lead → look → figure …).
If a section is mostly figures with one-line connectors, add prose. If a section is a wall of text explaining a structure,
quantity or flow, add a figure. Use tables for enumerations (components, status → cause → action) instead of long bullet lists.
