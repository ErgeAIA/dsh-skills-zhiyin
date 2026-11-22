---
title: Decision Log
type: decision-log
project: dsh-skills-zhiyin
updated: 2026-11-22
priority: higher-than-prd
description: >
  开发过程决策日志，优先级高于 PRD；冲突时以本文件最新条目为准（PRD/ADR 由用户自行同步，本技能不代改）。
  只追加，不删除或改写历史。AI 在本文件新增或修改任何条目后，必须同步更新 frontmatter 的 updated 字段为当日日期（YYYY-MM-DD）。
---

# Decision Log

> 偏离 PRD 或做出重要技术选择时在此追加记录。只追加，不删除或改写历史。
> **优先级高于 PRD**：冲突时以本文件最新决策为准；PRD/ADR 由用户自行同步，本技能不代改。
> 格式：`## DEC-NNN: 标题`，新条目置顶，NNN 三位递增。
> 字段：`- **日期**：` / `- **背景**：` / `- **决策**：` / `- **验证**：`

## DEC-016: banner 定稿用「散点汇聚」，并补齐 logo 与点缀

- **日期**：2026-11-22
- **背景**：v1（三条织线 → 声波）与名字结合紧，但第一次看仓库的人读不懂「三层开关」。用户看 v2 后定为门面版，并要求加入音符与技能元素的点缀，以及一个正式 logo。
- **决策**：
  1. **banner 定稿 = v2（散点汇聚）**：32 个技能条 → 4 个技能包卡（卡内三条成员细杠）→ 一张带声波的成品卡；标题改中文衬线「织音」（Noto Serif SC 900），英文由 captionEn 承担。
  2. **v1 不删**，移到 `docs/assets/banner-threads.svg` 存档，留给宣传图（朋友圈/公众号主图）用。
  3. **点缀分三级**：左右留白放 opacity 0.09 的水印音符；散点簇左侧放技能层叠图标（0.15）；成品卡上下放三枚音符（0.45–0.9）表示声波升起。点缀不得压字、不得越出内容界。
  4. **logo 两件套**：`icon.svg`（方形徽标，音符 + 双谱线）作插件图标；`assets/logo.svg`（深色底板横版徽标：标记 + 织音 + ZHIYIN + 一句 tagline）供文档与市场展示。
- **取舍**：
  - 徽标自带深色底板——纯透明字标在 GitHub 浅色主题下会消失，加底板才能两边都成立；代价是它更像「徽章」而非纯字标。
  - 小尺寸下谱线会糊：图标最终去掉谱线，只留加粗音符（head rx 11.5 / stem 6），32px 仍可辨。
  - 点缀用了 #c23e12 / #8a4a2e / #5a4038，均在强调色族内，未引入第二色相。
- **验证**：banner 9.9KB、logo 1.3KB、icon 555B，均通过 viewBox / 顶带 / L 形标记 / 网格 opacity / 无 script 与外链图自检；Puppeteer 渲染逐一目视（含 32px 图标）；npm pack = 14 文件。

## DEC-015: 品牌名要靠文案讲清，banner 用「织线→声部」承载

- **日期**：2026-11-22
- **背景**：用户指出「描述里面要将『织音』这个名称的含义表达出来」。此前所有文案都只把织音当产品名用，没人解释「织」与「音」指什么；README、package.json、GitHub Description 三处描述互相不一致，且 package.json 的描述还残留「冲突」这种已移除的功能。
- **决策**：
  1. 统一口径：**织 = 把散落的技能编成一支谱；音 = 模型此刻奏响的那一支**。技能是乐器、技能包是声部、模型读到的目录是乐章。
  2. 三处描述同步改写（README 首段 + package.json description + GitHub 仓库 Description），README 中英各加一段「名字是什么意思」。
  3. Banner 用同一隐喻做右侧图形：三条横线＝三层开关（全部技能／技能包／单个技能），线上技能块自上而下变少，第三层收束成声波，末端强调色圆点。走 tuhua 的 ④ 定制优先，不套通用卡片积木。
