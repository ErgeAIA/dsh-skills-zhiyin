---
title: Decision Log
type: decision-log
project: dsh-skills-zhiyin
updated: 2026-11-23
priority: higher-than-prd
description: >
  开发过程决策日志，优先级高于 PRD；冲突时以本文件最新条目为准（PRD/ADR 由用户自行同步，本技能不代改）。
  只追加，不删除或改写历史。AI 在本文件新增或修改任何条目后，必须同步更新 frontmatter 的 updated 字段为当日日期（YYYY-MM-DD）。
---

# Decision Log

> 偏离 PRD 或做出重要技术选择时在此追加记录。只追加，不删除或改写历史。
> **优先级高于 PRD**：冲突时以本文件最新决策为准；PRD/ADR 由用户自行同步，本技能不代改。
> 格式：`## DEC-NNN: 标题`，新条目置顶，NNN 三位递增。
> 字段：`- **日期**：` / `- **背景**：` / `- **决策**：` / `- **验证**：`

## DEC-044: 市场描述按真实价值重写；明确织音「能更新技能、不能更新插件」

- **日期**：2026-11-24
- **用户反馈**：合并版描述「控制模型此刻真正看得见哪些已安装技能」读起来像个查看器，没传达价值——真实卖点是**按任务启停省上下文 + 技能包灵活切换 + 安装卸载归档管理**。
- **重写稿（v4，已推到 PR #18428 分支，commit 45bb48c）**：
  - zh：织音（ZhiYin）按任务启停技能：只开当前真正要用的，省下技能目录占用的上下文。技能可编成包一键切换，也支持安装、卸载、归档与恢复。
  - en：ZhiYin (织音) toggles skills on and off per task: enable only what the current job needs and save the context the skill catalog would otherwise spend. Group skills into packs for one-click switching, and install, uninstall, archive or restore them.
  - 三次修订共用同一个 PR（中文名 → 去掉已修复的安全提示 → 价值重写），PR body 已同步说明。
- **「织音能更新插件吗」的核实结论**：
  - **不能更新插件**（包括自己）：插件更新是插件市场（dshmarket）的职责；织音管技能，不管插件。
  - **能更新技能**：重装走 installFromText → cloneRepo，GitHub 来源每次**现 clone 最新版**再覆盖安装（原子替换，失败回滚），前端文案「重新安装（覆盖到所选目录，用于更新）」即此意。已验证 installFromText 源码：skills.sh / owner/repo / GitHub 链接都走 fresh clone。
  - 边界：本地文件夹来源的重装只是重新复制本地文件，不会带来新内容。

## DEC-043: 更正 DEC-042——市场卡片版本来自 updates.json 的 release 记录，不是 npm 实时查询

- **日期**：2026-11-24
- **用户证据**：市场卡片与安装弹窗都显示 v0.1.1（日期 2026-11-23），而我们已发布 0.1.2。
- **DEC-042 的错误**：我依据 dshmarket 源码里 catalogFromPackage 调 <registry>/<pkg>/latest 就断定卡片版本是运行时现查 npm。那是**目录包**（plugins.json 自身作为 npm 包分发）的取法，不是条目版本的来源。
- **真实机制（对照线上 updates.json 确认）**：
  1. plugins.json（目录）只有 name / owner / url / category / description / icon，**没有 version 字段**。
  2. updates.json（旁边的 17 MB 文件）每个仓库一条，含 release（tag / name / publishedAt / body / url）与 checkedAt。我们的记录是 release tag v0.1.1、publishedAt 2026-11-23T17:03:47Z、checkedAt 2026-11-24。
  3. 市场卡片与安装弹窗的 v0.1.1 就来自这份 updates.json。
- **0.1.2 何时出现**：等站点下一次刷新 updates.json。build-site.yml 的 schedule 是**每天 02:23 UTC（北京 10:23）**；今天的探测在 02:23 UTC 跑完，而 0.1.2 的 Release 是 08:12 UTC 才发 —— 探测早于发布，所以停在 0.1.1。**不是维护者卡着，是每日流水线还没轮到。**
- **强制刷新的限度**：市场自身的 refreshCatalog 只重取 plugins.json，不重建 updates.json（那份在站点侧生成），所以点刷新不会变。desktop profile 由 Electron 独占，只能用市场 UI，而 UI 会把版本钉成 updates.json 里的那个。
- **另一处必须说明的状态**：查磁盘发现**织音当前根本没有装在 desktop profile**——dependencies 与 dsh.profile.bundles 里都没有它，node_modules/dsh-skills-zhiyin 也不存在。所以用户看到的是「未安装、可安装 v0.1.1」的卡片，不是「已装 0.1.1、可升 0.1.2」。
- **教训**：读源码得出机制前，必须用线上数据反证一次。DEC-042 只看代码没对数据，结论差了整整一层。

## DEC-042: 市场里的版本号不走索引，是运行时直接查 npm（已由 DEC-043 更正）

- **日期**：2026-11-24
- **用户疑问**：市场显示 0.1.2，这个更新是否也要等维护者批准。
- **核实结论：不需要。** 三条更新路径是分开的：
  1. **版本号（0.1.2 这类）——运行时现查 npm，与索引无关**。dshmarket 的 `lib/catalog-npm.js` 直接请求 `<registry>/<pkg>/latest`（两处：116、164 行），`registryFor` 读用户 `.npmrc` 的 registry。所以只要 npm（或用户所用镜像）有新版，市场立刻显示，**不经过任何 PR**。
  2. **YAML 内容（描述 / 分类 / 图标）——需要 PR + 维护者合并**。索引由 `data/plugins/*.yml` 生成，没人合并就不生效。我们的 #18428（补中文名、去掉已修复的访问检查提示）就卡在这里。
  3. **索引里的富化字段（`npm` / `version` / `stars` / `downloads` / `capabilities`）——每日 02:23 UTC 由 `build-site.yml` 的 schedule 探针补充**；push 触发的构建只部署、不探测（为避免 npm downloads API 被打爆，注释里写明了）。
- **实测**：华为云镜像 `latest = 0.1.2`、npmjs `latest = 0.1.2`，与市场显示一致，说明版本链路正常。
- **一处待观察**：我们在 `plugins.json` 里的条目**至今没有任何富化字段**（npm/version/stars/downloads 全无），而同期其它条目有（`starsCheckedAt: 2026-11-24T03:34` 说明探针当天跑过）。这不影响安装（目录解析回退 `npm ?? name`）与版本显示（运行时查 npm），但站点页面的下载量/星数不会出现。下次探针后可复查；若长期缺失，再去 awesome-dsh-plugin 问。

## DEC-041: 0.1.2 补齐全部路由的 DSH 准入检查；市场条目同步更新

- **日期**：2026-11-24
- **问题（维护者 fkysly 在合并时指出，属实）**：`/zhiyin/*` 路由没有 DSH 的访问检查。核实后确认：只有写入路由自行比对了 Origin/Host；**6 条读取路由（state / probe / guide / archive / export / backups）用 `resource` 风格注册，拿不到 request，完全没有准入判断**。
- **为什么会漏**：我们的路由分两种写法——`post()` 用 handler 风格（有 request），其余用 `resource` 返回 `Response`（没有 request）。后者当初图省事，正好绕过了所有检查。
- **对照事实（本地实测）**：装了 5 个做检查的插件（@michengai、@nanmicoder、dsh-better-sidebar、dsh-univer-office、dshmarket），**全部用 handler 风格**；用 `resource:` 注册路由的**只有我们一个**。dsh-better-sidebar 用 `ctx.connection.requestRejection(req) === undefined` 做闸门，且它在本机桌面端正常工作——说明桌面端请求带凭据，强制校验是安全的。
- **修法**：
  1. 新增 `refuseUnadmitted(ctx, request, response)`：读 `ctx.get('connection').requestRejection`，返回 undefined 放行，否则回 401/403 JSON；**闸门抛错按 403 处理，不 fail-open**；宿主未提供闸门时放行（没有可执行检查，不等于放水）。
  2. `post()` 的 handler 最先走闸门，再做方法/同源校验（更强检查不能排在后面）。
  3. 6 条 `resource` 路由全部改为 handler 风格 + 闸门；删掉因此失效的 `json()` 死代码。
  4. 客户端在 401/403 时显示宿主给出的原因，而不是只写 `HTTP 403`。
- **验证（假 ctx 跑真实 handler）**：闸门放行 → 5 条读取路由全 200；闸门返回 403 → 全 403 且带中文原因；闸门抛错 → 403（fail-closed）；宿主无闸门 → 200；POST 在 401 时 → 401。`node --check` 双半边 0。
- **发布**：0.1.2，tag `v0.1.2` → Release → OIDC 工作流 success；registry `latest=0.1.2`，provenance `slsa.dev/provenance/v1`，shasum `5ee0f286…`；隔离环境 `dsh plugin add dsh-skills-zhiyin@0.1.2` 成功。**全程无令牌、无 OTP**。
- **市场条目**：PR #18428 更新为两件事——补中文名「织音（ZhiYin）」使中文搜索可命中；**移除维护者那句访问检查提示**（0.1.2 已修复，不再成立）。PR 只改我们自己的一个文件。
- **用户侧**：已通过插件市场搜到并安装、重启；profile 依赖现为 `dsh-skills-zhiyin: 0.1.1` → 装 0.1.2 后可得到本修复。

## DEC-040: 市场 PR 已合并；「搜不到」的真因是条目里没有中文名

- **日期**：2026-11-24
- **PR #18245 已合并**（2026-11-23T16:49:39Z，维护者 fkysly）。维护者在 main 上给描述追加了一句：
  > its HTTP routes have no DSH access check (no ctx.connection.requestRejection), so a web page open in the user's browser could call them.
  - 这是**真实的安全缺口**：我们的 `/zhiyin/*` 路由只在 POST 上做了 Origin/Host 同源校验，GET 类 `resource` 路由没有任何准入检查。DSH 提供的正是 `ctx.get('connection').requestRejection(request)`；dshmarket 用 `refuseUnadmitted()` 把**所有**路由统一包起来。我们应当照做，修完后请维护者把该句去掉。
