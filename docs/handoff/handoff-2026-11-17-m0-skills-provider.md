# 织音 · 交接（2026-11-17 00:35）

> 本会话上下文已接近上限（DSH 的压缩服务整晚报错），开新会话继续时先读这份。

## 目标

把 **AI Vault**（用户自有项目，源码 `D:\Workspace\Code\AIVault`）的技能管理做成 **DSH 插件**：
安装 / 卸载 / 隐藏技能，按**技能包**分类（技能包 = 启用单位，可多包并存）。UI 先行，再实现。

## 已定决策

| 编号 | 决策 |
|---|---|
| D-1 | 安装/卸载**写盘**：装 = 写 `~/.dsh/skills` 或 `<项目>/.dsh/skills`；卸 = 移入归档目录（可恢复） |
| D-2 | 技能包 = **启用单位**（启用包 = 批量启停成员），**允许多包并存**（并集） |
| D-3 | 停用 = **完全不可见**（模型目录不列、`skill` 工具拒绝、`/` 菜单没有） |
| D-4 | 入口**只在设置**（设置 → 织音），不做侧栏入口 |

## 已查清的平台事实（不要重查）

- **技能消费者按 Agent 预设装配**：`...\app.asar\dsh\node_modules\@deepseek-ai\dsh-web-app\presets\standard.patch.yml:45-46` 的 `plugins` 里挂 `tool-skill`。全局层同名工具**永远赢不了**它（实测 `visible:false`）。
- **不用接管消费者也能停用技能**（`@michengai/dsh-skills-manager` 的做法）：对每个活 Agent，用 `agent.ctx.get('skills').registerProvider(...)` 在**该 Agent 最近的层**注册策略 provider；只列「已停用」的同名候选并把 `modelInvocable`/`userInvocable` 全关，启用项**不列** → 自然落回原生 provider，**零正文复制**、不动文件、不换预设。
- **DSH 跟随软链接**：`dsh-skill-filesystem` 用 `stat`（`fsio.ts:262-271`），README:40 明说软链目录可正常打开。`~/.dsh/skills` 97 条全是软链 → 指向 `~/.agents/skills`（161 条）。两根都扫（`user-dsh`=400、`user-agents`=500），目录因此是 161 个名字。
- **让 `.dsh/skills` 成为唯一用户级根**：给生效的 `skill-filesystem` 行加 `agentsHome: 'C:\Users\GigaByte\.dsh\_agents-disabled'`（不存在即可）；或设 `DSH_AGENTS_HOME`。**别用** `includeDefaultRoots:false`（会丢项目根与 bundled 根）。
- **第三方插件无法新增 Typert Remote**（生成器不随发行版发布）→ 宿主↔页面数据走同源 HTTP：`ctx.webServer.register({kind:'exact', path, resource})` + 浏览器 `fetch`。
- **bundle 装法**：`file:`/`link:` 安装不装依赖 → 包内声明 `@deepseek-ai/dsh-llm`、`dsh-skill`、`dsh-tools` = `0.2.2-rc.3` 并 `npm install`。装/重装一律 `remove_bundle` → `install_bundle`。
- **同层同名工具先注册者胜且静默**；输家必须自检 `ctx.tools.get('skill', agent) === 自己的定义`，不成立就什么都不做（否则会误退役目录，往会话注入「当前没有技能可用」）。
- Host 进程内 `DSH_HOME` 可能为空，落盘会回退 `process.cwd()`（= profile 目录）。

## 当前代码状态

`D:\Workspace\Code\dsh-skills-zhiyin\prototype`（bundle `@local/dsh-zhiyin-proto` v0.2.0，已装）：

| 文件 | 作用 |
|---|---|
| `index.js` | 宿主半边：`ctx.webServer.register` 挂 `GET /zhiyin/state`，聚合在跑会话的技能快照 |
| `client.js` | 设置页（`settings.section` + icon），已改成**紧凑行式卡片**（40px 高、单行描述截断），与官方插件页密度一致 |
| `consumer.js` | 旧消费者实现，**当前未挂载**，保留备查 |
| `paths.js` | 状态文件路径（`DSH_HOME` 回退 `cwd`） |
| `cordis.patch.yml` | 只 `insert` 一行 `zhiyin` |

