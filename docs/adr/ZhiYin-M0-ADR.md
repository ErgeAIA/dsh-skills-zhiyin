# 织音 M0 技术结论书（ADR）

| 项目 | 内容 |
|---|---|
| 文档性质 | M0 接入点验证的**书面 ADR**（对应 PRD 附录 C 的 C-22） |
| 核验对象 | 本机 DeepSeek Harness Desktop `desktop` profile |
| 核验方式 | 只读源码 + **一次真实装机实验**（已回滚干净） |
| 版本 | v2 · 2026-11-16 · 依据实测推翻 v1 的主路判断 |
| 结论状态 | 机制已实测；主路已改；产品口径需回填 PRD |

> v1 的判断有一处严重错误，本版已改正，并保留错误痕迹以便复核。

---

## 0. 三句话结论

1. **技能消费者是「预设级」的，不是 profile 级。** `dsh-web-app` 的 `presets/standard.patch.yml` 在 `config.plugins` 里挂了 `tool-skill`（L45–46）。`ctx.tools.get('skill', agent)` 解析到**离 agent 更近**的那条，也就是预设实例。**在全局层注册同名工具，永远赢不了它。**
2. **因此 v1 推荐的主路（关掉 `dsh-base` 的全局行、全局挂自己的消费者）是无效的**——实测：全局注册成功，作用域查询仍然 `visible: false`。真正要替换的是**预设组合里的那一条**。
3. 结论：织音的接管必须发生在**预设组合内**。这既是限制也是清晰度——接管范围从"整个 profile"缩小到"选中该预设的会话"，反而更可解释、更可逆。

---

## 1. v1 错在哪（保留痕迹）

v1 读到 `dsh-base/cordis.patch.yml` 里有 `- id: tool-skill` 就断定"它是全局行，关掉它即可接管"。这个推论漏了一步：**同一个插件可以同时出现在基础 bundle 和预设组合里，而预设那条离 agent 更近，按 F1 的最近层规则直接胜出。**

实测证据（`%DSH_HOME%\profiles\desktop\zhiyin-proto\events.ndjson`）：

```json
{"event":"register","globalHoldsOurs":true}      ← 全局层确实注册成了我们
{"event":"pre-step","visible":false}             ← 但 agent 视角解析到的不是我们
```

`visible` 的判定在 `@deepseek-ai/dsh-tool-skill/src/index.ts` L224：
`ctx.tools.get('skill', agent) === skillTool`。全局能拿到、作用域拿不到，只可能是链上有一条更近的同名注册。

证据链补齐：`@deepseek-ai/dsh-web-app/presets/standard.patch.yml` L40–46 同时挂了 `skill-filesystem` 与 `tool-skill`。**技能这一整条能力，在 Web profile 里是预设级装配的。**

---

## 2. 已核实的平台事实（F1–F7 对账）

| 编号 | PRD 断言 | 核验 | 证据 |
|---|---|---|---|
| F1 | 分层；最近层同名直接胜出；rank 只在同层内比较 | ✅ | `docs/subsystems/skills.md` L13；`ctx.skills` 契约 |
| F2 | `registerProvider` 只写进调用上下文所在层 | ✅ | 同上契约原文 |
| F3 | `get()` 把 locator 交回该候选的 provider；正文不缓存 | ✅ | `skills.md` L142、L192 |
| F4 | 双调用策略：加载前查一次、加载后再查一次 | ✅ | `tool-skill/src/index.ts` L138–151 |
| F5 | 目录只含 name+description（默认 500）；变化追加 replacement | ✅ | `src/index.ts` L28、L229–255 |
| F6 | 两条独立通道：`/name` 手势、GUI 菜单读 `sessionSkillCatalog` | ✅ | `src/index.ts` L181–208；`sessionSkillCatalog` 契约（只有 `list`） |
| F7 | 可挂全局、也可挂单个 Agent 组合；同名作用域内工具遮蔽全局 | ⚠️ 修正两点，见下 | `presets/standard.patch.yml` L45–46 |