- **市场数据侧实测**：`plugins.json` 已含我们（12,960 条），条目详情页 HTTP 200，`data/plugins/ErgeAIA__dsh-skills-zhiyin.yml` 在 main 上存在。
- **搜不到的真因**：整个索引里「织音」出现 **0 次**。条目只有 `name: dsh-skills-zhiyin` 与描述，中英描述都不含「织音」二字。市场搜索匹配 name/description，所以搜中文品牌名必然为空。
  - 立即可用的搜索词：`zhiyin`、`技能`、`skill`（zh 描述含「技能」）。
  - 已提交 PR #18428 把 `织音（ZhiYin）` 写进中英描述，使中文搜索可命中；维护者那句访问检查的说明保留原文。
- **安装途径的硬约束**：`dsh plugin --profile desktop ...` 被拒绝——`desktop` profile 由 Electron 应用独占管理（`profile "desktop" is managed exclusively by the Electron application`）。所以桌面端只能通过应用内「插件市场」安装；命令行只能操作非 desktop profile。
- **切换安装方式的数据安全性**：state 在 `<profile>/zhiyin-proto/`，与包安装位置无关；从 `link:` 换成 npm 安装后，技能包/停用项/备注/收藏都还在。
- **条目字段缺口**：我们的索引条目没有 `install` 与 `npm` 字段（其它条目有，如 `dsh plugin --profile web add dsh-pixiv-skill`）。市场解析回退为 `npm ?? name`，即用包名兜底，仍可安装；生成器下一次富化后应补上。

## DEC-039: OIDC 可信发布验证通过——0.1.1 无令牌发布，带 SLSA provenance

- **日期**：2026-11-24
- **Trusted Publisher**：用户登记后状态由「待验证」变为 **Valid**；权限 `npm publish` / `npm stage publish` / `npm dist-tag` 三项齐全；目标 `ErgeAIA/dsh-skills-zhiyin` + `publish.yml`。
- **0.1.1 发布链路**：tag `v0.1.1` → GitHub Release → `Publish to npm` 工作流 `completed/success`，7 个步骤全绿（含「tag 与 package.json 版本一致」校验与 Preflight）。
  - 发布过程中**没有任何令牌、OTP 或浏览器认证**；`setup-node` 只写了占位 `NODE_AUTH_TOKEN: XXXXX-…`，npm 自动检测到 OIDC 环境并优先使用。
  - 日志证据：`Signed provenance statement with source and build information from GitHub Actions`、`Provenance statement published to transparency log … logIndex=4054713267`、`+ dsh-skills-zhiyin@0.1.1`。
- **registry 实测**：`latest = 0.1.1`；`dist.attestations.provenance.predicateType = https://slsa.dev/provenance/v1`；`shasum = 0ad942d3a1eb795b0fa3196df6c98d91be2a02e1`（与工作流日志一致）；`engines.dsh = >=0.2.2-rc.5` 保留。
- **从 npm 安装 0.1.1 验证**：隔离 DSH_HOME → `+ dsh-skills-zhiyin 0.1.1`，4.2s。
- **包内 README 验证（从 registry tarball 解出的原文）**：npm 安装命令存在、`--registry` 说明存在、`dsh-llm` 假依赖已消失、`0.1.0` 旧版本字样已消失。npm 页面渲染的就是这份文件。
- **两处排查教训（写入 debug-log）**：
  1. **发布后 registry 不是立即可见**：工作流已输出 `+ pkg@version` 与 provenance 签名，但 registry 查询仍 404 约 10 分钟。不能凭「registry 查不到」判定发布失败，应先看工作流日志里的 `+ pkg@version`，再等传播。
  2. **unpkg 不是可靠验证源**：`https://unpkg.com/<pkg>@<ver>/README.md` 返回 0 字节，据此判断会得出错误结论。权威做法是直接下 registry 的 tarball 解包比对。
  3. 另：npm 页面头部可能仍显示旧版本号（缓存），以 registry 的 `dist-tags.latest` 为准。

## DEC-038: README 安装段改为 npm 优先；开发期继续用 link，不切 npm 安装

- **日期**：2026-11-24
- **README（shuxu 增量优化，双语平行）**：
  - 安装段改为 **npm 优先**：`dsh plugin --profile <profile> add dsh-skills-zhiyin`；保留本地目录与 tarball 两种方式；
  - 新增**镜像延迟说明**：国内镜像未同步新包时表现为 404，加 `--registry=https://registry.npmjs.org/` 即可（实测事实，非推测）；
  - **修正一处过期声明**：原文写「运行要求：Node.js ≥ 24；宿主共享包 @deepseek-ai/dsh-llm / dsh-skill / dsh-tools」，而 `package.json` 现在**没有任何依赖**、`engines` 只有 `dsh`。改为「DSH ≥ 0.2.2-rc.5（见 engines.dsh）；本包无运行时依赖、无生命周期脚本，安装不触发构建也不需要构建授权」。
  - **开发段**同步：去掉已成空操作的 `npm install`（原注释「安装依赖」已不成立），补发布方式（发 GitHub Release → OIDC 工作流发布，或本地 npm publish）。
  - 双语互链与本地链接全部核对通过（README.md ↔ README.en.md、LICENSE、NOTICE、banner）。
- **命令验证**（shuxu Step 5，全部无副作用）：
  - `dsh plugin --profile <p> add dsh-skills-zhiyin` → **[已运行验证]**（隔离 DSH_HOME；本机因镜像 404 需加 --registry，已单列说明）；
  - `dsh plugin --profile <p> add dsh-skills-zhiyin --registry=https://registry.npmjs.org/` → **[已运行验证]**；
  - `dsh plugin --profile <p> add <本地目录>` → **[已运行验证]**（34ms，link 风格依赖）；
  - `npm pack` + `dsh plugin add <tgz>` → **[已运行验证]**（74ms）；
  - `node --check index.js` / `client.js`、`npm pack --dry-run` → **[已运行验证]**。
- **开发期安装方式：不切换**。当前 profile 用 `link:D:\Workspace\Code\dsh-skills-zhiyin`，是开发态。若改为 npm 安装：
  - 会被钉在已发布的 0.1.0，任何改动都要「升版 → 发布 → 重装」才能看到，迭代成本显著上升；
  - 本地 link 下改完只需**完全重启 DSH** 即可生效，这正是 AGENTS.md 里保留的路径。
- **建议的验证方式**：需要确认「发布出去的产物」时，另开一个一次性 profile（如 `dsh plugin --profile npm-check add dsh-skills-zhiyin --registry=...`），用完即弃；主 profile 继续用 link 开发。
- **数据不会因删除插件而丢**：state 存在 `<profile>/zhiyin-proto/`（技能包 / 停用项 / 备注 / 收藏），与包安装位置无关；删包重装后数据仍在。

## DEC-037: npm 0.1.0 发布成功并验证可装；市场 PR CI 全绿；发版改为 OIDC 可信发布

- **日期**：2026-11-24
- **用户端完成**：账户 `ergeaia` 开启 2FA（安全密钥 / passkey，模式 authorization and publishing）→ `npm publish` 走浏览器认证 URL → `Authentication Successful` → `+ dsh-skills-zhiyin@0.1.0`。
- **registry 实测**：
  - `dist-tags.latest = 0.1.0`；`shasum = 6d3d15c327446655cf4865f4b2ce4ca24e5b271c`（与本地 dry-run 完全一致）；
  - `engines.dsh = >=0.2.2-rc.5`、`dsh.bundle.patch`、`dsh.client` 均在 registry 元数据里可查；`license = Apache-2.0`。
  - 版本列表出现 `0.0.0-stage`：这是 **npm 自己的暂存发布占位包**（description 原文 "Temporary package placeholder for staged publishing"，2 文件 / 339B），由浏览器认证流程自动创建，非我们发布；`latest` 指向 `0.1.0`，不影响用户。
- **安装验证（关键）**：隔离 `DSH_HOME` 里 `dsh plugin --profile npm-test add dsh-skills-zhiyin` → `+ dsh-skills-zhiyin 0.1.0`，4.8s，22 文件，`--dump-config` 含 `- id: zhiyin`。
- **发现的真实坑**：本机 pnpm 走**华为云镜像**（`repo.huaweicloud.com`），该镜像尚未同步本包（404），导致 `dsh plugin add dsh-skills-zhiyin` 直接失败；加 `--registry=https://registry.npmjs.org/` 才成功。**推论**：国内配置镜像源的用户，在镜像同步前会装不上；这是分发侧必须知道的边界，不是包的问题。`npm_config_registry` 环境变量对 pnpm 无效，只能传 `--registry`。
- **市场 PR**：`#18245` CI 全绿（`Submission gate: pass` / `check: pass`），等维护者评审。条目无需补 npm 字段——市场生成器从仓库 `package.json` 的 name 自动派生。
- **发版流程改造**：新增 `.github/workflows/publish.yml`，用 OIDC 可信发布（`id-token: write` + `npm publish --provenance`），不再持有令牌；含「tag 与 package.json 版本一致」校验与发布前语法/包内容自检。
- **待用户做**：在 npmjs.com 包设置里登记 Trusted Publisher（仓库 + 工作流名 + 环境），否则工作流无权限发布。

## DEC-036: 路线 A 失败的真因——账户根本没有 2FA

- **日期**：2026-11-24
- **用户实测**：`npm publish` 仍报同一个 E403，且**全程没有出现 OTP 输入提示**。
- **`npm profile get` 关键事实**：
  - `name: ergeaia`，邮箱已验证；
  - **`two-factor auth: disabled`** ← 根因；
  - `created: 2026-11-23`（全新账号）。
