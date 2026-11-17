# 织音（Zhiyin）

## DeepSeek Harness Agent 技能编排插件 PRD

| 项目 | 内容 |
|---|---|
| 产品名称 | 织音（Zhiyin） |
| 产品形态 | DeepSeek Harness（DSH）Web 插件 |
| 文档版本 | v0.1 · 需求基线草案 |
| 日期 | 2026-11-16 |
| 品牌归属 | B站·宝藏二哥AIA |
| 目标用户 | 使用 DSH 管理多种 Agent Skills 的个人开发者与 AI 工作流使用者 |
| 核心关键词 | 工位、技能编组、多包组合、重叠复用、并集启用 |

> **产品主张：让技能自由编组，让能力彼此协奏。**
>
> 织音不是一个把 Skill 分门别类的标签工具，而是一套以工位为组织方式、以声部为技能包、以合奏为运行状态的 Agent 能力编排系统。

---

# 1. 产品概述

## 1.1 产品背景

DSH 已经能够发现和加载 Agent Skill，但常规使用方式以单个 Skill 为单位进行控制。当用户拥有几十甚至上百个 Skill 时，需要逐个开关，或者依赖简单分组、角色切换来管理。实际工作却不是逐个挑选工具，而是以一个稳定的工作职责为单位开展：例如前端工程、后端工程、公众号内容生产、视频制作、工程维护等。

这些工作单元通常需要多个 Skill 覆盖不同阶段。有些 Skill 是执行能力，有些负责前期规划、质量验证、交付或维护；还有一些通用 Skill 会被多个工位共同使用。因此，技能组织天然是**多对多关系**，而不是互斥的文件夹树。

织音把这种工作方式产品化：用户先将 Skill 编组成不同工位，再自由启用一个或多个技能包。多个启用包之间允许共享 Skill，最终由系统计算去重并集，并将正确的技能可用范围同步给 DSH Agent。

## 1.2 产品定义

织音是一款 DSH Web 插件，提供：

1. **音符管理**：读取当前 DSH Agent 可见的 Skill 清单，展示来源、描述、可用状态和归属关系。
2. **声部编配**：将多个 Skill 组成一个有明确工作职责的技能包；一个 Skill 可以同时属于多个声部。
3. **合奏控制**：同时启用多个声部，按集合并集规则计算 Agent 当前可用的 Skill。
4. **乐谱管理**：保存常用声部组合，支持快速应用、复用和分享。
5. **状态同步**：在不改写原始 Skill 内容的前提下，将合奏结果同步到 DSH 的技能可见性与调用机制。

## 1.3 核心价值

- 把“逐个找 Skill、逐个开关”变成“按工位一键启用”。
- 把互斥角色切换变成可叠加的多声部组合。
- 允许跨工位复用通用 Skill，不复制 Skill 文件，也不制造重复加载。
- 用可计算、可预览、可还原的状态管理，降低误关共享技能的风险。
- 保持 DSH 原生 Skill 加载机制，不把所有 Skill 正文提前塞进上下文。

---

# 2. 调研结论与平台边界

## 2.1 DSH 官方架构

本次调研以 DeepSeek AI 官方 `deepseek-ai/deepseek-harness` 仓库及其当前文档为主要技术依据。DSH 采用 Cordis 插件架构，产品能力通过插件注册到运行时上下文；插件卸载时，注册的服务、事件监听和可逆副作用可随生命周期清理。Profile 负责组合插件与 Bundle，外部插件应通过官方扩展机制接入，而不是修改 DSH 核心源码。

DSH 当前处于 Developer Preview 阶段，官方明确提示接口可能存在破坏性变更。因此织音必须隔离平台适配层、记录经过实测的 DSH 兼容版本，并在升级时运行契约测试。

## 2.2 DSH Skill 机制

DSH 的 Skill 能力由三个相互配合的部分组成：

- **Skill Registry**：`ctx.skills`，负责合并不同来源的 Skill Provider，并按 Agent Scope 解析当前可见技能。
- **Skill Provider**：例如 `dsh-skill-filesystem`，负责发现 Skill 候选项并在需要时加载完整正文。Provider 可以来自本地文件、插件内嵌资源或第三方来源。
- **Skill Consumer**：例如 `dsh-tool-skill`，负责给模型提供技能目录与按需加载工具；用户也可以通过 `/skill-name` 显式调用允许用户调用的 Skill。

核心接口包括：

- `ctx.skills.list(...)`：读取 Skill 摘要。
- `ctx.skills.snapshot({ cwd, signal, scope })`：读取当前上下文的完整目录观测及 `complete` 状态。
- `ctx.skills.get(name, ...)`：按需取得完整 Skill 定义。
- `ctx.skills.registerProvider(...)`：向对应作用域注册 Provider。
- `skills/change`：目录变化失效通知，消费者收到后重新获取快照。

DSH 支持两种相互独立的调用策略：

- `modelInvocable`：Skill 是否出现在模型可见目录并可由模型加载。
- `userInvocable`：Skill 是否可通过用户侧命令（如 `/name`）显式调用。

这两个策略不能混为一个开关。织音需要把“声部是否启用”与“Skill 原始调用策略”分开保存，再计算最终有效状态。

DSH 的本地 Skill Provider 能发现项目级与用户级 Skill，既支持目录形式的 `<name>/SKILL.md`，也支持扁平 Markdown 文件；同时支持监听技能目录变化。Registry 按 Host 与 Agent Scope 分层合并，同名技能会遵循作用域优先级与 Provider 优先级规则，面向某个 Agent 的真实技能目录不一定等于全局目录。

## 2.3 现有社区插件对比

| 项目 | 已有能力 | 对织音的启发与差异 |
|---|---|---|
| `dsh-skill-panel` | 技能浏览、搜索、单技能开关、分组成员维护、设置页和侧栏入口；分组数据使用 DSH 存储能力 | 证明了管理 UI、持久化分组和官方客户端扩展点可行；但织音的重点不是只给技能贴分组，而是管理多组同时启用的集合状态 |
| `dsh-skill-hub` | 完整技能目录、来源/位置/自定义角色、分组开关、角色切换、状态快照与恢复、诊断和市场能力 | 已经解决了角色分组与批量控制；其“切换到角色”主要是启用该角色成员并暂停其他可切换技能，与织音需要的非排他多包叠加不同 |
| `dsh-skill-manager` | 列表、单技能开关、聊天工具控制 | 解决单项管理问题，但不以工位组合为核心 |
| `dsh-skills-manager` | 技能新增、编辑、删除、导入及独立调用开关 | 更偏向 Skill 内容与生命周期管理，不是多工位组合运行时 |

