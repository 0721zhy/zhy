# AGENTS.md

Static HTML/CSS coursework site (张海玉 · 《高级网页设计》课堂实践). Pure static files — no build step, package manager, tests, or lint. Open `index.html` in a browser to verify changes.

## Constraints

- **原生技术栈**：只允许原生 HTML + CSS + JavaScript，**严禁**引入任何第三方库（框架、图标库、动画库等）、CDN、外部资源（外部字体、远程图片、Google Fonts 等）。所有代码必须手写，所有资源必须来自本地。
- **图标规范**：项目图标统一使用 `font/` 目录下的 iconfont 字体图标。在 `<head>` 中引入 `<link rel="stylesheet" href="font/iconfont.css">`，元素上用 `<i class="iconfont icon-xxx"></i>` 渲染。iconfont 的 `icon-` 前缀是图标库的类名约定，**豁免**下方 `zhy_` 前缀规则。
- 内容为中文 (`lang="zh-CN"`)；编辑时沿用已有语气和术语。
- **命名规范**：所有自定义 CSS 类名、id 名、CSS 自定义属性、JS 变量必须带 `zhy_` 前缀（例：`.zhy_page`、`#zhy_title`、`--zhy_ink`、`var zhy_data`）。内置标签（`div`、`p`）、第三方库约定类名（iconfont 的 `iconfont`、`icon-xxx`）、浏览器内置对象（`document`、`Date`、`Math`）豁免此规则。
- **页面注释**：每个 HTML 页面 `<body>` 之后必须紧跟一条注释：`<!-- 姓名：张海玉 日期：YYYY-MM-DD 功能：xxx -->`。

### 历史页面例外

以下页面是课程演示特定第三方库的练习成品，作为历史保留，不计入当前约束：

- `13-1.html` — Font Awesome 字体图标演示（页面本身就是该库的练习）

`13-2.html` 已重构为本地 iconfont（字体 + SVG）演示，不再是例外。

新建或改写页面**禁止**参考这些文件的第三方库用法。

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