- **诊断修正**：我此前把 E403 理解为「发布时需要输入 OTP」，实际是 npm 要求**账户自身先开启 2FA**才允许发布。`.npmrc` 里的 `_authToken`（来自 `npm login`）只能证明登录，不能替代账户级 2FA。所以「路 A」不是被 2FA 弹窗挡住，而是账户还没开 2FA，npm 连问都不问直接拒绝。
- **正确步骤（必须由用户本人做，涉及扫码与恢复码）**：
  1. npmjs.com 登录 `ergeaia` → 头像 → **Account Settings** → **Two-Factor Authentication** → **Enable 2FA**；
  2. 选 **Authenticator app (TOTP)**（用手机验证器扫二维码，输入 6 位码确认）；
  3. **务必保存恢复码（recovery codes）**——换手机/丢验证器时唯一入口；
  4. 2FA 模式选 **Authorization and Writes**（发布会要求 OTP）；
  5. 回到仓库根目录重跑 `npm publish` → 这次会提示输入 OTP → 输入即发布成功。
- **与公告的关系**：DEC-035 的结论不变——bypass-2FA 令牌路线（2027/01 起失去直接发布）仍然否决；先开 2FA 是公告之外、npm 一直就有的前置条件，也是后续走可信发布（OIDC）的前提之一。
- **后续**：发布成功后，我验证 `dsh plugin add dsh-skills-zhiyin`，然后建 GitHub Actions OIDC 可信发布工作流。

## DEC-035: 依据 npm v12 / 2FA-bypass GAT 弃用公告，否决「路 B」，改用 OTP 首发 + 可信发布

- **日期**：2026-11-24
- **依据**：GitHub Changelog 2026-07-08《npm install-time security and GAT bypass2FA deprecation》（用户提供）。三条与织音相关：
  1. **npm v12 GA，安装期安全默认值开启**：`allowScripts` 默认关（不跑 preinstall/install/postinstall 与隐式 node-gyp）；`--allow-git` 默认 `none`（**git 依赖不再自动解析**）；`--allow-remote` 默认 `none`。
  2. **2FA-bypass 细粒度令牌不再能跳过 2FA 做账户/包/组织管理动作**，预计 2026 年 8 月初生效（**已过期，即已生效**）。
  3. **2FA-bypass 令牌将失去直接发布能力**，预计 **2027 年 1 月**生效；发布面收窄为「读私有包 + 暂存发布（staged publish）」，真正公开需人工 2FA 批准。
- **对 DEC-034 的修正**：我给出的「路 B（创建带 bypass 2FA 的细粒度令牌后由我发布）」按第 3 条正在被废弃，属**短期可行、方向错误**的方案，予以否决。
- **修正后的发布路径**：
  1. **首发 0.1.0 用交互式 OTP**（`npm publish` 后按提示输入一次性验证码）。这是文章仍支持的路径，且首发必须先有包体存在，之后才能在 npmjs 配置可信发布。
  2. **后续版本走可信发布（OIDC）**：GitHub Actions + `id-token: write` + `npm publish --provenance`，长期不再持有发布令牌。仓库目前**没有 `.github/` 目录**，需新建工作流。
- **对分发策略的影响（比上一轮更重要）**：
  - 我们的包**零依赖、零生命周期脚本**（`scripts` 为空、`dependencies` 为空），因此 `allowScripts` 与 `--allow-git` 的收紧**不影响 npm 装织音**——这是 npm 分发相对 git 分发的结构性优势。
  - 反向风险：市场条目的 `url` 是 GitHub，用户若走 `github:` 安装，走的是**git 依赖**。DSH 转发给 pnpm（本机 pnpm 12.21.0），实测 git 安装当前可用；但这条路径依赖 pnpm 是否跟进 npm 的 `--allow-git` 收紧，**属需持续盯的边界，不是我们可以控制的**。
  - 结论：越早把 npm 分发打通，用户越不必依赖 git 安装。
- **本机现状**：npm 11.19.1（尚未升 v12）；pnpm 12.21.0（DSH 实际使用）。v12 的安装期收紧暂未影响本机，但发布侧 2FA 要求已经生效（E403 实测）。

## DEC-034: npm 首次发布被 2FA 策略拦下（E403），发布授权方式待定

- **日期**：2026-11-24
- **实测**：`npm publish` 返回 `E403` —— 原文 `Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.`
- **排查结果**：
  - `npm whoami --registry=https://registry.npmjs.org/` → `ergeaia`，登录有效；
  - `npm profile get` → `two-factor auth: disabled`；
  - 也就是说：账户虽已登录、2FA 显示未开启，npmjs 侧仍要求「发布动作」具备 2FA 或带 2FA 绕过的细粒度令牌。这是 npm 的发布策略，不是我们的配置问题。
  - 包名 `dsh-skills-zhiyin` 仍为 404（未被他人占用，也未发布成功）。
- **两种可行授权方式（都不需要把凭据交给我）**：
  1. **用户自行执行发布**：`npm publish`（在仓库根目录），按提示输入 OTP。凭据全程只在用户终端。
  2. **细粒度令牌 + 绕过 2FA**：用户在 npmjs.com → Access Tokens 创建 Granular Access Token，权限勾 `Read and write`、开启 `Bypass 2FA`，自己写进 `~/.npmrc`（`//registry.npmjs.org/:_authToken=...`），之后由我执行发布。**用户不要把 token 贴进对话**。
- **已就绪、与授权无关的部分**：`npm publish --dry-run` 通过（22 文件 / 119.9 kB，目标 registry.npmjs.org，shasum `6d3d15c327446655cf4865f4b2ce4ca24e5b271c`）；`npm pack` 的 tarball 在隔离 `DSH_HOME` 里安装成功。
- **市场 PR 同步状态**：`#18245` 仍 OPEN、mergeable、只改 1 个文件；CI `check` 长时间处于 pending（同时段其它 PR 也在排队）。

## DEC-033: 发 npm（首次分发）+ 同步提交 awesome-dsh-plugin PR

- **日期**：2026-11-23
- **npm 准备**（本条只记录已落地的改动）：
  1. 移除 `private: true`——npm 会直接拒发私有包；此前保留是因为开发期只做 junction 链接。
  2. 加 `engines.dsh: ">=0.2.2-rc.5"`。**只写实测下限**，与 `dsh-trust-check` 的写法一致（它写 `>=0.1.0-rc.8`）；`dshmarket` 干脆不写 `engines`。我们只在 0.2.2-rc.5 上验证过，写下限比写空声明诚实，也不至于像带上界那样在 rc 迭代期把用户挡在门外。
  3. 加 `publishConfig.registry: https://registry.npmjs.org/`。**本机 npm registry 指向华为云镜像**（`repo.huaweicloud.com`），不加这条会尝试往镜像发布。
  4. 包名 `dsh-skills-zhiyin` 在 npmjs 上 404 → 可用（用 `dshmarket` 做了存在性对照，排除「查询本身失效」）。
- **已实测的分发链路**（不需要发布即可验）：
  - `npm publish --dry-run` → 22 文件 / 119.9 kB / 目标 `registry.npmjs.org`；
  - `npm pack` 出 tarball → 隔离 `DSH_HOME` 里 `dsh plugin add <tgz>`，74ms 完成，`--dump-config` 含 `- id: zhiyin`。
- **未完成**：真正 `npm publish` 需要 npmjs 登录，本机 `npm whoami` 返回 ENEEDAUTH 且 `.npmrc` 无 token。**凭据只能由用户自己登录**，我不接手、不代填。
- **市场 PR**：
  - `gh` 授权账号 `ErgeAIA`（scopes: repo / read:org / gist / workflow）→ fork `ErgeAIA/awesome-dsh-plugin`，新建分支 `add-zhiyin`，只加 `data/plugins/ErgeAIA__dsh-skills-zhiyin.yml` 一个文件，PR 已开：https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/18245
  - PR 描述按其 `pr-body.md` 的勾选清单写，并说明机制（策略 provider 只列被停用候选、启用项落回原生 provider、不复制不改写技能文件）与依赖/网络边界（无运行时依赖、仅市场页与 GitHub 安装联网）。
  - `gh pr view` 确认 PR 只动 1 个文件、mergeable=MERGEABLE。
- **用户已确认**：同时发 npm；engines 参考热门插件；PR 授权由我执行。

## DEC-032: 按 awesome-dsh-plugin 线上规范核对提交方式，并实测市场安装链路

- **日期**：2026-11-23
- **为什么重核**：此前的条目草稿来自本地调研（`docs/design/ZhiYin-发布渠道调研.md`），不是规范原文。对外承诺前必须核对线上仓库，避免把「我以为的规范」当规范。
- **线上规范原文**（`awesome-dsh-plugin/awesome-dsh-plugin` 的 `contributing.md`，注意文件名是全小写，不是 CONTRIBUTING.md）：
  - 提交物**只有一个文件**：`data/plugins/<owner>__<repo>.yml`；两个 README 由脚本从 `data/plugins/*.yml` 生成，**禁止手工编辑**，也不需跑命令。
  - 字段：`url`（须与仓库完全一致）/ `name`（owner/repo）/ `category` / `description.en`（**唯一必填**，`zh` 可选）/ `icon`（可选，GitHub 托管位图）。
  - `category` 允许值含 `skill`。
  - **描述含「冒号 + 空格」必须加引号**，否则 YAML 解析成嵌套键。
  - 硬性要求：`package.json` 声明 `dsh.bundle`（只声明 `dsh.client` 是最常见被拒原因）、真实可用代码、**仓库创建满 1 天**、带 `dsh-plugin` topic、持续维护、描述属实不带营销词。
  - CI 只是前置条件，维护者会实际读仓库；**已有条目覆盖的会按「谁更好」判**。
