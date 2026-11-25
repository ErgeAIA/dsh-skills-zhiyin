---
title: 技能更新检测上线与会话交接
type: handoff
project: dsh-skills-zhiyin
updated: 2026-11-25
description: >
  本轮完成 0.1.1→0.1.8 的连续发版与技能更新检测落地；下一个 agent 从已发布 0.1.8、等待用户验收三步更新流程接手。
---

# 交接：技能更新检测上线

## 验证状态

- 0.1.8 已发布：registry latest=0.1.8，OIDC provenance 正常，隔离安装成功（详见 docs/agents/project-progress.md 最新条目）。
- 检测逻辑实测：初始化回填 162 条来源（AI Vault 库按 SKILL.md 哈希核对）；检测 51 仓库 / 33–43 秒；up-to-date 153 / 有更新 20 左右。
- 更新动作实测：在隔离目录验证原子替换后软链仍是 SymbolicLink 且读到新内容；本地被改动时拒绝覆盖（409）。
- **未验证**：0.1.8 新增的「筛选 → 确认 → 可中断」三步交互尚未在真实浏览器点过——只做了 node --check 与代码走查。
- **未验证**：0.1.8 装上后 desktop 端的实际检查耗时与自动刷新（上一轮实测是 0.1.7 及更早）。

## 下一步聚焦点

- 用户以 **desktop 端为主**；发版后约 24 小时才可在插件市场重装到新版本，这是 pnpm 安全等待期，不手动改配置。
- 用户验收重点：点「有 N 个更新」是否只筛选不写盘；点卡片「有更新」是否弹确认；更新中是否有「取消更新」。
- 若发现问题走 0.1.9，不覆盖已发布版本。

## 卡点与失败路径

- 本机 git 对 github.com 偶发 schannel TLS 握手失败（代理 7890 下仍不稳定），实测更新动作可能返回 502；这是网络层，不是代码缺陷。排查时先看 errors 文本再改逻辑。
- AI Vault 与织音共享 ~/.agents/skills SSOT，但 AI Vault 用 settings.update_head_* 缓存 HEAD；织音更新后它不会重算。按 DEC-055 不写对方数据库。
- 9 个 check-failed 是上游真搬家（如 defuddle → plugins/obsidian/skills/defuddle），按用户要求只提示、不自动改来源。

## 待用户拍板

- 是否要做「跨应用通知 AI Vault 更新」的协作机制（涉及写对方数据库，目前不做）。
- 检查周期默认每天，用户是否要改为其它值。
