# STM Programming Competition

STM 编程大赛中英文静态网站。当前版本采用选定的 **「开放式画册 / Open Prospectus」** 视觉方案，替换原有的交互线框稿。

浅色页面、学院蓝按钮、海报横幅和充足留白构成主要视觉语言。包含主页、赛制详情、介绍、手机布局、语言切换、赛道选择、FAQ 和轻量动画。

> 当前是可继续编辑的完整样板。日期、场地、赛道规则、奖项、团队名单和外部入口仍为占位，不代表正式赛事信息。

## 本地运行

需要 **Node.js 20 或更新版本**，npm 随 Node.js 提供。首次运行请先执行 `npm ci`，安装 Markdown 渲染器的构建依赖。页面仍为纯静态网站，无需后端。

在仓库目录打开终端：

```sh
npm ci
npm run dev
```

访问 <http://127.0.0.1:5173/>。修改文件后刷新浏览器即可查看变化，按 `Ctrl+C` 停止服务器。自定义端口：

```sh
npm run dev -- --port 5174
```

请通过 HTTP 预览；直接双击 `index.html` 的 `file://` 方式无法可靠加载 ES modules。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地源码服务器，默认端口 5173 |
| `npm run check` | 检查 JavaScript 语法、双语文案和页面素材 |
| `npm test` | 验证题目 Markdown 渲染、分享路由、语言上下文和外链处理 |
| `npm run build` | 检查源码后生成独立静态产物 `dist/` |
| `npm run preview` | 在端口 4173 预览 `dist/`，需先构建 |

## 项目目录

```text
.
├── index.html                 # 网页入口，含英文初始页面
├── src/
│   ├── main.js                # 渲染、导航、语言、菜单、弹窗与动画
│   ├── config.js              # 报名状态及外部链接
│   ├── content/locales.js     # 中文 / 英文文案
│   ├── lib/router.js          # Hash 路由与外部 URL 校验
│   ├── styles/main.css        # 视觉规则和响应式样式
│   └── assets/
│       ├── preview-dark.svg   # 浏览器标签图标
│       ├── fonts/Ubuntu/      # 自托管英文字体与 UFL.txt 授权
│       ├── images/            # 原始赛事主视觉
│       └── logos/             # 活动、ST、UESTC、Glasgow 标识
├── scripts/
│   ├── serve.mjs              # 开发及产物预览服务器
│   ├── check.mjs              # 源码、文案及素材检查
│   └── build.mjs              # 静态产物生成
├── tests/router.test.js
├── docs/
│   ├── DESIGN.md              # 视觉与动画约定
│   ├── ASSETS.md              # 素材清单
│   └── brand/                 # ST 配色版本参考图
├── dist/                      # 构建产物，不提交到 Git
├── package.json
├── package-lock.json
├── .gitignore
├── .nojekyll
└── LICENSE
```

采用 HTML、原生 CSS 和浏览器 ES modules；没有后端、数据库或远程图片请求；中文 MiSans 字体通过指定 CDN 加载。保留源码、素材、内容、脚本和文档的常见分层，为三个展示页面保持简单的维护方式。

## 页面与双语路由

| 页面 | 中文 | English |
| --- | --- | --- |
| 主页 | `#/zh/` | `#/en/` |
| 赛制详情 | `#/zh/rules` | `#/en/rules` |
| 介绍 | `#/zh/about` | `#/en/about` |

示例：<http://127.0.0.1:5173/#/en/rules?track=b&section=faq>。

Hash 路由可在 GitHub Pages 直接访问、刷新和前进/后退，不需要服务器重写。实际地址与草图中的 `/zh/rules` 示意形式不同。

- 一次显示一种语言，语言选项保持 `中文 / EN`。
- 首次访问默认英文；中文作为辅助语言，可手动切换。已有语言偏好或 URL 明确指定语言时，尊重相应选择。
- 切换语言保留页面、赛道、FAQ 展开状态及页内目标。
- 站内导航沿用当前语言；浏览器允许时会保存语言偏好。
- URL 中明确指定的语言优先于已保存的偏好。
- `track=b` 指定赛道 B；`section=competition|faq|past` 指定赛制页内位置。
- 页面状态不上传到任何服务。