- **本仓库逐条核对结果（全部通过）**：
  | 要求 | 实测 |
  | --- | --- |
  | `dsh.bundle.patch` | `./cordis.patch.yml`，文件存在（线上 HTTP 200，201B） |
  | 真实可用代码 | index.js / client.js / paths.js 共约 200KB，非占位 |
  | 仓库创建满 1 天 | 2026-11-17 创建，6 天 |
  | `dsh-plugin` topic | 已有（另有 deepseek-harness / dsh / skill-manager） |
  | category 合法 | `skill` ✅ |
  | 描述冒号空格 | 无，无需引号 |
  | icon 可访问 | `assets/icon-180.png` HTTP 200，image/png，3937B |
  | 依赖/构建 | `dependencies`、`devDependencies`、`scripts` 全为空 → git 安装不触发构建授权 |
- **实测安装链路**（此前从未验证，因为开发期一直用 junction 链接）：在隔离的 `DSH_HOME` 里跑市场用户的真实命令
  `dsh plugin --profile pr-test add github:ErgeAIA/dsh-skills-zhiyin`
  → 14s 安装完成，`+ dsh-skills-zhiyin 0.1.0`，**无构建授权提示**；`dsh --profile pr-test --dump-config` 输出含 `- id: zhiyin / name: dsh-skills-zhiyin`。测试目录已清理。
- **重复条目风险（已核实）**：列表里已有 3 个 `dsh-skill-manager` 条目（AKS1st 文件浏览编辑、DaLongggggg 列表/回收站、HighToward 分类型卡片）+ 1 个 `dsh-skill-palette`（输入框选技能）。它们的共同点是「整理/浏览/选取」，**都不控制模型实际看得见哪些**——这正是织音的策略 provider + 技能包门控所做的事。故条目描述改为以「控制模型此刻真正看得见哪些」开头，而不是「把技能编成包」，让差异在第一条就成立。
- **待用户决定（未擅自改）**：
  1. `private: true` 仍在——只挡 npm publish，不挡 GitHub 安装（已实测）。保留即「仅 GitHub 分发」。
  2. 无 `engines.dsh`——官方文档建议声明兼容范围，市场规范不强制；不加则装到任何版本都尝试加载。要给范围需先定准，不猜。
  3. `version` 仍锁 0.1.0（AGENTS.md 开发期约定）；市场条目本身不带版本字段。
- **结论**：提交方式符合规范，仓库无需改造即可提交；剩余是三项分发策略决策。

## DEC-031: 发布前双轴审查（Standards / Spec），修复 9 项真实缺陷

- **日期**：2026-11-23
- **基线**：`5759046`（本轮功能开发前的最后合并），范围 12 文件 / +532 行。两个子代理并行跑 Standards 与 Spec 两轴，互不污染上下文。
- **修掉的真实缺陷**（其余为判断题，已记录取舍）：
  1. **内联字标丢了一种颜色**：`WORDMARK_PATHS` 原用布尔标记橙色，导致 `#FF6A2B→#FF955C` 与 `#F2570F→#F26A1B` 被合并成同一个橙，页面上的字标实际只有两色。改为 `{ d, color }` 三值（paper/weave/light）+ 颜色表，与 logo.svg、交叉标记一致。
  2. **收藏不随配置迁移**：`EMPTY_STATE`、`/zhiyin/export`、`/zhiyin/import` 都没有 `favorites`，导出再导入会丢收藏。三处补齐；导入侧只收时间戳为正的条目，防脏值打乱置顶顺序。
  3. **回车绕过状态机**：输入框的 Enter 直接调 `loadMarket`，拿不到 burst/sync/done/error。改为与按钮同一条链路。
  4. **reduced-motion 规则打不中**：旋转用内联 `animation`，但 `@media` 里写的是 `.zhiyin-spin` 类，SVG 从未挂这个类。`Icon` 增加 `className`。
  5. **收藏统计卡英文界面仍显示中文**：label 与 hint 硬编码，`statFavorite` 词典键没被使用。改走 `say()`，并补 `statFavoriteHint`。
  6. **收藏计数可能虚高**：原先数 `favorites` 的键，卸载后残留记录会让数字大于列表实际条数。改为数「当前存在且已收藏」的技能。
  7. **刷新按钮在搜索时也转**：旋转绑在 `marketLoading` 上。改为自己的 `marketRefreshing`，动画只属于被点的那个按钮。
  8. **失败相位用了 info 图标**：新增 `alert`（圆 + 感叹）并改用。
  9. **同一份顺序前后端各算一次**（DEC-029 已记教训，实现未落地）：后端不再做收藏置顶，只按名称稳定输出；置顶由前端按 `favorites` 计算，顺序权威唯一。
- **一并清理**：抽出 `FavoriteButton` 组件消除卡片/列表两处重复；收藏路由变量 `on → favorited`；两处「宿主上限 60」过期注释；Star 入口注释描述的 hover 效果实际不存在，改为如实描述。
- **未采纳的判断题（明确取舍）**：
  - `WORDMARK_PATHS` 与 `assets/wordmark.svg` 双份：内联换来主题自适应与零请求，代价是改版要同步两处，已在 DEC-027 说明，接受。
  - 热门查询 5→10 组：不扩容则「加载更多」到不了 200（DEC-029），属于实现必需而非范围蔓延。
  - 列表行也有星标：与卡片视图保持一致；两个视图本就同构。
- **验证**：`node --check` 双半边 0；假 ctx 端到端验证导出含 favorites、导入后 favorites 与置顶标记恢复；客户端 4 个 slot 冒烟正常。
- **未验证**：五相位的真实运行时观感仍为 `needs-review`，需在浏览器内实际点击。

## DEC-030: 搜索按钮走 tuyi 五相位；市场页去重复刷新；左栏图标选中变橙

- **日期**：2026-11-23
- **① 市场页两个刷新图标**：标题行那个刷新（`onClick: load`，只重载 `/zhiyin/state`）在市场与归档页也会渲染，而这两页各自有语义正确的刷新按钮。已在 `tab === market || tab === archive` 时隐藏标题行那个——同一屏两个同名按钮，用户无法判断点哪个。
- **② 搜索动画（按 tuyi 判据）**：
  - **槽位**：动作（点它会发起真实异步请求）。
  - **准入三条全中**：真实异步（skills.sh 请求）、成败可判（`ok !== true` 即失败）、用户盯着等（结果替换整片列表）。→ 走编排层，不走单形态。
  - **原实现的问题**：只有「转圈 / 不转圈」两态，缺 burst（点到了）与 done/error（有结论），且失败与成功都回到同一个静止态，用户看不出结果。
  - **实现五相位**：idle → burst（一次性 1px 轻推 + 150ms）→ sync（Spinner 旋转 + `aria-busy` + disabled）→ done（绿 + 勾 +「已更新」/ 驻留 1.5s）或 error（红 + 感叹 +「失败」/ 驻留 3s）→ idle。
  - **为什么 done/error 不抖动**：tuyi 明确「抖动只留给输入校验」；这里是任务结论，用结论色静态表达。驻留时长按 proposal 锚点（成功 1.5s、失败 3s），项目暂无动效令牌，已在记录中标 proposal。
  - **中断与清理**：sync/burst 期间按钮 disabled（重入被挡住）；组件卸载清全部定时器，避免回写已卸载组件。
- **③ 左栏图标选中变橙**：NavIcon 增加 `style.color`——选中 `#F26A1B`，未选中 `inherit`（跟随主题）。只改颜色不改形状，符合 tuyi「筛选/导航开合态只改色」的约定。
- **验证**：`node --check` 0；假 window（含 setTimeout/clearTimeout 桩）冒烟 4 个 slot 正常。
- **未验证**：相位的真实运行时观感（需要浏览器内点击），标 `needs-review`。

## DEC-029: 收藏置顶失效的真因；市场上限其实是 200 不是 60

- **日期**：2026-11-23
- **① 收藏没置顶（用户反馈）**：后端排序是对的，但**前端又排了一遍**——`skills` 的 useMemo 里按 `sortField` 重排，把收藏置顶完全覆盖。修法：前端排序前先按 `favorite` 分两组，收藏组恒在最前并按收藏时间倒序，组内再套 `sortField`。教训：同一份顺序不要在后端和前端各算一次，只保留一处权威。
- **② 只看收藏筛选**：统计卡里新增「收藏」卡片（只在有收藏时出现，避免永远为 0 的空卡），点击只看收藏，再点回全部。
- **③ 市场刷新无执行态**：市场页此前**没有刷新按钮**（`tab !== market` 才渲染），搜索按钮虽然会转圈但位置不对应。新增独立刷新按钮，`Icon` 增加 `spin` 属性，加载时图标持续旋转；补 `@keyframes zhiyin-spin` 并遵循 `prefers-reduced-motion`。
- **④ 市场上限：实测推翻我之前的说法**。我之前说「60 是 skills.sh 的上限」，这是错的——那只是宿主代码里写死的 `Math.min(…, 60)`。实测：
  - `limit=20/40/60/100/200` 分别返回对应条数；`limit=300/500/1000` 一律截到 **200** → **真实上限 200**；
  - `offset` 参数**无效**：offset=0/20/180 返回完全相同的 20 条，是假分页。所以只能一次取满，不能翻页。
  - 修法：宿主上限 60 → 200；客户端 `MARKET_MAX = 200`，「加载更多」+20 直到 200；热门查询词从 5 组扩到 10 组、每组按目标条数拉取（原先固定 20，导致热门最多约 100）。
  - 实测：热门 limit=200 返回 200 条，搜索 python limit=200 返回 200 条。
- **下一步可做**：200 已是接口单次上限，要更多只能换关键词做多组查询合并（热门模式已是这个思路）。

## DEC-028: 技能收藏（置顶）+ 市场「加载更多」

