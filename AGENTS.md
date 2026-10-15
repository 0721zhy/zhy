# AGENTS.md

Static HTML/CSS coursework site (张海玉 · 《高级网页设计》课堂实践). Pure static files — no build step, package manager, tests, or lint. Open `index.html` in a browser to verify changes.

## Constraints

- Course brief requires native HTML/CSS only — no CDNs, no frameworks, no external resources. Keep it that way.
- Content is Chinese (`lang="zh-CN"`); match existing tone and terminology when editing.
- All CSS class names, id names, and JS variables must be prefixed with `zhang_` (e.g. `.zhang_page`, `#zhang_title`). Applies to new code; existing pages have not been renamed.

## Prompt Logging

- Before executing any request, append it to `zhang_prompt.md` with the timestamp, model name, and full prompt text. Append-only — never overwrite existing entries.

## Structure

- `index.html` is the hub page and the assignment deliverable. It must:
  - list every exercise page as a `.work-link` card inside `.work-list`, with sequential `.work-number` values ("01", "02", …) and a short title/description.
  - preserve the "本次页面要求" blockquote — it embeds the original prompt and must not be removed.
- Exercise pages are standalone: each carries its own inline `<style>` in `<head>`. The root `css.css` is legacy (only one page links it) — do not assume shared styles or rely on it.
- Images live in `img/` and are referenced with relative paths (e.g. `./img/1.jpg`) from the site root.

## Gotchas

- Several exercise filenames contain Chinese characters and/or spaces (e.g. `7-1 上图下文.html`, `10-2 annimation.html`). Links to them in `index.html` must be URL-encoded (`7-1%20%E4%B8%8A%E5%9B%BE%E4%B8%8B%E6%96%87.html`) or they will break when opened via `file://`.
- New exercise pages are not auto-discovered: adding an HTML file requires manually adding its card to `index.html` and updating the page count in the side panel.