- **取舍**：custom-threads 脱离 tuhua 既有图元库，后续换尺寸需重画；换来的是图形与名字同源，删图即失义。
- **验证**：banner.svg 4.9KB、viewBox 1200×400、顶带与 L 形标记齐备、网格 opacity 0.035、无 script/foreignObject/外链图；Puppeteer 渲染截图确认无压字越界；npm pack --dry-run = 13 文件（含 assets）。

## DEC-014: 用户指南并入 README，插件页只读其中标记段

- **日期**：2026-11-22
- **背景**：DEC-013 把指南做成独立的 GUIDE.md / GUIDE.en.md，README 只给一句导航。用户提出：README 是 GitHub 落地页，把用法直接放进去更好，读者不用再点一层。
- **决策**：合并。README.md / README.en.md 的「使用」段承载完整操作说明（装技能、目录选择、三层开关、技能包互斥、归档恢复、目录字符数、备份、常见问题），删除独立的 GUIDE 两份文件。插件页的指南弹窗改读 README，只取 `<!-- guide:start -->` 与 `<!-- guide:end -->` 之间的内容——已装插件的人不需要看到「npm install / npm pack」这类开发者步骤。
- **为什么用标记而不是另存一份精简版**：指南正文必须单一来源，抄第二份必然漂移。标记在 GitHub 渲染时不可见，对读者零影响；标记缺失时宿主退化为返回整篇 README。
- **代价**：README 变长约一倍（中文 4.5k 字符）；宿主依赖两个 HTML 注释作为约定，误删会退化成整篇。
- **验证**：npm pack --dry-run = 11 文件；假 ctx 24 条路由，/zhiyin/guide 200 且只返回标记段（zh 2766 / en 5867 字符）；渲染器对两段各产出 39 / 38 个块（10 标题、4 表格、4 列表）；README 内相对链接 0 断链。

## DEC-013: 插件包放仓库根，README 只写项目说明，指南进插件页

- **日期**：2026-11-22
- **背景**：用户指出三件事：① README 里写了「开发期私有仓库」「界面中英双语」「分发口径」这类与用户的约定，这些不该出现在项目说明里；② 仓库要能在 GitHub 上正常下载到「插件本身」，而现在插件在 prototype/ 子目录，下载后还得 cd 进去，且 prototype（原型）这个名字与实际不符；③ 使用指南只在仓库里，插件页里看不见。
- **决策**：
  1. **插件包移到仓库根目录**。GitHub clone / Download ZIP 得到的就是可装插件，目录名不再是「原型」。开发文档仍放 docs/，由 .gitattributes 的 export-ignore 排除在下载包外；npm 包内容仍由 package.json 的 files 决定。
  2. **README 只写项目说明**：定位、功能、安装、使用入口、写盘边界、已知限制、开发命令。内部协作约定、分发口径、进度叙事一律写 docs/agents/，不进 README。
  3. **GUIDE 进插件页**：宿主新增只读路由读取随包分发的 GUIDE.md / GUIDE.en.md，页面用轻量 Markdown 渲染器在弹窗里显示。指南正文保持单一来源（md 文件），不在代码里复制。
- **代价**：仓库根目录同时承载插件与契约文件，需要靠 .gitattributes 维持下载干净；渲染器只覆盖指南用到的 Markdown 子集，新增文档结构时要同步扩渲染器。
- **验证**：npm pack --dry-run = 13 文件零文档；假 ctx 24 条路由且 /zhiyin/guide 200；渲染器对两份指南输出 50/49 块、表格列数正确。

## DEC-011: 界面只呈现用户概念，内部机制不上界面

- **日期**：2026-11-22
- **背景**：界面残留 v1 概念（合奏/组合/排除/常驻/生效面矩阵）与实现术语（观测、投影、策略 provider、接管）。
- **决策**：界面只保留用户能操作的概念（技能、技能包、开关、归档、成本）。删除三类内容：
  1. 已被 v2 移除的功能所对应的文案与代码（合奏、组合、排除、常驻、冲突声明、生效面矩阵）；
  2. 纯内部机制的状态指示（「接管／未接管」徽标 —— 用户无从操作，开关本身已给反馈）；
  3. 实现行话（观测→读取、投影→删除、重新观测→刷新）。