- **日期**：2026-11-23
- **收藏**：
  - 存储：`state.favorites` 记录「技能名 → 收藏时间戳」，只写本地配置，不碰技能文件；随配置导出迁移。
  - 接口：`POST /zhiyin/favorite { name, value }`，`value=true` 写入时间戳、`false` 删除。
  - 置顶规则：收藏项按**收藏时间倒序**排在前，其余按名称升序。用时间戳而不是布尔值，是为了让「最近收藏的」浮到最上面。
  - UI：卡片与列表行的名称前加星标按钮；未收藏是灰色空心星（opacity 0.32），收藏后点亮为强调色实心星。
- **市场分页**：
  - **原状**：单次 `limit=40`（宿主上限 60），无分页；热门模式是 5 组查询各取 20 条、去重后按安装量排序再截 40。
  - **现在**：`limit` 变成状态（默认 40），「加载更多」按 +20 递增直到 60；按钮显示 `当前条数 / 60`。到 60 或结果为空时按钮消失。
  - **上限为什么是 60**：宿主路由把 `limit` 夹在 1–60（`Math.min(Math.max(…),60)`），这是 skills.sh 单次搜索的返回上限，不是我们随便定的。想突破 60 需要改成真正的分页参数（skills.sh 搜索 API 目前没有 offset/page 参数）。
- **验证**：假 ctx 跑真实路由——收藏前 `alpha★ → zebra★ → middle`（按收藏时间倒序）、收藏 middle 后 `middle★ → alpha★ → zebra★`、取消 zebra 后 `middle★ → alpha★ → zebra`；`favorites` 字段随 state 返回；路由数 23；客户端 4 个 slot 正常。

## DEC-027: 字标改为三色并与交叉标记同步；logo 去背景；插件页内联字标

- **日期**：2026-11-23
- **背景**：用户要求 ① 清除字标背景只留文字；② logo 仍用三条线交叉标记 + 字标；③ 字标笔画改三色，与交叉标记的三色对应；④ 字标放进插件页。
- **决策**：
  1. **三色映射**（与三条股线一一对应）：描摹稿的黑色笔画 → `#F7EDE4`（Paper，对应第三条股线），深橙 `#F2570F` → `#F26A1B`（Weave，第二条），亮橙 `#FF6A2B` → `#FF955C`（WeaveLight，第一条）。
  2. **logo 去背景**：删除底板矩形与描边，viewBox 收缩到实际内容（221×80），透明底；标记 68px、字标 56px 高、间距 22。
  3. **双主题**：`logo.svg`/`wordmark.svg` 为深色主题（Paper 笔画）；`logo-light.svg`/`wordmark-light.svg` 为浅色主题（Ink `#202022` 笔画）。橙色两版都保留。
  4. **插件页内联**：字标以 `WORDMARK_PATHS` 数组写进 `client.js`，用 `currentColor` 画底笔画——跟随宿主主题自动变色，橙色点缀固定品牌色；不引入外部图片请求。英文界面仍用文字 `ZhiYin`（字标是汉字）。
- **取舍**：内联路径让 client.js 增加约 3.4KB，换来主题自适应与零额外请求；若日后字标改版需要同步改代码。

## DEC-026: 字标可用——上一轮的「不可用」是我处理失误，不是源文件问题

- **日期**：2026-11-23
- **更正 DEC-025**：上一轮我判定用户提供的描摹字标「不可用」，理由是渲染被读成「知音」、字符结构丢失。**这个结论是错的。**
- **真实原因**：清洗 `data-darkreader-inline-fill` / `style` 属性时，我把 `style` 整条删掉了，而 `c05` 这条路径的 style 里除了 darkreader 变量还有 `display: none`——它是描摹工具标记的冗余笔画，本来就该隐藏。删掉 style 后这条笔画被画了出来，叠在「音」字上，看起来就像字形错乱。
  - 证据：原文件 14 条路径，`c05` 的 style 为 `--darkreader-inline-fill: ...; display: none;`；我上一轮产物含 14 条，本轮修正后为 13 条。
  - 对照实验：把原始文件**原封不动**复制渲染，字标清晰可读；按原样保留 `display:none` 重建后同样清晰。
- **结论**：字标本身没问题，可用。已接入：
  - `assets/wordmark.svg`（深底版，黑→纸白）与 `assets/wordmark-light.svg`（原色版）；
  - `assets/logo.svg` 横版标识：标记 + 字标 + 分隔线 + AGENT SKILL ORCHESTRATION，viewBox 按字标实际宽高重算；
  - `assets/banner.svg` 中文版标题位换成字标。
- **边界**：该 SVG 是「织音」**两个汉字**（glyph-01=织，glyph-02=音），不含 ZhiYin 拉丁字标。所以英文 banner 仍用文字 `ZhiYin`——硬套汉字会变成中英混排的错位。
- **教训（写入 debug-log）**：清洗 SVG 属性时，`style` 里除工具注入的变量外可能还带**语义属性**（display/visibility/opacity）。只应剔除已知的注入项，不能整条删除；改完必须与原文件做像素级对照。

## DEC-025: 描摹字标不可用作标题；备注改为 hover 呈现（字标部分已被 DEC-026 更正；备注徽标已被用户在 DEC-030 之后改为「悬停卡片显示备注」，徽标与查看弹窗已移除）

- **日期**：2026-11-23
- **描摹字标**：用户提供 raster2svg 产物（374×194，14 条路径）。试装结论：
  - 独立渲染被读成「知音」而非「织音」，字符结构丢失；
  - 横版 logo 里两字难以辨认；
  - banner 标题位缩成小图形，失去主标题功能。
  - **根因**：路径数量太少（14 条）承载不了汉字笔画，且描摹源分辨率有限。
  - **处置**：品牌文件回滚到文字标题版；描摹稿存 docs/assets/wordmark-traved-v1.svg 留档；等高保真源（设计工具直出矢量，或 ≥1024px 位图重描）。
- **备注交互**：技能卡不再整行展示备注正文——与描述抢版面、视觉重。改为「备注」小徽标：有备注才出现，悬停 tooltip 看全文，点击打开完整备注弹窗；无备注不渲染任何东西。同时删掉技能名 hover 显示路径的 tooltip（与「打开目录」功能重复）。

## DEC-024: 影子候选不能自指；known 改为观测快照

- **日期**：2026-11-23
- **背景**：BUG-013——界面显示 113 个技能，模型目录却拿到全部技能。根因是 `shadowCandidates()` 用 `collectState` 的观测结果（来自已合并快照）跳过「已观测到」的技能，而正是这些技能需要被关闭态影子压住。稳态影子数从 66 归零。
- **决策**：① 影子候选对所有策略判定为隐藏的技能生成，不看它是否已被观测到；② `state.known` 从累积历史改为本轮观测快照，让磁盘上删除的技能自然退出，继续避免陈旧影子造成的计数抖动；③ 删掉 `observedSkillNames`。
- **取舍**：known 不再保留「曾经见过但当前不在观测里」的元数据；代价是特定 cwd 下的元数据会被暂时清掉、下次重建，换来停用真正生效且计数稳定。

## DEC-023: 图标尺寸以第一方代码为准——列表 30px / 卡片 36px

- **日期**：2026-11-23
- **背景**：我曾把「插件列表图标多大」当成需要用户目视确认的事，被用户纠正。正确做法是从 DSH 第一方代码里查，不靠猜。
- **证据（从 app.asar 解包 `@deepseek-ai/dsh-client-ui-plugin-manager` 源码取得）**：
  - `src/client/PluginManagerPage.tsx`：`const ROW_ARTWORK_SIZE = 30`、`const CARD_ARTWORK_SIZE = 36`；`PackageArtwork` 用 `<img width={size} height={size}>` 直接渲染。
  - `src/client/PluginManagerPage.module.css`：`.rowIcon` 外框 40×40px、`.cardIcon` 外框 `var(--card-icon-size)` = 48px。
  - 即 package.json 的 `icon` 实际以 **30px（列表）/ 36px（卡片）**显示，不是我先前假设的 16–20px。
- **决策**：`package.json` 的 `icon` 从 `icon.svg` 改为 `icon-small.svg`。理由：带间隙的主标识在 36px 下间隙仅 0.75px，会被抗锯齿吃掉、股线碎成弧（见 40px 与 20px 实测）；紧凑版无间隙、描边加粗到 9.6，在 32px 下三股线连通可辨。
- **分面**：`icon-small.svg` 用于 DSH 内；`assets/icon-180.png`（带间隙的完整标识）仍用于 awesome-dsh-plugin 市场条目——两个尺寸两个版本，不要用同一张缩放。
- **教训**：推测渲染尺寸并把它当成用户要确认的问题，是把自己的调研义务外包。以后凡是宿主 UI 的行为，先查宿主代码（asar 头部索引可解包），再问人。

## DEC-022: banner 换成新标识语言；小尺寸另做 compact 变体

- **日期**：2026-11-23
- **背景**：换用 Logo Kit v2 后，README banner 仍是旧视觉（音符点缀 + Ember 深棕 + 宋体标题），与「三条股线 + Ink/Paper」的新标识在同页打架。另外实测 2 单位间隙在 20px 下不足 1px，图标会退化成色块。
- **决策一：banner 保留版式、替换语言**。版式（左文案 + 右三阶段图）经上一轮验证有效，不动；换的是视觉：
  - 配色 Ink #202022 / Paper #F7EDE4 / Muted #A99A8F / Weave #F26A1B / WeaveLight #FF955C；
  - 标题改无衬线 800（与横版 logo 的「织音」一致），不再用宋体；
  - 删掉全部音符点缀（kit 明确要求独立符号不得叠加音符与声波）；
  - 第三阶段（成品卡）内部直接嵌入新标识本身，把「编成一份目录」画成「织成一条线」——banner 收尾与 logo 同构。
