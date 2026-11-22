---
title: 织音接入左侧「插件」入口的可行性调研
type: design-investigation
project: dsh-skills-zhiyin
updated: 2026-11-22
evidence: DSH 0.2.x app.asar 内 @deepseek-ai/dsh-client-ui-plugin-manager/lib/client.js 与 dshmarket@1.75.0 client/client.js（本地实测读取）
status: 已调研，未实施
---

# 织音接入左侧「插件」入口 —— 可行性调研

## 1. 结论先说

**可行，且不改渲染逻辑**。DSH 客户端暴露两个插槽，任意插件都能自己加一个左侧入口 + 一个整页：

| 插槽 | 作用 | 我们的现状 |
| ---- | ---- | ---- |
| `settings.section` + `settings.section.icon` | 设置弹窗左侧的一节 | 已用（织音就在设置里） |
| `sidebar.panellist` | 应用左侧竖栏的一行 | **未用** |
| `main` | 一个整页面板（key 即页面 id） | **未用** |

「插件」页自己就是这套：`PANEL_ID = 'plugins'`，同时注册 `main`（key: plugins）与 `sidebar.panellist`（id: plugins, order: 0）。左侧那行点下去，实际上是把 `layout` 的当前面板切到 `plugins`。

## 2. 官方注册契约（实测摘录）

「插件」页的注册（@deepseek-ai/dsh-client-ui-plugin-manager/lib/client.js）：

```js
// 整页
ctx.slots.inject('main', function* () {
  yield ctx.slots.register(
    { name: 'main', key: PANEL_ID, locale: NS, store, inject: () => ({ ...face }) },
    PluginManagerPage,
  )
})

// 左侧竖栏那一行
ctx.slots.inject('sidebar.panellist', () =>
  ctx.slots.register(
    { name: 'sidebar.panellist', id: PANEL_ID, order: 0, label: () => t('panel'), locale: NS },
    PluginsPanelIcon,
  ),
)
```

dsh-market（社区插件）另外示范了两点我们以后会用到的能力：

- **打开指定页面**：`ctx.layout.selectPanel(PANEL_ID)`；
- **读当前面板**：`ctx.layout.panelInfo.getSnapshot().activePanelId`；
- **可开关的入口**：用 `createSectionGate(register)` 包一层，按用户选择动态注册/注销那一行——
  它自己注释写明「sidebar 行默认隐藏，是用户主动打开的 opt-in；设置页入口默认显示」。

## 3. 落到织音要做的事

1. `package.json` 的 `dsh.client` 不需要改（如实测：插槽由运行时提供，与是否声明无关）。
2. `client.js` 的插件 `inject` 增加 `'layout'`（可选，仅当需要「点通知跳到某页」或切页时用）。
3. 新增两处注册，与现有 `settings.section` 并存或替换：

   ```js
   // ① 整页：复用现有 Page 组件
   ctx.slots.inject('main', () =>
     ctx.slots.register({ name: 'main', key: 'zhiyin', locale: NS }, Page),
   )
   // ② 左侧竖栏一行：复用现有 NavIcon
   ctx.slots.inject('sidebar.panellist', () =>
     ctx.slots.register(
       { name: 'sidebar.panellist', id: 'zhiyin', order: 10, label: () => ctx.locale.bind(NS)('nav'), locale: NS },
       NavIcon,
     ),
   )
   ```

4. **Page 组件已就绪**：现在签名是 `Page({ close, t })`，实测全文没有一处 `onClick: close`，
   即 `close` 只是设置弹窗给的、我们并未使用 —— 换到整页容器直接可用，不需要改页面代码。
   整页里 `t` 需要自己从 `ctx.locale.bind(NS)` 传，或改用组件内的 `inject`。

## 4. 三个需要你决策的取舍

| 方案 | 做法 | 好处 | 代价 |
| ---- | ---- | ---- | ---- |
| A. 只加左侧入口，保留设置页 | 两处注册并存 | 两种习惯都能用 | 两个入口语义重复，用户要猜哪个是「正门」 |
| B. 迁到左侧入口，设置里删掉 | 只注册 main + panellist | 单一入口，符合「插件」的形态 | 设置弹窗里再也找不到织音，老用户会以为被卸载 |
| C. 双入口 + 门规则 | 两处注册，记录「哪扇门还在」 | 兼顾两类用户，可退出任一侧 | 要维护「最后一扇门不能关」的逻辑（dsh-market 有现成案例可抄） |

**建议**：先做 A（改动最小、可回退），观察一段时间再决定是否收敛成 C。

## 4.1 官方文档与一手代码的补充确认

官方 `dsh/docs/subsystems/slots.zh.md` 写：

> root 作用域的 list `sidebar.panellist.actions`……root 作用域的 `sidebar.panel.icon` factory **拥有 `sidebar.panellist` list**，按 `id`、`size` 与 `active` 为侧栏行和更多菜单入口渲染已注册图标。

实测「插件」页的做法**没有**用 `sidebar.panel.icon`，而是把图标组件直接作为 `sidebar.panellist` 的组件传入：

```js
ctx.slots.inject('sidebar.panellist', () =>
  ctx.slots.register(
    { name: 'sidebar.panellist', id: PANEL_ID, order: 0, label: () => t('panel'), locale: NS },
    PluginsPanelIcon,   // 组件收到 owner props：{ size, active }
  ),
)
```

整页则用**生成器**形式注册（`yield` 出让 disposer）：

```js
ctx.slots.inject('main', function* () {
  yield ctx.slots.register(
    { name: 'main', key: PANEL_ID, locale: NS, store, inject: () => ({ ...face }), children: {...} },
    PluginManagerPage,
  )
})
```

对我们的意义：`children` / `store` 都可省略；`NavIcon` 目前忽略 props，接进来后应至少用上 `size`（侧栏行与「更多」菜单会传不同尺寸）与 `active`（当前选中态）。

## 5. 未核实项

- 整页容器给了 Page 哪些 props（是否包含 `close` 之外的上下文）；本次只读到 key/locale/inject/store/children 的声明，未逐一验证运行时注入值。
- `sidebar.panellist` 的 `order` 全量排序（仅确认「插件」为 0、dsh-market 为 1）。
- 左侧竖栏在窄窗口折叠时的表现（dsh-market 注释提到「宿主可能挂载多个响应式侧栏」，我们未复现）。

## 6. 顺带发现的发布相关事实

- `dshmarket` 在 npm 上以 **`dshmarket@1.75.0`** 公开分发，`package.json` 带 `dsh.bundle.patch` 与 `dsh.client.{inject,platform}` 字段。
- DSH 自带的插件探测服务 `PluginRegistryProbe` 会并发 ping `https://registry.npmjs.org/-/ping` 与 `https://registry.npmmirror.com/-/ping` 择优 —— 说明**官方插件安装走 npm registry**。
- dsh-market 的 `package.json` 脚本里出现 `snapshot`（拉 `https://awesome-dsh-plugin.com/plugins.json`）与 `validate:registry` —— 该站点是社区插件索引（是否官方未核实）。
