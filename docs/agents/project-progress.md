---
title: Project Progress
type: project-progress
project: dsh-skills-zhiyin
updated: 2026-11-21
description: >
  项目开发进度实时记录：阶段、分支、代码状态、最近进展。每次会话更新。
  AI 在本文件新增进展或修改当前状态后，必须同步更新 frontmatter 的 updated 字段为当日日期（YYYY-MM-DD）。
---

# Project Progress

> 记录当前任务状态、分支和最近进展。每次会话更新。
> 新进展插在「当前状态」之后、旧「最后更新」之前。

---

## 当前状态

- **当前分支**：main（修复 400/TDZ 走 fix/state-tdz → 提交（见 git log）→ 合并 main → 已推送 origin，分支已删）；上一轮安装按钮+统计：2a07df9 → 5d6d269
- **阶段**：原型期 P1 功能面补齐后按用户反馈收敛——界面为「技能列表 / 技能包 / 技能市场 / 归档」四页（市场走 skills.sh，归档可查看与恢复）；~/.dsh/skills 是 DSH 可见目录（AI Vault 的 96 条软链接都在），文件永不因技能包开关增删；技能包只决定生效面——托管来源（.dsh / .agents）必须挂在启用包上才生效，内置/自定义不受包约束；单技能开关仍是底线；组合/合奏、包冲突、排除/常驻从前端移除（后端路由保留）；已移植 AI Vault 的安装多选、包成员候选池与备注查看；UI 还待整体精修
- **代码**：prototype/ 两半边（index.js：/zhiyin/state、/zhiyin/probe、/zhiyin/skill、/zhiyin/settings、/zhiyin/pack、/zhiyin/install、/zhiyin/uninstall、/zhiyin/archive、/zhiyin/restore、/zhiyin/market、/zhiyin/market/desc、/zhiyin/export、/zhiyin/import、/zhiyin/backups、/zhiyin/rollback、/zhiyin/note、/zhiyin/repair + 三注册表策略 provider；client.js：设置页含统计筛选卡、技能卡瀑布流/列表、备注、技能包、成员管理、导入/安装弹窗）
- **代码**：prototype/ 两半边已就位（index.js 宿主：/zhiyin/state、/zhiyin/skill、/zhiyin/settings + 按 Agent 策略 provider；client.js 设置页含单个技能开关与「加载 ~/.agents/skills」总开关）；consumer.js 为已废弃的预设级消费者，仅作参考
- **版本**：prototype/package.json 锁定 0.1.0（开发期不升版）
- **工具链**：Node v24.22.1；插件包依赖 @deepseek-ai/dsh-skill / dsh-tools / dsh-llm 均 0.2.2-rc.3（prototype/package.json）
- **最后更新**：2026-11-22 00:3x 修复设置页 400 / 一直加载中（TDZ 变量遮蔽）
  - 现象：织音面板「读取失败：HTTP 400」，技能列表卡在「正在读取技能列表…」；archive/market/probe/backups 均 200，只有 /zhiyin/state 挂。
  - 根因：上一轮加的模块级 let observedNames 与 collectState 内第 2341 行已有的局部 const observedNames 同名，同一函数作用域内第 2282 行的赋值命中该局部变量（TDZ），抛 ReferenceError；宿主把 resource 异常统一转成 400。
  - 修复：模块级变量改名 observedSkillNames，与函数内局部彻底解耦。
  - 验证：假 ctx 冒烟（mod.apply → 执行全部 effect → 调 state.resource()）通过，23 条路由注册成功、state 返回合法 JSON；node --check 双半边 exit 0。
  - 待验收：重启 DSH 后设置页正常加载技能列表，不再出现 HTTP 400。

- 上一轮：2026-11-22 00:2x 市场安装按钮收窄 + 修复技能总数随 .agents 开关抖动
  - 安装按钮：「安装技能」在窄卡片里换行，改为「图标 + 安装」（安装中显示「安装中…」），并加 whiteSpace: nowrap 禁止折行。
  - 统计口径（BUG-009）：磁盘实测 ~/.dsh/skills 有 96 个目录，其中 92 个是指向 ~/.agents/skills 的软链；两处同名技能在合并时只算一次。但 shadowCandidates 直接遍历 state.known（只增不减的观测历史，实测 179 条）生成影子候选，把已从磁盘删除的陈旧条目也当成技能，导致「全部技能」开关前后总数差 1（111 vs 112）。
  - 修复：新增模块级 observedNames（collectState 每轮写入），shadowCandidates 跳过本轮已观测到的名字，陈旧条目不参与统计。
  - 另加来源行说明：当用户目录技能与 .agents 同名（软链）时，提示「其中 N 个用户目录技能是 .agents 的软链，同名只算一次」，解释开关前后数字为何几乎不变。
  - node --check 双半边 exit 0；影子过滤实测：known 有 3 条、观测为空时只产出未被来源规则挡住的条目。
  - 待验收：重启后市场「安装」按钮单行显示；开关「加载 ~/.agents/skills」时技能总数不再出现 ±1 的跳变；来源行出现软链说明。

- 上一轮：2026-11-22 00:5x 去掉重复「已安装」徽标 + 修复导入技能包与「全部技能」同时启用
  - 重复徽标：市场卡片右上角原本也渲染「已安装」，与底部操作区重复。现右上角只保留「托管」这类需警示状态，「已安装」只出现在底部操作区（含重装按钮）。
  - 互斥漏洞：POST /zhiyin/pack action=import 新建包后直接 enabled: true，漏了关闭「全部技能」这一步（action=create 有），导致导入后两个包同时亮着、与互斥规则冲突。已在 import 分支补 importAllPack.enabled = false，与新建行为一致。
  - 静态校验：import 与 create 两个分支均包含关闭全部技能；enabled: true 仅出现在这两个入口与默认状态初始化。
  - node --check 双半边 exit 0。
  - 待验收：重启后导入 txt 技能包，「全部技能」自动关闭、仅新包启用；市场已安装卡片只在底部出现一次「已安装」。

- 上一轮：2026-11-22 00:4x UI 第三批：技能市场卡片瀑布流化 + hover
  - 卡片重做：原来沿用技能卡样式（加宽版列表），现改为独立卡片语言——标题两行截断（monospace 15px）+ 状态徽标（已安装/托管）、来源仓库 · 安装量信息带、描述四行截断、CLI 命令块（等宽+浅底）、底部分隔线 + 「可安装/托管」标签 + 主按钮（安装/已安装+重装/查看）。
  - 瀑布流：新增 css.marketGrid（columnWidth 280、columnGap 16、marginBottom 16、breakInside avoid），高度随内容，多列错落。
  - hover：新增 marketHover 状态 + css.marketCard(hovered) —— 上浮 2px、边框转品牌橙、阴影 0 8px 24px、底色加深，140ms 过渡。
  - 安装态保留：进行中 Spinner + 文案、其它卡片禁用、成功 ✓。
  - 顺带把文件行尾统一为 CRLF（此前混入 93 处裸 LF）。
  - node --check client exit 0。
  - 待验收：F5 后市场为多列瀑布流、悬停有抬升高亮、卡片信息层次（标题/来源/描述/命令/操作）清晰。

- 上一轮：2026-11-22 00:0x UI 第二批：间距统一 8pt 网格 + 空态/错误态规范化
  - 间距：marginTop 收敛到 {2,4,8,12,16,24}（块级 8/12/16/24，元素内 2/4），原 1/6/10/14/18/22 共 23 处全部归位；cardGrid columnGap 12→16、row columnGap 10→12、alertWrap gap 6→8、页面标签行 22→24。
  - 空态：新增 css.emptyBox（虚线框 + 居中 + 标题/说明两级），替换技能列表/卡片、技能包、市场、归档、备份共 6 处裸 hint 文案；每处补「下一步该做什么」的副文案。
  - 错误态：新增 css.errorBox（红边框 + 淡红底 + info 图标），统一观测失败、导出失败、市场错误、归档错误、安装失败、备份错误 6 处，替换原来只用 color:#d05a4a 的一行文字。
  - node --check client exit 0；marginTop 全部落在网格上（仅 alertIcon 1px 微调保留）。
  - 待验收：F5 后空态有明确边界与行动指引；出错时是红色卡片而非一行小字；整页纵向节奏更均匀。

