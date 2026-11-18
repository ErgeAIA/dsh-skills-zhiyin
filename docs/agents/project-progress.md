---
title: Project Progress
type: project-progress
project: dsh-skills-zhiyin
updated: 2026-11-17
description: >
  项目开发进度实时记录：阶段、分支、代码状态、最近进展。每次会话更新。
  AI 在本文件新增进展或修改当前状态后，必须同步更新 frontmatter 的 updated 字段为当日日期（YYYY-MM-DD）。
---

# Project Progress

> 记录当前任务状态、分支和最近进展。每次会话更新。
> 新进展插在「当前状态」之后、旧「最后更新」之前。

---

## 当前状态

- **当前分支**：main（技能停用修复走 fix/skill-disable-ui → 提交 b555e53 → 合并 e85668f → 已推送 origin，分支已删）
- **阶段**：原型期 P1——启停（模型面 + / 菜单面）、技能包、导入 txt、安装/卸载已实现并脚本冒烟通过；进入 UI 精修
- **代码**：prototype/ 两半边（index.js：/zhiyin/state、/zhiyin/probe、/zhiyin/skill、/zhiyin/settings、/zhiyin/pack、/zhiyin/install、/zhiyin/uninstall + 三注册表策略 provider；client.js：设置页含统计筛选卡、技能列表、技能包、成员管理、导入/安装弹窗）
- **代码**：prototype/ 两半边已就位（index.js 宿主：/zhiyin/state、/zhiyin/skill、/zhiyin/settings + 按 Agent 策略 provider；client.js 设置页含单个技能开关与「加载 ~/.agents/skills」总开关）；consumer.js 为已废弃的预设级消费者，仅作参考
- **版本**：prototype/package.json 锁定 0.1.0（开发期不升版）
- **工具链**：Node v24.22.1；插件包依赖 @deepseek-ai/dsh-skill / dsh-tools / dsh-llm 均 0.2.2-rc.3（prototype/package.json）
- **最后更新**：2026-11-18 23:4x UI 精修第一轮（可读性）
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
  - git init（main）+ 首次提交 `1e3b33d` 并 push 到 origin（私有仓库）；credentials 走 gh CLI
  - 上一轮：初始化项目协作档案；git init（main）；.gitignore / CHANGELOG.md / README.md 三件委托交付并验收；codegraph 1.6.2 已建索引（5 文件 / 71 节点 / 195 边）
- **下一步**：重启 DSH 后验证启停是否真机生效（看 zhiyin-proto/events.ndjson 的 provider-registered），再做技能包（packs 状态已在 hiddenReason 里支撑）
- **本阶段禁止**：市场与发现、版本号升级、替换预设或消费者；安装/卸载的写盘实现须在技能包之后单独一个阶段做
