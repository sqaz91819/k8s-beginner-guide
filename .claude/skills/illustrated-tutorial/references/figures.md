# Figure cookbook

Contents: 1. Figure wrapper and numbering · 2. Mermaid (theming, dark mode, per-type pitfalls) ·
3. Inline SVG conventions · 4. HTML box diagrams · 5. JS data charts (helper API) · 6. Matrices and tables as figures ·
7. Interactive widgets · 8. Visual review checklist

## 1. Figure wrapper and numbering

Every figure lives in `figure.fig`. CSS draws the blueprint grid, the "◆ 圖解" label and the automatic
"圖 N｜" prefix on the caption (CSS counter `fig`), so don't type numbers yourself. Always precede it with lead + look:

```html
<p class="lead">情境 → 需求 → 細節（2–4 句）。</p>
<p class="look"><b>看圖重點：</b>眼睛先看哪裡、看完得到什麼結論。</p>
<figure class="fig">
  … one of the bodies below …
  <figcaption>一句話的結論，而不是標題</figcaption>
</figure>
```

Two related figures can sit side by side by wrapping two `figure.fig` (each with `style="margin:0"`) in a `div.grid2`. One
lead + look goes before the grid and covers both. Inside a single figure, use `.grid2/.grid3` of `.panel` for before/after comparisons.

## 2. Mermaid

Loaded from `cdn.jsdelivr.net/npm/mermaid@10.9.1`. Write the source inside `<pre class="mermaid">` (no indentation of the
first line needed). The runtime stores each source, renders with theme-specific `themeVariables`, and re-renders on theme toggle.

### Colors in Mermaid sources
Highlight nodes only with these pastel fills (light theme). In dark mode, the runtime's `darkMap` swaps them to dark fill + light text:

| Meaning | `fill` | `stroke` | `color` (light-mode text) |
|---|---|---|---|
| blue / main | `#e8f0fe` (or `#dbeafe`) | `#326ce5` | `#1d4fb8` |
| green / ok, new | `#e3f6ea` (or `#d1fae5`) | `#12a150` | `#0b5d2e` |
| red / failure, risk | `#fde8e8` | `#d63939` | `#8a1f1f` |
| orange / warning | `#fff1e6` | `#e8590c` | `#7a2e00` |
| purple / control plane, special | `#efeafd` (or `#ede9fe`) | `#7048e8` | `#4c2fb0` |

Write `fill:` and `color:` on the **same** `style` line (the dark-mode regex matches `fill:#xxxxxx … color:#xxxxxx`).
Any other fill color will not be remapped and may glare or hide text in dark mode; if you need one, add it to `darkMap`.

```
style C fill:#fde8e8,stroke:#d63939,color:#8a1f1f
```

### Per-type notes
- **flowchart**: `LR` for pipelines, `TD` for hierarchies. Use `subgraph X["標題"]` + `direction TB` for grouped zones. Dotted edges `-. 文字 .->` for "optional/failure path", thick `==>` for "main path". Quote every label containing CJK, spaces or punctuation: `A["Load Balancer<br/>分流"]`.
- **sequenceDiagram**: name participants with aliases (`participant API as API Server`). Keep ≤ 6 participants and ≤ 10 messages; split otherwise.
- **stateDiagram-v2**: declare readable state names with `state "Pending 等待排程" as P`. Dark-mode text colors are already handled in the template; don't remove those themeVariables.
- **quadrantChart**: quote *every* CJK string (`x-axis "低成本" --> "高成本"`, `quadrant-1 "…"`, `"Canary": [0.8, 0.7]`). Spread points so labels don't collide; check the screenshot.
- **gantt**: short title; for minute-scale data use `dateFormat HH:mm`, `axisFormat 第 %M 分`, `tickInterval 1minute`, tasks like `v1-A 服務中 :done, a1, 00:00, 1m`.
- **pie**: fine for 2–5 slices; label slices with percentages in the text.
- **timeline**: avoid (text too small). Use the custom JS timeline instead.
- Never put `{{ … }}` or unescaped `<…>` in labels; write placeholders as plain words.

## 3. Inline SVG conventions

Use inline SVG for anatomy diagrams and metaphors (cluster anatomy, houses vs apartment). Rules that keep it readable in both themes:
- Text: `fill="currentColor"` (inherits `--ink`) or `style="fill:var(--ink)"`; secondary text `opacity=".7"` or `var(--muted)`.
- Shapes: semi-transparent tinted fills with a solid stroke, e.g. `fill="#12a150" fill-opacity=".1" stroke="#12a150"`, or CSS vars (`fill:var(--green-soft);stroke:var(--green)`). Avoid opaque light fills (white/pastel) behind `currentColor` text: in dark mode that's light text on light fill.
- Solid saturated fills (`#12a150`) take white text (`fill="#fff"`).
- Always set `viewBox`, `role="img"` and `aria-label`; never fixed width/height (CSS scales it). Keep the viewBox ≤ ~760 wide.
- Arrowheads: define a `<marker>` with a unique id per figure (`id="a3"`), using `fill="currentColor"`.

## 4. HTML box diagrams

