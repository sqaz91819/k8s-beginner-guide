---
name: illustrated-tutorial
description: Create or extend entry-level, figure-heavy technical tutorials as a single self-contained HTML file in the established "K8S新手圖解教學" style — pitch-black default theme with three visually distinct zones (charcoal text cards, blueprint-grid figure canvases, VS Code-style code editors), many varied figure types (Mermaid, inline SVG, JS data charts, HTML box diagrams, matrices, interactive widgets), a narrative lead-in before every figure, field-by-field YAML/config guides, and plain-language explanations of every term on first use. Use this skill whenever the user wants to add a new lesson or chapter to the K8S tutorial, turn study notes / ChatGPT exports / Markdown into an HTML teaching page, write a 教學／圖解／新手 guide on any DevOps, cloud, networking or programming topic, or asks for learning material "in the same style as before" — even if they never say "skill", "HTML" or "tutorial".
---

# Illustrated Beginner Tutorial

This skill captures a tutorial format that the user reviewed over five rounds and accepted as "near-complete".
Each rule below exists because the user hit a specific problem with an earlier draft. The reasons are given
so you can apply the intent to new situations instead of copying patterns mechanically.

The finished product is **one self-contained `.html` file** (CDN scripts only) that a junior engineer can open,
read top to bottom, and come away *understanding* — not just having seen pictures.

## Non-negotiables (the user's acceptance criteria)

1. **Never modify the source material.** The user's notes are the source of truth. Read them, write the output
   to a new file, and check the source's `LastWriteTime` before and after (it must not change).
2. **Write for an entry-level engineer.** Assume they can program a little but know none of this topic's vocabulary.
   No sentence should need knowledge that hasn't been introduced yet. Short sentences, concrete scenarios, one idea per paragraph.
3. **Explain every term the first time it appears**, in place, in plain words. Use a term card (`.defs > .def`) for
   important terms, an inline hover tip (`span.term[data-tip]`) for minor ones, and add every term to the glossary appendix.
   Avoid piling several new terms into one sentence; introduce them one at a time.
4. **Use at least as many figures as the source, and more kinds of them.** The source had 76 Mermaid diagrams; the
   accepted output had ~194 figures. Flowcharts are fine but must not be the only kind: when a concept is about
   *quantity, time, proportion, comparison, layers or physical containment*, pick a figure type that shows that shape
   (see the figure selection table below and `references/figures.md`).
5. **Every figure gets context before it.** This was the user's biggest complaint: "I understood the figure but didn't
   know what was going on, what the need was, or which details matter." Before each figure, write a `p.lead` paragraph
   (2–4 full sentences: situation → need → details/constraints, plus a bridge from the previous figure) and then a
   `p.look` hint ("看圖重點：" telling the reader where to look and what conclusion to take away). A one-line heading followed directly by a figure is not acceptable.
6. **Every YAML/config block gets a field-by-field guide** (`div.yg` directly after the code block). Beginners do not
   know what `selector`, `template`, or `apiVersion` mean, and an inline comment alone is not enough. Explain each field:
   what it is, why it's there, which values are common, and what breaks if it's wrong.
7. **Code must look like an IDE**, not plain white text: VS Code Dark+ token colors, a title bar with a file tab,
   a line-number gutter and a copy button. The runtime script builds all of this from `<pre class="code" data-lang data-file>`.
8. **Three visually distinct zones on a dark-grey background.** Text sits on neutral grey cards (dark grey to grey, no
   blue tint: the user asked for this explicitly), figures on a blue blueprint-grid canvas labeled "◆ 圖解" and numbered
   "圖 N｜", code in a dark editor frame. The user said blocks that look alike cause fatigue, so never style figures like
   text cards. The text palette lives in `--card/--ink/--muted/--line/--accent*`; `figure.fig,.widget` re-map those same
   tokens to the blue `--f-*` set, so components inside a figure stay blue automatically. Never put blue (or purple)
   inline colors on text-area elements such as badges, headings or callouts.
