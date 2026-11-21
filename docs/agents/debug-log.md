---
title: Debug Log
type: debug-log
project: dsh-skills-zhiyin
updated: 2026-11-21
description: >
  反复调试的 bug 追加记录，优先级与实现事实对齐。只追加，不删除或改写历史。
  AI 在本文件新增或修改任何条目后，必须同步更新 frontmatter 的 updated 字段为当日日期（YYYY-MM-DD）。
---

# Debug Log

> 反复调试的 bug 记录。只追加，不删除历史。
> 格式：`## BUG-NNN: 标题` + 日期/现象/根因/修复/验证限制/教训。NNN 三位递增。
> 字段：`- **日期**：` / `- **现象**：` / `- **根因**：` / `- **修复**：` / `- **验证限制**：` / `- **教训**：`

***

## BUG-010: 设置页 400、一直「正在读取技能列表…」（TDZ 变量遮蔽）

- **日期**：2026-11-22
- **现象**：打开织音面板显示「读取失败：HTTP 400」，技能列表一直停在「正在读取技能列表…」；其余路由（archive / market / probe / backups）全部 200。
- **根因**：BUG-009 的修复里新增了模块级 let observedSkillNames，但当时命名为 observedNames，而 collectState 内部第 2341 行早已有一个同名局部 const observedNames。同一函数作用域内，第 2282 行的 observedNames = ... 赋值命中的是这个局部变量（TDZ，尚未初始化），抛 ReferenceError；宿主把 resource 异常统一转成 400。
- **为什么只有 /zhiyin/state 挂**：只有该路由会走 collectState；其它 GET 路由不碰这段代码。
- **修复**：模块级变量改名为 observedSkillNames，与函数内局部 observedNames 彻底解耦。
- **验证**：假 ctx 冒烟（mod.apply + 执行全部 effect + 调 state.resource()）通过，23 条路由注册成功，state 返回合法 JSON 不再抛错；node --check 双半边 exit 0。
- **教训**：给模块加全局状态时先全局搜同名标识符；TDZ 报错在宿主层会被吞成 400，看不到堆栈，必须靠假 ctx 冒烟测试才能暴露。

## BUG-009: 技能总数随「加载 ~/.agents/skills」开关抖动（111 vs 112）

- **日期**：2026-11-22
- **现象**：开启「全部技能」包时技能总数 111，关闭后一个包都不开时显示 112，数字反而变大，令人费解。
- **根因**：shadowCandidates() 直接遍历 state.known 生成影子候选，而 known 是「只增不减」的观测历史（实测 179 条，磁盘实际只有 96 + 166 个目录）。已从磁盘删除的陈旧条目被当成技能参与统计，造成 ±1 漂移。
- **附带发现**：~/.dsh/skills 的 96 个目录里有 92 个是指向 ~/.agents/skills 的软链，合并时同名只算一次，所以开关 .agents 前后总数几乎不变——这一点此前没有任何提示，加剧了困惑。
- **修复**：新增模块级 observedNames（collectState 每轮写入本轮观测到的名字），shadowCandidates 跳过已观测名字，陈旧条目不再参与统计；来源行在存在同名软链时追加说明。
- **验证**：node --check 双半边 exit 0；构造 known 含 2 条幽灵条目的 state，shadowCandidates 只返回未被来源规则挡住的条目。
- **教训**：缓存类数据（known / origins 等）参与「当前状态」统计前必须先与本轮观测求交，否则缓存会变成幽灵数据源。

## BUG-008: 进入插件管理页非常慢（同步 git clone 冻结宿主事件循环）