- **决策二：小尺寸独立文件，不缩放**。新增 `icon-small.svg`：同一几何、描边 7.4→9.6、**去掉交叉间隙**。理由：20px 下间隙不足 1px，留着只会把线条切碎；去掉后三股线连通，仍可辨为三笔交织。已在 20/24/32px 目视验证。
- **验证**：中英两版所有文本按 CJK 1em / 拉丁 0.56em 估算宽度，11 项全部未越界（英文最长项 499 vs 上限 716）；中文版 Puppeteer 渲染目视确认版式、图注、命令串无误（渲染描述把 owner 误读成 ErgAIA，已用字符串比对排除）。
- **未验证**：英文版截图未返回可用描述，仅通过宽度自检，需用户目视。

## DEC-021: 采用 Logo Kit v2，并修掉 kit 本身的三处缺陷

- **日期**：2026-11-22
- **背景**：用户提供 `Desktop/zhiyin-logo-kit-v2`，要求用 `zhiyin-icon.svg` 作插件图标，并说「另外几个图片看着有点问题」，同时让清理 SVG 里的垃圾。
- **核出的缺陷（均有证据，不是观感）**：
  1. **横版 logo 是非法 XML**：`zhiyin-logo-dark.svg` / `zhiyin-logo-light.svg` 各有三个 `</g>` 但只对应两个 `<g>`；严格解析器报 `The 'svg' start tag ... does not match the end tag of 'g'`。浏览器宽容所以「能看」，非浏览器场景（设计工具、部分构建链路）会直接失败。
  2. **交叉间隙只写在说明里，没写进文件**：README 称「被压住的股线在交叉点留出背景间隙」，但三个 SVG 的路径是原始叠压，没有任何遮挡处理——这正是导出图「粘连」的来源。数值验证：A×B 交于 (42.7, 57.3)，B×C 交于 (33.8, 38.7)，A×C 最近距离 19.8（不相交），与「两处交叉」的说法一致。
  3. **README 的「交叉结构修订」段重复 4 次**。
- **修法**：用 `mask` 实现让路——把压在上面的那段股线（宽 11.4，即本体 7.4 + 两侧各 2）画成黑色，蒙在下面的股线上。选 mask 而不是「用背景色描一圈」，是因为背景色描边在透明底（mark / mono）上会变成实心补丁，mask 才能真正透明。
- **清理**：本机 svgo 4.1.0（全局已装）跑 `--multipass`；`icon.svg` 1486→1305B，`assets/logo.svg` 重建并清理到 1992B；mask、`<title>`、`aria-label` 均保留（svgo 会丢掉 `role="img"`，已补回）。
- **已知边界**：间隙宽度是 2 单位（96 单位坐标系，约 2%）。180px 下间隙≈3.7px，成立；40px 下路径已开始碎成弧线，20px 下间隙不到 1px、图形退化为色块。要供小尺寸使用需要另做「compact 变体」（去掉间隙或加粗股线），不要直接缩放。
- **未动**：README banner（`assets/banner.svg`）仍是旧视觉（音符 + Ember 深棕 + 宋体标题），与新标识的三股线语言不一致，需要单独重做。

## DEC-020: 市场卡片图标用代码光栅化，不走浏览器截图

- **日期**：2026-11-22
- **背景**：收录条目建议提供 GitHub 托管的位图图标。本会话 Playwright 后端超时、Puppeteer 多次报 `Requesting main frame too early`，浏览器截图这条路不可靠。
- **决策**：用 Node 的 `zlib` 写一个极简光栅化 + PNG 编码器（无第三方依赖），把 `icon.svg` 的几何（圆角底、描边、旋转椭圆符头、符干、二次贝塞尔符尾）在 64 单位空间里用 4×4 超采样重绘，直接输出 PNG。
  - 产物：`assets/icon-180.png`（3.0KB，市场卡片用）、`assets/icon-512.png`（9.5KB，文档/social 用）。
  - 圆角矩形外为透明，因此深色/浅色主题下都能贴。
- **代价与边界**：这套光栅器只认这几个形状，图标改设计就要同步改脚本；但它**不依赖浏览器**，可重复、可版本化，比截图稳。
- **验证**：两文件签名 `89504e47…` 与 IHDR 尺寸（180×180 / 512×512）正确；用 read_image 目视确认音符形状、描边与圆角均符合设计。

## DEC-019: 采用 Apache-2.0 —— 只要求署名，不要求下游开源

- **日期**：2026-11-22
- **背景**：仓库此前无许可证（等于保留所有权利，别人连合法使用都不行）。用户先提 Apache-2.0 并描述为「使用了代码后也必须开源」，随后明确需求其实是「带上来源信息即可」。
- **澄清**：Apache-2.0 **不是** copyleft，与 MIT 同属宽松许可——允许闭源与商业使用，不要求下游公开源码。它比 MIT 多的是**专利授权**（第 3 节）、**NOTICE 保留**（第 4d 条）与**修改注明**（第 4b 条），商标不在授权范围。真正「用了必须开源」的是 MPL-2.0（文件级）、GPL-3.0（作品级）、AGPL-3.0（含网络服务）。
- **决策**：选 **Apache-2.0**，理由是它精确匹配「署名即合规」的需求，同时对使用者最友好（插件要有人装才成立）。
- **落地**：
  1. `LICENSE` 用 apache.org 原文逐字落盘（11,358 字节，未手打，避免篡改条款）；
  2. `NOTICE` 写项目名与版权年（Apache-2.0 §4d 要求随分发保留）；
  3. `package.json` 增 `license: "Apache-2.0"`，并把 LICENSE 与 NOTICE 加入 files 白名单（npm 会自动带 LICENSE，NOTICE 不会，必须显式列）；
  4. README 中英各写一段**人话版许可说明**：能做什么、只需做哪三件事、专利与商标的边界；不满足于只给一个 SPDX 标识。
- **验证**：LICENSE 关键锚点（Apache License / Version 2.0 / TERMS AND CONDITIONS / 1. Definitions / 4. Redistribution / 9. Accepting Warranty）逐项命中；`npm pack --dry-run` 输出含 LICENSE 11.4kB 与 NOTICE 107B，共 16 文件。
- **未采纳**：MPL-2.0 / GPL-3.0 / AGPL-3.0 —— 都会限制下游闭源使用，与「署名即可」的目标相反，且 GPL 系在「插件加载进宿主进程」的场景存在链接灰区。

## DEC-018: CHANGELOG 只留用户可见结论；补 GitHub 入口；准备社区市场收录

- **日期**：2026-11-22
- **背景**：用户指出 CHANGELOG 写成了 git log（19 条新增 + 11 条修复，含内部实现细节）。同时要求设置页加 GitHub 图标，并调研如何进 awesome-dsh-plugin 收录。
- **决策**：
  1. **CHANGELOG 按「用户能感知的结论」写，不按提交写**：中文 59 行压到 40 行；同类合并（市场/安装合成一条、归档与技能包合成一条）；删掉 TDZ、影子候选、事件循环这类实现细节，只保留现象与结果。技术细节留在 debug-log 与 decision-log。
  2. **GitHub 图标**：头部新增第 4 个图标按钮，点击在新标签打开源码仓库。地址用字符串拼接常量（避免被其它工具误改），图标取 Feather 的 octocat 描边路径，与现有图标集同风格。
  3. **依赖归位**：三个 `@deepseek-ai/*` 实测一行都没被 import（index.js 只用 Node 内置 + ./paths.js，client.js 从宿主 require react），故直接删除而非移到 peerDependencies；顺手补 repository / homepage / bugs 字段，npm 与市场卡片才有出处。
  4. **收录准备**：条目写成 docs/design/awesome-dsh-plugin-entry.yml（不随包分发），字段按贡献指南：url / name / category: skill / description.en（必填、句号结尾）/ description.zh。
- **收录门槛核对**（依据 awesome-dsh-plugin/contributing.md 原文）：
  - 仓库需在 package.json 声明 `dsh.bundle` —— 已满足（patch: ./cordis.patch.yml）；只声明 `dsh.client` 会被拒。
  - 仓库年龄 ≥ 1 天 —— 已满足（创建于 2026-11-17）。
  - 官方 `@deepseek-ai/*` 必须在 peerDependencies 而非 dependencies —— 已满足（直接删除）。
  - GitHub topic `dsh-plugin` —— 已打。
  - 一个 PR 最多 3 条；只需`data/plugins/<owner>__<repo>.yml` 一个文件，README 由脚本生成、不要手改。
- **未完成项**：市场卡片图标建议用 GitHub 托管位图；本会话 Playwright/Puppeteer 渲染均超时，暂未产出 `assets/icon-180.png`，条目先省略 icon 字段（会回退到作者头像）。

## DEC-017: 界面文案必须双语，包名去掉 @local，清掉组合层遗留

- **日期**：2026-11-22
- **背景**：用户发现「目录字符数」在英文界面仍是中文。排查后确认根因不是漏翻一条，而是 **86 个 say() 调用只有中文兜底、词典里从未有词条**——市场、归档、安装流程、成本弹窗整片都是这样。同时处理挂账已久的三条清理。
- **决策**：
  1. **翻译补进词典而不是继续靠兜底**：86 个 key 同时写入 zh 与 en 两个词典块，`say()` 不再有「词典查不到、只能吃中文字面」的路径；日后新增文案必须两边都写。
  2. **包名改 `dsh-skills-zhiyin`**：`@local/` 是本地链接别名，既不能发布也无法在 GitHub 安装后自洽。四处联动改：`package.json` name、`cordis.patch.yml` name、`client.js` 模块 id、本机 profile 的依赖键 + `pnpm-lock.yaml` + `node_modules` 链接（后者已从 `@local/` 目录移到顶层，空目录一并删除）。
  3. **删 `consumer.js`**：M0 预设级消费者的遗留实现，从未挂载；同步去掉 `exports["./consumer"]` 与 `files` 条目。
  4. **删 `/zhiyin/combo` 与 `/zhiyin/intent`**：页面早已不调用，只留在宿主里当死代码；连带删掉只被它们使用的 `previewIntent` 与 `comboNameTaken`。`state.combos` / `state.intent` 字段**保留不删**，避免已存在的 state.json 失去结构。