## 修改赛事内容

编辑 `src/content/locales.js` 中同名的中文和英文文案，例如 `dateValue`、`venueValue`、`trackA` 和 `trackB`。两种语言的键需要保持一致。`rulesTitle` 和 `aboutTitle` 允许 `<br>` 指定标题换行，其他字段作为纯文本处理。

`index.html` 包含不启用 JavaScript 时可阅读的英文首页；确认最终内容后，应同步其中的英文初始文字和描述。需要增减赛道、FAQ 或团队分组时，修改该文件的结构，并补齐双语键。

## 接入报名和往届资料

编辑 `src/config.js`：

```js
export const siteConfig = {
  registrationStatus: 'open',
  links: {
    registration: {
      zh: 'https://example.org/registration-zh',
      en: 'https://example.org/registration-en',
    },
    pastProblems: {
      zh: 'https://example.org/past-problems-zh',
      en: 'https://example.org/past-problems-en',
    },
  },
};
```

示例域名需要替换成真实地址。当前链接为空，点击只会显示明确的待接入弹窗，不会模拟报名成功。已接入的 HTTP(S) 链接在新标签页打开。

报名状态支持 `preview`（当前样板）、`upcoming`（未开放）、`open`（报名中）、`closed`（已截止）。当状态为 `upcoming` 或 `closed` 时，会更新按钮文案并停止跳转。状态由维护者更新，不做后端计算或自动截止判定。

两种语言的入口分别配置；缺少当前语言的地址时，不会默默跳转到另一语言。外部表单和资料的语言由相应资源自身决定。

## 构建与 GitHub Pages

```sh
npm run check
npm test
npm run build
npm run preview
```

`dist/` 包含完整的 HTML、源码、素材、`.nojekyll` 和许可证，能够单独托管。构建不会压缩或改变原始海报及 Logo，也不依赖父目录中的 `Posters/`。

根目录也可作为 GitHub Pages 的站点根目录：路径采用相对引用，页面使用 Hash 路由。若未来采用 GitHub Actions 部署，可上传构建后的 `dist/`。本仓库未添加自动部署流程。

本次更新会直接发布到现有 GitHub Pages 仓库。原 `.git`、远程地址、历史、`.nojekyll` 与许可证保留；旧版源码可从既有 Git 历史查看。

## 进一步维护

- [视觉、排版与动画约定](docs/DESIGN.md)
- [素材清单与替换方式](docs/ASSETS.md)

代码许可证沿用 [LICENSE](LICENSE)。提供的大学和 ST Logo 及相关商标权归各自权利人，不因代码许可证而改变。

## 字体

主要英文字体为本地 Ubuntu，文件及授权位于 `src/assets/fonts/Ubuntu/`，随构建复制进 `dist/`。中文界面使用 MiSans 4.0.0（Normal / Demibold），通过提供的 jsDelivr 样式加载，失败时回退到系统中文字体。Ubuntu 字体受该目录的 `UFL.txt` 约束，不受代码 MIT 许可证替代。

### 信号回路首页

首屏样式位于 `src/styles/hero.css`，代码书写动画位于 `src/lib/hero.js`，局部感应点阵位于 `src/lib/hero-field.js`。统一矢量插图保存在 `index.html` 首页区域，无远程图片依赖。日期、场地和截止时间沿用 `src/content/locales.js`，场地内容可使用 `\n` 分行。

## Markdown 题目文档

往届题面现由 `src/content/problems/2025-ip-track.md` 和 `2025-vip-track.md` 直接渲染；只需修改 Markdown 后刷新页面，无需同步 HTML。支持 GFM 表格、列表、代码高亮和 LaTeX 公式，自动生成标题目录。具体说明见 [Markdown 题面维护](docs/MARKDOWN-PROBLEMS.md)。