- **日期**：2026-11-21
- **现象**：每次打开设置页的织音面板都很慢，安装技能期间更明显。
- **根因**：cloneRepo 用 execFileSync('git', ['clone','--depth','1',...], { timeout: 120000 }) 同步执行；克隆/网络慢时整个宿主事件循环被阻塞，/zhiyin/state 等所有请求排队（空载实测 23ms，克隆期间会拖到秒级以上）。
- **修复**：改为异步 runGit(args, signal)（execFile + Promise，可 abort），cloneRepo 变 async，installBatch/installFromText 均 await；同时接入 installJobs 与 /zhiyin/install/abort 支持中止。
- **验证**：node --check 双半边 exit 0；/zhiyin/state 空载 23–237ms；中止链路 kill 子进程 → ABORTED → 499。
- **教训**：宿主路由里任何可能秒级以上的子进程都必须异步；execFileSync 会冻结整个服务，表现为「页面慢」而不是「安装慢」。

## BUG-007: 市场安装回填 skills.sh 域名来源导致「看不懂这个来源」

- **日期**：2026-11-21
- **现象**：技能市场点安装后，安装弹窗自动回填 uizze.sh 之类的值，点安装报「看不懂这个来源：支持 owner/repo、GitHub 链接…」。
- **根因**：skills.sh 搜索结果里有一类域名来源（如 uizze.sh、open.feishu.cn）是 skills.sh 托管技能，没有公开 GitHub 仓库；宿主只支持 GitHub/本地，resolveGithubSource('uizze.sh') 必然失败。
- **修复**：宿主 marketSearch 给每条加 installable = source.includes('/') 与正确技能页 URL（域名来源是 /<source>/skills/<skillId>）；前端对 installable === false 的条目显示「托管」徽标、禁用安装并给出说明，不再回填不可安装地址。
- **验证**：带代理实测 40 条热门中 37 可装、3 托管；ui-taste installable=false / url 正确，find-skills installable=true。
- **教训**：外部注册表的 source 并不总是 owner/repo，接入前要先枚举来源形态；不可安装的类型要显式禁用并解释，不能让它带着错误坐标进安装流程。

## BUG-006: 搜索技能后设置页整块空白（模块级组件误用 Page 内的 say）

