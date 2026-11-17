# 织音 M0 原型（可卸载）

一次性实验装置，不是产品。它只回答一个问题：**在预设组合里替换掉 DSH 自带的技能消费者之后，接管是否真的成立。**

## 为什么是「预设」而不是「全局」

实测已经排除两条路（细节见 `../docs/adr/ZhiYin-M0-ADR.md` §1）：

- 全局注册同名 `skill` 工具：注册成功，但 `ctx.tools.get('skill', agent)` 仍解析到预设里那条更近的消费者 → `visible: false`。
- 关掉 `dsh-base` 的全局 `tool-skill` 行：关掉的是另一条，预设里那条照样生效。

Web profile 的技能消费者是**预设级**装配的（`dsh-web-app/presets/standard.patch.yml` 的 `plugins` 里挂着 `tool-skill`）。所以原型改成：**新增一个我们自己的预设**，在其清单里把 `tool-skill` 换成我们的消费者。

## 它做了什么

`cordis.patch.yml` 声明一个预设 `zhiyin-proto`（显示名「织音原型」），清单是标准预设的精简版，唯一的差异是最后一行：

```yaml
- id: zhiyin-consumer
  name: '@local/dsh-zhiyin-proto'
```

该插件注册同名 `skill` 工具、在 pre-step 发布/退役技能目录、处理 `/name` 手势。它**不碰任何现有预设的清单**。

## 怎么试（E1c）

1. 新开一个会话；
2. 在预设选择器里选**「织音原型」**；
3. 随便问一句，让它跑完一个模型步骤；
4. 看 `%DSH_HOME%\profiles\desktop\zhiyin-proto\events.ndjson`：

| 判据 | 期望 |
|---|---|
| `register` 事件 | `globalHoldsOurs: true` |
| `pre-step` 事件 | **`visible: true`**（这一步是 E1c 的核心） |
| `publish` 事件 | `action: initial`，`entries > 0` |
| 连续多步 | 只有一条目录，不再重复追加 |

## 回滚

- 方式一：**Plugins** → 移除 `@local/dsh-zhiyin-proto`（预设随之消失）；
- 方式二：新会话里换回原预设即可，无需卸载；
- 方式三：`plugin_manager` `action: remove_bundle`。

> 本原型不写任何技能文件，不改 profile 的 `cordis.patch.yml`，卸载即恢复。

## 已知不做的

- 不持久化意图、不读包/组合（`ALLOWLIST` 是代码常量，空数组＝不筛选）；
- 不做预算阻断、冲突检测；
- 不接管 GUI 斜杠菜单（它读注册表，属已知漂移）；
- 不复制 `standard` 预设里 `skill-filesystem` 的 `customSkillDirs` 表达式，所以内置技能目录在这个预设里可能少一批——这不影响 E1c 的判定。