9. **Text cards are stacked vertically at full width.** Never place term cards or prose panels side by side; narrow
   columns make text wrap every few words. Side-by-side layout is reserved for *figure comparisons* inside a figure
   (e.g. VM vs Container, before vs after).
10. **Both themes must be readable.** Default dark, with a light toggle. Every figure, including Mermaid
    `stateDiagram`, `gantt`, `quadrantChart` and custom SVG, must have legible text in both themes.

## Two ways to use this skill

**A. Add a chapter to the existing tutorial** (`K8S新手圖解教學.html` in the project root).
The HTML file is the source of truth; the original build parts were temporary. Insert a new
`<section class="lesson" id="lN">` before the appendix (`id="cheat"`), add its `<a href="#lN">` entry to `#toc`
under the right `<h4>` group, add new chart functions to the `charts` object, add widget IIFEs before
`/* ---------- glossary search */`, and append new terms to the glossary (`#glossary .defs.g`, with `<i>第 N 堂</i>`).
Keep numbering, badge style (`.badge` for basics, `.badge.adv` for advanced) and tone consistent with neighboring lessons.
Write the new lesson, chart functions, widget and glossary group as separate scratch files first, then insert them into a
**copy** (e.g. `K8S新手圖解教學_第17堂試寫.html`) at these unique anchors, checking each occurs exactly once:
the last lesson's TOC `<a>` line, `<div class="part-title"><h2>附錄</h2>`, the closing `}` of the last function before
`$$('.chart').forEach` (add a comma), `/* ---------- glossary search ---------- */`, and `<p id="gnone"`. Also bump the hero
chip `<span>N 堂課</span>`. Replace the main file only after the user approves the copy.

**B. Start a new tutorial.** Copy `assets/template.html`. It contains the complete, accepted CSS and runtime
(theme, Mermaid theming, chart helpers, IDE code blocks, TOC, progress bar, glossary search) plus one sample
lesson that demonstrates every component. Replace the `__TOPIC__`-style placeholders, delete the sample lesson
once you've followed its structure, and change the localStorage theme key if you need to.

## Workflow

1. **Inventory the source.** Read all of it. Count its diagrams, code/YAML blocks and distinct terms; this sets the
   minimum figure count and tells you how many YAML guides you need. For large sources, write condensed notes to the scratchpad first.
2. **Outline each lesson** with the chapter anatomy below. For every concept, decide which figure type explains it
   best *before* writing prose (see the table below).
3. **Write in parts.** Large tutorials are written as part files (`p00_head.html`, `p01_…`, …, `p99_tail.html`,
   ~50–60 KB each) in the scratchpad and joined with `scripts/build.ps1`. This keeps each edit small and lets you rebuild in seconds.
4. **Do a lead-in pass.** After the figures exist, reread each one and write its `p.lead` + `p.look`. For bulk
   retrofits, write `leads*.txt` files keyed by caption prefix (`@@ <first words of figcaption>`) and run
   `scripts/inject_leads.ps1 -Dir <parts>`. It is idempotent and reports figures still missing a lead.
5. **Build:** `scripts/build.ps1 -Parts <dir> -Out <file.html> -Preview <scratchpad>\site\index.html`.
6. **Verify in a real browser** (see QA below). `file://` previews may not run scripts, so serve over HTTP:
   `scripts/serve.ps1 -Root <scratchpad>\site -Port 8765` (run in background; Python may not be installed on this machine).
   Run `scripts/verify.js` in both themes, take screenshots of new figures in both themes, and check a 375px mobile width.
7. **Confirm the source file is untouched**, stop the preview server, and reset any viewport emulation.

## Chapter anatomy

Follow this order for each lesson; the sample lesson in `assets/template.html` shows exact markup.