- **日期**：2026-11-21
- **现象**：技能市场搜索后，设置面板右侧（织音整块）变空白；热门页正常，只有输入框有内容后触发。
- **根因**：新加的 ClearField 是模块级组件，其中 say('clearInput', ...) 却引用了 Page 组件内部的 const say = React.useCallback(...)。输入为空时不渲染清除 X、不调用 say；一旦有值渲染 X → ReferenceError: say is not defined → 无错误边界，整块设置面板卸载成空白。
- **修复**：ClearField 改用 clearLabel = '清除' 默认 prop，不再引用 Page 作用域；注释标明模块级组件禁用 say。
- **验证**：node --check client exit 0；模块级 say( 引用扫描为 0（首个 say 出现在 Page 内部）。
- **教训**：模块级组件/工具函数只能用模块级作用域的东西；Page 内的 say 不能跨层用，否则只在特定状态（有值/有数据）才炸，最难排查。

## BUG-005: 技能市场请求频繁失败（Node fetch 不读系统代理）

- **日期**：2026-11-21
- **现象**：技能市场热门/搜索偶尔 200、频繁 502「连接 skills.sh 失败」；同一台机器 PowerShell 的 Invoke-RestMethod 与 curl.exe 都能正常访问。
- **根因**：机器通过 HTTP(S)_PROXY=http://127.0.0.1:7890 出网；PowerShell/curl 继承系统代理，Node 内置 fetch（undici）默认不读环境代理，直连 10s 超时。undici 的 ProxyAgent/EnvHttpProxyAgent 在该代理上 TLS 握手被重置（ECONNRESET），同样不可用。
- **修复**：宿主新增 httpGetText(url)：检测到 HTTPS_PROXY/HTTP_PROXY 时改走 curl.exe -sS -L -x <proxy>，无代理时回落 fetch；市场搜索、技能描述、SKILL.md 直链下载统一走它。
- **验证**：带代理环境实测 marketSearch('',40) 返回 200、40 条唯一技能（find-skills 4.46M…），marketDescription 返回真实描述；extractLdDescription 对样例 HTML 解析正确。
- **教训**：在用户机器上请求外网优先复用系统代理链路（curl/PowerShell），不要假设 Node fetch 能直连；跨平台按 process.platform 选 curl.exe/curl。

## BUG-004: 刷新态文字竖排 + 「全部技能」计数含未开启目录

- **日期**：2026-11-20
- **现象**：① 开关技能包时，右上刷新按钮位置出现竖排中文「正在读取技能列表…」；② 「全部技能」包显示 177 个技能，但此时 `.agents` 开关关闭、织音只看得到 `.dsh/skills`（96）+ 内置（14）+ 自定义（1）= 111，「技能总数」卡也是 111，两者自相矛盾。
- **根因**：① 刷新按钮是 30×30 的 `css.iconBtn`，`state.loading` 时把 `say('loading')`（词典值「正在读取技能列表…」）当内容塞进按钮，长文本在固定小方块里逐字换行=竖排；② `collectState` 的 `packsOut` 对 `__all__` 用 `skills.length`（全量 177，含 user-agents），没按 agentsRoot 开关过滤。
- **修复**：① 刷新按钮 loading 态改用自包含 SVG SMIL 旋转 spinner（不注入 `<style>`，规避 CSP），不再显示长文本；② `__all__` 的成员/成本改用「可见世界」：`agentsRoot===false` 时排除 `user-agents` 来源，`memberCount` 由 177→111，客户端对 `pack.all` 也按 `counts.total`/`counts.allCost` 兜底；③ 统计卡下补「来源：用户目录/内置/自定义」行，让数字自解释。
- **验证限制**：`node --check` 双半边 exit 0、宿主模块加载与 hiddenReason 冒烟通过；真机需完整重启 DSH 后看「全部技能=111」、F5 看 spinner 与来源行。
- **教训**：图标按钮只放图标，不要把可变长文本塞进固定尺寸控件；任何"总数/成本"类指标必须与"此刻可见集合"同口径，别用全量观测。

## BUG-003: 停用只在模型面生效，/ 菜单仍能选到被停用的技能

- **日期**：2026-11-17
- **现象**：`加载 ~/.agents/skills` 关掉后统计显示「模型可用 96 / 仅内部可用 64」，会话里的技能目录也确实不再注入那 64 个（`skill` 工具对 `zuiti` 直接报 not available for model invocation），但输入框的 `/` 菜单里仍然能选到 `zuiti` 等被停用技能。
- **根因**：两条读取路径用的不是同一个技能注册表实例。模型目录（`dsh-tool-skill` 注入）读的是它自己 ctx 上的 `skills`；而用户面走宿主 Remote `SessionSkillCatalog.list`，它取的是 `agentPresets.serviceFor(live, 'skills')`（预设装配那一份），冷会话则退回宿主层 `this.ctx.get('skills')`。织音只把策略 provider 挂在 Agent 自己 ctx 的那一份上，所以用户面那条路看不到停用。
- **修复**：`registryInstances` 收集同一个 Agent 能拿到的全部技能注册表实例（Agent 层 / 预设层 `agentPresets.serviceFor(agent,'skills')` / 宿主层 `ctx.get('skills')`），逐个挂同一份策略 provider（按技能名停用，语义不变，不复制正文、不改技能文件），诊断记 `layers` 数；`forceInvalidate` 与 `invalidateAll` 同步遍历这三个实例。新增诊断路由 `GET /zhiyin/probe`，摊开模型面与用户面两条读取路径的真实结果（各注册表实例的层表、`sessionSkillCatalog.list` 返回的技能名与其中仍可见的停用项）。
- **验证限制**：假 ctx 冒烟测试通过（三个注册表都收到 `zhiyin` provider，事件 `provider-registered layers:3`）；真机要重启后看 `/zhiyin/probe` 的 `catalog` 段与 `/` 菜单。
- **教训**：「停用生效了吗」要分别验模型面与用户面，两条路的注册表实例可能不是同一个；控制类插件不能只挂自己顺手拿到的那个 service。

## BUG-002: 启动窗口内重复注册策略 provider，诊断刷屏

- **日期**：2026-11-17
- **现象**：`zhiyin-proto/events.ndjson` 中出现 573 条 `provider-register-failed: a skill provider named "zhiyin" is already registered in this scope`，每 2 秒一条，直到某个作用域被重建后才出现一条 `provider-registered`。
- **根因**：轮询循环对每个 Agent 都调 `registerProvider`，但键用的是 session id；热重载/作用域重建后，同一个作用域里还留着上一轮的 provider，新实例拿不到它的 disposer，于是每轮重试都抛「同名已注册」。
- **修复**：`registerFor` 捕获该错误时视作「已生效」——记入 `providers` 停止重试，只留一条 `provider-already-registered` 诊断；并记 `entry.force`：拿不到 `control.invalidate` 时，用一次「即注册即撤销」的 runtime 技能推动 registry 换 revision（`forceInvalidate`），保证开关仍能让目录刷新。
- **验证限制**：假 ctx 通过了「同名已注册」路径（事件只剩一条）；真实热重载场景要等宿主重启后观察。
- **教训**：注册类 API 的失败要么重试要么降级，不能每轮盲目重试并写诊断——诊断文件会被自己刷爆。

## BUG-001: 观测只读到全局层，用户级技能全员消失

- **日期**：2026-11-17
- **现象**：宿主重启后 `GET /zhiyin/state` 返回 `total=14`（全是 bundled 内置），而此前同一台机器上是 175；设置页会把 161 个用户级技能当成不存在。
- **根因**：`collectState` 调 `ctx.skills.snapshot({ cwd })` 时故意不带 `scope`。注册是按调用上下文的作用域分层（`dsh-skill` 用 `scopeOf(this.ctx)` 定位层），读取同样要用 Agent 自己的 scope key 才会合并「全局层 + 该 Agent 作用域链」；不带 scope 只剩全局层，用户级技能在预设/Agent 层里，于是一个都看不到。
- **修复**：新增 `viewForAgent`，**从技能注册表自己的层表反查 scope key**（`skills.layers.scoped`，遍历所有 key 各读一次快照，取条目最多的那份）——不要自己 import `@deepseek-ai/dsh-scope` 求 key：第三方插件拿到的是另一份模块实例，模块私有 Symbol 不同，`scopeOf` 恒为 undefined（实测：宿主里 `scopedScopes` 一直是 0）。响应新增 `scopedScopes` 与 `scopeDebug`（每个 key 的条目数、各层 provider 名），`scopes > 0` 而 `scopedScopes === 0` 时写入 `scope-key-unavailable` 失败项便于现场定位。同时把列表里 `provider === 'zhiyin'` 的影子候选回填原始 `known` 元数据（来源、描述），并新增 `shadowed` 标记。
- **验证限制**：用**真 `SkillRegistry` + 真 `createScope`** 复现：同一作用域里注册「原生 provider（user-dsh/user-agents）」+「织音影子 provider」后，`snapshot({scope})` 得到 `alpha[zhiyin model=false]`、`beta[skill-filesystem]`，而 `snapshot({})` 为空 —— 精确复现了宿主里「只读到 14 条内置、用户级全丢」的现象，并验证影子候选确实压住同名原生候选。层表反查在真注册表上取到正确 key（`discovered key === key`），且 `layers` 通过 cordis 的 traced service 代理可读。仍未在真实宿主里跑通：等下一次完全重启。
- **教训**：分层注册表「注册在哪一层」和「读哪一层」必须是同一个 scope key；先前的「不带 scope 才拿得到原生结果」是错的——影子候选可以在拿到结果后按 provider 名回填。
