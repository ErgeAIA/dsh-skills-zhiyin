# 织音（ZhiYin）

> 把 AI Vault 的技能管理能力做成 DeepSeek Harness（DSH）插件：按技能包编组、启停技能，让模型此刻看见的技能目录可控。

私有项目，开发中。界面与文档为中文，代码为 JavaScript。

## 这是什么

织音是 DSH 的第三方插件（`@local/dsh-zhiyin-proto`），不是独立应用，也没有打包步骤：Node ESM，宿主直接加载 `index.js` 与 `client.js`。

它是技能管理插件：安装、卸载、启停技能，并把技能编成技能包批量开关。它不改 DSH 预设、不替换技能消费者、不把技能正文硬编码进插件。产品口径（PRD v0.2）是五项能力——观测、编配、合奏、组合、投影；当前代码只落地了观测与最小的启停。

边界一句话：**织音决定“模型此刻看得见什么”，不决定“技能本身是什么”。**

## 当前状态

原型期，版本锁定 `0.1.0`。能跑的是设置页里的观测与单技能开关；技能包与安装/卸载都还没做。

| 能力 | 状态 | 说明 |
| --- | --- | --- |
| 设置页观测 | 已实现 | 技能总数、模型可用数、目录字符数与预算、观测完整度；数据来自 `GET /zhiyin/state` |
| 单技能启停 | 已实现，待真机验证 | 写 `state.json`，按 Agent 注册策略 provider，不列已停用项且关闭双调用策略 |
| `加载 ~/.agents/skills` 总开关 | 已实现，待真机验证 | 关掉后 `user-agents` 来源的技能全部隐藏 |
| 技能包（分组启停） | 未做 | `state.json` 的 `packs` 字段已预留，无 UI、无写路由 |
| 技能安装 / 卸载 | 未做 | 设计为装 = 写技能目录，卸 = 移入归档目录（可恢复） |
| 目录预算阻断、冲突检测 | 未做 | 只显示字符数，不阻断 |

“待真机验证”指：宿主代码要完全重启 DSH 才会加载，重启后需确认 `events.ndjson` 里出现 `provider-registered`、页面开关即时生效。已通过 Node 假 ctx 端到端验证的部分见 `docs/handoff/` 最新交接；真实 `agent.ctx.get('skills')` 与页面写入路径仍待实测确认。

## 目录结构

```
dsh-skills-zhiyin/
├── prototype/                  # 插件包本身（Node ESM，无打包步骤）
│   ├── index.js                # 宿主半边：路由 + 按 Agent 注册策略 provider
│   ├── client.js               # 设置页 UI：注册 settings.section 与图标槽位
│   ├── paths.js                # 状态目录解析（DSH_HOME 为空时回退 cwd）
│   ├── consumer.js             # 已废弃的预设级消费者，仅作参考，未挂载
│   ├── cordis.patch.yml        # 插件注册：insert 一行 zhiyin
│   ├── locale/
│   │   ├── zh.json
│   │   └── en.json
│   ├── package.json            # 包名、exports、依赖版本（dev 期锁定 0.1.0）
│   └── package-lock.json
├── docs/                       # 文档集中在这里，根目录不放散文档
│   ├── prd/                    # ZhiYin-PRD-v0.2.md（基线）、ZhiYin-PRD-v0.1.md（留档）
│   ├── adr/                    # ZhiYin-M0-ADR.md：架构取舍与实测证据
│   ├── design/                 # ZhiYin-UI-决议.md：设置页信息架构
│   ├── handoff/                # handoff-YYYY-MM-DD-*.md：跨会话交接
│   └── agents/                 # 进度、决策、调试、经验库、AGENTS 变更记录
├── AGENTS.md                   # 协作契约
├── README.md                   # 本文件
├── CHANGELOG.md                # 变更记录
└── .gitignore
```

`prototype/node_modules/` 由 `npm install` 生成，不入库。

早期的 `prototype/README.md` 记录的是“新增预设、替换消费者”的 M0 路线，该路线已废弃；现状以本文件与 `docs/handoff/` 最新一份交接为准。

## 如何安装到 DSH profile

前置要求：

- DSH 桌面端（Web profile）。
- Node.js v24.22.1（项目实测环境）。`prototype/package.json` 未声明 `engines`。
- 插件依赖固定为 `0.2.2-rc.3`：`@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-tools`。

1. 先装包依赖。`link:` / `file:` 方式安装不会代装依赖，必须在包目录装一次：

```bash
cd prototype
npm install
```

[未经运行验证]（来源：`AGENTS.md` 命令表、`prototype/package-lock.json`；本次未执行安装）

2. 在 DSH profile 的 `package.json` 里登记插件，两处都要加：依赖用 `link:` 指向本仓库的 `prototype/`，包名同时进 `dsh.profile.bundles`（bundles 是追加，不要替换既有条目）。以下只列相关片段：

```json
{
  "dependencies": {
    "@local/dsh-zhiyin-proto": "link:D:/Workspace/Code/dsh-skills-zhiyin/prototype"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@local/dsh-zhiyin-proto"
      ]
    }
  }
}
```