**织音不以“批量开关”作为创新点。** 真正的产品差异是：

1. 多个声部可同时处于启用状态，不是单选角色。
2. 声部之间可共享音符，成员关系是多对多。
3. 生效技能按并集计算，重复音符只计一次。
4. 停用某个声部时，只撤销该声部的贡献；其他启用声部仍然引用的技能必须保持有效。
5. 乐谱用于保存一套声部组合，可以重复应用，而不是把所有其他声部强制关闭的临时角色切换。

## 2.4 已核实能力与待验证事项

| 项目 | 调研结论 | PRD 处理方式 |
|---|---|---|
| DSH 插件生命周期 | 官方 Cordis 插件 `apply(ctx)`、依赖注入、可逆 effect 均有文档 | 采用独立插件，不改 DSH 核心 |
| Skill 目录读取 | `ctx.skills.snapshot/list/get` 及 Scope 查询有官方定义 | 通过 Skill Registry 读取，不自行扫描所有来源作为唯一事实 |
| Skill 调用策略 | 模型与用户调用是独立布尔策略 | 分别计算，不用一个布尔值覆盖两种语义 |
| Agent Scope 覆盖 | Registry 支持按作用域分层注册 Provider；社区 Skill Hub 已使用 Agent 生命周期注册策略覆盖 | 可以作为首选适配方向，但必须实测所有目标来源与正文加载 |
| UI 扩展 | DSH Client Plugin 可通过 `settings.section` 等 Slot 注册页面 | 首版进入 DSH 设置页，不修改 Web UI 源码 |
| 持久化 | 标准 Web Profile 提供 `ctx.storageDomain`；领域写入可持久化并发出变更事件 | 用 DSH Storage Domain 保存声部、乐谱和合奏状态 |
| 不改写原文件 | 社区方案已展示基于 Provider 策略覆盖实现部分停用能力 | 作为织音硬性原则；但通用 Provider 正文转发尚需技术验证 |
| 兼容性 | DSH 仍处于 Developer Preview，接口持续演进 | 按实测版本声明兼容范围，不虚构长期稳定 API 承诺 |

### 2.5 开发前置技术验证（P0 Gate）

这是本项目最重要的工程风险，必须在完整 UI 开发前验证。

DSH 的 Provider 不只提供目录摘要，还负责 `get()` 时加载完整 Skill 正文。若织音仅通过同名 Provider 覆盖候选项的 `modelInvocable/userInvocable`，就可能同时遮蔽原 Provider 的正文加载能力。不能只证明“列表中隐藏了 Skill”，就认定整个方案成立。

必须完成以下验证：

1. 在 Agent Scope 中使用公开的 `ctx.skills.registerProvider` 建立策略层，能够按合奏状态控制技能可见性。
2. 覆盖项目级、用户级、本地文件、内嵌/运行时 Provider 至少各一个样本。
3. 对启用的 Skill，DSH 原有 `skill` 工具仍能按需加载正确正文及资源路径。
4. 对停用的 Skill，模型目录与用户命令入口的表现符合产品定义；不得出现“列表隐藏了但旧目录仍可调用”的状态残留。
5. 插件卸载、Agent 新建/销毁、Preset 切换、目录新增/删除、同名 Skill 优先级变化后，策略和缓存均能正确恢复。
6. 所有过程不改写原始 `SKILL.md`，不重命名 Skill 文件，不产生项目仓库脏改动。
7. Provider 观测不完整时保留安全状态，不得因为一次扫描失败把全部技能误停用或全部放开。

**通过条件：** 原生技能目录、正文加载、用户显式调用、热更新、插件卸载均通过自动化测试。若某类第三方 Provider 无法安全转发正文或策略，则首版明确标记为“只读/不受声部控制”，不得假装支持。不能为追求统一开关而破坏原有 Skill 能力。

---

# 3. 品牌与产品术语

## 3.1 品牌名称

**织音 · Zhiyin**

“织”代表把独立能力组织、交织成结构；“音”代表每种能力有自己的特征，组合之后形成协作。品牌隐喻既表达技能重叠，也表达组合后的整体能力。

建议英文产品描述：**Agent Skill Ensemble**。

建议中文副标题：**让技能自由编组，让能力彼此协奏。**

## 3.2 术语映射

为了让音乐隐喻在语义上准确、长期可扩展，正式产品术语采用“音符—声部—合奏—乐谱”四层结构。**不使用“音节”表示技能包**：音节属于语言语音结构，不适合表达一个由多项独立能力组成的工位集合。

| 实际对象 | 织音术语 | 解释 |
|---|---|---|
| 单个 Agent Skill | 音符 | 最小独立能力单元，对应 DSH 的一个 Skill |
| 一个技能包 / 工位 | 声部 | 一组共同承担某类工作职责的音符；一个声部对应一个工位 |
| 多个声部同时启用的状态 | 合奏 | 当前 Agent 可用技能由所有启用声部共同决定 |
| 保存的声部组合配置 | 乐谱 | 一套可命名、保存、复用的声部选择方案 |
| 多个声部共有的 Skill | 共享音符 | 同一个音符属于多个声部，不复制 Skill 本体 |
| 当前实际可用的 Skill 集合 | 生效音符 | 启用声部成员的去重并集，再叠加常驻音符 |
| 不属于任何声部的 Skill | 未编配音符 | 已发现，但尚未加入任何工位 |
| 不依赖声部启停的 Skill | 常驻音符 | 用户明确要求始终保持可用的 Skill |
| 一个声部包含的 Skill 清单 | 声部编制 | 声部与音符之间的成员关系 |
| 一个声部启用 | 启用声部 | 将该声部加入当前合奏 |
| 一个声部停用 | 停用声部 | 从当前合奏移除该声部，不直接关闭共享音符 |
| 将当前组合保存 | 记谱 / 保存乐谱 | 将当前启用声部集合保存为可复用配置 |

### 3.3 产品文案原则

- UI 主操作优先使用用户熟悉的词：技能、技能包、工位、启用、停用、搜索、保存。
- 品牌概念用于层级和状态命名：音符、声部、合奏、乐谱。
- 首次出现时采用双称呼，例如“声部（技能包/工位）”；熟悉后可简化为“声部”。
- 技术文档和代码中仍使用 Skill、Skill Pack、Score、Active Set、Union 等明确术语，不强迫开发者使用诗性表达。
- 不把所有普通按钮都改成音乐梗，避免学习成本和理解歧义。

