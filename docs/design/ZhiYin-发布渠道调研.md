---
title: 织音插件的发布与分发渠道调研
type: design-investigation
project: dsh-skills-zhiyin
updated: 2026-11-22
baseline: DSH Desktop 0.2.2-rc.5（app.asar 内官方文档与代码）
status: 已调研，未实施
---

# 织音插件的发布与分发渠道

## 1. 结论

| 渠道 | 命令 / 做法 | 是否需要用户授权构建 | 是否可获得市场曝光 |
| ---- | ---- | ---- | ---- |
| **npm（推荐）** | `npm publish` → 用户 `dsh plugin --profile <p> add <包名>` | 否（发的是预构建代码） | 是（社区索引会自动映射 npm 包） |
| **tarball** | `npm pack` → 用户 `dsh plugin add ./xxx.tgz` | 否 | 否（需自行分发文件） |
| **GitHub 源码** | `dsh plugin add github:owner/repo#<sha>` | **是**（pnpm ≥10 拒绝运行 `prepare`，需用户写 `allowBuilds`） | 是（索引里可写 git source，但要求 40 位 commit） |
| **社区索引** | 向 `awesome-dsh-plugin` 提 PR，新增一条 YAML | — | 是（dshmarket「插件市场」只收录索引里的来源） |
| **自建索引** | 写 format 1 JSON 放静态主机，用户手动「添加索引源」 | — | 否（要用户手填 URL） |
| **私有分发** | `link:` / 本地目录 / 私有 registry | — | 否 |

## 2. 官方规则（原文摘录）

官方文档 `dsh/docs/user/develop/basic/publish.zh.md`：

> 发布到注册表不是必须的——用户可以直接从 git 托管安装……git 安装拉取的是**源码，不是构建产物**：没有任何环节运行你的 `build` 脚本……**如果不想让用户做这项授权，就改为分发构建产物**：
> - **发布到 npm**，在 `pnpm publish` 时构建好 `lib/`；`dsh plugin add your-package` 安装的就是预构建代码。
> - **交付 tarball**：用 `pnpm pack` 打包；用户执行 `dsh plugin add ./hello-plugin-0.1.0.tgz`。

> 使用 `engines.dsh` SemVer 范围声明组合包支持的 DSH 版本，例如 `"engines": { "dsh": ">=0.2.0 <0.3.0" }`。安装和 profile 启动会拒绝当前运行的 DSH 不满足该范围的组合包；没有 `engines.dsh` 时，改为检查其 `@deepseek-ai/dsh*` peer 依赖范围。

> 与 harness 自身的包一样，需要与宿主共享实例的 dsh 包同时声明在 `peerDependencies` 与 `devDependencies` 中……需要独立版本的第三方依赖和无状态 dsh 工具包放在 `dependencies` 中。

**没有「官方插件 registry」这回事**：官方文档明确写 DSH 不内置任何索引源，用户要自己在「发现 → 添加索引源」里填 URL。所谓「插件市场」是第三方插件 dshmarket 提供的社区目录。

## 3. 同一份事实的另一处印证（本机实测）

- DSH 自带服务 `PluginRegistryProbe`（`@deepseek-ai/dsh-client-ui-plugin-manager/lib/index.js`）会并发 ping `https://registry.npmjs.org/-/ping` 与 `https://registry.npmmirror.com/-/ping` 择优缓存 —— 安装走 **npm registry**。
- `dshmarket@1.77.1` 就在 npm 上公开分发，其 `package.json` 的 `dsh` 字段：
  `{"bundle":{"patch":"./cordis.patch.yml"},"client":{"inject":[...],"platform":"web"}}`
- 本地 CLI：`dsh plugin --help` → 「manage a profile's plugins by forwarding the remaining arguments to **pnpm** in the profile directory」。
- 社区索引 `https://awesome-dsh-plugin.com/plugins.json`：12,519 条，每条含 `install: "dsh plugin --profile web add github:..."`、`npm`、`version`、`capabilities`（shell/fs-write/network 等）。
- 站点「Get your plugin listed」原文：**「Open a PR against awesome-dsh-plugin — one YAML file under `data/plugins/` is the whole submission; the READMEs and this site regenerate automatically. Add the `dsh-plugin` topic to your repo too.」**，并注明「Not affiliated with DeepSeek」。

## 4. 织音当前离可发布还差什么

| 项 | 现状 | 影响 |
| ---- | ---- | ---- |
| 包名 | `@local/dsh-zhiyin-proto` | `@local` 是本地链接别名，除非拥有该 scope 否则发不出去 |
| `private: true` | 有 | npm 直接拒绝发布 |
| `engines` | 无 | 市场无法判断兼容性 |
| 宿主依赖位置 | 三个 `@deepseek-ai/*` 放在 `dependencies` 且固定 `0.2.2-rc.3` | 应按官方规则移到 `peerDependencies` + `devDependencies`（实测 index.js 只 import Node 内置与 `./paths.js`） |
| 仓库目录 | 插件包已移到仓库根目录（2026-11-22） | GitHub 下载即为可装插件；`files` 与 `export-ignore` 已按新布局更新 |
| `client.js` 模块 id | 硬编码旧包名 | 改名后必须同步，否则客户端半边挂不上 |
| `cordis.patch.yml` 的 `name` | 旧包名 | 同上 |
| LICENSE | 无 | 社区索引评审会看 |
| 仓库可见性 | 私有 | 上社区索引前必须公开 |
| `dsh-plugin` topic | 无 | 社区索引/自动发现靠它识别 |
| 根目录 `package.json` | 没有（包在 `prototype/`） | 社区索引支持 monorepo 子目录条目，但单包仓库更省事 |

## 5. 建议路径

1. **先做「包元数据改造」分支**（不改功能）：改名 `dsh-skills-zhiyin`、去 `private`、加 `engines.dsh`、宿主依赖移到 peer+dev、同步 client id 与 patch name、补 LICENSE。
2. **用 tarball 在独立 profile 验证**：`npm pack` → `dsh plugin --profile zhiyin-test add ./xxx.tgz` → `--dump-config` 应出现该 bundle 的层。
3. **发布 npm 0.1.0**（预发布用 `--tag next`），打 `v0.1.0` tag，Release 附 tarball。
4. **仓库公开 + 加 `dsh-plugin` topic + 向 awesome-dsh-plugin 提一条 YAML PR**（`category: skill`）——这一步才换来「插件市场」里的曝光。
5. 可选：dsh-plugin.org 自动扫描，或自建 format 1 索引。

## 6. 未核实

- `dsh-skills-zhiyin` 包名与 `@ergeai` scope 的占用/归属（查询返回 404 只代表当时无人占用，不代表可注册）。
- Desktop 应用内「插件 → 添加插件」是否支持选择本地 tarball 文件（CLI 支持，UI 未验证）。
- 社区索引 PR 的评审周期与 CI 细节。
- `locale/*.json` 里 `meta.detail` 指向根级 README 是否会被拒绝（官方 cookbook 有相反说法，未实测）。