实测：`GET http://127.0.0.1:61223/zhiyin/state` → 200，175 技能 / 151 模型可用 / 目录 40548 字符（预算 8000，507%）。

## 下一步（按顺序）

1. **开关**：`加载 ~/.agents/skills [开/关]`。关掉时用「最近层 provider 只列这些技能并关调用策略」实现（D-3 语义），不做全局配置改动。
2. **技能列表**：紧凑行 + 每行开关（停用 → 走同一 provider 机制）。
3. **技能包**：包列表 + 成员管理两栏弹窗（照 AI Vault 的 `SkillPackManagerModal`）；启停整组。
4. **安装/卸载**：从文件夹 / zip / URL 写入 `.dsh/skills`；卸载移入归档目录。
5. 之后才做「目录预算/冲突」这类增强。

## 坑（别重犯）

- 不要用「关掉 `dsh-base` 的 `tool-skill` 行」当接管手段——无效。
- 不要在 `visible:false` 时退役目录。
- 不要给第三方插件规划 Remote 命名空间。
- 参考实现：`@michengai/dsh-skills-manager` 的 `src/index.ts`（`registerAgentSkillProviders` 与 `externalSkillProvider`）；AI Vault 的技能包模型在 `src/lib/skillPacks.ts`、界面在 `src/components/skills/`。

---

# 交接补充（2026-11-17 12:5x，v0.3.0）

## 这一版做了什么

设置页从「只读观测」升级为**能真的开关**，机制是「按 Agent 注册策略 provider」，
不写文件、不换预设、不复制正文：

- 宿主 `index.js` 对每个在跑的 Agent 执行 `agent.ctx.get('skills').registerProvider(...)`
  （落在该 Agent 最近的层，2 秒轮询补齐新 Agent，Agent 消失时释放）；
- provider 只列**被停用**的同名候选，`invocation: { modelInvocable:false, userInvocable:false }`，
  启用项一律不列 → 自然落回原生 provider；
- 判定规则集中在 `hiddenReason(state, name, source)`：
  `agents 开关关 → source==='user-agents' 全隐藏`；在包里 → 任一包启用即启用；
  不在包里 → `state.disabled` 决定；
- 新增写路由：`POST /zhiyin/skill`（{name, enabled, description, source}）、
  `POST /zhiyin/settings`（{agentsRoot}）；写前校验 Origin 同源、只收 POST；
- 状态文件：`<profile>/zhiyin-proto/state.json`；诊断日志：同目录 `events.ndjson`；
  原生目录快照用 `ctx.skills.snapshot({ cwd })`（**不带 scope = 只读全局层**，不会被自己的影子候选遮蔽）。

## 已验证 / 待验证

- 已验证（Node 假 ctx 端到端）：路由注册、provider 注册、影子候选只含被停用项且双 false、
  agents 开关关闭后 user-agents 全部入影子、目录字符数只统计启用项、规则矩阵 8 条全过。
- 待验证（需重启 App 才加载新宿主代码）：真实 `agent.ctx.get('skills')`、
  `webServer.register({ handler })` 是否被接受、页面开关是否即时生效。
  重启后先看 `events.ndjson` 里有没有 `provider-registered`。

## 下一步

1. 技能包（启用单位、多包并集）的 UI 与 `packs` 写入路由；
2. 安装/卸载写盘（装 = 写 `~/.dsh/skills` 或 `<项目>/.dsh/skills`，卸 = 移入归档目录）；
3. 目录字符预算与冲突/重名提示。

## 后续变更（2026-11-17 12:5x 补记）

- 本文件原名 `HANDOVER.md`，已移入 `docs/handoff/` 并按命名约定改名。
- 文中“bundle `@local/dsh-zhiyin-proto` v0.2.0”为当时状态；现版本锁定 `0.1.0`，profile 仍用 `link:` 指向 `prototype/`，改动靠重启 DSH 加载。
- 定位澄清：织音是技能管理插件，安装新建技能目录、卸载移入归档目录；启停与观测不碰技能文件（见 `docs/agents/decision-log.md` DEC-005）。
