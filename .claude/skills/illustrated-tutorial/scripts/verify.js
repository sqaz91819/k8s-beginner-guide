/* Paste into the browser (or run via a javascript tool) on the served page, AFTER Mermaid has finished
   rendering (wait ~3 s). Run once in dark mode and once in light mode (click #themeBtn, wait, rerun).
   Returns a JSON report; every array should be empty and every count should match expectations. */
(() => {
  const $$ = s => Array.from(document.querySelectorAll(s));
  const cap = f => (f.querySelector('figcaption')?.textContent || '').trim().slice(0, 40);
  const isDark = document.documentElement.dataset.theme !== 'light';

  // 1. Mermaid: syntax errors render as an "error" svg or leave raw text behind
  const mermaidErrors = $$('pre.mermaid').filter(p =>
    !p.querySelector('svg') || p.querySelector('svg[aria-roledescription="error"], .error-icon')
  ).map(p => cap(p.closest('figure') || p) || p.textContent.slice(0, 40));

  // 2. JS charts that did not render (unknown data-chart name or exception)
  const emptyCharts = $$('.chart').filter(c => !c.querySelector('svg')).map(c => c.dataset.chart);

  // 3. Figures without a lead-in. A figure (or the grid wrapping it) must be preceded by p.look, which follows p.lead
  const noLead = $$('figure.fig').filter(f => {
    if (f.closest('.widget')) return false;
    let anchor = f.parentElement.matches('.grid2,.grid3') ? f.parentElement : f;
    // figures 2..n inside the same grid share the grid's lead
    let prev = anchor.previousElementSibling;
    if (anchor === f && prev && prev.matches('figure.fig')) return false; // consecutive figure pair, judge manually
    return !(prev && prev.matches('p.look') && prev.previousElementSibling && prev.previousElementSibling.matches('p.lead'));
  }).map(cap);

  // 4. Code blocks without IDE chrome, and YAML blocks (> 3 lines) without a field guide.
  //    Review the list: short syntax demos or fragments already explained in prose are acceptable.
  const rawCode = $$('pre.code').filter(p => !p.closest('.ide')).length;
  const yamlNoGuide = $$('pre.code[data-lang="yaml"]').filter(p => {
    const ide = p.closest('.ide'); if (!ide || ide.closest('.widget')) return false;
    if (p.textContent.trim().split('\n').length <= 3) return false;
    return !(ide.nextElementSibling && ide.nextElementSibling.classList.contains('yg'));
  }).map(p => p.dataset.file || p.textContent.split('\n')[0].slice(0, 40));

  // 5. Low-contrast SVG text (dark text on dark canvas or light text on light canvas)
  const lum = c => { const m = c.match(/\d+(\.\d+)?/g); if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map(v => { v = v / 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return .2126 * r + .7152 * g + .0722 * b; };
  const lowContrast = [];
  // check the innermost text carrier: Mermaid often colors <tspan> while the parent <text> keeps a dark box fill
  const carriers = [];
  $$('figure.fig svg text').forEach(t => { const ts = t.querySelectorAll('tspan'); ts.length ? carriers.push(...ts) : carriers.push(t); });
  carriers.push(...$$('figure.fig svg foreignObject span, figure.fig svg foreignObject div'));
  carriers.forEach(el => {
    if (!el.textContent.trim() || el.querySelector('tspan')) return;
    // JS charts only use white text on top of a solid shape (✓ in a filled circle, labels on bars)
    if (el.closest('.chart') && /^rgb\(255, 255, 255\)$/.test(getComputedStyle(el).fill)) return;
    const svgText = el.tagName === 'text' || el.tagName === 'tspan';
    const L = lum(svgText ? getComputedStyle(el).fill : getComputedStyle(el).color);
    if (L == null) return;
    // only flag text sitting directly on the canvas (not inside a filled node) — heuristic: very dark text in dark mode / very light text in light mode
    if ((isDark && L < 0.05) || (!isDark && L > 0.85)) {
      const node = el.closest('.node, .cluster, g');
      const rect = node && node.querySelector('rect, polygon, path');
      const fill = rect ? lum(getComputedStyle(rect).fill) : null;
      if (fill == null || (isDark ? fill < 0.2 : fill > 0.6)) lowContrast.push(cap(el.closest('figure')) + ' → "' + el.textContent.trim().slice(0, 20) + '"');
    }
  });

  // 6. Layout: horizontal page overflow, narrow side-by-side text cards
  const overflowX = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  const mainW = document.querySelector('section.lesson')?.clientWidth || 0;
  const narrowDefs = $$('.defs .def').filter(d => d.offsetParent && d.getBoundingClientRect().width < mainW * 0.7).length;

  return JSON.stringify({
    theme: isDark ? 'dark' : 'light',
    counts: { figures: $$('figure.fig').length, mermaid: $$('pre.mermaid').length, charts: $$('.chart').length,
      leads: $$('p.lead').length, looks: $$('p.look').length, codeBlocks: $$('pre.code').length,
      yamlGuides: $$('.yg').length, widgets: $$('.widget').length, termCards: $$('.def').length },
    mermaidErrors, emptyCharts, figuresWithoutLead: noLead, rawCode, yamlWithoutGuide: yamlNoGuide,
    lowContrastText: [...new Set(lowContrast)].slice(0, 30), overflowX, narrowTermCards: narrowDefs
  }, null, 1);
})();