本机 desktop profile 已按此方式登记。profile 文件位置：`<DSH_HOME>/profiles/<profile>/package.json`。

3. 完全退出并重开 DSH。宿主半边在进程启动时加载，刷新页面不会生效。

4. 重装或更新：先 `remove_bundle` 再 `install_bundle`；改完宿主代码仍要完全重启 DSH。开发期版本锁定在 `prototype/package.json` 的 `version: 0.1.0`，不升版，改动靠重启加载。

## 如何验证

先做语法检查：

```bash
node --check prototype/index.js
node --check prototype/client.js
```

[已运行验证]

再按顺序验行为：

1. 打开 **设置 → 织音**。应看到技能总数、模型可用数、目录字符数与预算（`8000`）。
2. 拨任意一行的开关，行内应变为「已停用」；`state.json` 的 `disabled` 里出现该技能名。目标语义是完全不可见（模型目录不列、`skill` 工具拒绝、斜杠菜单没有）；当前用双 false 的影子候选实现，真机是否符合待验证。
3. 看事件日志 `<profile>/zhiyin-proto/events.ndjson`，应有 `provider-registered`。
4. 只读接口 `GET http://127.0.0.1:<port>/zhiyin/state` 应返回 JSON，且 `takeover.visible` 为 `true`。[已运行验证]（本机实测返回 200）

## 配置与数据

状态目录：`<profile>/zhiyin-proto/`。`DSH_HOME` 为空时回退到进程 `cwd`，Desktop 下即 profile 根。

| 文件 | 用途 |
| --- | --- |
| `state.json` | 持久状态，由写路由更新 |
| `events.ndjson` | 诊断日志，逐行追加 |

`state.json` 字段：

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `v` | number | `1` | 结构版本 |
| `agentsRoot` | boolean | `true` | 是否加载 `~/.agents/skills`；关掉后 `user-agents` 来源全部隐藏 |
| `disabled` | object | `{}` | 手动停用：技能名 → `{ at }`（停用时间） |
| `packs` | array | `[]` | 技能包。字段已预留，当前无 UI 与写路由 |
| `known` | object | `{}` | 见过的技能描述与来源缓存（描述截到 400 字符） |

路由（同源 HTTP；第三方插件没有 Typert Remote）：

| 方法 | 路径 | 请求体 | 用途 |
| --- | --- | --- | --- |
| `GET` | `/zhiyin/state` | — | 聚合在跑 Agent 的技能快照：`counts`、`catalogChars`、`takeover` 等 |
| `POST` | `/zhiyin/skill` | `{ name, enabled, description?, source? }` | 单个技能启停 |
| `POST` | `/zhiyin/settings` | `{ agentsRoot: boolean }` | 总开关 |

写路由只接受 `POST`（其它方法 405），校验 `Origin` 与 `Host` 同源（否则 403），请求体上限 64 KB。

## 已知限制

- 停用靠“给每个在跑 Agent 在其最近层注册策略 provider”实现：只列被停用项并关闭 `modelInvocable` / `userInvocable`，启用项不列、落回原生 provider。新 Agent 由 2 秒轮询补挂，最多有 2 秒窗口。
- 目录字符数按“每条描述截断到 500 字符 + 固定开销”估算，不是真实 token 数；`8000` 预算只展示，不阻断。
- 技能包（分组启停）与安装/卸载未做。安装的设计是写 `~/.dsh/skills` 或 `<项目>/.dsh/skills`，卸载是移入归档目录（可恢复，不直接删除）。
- `consumer.js` 是已废弃的预设级消费者，保留作参考，未挂载。
- `package.json` 的 `files` / `exports` 列了 `icon.svg`，仓库当前没有该文件；设置页图标由 `client.js` 注入 `settings.section.icon` 槽位，不依赖它。
- 写盘边界：启停与观测不碰技能文件；只有用户显式发起的安装（新建目录）与卸载（移入归档目录）会写技能目录，执行前先确认目标根、同名先问。

## 文档索引

| 文档 | 内容 |
| --- | --- |
| [`docs/prd/ZhiYin-PRD-v0.2.md`](docs/prd/ZhiYin-PRD-v0.2.md) | 需求基线：五项能力、意图/投影/观测三态、冲突模型与目录预算、成功判据 |
| [`docs/prd/ZhiYin-PRD-v0.1.md`](docs/prd/ZhiYin-PRD-v0.1.md) | 旧版 PRD，已被 v0.2 取代，留档 |
| [`docs/adr/ZhiYin-M0-ADR.md`](docs/adr/ZhiYin-M0-ADR.md) | 架构决策记录：接入点取舍、实测证据、被否方案 |
| [`docs/design/ZhiYin-UI-决议.md`](docs/design/ZhiYin-UI-决议.md) | 设置页信息架构、布局与样式决议 |
| [`docs/handoff/`](docs/handoff/) | 跨会话交接：上一轮做到哪、待验证项、下一步、坑 |
| [`docs/agents/`](docs/agents/) | 过程记录：进度、决策、调试、经验库、契约变更 |
| [`AGENTS.md`](AGENTS.md) | 协作契约：权限、命令、约定 |

## 维护

私有项目，仅供内部使用，暂不对外分发。
