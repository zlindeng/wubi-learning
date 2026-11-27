# 技术设计文档

## 1. 技术目标

构建轻量、可维护、可测试的纯前端学习应用。MVP 不引入后端服务；知识内容以静态数据提供，用户学习状态保存在浏览器本地。

## 2. 技术栈

| 层 | 选择 | 用途 |
| --- | --- | --- |
| 语言 | TypeScript（strict） | 类型安全 |
| UI | React | 组件化界面 |
| 构建 | Vite | 开发与生产构建 |
| 样式 | Tailwind CSS | 样式系统 |
| UI 组件 | shadcn/ui（按需） | 常用交互组件 |
| 图标 | Lucide | 图标 |
| 状态 | Zustand | 跨页面客户端状态 |
| 本地数据库 | Dexie.js + IndexedDB | 学习进度与错题持久化 |
| 单元测试 | Vitest | 领域逻辑测试 |
| 组件测试 | React Testing Library | UI 行为测试 |
| E2E | Playwright | 关键用户路径 |

不因偏好而提前引入 Redux、微前端、WASM 或其他非必要基础设施。

## 3. 架构边界

建议分为四个主要层次：

1. **Presentation**：页面、组件、交互和视觉状态。
2. **Application**：课程流程、练习编排、进度更新等用例。
3. **Domain**：字根、拆字、编码、校验和掌握规则；不得依赖 React、DOM 或 Zustand。
4. **Infrastructure**：静态数据加载、IndexedDB、导入导出等实现。

依赖方向应由 UI/应用层指向领域接口；领域逻辑保持纯函数优先，便于单测和复用。

## 4. 建议目录

```text
public/
  data/
    roots.json
    characters.json
    codes.json
    lessons.json
    exercises.json
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  components/
    ui/
    keyboard/
    progress/
    feedback/
  features/
    dashboard/
    lessons/
    keyboard-learning/
    roots/
    decomposition/
    encoding/
    practice/
    mistakes/
    statistics/
  domain/
    keyboard/
    roots/
    decomposition/
    encoding/
    learning/
  application/
    services/
    use-cases/
  infrastructure/
    repositories/
    database/
    import-export/
  stores/
  hooks/
  types/
  utils/
  styles/
tests/
  unit/
  integration/
  e2e/
```

目录可随实际实现调整，但领域规则、静态知识数据和 UI 必须保持清晰边界。

## 5. 核心数据模型（初稿）

以下是概念模型，不代表最终 JSON Schema。实现前应补齐唯一性、引用完整性、数据版本和校验规则。

### 5.1 字根

```ts
interface WubiRoot {
  id: string;
  symbol: string;
  key: string;
  area: "horizontal" | "vertical" | "撇" | "捺" | "折";
  mnemonic?: string;
  description?: string;
  examples?: string[];
  sourceIds: string[];
  version: "86";
}
```

注：区域枚举应在实现时统一为稳定的英文标识；示例仅表达字段意图。一个键位可能关联多个字根，数据结构不得假设一键只有一个字根。

### 5.2 汉字与编码

```ts
type CodeKind =
  | "key_name"
  | "root_character"
  | "simple"
  | "full";

interface WubiCharacter {
  id: string;
  character: string;
  code: string;
  codeKind: CodeKind;
  decomposition: DecompositionStep[];
  explanation?: string;
  sourceIds: string[];
  version: "86";
}
```

一个汉字可能涉及不同输入场景或编码呈现，实际模型应允许同一汉字关联多个编码记录，不能把字符到编码建模成必然的一对一关系。

### 5.3 拆分步骤

```ts
interface DecompositionStep {
  order: number;
  rootId: string;
  note?: string;
}
```

真实数据还应能表达字根序列、取码步骤、末笔字型识别码、简码/全码类型以及必要的规则解释。不要仅凭拆分结果反推完整规则。

### 5.4 课程与练习