- **代价**：诊断信息减少；需要时靠 events.ndjson 与 /zhiyin/probe 查，不在界面堆。
- **验证**：死文案扫描（词典 key 在文件中出现次数为 0）删 176 条；node --check 通过；假 ctx 冒烟 4 个 slot 注册不变。

## DEC-012: 用户文档随包分发，且中英双语

- **日期**：2026-11-22
- **背景**：用户需要「装技能／建包／归档恢复」的简要指南；README 大量过时且只有中文；仓库开发期私有、发布时转公开。
- **决策**：
  1. 新增 `prototype/GUIDE.md` 与 `GUIDE.en.md`，写进 `files` 白名单随包分发 —— 装完插件的人能看到指南；
  2. 根 README 走 `shuxu` 优化模式重写为双语（README.md 中文主 + README.en.md 英文平行，互链），并替换 `prototype/README.md`（原为废弃的 M0 实验说明，却会随包分发）；
  3. 面板内不内置长文档，避免与代码漂移；需要时再考虑。
- **验证**：`npm pack --dry-run` = 13 文件（含两份 GUIDE 与两份包 README）；6 份 Markdown 共 22 条相对链接 0 断链。

## DEC-009: 织音采用「双入口」，设置页与左侧竖栏并存

- **日期**：2026-11-22
- **背景**：DSH 支持第三方插件注册 `main`（整页）与 `sidebar.panellist`（左侧竖栏一行）。参考实现是官方「插件」页（`PANEL_ID='plugins'` 同时注册两者）与社区 dshmarket（另有可开关的侧栏行 + `layout.selectPanel` 跳转）。
- **决策**：采用方案 A —— 保留设置页 `settings.section`（传统做法、老用户习惯），同时新增整页 `main(key='zhiyin')` 与竖栏行 `sidebar.panellist(id='zhiyin', order=10)`。不做「最后一扇门」开关逻辑（方案 C 留待后续需要时再上）。
- **代价**：两个入口语义重复，用户可能不知道哪个是「正门」；可通过两边渲染同一个 Page 组件保证内容一致来缓解。
- **验证**：假 window/假 ctx 冒烟确认 4 个 slot 注册成功；待用户重启后在真实宿主验收左侧竖栏与整页渲染。

## DEC-010: 分发白名单双轨 —— npm 用 files，源码归档用 gitattributes

- **日期**：2026-11-22
- **背景**：要求「开发文档不随插件分发，用户下载到的是干净可用的插件」。曾考虑把 docs/ 加进 .gitignore。
- **决策**：不使用 .gitignore 达到该目的（它只对未跟踪文件生效，对已跟踪的 docs/ 无效；真要生效必须 `git rm --cached`，会丢掉文档的版本历史，而会话开工依赖 docs/agents）。改为双轨：
  1. **npm 包**：`prototype/package.json` 的 `files` 白名单（实测 `npm pack --dry-run` = 10 文件、0 文档）。
  2. **源码归档**：新增 `.gitattributes`，对 `/docs`、`/AGENTS.md`、`/PRODUCT.md`、`/CHANGELOG.md`、`/README.md`、`/.gitignore`、`/.gitattributes` 等加 `export-ignore`（实测 `git archive HEAD` 只剩 `prototype/`）。
- **验证**：两条实测结果如上；文档因此既保留 git 历史，又不会出现在任何下载产物里。

## DEC-008: 目录预算撤下阈值，只展示成本

