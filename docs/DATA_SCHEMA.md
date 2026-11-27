# 知识数据 Schema 设计

## 1. 设计目标

- 知识数据和用户学习记录分离。
- 86 版是显式字段，不靠文件名或上下文推断。
- 一个键位可以有多个字根；一个汉字可以有多条编码记录。
- 每条事实可以追溯到来源，并有独立核验状态。
- 简码、全码、键名字和成字字根不能混成一个无差别的 code 字段。
- 数据格式可被脚本校验，也便于课程内容引用。

## 2. 推荐文件布局

```text
data/
  README.md
  sources.json
  schema/
    source.schema.json
    root.schema.json
    character-code.schema.json
  reference/
    # 只放项目有权再分发的参考材料；未经授权的教材/码表不放入仓库
  verified/
    roots.json
    character-codes.json
    lessons.json
    exercises.json
```

当前 Phase 0 先建立 Schema 和来源登记。正式数据文件在完成核验前不创建或保持空集合。

## 3. 通用约束

- 所有知识记录都应包含 `id`、`version: "86"`、`sourceIds`、`verification`。
- `verification.status` 只有 `verified` 的记录可以被正式课程引用。
- 来源 ID 必须存在于 `data/sources.json`。
- 数据更新应记录变更原因；重要记录的核验信息不可省略。
- 字母键使用大写 A–Y；Z 不作为普通字根键录入，若以后涉及万能键/学习键，应单独建模。
- 不把键盘区位号（如 11、25）和字母键位混成同一个字段。

## 4. 字根 Root

一个记录代表一个可独立教学/引用的字根形态，不代表一个键位。多个 Root 可以指向同一个 key。

关键字段：
- `glyph`：规范展示字形。
- `variants`：同一字根的可接受字形变体；只有经核验后填写。
- `key`：对应字母键。
- `area`：`horizontal`、`vertical`、`left_falling`、`dot`、`turning` 五区之一。
- `position`：区位号，例如两位数字字符串；待键盘图核验后填写。
- `category`：普通字根、键名字根、成字字根。
- `mnemonicText`：助记文本，需记录其来源/自编状态。
- `sourceIds`：支持该记录的来源。

键名字根与成字字根是特殊类别，不能只通过“这个字形看起来像汉字”自动推断。

## 5. 汉字编码 CharacterCode

一个汉字可以有多个编码记录，例如不同简码级别和完整编码。

关键字段：
- `character`：单个汉字。
- `code`：大写字母序列。
- `codeType`：`key_name`、`character_root`、`level1`、`level2`、`level3`、`full`。
- `rootIds`：拆分所用字根的有序 ID 列表。
- `decomposition`：可解释的拆分步骤。
- `lastStroke`、`structure`、`identificationCode`：仅在适用且有来源支持时填写。
- `sourceIds`：编码及拆分依据的来源。

不要把“用户在某个输入法中实际打出来的候选结果”直接当作规范全码。输入法词库、简码和候选策略可能有实现差异。

## 6. 核验状态

- `draft`：仅录入，尚未检查。
- `needs_review`：来源不足、存在冲突或需要复核。
- `verified`：来源和规则均完成核验。
- `rejected`：确认不正确或不适用。

正式教学构建只加载 `verified` 数据。审核人和核验日期应在状态变为 verified 时填写。

## 7. Schema 文件

机器可读约束见：
- [source.schema.json](../data/schema/source.schema.json)
- [root.schema.json](../data/schema/root.schema.json)
- [character-code.schema.json](../data/schema/character-code.schema.json)

Schema 负责结构验证，不负责证明五笔知识本身正确。知识准确性仍需要来源复核和人工审核。