**F7 的两处修正：**

1. **方向只有一个**：作用域内的同名工具遮蔽全局工具；**全局永远赢不了作用域内的那条**。所以"全局接管"这个选项在 Web profile 下不存在。
2. **被遮蔽的消费者不是安静退场**。它把快照改成空集，再和会话历史里的 digest 比，只要这个会话发布过目录，就**追加一份空目录**（`src/index.ts` L235–255 可推出）。实测触发过：第一轮实验里我们自己的监听器就干了这件事，往会话里注入了一条"当前没有任何技能可用"。已修正为"不归我管就不碰目录"。

**新增实测事实（文档没写、但必须知道）：**

3. **同层同名工具先注册者胜**，后注册者静默失败，不抛错。唯一可靠的判据是 `ctx.tools.get(name, agent) === 自己`。这就是**必须内建的启动自检**。
4. `presets/standard.patch.yml` 里 `skill-filesystem` 挂着 `customSkillDirs`（指向内置技能目录）。**自建预设若漏了它，内置技能会消失**。

---

## 3. 三条接管路径（按实测重排）

| 路径 | 改什么 | 覆盖范围 | 可逆 | 升级风险 | 结论 |
|---|---|---|---|---|---|
| **P-A 自建受管预设** | 装一个 bundle，其 patch 声明一个预设：`plugins` = 一份清单，其中 `tool-skill` 换成我们的消费者 | **只有选中该预设的会话** | 卸 bundle / 换预设 | 清单是我们自己的，不随上游漂 | **推荐主路** |
| **P-B 覆写 shipped 预设** | 按行 id 覆盖 `preset-standard` 的整段 `config` | 所有用 `standard` 的会话 | 卸 bundle | 需整段重述上游清单，上游一改就漂 | 备选（想"到处生效"才用） |
| **P-C 全局行替换** | 关 `dsh-base` 的 `tool-skill` + 全局挂消费者 | **什么也没覆盖** | — | — | **实测无效，废弃** |
| P-D 只读诊断（B3） | 什么都不改 | 只观测 | 完全可逆 | 无 | 保底分支 |

**P-A 为什么是主路：**

- 它是唯一"既生效、又不改别人清单"的做法：新增预设是加法，不动 `standard`、不动 profile。
- 清单归我们所有，DSH 升级只影响我们那份，不需要跟随上游重述。
- 可逆性最好：删预设或换预设即回默认消费者。
- 代价诚实：**接管是"选了这个预设的会话"**，不是"整个 profile"。UI 必须说清楚（见 §7 的 DR-14）。

---

## 4. 推荐架构（B1′，已按实测修正）

```text
zhiyin/                        一个 bundle
├── host/                      全局：数据与纯逻辑，不碰目录发布
│   ├── domain.ts              defineDomain: packs / scores / intent / projection_log / meta
│   ├── intent-service.ts      意图唯一写入者（revision 乐观并发）
│   ├── observer.ts            按 (cwd, scope) snapshot() + last-known-good
│   ├── projector.ts           纯函数：Intent × Observed → Projection
│   └── remote.ts              Typert Remote（client 只经此访问 Node 侧）
├── consumer/                  预设级：投影执行面
│   ├── skill-tool.ts          同名 `skill` 工具，正文走 ctx.skills.get()
│   ├── catalog.ts             pre-step 发布 / 退役目录
│   └── gesture.ts             /name 手势
├── presets/zhiyin.patch.yml   声明我们自己的预设（含 consumer 行、skill-filesystem）
├── client/                    Settings → 织音（settings.section 单页多标签）
└── shared/                    类型、并集/预算/冲突纯函数、locale
```

装 bundle 时，用户得到一个新预设；选中它即"接管"，换回原预设即"撤销"。

**目录消息的 kind**：接管后上游消费者不在场（我们替换了那一行），`skill-catalog` 只有一个作者，可以沿用上游 kind；Chat 渲染与 digest 语义保持一致。

