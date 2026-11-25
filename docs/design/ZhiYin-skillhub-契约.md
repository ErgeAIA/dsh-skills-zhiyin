---
title: skillhub.cn 上游接口契约（B0 侦察结果）
type: contract-investigation
project: dsh-skills-zhiyin
updated: 2026-11-25
status: 已实测并已接入（0.1.9 分支）
evidence: 全部结论均为 2026-11-25 实跑，附实测值
---

# skillhub.cn 上游接口契约

> 决定「能不能接、怎么接」的是上游接口本身，不是参考插件的实现。
> 本文每条结论都来自实测请求，不是推测。

## 1. 一句话结论

skillhub.cn **可接**，而且比 skills.sh 更可控：有逐文件 sha256 清单、平台签名（content_hash + package_md5）、腾讯双引擎安全报告。**安装 = 按清单逐文件下载 + 逐个校验**，不需要 bash、不需要 CLI、不需要登录。

## 2. 基础事实

| 项 | 实测值 |
| --- | --- |
| API host | `https://api.skillhub.cn` |
| 站点 | `https://skillhub.cn`（腾讯云托管 SPA，HTML 无数据，靠 JS 渲染） |
| 前端 bundle | `https://cloudcache.tencent-cloud.com/qcloud/tea/app/skillhub/assets/skill-hub.*.js`（3.6MB，接口线索来源） |
| 目录总量 | **239,189** 条技能 |
| 单页上限 | **pageSize ≤ 100**（101+ 返回 400「参数错误：pageSize 超出范围（1~100）」） |
| 搜索参数名 | **`keyword`**（不是 `q` / `search` / `query` / `name`——实测这几个都返回全量 total） |
| 鉴权 | 读接口**无需登录**；写/发布类 `/api/v1/auth/*`、POST `/api/skills` 返回 401 |

## 3. 接口清单（实测）

### 3.1 列表 / 搜索

```
GET /api/skills?page=1&pageSize=100&keyword=<词>&category=<分类>&sort=<排序>
```

- 返回：`{ code: 0, data: { skills: [...], total: N } }`
- `keyword` 生效示例：`keyword=seedance` → total 974（不传则 239,189）
- `category` 生效示例：`category=content-creation` → total 21,749
- **排序参数名是 `sortBy`，不是 `sort`**：`sortBy=downloads` 返回真实高下载条目（首条 12,281,034 次）；写成 `sort` 会被**静默忽略**，返回默认序（首屏全是 `downloads=0` 的条目）——这个坑会让「热门」看起来像坏的
- `sort` / `orderBy` / `sort=hot` / `sort=popular` / `sort=installs` / `sort=score` **全部无效**（静默返回默认序）
- **注意**：`q`/`search`/`query`/`name` 都是无效参数，静默返回全量——用错会以为搜索坏了

### 3.2 详情

```
GET /api/v1/skills/{slug}
```

返回键：`contentZhAvailable, latestVersion, namespace, owner, securityReports, skill, slug`

`skill` 内含：`displayName, summary, summary_zh, category, subCategories, stats{downloads,installs,stars,versions,comments}, labels{requires_api_key}, isServiceized, claim_state, verified, iconUrl, updatedAt, version`

### 3.3 版本列表（含逐版本安全报告）

```
GET /api/v1/skills/{slug}/versions
```

每个版本含 `changelog, createdAt, version, versionId, securityReports{keen,sanbu}`。
安全报告实测值为 `status: "benign"` / `statusText: "安全，无风险"`，附可点开的报告 URL。

### 3.4 文件清单（安装的关键）

```
GET /api/v1/skills/{slug}/files
```

```json
{ "count": 5, "version": "2.1.7",
  "files": [ { "path": "SKILL.md", "sha256": "96d0ca1d…", "size": 23564 }, … ] }
```

### 3.5 逐文件内容

```
GET /api/v1/skills/{slug}/file?path=<相对路径>
```

返回纯文本/二进制内容。**实测 5/5 文件的 sha256 与清单完全一致。**

### 3.6 平台签名（可选增强）

```
GET /api/v1/open/skills/{slug}/versions/{version}/signature
```

返回 `content_hash, hash_version, key_id, payload, signature, signed, signed_at`；
payload 内含 `package_md5, file_count, publisher_id, publisher_real_name_verified, issuer: "skillhub.cn"`。

## 4. 不通的路（已排除，避免重复踩）

| 尝试 | 结果 |
| --- | --- |
| `GET /api/skills/{slug}`（无 v1） | 405 |
| `GET /api/v1/skills`（无 slug，带 keyword） | 405（列表只在 `/api/skills`） |
| `…/{slug}/download` / `/package` / `/zip` / `/content` | 全部 405 |
| `…/{slug}.zip` | 405；`skillhub.cn/skills/{slug}.zip` 返回 200 但是 HTML 404 页 |
| 打包 zip 下载 | **不存在公开端点**——只能逐文件取 |
| `POST /api/skills` | 401（需登录） |

