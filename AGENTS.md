# AGENTS.md

<!-- mode: 半程合成 -->

## Permissions

IMPORTANT: 织音是 DSH 的技能管理插件，管的是技能的安装、卸载、启停与技能包编组；安装只新建目录，卸载只移入归档目录。
YOU MUST 会话开始先读 docs/agents/ 三件套与 docs/handoff/ 最新一份
YOU MUST 先复述现状与待确认项，再动手
YOU MUST 改码前先读 docs/prd/ZhiYin-PRD-v0.2.md 与 docs/agents/decision-log.md
YOU MUST 每次会话更新 docs/agents/project-progress.md
YOU MUST 改 AGENTS.md 前先读、改后追加 docs/agents/agents-changelog.md
YOU MUST 改某领域代码前先读 docs/agents/experience/<领域>/（存在时）
YOU MUST 按任务需要连续推进多个阶段，每完成一个功能自行 review（语法、假 ctx 冒烟、真机数据），不需要 UI 验收时不要停下来等；最后整体交付给用户验收
YOU MUST 安装写盘前先确认目标根（~/.dsh/skills 或 <项目>/.dsh/skills），同名冲突先问用户
禁止自行宣称已修复，修复结果须由用户验证
禁止整文件重写既有文件，只做最小精确补丁
禁止用全局同名 tool-skill、改预设或替换消费者来实现停用
禁止在目录不可见时退役 skill-catalog（会注入「当前没有技能可用」）
禁止卸载时直接删除技能目录，一律移入归档目录
禁止把技能正文硬编码进插件包，或让插件在无用户动作时改写技能文件
禁止把变更日志、人读说明、决策叙事写进本文件
禁止不记录就改动 AGENTS.md 的约定

## Toolchain

| 工具 | 精确版本 | 锁定位置 |
| ---- | -------- | -------- |
| Node.js | v24.22.1 | node --version（实测） |
| @deepseek-ai/dsh-skill | 0.2.2-rc.3 | package.json |
| @deepseek-ai/dsh-tools | 0.2.2-rc.3 | package.json |
| @deepseek-ai/dsh-llm | 0.2.2-rc.3 | package.json |

## Commands

| 场景 | 命令原文 | 来源 |
| ---- | -------- | ---- |
| 校验宿主半边语法 | node --check index.js | 本次实测 |
| 校验页面半边语法 | node --check client.js | 本次实测 |
| 安装插件包依赖 | npm install（仓库根目录） | package-lock.json |
| 让宿主改动生效 | 完全退出并重开 DSH，不是刷新页面 | README.md |
| 观测当前目录数据 | GET http://127.0.0.1:<port>/zhiyin/state | index.js |
| 查看发布内容 | npm pack --dry-run（仓库根目录） | package.json 的 files |

## Conventions