- **日期**：2026-11-21
- **背景**：设置页展示「目录字符数已超出预算 25555 / 8000」的红条。8000 是早期按 PRD §6.8 自定的默认值，并无依据；新用户看到红色告警会以为出了问题。用户要求：只展示成本，阈值必须先调研社区/官方依据，不能凭感觉定。
- **决策**：撤下 8000 预算与超限告警，界面只展示目录字符数（成本估算公式不变：可见技能描述截断 500 之和 + 200 框架开销）。调研结论（2026-11-21）：① Agent Skills 官方规范：单条 description ≤ 1024 字符（API 拒绝超限）、name ≤ 64 字符；② Claude Code（2026）路由清单把 description + when_to_use 合并截到约 1536 字符（v2.1.105 起），全部已装技能的目录总量参考 ≈ 上下文窗口的 1%，超预算按 LRU 丢弃描述而非截断（v2.1.129+）；③ 单条描述写作目标 400–1000 字符。中文约 1 字符 1 token，「1% 上下文」折算的字符数与英文差异大，因此不做固定字符阈值。待核实：DSH 自身对目录的注入行为与上限。
  来源：https://platform.claude.com/docs/zh-CN/build-with-claude/skills-guide （请求限制）；https://github.com/josiahsiegel/claude-plugin-marketplace/blob/main/plugins/plugin-master/skills/triggering-reliability/references/severity-and-limits.md （Claude Code 2026 三层上限）。
- **验证**：client 移除 pct/进度条/告警与 budgetOf/alertBudget 文案及遗留 bar/barFill/budget 样式；host 移除 BUDGET_CHARS 与 budgetChars 字段；node --check 双半边 exit 0；budgetChars/alertBudget/budgetOf 残留引用扫描为 0。

## DEC-006: 文档收敛到 docs/ 子目录

- **日期**：2026-11-17
- **背景**：用户指出根目录文件散落（PRD 两个版本、ADR、UI 决议、HANDOVER 全在根），要求整理。
- **决策**：根目录只留 AGENTS.md、README.md、CHANGELOG.md、.gitignore 与 docs/、prototype/。PRD 进 docs/prd/，ADR 进 docs/adr/，UI 决议进 docs/design/，交接进 docs/handoff/ 并改用 handoff-YYYY-MM-DD-*.md 命名（HANDOVER.md → handoff-2026-11-17-m0-skills-provider.md）。
- **验证**：根目录条目已核（六个非隐藏项）；AGENTS.md、README.md、prototype/README.md 内的旧路径引用全部改到新位置，git 已跟踪前无破链。

## DEC-005: 定位澄清——技能管理插件，安装卸载会写盘

- **日期**：2026-11-17
- **背景**：原 AGENTS.md 首行写“只读用户技能目录，禁止改写、重命名或删除任何 SKILL.md 与技能目录”，与产品定位冲突：织音就是技能管理插件，要能做安装与卸载。
- **决策**：定位改为“技能管理插件，管安装、卸载、启停与技能包编组”。写盘边界三处：安装新建技能目录、卸载移入归档目录（不直接删除）、自身状态文件。启停与观测仍不碰技能文件；安装前先确认目标根、同名冲突先问用户。开发期版本锁定 0.1.0。
- **验证**：AGENTS.md Permissions 与 Conventions、README 定位段与已知限制段同步改写；agents-changelog.md 已留痕。

## DEC-006: 安装/卸载的写盘边界

- **日期**：2026-11-18
- **背景**：用户要求「安装卸载当然要写盘」，但同时定了红线：不重写、不删除技能文件。
- **决策**：安装 = 把源文件夹复制到目标根下一个新目录（源必须含 SKILL.md，同名直接 409 不覆盖，目标根默认 ~/.dsh/skills，可切到在跑 Agent 的 <cwd>/.dsh/skills）。卸载 = rename 进 <profile>/zhiyin-proto/archive/<ISO 时间戳>-<name>，不删除任何内容，可手工搬回。两者都只能由页面上的显式按钮触发，不参与启停与轮询。
- **验证**：临时目录冒烟——install 200 且 SKILL.md 到位、重复 install 409、uninstall 移入 archive 且源目录消失、坏路径 404。

## DEC-005: 技能包状态形状与写路由