**启动自检（必须有）**：每次会话首个 pre-step 比对 `ctx.tools.get('skill', agent) === 自己的定义`。为 false 就退到只读并写明原因——这正是本轮实测踩到的坑。

---

## 5. M0 实验清单（E1 已部分完成）

| 编号 | 实验 | 状态 | 结论 |
|---|---|---|---|
| E1a | 全局注册同名工具能否接管 | ✅ 已做 | **不能**：预设实例更近，`visible:false` |
| E1b | 关掉 `dsh-base` 全局行能否接管 | ✅ 已做 | **不能**：关的是另一条 |
| E1c | 自建预设内替换 `tool-skill` | ⬜ 待做 | 需在新会话里选中该预设 |
| E2 | 正文无损（directory / url / opaque） | ⬜ | — |
| E3 | 目录成本与"一次应用一条目录" | ⬜ | — |
| E4 | GUI 菜单漂移 | ⬜（预期确认） | 菜单读注册表，会列出未启用技能 |
| E5 | 六项回归 | ⬜ | — |
| E6 | 与已装技能类插件共存 | ⬜ | — |

---

## 6. 对附录 C 的落地建议

| 编号 | 建议 |
|---|---|
| C-01 | 保留 **B**（兼容模式默认） |
| C-04 / C-15 | 保留 **B / A**（草稿 + 显式应用） |
| C-02 | 保留 **A**（排除集全局持久） |
| C-05 | 保留 **A**（超预算拒绝发布） |
| C-18 | 保留 **A**（导出不含正文） |
| **C-25（新增）** | **接管机制：自建受管预设（P-A）为主路；覆写 shipped 预设为备选；全局行替换废弃** |
| **C-26（新增）** | **接管范围按预设计**：UI 必须显示"当前会话用的预设是否已被织音接管" |
| **C-27（新增）** | **启动自检是一等功能**：`ctx.tools.get(...) === 自己` 不成立即降级只读 |

---

## 7. 需要回填 PRD v0.3

| 编号 | 变更 |
|---|---|
| **DR-12** | §2.3 主路改为「**自建受管预设 + 预设内替换消费者行**」；全局接管删除 |
| **DR-13** | 新增：被遮蔽的消费者会追加退役空目录；**我们自己也不得在"非本消费者可见"时去退目录**（实测踩过） |
| **DR-14** | §2.6 限制 2 改写：接管范围是**选中该预设的会话**，不是 profile；UI 与话术同步 |
| **DR-15** | §2.4 Q1 问法改为「**预设内替换后能否稳定接管**」，并记录"同层先注册者胜" |
| **DR-16** | §2.5 B2 补充：覆写 shipped 预设需整段重述其 `plugins`，上游升级即漂 |
| **DR-17** | §11.4 parity 增补第 9 条：**启动自检**，失配即降级只读 |
| **DR-18** | §2.7 待核实断言新增一条：自建预设里 `skill-filesystem` 的 `customSkillDirs` 表达式（`baseUrl` + `createRequire`）能否在第三方 bundle 中照抄 |

---

## 8. 仍未核实

1. E1c 的运行时结果（**当前最大未知**）。
2. `@deepseek-ai/dsh-web-app` 的 `presets/*` 是否另有 `ptc` / `minimal` / `cordis` 三套，各自清单差异。
3. 第三方 bundle 能否复用 `customSkillDirs` 里那段 `!!js` 表达式（它依赖 `baseUrl` 与 `process.getBuiltinModule`）。
4. 本机已装的技能类插件（`dsh-skills-manager` 等）是否也注册了 `skill` 工具；共存时的遮蔽顺序。
5. Client 侧访问自建 Remote 命名空间的注册方式。

---

## 9. 下一步

**E1c**：把原型改成"声明一个自己的预设"，用户开新会话选中它，验证 `visible:true` 与目录发布。

这是唯一还没被打勾的门禁项，也是决定要不要按 §4 铺开的那一步。原型改动很小：`cordis.patch.yml` 加一段 `@deepseek-ai/dsh-agent-preset` 声明即可。