1. `.lesson-head`: badge number, title, `.meta` line (time estimate · what you'll do).
2. `.goals`: "這堂課你會學到" with 3–5 verb-led, checkable outcomes.
3. Numbered `h3` sections. Each opens with a concrete **scenario** (who, what they have, what goes wrong), then terms (`.defs`), then lead → look → figure.
4. Hands-on steps: command (`bash`) → expected output (`text`, with `← annotations`) → what success looks like → common mistake (`.call.warn`).
5. Config: code block → `.yg` guide → a figure summarizing the structure when it's nested.
6. Callouts where they help: `tip` 💡, `warn` ⚠️, `note` 📌, `ana` 🧩 (analogy), `key` 🎯 (core idea), `lambda` λ (comparison for readers who know Lambda/serverless; adapt or drop for other audiences).
7. Optional `.widget` when a parameter visibly changes an outcome (replicas, weights, thresholds, capacity).
8. `.recap` (🎒 重點回顧, 3–6 one-sentence takeaways) and 2–4 `details.q` self-checks that test understanding rather than recall.

## Choosing figure types

Pick the shape of the figure from the shape of the idea. Aim for a mix within every lesson.

| The idea is about… | Use | Example from the accepted tutorial |
|---|---|---|
| A sequence of steps or a decision | Mermaid `flowchart` | Request path through Gateway → Service → Pod |
| Who talks to whom, in time order | Mermaid `sequenceDiagram` | What happens behind `kubectl apply` |
| States and transitions | Mermaid `stateDiagram-v2` | Pod lifecycle: Pending → Running → CrashLoopBackOff |
| Layers / containment / anatomy | Inline SVG or `.stack/.layer`, `.zone` | Cluster anatomy, VM vs Container layer stack |
| A metaphor that builds intuition | Inline SVG picture | VM = separate houses, Container = apartment building |
| Values changing over time | JS line/area/step chart | CPU throttling vs OOMKilled, HPA scaling lag, Canary weight steps |
| Distribution / percentiles | JS histogram | Latency P50/P95/P99 and the long tail |
| Multiplication / scale | JS bar chart or pictogram (waffle) | Retry amplification 3ⁿ, 1,000 sidecars vs 40 ztunnels |
| Trade-offs across several dimensions | JS radar chart or Mermaid `quadrantChart` | Rolling vs Blue-Green vs Canary |
| Which mechanism covers which threat | Check matrix (`table.matrix`) | RBAC / NetworkPolicy / IAM coverage diagonal |
| A timeline of an incident or process | Custom JS timeline, Mermaid `gantt` | Region failover with RPO/RTO brackets |
| Before vs after, with vs without | `.grid2` of panels inside one figure | Readiness pass vs fail |
| Proportions | Mermaid `pie` or `.meter` bar | Traffic split |
| "What if I change X?" | Interactive `.widget` with a range input and KPIs | Canary weight slider, AZ capacity calculator |

Rules of thumb: a figure should answer one question, stated in its lead; the caption states the *conclusion*
("健康檢查失敗的伺服器會被移出分配名單"), not a title ("Load Balancer 架構圖"). When two figures in a row show the same
idea from different angles (static structure → dynamic flow, list → matrix), say so in the second lead.
Details, Mermaid pitfalls and the chart helper API are in `references/figures.md`.

## Writing voice

Full guidance and before/after examples are in `references/writing.md`. In short:
- Write in the user's language. The existing tutorial uses **Traditional Chinese (Taiwan)**, with full-width punctuation and 「」 quotes; keep English technical terms in their original form with a Chinese gloss on first use: `Pod（Kubernetes 最小的部署單位）`.
- Explain *why* before *how*. Every mechanism is introduced by the problem it solves.
- Prefer concrete numbers and named examples (3 EC2, 4 vCPU, `python-api:v1`, 10,000 requests) over abstractions, and label illustrative values as such.
- An analogy is a stepping stone, not the explanation: follow it with the precise technical statement.
- Keep the text-to-figure balance: every figure has at least a lead and a look-hint, and most sections also have explanatory prose or a table after the figure. Figures support the text; they never replace it.

## Component reference

`references/components.md` has copy-paste markup for every component: lesson shell, goals, term cards, hover terms,
callouts, figure wrappers (Mermaid / SVG / HTML boxes / chart / matrix / comparison grid), lead + look, IDE code blocks
(`data-lang`: `yaml`, `bash`, `powershell`, `python`, `dockerfile`, `json`, `text`, `promql`), YAML guides with indentation levels,
tables, widgets, recap, quiz, part titles, TOC entries and glossary entries.

## QA checklist (run before reporting done)

- [ ] Source file `LastWriteTime` unchanged.
- [ ] `verify.js` in **dark** and **light** (copy it next to the served page and run `eval(await fetch('/verify.js').then(r=>r.text()))`): no Mermaid errors, no empty charts, no figures without lead, no raw code blocks, no low-contrast text, no horizontal overflow, no narrow term cards. `yamlWithoutGuide` is a review list: a syntax demo or a fragment fully explained in prose may stay; any real manifest needs a guide. (Calibration: the accepted 16-lesson tutorial passes with only two such fragments listed.)
- [ ] Figure count ≥ source diagram count; at least several non-flowchart figure types per part.
- [ ] Screenshots of every new figure in both themes, looked at, not just generated: labels don't overlap, nothing is clipped at the edges, legends don't cover data.
- [ ] Mobile width (375px): no horizontal page scroll; wide figures scroll inside their own frame.
- [ ] Theme toggle re-renders Mermaid correctly; reload keeps the chosen theme.
- [ ] Every new term appears in the glossary; every new lesson appears in the TOC.
- [ ] Numbers in captions match what charts actually compute (e.g. percentiles), and illustrative values are marked as illustrative.

## Pitfalls already solved (don't rediscover them)

- Mermaid `stateDiagram` text was invisible in dark mode until `textColor`, `stateLabelColor`, `transitionLabelColor`, `labelColor` etc. were set explicitly in dark `themeVariables` (already in the template).
- Pastel `style X fill:#e3f6ea,…,color:#0b5d2e` lines glare on the dark canvas; the runtime's `darkMap` swaps known pastel fills to dark fill + light text. Use only the pastel fills listed in `references/figures.md`, or extend `darkMap`.
- `quadrantChart` fails with a lexical error on unquoted CJK text: quote axis, quadrant and point labels.
- `gantt` with minute-level data needs `axisFormat` and `tickInterval 1minute`, and a short title, or ticks repeat and the title gets truncated.
- Mermaid `timeline` text renders too small; use the custom JS timeline (`drline` in `references/chart-examples.js`).
- Avoid `{{ }}` template syntax inside Mermaid labels (Helm values etc.); write it as plain text.
- Chart legends placed inside the plot overlap data; put them in the top margin. End-anchor labels near the right edge so they don't overflow.
- `html{scroll-behavior:smooth}` makes automated screenshots stale; set `document.documentElement.style.scrollBehavior='auto'` while testing.
- Widgets must guard against missing elements (`if(!el) return;`), because one throwing IIFE stops all later scripts.
- Writing files in Windows PowerShell 5.1: use `[IO.File]::WriteAllText(path, text, new UTF8Encoding($false))`; `Set-Content` defaults to ANSI and corrupts CJK text.
- A `.ps1` script that contains CJK text must be saved as UTF-8 **with BOM**, or Windows PowerShell 5.1 reads it as ANSI and fails with parser errors.
- Keep `.yg` field names (`<dt>`) short: long names such as `volumeMounts（/tmp）＋ volumes.emptyDir` used to force horizontal scrolling on phones. The template now lets `dt` wrap under 700px, but short names still read better.
- Before adding a new lesson, check whether earlier lessons already set up the topic (a warning like "not covered here", a table row with no example, a forward mention). If so, add a section there and renumber that lesson's `h3`s instead of creating a standalone lesson, then cross-link both ways ("第 N 堂").
- `verify.js` needs a real viewport. If the browser pane is hidden, the width reads as 0 and overflow results are meaningless, so set an explicit size (1280×900, then mobile) before running it.
