# 织音（ZhiYin）

DeepSeek Harness（DSH）的技能管理插件：安装、卸载、启停技能，并把技能编成**技能包**批量开关。

一句话边界：**织音决定「模型此刻看得见什么」，不决定「技能本身是什么」。**

- 使用说明：[GUIDE.md](GUIDE.md) ｜ English: [GUIDE.en.md](GUIDE.en.md)
- 界面入口：左侧竖栏「织音」，或 设置 → 织音

## 它做了什么

| 能力 | 说明 |
| --- | --- |
| 技能观测 | 汇总当前技能总数、模型可用数、目录字符数；数据来自 `GET /zhiyin/state` |
| 安装技能 | 支持 GitHub 仓库 / 仓库内单个技能 / skills.sh 页面 / `npx skills add` 命令 / SKILL.md 直链 / 本地目录；只新建技能目录 |
| 卸载技能 | **不删除**，移入归档目录；可恢复，也可在归档页永久删除 |
| 启停技能 | 按 Agent 注册策略 provider，不列已停用项并关闭双调用策略；开关即时生效 |
| 技能包 | 分组启停；「全部技能」默认包与其他包互斥 |
| 技能市场 | 代理 skills.sh 搜索，可直接安装有公开仓库的技能 |
| 配置备份 | 导出／导入 JSON 配置，最多保留 20 份备份可回滚 |

## 安装

本包是 DSH **组合包（bundle）**：`package.json` 声明 `dsh.bundle.patch`，安装进 profile 后由 `cordis.patch.yml` 插入一行插件。

```bash
# 从本地目录安装（开发期常用）
dsh plugin --profile <profile> add /path/to/this/folder

# 从 tarball 安装
npm pack
dsh plugin --profile <profile> add ./dsh-skills-zhiyin-0.1.0.tgz
```

安装后需要**完全退出并重开 DSH**（宿主半边在进程启动时加载，刷新页面不生效）。

依赖：Node.js ≥ 24；宿主共享包 `@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-tools`（以 `dependencies` 固定版本引入）。

## 数据

状态目录：`<DSH_HOME>/zhiyin-proto/`（`DSH_HOME` 为空时回退进程工作目录）。

| 文件／目录 | 用途 |
| --- | --- |
| `state.json` | 持久状态：`agentsRoot`、`allOff`、`disabled`、`notes`、`packs`、`known` |
| `events.ndjson` | 诊断日志，逐行追加 |
| `archive/` | 卸载后的技能归档，含 `origins.json` 记录原位置 |

## 路由

同源 HTTP（第三方插件没有 Typert Remote）。写路由只接受 `POST`，校验 `Origin` 与 `Host` 同源，请求体上限 64 KB。

`GET /zhiyin/state`、`/zhiyin/archive`、`/zhiyin/export`、`/zhiyin/backups`、`/zhiyin/market`
`POST /zhiyin/skill`、`/settings`、`/pack`、`/install`、`/install/batch`、`/install/abort`、`/uninstall`、`/restore`、`/archive/delete`、`/import`、`/rollback`、`/repair`、`/reveal`、`/note`

## 写盘边界

- 启停与观测**不碰技能文件**，只写本地状态；
- 只有用户显式发起的**安装**（新建目录）与**卸载**（移入归档）会写技能目录；
- 安装到 `~/.agents/skills` 时会在 `~/.dsh/skills` 建软链，卸载时一并清理断链。

## 许可

开发期私有，尚未选择开源许可证。
