---
title: Project Progress
type: project-progress
project: dsh-skills-zhiyin
updated: 2026-11-17
description: >
  项目开发进度实时记录：阶段、分支、代码状态、最近进展。每次会话更新。
  AI 在本文件新增进展或修改当前状态后，必须同步更新 frontmatter 的 updated 字段为当日日期（YYYY-MM-DD）。
---

# Project Progress

> 记录当前任务状态、分支和最近进展。每次会话更新。
> 新进展插在「当前状态」之后、旧「最后更新」之前。

---

## 当前状态

- **当前分支**：main（首次提交 `1e3b33d` 已推送到私有仓库 https://github.com/ErgeAIA/dsh-skills-zhiyin）
- **阶段**：原型期 P0——技能启停已实现，待真机验证；文档与仓库布局已收敛
- **代码**：prototype/ 两半边已就位（index.js 宿主：/zhiyin/state、/zhiyin/skill、/zhiyin/settings + 按 Agent 策略 provider；client.js 设置页含单个技能开关与「加载 ~/.agents/skills」总开关）；consumer.js 为已废弃的预设级消费者，仅作参考
- **版本**：prototype/package.json 锁定 0.1.0（开发期不升版）
- **工具链**：Node v24.22.1；插件包依赖 @deepseek-ai/dsh-skill / dsh-tools / dsh-llm 均 0.2.2-rc.3（prototype/package.json）
- **最后更新**：2026-11-17 文档收敛 + 定位澄清 + 版本锁定
  - 根目录只留 AGENTS.md / README.md / CHANGELOG.md / .gitignore 与 docs/、prototype/：PRD 进 docs/prd/，ADR 进 docs/adr/，UI 决议进 docs/design/，HANDOVER.md 改名进 docs/handoff/handoff-2026-11-17-m0-skills-provider.md
  - AGENTS.md 首行定位改为「技能管理插件，管安装、卸载、启停与技能包编组」，写盘边界（安装新建目录 / 卸载移入归档）写进 Permissions 与 Conventions
  - prototype/package.json version → 0.1.0
  - git init（main）+ 首次提交 `1e3b33d` 并 push 到 origin（私有仓库）；credentials 走 gh CLI
  - 上一轮：初始化项目协作档案；git init（main）；.gitignore / CHANGELOG.md / README.md 三件委托交付并验收；codegraph 1.6.2 已建索引（5 文件 / 71 节点 / 195 边）
- **下一步**：重启 DSH 后验证启停是否真机生效（看 zhiyin-proto/events.ndjson 的 provider-registered），再做技能包（packs 状态已在 hiddenReason 里支撑）
- **本阶段禁止**：市场与发现、版本号升级、替换预设或消费者；安装/卸载的写盘实现须在技能包之后单独一个阶段做