| 观察到的现象 | 要求 Agent 的行为 |
| ------------ | ----------------- |
| 仓库目录布局固定 | 插件包本体就在仓库根目录（index.js、client.js、paths.js、consumer.js、cordis.patch.yml、package.json、locale/、icon.svg、README.md、README.en.md），这样 GitHub 下载 / git clone 得到的就是可装插件；开发文档只进 docs/ 对应子目录（prd、adr、design、handoff、agents），根目录不再新增文档；AGENTS.md、PRODUCT.md、CHANGELOG.md、.gitignore、.gitattributes 属仓库自身文件 |
| 分发口径双白名单 | npm 包内容看 package.json 的 files；源码归档看 .gitattributes 的 export-ignore。开发文档一律不随包分发，也不进下载归档 |
| 会话文档体系固定 | 进度写 docs/agents/project-progress.md；决策写 docs/agents/decision-log.md；两者只追加不删历史 |
| bug 追加 docs/agents/debug-log.md | 格式 BUG-NNN；只追加不删历史 |
| 交接写 docs/handoff | 命名 handoff-YYYY-MM-DD-*.md |
| 交接文档同日多份 | 按文件名里的日期取最新（兼容 `YYYY-MM-DD` 与 `YYYYMMDD` 两种写法）；同日多份再取 frontmatter `updated` 最新者，仍不可判则列出问用户 |
| 改 docs/agents 或 handoff 须同步 updated | 改完立刻把 frontmatter updated 改为当日 |
| 改 AGENTS.md 须留一行变更记录 | 在 docs/agents/agents-changelog.md 追加「旧值 → 处置 → 去处」，无记录视为静默丢失 |
| 经验库按领域分目录 | 可复用经验落 docs/agents/experience/<领域>/；正文可改写、历史靠 changelog.md，与 docs/agents 其余三份的「只追加」不同 |
| AGENTS.md 杂音归宿 | 变更日志 → CHANGELOG.md（无则 decision-log.md）；人读说明 → README.md（无则不写）；决策叙事与踩坑 → decision-log.md 与 debug-log.md；执行流水 → init-report.md 与 project-progress.md |
| 仓库文档归属 | README 生成或优化 → shuxu；CHANGELOG 建立、改结构、归档版本 → changelog-manager，日常只按既有格式追加 `[Unreleased]`；.gitignore 新增或修正 → git-manager；其他角色只报告缺口，不代写 |
| 插件仍在开发阶段 | package.json 的 version 锁定 0.1.0，开发期不升版，改动靠重启 DSH 加载 |
| 启停只写本地状态 | 写 <profile>/zhiyin-proto/state.json 与 events.ndjson；启停不改动技能文件 |
| 安装卸载写盘边界 | 安装新建技能目录；卸载移入归档目录；两者都是用户显式动作，不得由启停或轮询触发 |
| 停用机制唯一 | 按 Agent 注册策略 provider，modelInvocable 与 userInvocable 双置 false；启用项不列，落回原生 provider |
| 读原生目录快照 | 用 viewForAgent：从技能注册表层表反查该 Agent 的 scope key，带 scope 读快照并与全局层比较取条目多者；不带 scope 只读全局层会丢掉用户级技能 |
| provider.list 有硬约束 | 只读内存快照，禁止在 list 内调用 ctx.skills.list/snapshot（会自锁） |
| 第三方插件无 Typert Remote | 宿主与页面通信用同源 HTTP 路由 `ctx.webServer.register`，前端 fetch |
| Git 分支纪律 | 一个任务一个分支，合并后收口并删除子分支；删分支前先核实合并状态并告知结论 |
| 每次交付须附下一步计划 | 回复任务完成情况时，须同时给出下一步计划：接下来做什么、为何、怎么验收；不只报结果，也不先说结论再补计划 |

## References

- 设计前先读产品真相 → 见 PRODUCT.md：平台、用户、定位、红线与设计原则
- 查产品口径与功能边界 → 见 docs/prd/ZhiYin-PRD-v0.2.md：PRD v0.2，含技能包与目录预算定义
- 查需求演进留档 → 见 docs/prd/ZhiYin-PRD-v0.1.md：旧版 PRD，已被 v0.2 取代
- 查架构取舍与被否方案 → 见 docs/adr/ZhiYin-M0-ADR.md：M0 架构决策记录与实测证据
- 查 UI 结构与交互决议 → 见 docs/design/ZhiYin-UI-决议.md：设置页信息架构与已定样式
- 接着上一轮实现往下做 → 见 docs/handoff/handoff-2026-11-17-m0-skills-provider.md：已实现范围、待验证项与下一步
- 安装、回滚插件 → 见 README.md：profile 注册方式与卸载步骤
- 用户怎么用 → 见 README.md / README.en.md 的「使用」段（`<!-- guide:start -->` 与 `<!-- guide:end -->` 之间）：装技能、技能包、归档恢复；插件页内的指南弹窗读的就是这一段，勿在代码里复制正文
- 会话开始复述现状 → 见 docs/agents/project-progress.md：当前分支、阶段与最近进展
- 核对最近交接 → 见 docs/handoff/：上一轮做到哪、卡在哪
- 规则冲突、回溯口径 → 见 docs/agents/decision-log.md：技术与流程决策记录，只追加
- 反复踩坑排查 → 见 docs/agents/debug-log.md：BUG-NNN 格式的根因与预防规则
- 查 AGENTS 自身变更 → 见 docs/agents/agents-changelog.md：契约改动的「旧值 → 处置 → 新值」
- 同领域可复用做法 → 见 docs/agents/experience/：按领域分的可复用经验沉淀

## Self-Maintenance

1. 改变规则的 PR 须同步改本文件，否则视为规则漂移
2. 规则写入错误发生处最近作用域，monorepo 进对应子包
3. 命令更名、重构后，提交前核对本文件并更新过期示例
4. 随发布或固定周期清除失效条目
5. 本文件修改走 PR/Review，与代码同等纪律
