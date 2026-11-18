---
title: Decision Log
type: decision-log
project: dsh-skills-zhiyin
updated: 2026-11-17
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