---

# 4. 产品目标与非目标

## 4.1 目标（Goals）

**G1：按工位编组。** 用户可以创建有清楚职责的声部，一个声部容纳多个 Skill，覆盖该工位的常见工作流程，而非按单个操作或阶段过度拆分。

**G2：多对多重叠。** 同一个 Skill 可以加入多个声部，声部之间互不排斥。

**G3：多声部合奏。** 用户可以同时启用多个声部；系统实时计算所有启用声部的技能并集。

**G4：安全启停。** 停用声部只撤销它提供的成员关系；若某 Skill 仍被另一个启用声部或常驻设置引用，该 Skill 继续生效。

**G5：组合复用。** 用户可以把常见声部组合保存为乐谱，并在需要时快速应用。

**G6：可解释。** 用户能够看清一个 Skill 为什么生效、由哪些声部提供、停用某个声部会影响哪些 Skill。

**G7：尊重 DSH。** 使用 DSH 公开 Skill Registry、Provider、Agent Scope、Client Slot 和持久化机制；不修改 DSH 核心，不改写原始 Skill 文件。

## 4.2 非目标（Non-goals）

首版不负责：

- 安装、卸载、升级 DSH 插件或 MCP Server；织音管理的是 Agent Skills，不是 DSH 插件包。
- 编辑 Skill 正文、frontmatter、脚本、参考资料或资源文件。
- 建设完整 Skill 市场、GitHub 同步、跨 Agent 导入或内容审计平台。
- 自动调用 LLM 判断用户正在做什么并自动切换声部。
- 把每一个 Skill 都自动生成独立声部。
- 强制所有用户采用同一套预设工位；用户可以自由编配。
- 首版实现跨 DSH Profile 同步、云端账号同步或多人协作。

---

# 5. 核心对象与数据模型

## 5.1 音符（Skill）

音符是 DSH Registry 在当前 Agent Scope 中解析出的一个 Skill。织音不复制 Skill 本体，只保存它的引用和少量展示快照。

建议字段：

```ts
interface SkillRef {
  /** DSH Skill 的规范名称；在一个 Agent Scope 内是调用身份。 */
  name: string
  /** 最近观测到的来源，供 UI 解释和诊断；不作为跨 Scope 的唯一身份。 */
  source?: string
  provider?: string
  path?: string
  description?: string
  /** 最近观测到的原始策略，不等于织音计算后的策略。 */
  baseInvocation?: {
    modelInvocable: boolean
    userInvocable: boolean
  }
  lastSeenAt?: string
}
```

**身份规则：** Skill 的调用名称由 DSH 规范名称决定。来源、Provider 和路径用于展示与诊断，不作为另一个独立可调用 Skill。若多个来源存在同名 Skill，DSH Registry 的胜出规则决定 Agent 实际看到哪个；织音不得把同名副本伪装成两个可分别启停的音符。

同名来源变化时，声部成员仍按规范名称匹配，但应显示来源变化提示。Skill 暂时消失时，不自动清除声部成员关系，保留为“暂不可用/失联音符”；同名 Skill 恢复后自动重新匹配。

## 5.2 声部（VoicePart / Skill Pack）

声部是以工位/职责为边界的一组 Skill。

```ts
interface VoicePart {
  id: string
  name: string
  description: string
  /** 工作职责/工位说明，便于用户理解何时启用。 */
  workstation?: string
  /** 成员按 Skill 规范名称引用；允许同一名称出现在多个声部。 */
  skillNames: string[]
  order: number
  createdAt: string
  updatedAt: string
}
```

要求：

- 声部允许任意数量的成员，但默认建议拥有多个相互支撑的 Skill。
- 不以“至少多少个 Skill”强行阻止用户创建；如果只有一个成员，应提醒检查是否需要与其他工位合并。
- 同一声部内部不允许重复添加同一个 Skill 名称。
- 一个 Skill 可以属于任意多个声部。
- 声部本身不拥有 Skill 文件，不负责删除 Skill。
- 声部名称可改，声部 ID 稳定；改名不影响乐谱引用。

## 5.3 乐谱（Score）

乐谱是一个可复用的声部组合配置，不是新的 Skill 包。

```ts
interface Score {
  id: string
  name: string
  description?: string
  /** 本乐谱包含的声部 ID；组合时按并集计算。 */
  voicePartIds: string[]
  order: number
  createdAt: string
  updatedAt: string
}
```

例如：

- “全栈开发”：前端工程 + 后端工程 + 数据库 + 工程交付。
- “公众号视频”：公众号内容生产 + 视频制作 + 视觉设计。
- “项目维护”：工程维护 + 软件质量 + 文档交付。

乐谱保存的是声部 ID 列表。乐谱应用时，系统读取声部当前成员，因此后续调整声部成员后，乐谱会使用最新编制；应用前展示由此产生的技能变化。

## 5.4 当前合奏（Activation State）

```ts
interface EnsembleState {
  /** 当前启用的声部 ID，允许多个。 */
  activeVoicePartIds: string[]
  /** 用户明确标记为常驻的 Skill。 */
  alwaysOnSkillNames: string[]
  /** 当前状态修订号，用于并发写入检测与 UI 同步。 */
  revision: number
  updatedAt: string
}
```

V1 决策：当前合奏状态按 **DSH Profile** 持久化，在该 Profile 中的 Agent 共用默认声部组合。不同 Session 的独立合奏覆盖、工作区专属乐谱将在后续版本评估，不在首版暗中制造作用域差异。

## 5.5 数据持久化

- 使用 DSH `ctx.storageDomain` 的 Schema-validated Domain 存储。
- 建议逻辑表：`voice_parts`、`scores`、`ensemble_state`、`plugin_meta`。
- 数据保存在当前 DSH Profile 的持久化范围内，不写入 Session Event Log，不把声部配置注入模型上下文。
- 每次写入必须在持久化成功后才向 UI 返回成功；写入失败时 UI 保留原状态并给出错误。
- 数据结构包含 `schemaVersion`，为后续迁移留出空间。
- 不把浏览器 `localStorage` 作为唯一真相来源；它最多用于非关键 UI 偏好缓存。

---

# 6. 核心状态计算：并集是唯一真相

这是织音最重要、不可变更的业务规则。

## 6.1 集合定义

设：

- `S(p)`：声部 `p` 中包含的全部 Skill 名称集合。
- `A`：当前启用的声部集合。
- `R`：常驻音符集合。
- `E`：当前合奏最终生效的 Skill 集合。

