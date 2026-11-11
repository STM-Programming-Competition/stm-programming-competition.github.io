# Problem preview prototype (retired)

The standalone problem preview was removed after the dedicated 2025 Past Problems page was completed. This file remains as a text-only record of the prototype; the prototype is no longer served or built.

## Design record

- A bilingual, responsive problem-reading layout within the competition site's visual system.
- A desktop table of contents and a compact mobile layout.
- Mathematical expressions pre-rendered with KaTeX as HTML and MathML, with horizontal scrolling for long formulas.
- Sample code shown with syntax highlighting and copy controls.
- Reference solutions kept collapsed by default and not executed in the browser.
- The sample task, “Range Energy Queries,” was invented for layout demonstration and was not an official past problem.

## Current archive page

The live past-problem archive is `past-problems.html`; its transcribed 2025 statements are stored in `src/content/problems/archive-2025.json`. Archive-specific reading styles now live in `src/styles/past-problems.css`. The local KaTeX stylesheet, fonts, and license remain in `src/assets/vendor/katex/` because the archive page still uses them to display its formulas.

The prototype's standalone HTML, JavaScript, sample task files, and generator have been removed. This document is the retained record of that work.
