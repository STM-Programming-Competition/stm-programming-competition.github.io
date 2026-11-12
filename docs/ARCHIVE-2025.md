# 2025 英语原题收录

入口为 `past-problems.html?lang=en&track=ip`，界面可切换 `lang=zh`；正文固定为英语，且标注 `lang="en"`。

## 来源及取舍

源材料为活动方提供的两份 2025 手册。以下页码是 PDF 文件实际页序，非印刷页码。

- IP：第 5-6 页 Level 1，第 7-8 页 Level 2，第 10-11 页 Level 3。保留题目叙述、定义、输入输出、样例解释、原题提示和数据范围。排除封面、目录、参赛规则、独立故事介绍、题目间的过渡文字及第 8-9 页读入字符串教程。
- VIP：第 4 页 Objective 的任务描述、第 5-9 页模型和输入输出、第 10-11 页评分机制和测试范围、第 14-15 页原始文本样例及输出格式。排除背景宣传、手册导航说明、提交政策、示例数据的 C++ 配置代码及 C/C++/Python 解答模板。

正文没有翻译，没有补充算法或参考答案；原题自带的 Hints、Explanation 和 Example Output 属于题面内容，予以保留。

## 转写规则

去除页码、样例行号和印刷换行断词。保留原题术语、数值、约束和原有说明，包括 VIP 输入格式原文的 “Line 1: Four integers”（其后实际列出五个字段），未擅自修订题意。

数学公式重排为 KaTeX，保留公式编号；示例输入输出使用保留换行的代码块。可编辑的网页提取内容存于 `src/content/problems/archive-2025.json`；便于后续发布的 Markdown 版本分别存于 `src/content/problems/2025-ip-track.md` 与 `src/content/problems/2025-vip-track.md`；当前发布页面为 `past-problems.html`。JSON 中公式采用 LaTeX 属性保存，发布 HTML 已预渲染。

PDF 源文件未复制入仓库，也未提供下载入口。正式页面不依赖原 PDF；`View materials` 在同一标签页进入原题页，并沿用当前界面语言和赛道。原题页的赛道及题目选择通过 URL 查询参数保留，支持刷新和分享。