则：

```text
E = R ∪ ( ⋃ S(p) ), p ∈ A
```

等价伪代码：

```ts
const effectiveSkills = new Set(alwaysOnSkillNames)
for (const partId of activeVoicePartIds) {
  for (const skillName of voiceParts[partId].skillNames) {
    effectiveSkills.add(skillName)
  }
}
```

所有集合按 Skill 规范名称去重。同一个音符即使被三个声部共同引用，在 Agent 的有效技能集合中也只出现一次。

## 6.2 引用计数

为解释音符为什么生效，系统为每个 Skill 计算：

```text
refCount(skill) = 常驻引用(0或1) + 启用声部中包含该 Skill 的声部数量
```

状态规则：

- `refCount > 0`：该 Skill 属于当前合奏。
- `refCount = 0`：该 Skill 不属于当前合奏。
- 同一个 Skill 的引用计数可以大于 1，但有效技能数量仍只计 1。

## 6.3 停用声部的正确行为

假设：

- 声部 A：React、UI Design、Git、Testing。
- 声部 B：Git、Testing、Python、Docs。

启用 A + B 时：

```text
E = { React, UI Design, Git, Testing, Python, Docs }
```

停用 A 后：

```text
E = { Git, Testing, Python, Docs }
```

React 和 UI Design 退出；Git 和 Testing 因为仍被 B 引用，必须继续生效。

**禁止实现为“关闭声部 A → 批量关闭 A 的全部 Skill”。** 必须先更新启用声部集合，再从全局状态重新计算并集，最后应用差异。

## 6.4 单个音符的手动操作

首版不提供绕过声部关系的独立“关闭”动作，以免 UI 状态与集合计算冲突。

用户可以：

- 把音符加入一个或多个声部；
- 从某个声部移除音符；
- 把音符设为常驻音符；
- 取消常驻状态。

如果音符目前由多个启用声部提供，用户从一个声部中移除它时，只有在其他启用声部和常驻集合都不再引用它时，它才会退出合奏。

## 6.5 原始调用策略与合奏策略

DSH 原始 Skill 策略和织音的可用状态必须分开。

建议逻辑：

```text
ensembleActive(skill) = skill.name ∈ E
finalModelInvocable(skill) = ensembleActive(skill) AND baseModelInvocable(skill)
finalUserInvocable(skill) = ensembleActive(skill) AND baseUserInvocable(skill)
```

解释：

- 声部启用不会强行打开源 Skill 原本禁止的模型或用户调用权限。
- 声部停用会撤销织音授予的可用性；如果该 Skill 仍被其他启用声部或常驻集合引用，则继续可用。
- DSH 原始 `disable-model-invocation` 与 `user-invocable` 策略继续生效。
- UI 必须区分“未加入当前合奏”“源 Skill 禁止模型调用”“源 Skill 禁止用户命令调用”等状态。

若技术验证证明 DSH 当前调用边界无法无损地同时管理两种策略，首版必须在 UI 明确公布实际支持的调用面，不得用一个“已启用”状态误导用户。

## 6.6 新 Skill 的默认策略

首次安装织音时不能擅自把用户原有全部 Skill 关闭。

推荐初始化步骤：

1. 首次进入时读取当前 Profile 的完整可见 Skill 快照。
2. 默认进入“兼容模式”：当前全部符合 DSH 原生调用策略的 Skill 保持可用。
3. 用户创建并确认第一套声部/乐谱后，显式启用“由织音管理当前合奏”。
4. 切换到编排模式时提供影响预览：哪些 Skill 将退出、哪些保持、哪些加入。
5. 在用户确认之前，不修改 Agent 当前可用技能范围。
6. 编排模式启用后，新发现且未加入任何声部的 Skill 默认不自动进入合奏，显示在“未编配音符”中；用户可以加入声部或设为常驻。

这能避免插件安装即破坏原工作流，也让用户明确知道控制权从何时开始交给织音。

---

# 7. 信息架构与界面设计

## 7.1 产品入口

首版入口：**DSH → Settings → 织音**。

通过 DSH 官方 Client Plugin / Slot 扩展机制注册独立设置页面。首版不要求改造 DSH 主侧栏或新增独立窗口。后续可以增加侧栏快捷入口，但不能因此拆成第二套 UI 状态。

## 7.2 页面结构

建议采用四个一级页面：

| 页面 | 主要任务 | 典型内容 |
|---|---|---|
| **合奏** | 查看和控制当前生效组合 | 启用声部、当前技能总数、共享音符、技能变化预览、有效技能清单 |
| **声部** | 按工位创建和维护技能包 | 声部卡片、工位职责、成员管理、共享成员提示、启停开关 |
| **音符** | 检索和编配单个 Skill | 全部技能清单、来源、原始调用策略、所属声部、未编配音符 |
| **乐谱** | 保存与复用组合 | 乐谱列表、包含声部、并集预览、应用、复制、重命名、删除 |

## 7.3 合奏页

合奏页是默认首页，必须一眼说明当前 Agent 正在使用哪套技能能力。

建议布局：

**顶部状态区**
- 当前模式：兼容模式 / 织音编排模式。
- 当前启用声部数量。
- 当前生效 Skill 数（去重后）。
- 共享音符数量。
- 未编配音符数量。
- 最近一次同步结果与更新时间。

**声部选择区**
- 使用多选开关或复选状态，而非单选按钮。
- 每个声部卡片显示名称、工位职责、成员总数、生效成员数、共享音符数。
- 每个声部独立启用/停用。
- 显示当前乐谱名称（如果当前状态与某份乐谱完全一致）。
- 用户可以从当前状态保存为新乐谱。

**生效音符区**
- 展示去重后的有效技能清单。
- 每个 Skill 显示由哪些启用声部提供，例如“Git · 前端工程 / 工程交付”。
- 共享音符显示共享标记，但只展示一次。
- 点击音符可以查看技能来源与原始调用策略。

## 7.4 声部页

声部卡片包含：

- 声部名称（例如“前端工程”）。
- 工位职责说明（例如“负责 Web UI 设计、实现、调试与质量检查”）。
- 成员数与共享音符数。
- 当前启用状态。
- 编辑、复制、删除操作。

编辑声部时：

- 可以搜索 Skill 并多选加入。
- 可以从已有音符库勾选成员。
- 显示该 Skill 已经属于哪些其他声部。
- 可拖动调整声部内排序；排序只影响展示，不改变并集逻辑。
- 保存时若声部当前启用，立即预览合奏变化，并在持久化成功后同步 Agent。

