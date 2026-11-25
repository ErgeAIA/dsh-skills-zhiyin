---
title: 检查与更新必须分离
type: experience
project: dsh-skills-zhiyin
updated: 2026-11-25
description: >
  检查是否有新版本只做轻量探测；下载与写入只在用户确认更新后执行。
---

## 🔴 R1 — 检查只做轻量探测，不下载内容

- **主张**：远端版本检查只回答有没有变，用最轻量协议（git ls-remote / HEAD 请求）；内容下载留到用户确认更新之后。
- **适用**：任何检查远端是否变化的场景——包更新、技能更新、镜像同步、配置 drift。跨技术栈成立。
- **Why**：检查是高频、后台、用户无感的操作；把更新动作的下载逻辑搬进检查，会让检查从秒级退化到分钟级。实测同一逻辑：无条件 fetch 213 请求 / 577 秒；先比 HEAD 再按需 fetch 51 请求 / 33–43 秒。
- **How**：先取 HEAD SHA（git ls-remote --heads <repo> 或等价），与本地已验证 SHA 比对；相同直接短路，不同才拉取内容算指纹。
- **反例**：检查函数里直接 clone/fetch 完整仓库再逐文件比对 → 检查耗时十几倍、并发打爆带宽，用户只想看有没有更新却等几分钟。
- **事实源**：docs/agents/decision-log.md DEC-046、DEC-055；docs/agents/debug-log.md BUG-017；commit cfaf9e3。