- 上一轮：2026-11-21 23:5x UI 可读性收尾：字号/透明度 token 化（huashu-design 评审落地）
  - 评审（Phase 7）量化结论：52 处字号声明中 44 处 ≤13px（最小 10px），叠加 21 处低透明度；正文主力 12.5px、说明 12px + opacity 0.6，层级对比仅 1.76 倍。总体 6.2/10。
  - 建 token：fs = { body 14, hint 13, meta 12, badge 11.5, cardName 15, title 22, section 13.5 }；op = { hint 0.78, meta 0.65, dim 0.72, faint 0.55 }。
  - 替换：51 处 fontSize 全部改用 fs.*（仅 statValue 20px 保留为数值层级）；12 处 opacity 改用 op.*；hint/groupDesc/cardDesc/desc 提到 13px + 0.78，metaText 10.5→12 + 0.65，badge 10.5→11.5，cardName 14→15，name 13.5→14，modalTitle/groupTitle/segBtn 12.5/13→14，statLabel 11.5→12，refBadge 11→12。
  - 间距：costHead 12→16、memberRow 2→3、targetRow 12→14 等随字号同步放大；行高 hint/desc 1.45→1.55、costBullet 1.6→1.65。
  - node --check client exit 0；hardcoded fontSize 残留 1 处（statValue，有意保留）。
  - 待验收：F5 后正文与说明文字明显变清晰；卡片名、徽标、元信息不再需要凑近看；层级仍清晰。

- 上一轮：2026-11-21 23:0x 归档删除、安装中止、已安装可重装、克隆不再阻塞宿主
  - 性能根因（BUG-008）：cloneRepo 用 execFileSync('git'...) 同步克隆（timeout 120s），克隆期间整个宿主事件循环冻结，设置页所有请求排队 → 表现为「进入插件管理页非常慢」。改为异步 execFile + Promise（runGit），并保留 repoCache。
  - 安装中止：新增 installJobs（jobId → AbortController）与 POST /zhiyin/install/abort；runGit 支持 abort（kill 子进程 → ABORTED）；install/install/batch 接受 jobId；被中止返回 499 + aborted。前端 runInstall/runInstallSelected 生成 jobId，安装中把主按钮换成「安装中… + 中止」。
  - 归档删除：新增 deleteArchive（单条 key / 批量 keys，校验只允许 archive 直接子目录、拦 ../，删后清 origins 记录）与 POST /zhiyin/archive/delete；归档页每行加删除图标（二次确认），顶部出现「删除选中 (n)」批量按钮，行首加勾选框。
  - 已安装可重装：installDirectory 支持 overwrite（旧目录先改名备份，成功再删，失败回滚）；市场已安装条目显示「✓ 已安装 + 刷新图标」，点刷新即覆盖重装。
  - 来源与命令标注：marketSearch 每条返回 installCommand（npx skills add <repo> --skill <name>，与 skills.sh 页面一致），卡片底部以等宽字体展示并可悬停查看。
  - 实测：归档单删/批删/../ 拦截全部通过；marketSearch 返回的命令与页面一致（find-skills → npx skills add vercel-labs/skills --skill find-skills）。node --check 双半边 exit 0。
  - 待验收：重启后进设置页不再卡顿；安装中可点「中止」；归档可单删/批删；已安装可重装；卡片显示安装命令。