- **日期**：2026-11-18
- **背景**：技能包是启用单位，需要能被新建、改名、复制、删除、整组开关、编辑成员，且成员可跨来源（user-dsh / user-agents / custom）。
- **决策**：状态存 `state.packs = [{ id, name, enabled, members: [name], order }]`，`id` 用时间戳+随机后缀，不随改名变化；所有写操作走一条 `POST /zhiyin/pack`，用 `action` 区分（create/rename/toggle/copy/delete/members/reorder）。成员只存技能名，不存路径，改名或换源不影响；一个技能可同时属于多个包（多对多），任一所属包启用即视为可用。
- **验证**：假 ctx 冒烟跑通七个动作与 state 回读；hiddenReason 六条规则（包关/包开/包开+手动停用/allOff 压过包/two packs one on/不在包）全部通过。

## DEC-004: 停用改用「按 Agent 注册策略 provider」

- **日期**：2026-11-17（源自 ZhiYin-M0-ADR.md 与 HANDOVER.md，初始化时从既有文档迁入）
- **背景**：DSH 的技能消费者是预设级装配（dsh-web-app/presets/standard.patch.yml 挂 tool-skill），全局同名工具在实测中始终 visible:false，赢不过更近层；替换预设的新预设也不出现在下拉里。
- **决策**：不改预设、不替换消费者、不改技能文件。对每个在跑的 Agent，用 agent.ctx.get('skills').registerProvider 在它最近的层注册策略 provider，只列被停用的同名候选并把 modelInvocable 与 userInvocable 双置 false；启用项不列，落回原生 provider。
- **验证**：假 ctx 端到端通过（路由、provider 注册、影子候选、目录字符数、规则矩阵 8 条）；真机待重启后核实。

## DEC-003: 停用语义 = 完全不可见

- **日期**：2026-11-17（用户裁决，初始化时从 HANDOVER.md 迁入）
- **背景**：用户要求停用后「模型看不到 + / 菜单也没有」。
- **决策**：停用项不进模型目录、skill 工具拒绝、斜杠菜单不出现；不做「仍在目录里但标注停用」的折中。
- **验证**：以模型侧目录快照与 / 菜单是否存在该名为准。

## DEC-002: 技能包 = 启用单位，多包并集

- **日期**：2026-11-17（用户裁决，初始化时从 HANDOVER.md 迁入）
- **背景**：AI Vault 用技能包组织技能，包是批量开关的载体。
- **决策**：一个技能可属多包；包启用即成员启用，任一所属包启用则技能启用；不在任何包的技能由手动停用集合决定。状态形状 packs:[{id,name,enabled,members}]。
- **验证**：规则矩阵覆盖「包关/包开/包开+手动停用/两包其中一开」四种组合。

## DEC-001: 安装/卸载要写盘

- **日期**：2026-11-17（用户裁决，初始化时从 HANDOVER.md 迁入）
- **背景**：用户回复「当然要写盘，不写如何安装」。
- **决策**：安装写入 ~/.dsh/skills 或 <项目>/.dsh/skills；卸载移入归档目录而非直接删除。待确认：这里的「安装/卸载」指技能还是 DSH 插件本身。
- **验证**：安装后技能出现在原生目录快照；卸载后原目录不留残件且归档可恢复。

## DEC-007: 设置页改版以 dsh-market 市场页为参考；技能包保留独立开关

- 参考对象：`dsh-market`（v1.73.21）设置页——五层骨架（页头／元信息条／带计数标签页／折叠告警／工具条+卡片），单实心主按钮，计数挂标签，告警先于内容，卡片五行固定结构。详见 `docs/design/ZhiYin-UI-市场页参考.md`。
- 采纳：三态徽标由成员派生显示、成员集合剪幽灵名并去重、包名 1–40 字符规则、删除清理孤立项、搜索防抖、排序偏好存 localStorage。
- 不采纳：其「分组不存开关、整组开关=纯批量动作」的模型。织音**技能包保留独立开关**。
- 语义确认：并集 = 各启用包成员名单去重后的集合，决定 Agent 可调用技能；技能属于多个包时，最后一个启用的包关闭才真正停用。该实现细节不向用户解释，只在 README 说明效果。