For simple chains and stacks, HTML is faster than SVG and wraps on mobile:
- `.flow` (row, wraps) / `.flow.col` (column) containing `.box` + `.arr` (→ ↓).
- `.box` color variants: default blue, `.g` green, `.o` orange, `.r` red, `.p` purple, `.y` yellow, `.gray` muted, `.dash` dashed border. `<small>` inside a box is a subtitle line.
- `.stack` of `.layer` (`.hw`, `.os`, `.hv`, `.app`, `.rt`) for layer cakes (hardware → OS → runtime → app).
- `.zone` with `.zl` label: a dashed boundary (Pod, Node, AZ, VPC, Region).
- `.pod` circles (`.v2`, `.dead`, `.new`) for replicas; animate them in widgets.

## 5. JS data charts

For anything quantitative, write a chart function. Charts are colored with CSS variables, so they switch theme without re-rendering.
Add a function to the `charts` object in the runtime script and place `<div class="chart" data-chart="name"></div>` inside a figure.
`references/chart-examples.js` has 13 tested examples: metaphor picture (`apartment`), 3D layer cache (`layers`), concentric rings
(`svcrings`), CPU throttling area (`cpu`), OOM sawtooth (`mem`), dual-axis scaling (`hpa`), step area with rollback (`canary`),
radar (`radar`), pictogram/waffle (`waffle`), bar amplification (`retry`), incident timeline with brackets (`drline`), histogram with
percentile markers (`latency`).

Helper API (defined above `charts`):

| Helper | Signature | Notes |
|---|---|---|
| `V(n)` | `V('accent')` → `var(--accent)` | Colors: `ink muted line card card2 accent accent-soft green orange red purple yellow` (+ `-soft`) |
| `S(w,h,body)` | wraps body in a responsive `<svg viewBox>` | max-width = w |
| `T(x,y,text,o)` | text | `o.a` anchor (`middle` default, `start`, `end`), `o.fs` size, `o.b` bold, `o.c` color |
| `L(x1,y1,x2,y2,color,o)` | line | `o.w` width, `o.d` dasharray |
| `R(x,y,w,h,fill,o)` | rect | `o.rx`, `o.s` stroke, `o.sw`, `o.op` fill-opacity |
| `P(d,o)` | path | `o.f` fill, `o.s` stroke, `o.w`, `o.op`, `o.d` |
| `C(x,y,r,fill,o)` | circle | `o.s`, `o.sw`, `o.op` |
| `frame(W,H,o)` | axes + grid | `o.xmax o.ymax o.yticks o.xticks o.xlab o.ylab o.yfmt o.right` → `{X,Y,b,x0,x1,y0,y1}` (`b` is the axis markup) |
| `poly(pts,X,Y)` | `[[t,v],…]` → path `d` | |
| `interp(pts,t)` | linear interpolation | for sampling smooth curves |
| `legend(x,y,items)` | `[{c,t,op,dash}]` | put it in the top margin, not over data |

Chart rules: label axes with units; mark thresholds (limits, SLOs) with dashed colored lines and an end-anchored label;
annotate the one thing the reader should notice (`⏳ Throttling`, `💥 OOMKilled`, `⛔ rollback`); compute any number shown in the
caption from the same data (e.g. percentiles) so text and picture agree; say in the lead whether values are illustrative.

## 6. Matrices and tables as figures

- Coverage/threat matrix: `table.matrix` with `td.y` (green ✔) on covering cells and ✖ elsewhere. Wrap in `div.tblw` with `style="margin:0"` inside the figure. A diagonal pattern instantly shows "no mechanism replaces another".
- Mapping table ("what you want to stop → which mechanism"): a regular table inside a figure with emoji row markers.
- Reference tables (commands, status → cause → first action) stay outside figures in `div.tblw`.

## 7. Interactive widgets

Use when the lesson has a parameter whose effect is easier to *feel* than read: replica count, traffic weight, HPA target,
AZ failure capacity, Gateway count vs resources, troubleshooting decision buttons, a progress checklist.

```html
<div class="widget" id="w-x">
  <div class="wt">🎚️ 互動：標題（寫出假設，例如「假設每秒 1,200 個請求」）</div>
  <label>參數：<b id="x-v">3</b></label><input type="range" id="x-r" min="1" max="6" value="3">
  <div class="meter"><div id="x-a" style="background:var(--green)"></div><div id="x-b" style="background:var(--purple)"></div></div>
  <div class="kpis"><div class="kpi"><div class="v" id="x-out">400</div><div class="l">結果說明</div></div></div>
  <div id="x-note" style="font-size:14px;color:var(--muted)"></div>
</div>
```

Script (one guarded IIFE per widget, placed before the glossary search code):

```js
(function(){
  const r=$('#x-r'); if(!r) return;
  function up(){ /* read r.value, update KPIs, meter widths, explanation text */ }
  r.oninput=up; up();
})();
```

A widget can embed a live code block (`<pre class="code" data-lang="yaml"><code id="x-y"></code></pre>`); after changing its text call
`window.__hl(codeEl)` to re-highlight and refresh the line gutter. Persist per-reader state (checklists) with the `store` helper.
Always write a short explanation line that updates with the value ("需要擴展 📈 / 可以縮容 📉").

## 8. Visual review checklist

After building, screenshot each new figure in dark and light mode and check:
labels overlapping each other or edges · text clipped at the right side · legend covering data · Mermaid nodes with
dark text on dark fill · state/transition labels visible · caption numbers equal to chart values · figure readable at 375px (scrolls inside its frame, page does not).