- **验证**：`node --check` 双半边 exit 0；假 ctx 跑 apply 得 **22 条路由**（原 24，减去 combo 与 intent）；`say()` 用到但词典缺失的 key **0 条**；客户端模块 id = `dsh-skills-zhiyin`，四个 slot 注册不变；`npm pack --dry-run` = 14 文件；通过新链接读到的包名与仓库一致。
- **风险与回滚**：包名变更后必须完全重启 DSH 才会按新 key 解析；若新 key 未被识别，把 profile 里 `dsh-skills-zhiyin` 改回 `@local/dsh-zhiyin-proto` 并重建链接即可回退。

## DEC-016: banner 定稿用「散点汇聚」，并补齐 logo 与点缀

- **日期**：2026-11-22
- **背景**：v1（三条织线 → 声波）与名字结合紧，但第一次看仓库的人读不懂「三层开关」。用户看 v2 后定为门面版，并要求加入音符与技能元素的点缀，以及一个正式 logo。
- **决策**：
  1. **banner 定稿 = v2（散点汇聚）**：32 个技能条 → 4 个技能包卡（卡内三条成员细杠）→ 一张带声波的成品卡；标题改中文衬线「织音」（Noto Serif SC 900），英文由 captionEn 承担。
  2. **v1 不删**，移到 `docs/assets/banner-threads.svg` 存档，留给宣传图（朋友圈/公众号主图）用。
  3. **点缀分三级**：左右留白放 opacity 0.09 的水印音符；散点簇左侧放技能层叠图标（0.15）；成品卡上下放三枚音符（0.45–0.9）表示声波升起。点缀不得压字、不得越出内容界。
  4. **logo 两件套**：`icon.svg`（方形徽标，音符 + 双谱线）作插件图标；`assets/logo.svg`（深色底板横版徽标：标记 + 织音 + ZHIYIN + 一句 tagline）供文档与市场展示。
- **取舍**：
  - 徽标自带深色底板——纯透明字标在 GitHub 浅色主题下会消失，加底板才能两边都成立；代价是它更像「徽章」而非纯字标。
  - 小尺寸下谱线会糊：图标最终去掉谱线，只留加粗音符（head rx 11.5 / stem 6），32px 仍可辨。
  - 点缀用了 #c23e12 / #8a4a2e / #5a4038，均在强调色族内，未引入第二色相。
- **验证**：banner 9.9KB、logo 1.3KB、icon 555B，均通过 viewBox / 顶带 / L 形标记 / 网格 opacity / 无 script 与外链图自检；Puppeteer 渲染逐一目视（含 32px 图标）；npm pack = 14 文件。

## DEC-015: 品牌名要靠文案讲清，banner 用「织线→声部」承载

- **日期**：2026-11-22
- **背景**：用户指出「描述里面要将『织音』这个名称的含义表达出来」。此前所有文案都只把织音当产品名用，没人解释「织」与「音」指什么；README、package.json、GitHub Description 三处描述互相不一致，且 package.json 的描述还残留「冲突」这种已移除的功能。
- **决策**：
  1. 统一口径：**织 = 把散落的技能编成一支谱；音 = 模型此刻奏响的那一支**。技能是乐器、技能包是声部、模型读到的目录是乐章。
  2. 三处描述同步改写（README 首段 + package.json description + GitHub 仓库 Description），README 中英各加一段「名字是什么意思」。
  3. Banner 用同一隐喻做右侧图形：三条横线＝三层开关（全部技能／技能包／单个技能），线上技能块自上而下变少，第三层收束成声波，末端强调色圆点。走 tuhua 的 ④ 定制优先，不套通用卡片积木。
- **取舍**：custom-threads 脱离 tuhua 既有图元库，后续换尺寸需重画；换来的是图形与名字同源，删图即失义。
- **验证**：banner.svg 4.9KB、viewBox 1200×400、顶带与 L 形标记齐备、网格 opacity 0.035、无 script/foreignObject/外链图；Puppeteer 渲染截图确认无压字越界；npm pack --dry-run = 13 文件（含 assets）。

## DEC-014: 用户指南并入 README，插件页只读其中标记段

- **日期**：2026-11-22
- **背景**：DEC-013 把指南做成独立的 GUIDE.md / GUIDE.en.md，README 只给一句导航。用户提出：README 是 GitHub 落地页，把用法直接放进去更好，读者不用再点一层。
- **决策**：合并。README.md / README.en.md 的「使用」段承载完整操作说明（装技能、目录选择、三层开关、技能包互斥、归档恢复、目录字符数、备份、常见问题），删除独立的 GUIDE 两份文件。插件页的指南弹窗改读 README，只取 `<!-- guide:start -->` 与 `<!-- guide:end -->` 之间的内容——已装插件的人不需要看到「npm install / npm pack」这类开发者步骤。
- **为什么用标记而不是另存一份精简版**：指南正文必须单一来源，抄第二份必然漂移。标记在 GitHub 渲染时不可见，对读者零影响；标记缺失时宿主退化为返回整篇 README。
- **代价**：README 变长约一倍（中文 4.5k 字符）；宿主依赖两个 HTML 注释作为约定，误删会退化成整篇。
- **验证**：npm pack --dry-run = 11 文件；假 ctx 24 条路由，/zhiyin/guide 200 且只返回标记段（zh 2766 / en 5867 字符）；渲染器对两段各产出 39 / 38 个块（10 标题、4 表格、4 列表）；README 内相对链接 0 断链。

## DEC-013: 插件包放仓库根，README 只写项目说明，指南进插件页

- **日期**：2026-11-22
- **背景**：用户指出三件事：① README 里写了「开发期私有仓库」「界面中英双语」「分发口径」这类与用户的约定，这些不该出现在项目说明里；② 仓库要能在 GitHub 上正常下载到「插件本身」，而现在插件在 prototype/ 子目录，下载后还得 cd 进去，且 prototype（原型）这个名字与实际不符；③ 使用指南只在仓库里，插件页里看不见。
- **决策**：
  1. **插件包移到仓库根目录**。GitHub clone / Download ZIP 得到的就是可装插件，目录名不再是「原型」。开发文档仍放 docs/，由 .gitattributes 的 export-ignore 排除在下载包外；npm 包内容仍由 package.json 的 files 决定。
  2. **README 只写项目说明**：定位、功能、安装、使用入口、写盘边界、已知限制、开发命令。内部协作约定、分发口径、进度叙事一律写 docs/agents/，不进 README。
  3. **GUIDE 进插件页**：宿主新增只读路由读取随包分发的 GUIDE.md / GUIDE.en.md，页面用轻量 Markdown 渲染器在弹窗里显示。指南正文保持单一来源（md 文件），不在代码里复制。
- **代价**：仓库根目录同时承载插件与契约文件，需要靠 .gitattributes 维持下载干净；渲染器只覆盖指南用到的 Markdown 子集，新增文档结构时要同步扩渲染器。
- **验证**：npm pack --dry-run = 13 文件零文档；假 ctx 24 条路由且 /zhiyin/guide 200；渲染器对两份指南输出 50/49 块、表格列数正确。

## DEC-011: 界面只呈现用户概念，内部机制不上界面

- **日期**：2026-11-22
- **背景**：界面残留 v1 概念（合奏/组合/排除/常驻/生效面矩阵）与实现术语（观测、投影、策略 provider、接管）。
- **决策**：界面只保留用户能操作的概念（技能、技能包、开关、归档、成本）。删除三类内容：
  1. 已被 v2 移除的功能所对应的文案与代码（合奏、组合、排除、常驻、冲突声明、生效面矩阵）；
  2. 纯内部机制的状态指示（「接管／未接管」徽标 —— 用户无从操作，开关本身已给反馈）；
  3. 实现行话（观测→读取、投影→删除、重新观测→刷新）。
- **代价**：诊断信息减少；需要时靠 events.ndjson 与 /zhiyin/probe 查，不在界面堆。
- **验证**：死文案扫描（词典 key 在文件中出现次数为 0）删 176 条；node --check 通过；假 ctx 冒烟 4 个 slot 注册不变。

## DEC-012: 用户文档随包分发，且中英双语

- **日期**：2026-11-22
- **背景**：用户需要「装技能／建包／归档恢复」的简要指南；README 大量过时且只有中文；仓库开发期私有、发布时转公开。
- **决策**：
  1. 新增 `prototype/GUIDE.md` 与 `GUIDE.en.md`，写进 `files` 白名单随包分发 —— 装完插件的人能看到指南；
  2. 根 README 走 `shuxu` 优化模式重写为双语（README.md 中文主 + README.en.md 英文平行，互链），并替换 `prototype/README.md`（原为废弃的 M0 实验说明，却会随包分发）；
  3. 面板内不内置长文档，避免与代码漂移；需要时再考虑。
- **验证**：`npm pack --dry-run` = 13 文件（含两份 GUIDE 与两份包 README）；6 份 Markdown 共 22 条相对链接 0 断链。

## DEC-009: 织音采用「双入口」，设置页与左侧竖栏并存

- **日期**：2026-11-22
- **背景**：DSH 支持第三方插件注册 `main`（整页）与 `sidebar.panellist`（左侧竖栏一行）。参考实现是官方「插件」页（`PANEL_ID='plugins'` 同时注册两者）与社区 dshmarket（另有可开关的侧栏行 + `layout.selectPanel` 跳转）。
- **决策**：采用方案 A —— 保留设置页 `settings.section`（传统做法、老用户习惯），同时新增整页 `main(key='zhiyin')` 与竖栏行 `sidebar.panellist(id='zhiyin', order=10)`。不做「最后一扇门」开关逻辑（方案 C 留待后续需要时再上）。
- **代价**：两个入口语义重复，用户可能不知道哪个是「正门」；可通过两边渲染同一个 Page 组件保证内容一致来缓解。
- **验证**：假 window/假 ctx 冒烟确认 4 个 slot 注册成功；待用户重启后在真实宿主验收左侧竖栏与整页渲染。