创建流程不应要求用户先设计音乐术语；使用“新建声部（技能包/工位）”解释。

## 7.5 音符页

提供：

- 按名称/描述搜索。
- 按来源、当前状态、所属声部过滤。
- 只看未编配音符。
- 只看共享音符。
- 显示原始 `modelInvocable` / `userInvocable` 状态。
- 快速将一个音符添加到一个或多个声部。
- 快速设为/取消常驻音符。
- 显示当前 DSH Registry 胜出的 Provider、Source 与可用路径信息（若平台提供）。

不支持独立管理的来源应展示“只读”原因，例如 Provider 无法安全覆盖或当前 Agent Scope 不可写。

## 7.6 乐谱页

每份乐谱卡片显示：

- 乐谱名称和描述。
- 包含的声部及其成员数量。
- 合并去重后的预计生效 Skill 数。
- 与当前合奏相比的新增、退出和保持数量。
- 应用、叠加、复制、编辑、删除。

**应用乐谱**默认采用替换语义：将 `activeVoicePartIds` 原子性替换为乐谱内的 `voicePartIds`，而不是悄悄叠加。若用户希望在当前合奏上追加，应显式选择“叠加到当前合奏”。两种操作必须在按钮文案中区分。

## 7.7 交互状态与反馈

- 声部开关是多选状态；多个声部可以同时亮起。
- 操作后先显示本地计算的变化预览，再由 Host 完成持久化与 Agent 同步。
- 同步未完成前显示“正在应用”，不能提前显示为最终成功。
- 同步失败时保留上一份成功生效的合奏，提供重试；不能出现 UI 显示新组合但 Agent 仍使用旧组合的静默不一致。
- 删除声部若被乐谱引用，列出受影响乐谱并要求确认。
- 删除 Skill 文件由外部管理；织音检测到 Skill 消失时保留声部引用并显示缺失状态。

---

# 8. 关键用户流程

## 8.1 首次安装与初始化

1. 用户安装织音并重启/加载 DSH Web Profile。
2. 织音读取当前 Agent Scope 的 Skill 快照，检查 `complete`。
3. 如果扫描不完整，展示警告和已读取内容，不将“暂时没读到”误判为“没有 Skill”。
4. 用户进入兼容模式，现有原生技能状态不改变。
5. 用户创建或导入自己的声部，检查成员和共享关系。
6. 用户选择启用织音编排模式。
7. 织音列出预计加入、退出、保持的 Skill，用户确认后应用。

## 8.2 创建声部

1. 用户点击“新建声部”。
2. 输入声部名称和工位职责。
3. 从音符库搜索并添加多个 Skill。
4. 同一 Skill 已属于其他声部时，显示“共享音符”提示，但不阻止再次添加。
5. 保存声部。
6. 用户可立即启用，也可以暂时保存为未启用状态。

## 8.3 启用多个声部

1. 用户在合奏页启用“前端工程”。
2. 系统计算前端声部成员的有效集合。
3. 用户继续启用“工程交付”。
4. 系统计算两个声部的去重并集，Git、Testing 等共享成员只计一次。
5. Agent 当前技能目录更新。
6. UI 展示最终有效 Skill 清单及每个 Skill 的来源声部。

## 8.4 停用包含共享音符的声部

1. 用户停用“前端工程”。
2. 系统将该声部从当前启用集合中移除。
3. 重新计算每个 Skill 的引用计数。
4. 仅停用后引用计数归零、且未设为常驻的 Skill 才退出合奏。
5. 仍由“工程交付”等声部引用的共享音符继续生效。
6. UI 展示实际退出和保留的 Skill。

## 8.5 保存和应用乐谱

1. 用户在合奏页设置好多个声部。
2. 点击“保存为乐谱”，输入名称和说明。
3. 乐谱保存当前启用声部 ID 列表。
4. 以后应用该乐谱时，系统先计算目标并集与当前合奏差异。
5. 用户确认后，系统原子更新合奏状态并同步 Agent。
6. 乐谱不保存 Skill 正文快照，声部变更后下一次应用使用最新成员。

## 8.6 Skill 被外部删除或更名

- 若 Skill 从 DSH 当前目录消失，对应音符标记为“暂不可用/失联”。
- 声部和乐谱中保留其名称引用，避免误删造成不可逆数据损失。
- 若相同规范名称重新出现，自动恢复匹配。
- 若 Skill 更名，按旧名称标记失联；不自动猜测新名称。用户可在音符页将成员引用替换为新 Skill。

---

# 9. 功能需求与优先级

优先级说明：P0 = 首版必须；P1 = 首版后可迭代；P2 = 远期增强。