- 上一轮：2026-11-21 22:1x skills.sh 链接安装 + 市场安装进行中动效
  - skills.sh 链接安装：installFromText 新增识别 https://www.skills.sh/<owner>/<repo>[/subpath]，剥离后交给既有 GitHub 解析（等价于 owner/repo，含子路径即装该技能）；安装弹窗提示补充「skills.sh 技能页链接」。
  - 托管来源（uizze.sh、open.feishu.cn 等域名首段）：实测 skills.sh 未提供公开下载通道——/api/v1/* 需 Vercel OIDC token（401），官方 npx skills add 该页面报 SKILLS_DOWNLOAD_NOT_A_SKILL，/SKILL.md、/download、well-known 均返回 HTML。故仍不支持直接安装，但宿主返回明确原因；前端把死按钮改为「在 skills.sh 打开」（搜索图标），不再给人能点的错觉。
  - 市场安装动效：恢复 marketBusy（按条目 id）与 marketDone；点安装即在卡片内显示 Spinner + cursor:progress + aria-busy，其它条目在安装期间禁用并提示「另一个技能正在安装」；成功显示 ✓ 已安装，失败才回落安装弹窗（multiple）或显示错误。
  - 实测：resolveGithubSource 对 owner/repo、owner/repo/subpath、GitHub URL、npx skills add 四种形式解析正确；skills.sh URL 分类（域名来源 vs owner/repo）正确。node --check 双半边 exit 0。
  - 待验收：市场点安装有转圈、成功变 ✓；安装弹窗粘贴 skills.sh 的 owner/repo 链接能装；托管条目点击跳转 skills.sh 页面。

- 上一轮：2026-11-21 21:0x 修复「打开技能目录无反应」与软链标记不可见
  - 无反应根因：宿主用 execFile('explorer.exe', [dir], { windowsHide: true }) —— Windows 上 windowsHide 会让 explorer 不弹窗口；且 explorer 成功也返回非 0，回调被忽略后前端看不到任何反馈。改为 spawn(command, [dir], { detached: true, stdio: 'ignore', windowsHide: false }) + unref，只监听启动错误并记 skill-reveal-failed。
  - 软链标记「没了」根因：卡片视图从来没有软链徽标；列表视图的 ⛓ 在「徽标降噪」提交里降到 opacity 0.32，几乎不可见。现在卡片与列表都显示「软链」文字徽标（opacity 0.7，可点击打开目录），title 给出实体路径。实测 ~/.dsh/skills 下 97 条软链本身完好，仅显示丢失。
  - node --check 双半边 exit 0；skillDirectory 命中 <root>/<name> 返回技能目录而非根目录。
  - 待验收：重启后点文件夹图标应弹出资源管理器并定位到该技能目录；卡片与列表都能看到「软链」标记且可点击。

- 上一轮：2026-11-21 20:1x 卡片加「打开技能目录」+ 成本说明按第一性原理重写
  - 打开目录：宿主 POST /zhiyin/reveal → skillDirectory() 先按三个安装根找 <root>/<name>（含 SKILL.md），再用快照真实路径剥掉 SKILL.md 兜底（软链接可解引用）；平台分别用 explorer.exe / open / xdg-open 打开**该技能目录**，不打开技能根；事件 skill-revealed。前端卡片视图每张卡加 folder 图标（title：在文件管理器里打开这个技能的目录）。
  - 成本说明重写：标题改「目录字符数 · 计算方式与建议上限」；四段——计算方式（min(描述,500) 累加 +200、只计描述为下限、停用/未入包不计）／成本构成（路由信号、目录追加历史、超限按 LRU 丢弃）／建议上限（上下文 1%：200K→2,000 token；中文 ≤2,000 字符、英文 ≤8,000 字符、单条 400–1,000、硬上限 1,024）／优化方式（描述只留做什么+何时用、不用的停用、同域合并）／依据（两条官方与社区链接 + 各自结论）。删掉「不能用一个固定字符数当红线」等口语与待核实表述。
  - node --check 双半边 exit 0；skillDirectory 假环境三例（按根命中、按真实路径兜底、缺失返回 null）通过。
  - 待验收：重启后卡片有文件夹图标、点击打开对应技能目录（非根目录）；点目录字符数看新文案。

- 上一轮：2026-11-21 19:5x 目录字符数做成信息弹窗（解释 + 建议 + 出处）
  - 「目录字符数 / 观测完整」整块可点击（带 info 图标），打开 DEC-008 调研成果的信息弹窗。
  - 弹窗六段：数字含义（描述截断 500 之和 + 200 估算，不是报错）→ 为什么值得看（路由信号、token、目录追加进会话历史）→ 官方/社区量级（1024 硬上限、~1536 路由清单、~1% 上下文与 LRU 丢弃、400–1000 写作目标、中英 token 差异）→ 我们的建议（关掉不用技能、描述短且触发词前置、别为压数字牺牲可用性）→ 出处（Anthropic 平台文档、Claude Code 2026 上限参考）→ 待核实（DSH 注入行为未实测）。
  - 仅改 client：新增 info 图标、costSection/costHead/costBullet/costLink 样式、costInfoOpen 状态；node --check client exit 0。
  - 待验收：F5 后点「目录字符数」卡片弹出说明，链接可打开，右上角 X 与「知道了」可关闭。

- 上一轮：2026-11-21 19:4x 目录成本只展示不设阈值（DEC-008，撤下 8000 预算与告警）
  - 调研结论：① Agent Skills 官方规范：description ≤ 1024 字符（API 拒绝超限）、name ≤ 64；② Claude Code（2026）：路由清单 description+when_to_use 合并截 ~1536（v2.1.105 起），全部已装技能目录总量参考 ≈ 上下文窗口 1%，超预算按 LRU 丢弃描述而非截断（v2.1.129+）；③ 单条描述写作目标 400–1000。中文 ~1 字符 1 token，固定字符阈值不可靠 → 只展示成本。
  - 代码：client 删除 pct/进度条/超预算告警/budgetOf、alertBudget 文案与遗留 bar、barFill、budget 样式；host 删除 BUDGET_CHARS 与 budgetChars 字段；成本数字加 tooltip 说明估算口径。
  - node --check 双半边 exit 0；budgetChars/alertBudget/budgetOf/barFill 残留扫描为 0。
  - 待验收：F5（宿主也改了需重启）后设置页只显示「目录字符数 25555」，无红色告警与 /8000。

- 上一轮：2026-11-21 19:2x 归档记住原位置，恢复默认回原目录（commit 21d4827，merge 0f53340）
  - 卸载时记录来源（agents/user/project）到 archive/origins.json（键为归档目录名，含 from 路径与时间）；事件 skill-archived 带 origin。
  - 列表接口返回 entry.origin；归档页「恢复到」默认「原目录（推荐）」，每行显示「原位置：技能库/用户目录/项目」。老条目无 origin 记录 → 回落技能库。
  - 恢复时 target=origin 由宿主按 origins.json 解析；成功后删除该条 origin 记录。
  - 实测：假环境 project 技能卸载→记 origin=project→恢复默认回到 project，origins 清空；node --check 双半边 exit 0。
  - 待验收：重启 DSH 后新卸载一个技能，归档页显示原位置；选「原目录」恢复应回到原目录。

- 上一轮：2026-11-21 19:1x 归档管理（归档列表 + 恢复到指定目录）（commit ef47cba，merge 369fb5d）
  - 背景：卸载只把技能挪进 zhiyin-proto/archive/<时间戳>-<技能名>，前端没有查看/恢复入口。
  - 宿主：新增 GET /zhiyin/archive（解析时间戳前缀 + 读 SKILL.md 的 name）与 POST /zhiyin/restore（按 key 恢复到 agents/user/project；同名冲突 409；EXDEV 退回复制；恢复到 agents 时补 .dsh 软链接）；事件 skill-restored。
  - 前端：新增「归档 N」页签；页签内可选「恢复到 技能库/用户目录/项目」，列表显示技能名与归档时间，逐条「恢复」；卸载成功后自动刷新归档计数。
  - 实测：假环境验证解析/恢复平铺；真实归档目录（含 design-mobile-apps @ 2026-11-21 10:02:55）解析正确。node --check 双半边 exit 0。
  - 待验收：重启 DSH 后「归档」页签能看到 design-mobile-apps，选目标目录点恢复可装回并自动链接。

- 上一轮：2026-11-21 18:4x 托管来源技能不开放安装 + 技能页 URL 修正（commit cfefe49，merge 4e085e7）
  - 问题：市场点安装回填的是 skills.sh 域名来源（如 uizze.sh、open.feishu.cn），这类是 skills.sh 托管技能、没有公开 GitHub 仓库，宿主只支持 GitHub/本地 → 必然报「看不懂这个来源」。
  - 修复：宿主 marketSearch 为每条加 installable = source.includes('/') 与正确技能页 URL（域名来源为 /<source>/skills/<skillId>）；前端对 installable === false 的条目显示「托管」徽标、禁用安装按钮并给出 tooltip 说明，不再回填不可安装地址。
  - 实测：带代理 40 条热门里 37 可装、3 托管；ui-taste installable=false、URL 正确；find-skills installable=true。
  - node --check 双半边 exit 0。
  - 待验收：F5 后市场里域名来源技能显示「托管」且按钮禁用；GitHub 来源仍可弹窗选目录并安装。

- 上一轮：2026-11-21 18:2x 修复搜索后设置页空白 + 市场安装改为确认目录（commit c072c99，merge b39743e）
  - 空白页根因（BUG-006）：新加的 ClearField 是模块级组件，却调用 Page 内部的 say；输入框为空时不渲染清除 X 所以不触发，一旦有值（搜索/输入）就 ReferenceError，整块织音面板卸载成空白。改为 clearLabel 默认 prop，不再引用 Page 作用域。
  - 市场安装：不再静默直装；点安装打开安装弹窗（与「通过地址安装」一致），预填 source + 技能名，先选安装目录（技能库/用户目录/项目），点「安装技能」后宿主按技能名精确只装这一个并平铺到目标根；未匹配才列候选且默认不勾选。
  - 新增 installSkill 状态；runInstall 携带 skill；普通安装入口重置 installSkill；市场卡片安装按钮不再转圈。
  - 实测：克隆 vercel-labs/skills 后 findSkillDirs 命中 find-skills（与 skills.sh skillId 对得上）；events.ndjson 显示 design-mobile-apps 已平铺装到 ~/.agents/skills。
  - node --check 双半边 exit 0；模块级 say 引用扫描为 0。
  - 待验收：重启 DSH + F5 后，市场搜索不再空白；点安装先出目录选择弹窗再装这一个技能。

- 上一轮：2026-11-21 17:1x 技能市场体验与安装修正 + 全局输入框清除 X（commit b1af7e1，merge 23f9a62）
  - 市场卡片：列表改大卡片（cardGrid）；技能名可点击跳转 skills.sh 技能页（/source/skillId）；前 12 张卡按需从详情页 ld+json 取描述（宿主 /zhiyin/market/desc 代理 + 30 分钟缓存）
  - 热门修正：skills.sh 无 trending API，原 q=skill 只捞到低安装量仓库；改为 find/agent/pdf/writing/design 多词合并去重后按 installs 降序，实测 40 条唯一且百万级（find-skills 4.46M…）
  - 安装修正：市场点某个技能时传 skill，宿主按 SKILL.md 的 name（或目录名）精确匹配只装该技能，并始终平铺到目标根（不新建仓库目录）；匹配不到才退回弹窗且默认不预选；候选上限 30→200
  - 其它图标一起转：busy key 从 source 改为唯一 id，只有被点的卡片转圈
  - 代理根因：Node fetch 不读 HTTP(S)_PROXY（本机 Clash 7890），undici ProxyAgent TLS 被重置；新增 httpGetText：有代理走 curl.exe（-L -x），无代理回落 fetch；市场搜索/描述/SKILL.md 直链统一使用
  - 全局输入框：新增 ClearField（框内右下角 X 一键清除），应用到技能搜索、市场搜索、成员搜索、新建/改名技能包、安装路径、导入名称/路径/正文、导入配置正文；复选框/单选不动
  - node --check 双半边 exit 0；带代理实测 marketSearch 200/40 条、marketDescription 200
  - 待验收：重启 DSH 后 F5 看市场大卡片/点击跳转/描述/热门量、点安装只装该技能且平铺、所有输入框 X

- 上一轮：2026-11-21 15:5x 新增技能市场（skills.sh）+ 安装按钮语义化 + 说明句上移 + 加载态修复（commit 211c756，merge 3313af7）
  - 技能市场：新增第三个页签「技能市场」；宿主新增 GET /zhiyin/market 代理 skills.sh 公开搜索（浏览器跨域拿不到）；空查询=热门（q=skill + installs 降序，skills.sh 无 trending API）；关键词搜索；每行显示名称/来源/安装量/已安装徽标，一键安装到 ~/.agents/skills（多技能仓库返回 multiple 时自动打开安装弹窗勾选）；结果 5 分钟缓存 + 3 次重试（skills.sh 多 IP 个别超时）
  - 参考 AI Vault：SKILLS_SH_SEARCH_API=https://www.skills.sh/api/search?q=&limit=，字段 {name,source,installs}；实测 host 侧 fetch 成功（trending 返回 find-skills 446 万安装）
  - 安装按钮语义修正（/tuyi）：图标由 download 形（易读成下载）改为 package-plus（加一个技能包），并从纯图标改为「图标+安装技能」的品牌色主按钮，一眼可找
  - 说明句上移：把「技能包开关决定包内技能是否对 agent 可见；单个技能也可以随时停用」移到标题下方最上方，删除页尾同一句
  - 加载态修复：「正在读取技能列表…」原是列表视图三元表达式的 else，切到技能包/卡片视图时会常驻；改为仅 !data 时显示，列表 else 返回 null
  - node --check 双半边 exit 0；marketSearch 真实网络实测 200（重试后）
  - 待验收：完整重启 DSH 加载宿主 /zhiyin/market 后，F5 看「技能市场」页默认热门、搜索、一键安装

- 上一轮：2026-11-21 01:0x 备注编辑改为编辑框内联操作 + 全部弹窗统一右上角 X + 死代码清理（commit 5d7ecb7，merge 80b1dc2）
  - 备注编辑弹窗：去掉底部「取消/保存」，改为编辑框内右下角并排两个图标——X=清空已输入、✓=保存（保存中显示 spinner）；仅编辑态出现；右上角 X 仍为关闭
  - 弹窗统一 X：新建技能包 / 改名 / 导入技能包 / 导入配置 / 备份 / 备注，全部在标题右侧加关闭 X，并移除底部「取消/关闭」文字按钮；有主操作的只留主操作
  - 死代码清理（-472 行）：移除组合/合奏页（tab、状态、comboRequest/openComboPreview/runCombo、4 个组合弹窗、渲染块）、包冲突声明弹窗、排除/常驻 setIntentFlag 等已从 UI 移除的残留（后端路由按 DEC 保留）；仅剩未使用的 combo 文案键（纯数据，不影响运行）
  - node --check client exit 0；删除后逐块校验标记唯一、无残留代码引用（仅 locale 文案键）
  - 待验收：F5 后点技能备注看内联 X/✓、各弹窗右上角 X、页面不再有组合页痕迹

- 上一轮：2026-11-21 00:3x 安装按钮状态机 + 图标化 + 排序下拉可见性（commit f8cda87，merge 62949f7）
  - 安装按钮状态机（/tuyi motion-statemachine）：runInstall / runInstallSelected 期间按钮显示旋转 spinner + 「安装中…」并禁用，防重复提交；成功关闭弹窗，失败回退可重试；多选时「全选/全不选」一并禁用
  - 安装弹窗：左下「取消」移除，右上角加 X 关闭图标（busy 时禁用，避免安装中误关）
  - 排序下拉看不见：原生 <option> 弹层不继承 select 样式，深色主题白底浅字；给每个 option 显式深底浅字（VS Code 主题变量），并在「排序」前加 sort 图标
  - 图标优化（/tuyi 槽位）：ICONS 增补 download/upload/undo/history/sort 5 个；页头「导出/导入/撤销上次/备份列表」四个文字按钮改图标按钮（带 title + aria-label）
  - node --check client exit 0
  - 待验收：F5 设置页看页头 4 个图标、排序下拉能看见全部选项且带图标、点安装技能时按钮转圈并显示「安装中…」、安装弹窗右上角 X

- 上一轮：2026-11-20 23:1x 提示竖排修复 + 「全部技能」按可见世界计数 + 统计卡来源构成（commit 2237e0d，merge 1f7b1dc）
  - 提示竖排真凶：刷新图标按钮在 state.loading 时把 say('loading')=「正在读取技能列表…」塞进 30×30 图标按钮 → 竖排；改为 SVG SMIL 旋转 spinner（不注入 CSS，规避 CSP），开关技能包触发 reload 时不再竖排
  - 「全部技能」计数 bug：原按全量观测（177，含未开启的 .agents 66）算；改为按「此刻织音能看见的世界」——agentsRoot 关时排除 user-agents，得 111，与「技能总数」一致；宿主 collectState 与客户端显示双侧同口径（成本也按可见集算）
  - 数字自解释：统计卡下补一行「来源：用户目录 96 · 内置 14 · 自定义 1」；技能总数 hint 改为「= 可自动调用 + 仅手动调用」，内置 hint 注明「已计入可自动调用，不额外相加」
  - 实算：可见 111 = 用户目录 96（可自动 81 + 仅手动 15）+ 内置 14 + 自定义 1(dsh-doc)；可自动调用 96 = 81+14+1；仅手动 15 全来自用户目录
  - node --check 双半边 exit 0；宿主模块加载冒烟 + hiddenReason 通过
  - 待验收：F5 看到 spinner 与「来源」行、全部技能=111；「全部技能」数字完全生效需完整重启 DSH（宿主 collectState 改动）

- 上一轮：2026-11-20 22:3x 观测自动刷新（FR-017）+ 干跑验证 + 统计卡计数修复（commit 07faabd→98269f2；e5e668c→99d9ee1）
  - FR-017：客户端在「切回页面 / 页面重新可见」时（window focus + document visibilitychange，3 秒节流）自动重取 /zhiyin/state；从别的工具（如 AI Vault）装/卸技能回来后列表自动更新，不必手动点刷新
  - 真代码单测 hiddenReason 11 项全 PASS：全部技能默认包开/关、在启用包、只在停用包、共享技能、手动停用优先、allOff 最高优先、bundled/custom 不受包约束、agents-root、unpacked
  - 干跑安装 13 项全 PASS：resolveGithubSource 解析 owner/repo、GitHub 链接、/tree、/blob …SKILL.md、npx skills add、gh repo clone、带引号路径、4 类非法输入；findSkillDirs 在合成多技能目录里只取 skills/alpha、skills/beta（跳过 .git/node_modules）；frontmatter 取 name（alpha / beta-x）；git ls-remote GitHub 通
  - 运行态 /zhiyin/probe：两个 Agent 模型面 catalog.count=109、用户面 disabledVisible=[]（停用技能不泄漏到 / 菜单）
  - __test 增补 resolveGithubSource / findSkillDirs / skillFrontmatterName 便于干跑
  - 修复：统计卡「已停用」漏算 disabled 导致显示 undefined；补齐 counts.disabled / counts.internal（「不可直接调用」卡仅在 >0 时出现）
  - 术语终稿：可自动调用（Agent 自己选用）/ 仅手动调用（只能 /名字，均带 disable-model-invocation: true）/ 已停用（被开关挡住，文件仍在）；locale 未覆盖这些键，显示以组件字面量为准
  - 待验收：F5 设置页后切到别窗再切回，列表应自动刷新；完整重启 DSH 才加载宿主改动（本轮宿主只多导出测试符号，行为无变化）

- 上一轮：2026-11-20 21:4x 「全部技能」默认包 + 调用方式卡片改名（commit 6fc60b5，merge 2e40df1）
  - 移植 AI Vault 的默认包：id `__all__`、名「全部技能」，成员随观测动态变化（不在 state 里存成员），不可改名 / 删除 / 编辑成员，只能启停
  - 默认开启：首次运行无 state.json 时直接给带默认包的初始状态；老状态 v3 迁移时补包并默认开启，同时把具体包关掉——保证升级后不会出现“什么都不可用”
  - 互斥：开「全部技能」→ 所有具体包自动关；开任一具体包 → 「全部技能」自动关；具体包之间可同时开（并集）
  - 生效：`hiddenReason` 先看默认包，开着就直接生效（仍受 allOff / agentsRoot / 单技能停用约束）
  - 界面：默认包排在最前，显示「N 个技能」+「默认」徽标，状态按自身开关显示全部启用 / 全部停用；没有管理成员与 … 菜单
  - 导入/导出：导出带默认包；导入时强制存在，导入的默认包开着则具体包一律关
  - 统计卡改名（对齐 DSH 语义：modelInvocable = 未设 disable-model-invocation；userInvocable = 未设 user-invocable: false）：模型可用 →「可自动调用」；仅用户可用 →「仅手动调用」；仅内部可用 →「已停用」（原口径把被停用技能也算成两个入口都关，数字误导）；真正的「不可直接调用」（两个入口都关）只在 >0 时单独出现
  - 冒烟：19 项 PASS（默认包存在且开、新建包自动关默认包、开默认包清具体包、两个具体包可并存、改/删/编成员默认包一律 400、导出含默认包、导入后默认包开且具体包关、默认包开时托管技能生效、手动停用优先、默认包关且无包 → unpacked、bundled 不受影响）；node --check 双半边 exit 0；渲染桩与 i18n 通过
  - 待验收：完整重启 DSH 后看默认包是否排第一且开启、新建/切换包的互斥行为、统计卡新名字与「已停用」数字

- 上一轮：2026-11-20 19:5x 撤销「包驱动软链接」，改为「文件不动、包只决定生效面」（commit e2ad0e1，merge be6ec2b）
  - 用户纠正：.dsh/skills 是 DSH 的可见目录，AI Vault 把 96 个技能软链到这里，这些就是可见技能；.agents/skills 勾选后是「两边全部可见」的管理视图；技能包决定的是「生效」，不是文件增删
  - 撤回：删掉 linkPlan / applyLinks / GET+POST /zhiyin/links / state.linked，以及包 toggle、全部停用、单技能开关、安装、卸载、导入配置、回滚里的全部链接写入；.dsh/skills 不再被包的开关改写
  - 已恢复：96 条软链接全部在位（AI Vault 重建），目标都指向 ~/.agents/skills，无断链
  - 新语义：hiddenReason 对托管来源（user-dsh / user-agents）先判包——不在任何包里 → unpacked（未加入技能包，不生效）；在包里但包全停 → pack；bundled / custom 不受包约束；单技能停用仍是 manual 优先；allOff / agentsRoot 优先级不变
  - 界面：卡片与列表对 unpacked 显示「未加入技能包」，开关置灰并提示「先加进一个启用的技能包」；告警区新增「有 N 个技能未加入技能包，当前不生效」；技能包页的链接状态行与「同步链接 / 清理旧链接」按钮全部移除
  - 安装：target=agents 装进 ~/.agents/skills 后顺手在 ~/.dsh/skills 建一条软链接（否则 DSH 看不到），target=user 直接放 .dsh/skills；只建不删
  - 冒烟：10 项 PASS（user-dsh / user-agents 未入包 → unpacked；bundled / custom → 可见；启用包 → 可见；停用包 → pack；manual / allOff / agents-root 优先级正确）；node --check 双半边 exit 0；渲染桩通过；i18n 无缺键
  - 后果（预期）：重启后只有启用包成员的托管技能生效；92 个未入包技能仍在 .dsh/skills 与列表里，但不再进模型面；要用就把它们加进包

- 上一轮（已撤回）：2026-11-20 18:0x 旧链接收口（B 方案）：~/.dsh/skills 只剩启用包成员（commit 899fac3，merge a286901）
  - 背景：软链接模型要求「启用包 → 成员链接」，但历史遗留 96 条全量链接里有 92 条不属于任何包，导致关包不生效（DSH 仍能看到 96 个技能）
  - 清单核对：92 条全部是软链接、目标都在 ~/.agents/skills、都能解析；保留 4 条 = test + test2 的启用成员（academy-guide / accessibility-a11y / ask-matt / brainstorming）；完整清单落在 `<stateDir>/legacy-links-2026-11-20T09-55-15-445Z.json`，可按清单重建
  - 安全前提：只删「不在任何包、也不是织音创建」的链接；删除前逐条校验仍是软链、目标在 ~/.agents/skills 内、未被新包接管
  - 执行结果：removed=92，skipped=0；~/.dsh/skills 现在 4 条，全部是启用包成员
  - 后端：linkPlan 增加 legacy 清单；applyLinks(state, {pruneLegacy}) 才清旧链接（默认不碰）；POST /zhiyin/links 支持 {apply:true, pruneLegacy:true}，note('links-applied') 记 pruned
  - 前端：链接状态行多显示「N 条旧链接不在任何包里」+「清理旧链接」按钮（确认后执行）
  - 冒烟：隔离家目录 10 项 PASS（legacy 识别、默认 apply 不动旧链接、prune 清 2 条且目标链接保留、state.linked 干净）；node --check 双半边 exit 0；渲染桩与 i18n 检查通过
  - 预期变化：完整重启 DSH 后 user-dsh 只剩 4 个技能（外加内置/项目来源），不再是 96 个

- 上一轮：2026-11-20 16:2x 按用户设计意见改为「SSOT + 技能包驱动软链接」（commit 60dc060，merge 2353953）
  - 设计口径（用户 m05143）：技能名就是 SKILL.md 的 name、也就是 DSH 调用标识（kebab-case），目录名必须同名，不能用中文；安装目标要能落到 ~/.agents/skills；技能包不再只是开关，而是「启用包 → 成员软链接进 ~/.dsh/skills」，DSH 只看到启用包的技能
  - 安装：新增 target=agents（~/.agents/skills，默认）；技能名以 frontmatter name 为准，目录名同名；名字必须匹配 DSH 的 ^[a-z0-9]+(?:-[a-z0-9]+)*$；传入的 name 与 frontmatter 不一致直接 400；安装弹窗去掉「技能名」输入框，改为三段目标单选
  - 链接模型：linkPlan 计算 current/desired/managed/add/remove/missing；applyLinks 用 junction 软链接到 SSOT；state.linked 记录织音自己创建的链接，删除包后仍能清理；不在任何包、也不是织音创建的旧链接不碰；allOff 时 desired 为空，链接全部收起
  - 自动同步：包 toggle / members / delete / import、单技能开关、全部停用、安装、卸载、导入配置、回滚后都调用 applyLinks；新增 GET /zhiyin/links（只读计划）与 POST /zhiyin/links {apply:true}（手动兜底）；collectState 输出 links
  - 设置页：技能包页顶部显示「已链接 N · 包期望 D · 待补 A · 待清 R」，缺失成员标黄，右侧「同步链接」按钮
  - 干跑（隔离 USERPROFILE/DSH_HOME）：26 项 PASS——安装到 agents、中文名 400、名字不一致 400、frontmatter 优先、建包/成员自动链接、包关断开/包开重链、旧链接被包接管后包关即断、幽灵成员 missing、allOff 收起/恢复、删包清链接、手动 apply、user 目标直装；node --check 双半边 exit 0；渲染桩通过
  - 真实状态只读计划：3 个包（test/test2/test3），desired=4、managed=6、current=96、add=0、remove=0、missing=0；92 条旧链接不属于任何包，按安全策略不碰。若要做到「只启用 test1 时 DSH 只有 test1」，这 92 条需要先接管或清理——待用户决定
  - 待验收：完整重启 DSH 后看安装目标三段、包开关产生/移除软链接、全部停用收起链接；远程安装仍需真机网络

- 上一轮：2026-11-20 15:1x 移植 AI Vault 可移植部分（commit 67cee70，merge 17957b6）
  - 用户明确 AIVault 是独立成熟工具，织音只移植可移植部分；个人项目在 D:\Workspace\Code，读码优先 CodeGraph MCP
  - 安装：粘贴地址 → 扫描仓库 → 多选技能 → 一次批量安装；前后端共用 10 分钟 repo clone 缓存；技能名优先 SKILL.md frontmatter name，1–64 字符且字母数字首尾；临时目录 + 原子 rename，过滤 .git/node_modules；失败候选保留，可重试（POST /zhiyin/install/batch）
  - 包成员：候选池 = 全部可见技能 + 已在包内但被 .agents 挡住/未安装的成员；搜索只过滤显示，不动已选；全选 = 未手动停用技能 + 包内隐藏成员，不受搜索影响；新建包默认选中未手动停用技能；保存去重
  - 单技能开关成为底线：hiddenReason 先判 manual 再判包；包只决定组是否上场，不替成员强行打开；被包/总开关挡住的开关置灰，提示先开上层
  - 备注：卡片与列表的备注可点开看全文（最高 60vh、保留换行），可转编辑；沿用本地 notes 字段
  - 冒烟：隔离 USERPROFILE 下 9 项 PASS（manual 优先、包停用、批量空/非 GitHub 400、非法名、原子安装）；渲染桩 baseline 与成员/安装/备注弹窗均通过；node --check 双半边 exit 0
  - 待验收：完整重启 DSH 后验证真实 GitHub 单/多技能安装、成员全选与保存、备注查看/编辑；远程安装依赖本机 git 与网络
- 上一轮：2026-11-20 14:3x 简化界面 + 重做安装入口（commit bcbd302，merge 2a38d8c）
  - 用户反馈「一件简单的事做得看不懂」：界面收敛为「技能 / 技能包」两页；移除组合/合奏页签、包冲突徽标与声明入口、排除/常驻按钮、生效面矩阵；底部提示改为「技能包开关决定包内技能是否对 agent 可见」
  - v2 状态迁移：readState 检测 v!=2 时把 intent 归零为兼容模式、清空 combos 与包的 conflictsWith（路由保留，只为兼容旧导出）
  - 安装弹窗改成一个输入框：支持 owner/repo、GitHub 链接（含 /tree /blob）、npx skills add、gh repo clone、SKILL.md 直链、本地文件夹；后端 git clone --depth 1 到临时目录找 SKILL.md，多技能列出候选，名字优先 frontmatter name
  - 技能卡保持瀑布流（columnWidth 320）；备注、刷新/加载文案、幽灵告警只针对启用包等上一轮修正一并保留
  - 冒烟：v2 迁移 intent=compat / combos=0 / conflicts=0；本地文件夹经文本框安装成功且取名 frontmatter；重复 409；坏来源 400；渲染桩通过；node --check 双半边 exit 0
  - 待验收：完整重启 DSH 后看两页签、安装弹窗粘贴 GitHub 地址、包开关与全部停用；远程安装依赖本机 git 与网络
  - 上一轮：2026-11-20 13:1x 一致性修复入口 + 只读来源标注（commit b5df5e2，merge f0fe5b8）：给 FR-022 补上修复动作，补齐 FR-026
  - 宿主新增 POST /zhiyin/repair：只剪掉观测不到的引用——技能包里不存在的成员、组合里不存在的包、意图里不存在的技能；修复前先备份（复用 backupState），修复后再观测即为 synced。观测不完整（lastComplete=false 或本次快照 complete=false）时返回 409，不猜哪些引用失效
  - collectState 每个技能新增 uninstallable / readOnly / readOnlyReason：判据是该技能名是否真实存在于安装根（~/.dsh/skills 或 <项目>/.dsh/skills），与 /zhiyin/uninstall 的查找逻辑同源；counts 新增 readOnly
  - /zhiyin/uninstall 找不到时给出「不在织音管理的技能目录里（只读来源），无法卸载」，不再只报 skill not found
  - 设置页：一致性胶囊为「有漂移」时旁边出现「修复」按钮（确认后列出要剪掉的技能名，执行完提示结果）；技能卡与列表行显示「只读」小字并悬浮说明原因；只读技能不再显示卸载按钮（此前对没有安装目录的 66 个 .agents 技能也显示，点了必然 404）；生效面矩阵脚注补「N 个技能属只读来源：只能启停，不改文件、不卸载」
  - 冒烟：管理根内技能 uninstallable=true / 目录外 readOnly=true / counts.readOnly=3；无漂移时 repair 返回 changed=false；造幽灵成员与幽灵意图后 drifted → repair 200 且 missing=['ghost-skill']、写出备份、之后 synced、包成员与意图均已清理；观测不完整时 repair 409；渲染桩确认「修复」按钮、矩阵脚注与列表「只读」都在；node --check 双半边 exit 0
  - 待验收：宿主改动需完整重启 DSH 后验证「修复」按钮与只读标注
  - 上一轮：2026-11-20 12:3x 包冲突声明与三态一致性 + 不完整观测保护（commit 6cdcb09，merge 5417d0c）：补齐 FR-005、FR-022，收紧 FR-010 与 FR-019
  - 技能包新增 conflictsWith：pack create/import/copy 默认空数组；新增 pack action=conflicts 设置互斥包（只留存在的包、去自身、去重）；collectState 每个包输出规范化 conflictsWith
  - 冲突双向预检（FR-005）：新增 conflictPairsFor / activePackIds；启用包、应用/叠加组合前先算生效集合里的冲突对，命中默认 409 阻断，body.ack=true 才放行并 note('conflict-ack') 留痕（不落永久忽略）；preview 结果带回 conflicts
  - 三态一致性（FR-022）：collectState 输出 consistency —— complete=false → degraded；包引用观测不到的技能 → drifted（带 drift 清单）；否则 synced；同时持久化 lastComplete / lastGoodAt。pending / failed 在同步投影模型下暂无对应态
  - 常驻与排除冲突改为报错（FR-010）：/zhiyin/intent 不再静默互斥，命中时返回 400
  - 不完整观测保护（FR-019）：上一次观测 lastComplete=false 时，全部停用、包停用、组合应用/叠加、多技能批量停用返回 409，提示先重新观测
  - 设置页：元信息条加一致性胶囊（一致 / 观测不完整 / 有漂移，悬停出原因与漂移清单）；告警区新增「技能包冲突」条目；技能包卡显示「冲突 N」徽标，… 菜单加「声明冲突包」勾选弹窗；应用组合命中冲突时确认「仍然应用并留痕」
  - 冒烟：冲突声明 → preview 报 1 对 → 无 ack apply 409 → ack apply 200 且 intent=orchestrated〔p1,p2〕；alwaysOn-on-excluded 400；incomplete 时 allOff / 包停用均 409；complete=false → degraded、幽灵成员 → drifted；导出带 conflictsWith；渲染桩跑通包页 + 冲突弹窗（含勾选框）；node --check 双半边 exit 0
  - 待验收：宿主改动需完整重启 DSH 后验证冲突声明/阻断/仍然应用、一致性胶囊与不完整观测保护
  - 上一轮：2026-11-20 00:1x 技能包引用计数 + 生效面矩阵 + 备份列表（commit e403b3e，merge e1bc4b8）：补齐 FR-008、FR-020，并给 FR-025 一个可点开的界面
  - collectState 给每个技能补 refCount / refs：列出含它的技能包名（FR-008），用于「停用不误关共享」——被多包引用的技能停用前能先看清
  - 技能卡与列表行：refCount > 1 时显示「引用 N」小徽标，悬浮列出具体包名
  - 设置页新增「生效面矩阵」区块（FR-020）：模型目录 / skill 工具 / /name 菜单 / 可信 get() 四行，各标注由谁控制与当前生效数量；注明技能包启用不放宽源策略、GUI 斜杠菜单默认不接管
  - 前端新增「备份列表」弹窗：列出 stateDir 下 backup-*.json（时间 + 文件名，新的在前），可任选一份回滚，回滚前再备份当前态；页头加入口
  - 冒烟：refCount/refs 正确（skill-1 被 A、B 两包引用 → refCount=2；只被停用包引用 → hiddenReason=pack）；/zhiyin/backups 返回 200；导入后备份文件 +1；node --check 双半边 exit 0
  - 待验收：宿主改动需完整重启 DSH 后验证矩阵区块、引用徽标与备份弹窗
  - 上一轮：组合/合奏意图/批量/回滚落地（commit de23008，merge ca27269）：功能面补齐 PRD FR-010~014、FR-023、FR-025
  - 宿主新增 POST /zhiyin/combo：create / rename / setPacks / delete / preview / apply / stack / exit；组合只存包 ID（PRD §7.3），预览用「最终生效集合」而不是增量，叠加先出叠加预览再执行
  - 宿主新增 POST /zhiyin/intent：单技能排除与常驻互斥切换（FR-011/FR-010），只改意图、不动包；hiddenReason 优先级落为 allOff > agentsRoot > 排除 > 常驻 > 合奏模式 > 包停用 > 手动停用
  - /zhiyin/skill 支持 names[] 批量提交：一次写盘、一次 invalidate，目录只翻一遍（FR-023）
  - 新增 GET /zhiyin/backups 与 POST /zhiyin/rollback：导入前必有备份，回滚前再备份当前态；备份只留最近 20 份（FR-025）
  - collectState 输出补 packs[].active / packs[].cost（每包目录成本，FR-021）、combos、intent；导出/导入的 combos/intent 从占位变成真实字段，导入时清洗幽灵包 ID
  - 设置页新增「组合」标签页：合奏模式条、组合卡（应用/叠加/预览/改名/删除/选择包）、未编配与组合未纳入标记；技能行与卡片加排除·常驻按钮；列表视图加复选框与批量条；页头加「撤销上次」
  - 冒烟：组合名 1–40 与重名拒绝、setPacks 去重清幽灵、preview on/off/enable/hide/unassigned、apply/stack 落意图、排除与常驻互斥、导出 11 键无 known、导入 round-trip 保 combos+intent、批量 applied=2、回滚恢复 mode/combos/alwaysOn、坏文件名 404；渲染桩跑通三标签页与全部交互（POST 载荷逐条核对）；node --check 双半边 exit 0
  - 待验收：宿主改动需完整重启 DSH 后由用户验证组合页、排除/常驻、批量条与撤销上次
  - 上一轮：导出/导入配置落地（commit 500f04d）：导出瘦身、导入备份、错误分流
  - 宿主新增 GET /zhiyin/export：只导出最小集（schemaVersion/exportedAt/pluginVersion/agentsRoot/allOff/disabled/packs/exclude/combos/intent），对齐 PRD C-18
  - 导出不再带 known：它是观测缓存、可由 collectState 重建；带上会让文件涨到 84KB 并撑爆导入侧 64KB body 限制（现导出 360 字节）
  - 宿主新增 POST /zhiyin/import：替换语义——先落一份带时间戳备份再覆盖 packs/agentsRoot/allOff/disabled；缺 packs 不清空现有包；回报未安装成员清单
  - 导入对 known 只合并不覆盖：本地观测元信息优先，旧快照不污染现状
  - post() 增加 body 上限参数：默认 64KB，导入放宽到 1MB；超限返 413、坏 JSON 返 400，不再把「太大」误报成「不是有效的织音配置」
  - 页面头部加「导出配置 / 导入配置」；导出失败独立文案「导出失败：」，不再混进「观测失败：」
  - 搜索加 250ms 防抖：输入值与生效查询分离，技能包页也按包名/成员过滤
  - 冒烟：导出 200/360 字节且无 known；round-trip 保住 packs 2 个、disabled、known 177 项本地优先、备份 1 份；坏 JSON 400、缺 packs 400、超限 413；node --check 双半边 exit 0
  - 待验收：宿主改动需完整重启 DSH 后由用户验证导出下载、导入恢复与错误提示
  - 上一轮：市场页参考落盘（dsh-market 分析 + 技能包语义确认），准备按新骨架改设置页
  - 两个开关从工具条挪进「设置组」卡片：加载 ~/.agents/skills（含合集/仅 ~/.dsh 说明）、启用技能、目录字符数与进度条；工具条只留 分段控件 + 搜索 + 动作图标
  - 接管状态从单独一行降级为标题右侧状态胶囊（悬停出说明），减少一行噪声
  - 字号建立层级：标题 22 / 组标题 13 / 名称 13.5·600 / 描述 12.5·0.62；名称去掉等宽字体
  - 大卡片启用细边框（1px，8–12% 透明度）+ 12px 圆角；统计卡、设置组、技能行统一为一套「容器」语言；小徽标仍不带边框
  - 技能行/技能包行的开关移到行尾，左侧留给名称——左缘不再被一排开关切断
  - 技能包成员预览只列前 6 个 + 「… +N」，长列表不再撑满两行
  - 段控与按钮改描边式，选中态用品牌色 accent 变量
  - 上一轮：UI 精修第四轮（tuyi 审查 P0/P1 修复）
  - P0：技能包删除从 close（×）改 trash 图标 + window.confirm（文案「删除技能包？包内技能不会被卸载。」）；close 会被读成「关闭面板」
  - P1：安装技能图标只在「技能列表」页出现，导入 txt 只在「技能包」页出现——两者同为「从外部引入」，16px 下轮廓相近且原先同排并置
  - P1：8 个图标按钮补 aria-label（原先只有 title，屏幕阅读器读不到名字）
  - 保留：卸载用 archive（槽位是「动作·可恢复」，字面即归档，语义正确；不用 trash 以免读成删除）
  - 未做：开关开态增加非颜色区分（P2 建议 knob 加内描边/对勾），因用户要求「任何图标、文字徽章都不要带边框」，暂缓
  - border 计数 0；node --check 双半边 exit 0
  - 上一轮：UI 精修第三轮（开关可读性 / 全图标化）
  - 开关：32×18 → 36×20，knob 14 → 16 加投影；开态改用品牌色 var(--zhiyin-accent, #e0743c)，关态淡灰轨道，两态对比明显
  - 品牌色来源：夜灯主题未暴露稳定 accent token（dsh-dream-skin 只有 --dsh-dream-skin-* 填充变量），故用 CSS 变量 + 橙色兜底，使用者可用 --zhiyin-accent 覆盖
  - 新增内联 SVG 图标组件 Icon（users/archive/close/plus/install/import/refresh），8 处文字按钮改图标按钮，全部带 title
  - 「卸载」由 ⤓ 字符改 archive 图标，按钮 28×28、无边框、浅底；管理成员改 users 图标（原先会换行）
  - border 计数仍为 0；node --check 双半边 exit 0
  - 上一轮：UI 精修第二轮（去边框 / 降噪 / 主题一致）
  - 全局去边框：卡片、按钮、图标按钮、输入框、文本域、弹窗、分段控件、徽标、pill、帮助圆点全部改底色，border 计数归零
  - 高亮色去蓝（rgba(96,165,250)→中性 rgba(128,128,128,…)），跟随宿主暖色主题
  - 行内三枚徽标 →「已停用」淡橙胶囊 + 一行 meta 文本（模型 · 用户／仅模型／仅用户／内部）+ 软链 ⛓ 小字
  - 预算从第六张卡拆成横贯整行的细条（标签／数字／4px 进度条／观测完整度）
  - 搜索框常驻，占位随 tab 变（技能包时搜包名或成员）
  - 统计卡网格 104 → 118px（少一张卡后一行仍放满）
  - node --check exit 0；border 计数 0；蓝色引用 0
  - 上一轮：UI 精修第一轮（可读性）
  - 技能行：checkbox → 无文字开关图标（32×18 轨道），行高 40→56，行内 gap 10→12，加浅底与 10px 圆角
  - 「卸载」文字按钮 → ⤓ 图标按钮（css.iconBtn），技能包「删除」同样改图标
  - 路径行从行内移除，改挂整行 title（悬停可见），减少每行一行噪声
  - 描述从单行截断改 2 行 clamp、字号 11.5→12、透明度 .58→.62
  - 统计卡网格 minmax 150→104px、间距 10→8、卡内 padding 10/12→8/10，六张卡一行放下
  - 工具栏 columnGap/rowGap 分离，搜索框 flex 基线放宽，控件拥挤时换行而不是挤压
  - node --check client.js exit 0
  - 上一轮：技能包导入 txt
  - POST /zhiyin/pack 新增 action=import：接受 path 或 text，解析 AI Vault 导出的技能包 txt（目录名 | 来源 | owner/repo | 分支 | 子目录，# 注释忽略），包名取 # 行 "Skill Pack: xxx"，可用 name 覆盖，按名去重
  - 页面技能包工具条新增「导入 txt」：弹窗可填绝对路径或直接粘贴内容，可选包名
  - 冒烟：真实 mattpocock.txt → 26 个成员、包名 mattpocock；粘贴去重生效；只有注释 → 400
  - 上一轮：安装/卸载写盘接入
  - 宿主新增 POST /zhiyin/install（源文件夹必须含 SKILL.md；目标根 = ~/.dsh/skills 或第一个在跑 Agent 的 <cwd>/.dsh/skills；同名 409，绝不覆盖）
  - 宿主新增 POST /zhiyin/uninstall（不删文件：移入 <profile>/zhiyin-proto/archive/<时间戳>-<name>，可恢复）
  - 页面：工具栏「安装技能」弹窗（路径 + 可选名 + 用户/项目根单选）；user-dsh、user-agents 行尾「卸载」按钮（带确认）
  - 冒烟：临时目录跑通 install 200 / 重复 409 / uninstall 移入 archive / 源目录消失 / 坏路径 404
  - 上一轮：技能包（Packs）第一版落地
  - 宿主新增 POST /zhiyin/pack：create / rename / toggle / copy / delete / members / reorder 七个动作，写 state.packs
  - 可见性规则不变：在包里 → 任一包启用即可用；不在包里 → 手动停用集合决定；allOff 优先级最高（冒烟验证 6 条规则全过）
  - 页面新增「技能列表 / 技能包」分段控件；技能包页 = 包行（整组开关、成员数、已停用徽标、管理成员、删除）+ 新建；
    成员管理弹窗 = 搜索 + 勾选 + 全选/全不选/保存
  - 冒烟：假 ctx 跑通 create/toggle/members/rename/copy/delete 与 state 回读；node --check 双半边 exit 0
  - 脚本级 self-review 通过；待真机验证（宿主需重启）
  - 上一轮：接入 impeccable：写入 PRODUCT.md（产物初始化）
  - 用户确认真机验证通过，启停阶段收口：fix/skill-disable-ui → b555e53 → 合并 e85668f → 推送 → 分支已删；补充提交 328707a
  - PRODUCT.md 落盘（平台 web；用户＝作者本人先用、将来给 DSH 社区；核心＝以上都要但以观测为地基；配置可导出/导入 JSON）
  - AGENTS.md 两处修正：读取快照规则改为 viewForAgent（旧「不带 scope」是 BUG-001 的错误结论）；根目录布局允许 PRODUCT.md / DESIGN.md / .impeccable/
  - 下一步：/impeccable document 固化既有视觉系统，再 /impeccable shape 技能包
  - 上一轮：内置技能卡 + 软链标记
  - 统计卡新增「内置技能」（source=bundled，当前 14），同样可点选筛选；五张卡 = 技能总数 / 模型可用 / 仅用户可用 / 仅内部可用 / 内置技能
  - 技能行新增「软链」徽标（hover 显示实体路径），区分 ~/.dsh/skills 里的符号链接与实体技能
  - 真机确认：宿主 21:00 重启后 /zhiyin/state 返回 root / logicalPath / linkTarget / allOff 字段；96 个 user-dsh 全部带 linkTarget，实体技能（当前 0 个）不会带徽标
  - 读取源确认：~/.dsh/skills 现存 96 条全为符号链接、实体 0 条；DSH 扫两个根，实体目录同样会以 user-dsh 出现（无需改读取逻辑）
  - 上一轮：统计卡即筛选 + 一键全部停用 + 逻辑路径显示
  - 统计卡（技能总数/模型可用/仅用户可用/仅内部可用）改成筛选按钮，点一下只看该类、再点回全部；删掉「模型可用」开关，只留「启用 .agents 技能目录」+「启用技能」两个开关
  - 卡片计数与列表同口径：总开关关掉时 user-agents 整组从四张卡里一起消失（总数 111 / 模型 96 / 仅用户 15 / 内部 0）
  - 「仅用户可用」口径修正为 user − both（15），四卡相加 = 技能总数
  - 新增「启用技能」总开关（state.allOff）：一键全部停用，hiddenReason 优先级最高（all-off）
  - 路径显示改为逻辑根（~/.dsh/skills、~/.agents/skills）+ 箭头指向链接目标，解释「满屏都是 .agents 路径」的错觉（~/.dsh/skills 96 条全是符号链接）
  - 上一轮：界面按用户口径重排
  - 列表默认只列「DSH 此刻能用」的技能：总开关关掉时，`user-agents` 来源的整组技能不再出现在列表
  - 「启用 .agents 技能目录」与「模型可用」改成开关样式，顺序：搜索框 → 启用 .agents 技能目录（带 ? 提示）→ 模型可用 → 重新观测
  - ? 提示文案：开启后，智能体将自动加载 .agents/skills 路径下的自定义技能
  - 技能行排版修复（名称/描述/路径由横排改竖排，单行截断）
  - 上一轮：用户面（/ 菜单）停用修复（三个注册表实例都挂策略 provider）+ 诊断路由 `/zhiyin/probe`
  - 真机检查（宿主 12:55:09 启动，GUI 58466）：`/zhiyin/state` 200、`managedScopes=1`、策略 provider 已注册；但只读到 14 个 bundled 技能 —— BUG-001
  - BUG-001 修复：`viewForAgent` 从技能注册表层表反查 scope key（自己 import `dsh-scope` 拿不到同一 Symbol，`scopeOf` 恒为 undefined）；全部 key 各读一次快照取最丰富者；响应加 `scopedScopes`/`scopeDebug`；影子候选回填原始元数据
  - BUG-002 修复：同名已注册不再每 2 秒重试（一条诊断 + `forceInvalidate` 兜底刷新）
  - `prototype/package.json` 增加依赖 `@deepseek-ai/dsh-scope`；本地验证：175 条 / scopedScopes=1 / 重复注册只留一条事件（`node --check` 通过）
  - 未提交：`prototype/index.js`、`prototype/package.json`（等重启验证后再提交）
  - 上一轮：文档收敛 + 定位澄清 + 版本锁定
  - 根目录只留 AGENTS.md / README.md / CHANGELOG.md / .gitignore 与 docs/、prototype/：PRD 进 docs/prd/，ADR 进 docs/adr/，UI 决议进 docs/design/，HANDOVER.md 改名进 docs/handoff/handoff-2026-11-17-m0-skills-provider.md
  - AGENTS.md 首行定位改为「技能管理插件，管安装、卸载、启停与技能包编组」，写盘边界（安装新建目录 / 卸载移入归档）写进 Permissions 与 Conventions
  - prototype/package.json version → 0.1.0
  - 市场风格设置页骨架（commit a700806）：页头下加元信息条（版本 · 观测时间 ｜ 右侧「全部停用/全部启用」主按钮）；告警区上移至内容之上（目录超预算 / 同名冲突 / 包内引用未安装技能）；标签页（技能 / 技能包）独立成行并带计数；工具条新增「卡片/列表」视图切换（localStorage 持久化）与排序（名称/来源/字符数/启用状态）；技能卡：等宽名 + 来源徽标 + 字符数 + 两行描述 + ●启用状态 + 开关；技能包卡：三态徽标（全部/部分/全部停用，由成员派生）+ 成员预览前 6 + 行尾 … 菜单（改名/复制/管理成员/删除）
  - 后端（同 commit）：包名 create/rename 校验 1–40 字符与重名；members 保存去重；collectState 增加 version 字段与 conflicts 同名冲突清单（按 来源|路径 去重）
  - git init（main）+ 首次提交 `1e3b33d` 并 push 到 origin（私有仓库）；credentials 走 gh CLI
  - 上一轮：初始化项目协作档案；git init（main）；.gitignore / CHANGELOG.md / README.md 三件委托交付并验收；codegraph 1.6.2 已建索引（5 文件 / 71 节点 / 195 边）
- **下一步**：重启 DSH 后验证启停是否真机生效（看 zhiyin-proto/events.ndjson 的 provider-registered），再做技能包（packs 状态已在 hiddenReason 里支撑）
- **本阶段禁止**：市场与发现、版本号升级、替换预设或消费者；安装/卸载的写盘实现须在技能包之后单独一个阶段做
