# Wubi Learning

面向零基础成年人的 **五笔 86 版互动学习 Web 应用**。通过键盘交互、字根识别、汉字拆分和循序渐进的编码练习，帮助学习者建立可迁移的五笔输入能力。

> 产品原则：少看教程，多动手练习。每个知识点都应尽可能转化为可操作、可反馈、可复习的学习任务。

## 项目状态

项目已进入 Phase 1 工程初始化。知识数据核验与应用基础并行推进；未经核验的字根、编码和拆字内容不得作为正式教学数据。

## 核心范围

- 86 版键盘布局与五区认知
- 字根学习与键位记忆
- 汉字结构、拆分规则与拆字过程演示
- 键名字根、成字字根和基础单字编码
- 一级简码练习
- 即时反馈、错题复习、学习进度与统计
- IndexedDB 本地保存，支持学习数据导入和导出

首个 MVP 不包含账号系统、云同步、排行榜、社交功能、视频课程，也不自动生成未经验证的五笔知识数据。

## 技术方向

- TypeScript（strict）、React、Vite
- Tailwind CSS、shadcn/ui（按需使用）、Lucide
- Zustand、Dexie.js（IndexedDB）
- Vitest、React Testing Library、Playwright

采用纯前端架构，知识内容以静态数据为主。编码、拆字、校验等领域逻辑与 React UI 分离。

## 文档

| 文档 | 内容 |
| --- | --- |
| [产品需求](docs/PRODUCT_SPEC.md) | 目标用户、产品范围、学习路径、功能与验收标准 |
| [技术设计](docs/TECHNICAL_DESIGN.md) | 技术栈、架构边界、数据模型、输入处理与持久化 |
| [开发计划](docs/DEVELOPMENT_PLAN.md) | MVP 优先级、阶段拆分、交付与 AI Agent 协作规范 |
| [数据质量规范](docs/DATA_QUALITY.md) | 86 版知识数据来源、校验、版本与发布要求 |
| [来源登记](docs/SOURCE_REGISTER.md) | 候选资料、来源用途和版权边界 |
| [键盘布局核验](docs/KEYBOARD_LAYOUT_VERIFICATION.md) | 五区、25 键、区位号及键名核验 |
| [G 键审计](docs/G_KEY_ROOTS_AUDIT.md) | G 键候选字根及差异 |
| [25 键候选审计](docs/ROOTS_CANDIDATE_AUDIT.md) | 早期候选索引（来源归属以新差异报告为准） |
| [字根来源差异核对](docs/ROOTS_SOURCE_COMPARISON.md) | 多来源展示差异和核验结论 |
| [汉字拆分样本审计](docs/CHARACTER_SAMPLE_AUDIT.md) | 86/98 版本定位、样本转录和待核验事项 |
| [数据 Schema](docs/DATA_SCHEMA.md) | 知识数据结构和核验状态 |
| [数据目录说明](data/README.md) | 数据文件组织与录入规则 |
| [Phase 0 进度](docs/PHASE0_PROGRESS.md) | 知识数据准备进度与待办 |
| [Phase 1 进度](docs/PHASE1_PROGRESS.md) | 工程初始化、原型交付与验证状态 |

## 本地开发

环境要求：Node.js 20.19+ 或 22.12+，npm。

```bash
npm install
npm run dev
```

常用检查：

```bash
npm run typecheck
npm test
npm run build
```

当前工程已建立 Vite + React + TypeScript strict 基础和键盘认知原型。首次安装后请提交生成的 `package-lock.json`，确保依赖解析可复现。

## 设计约束

1. 教学内容必须明确标注为五笔 86 版。
2. 简码、全码、键名字根、成字字根等概念不可混为一谈。
3. 不确定的知识数据必须标记为待核验，不得猜测补齐。
4. UI 只负责呈现与交互；编码和拆字规则应由可测试的领域模块实现。
5. 优先保证桌面端物理键盘体验，同时提供响应式布局。
