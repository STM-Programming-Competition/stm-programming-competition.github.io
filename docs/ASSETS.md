# 素材清单

用户提供的素材原文件均完整复制进仓库，文件内容保持不变。运行网站无需读取仓库之外的素材目录。

| 原文件 | 仓库路径 | 用途 |
| --- | --- | --- |
| `Poster A initial.jpeg` | `src/assets/images/competition-poster.jpeg` | 主页横幅及手机主视觉 |
| `STM.logo white.png` | `src/assets/logos/st-white.png` | 上下支持区的 ST 标识 |
| `uestc logo white text.png` | `src/assets/logos/uestc-white.png` | 上下支持区 |
| `Unboxed colour logo white text.png` | `src/assets/logos/glasgow-white.png` | 深蓝底板上的标识 |
| `Unboxed colour logo blue text.png` | `src/assets/logos/glasgow-blue.png` | 存档供浅色背景备用 |
| `st logos scheme.jpeg` | `docs/brand/st-logo-variants.jpeg` | 版本配色参考，不直接作为网页 Logo 拼图 |
| `preview-dark.svg` | `src/assets/preview-dark.svg` | 浏览器标签图标，保留方形画布 |
| `logo.svg` | `src/assets/logos/logo.svg` | 网页左上角活动 Logo，保持原始 320:272 比例 |

活动标识 SVG 来自 `logo-svg/Logo_02_Final_2026-11-11/`，原文件内容不变。`logo.svg` 用于页眉；`preview-dark.svg` 用于浏览器标签。

## 替换方式

1. 把新文件放入 `src/assets/images/` 或 `src/assets/logos/`。
2. 在 `index.html` 中更新 `src`、`width`、`height` 和替代文字。
3. 检查 `src/styles/main.css` 对应的尺寸及裁切规则。
4. 运行 `npm run check`，预览电脑和手机布局。

Glasgow 文件的有效标识约位于画布 `(166,164)-(818,367)`，当前 `.glasgow-mark img` 设置针对该画布边距。换用其他边距的素材时，应同步调整样式偏移。

原 Logo 内自带的中英文文字不随网页语言切换而重绘或翻译。策划方与赞助方的最终角色排序待活动方确认，当前使用统一的「策划与支持」标签。

## Ubuntu 字体素材

从提供的 `ip-lab-manual-2026/assets/fonts/Ubuntu/` 目录原样复制八个 TTF 字体文件及 `UFL.txt` 至 `src/assets/fonts/Ubuntu/`。文件包含 Light、Regular、Medium、Bold 以及对应斜体，未转换、子集化或修改。字体使用原 Ubuntu Font Licence，随源码和构建产物一同保留。