## 5. 对实现的直接含义

1. **安装 = 逐文件下载 + 校验**：先 `/files` 拿清单，再对每个 path 取内容并比对 sha256；任一不符即中止，不落盘。这比解压 zip 更安全（可精确指出哪个文件坏了）。
2. **不需要 bash / CLI / 登录**：官方 `install.sh` 是 macOS/Linux 的 bash 脚本，Windows 桌面不可用；走 HTTP 逐文件才是跨平台正解。
3. **能力标志可直接映射**：
   - `labels.requires_api_key === "true"` → 需要 Key（提示，不阻塞安装）
   - `labels.pricing_type === "paid"` → 付费
   - `isServiceized === true` → 服务化
   - `source`：`community` / `clawhub` / `enterprise`
4. **安全信息可展示**：`securityReports.keen/sanbu` 的 `statusText` 可直接作为卡片徽标（"安全，无风险"），点开 reportUrl 看详情。这是 skills.sh 没有的差异化能力。
5. **分页必须 ≤100**，且总量 23.9 万——UI 不能做「全部加载」，只能搜索/分类/分页。

## 6. 与 skills.sh 的口径差异（实现要归一化）

| 维度 | skills.sh（现有） | skillhub.cn（新增） |
| --- | --- | --- |
| 搜索参数 | `q` | `keyword` |
| 单页上限 | 200 | 100 |
| 内容获取 | 无（只有 GitHub 仓库） | 逐文件 API + sha256 |
| 安装方式 | `npx skills add <repo>` 或 GitHub | 逐文件下载 + 校验 |
| 安全报告 | 无 | 腾讯 keen + sanbu |
| 排序指标 | `installs` | `downloads` / `installs` / `stars` / `score`（四套口径） |
| 托管技能 | 不可直装 | **可装**（有文件清单） |

## 7. 已落地的实现（0.1.9 分支）

| 位置 | 内容 |
| --- | --- |
| `index.js` | `skillhubSearch / skillhubDetail / skillhubFiles / skillhubFile / skillhubCard / skillhubCapabilities / installSkillhubSkill` |
| 路由 | `GET /zhiyin/skillhub/{search,detail,files,file}`、`POST /zhiyin/skillhub/install`，全部过 `refuseUnadmitted` 准入 |
| `client.js` | 新增 `SkillHub` Tab（原「技能市场」更名 `SKILLS.SH`），独立搜索/分页/安装状态，中英词条各 14 条 |
| 安装 | 按清单逐文件下载 → 逐个比 sha256 → 全通过才原子落盘；路径穿越防护；任一不符即中止 |

**实测证据**（2026-11-25，隔离 `USERPROFILE`/`HOME`/`DSH_HOME`/`DSH_AGENTS_HOME`）：
- 搜索 `keyword=seedance` → total 974；空关键词 → total 239,241，首条下载 12.28M
- 详情 → 版本 2.1.7、腾讯 keen/sanbu 双引擎 `benign`
- 文件清单 5 个，逐文件 sha256 **5/5 全部匹配**
- 安装 → 5 文件落盘、`SKILL.md` 23,564 字节、软链建在隔离 `.dsh/skills`
- 真实 `~/.dsh/skills` 前后均为 96 条（未受影响）
- 无 cookie 请求 → 401（准入闸门生效）

## 8. 实施中踩到的坑

1. **slug 不唯一**：同一 slug 会以不同命名空间各存一条（`video-generation`、`seedance-prompt-expert` 在搜索结果里各出现两次）。直接当 React key 会撞车，导致列表渲染错乱。已改为 `slug@namespace`。
2. **测试隔离不全导致泄漏**：见 BUG-018——`dshSkillsRoot()` 用 `homedir()`，只设 `DSH_HOME` 不够，必须同时改 `USERPROFILE`/`HOME`。
3. **工具条条件漏排除**：技能列表的搜索框一度渲染到 SkillHub 页，因为 `tab !== 'market'` 没带上 `'skillhub'`。

## 9. 未验证 / 风险

- **未验证**：`/file?path=` 对二进制（图片、字体）是否原样返回（本次样本全是文本）。
- **未验证**：大技能（数百文件）逐文件下载的耗时；需要并发与进度反馈。
- **未验证**：ToS 是否允许第三方客户端读取 `/api/v1`。**上线前必须确认**，这是合规红线。
- **风险**：接口无版本承诺，`/api/v1` 可能变；需要超时/缓存/降级，且失败不影响 skills.sh 那条路。