| ID | 优先级 | 功能 | 需求说明 / 验收要点 |
|---|---|---|---|
| FR-001 | P0 | Skill 目录读取 | 通过 DSH Registry 读取当前 Agent Scope 的摘要；显示 `complete` 状态；不把不完整扫描当作完整目录 |
| FR-002 | P0 | 音符列表 | 显示 Skill 名称、描述、来源、Provider、原始调用策略；按 DSH 当前胜出项展示 |
| FR-003 | P0 | 创建声部 | 可以创建名称、职责描述和成员为空或非空的声部 |
| FR-004 | P0 | 编辑声部 | 修改名称、描述、成员和展示顺序；ID 稳定 |
| FR-005 | P0 | 删除声部 | 删除前检查启用状态和乐谱引用；不删除 Skill 本体 |
| FR-006 | P0 | 多对多成员关系 | 同一 Skill 可加入多个声部；同一声部内不允许重复成员 |
| FR-007 | P0 | 多声部同时启用 | 声部是独立布尔状态，不是互斥单选 |
| FR-008 | P0 | 并集计算 | 当前技能集合等于所有启用声部成员与常驻音符的去重并集 |
| FR-009 | P0 | 引用计数 | 显示共享音符由多少个启用声部提供；停用单个声部不得误关共享音符 |
| FR-010 | P0 | 停用声部 | 仅撤销该声部贡献；引用计数归零才从合奏退出 |
| FR-011 | P0 | 生效技能视图 | 展示去重后的当前有效 Skill，并能查看它由哪些声部提供 |
| FR-012 | P0 | 常驻音符 | 用户可将单个 Skill 固定为常驻；常驻 Skill 不受声部启停影响 |
| FR-013 | P0 | 乐谱 CRUD | 创建、查看、重命名、复制、删除乐谱；乐谱只引用声部 ID |
| FR-014 | P0 | 应用乐谱 | 默认替换当前声部集合；提供变化预览；持久化成功后再确认完成 |
| FR-015 | P0 | Skill 可用性同步 | 将合奏策略同步到 DSH Agent Scope；不改原始文件；通过 P0 技术门槛测试 |
| FR-016 | P0 | 初始化兼容模式 | 插件首次安装不改变现有技能状态；用户确认后才启用编排模式 |
| FR-017 | P0 | 实时变更同步 | DSH Skill 目录变化后重新快照；新增未编配技能不擅自进入合奏 |
| FR-018 | P0 | 状态持久化 | 声部、乐谱、启用声部集合、常驻音符在重启后保留 |
| FR-019 | P0 | 不完整状态保护 | Provider 失败或 `complete:false` 时保留上次成功状态，不进行破坏性批量停用 |
| FR-020 | P0 | 操作差异预览 | 应用声部变更、乐谱或删除声部时展示加入/退出/保持的 Skill 数量与名单 |
| FR-021 | P0 | 来源限制提示 | 无法由织音控制的 Skill 必须显示只读原因，并从可控状态统计中分开 |
| FR-022 | P1 | 声部模板 | 提供前端、后端、内容生产、工程维护等空白模板；不预置虚构 Skill 成员 |
| FR-023 | P1 | 乐谱叠加 | 在当前合奏上追加乐谱声部，不替换当前选择 |
| FR-024 | P1 | 声部导入导出 | 使用 JSON 导入导出声部与乐谱；导入时校验 Skill 名称和缺失成员 |
| FR-025 | P1 | 撤销最近操作 | 保存有限数量的合奏状态快照，允许一键还原误操作 |
| FR-026 | P1 | 工作区专属乐谱 | 支持按 DSH Workspace/CWD 选择不同默认乐谱；需要明确 Scope 和路径归属 |
| FR-027 | P1 | Session 独立合奏 | 不同会话可以独立启用不同声部；需要解决会话作用域与 Agent 生命周期关系 |
| FR-028 | P2 | 自动建议声部 | 基于 Skill 清单给出声部编配建议，但必须由用户确认，不自动覆盖既有编组 |
| FR-029 | P2 | 使用统计 | 统计各音符/声部实际调用次数和最近使用时间（依赖可靠的调用事件数据） |
| FR-030 | P2 | 分享与社区乐谱 | 分享声部结构和 Skill 引用，不捆绑或复制未经许可的 Skill 正文 |

---

# 10. 技术架构建议

## 10.1 插件形态

采用一个独立 DSH Bundle/插件包，内部拆分 Host 与 Client 两个职责面：

```text
zhiyin-plugin
├── Host
│   ├── Plugin entry / Cordis apply(ctx)
│   ├── Skill catalog adapter
│   ├── Ensemble policy service
│   ├── VoicePart / Score domain service
│   ├── Agent Scope lifecycle binding
│   └── Typert Remote endpoints
│
├── Client
│   ├── Settings section registration
│   ├── Ensemble page
│   ├── VoicePart editor
│   ├── Skill library
│   └── Score library
│
└── Shared
    ├── Domain types
    ├── Validation schemas
    ├── Union / reference-count logic
    └── Localization
```

插件应通过 `package.json` 的 DSH Bundle 元数据声明入口和客户端模块，不依赖修改 DSH 源码。首版目标是 Web Profile；其他 Profile 若无客户端界面，只能提供明确的无 UI 行为或不声明支持。

## 10.2 Host 侧服务

建议服务职责：

- `SkillCatalogService`：通过 `ctx.skills.snapshot/list` 按当前 CWD/Scope 获取 Skill 摘要，维护完整性状态。
- `EnsembleService`：计算并集、引用计数、差异预览，提供唯一的状态计算入口。
- `VoicePartService`：声部 CRUD 和成员关系维护。
- `ScoreService`：乐谱 CRUD、应用、叠加与引用检查。
- `SkillPolicyAdapter`：将计算出的生效集合映射到 DSH Skill Provider/Agent Scope 的调用策略。
- `AgentLifecycleAdapter`：跟踪 `agent/created` / `agent/disposed`，保证新 Agent 获得当前合奏策略，销毁时释放注册。

浏览器通过 DSH Typert Remote/公开远程服务接口访问 Host；不能直接访问 Node 文件系统或绕开 DSH 的信任边界。

## 10.3 Skill Policy Adapter

建议按以下顺序设计：

1. Agent 创建时读取该 Agent 的原生 Skill 快照（`cwd + scope`）。
2. 将原生摘要与 `baseInvocation` 记录为策略计算输入。
3. 根据当前合奏集合计算每个 Skill 的最终调用策略。
4. 在该 Agent 的适当 Scope 层注册/更新策略 Provider。
5. 对启用 Skill 保留原生加载路径与资源信息；对停用 Skill 按 DSH 的调用策略边界隐藏。
6. 当合奏变化时，原子更新该 Agent 的策略与 Registry 缓存。
7. Agent 销毁时释放该 Agent 对应 Provider 注册。

**重要：** 不得将“最近读取到的 Skill 摘要”误当作完整 Skill Provider。摘要和正文分别由 DSH Registry 提供，停用策略不得破坏其他可信消费者的 `ctx.skills.get()` 能力。如何在不修改 DSH 核心的条件下既覆盖可用策略、又保留全部 Provider 的 `get()` 行为，必须由 P0 技术验证确认。

若通用代理式 Provider 无法保留非文件型 Provider 的加载能力，首版按来源能力矩阵处理：

- 已通过策略覆盖与正文回归测试的来源：可控。
- 无法安全覆盖的来源：只读显示，不纳入可控技能集合；仍按 DSH 原生策略工作。
- 不允许通过删除、重命名原文件或覆盖内容来伪装成通用控制。

## 10.4 目录刷新与缓存

- 监听 `skills/change`，收到通知后按相关 Agent 的 `cwd + scope` 重新获取快照。
- 该事件不携带差异内容，必须重新读取 Registry，不得根据事件猜测新增或删除了哪些技能。
- 处理 `complete:false` 时采用 last-known-good 策略；保持上次成功合奏状态，提示目录暂不可完整观测。
- 自身 Provider 的注册/失效也可能产生 `skills/change`，必须防止事件循环和重复刷新。
- 对多个快速连续的文件变化做合并/去抖，但不能延迟到下一次重启才生效。
- 对正在执行的 Agent 请求，不承诺回溯改变已组装的当前模型请求；策略在下一次符合 DSH 刷新边界的模型步骤生效，并在 UI 标明同步完成时间。