## DEC-010: 分发白名单双轨 —— npm 用 files，源码归档用 gitattributes

- **日期**：2026-11-22
- **背景**：要求「开发文档不随插件分发，用户下载到的是干净可用的插件」。曾考虑把 docs/ 加进 .gitignore。
- **决策**：不使用 .gitignore 达到该目的（它只对未跟踪文件生效，对已跟踪的 docs/ 无效；真要生效必须 `git rm --cached`，会丢掉文档的版本历史，而会话开工依赖 docs/agents）。改为双轨：
  1. **npm 包**：`prototype/package.json` 的 `files` 白名单（实测 `npm pack --dry-run` = 10 文件、0 文档）。
  2. **源码归档**：新增 `.gitattributes`，对 `/docs`、`/AGENTS.md`、`/PRODUCT.md`、`/CHANGELOG.md`、`/README.md`、`/.gitignore`、`/.gitattributes` 等加 `export-ignore`（实测 `git archive HEAD` 只剩 `prototype/`）。
- **验证**：两条实测结果如上；文档因此既保留 git 历史，又不会出现在任何下载产物里。

## DEC-008: 目录预算撤下阈值，只展示成本

- **日期**：2026-11-21
- **背景**：设置页展示「目录字符数已超出预算 25555 / 8000」的红条。8000 是早期按 PRD §6.8 自定的默认值，并无依据；新用户看到红色告警会以为出了问题。用户要求：只展示成本，阈值必须先调研社区/官方依据，不能凭感觉定。
- **决策**：撤下 8000 预算与超限告警，界面只展示目录字符数（成本估算公式不变：可见技能描述截断 500 之和 + 200 框架开销）。调研结论（2026-11-21）：① Agent Skills 官方规范：单条 description ≤ 1024 字符（API 拒绝超限）、name ≤ 64 字符；② Claude Code（2026）路由清单把 description + when_to_use 合并截到约 1536 字符（v2.1.105 起），全部已装技能的目录总量参考 ≈ 上下文窗口的 1%，超预算按 LRU 丢弃描述而非截断（v2.1.129+）；③ 单条描述写作目标 400–1000 字符。中文约 1 字符 1 token，「1% 上下文」折算的字符数与英文差异大，因此不做固定字符阈值。待核实：DSH 自身对目录的注入行为与上限。
  来源：https://platform.claude.com/docs/zh-CN/build-with-claude/skills-guide （请求限制）；https://github.com/josiahsiegel/claude-plugin-marketplace/blob/main/plugins/plugin-master/skills/triggering-reliability/references/severity-and-limits.md （Claude Code 2026 三层上限）。
- **验证**：client 移除 pct/进度条/告警与 budgetOf/alertBudget 文案及遗留 bar/barFill/budget 样式；host 移除 BUDGET_CHARS 与 budgetChars 字段；node --check 双半边 exit 0；budgetChars/alertBudget/budgetOf 残留引用扫描为 0。

## DEC-006: 文档收敛到 docs/ 子目录

- **日期**：2026-11-17
- **背景**：用户指出根目录文件散落（PRD 两个版本、ADR、UI 决议、HANDOVER 全在根），要求整理。
- **决策**：根目录只留 AGENTS.md、README.md、CHANGELOG.md、.gitignore 与 docs/、prototype/。PRD 进 docs/prd/，ADR 进 docs/adr/，UI 决议进 docs/design/，交接进 docs/handoff/ 并改用 handoff-YYYY-MM-DD-*.md 命名（HANDOVER.md → handoff-2026-11-17-m0-skills-provider.md）。
- **验证**：根目录条目已核（六个非隐藏项）；AGENTS.md、README.md、prototype/README.md 内的旧路径引用全部改到新位置，git 已跟踪前无破链。

## DEC-005: 定位澄清——技能管理插件，安装卸载会写盘

- **日期**：2026-11-17
- **背景**：原 AGENTS.md 首行写“只读用户技能目录，禁止改写、重命名或删除任何 SKILL.md 与技能目录”，与产品定位冲突：织音就是技能管理插件，要能做安装与卸载。
- **决策**：定位改为“技能管理插件，管安装、卸载、启停与技能包编组”。写盘边界三处：安装新建技能目录、卸载移入归档目录（不直接删除）、自身状态文件。启停与观测仍不碰技能文件；安装前先确认目标根、同名冲突先问用户。开发期版本锁定 0.1.0。
- **验证**：AGENTS.md Permissions 与 Conventions、README 定位段与已知限制段同步改写；agents-changelog.md 已留痕。

## DEC-006: 安装/卸载的写盘边界

- **日期**：2026-11-18
- **背景**：用户要求「安装卸载当然要写盘」，但同时定了红线：不重写、不删除技能文件。
- **决策**：安装 = 把源文件夹复制到目标根下一个新目录（源必须含 SKILL.md，同名直接 409 不覆盖，目标根默认 ~/.dsh/skills，可切到在跑 Agent 的 <cwd>/.dsh/skills）。卸载 = rename 进 <profile>/zhiyin-proto/archive/<ISO 时间戳>-<name>，不删除任何内容，可手工搬回。两者都只能由页面上的显式按钮触发，不参与启停与轮询。
- **验证**：临时目录冒烟——install 200 且 SKILL.md 到位、重复 install 409、uninstall 移入 archive 且源目录消失、坏路径 404。

## DEC-005: 技能包状态形状与写路由

- **日期**：2026-11-18
- **背景**：技能包是启用单位，需要能被新建、改名、复制、删除、整组开关、编辑成员，且成员可跨来源（user-dsh / user-agents / custom）。
- **决策**：状态存 `state.packs = [{ id, name, enabled, members: [name], order }]`，`id` 用时间戳+随机后缀，不随改名变化；所有写操作走一条 `POST /zhiyin/pack`，用 `action` 区分（create/rename/toggle/copy/delete/members/reorder）。成员只存技能名，不存路径，改名或换源不影响；一个技能可同时属于多个包（多对多），任一所属包启用即视为可用。
- **验证**：假 ctx 冒烟跑通七个动作与 state 回读；hiddenReason 六条规则（包关/包开/包开+手动停用/allOff 压过包/two packs one on/不在包）全部通过。

## DEC-004: 停用改用「按 Agent 注册策略 provider」

- **日期**：2026-11-17（源自 ZhiYin-M0-ADR.md 与 HANDOVER.md，初始化时从既有文档迁入）
- **背景**：DSH 的技能消费者是预设级装配（dsh-web-app/presets/standard.patch.yml 挂 tool-skill），全局同名工具在实测中始终 visible:false，赢不过更近层；替换预设的新预设也不出现在下拉里。
- **决策**：不改预设、不替换消费者、不改技能文件。对每个在跑的 Agent，用 agent.ctx.get('skills').registerProvider 在它最近的层注册策略 provider，只列被停用的同名候选并把 modelInvocable 与 userInvocable 双置 false；启用项不列，落回原生 provider。
- **验证**：假 ctx 端到端通过（路由、provider 注册、影子候选、目录字符数、规则矩阵 8 条）；真机待重启后核实。

## DEC-003: 停用语义 = 完全不可见

- **日期**：2026-11-17（用户裁决，初始化时从 HANDOVER.md 迁入）
- **背景**：用户要求停用后「模型看不到 + / 菜单也没有」。
- **决策**：停用项不进模型目录、skill 工具拒绝、斜杠菜单不出现；不做「仍在目录里但标注停用」的折中。
- **验证**：以模型侧目录快照与 / 菜单是否存在该名为准。

## DEC-002: 技能包 = 启用单位，多包并集

- **日期**：2026-11-17（用户裁决，初始化时从 HANDOVER.md 迁入）
- **背景**：AI Vault 用技能包组织技能，包是批量开关的载体。
- **决策**：一个技能可属多包；包启用即成员启用，任一所属包启用则技能启用；不在任何包的技能由手动停用集合决定。状态形状 packs:[{id,name,enabled,members}]。
- **验证**：规则矩阵覆盖「包关/包开/包开+手动停用/两包其中一开」四种组合。

## DEC-001: 安装/卸载要写盘

- **日期**：2026-11-17（用户裁决，初始化时从 HANDOVER.md 迁入）
- **背景**：用户回复「当然要写盘，不写如何安装」。
- **决策**：安装写入 ~/.dsh/skills 或 <项目>/.dsh/skills；卸载移入归档目录而非直接删除。待确认：这里的「安装/卸载」指技能还是 DSH 插件本身。
- **验证**：安装后技能出现在原生目录快照；卸载后原目录不留残件且归档可恢复。

## DEC-007: 设置页改版以 dsh-market 市场页为参考；技能包保留独立开关

- 参考对象：`dsh-market`（v1.73.21）设置页——五层骨架（页头／元信息条／带计数标签页／折叠告警／工具条+卡片），单实心主按钮，计数挂标签，告警先于内容，卡片五行固定结构。详见 `docs/design/ZhiYin-UI-市场页参考.md`。
- 采纳：三态徽标由成员派生显示、成员集合剪幽灵名并去重、包名 1–40 字符规则、删除清理孤立项、搜索防抖、排序偏好存 localStorage。
- 不采纳：其「分组不存开关、整组开关=纯批量动作」的模型。织音**技能包保留独立开关**。
- 语义确认：并集 = 各启用包成员名单去重后的集合，决定 Agent 可调用技能；技能属于多个包时，最后一个启用的包关闭才真正停用。该实现细节不向用户解释，只在 README 说明效果。