```ts
interface Lesson {
  id: string;
  title: string;
  description: string;
  stage: number;
  order: number;
  content: unknown;
  exerciseIds: string[];
  passingScore: number;
}

type ExerciseType =
  | "root_to_key"
  | "key_to_root"
  | "mnemonic_to_key"
  | "decomposition"
  | "encoding";

interface Exercise {
  id: string;
  type: ExerciseType;
  question: unknown;
  answer: unknown;
  explanation?: string;
  difficulty: number;
}
```

content/question/answer 应在具体题型确定后使用可判别联合类型替代 unknown。

## 6. 键盘输入处理

### 6.1 原则

- 使用 `keydown` 监听物理键盘。
- 使用 `event.code` 识别物理键位；不要将系统输入法提交的汉字当作五笔编码。
- 根据练习输入策略使用 `event.key`，并明确大小写处理。
- 检查 `event.isComposing`，避免与微软拼音、搜狗等输入法组合输入冲突。
- 仅当练习区域处于激活状态时接管输入。
- 对 Backspace、Enter、Escape 等控制键定义明确行为。
- 只在确有必要时调用 preventDefault，避免破坏浏览器快捷键和其他输入控件。

### 6.2 领域接口初稿

```ts
interface KeyboardInput {
  key: string;
  code: string;
  timestamp: number;
}

interface InputResult {
  accepted: boolean;
  completed: boolean;
  currentInput: string;
  expectedInput: string;
}

function handleKeyInput(
  input: KeyboardInput,
  expectedCode: string,
  currentInput: string
): InputResult;
```

该接口仅为起点。需根据键盘布局、大小写、输入长度、退格和输入模式进一步细化；领域引擎不得依赖 React、DOM 或 Zustand。

## 7. 本地持久化

使用 Dexie.js 封装 IndexedDB。建议至少包含：
- `lessonProgress`：课程状态、完成时间、掌握情况。
- `exerciseAttempts`：答题记录。
- `mistakes`：错题聚合信息。
- `settings`：用户偏好和版本信息。

要求：
- 数据库 schema 版本化并提供升级策略。
- 通过 repository 封装读写，UI 不直接操作 Dexie 表。
- 导入时校验文件格式、数据版本和引用完整性。
- 导入失败不得破坏现有数据；考虑事务或先校验后写入。
- 导出格式应包含 schemaVersion 和 exportedAt。
- 不将静态知识库与用户学习记录混在同一张表中。

## 8. 状态管理

Zustand 仅管理确实需要跨组件共享的客户端状态，例如当前课程、练习会话和界面偏好。持久化业务记录以 IndexedDB 为准，避免 Zustand 持久化与数据库双写造成状态不一致。

掌握阈值、答题评分和错题规则应集中在领域/应用服务中，不允许组件各自实现。

## 9. 测试策略

### 单元测试

- 键位与字根映射
- 五区识别
- 输入序列接受、拒绝和退格
- 编码长度与类型校验
- 拆字步骤顺序和引用完整性
- 正确率、掌握状态与错题聚合

### 集成测试

- 完成课程后进度更新
- 答错后记录错题
- 重复答题的统计逻辑
- 刷新后恢复学习状态
- 导入导出往返一致性

### E2E

- 首次打开并进入第一课
- 学习字根并完成练习
- 进入拆字教学
- 完成编码练习并查看反馈
- 错题复习
- 完成课程并刷新页面，验证进度保留

### 知识数据校验

字根、键位、键名字根、成字字根、一级简码、编码和拆字数据必须有独立校验。详见 [数据质量规范](DATA_QUALITY.md)。

## 10. 非功能要求

- 首屏加载轻量，避免引入不必要的大型依赖。
- 键盘操作应有清晰焦点状态，支持基本无障碍操作。
- 桌面端优先优化键盘交互；小屏布局保证内容可读。
- 关键领域模块应可独立测试，不依赖浏览器环境。
- 用户学习数据默认仅保存在本地。
