---
title: AGENTS.md Changelog
type: agents-changelog
project: dsh-skills-zhiyin
updated: 2026-11-22
description: >
  AGENTS.md 的变更记录，AGENTS.md 每改动一次就追加一行，不随日常开发更新。
  只追加，不删除或改写历史。AI 在本文件新增或修改任何条目后，必须同步更新 frontmatter 的 updated 字段为当日日期（YYYY-MM-DD）。
---

# AGENTS.md Changelog

> **AGENTS.md 每改动一次，必须在此追加一行**；无对应记录即视为静默丢失。
> 模式：<全新初始化 | 半程合成 | 已初始化优化>
> 来源文件：<本次处置的旧 AGENTS.md / CLAUDE.md 路径；全新初始化写「无」>
> 格式：一行一条 `<旧值> → keep|update|drop|merge → <新值/去处/原因>`
> 全新初始化无旧约定可处置时，写一行 `<无旧约定> → 全新初始化 → 直建当前 AGENTS.md`

---

- 模式：半程合成；来源文件：无（项目根无 AGENTS.md、无 CLAUDE.md，故无迁移，无 CLAUDE.md 删除动作）
- <无既有契约文件> → 半程合成 → 直建当前 AGENTS.md
- <HANDOVER.md 红线「不改写/重命名/删除技能文件」> → keep → Permissions IMPORTANT 首行
- <HANDOVER.md 禁区「不改预设/不换消费者/不退役 catalog（会注入无技能可用）」> → keep → Permissions 三条禁止
- <HANDOVER.md 平台事实「停用走按 Agent 注册 provider；vendor 无 Typert，同源 HTTP 路由」> → relocate → AGENTS.md Conventions（作为约束行），过程叙述留 HANDOVER.md
- <用户裁决 D-1~D-4 与其理由> → relocate → docs/agents/decision-log.md DEC-001~004
- <HANDOVER.md 实现流水与待验证项> → relocate → docs/agents/project-progress.md「当前状态」块
- <HANDOVER.md 已废弃的预设级消费者方案细节> → drop（内容留 consumer.js 与 docs/adr/ZhiYin-M0-ADR.md，本文件不复述）
- <IMPORTANT 首行「织音是 DSH 第三方插件原型，只读用户技能目录，禁止改写、重命名或删除任何 SKILL.md 与技能目录」> → update → 「织音是 DSH 的技能管理插件，管的是技能的安装、卸载、启停与技能包编组；安装只新建目录，卸载只移入归档目录」
- <禁止把技能正文复制进插件，或让插件写技能目录> → update → 拆两条：「禁止卸载时直接删除技能目录，一律移入归档目录」「禁止把技能正文硬编码进插件包，或让插件在无用户动作时改写技能文件」
- <Permissions 缺安装写盘前置约束> → update → 新增 YOU MUST 安装写盘前先确认目标根（~/.dsh/skills 或 <项目>/.dsh/skills），同名冲突先问用户
- <Conventions 无目录布局约束> → update → 新增「仓库目录布局固定」行（根目录只留四件 + docs/、prototype/）
- <Conventions「插件仍在开发阶段：不升 version」> → update → 「version 锁定 0.1.0，开发期不升版」
- <Conventions「停用只写本地状态」> → update → 拆为「启停只写本地状态」与「安装卸载写盘边界」两行
- <References 指向根目录 ZhiYin-PRD-v0.2.md / ZhiYin-M0-ADR.md / ZhiYin-UI-决议.md / HANDOVER.md> → update → 改指 docs/prd/、docs/adr/、docs/design/、docs/handoff/handoff-2026-11-17-m0-skills-provider.md，并补一条 PRD v0.1 留档指针
- <Conventions「读原生目录快照：用 ctx.skills.snapshot({ cwd }) 且不带 scope，只读全局层」> → update → 「用 viewForAgent：从技能注册表层表反查该 Agent 的 scope key，带 scope 读快照并与全局层比较取条目多者」；原因：BUG-001 实测证明不带 scope 只能读到全局层，用户级 161 个技能全丢
- <Conventions「仓库目录布局固定：根目录只留 AGENTS.md、README.md、CHANGELOG.md、.gitignore 与 docs/、prototype/」> → update → 允许根目录放 PRODUCT.md、DESIGN.md 与 .impeccable/（impeccable 要求产物落在项目根，且 contract 文件必须能被工具按固定路径读到）
- <References 无产品真相指针> → update → 新增「设计前先读产品真相 → 见 PRODUCT.md」
- <Permissions「每次只推进一个阶段，完成即停，等用户验证」> → update → 「按任务需要连续推进多个阶段，每完成一个功能自行 review（语法、假 ctx 冒烟、真机数据），不需要 UI 验收时不要停下来等；最后整体交付验收」；原因：用户 2026-11-18 指出一步一停进度太慢
- <Conventions 无「交付须附下一步计划」> → update → 新增「每次交付须附下一步计划」行；原因：用户 2026-11-19 要求每次交付除报告完成外还要给出下一步计划
- <Conventions「仓库目录布局固定」白名单含 .gitignore，无 .gitattributes、无 README.en.md> → update → 白名单追加 README.en.md 与 .gitattributes；原因：双语 README 与源码导出白名单（export-ignore）需要落在这两处
- <Conventions 无分发口径约束> → update → 新增「分发口径双白名单」行（npm files + gitattributes export-ignore，开发文档不随包分发）；细则见 docs/agents/decision-log.md DEC-010