## 10.5 持久化与并发

- 使用 `ctx.storageDomain` 定义版本化数据 Domain。
- `EnsembleService` 是唯一写入 `activeVoicePartIds` 的业务服务，所有 UI 操作都通过它。
- 声部成员变更、乐谱应用和合奏变更使用有序写入；必要时用 `revision` 做乐观并发校验。
- 持久化成功后再广播变更并更新前端视图。
- 插件卸载时释放 Remote、事件、Provider 和 Domain 资源。

## 10.6 兼容性策略

- 首版仅声明经过测试的 DSH Web Profile 版本范围。
- 对 DSH Developer Preview 的每次升级执行 Skill Provider 契约测试、Session Skill Catalog 测试、Client Slot 注册测试和存储迁移测试。
- 不绑定 DSH 内部文件路径、未公开的 Web 组件或私有 RPC。
- 对插件注册失败、Storage Domain 不可用、Client Slot 不存在等情况，显示诊断并安全降级。

---

# 11. 权限、安全与数据保护

1. **只管理，不拥有。** 织音只保存 Skill 名称引用、摘要快照、来源信息和成员关系，不复制 Skill 正文。
2. **不改原文件。** 不写入或改写 `SKILL.md` frontmatter，不重命名文件，不创建 `.disabled` 文件，不删除 Skill 目录。
3. **尊重来源策略。** `baseInvocation` 是原生策略；织音只计算是否由当前合奏提供可用性，不能擅自扩大原始权限。
4. **遵循 DSH API 信任边界。** Host 操作走 DSH 受保护的 Remote/API 通道；写操作由 Host 校验，不接受浏览器提交的任意文件路径或可执行内容。
5. **不把不完整数据当作完整数据。** `complete:false`、Provider 错误或超时不能触发清空、批量停用等破坏性操作。
6. **稳定身份。** 使用 Skill 规范名称作为调用身份；Provider、Source、Path 用于解释，不将它们当成可任意替换的权限标识。
7. **删除有边界。** 删除声部不会删除音符；删除乐谱不会改变当前合奏；删除当前启用声部必须先计算实际退出的 Skill 并确认。
8. **状态回滚。** 对每次合奏应用保留前后状态或有限历史，失败时恢复最近一次成功状态。

---

# 12. 非功能需求

| 类别 | 要求 |
|---|---|
| 正确性 | 并集、去重、引用计数和停用逻辑必须是纯函数并有独立单元测试 |
| 实时性 | 声部开关和乐谱应用不需要重启 DSH；在 Host 成功应用策略后 UI 更新完成态 |
| 性能 | 不在每次页面渲染时扫描磁盘；使用 Registry Snapshot 与事件失效机制；不预加载 Skill 正文 |
| 稳定性 | Agent 新建/销毁、Provider 变化、Profile 重启和插件卸载均不会遗留策略注册 |
| 可解释性 | 任一有效 Skill 都可以追溯到一个或多个启用声部或常驻音符 |
| 可恢复性 | 持久化失败和策略应用失败均保留上一成功合奏状态 |
| 可访问性 | 开关有明确状态文字，键盘可操作，不仅依赖颜色区分启停 |
| 响应式 | 设置页适配窄屏与桌面宽屏；声部列表、成员管理和差异预览不出现页面横向溢出 |
| 国际化 | 首版至少支持中文；代码结构保留英文 locale 扩展能力 |
| 可维护性 | DSH 适配层与集合业务逻辑分离，未来换 DSH API 时不重写并集和数据模型 |

---

# 13. 验收标准

## 13.1 集合逻辑测试

必须覆盖以下用例：

| 场景 | 输入 | 预期结果 |
|---|---|---|
| 单声部启用 | A={a,b,c}；启用 A | 生效集合 `{a,b,c}` |
| 双声部无重叠 | A={a,b}，B={c,d}；启用 A+B | 生效集合 `{a,b,c,d}` |
| 双声部有重叠 | A={a,b,c}，B={b,c,d}；启用 A+B | 生效集合 `{a,b,c,d}`，b/c 各只出现一次 |
| 停用一个有重叠的声部 | A={a,b,c}，B={b,c,d}；停用 A，B 仍启用 | 生效集合 `{b,c,d}`，a 退出，b/c/d 保留 |
| 停用最后一个引用 | A={a,b}；停用 A；无其他声部/常驻 | a/b 均退出 |
| 常驻音符 | A={a,b}，R={c}；停用 A | 生效集合 `{c}` |
| 从一个声部移除共享音符 | A、B 都包含 b，且 A/B 均启用；从 A 移除 b | b 仍生效，因为 B 仍引用 |
| 应用乐谱替换 | 当前启用 A+B；乐谱包含 B+C | 最终启用集合精确为 B+C |
| 应用乐谱叠加 | 当前启用 A；叠加乐谱 B+C | 最终启用集合 A+B+C |
| Skill 暂时消失 | 声部引用 a，当前快照不含 a | a 显示缺失，成员关系不删除；其他技能状态不受影响 |

## 13.2 DSH 集成测试

- 当前合奏启用的 Skill 能出现在目标 Agent 可见范围内。
- 当前合奏停用的 Skill 不应继续通过织音未处理的路径进入受控调用目录。
- 同一个 Skill 在多个声部出现，不会生成重复 Skill 名称或重复正文加载项。
- Skill 正文仍由原始 Provider 正确按需加载，资源相对路径保持有效。
- DSH 原生 `modelInvocable` / `userInvocable` 限制继续生效。
- 新 Agent 创建后自动继承当前合奏；Agent 销毁后无遗留注册。
- 运行中新增/删除 Skill 后，目录更新且不会误清空合奏。
- 插件卸载后，DSH 恢复原有 Skill Provider 行为；不残留策略覆盖。
- 重启 DSH 后声部、乐谱、当前合奏和常驻音符均恢复。

## 13.3 UI 验收

- 能明确看出多个声部可以同时启用。
- 同一个音符属于多个声部时，UI 展示共享关系，不重复计入生效数量。
- 停用共享声部时，预览能正确区分退出与保留的音符。
- 乐谱应用默认是替换，并提供差异预览；叠加必须是独立明确动作。
- `complete:false` 或同步失败时，页面显示警告，不将错误状态当作成功。
- 从声部页面能够追溯音符所属的所有其他声部。
- 删除声部不会删除任何 Skill 文件。

---

# 14. 里程碑与开发顺序

