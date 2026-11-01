# Component markup reference

Every class here is styled by the CSS in `assets/template.html` (identical to the accepted `K8S新手圖解教學.html`).
The template's sample lesson shows these components in context.

Contents: Page shell · Lesson shell · Text components · Figures · Code · Tables · Interactive · Endings · Navigation & appendix · Design tokens

## Page shell

`#progress` (reading progress bar) → `#tocBtn` (mobile) → `nav#toc` (fixed sidebar, 280px; collapses under 1100px) →
`main` (max 1180px) containing `header.hero`, `section.lesson#guide`, `.part-title`, lessons, appendices, `footer`.
Scripts at the end: Mermaid 10.9.1 (jsdelivr), highlight.js 11.9.0 + `dockerfile` + `powershell` (cdnjs), then the inline runtime.

## Lesson shell

```html
<section class="lesson" id="l17">
  <div class="lesson-head"><div class="badge adv">17</div><div><h2>標題</h2><div class="meta">約 45 分鐘・會做什麼</div></div></div>
  <div class="goals"><b>這堂課你會學到</b><ol><li>…</li></ol></div>
  <h3>1. 小節標題</h3>
  <h4>子標題</h4>
  …
</section>
```
`.badge` = basics (dark grey), `.badge.adv` = advanced and appendix (lighter grey); no inline background colors. Section ids: `l1`…`lN`, `guide`, `cheat`, `glossary`.

Part divider between groups of lessons:
```html
<div class="part-title" id="part2"><h2>第二部分｜進階架構篇</h2><p>目標：……</p></div>
```

## Text components

Term cards (vertical, full width; one term per card):
```html
<div class="defs">
  <div class="def"><b>VM（Virtual Machine，虛擬機）</b>在一台真正的電腦裡，用軟體「模擬」出另一台擁有獨立作業系統的電腦。AWS EC2 本質上就是雲端的 VM。</div>
</div>
```
Hover term: `<span class="term" tabindex="0" data-tip="簡短解釋">名詞</span>`

Callouts: `<div class="call tip|warn|note|ana|key|lambda"><b class="t">標題（可省略）</b>內容</div>`

Lead + look (before every figure):
```html
<p class="lead">情境 → 需求 → 細節（2–4 句）。</p>
<p class="look"><b>看圖重點：</b>……</p>
```

Prose panels outside figures (e.g. three fleet types): `.grid2/.grid3` of `.panel` directly inside `section.lesson` are forced
into one column by CSS, so they stack vertically. Use `<h5>` for the panel title.

## Figures

See `figures.md` for choosing and drawing. Bodies that go inside `figure.fig`:
- Mermaid: `<pre class="mermaid">flowchart LR …</pre>`
- Inline SVG: `<svg viewBox="0 0 760 360" role="img" aria-label="…">…</svg>`
- JS chart: `<div class="chart" data-chart="name"></div>`
- HTML diagram: `.flow` / `.flow.col` + `.box[.g|.o|.r|.p|.y|.gray|.dash]` + `.arr`; `.stack > .layer[.hw|.os|.hv|.app|.rt]`; `.zone > .zl`; `.row`; `.pod[.v2|.dead|.new]`
- Comparison inside one figure: `<div class="grid2"><div class="panel"><h5>A</h5>…</div><div class="panel"><h5>B</h5>…</div></div>`
- Matrix: `<div class="tblw" style="margin:0"><table class="matrix">… <td class="y">✔</td> …</table></div>`
- Two figures side by side: `<div class="grid2"><figure class="fig" style="margin:0">…</figure><figure class="fig" style="margin:0">…</figure></div>`

Always end with `<figcaption>結論句</figcaption>`. Numbering is automatic.

## Code

```html
<pre class="code" data-lang="yaml" data-file="deployment.yaml"><code>apiVersion: apps/v1
kind: Deployment</code></pre>
```
- `data-lang`: `yaml`, `bash`, `powershell`, `python`, `dockerfile`, `json`, `text` (output / plain), `promql`.
- `data-file`: tab label. If omitted, a first-line comment like `# app.py` is used, else a default per language (`終端機 — bash`, `config.yaml`, …).
- Escape `<`, `>`, `&` inside code (`&lt;名稱&gt;`). Write no leading newline after `<code>`.
- Highlighting is automatic (highlight.js + custom decoration: commands, `--flags`, `<placeholders>`, output table headers, `# comments`, `← notes`). Manual spans `<span class="k">` (keyword), `<span class="c">` (comment), `<span class="s">` (string) are also styled, if you need to force them.
- The runtime wraps each block in the IDE frame (traffic-light dots, tab, language tag, copy button, line gutter).
- YAML guide directly after: `<div class="yg">…</div>` (see `writing.md` §5); the runtime joins the two visually (`.has-guide`).
- Inline code in prose: `<code>kubectl get pods</code>`.

## Tables

```html
<div class="tblw"><table><tr><th>狀態</th><th>常見原因</th><th>先做什麼</th></tr>
<tr><td><code>Pending</code></td><td>…</td><td>…</td></tr></table></div>
```
Wrap every table in `.tblw` (horizontal scroll on mobile).

## Interactive

`.widget#w-name` with `.wt` title, buttons (`.on` = selected), `input[type=range]`, `.meter > div` (proportional bar),
`.kpis > .kpi > .v + .l`, `.chk label` (checklist). Script pattern in `figures.md` §7.

## Endings

```html
<div class="recap"><h4>🎒 第 N 堂重點回顧</h4><ul><li>…</li></ul></div>
<details class="q"><summary>自我檢查：問題？</summary>答案。</details>
```

## Navigation & appendix

- TOC entry: `<a href="#l17"><span class="n">17</span>短標題</a>` under the right `<h4>` group in `nav#toc`. Active state and scroll progress are automatic.
- Hero chips (`.hero .chips span`): update counts (lessons, figures) when adding chapters.
- Glossary entry: `<div class="def"><b>名詞（中文）</b>一句話解釋。<i>第 N 堂</i></div>` inside the matching `<h3 class="gh">` + `<div class="defs g">` group in `#glossary`. Search is automatic.
- Cheat sheet appendix (`#cheat`): tables of commands and symptom → cause → action.

## Design tokens

Defined on `:root` (dark, default) and `:root[data-theme="light"]`. Use the variables, never raw colors, in HTML/CSS/JS charts:
`--bg --card --card2 --ink --muted --line --accent --accent-soft --accent-ink --green(-soft) --orange(-soft) --red(-soft)
--purple(-soft) --yellow(-soft) --fig-bg --fig-grid --fig-line --fig-cap --shadow`.

Zone styles at a glance:
- Text: `section.lesson` charcoal card (`--card`), term cards `--card2` with a blue left border.
- Figures: `--fig-bg` navy canvas + 24px blueprint grid, 3px accent top border, "◆ 圖解" label, caption bar `--fig-cap`.
- Code: always dark `#1e1e1e` editor in both themes (VS Code Dark+ palette).
- Widgets: dashed purple frame labeled "▶ 互動練習".
Fonts: body `"Noto Sans TC","Microsoft JhengHei"` 16px / 1.85; code `"Cascadia Code","JetBrains Mono",Consolas` 13.5px / 1.7.
