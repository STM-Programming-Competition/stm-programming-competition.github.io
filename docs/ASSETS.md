# 素材清单

六个用户提供的原文件均完整复制进仓库，文件内容保持不变。运行网站无需读取仓库之外的 `Posters/`。

| 原文件 | 仓库路径 | 用途 |
| --- | --- | --- |
| `Poster A initial.jpeg` | `src/assets/images/competition-poster.jpeg` | 主页横幅及手机主视觉 |
| `STM.logo white.png` | `src/assets/logos/st-white.png` | 顶部品牌及上下支持区 |
| `uestc logo white text.png` | `src/assets/logos/uestc-white.png` | 上下支持区 |
| `Unboxed colour logo white text.png` | `src/assets/logos/glasgow-white.png` | 深蓝底板上的标识 |
| `Unboxed colour logo blue text.png` | `src/assets/logos/glasgow-blue.png` | 存档供浅色背景备用 |
| `st logos scheme.jpeg` | `docs/brand/st-logo-variants.jpeg` | 版本配色参考，不直接作为网页 Logo 拼图 |

`src/assets/favicon.svg` 是新增的 STM 文字小图标，不替代提供的品牌 Logo。

## 替换方式

1. 把新文件放入 `src/assets/images/` 或 `src/assets/logos/`。
2. 在 `index.html` 中更新 `src`、`width`、`height` 和替代文字。
3. 检查 `src/styles/main.css` 对应的尺寸及裁切规则。
4. 运行 `npm run check`，预览电脑和手机布局。

Glasgow 文件的有效标识约位于画布 `(166,164)-(818,367)`，当前 `.glasgow-mark img` 设置针对该画布边距。换用其他边距的素材时，应同步调整样式偏移。

原 Logo 内自带的中英文文字不随网页语言切换而重绘或翻译。策划方与赞助方的最终角色排序待活动方确认，当前使用统一的「策划与支持」标签。
