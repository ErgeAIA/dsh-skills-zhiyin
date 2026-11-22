# 织音（ZhiYin）

DeepSeek Harness 的技能管理插件：安装技能、编成技能包、按需启停。

**English** ｜ [README.en.md](README.en.md)

织音把「模型此刻能看见哪些技能」变成一件可以直接操作的事：装什么、留哪些、给谁开。它不修改技能文件本身，也不替换 DSH 的技能机制——只在外围决定可见范围。

## 功能

| 能力 | 说明 |
| --- | --- |
| 技能列表 | 汇总技能总数、模型可用数、目录字符数；按来源、字符数、启用状态排序 |
| 安装技能 | 支持 GitHub 仓库、仓库内单个技能、skills.sh 页面、`npx skills add` 命令、SKILL.md 直链、本地目录；一个仓库有多个技能时逐个勾选 |
| 卸载与归档 | 卸载不删除，移入归档目录；可恢复到原位置或指定目录，也可永久删除 |
| 单个技能启停 | 开关即时生效，写本地状态，不动技能文件 |
| 技能包 | 把技能分组，按组开关；「全部技能」默认包与其它包互斥 |
| 技能市场 | 搜索 skills.sh，直接安装有公开仓库的技能 |
| 配置备份 | 导出／导入 JSON 配置，最多保留 20 份备份可回滚 |

## 安装

作为 DSH 组合包安装到 profile：

```bash
# 从本地目录
dsh plugin --profile <profile> add /path/to/dsh-skills-zhiyin

# 从 tarball
npm pack
dsh plugin --profile <profile> add ./dsh-skills-zhiyin-0.1.0.tgz
```

安装后需**完全退出并重开 DSH**：宿主半边在进程启动时加载，刷新页面不生效。

运行要求：Node.js ≥ 24；宿主共享包 `@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-tools`。

## 使用

装好后有两个入口，内容一致：左侧竖栏的「织音」，或 设置 → 织音。

完整操作说明见 **[GUIDE.md](GUIDE.md)**，涵盖装技能、技能包的分组逻辑、归档恢复与目录字符数。

## 它会写哪些文件

| 位置 | 时机 |
| --- | --- |
| `<DSH_HOME>/zhiyin-proto/state.json` | 开关、技能包、备注等配置变化时 |
| `<DSH_HOME>/zhiyin-proto/events.ndjson` | 追加诊断日志 |
| `<DSH_HOME>/zhiyin-proto/archive/` | 卸载技能时移入归档 |
| `~/.dsh/skills`、`<项目>/.dsh/skills`、`~/.agents/skills` | 仅在你主动安装或卸载技能时 |

启停与查看**不会**改动任何技能文件。安装与卸载都只由你的显式操作触发。

## 已知限制

- 停用通过给每个运行中的 Agent 注册策略 provider 实现，新会话由轮询补挂；
- 目录字符数是估算值（每条描述截断到 500 字符 + 固定开销），不是真实 token 数；
- skills.sh 上仅域名托管、没有公开仓库的技能无法直接安装，界面只提供跳转；
- 处于开发期，版本停留在 `0.1.0`。

## 开发

```bash
npm install          # 安装依赖
node --check index.js
node --check client.js
npm pack --dry-run   # 查看发布内容
```

宿主半边改动需要重启 DSH；页面半边改动刷新页面即可。

## 许可

尚未选择开源许可证。