## M0：技术验证（必须先做）

交付：最小 DSH 插件原型与自动化测试。

- 验证 Web Plugin / Client Slot 的安装和加载。
- 验证 `ctx.skills.snapshot` 与 Agent Scope provider 注册。
- 验证策略覆盖不会破坏 Skill 正文加载和相对资源加载。
- 验证两个 Agent 生命周期、Skill 目录热更新和插件卸载。
- 验证 `ctx.storageDomain` 可用于持久化测试数据。

**M0 未通过，不进入完整 UI 开发。**

## M1：数据模型与集合引擎

交付：无 UI 的集合服务与单元测试。

- 声部、音符引用、乐谱、合奏状态数据结构。
- 并集、去重、引用计数、差异预览。
- 持久化 Domain 与迁移版本。
- 状态并发控制与失败回滚。

## M2：织音核心 UI

交付：可用的 Settings 页面。

- 合奏页。
- 声部 CRUD 与成员编辑。
- 音符目录与未编配列表。
- 共享音符和来源状态展示。

## M3：乐谱与完整同步

交付：可日常使用的第一个版本。

- 乐谱 CRUD、替换应用、叠加应用。
- DSH Agent Scope 实时策略同步。
- 初始化兼容模式与转换预览。
- 技能目录变化、Provider 不完整观测和失败恢复。

## M4：增强功能

根据实际使用反馈决定：

- 工作区/Session 级独立合奏。
- 声部模板。
- 导入导出。
- 使用统计。
- 自动编配建议。
- 分享乐谱。

---

# 15. 风险与待决事项

| 风险 / 待决事项 | 影响 | 处理方式 |
|---|---|---|
| Agent Scope Provider 覆盖同时需要保留原 Provider 的 `get()` | 可能影响 Skill 正文和资源加载，是最高风险 | M0 做独立技术验证；未通过的来源标记只读 |
| DSH Developer Preview 接口变化 | 插件兼容性可能破坏 | 隔离 Adapter、版本矩阵、升级契约测试 |
| 不同 Workspace 的 Skill 集合不同 | 同一声部在不同 Workspace 可能有缺失音符 | 按当前 Agent Scope 观测并显示缺失；工作区专属乐谱放入 P1 |
| 同名 Skill 来源切换 | 成员引用可能指向 DSH 当前胜出的不同来源 | 以规范 Skill 名为调用身份；显示来源变更并保留成员引用 |
| 第三方 Provider 的正文与策略代理能力不一致 | 不能无损统一控制所有来源 | 做来源能力矩阵；不支持的来源只读，不修改原始内容 |
| 声部编辑时当前合奏正在运行 | Skill 集合在请求边界更新，可能产生短暂状态差异 | 原子持久化、同步状态和生效时间展示；不承诺回溯已组装请求 |
| 用户误以为应用乐谱是叠加 | 可能意外停用已有声部 | 默认替换并预览；叠加必须单独命名与确认 |
| Skill 扫描不完整 | 错误地把缺失项视为应停用 | 只有完整快照才能进行破坏性策略更新 |

## 15.1 首版必须遵守的产品决策

1. **声部不是互斥角色。** 多个声部可同时启用。
2. **共享音符不是重复 Skill。** 成员关系可以多次出现，但生效 Skill 只出现一次。
3. **停用声部不能批量关闭成员。** 必须重算整个并集。
4. **乐谱是组合配置。** 默认应用为替换；叠加作为明确的另一种动作。
5. **Skill 本体不归织音所有。** 不复制、不改写、不删除原始 Skill 文件。
6. **原始调用策略不可被悄悄放宽。** 织音的激活与 DSH 原生权限取交集。
7. **首次安装不改变现有 Agent 状态。** 必须由用户显式启用编排模式。
8. **无法安全控制的 Provider 不伪装成受控。** 显示只读能力边界。

---

# 16. 一句话产品说明

**织音是一款 DSH Agent 技能编排插件：把独立 Skill 编成面向不同工位的声部，让多个声部自由组合、共享音符，并通过去重并集快速构建 Agent 当前所需的能力体系。**

---

# 附录 A：推荐界面用语

| 场景 | 推荐文案 |
|---|---|
| 页面标题 | 织音 |
| 页面副标题 | 让技能自由编组，让能力彼此协奏。 |
| 单 Skill 列表 | 音符库 / 全部技能 |
| 创建技能包 | 新建声部（技能包/工位） |
| 当前已启用包 | 当前合奏 |
| 技能包成员 | 声部编制 |
| 多组共享 Skill | 共享音符 |
| 未分组 Skill | 未编配音符 |
| 永久启用 Skill | 常驻音符 |
| 保存当前组合 | 保存为乐谱 |
| 应用预设组合 | 应用乐谱 |
| 在当前组合上叠加 | 叠加到当前合奏 |
| 当前有效 Skill | 生效音符 / 当前可用技能 |
| 禁用分组 | 停用声部 |
| 启用分组 | 启用声部 |
| Skill 失联 | 暂不可用 |
| 扫描不完整 | 技能目录暂未完整读取 |
| 变更预览 | 合奏变化预览 |

# 附录 B：调研来源

以下资料用于确认 DSH 平台能力及社区现有实现。官方仓库和文档是接口事实的首要依据；社区插件仅用于比较已有产品做法，不能代替官方 API 契约。

## DSH 官方资料

1. DeepSeek Harness 官方仓库与 Developer Preview 声明：<https://github.com/deepseek-ai/deepseek-harness>
2. DSH 架构：<https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md>
3. Skill 子系统：<https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md>
4. Skill Registry 包：<https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/skill/skill/README.md>
5. 本地 Skill Provider：<https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/skill/skill-filesystem/README.md>
6. 模型 Skill Loader：<https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/skill/tool-skill/README.md>
7. Storage Domain：<https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/storage/storage-domain/README.md>
8. Client Settings Slot：<https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-settings/README.md>

## 社区实现

1. dsh-skill-panel：<https://github.com/nianchen8/dsh-skill-panel>
2. dsh-skill-hub：<https://github.com/cheshireez/dsh-skill-hub>
3. dsh-skill-manager：<https://github.com/thomas-key/dsh-skill-manager>
4. dsh-skills-manager：<https://github.com/ctl456/dsh-skills-manager>

---

**文档状态：** 需求基线草案。产品模型、术语、集合规则与核心功能边界已形成；正式进入完整实现前，必须先通过 M0 的 DSH Skill Provider 策略覆盖与正文加载技术验证。
