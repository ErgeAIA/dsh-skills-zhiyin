# 织音（ZhiYin）

> DSH 的技能管理插件：装技能、编技能包、按需启停，让模型此刻看见的技能目录可控。

**English**: [README.en.md](README.en.md) ｜ **使用说明**：[prototype/GUIDE.md](prototype/GUIDE.md)

开发期私有仓库，尚未公开发布。界面中英双语，代码为 JavaScript（Node ESM，无打包步骤）。

## 它是什么

织音是 **DSH 组合包（bundle）**，不是独立应用。宿主半边 `index.js` 注册同源 HTTP 路由与技能策略 provider，页面半边 `client.js` 注册两个界面入口：

| 入口 | 插槽 | 说明 |
| --- | --- | --- |
| 左侧竖栏「织音」 | `sidebar.panellist` + `main` | 整页，宽度随窗口自适应（上限 1600px） |
| 设置 → 织音 | `settings.section` + `settings.section.icon` | 传统设置页形态 |

两处渲染同一个 `Page` 组件，内容与状态完全一致。

边界一句话：**织音决定「模型此刻看得见什么」，不决定「技能本身是什么」。**

## 功能状态

| 能力 | 状态 | 说明 |
| --- | --- | --- |
| 技能观测 | 已实现 | 技能总数 / 模型可用 / 目录字符数；`GET /zhiyin/state` |
| 双入口界面 | 已实现 | 左侧整页 + 设置页，同一组件 |
| 技能安装 | 已实现 | GitHub / skills.sh / `npx skills add` / SKILL.md 直链 / 本地目录；多技能可勾选；可中止 |
| 技能卸载（归档） | 已实现 | 移入 `archive/`，可恢复到原目录或任一根目录；支持单条与批量永久删除 |
| 单技能启停 | 已实现 | 写 `state.json`，策略 provider 双置 false |
| 技能包 | 已实现 | 新建 / 改名 / 复制 / 删除 / 勾成员；「全部技能」与其它包互斥 |
| 技能市场 | 已实现 | 代理 skills.sh 搜索与描述抓取；已装可重装 |
| 配置导出／导入／备份／修复 | 已实现 | 最多 20 份备份，可回滚 |
| 目录预算硬阈值 | 已移除 | 只展示成本与建议上限，不阻断 |

## 安装到 DSH profile（开发期）

插件以 `link:` 方式登记进 profile；profile 文件在 `<DSH_HOME>/profiles/<profile>/package.json`。

```jsonc
{
  "dependencies": {
    "@local/dsh-zhiyin-proto": "link:D:/Workspace/Code/dsh-skills-zhiyin/prototype"
  },
  "dsh": {
    "profile": {
      "bundles": ["@deepseek-ai/dsh-base", "@local/dsh-zhiyin-proto"]
    }
  }
}
```

`bundles` 是追加，不要替换既有条目。`link:` 安装不会代装依赖，需在包目录执行一次 `npm install`。

改宿主半边（`index.js`）后**必须完全退出并重开 DSH**；只改 `client.js` 刷新页面（F5）即可。

## 验证

语法检查（每次改动都跑）：

```bash
node --check prototype/index.js
node --check prototype/client.js
```

[已运行验证]

打包内容（确认只随包分发插件本体）：

```bash
cd prototype && npm pack --dry-run
```

[已运行验证] 输出 13 个文件，零开发文档。

源码归档内容（GitHub「Download ZIP」同源）：

```bash
git archive --format=zip HEAD -o /tmp/zhiyin.zip
```

[已运行验证] 只产出 `prototype/` 一个目录，开发文档被 `.gitattributes` 的 `export-ignore` 剥离。

行为验收：打开左侧「织音」或 设置 → 织音，拨任意开关应即时生效；`<profile>/zhiyin-proto/events.ndjson` 应出现 `provider-registered`。

## 目录结构

```
dsh-skills-zhiyin/
├── prototype/              # 插件包本体（随包分发）
│   ├── index.js            # 宿主半边：路由 + 技能策略 provider
│   ├── client.js           # 页面半边：双入口注册 + 界面
│   ├── paths.js            # 状态目录解析
│   ├── cordis.patch.yml    # 组合包 patch：insert 一行 zhiyin
│   ├── locale/{zh,en}.json
│   ├── icon.svg
│   ├── README.md / README.en.md
│   ├── GUIDE.md / GUIDE.en.md   # 用户使用指南
│   └── consumer.js         # 已废弃，保留作参考，未挂载
├── docs/                   # 开发文档（不随包分发）
│   ├── prd/                # 需求基线
│   ├── adr/                # 架构决策记录
│   ├── design/             # UI 决议与调研
│   ├── handoff/            # 跨会话交接
│   └── agents/             # 进度、决策、调试、经验库
├── AGENTS.md               # 协作契约
└── .gitattributes          # 源码导出白名单
```

## 分发口径

开发文档不随插件分发，靠两个白名单各管一段：

- **npm 包**：`prototype/package.json` 的 `files` 字段；
- **源码归档**：`.gitattributes` 里对 `/docs`、`/AGENTS.md`、`/PRODUCT.md`、`/CHANGELOG.md`、根 `/README.md` 的 `export-ignore`。

## 文档

| 文档 | 内容 |
| --- | --- |
| [`prototype/GUIDE.md`](prototype/GUIDE.md) | 使用指南：装技能、技能包、归档恢复（随包分发） |
| [`docs/prd/ZhiYin-PRD-v0.2.md`](docs/prd/ZhiYin-PRD-v0.2.md) | 需求基线 |
| [`docs/adr/ZhiYin-M0-ADR.md`](docs/adr/ZhiYin-M0-ADR.md) | 架构取舍与实测证据 |
| [`docs/design/`](docs/design/) | UI 决议、左侧入口与发布渠道调研 |
| [`docs/handoff/`](docs/handoff/) | 跨会话交接 |
| [`docs/agents/`](docs/agents/) | 进度、决策、调试、契约变更 |
| [`AGENTS.md`](AGENTS.md) | 协作契约：权限、命令、约定 |

## 已知限制

- 停用靠「给每个在跑 Agent 在其最近层注册策略 provider」实现：只列被停用项并关闭双调用，新 Agent 由 2 秒轮询补挂；
- 目录字符数按「每条描述截断到 500 字符 + 固定开销」估算，不是真实 token 数；
- skills.sh 托管技能（域名来源）无公开仓库，无法直接安装，界面只提供跳转；
- 开发期版本锁定 `0.1.0`，未升版。
