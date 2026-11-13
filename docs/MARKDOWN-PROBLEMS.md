# Markdown 题面维护

`past-problems.html` 只保留网站外壳与阅读容器。网页使用 `fetch` 直接读取这两个文件：

- `src/content/problems/2025-ip-track.md`
- `src/content/problems/2025-vip-track.md`

原题内容保持英语。中英文切换只影响界面，不翻译或重写 Markdown。未增加参考答案或 PDF 下载。

## 日常编辑

首次克隆运行 `npm ci`，之后 `npm run dev`。修改 Markdown 后刷新题目页面即可生效，不需要编辑 HTML 或执行题面转换。需要 HTTP 服务器，不能用 `file://` 打开。

- `#` 为文档标题，`##` 为题目或主要章节，`###` 为子章节。
- 使用普通 Markdown 列表、引用、分隔线和 GFM 表格。
- 行内公式使用 `$...$`，独立公式使用单独行的 `$$` 包裹，LaTeX `\tag{...}` 保留编号。
- 使用带语言名的围栏代码块，如 `text`、`c`、`cpp`、`python`。样例行号不要写入代码块。
- 不使用原始 HTML；Markdown 中的 HTML 不执行。内容来自本地受维护的题目文件。

页面自动生成标题锚点和目录，重复标题的锚点自动区分。IP 的三道题按文档连续阅读。旧 `problem=prime|scroll|tribute|hypnos` 链接仍可定位到对应章节；新链接直接使用标题锚点。手机目录折叠，长公式、代码和表格在自身区域滚动。

## 渲染及构建

`src/lib/markdown.js` 使用 remark/GFM/math 与 rehype/KaTeX/highlight 解析。`scripts/build-markdown.mjs` 通过 esbuild 打包为本地浏览器模块，并同步 KaTeX 样式和字体。浏览器无需 npm、后端或渲染脚本 CDN。

`npm run dev` 自动先生成渲染器；`npm run build` 同样重新生成，再输出完整 `dist/`（包括两份 `.md`）。`npm run build:markdown` 可单独更新渲染器。渲染器与 KaTeX 资源保留在仓库，因此 GitHub Pages 从仓库根目录发布也可使用。更新依赖后请重新构建并提交相应的本地渲染资源。

`npm test` 包含实际题目文件的渲染检查，覆盖样例数字、重复标题、表格、编号公式、代码高亮和 HTML 转义。文件读取失败时，页面提供重试操作。
