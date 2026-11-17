/**
 * 织音 · 宿主半边
 *
 * 负责三件事：
 *   1. 把「技能此刻是否对模型/用户可见」算出来，供设置页展示；
 *   2. 对每个在跑的 Agent，在它**最近的层**注册一个策略 provider：
 *      只列「被停用」的同名候选，并把 modelInvocable/userInvocable 全关；
 *      启用项不列 —— 自然落回原生 provider（零正文复制、不动文件、不换预设）。
 *   3. 用同源 HTTP 路由接收设置页的开关动作。
 *
 * 为什么不走 Remote：Typert 的客户端装配是构建期固定清单、生成器不随
 * 发行版发布，第三方插件无法新增 Remote 命名空间。同源 HTTP 是唯一开放通路。
 */
import { appendFileSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

import { stateDir } from './paths.js'

export const name = 'zhiyin-host'
export const inject = ['webServer', 'skills', 'agents', 'workingDirectory']

/** 目录字符预算（PRD §6.8 默认值）。 */
const BUDGET_CHARS = 8000
const DESCRIPTION_MAX_LENGTH = 500
const PROVIDER_NAME = 'zhiyin'

const EMPTY_STATE = {
  v: 1,
  agentsRoot: true,
  allOff: false,
  disabled: {},
  packs: [],
  known: {},
}

let cache = null
/** agentSessionId -> { skills, dispose, invalidate } */
const providers = new Map()
const registrations = new Set()
/** 已经因为“同名 provider 已存在”而放弃重试的作用域 key */
const duplicates = new Set()

export function apply(ctx) {
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: '/zhiyin/state',
      resource: async () => json(await collectState(ctx)),
    }),
  )

  // 诊断：把「模型面」和「用户面（/ 菜单）」两条读取路径的真实结果摊开，
  // 用来判断我们的策略 provider 到底挂在哪个注册表实例、哪一层。
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: '/zhiyin/probe',
      resource: async () => json(await uiProbe(ctx)),
    }),
  )

  post(ctx, '/zhiyin/skill', async (body) => {
    const state = readState()
    const skillName = typeof body?.name === 'string' ? body.name.trim() : ''
    if (!skillName) return { status: 400, body: { ok: false, error: 'name is required' } }
    if (body.description && !state.known[skillName]) {
      state.known[skillName] = {
        description: String(body.description).slice(0, 400),
        source: typeof body.source === 'string' ? body.source : 'custom',
      }
    }
    if (body.enabled === true) delete state.disabled[skillName]
    else state.disabled[skillName] = { at: new Date().toISOString() }
    saveState(state)
    invalidateAll()
    return { status: 200, body: { ok: true, disabled: Object.keys(state.disabled).length } }
  })

  post(ctx, '/zhiyin/settings', async (body) => {
    const state = readState()
    if (typeof body?.agentsRoot === 'boolean') state.agentsRoot = body.agentsRoot
    if (typeof body?.allOff === 'boolean') state.allOff = body.allOff
    saveState(state)
    invalidateAll()
    return { status: 200, body: { ok: true, agentsRoot: state.agentsRoot, allOff: state.allOff === true } }
  })

  // 新出现的 Agent 及时挂上策略 provider（轮询足够便宜，且不依赖内部事件名）。
  const timer = setInterval(() => {
    try {
      ensureProviders(ctx)
    } catch (error) {
      note('provider-loop-failed', { error: String(error?.message ?? error) })
    }
  }, 2000)
  if (typeof timer?.unref === 'function') timer.unref()
  ctx.effect(() => () => clearInterval(timer))
}

function post(ctx, path, run) {
  try {
    ctx.effect(() =>
      ctx.webServer.register({
        kind: 'exact',
        path,
        handler: async (request, response) => {
          if (request.method !== 'POST') {
            response.writeHead(405, { 'content-type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify({ ok: false, error: 'method not allowed' }))
            return
          }
          const origin = request.headers?.origin
          if (typeof origin === 'string' && origin.length > 0) {
            try {
              if (new URL(origin).host !== request.headers.host) {
                response.writeHead(403, { 'content-type': 'application/json; charset=utf-8' })
                response.end(JSON.stringify({ ok: false, error: 'cross-origin write rejected' }))
                return
              }
            } catch {
              /* 非法 Origin 直接放行给鉴权以外的逻辑处理 */
            }
          }
          let raw = ''
          try {
            raw = await readBody(request)
          } catch {
            raw = ''
          }
          let body = {}
          try {
            body = raw.length > 0 ? JSON.parse(raw) : {}
          } catch {
            body = {}
          }
          const result = await run(body)
          response.writeHead(result.status, { 'content-type': 'application/json; charset=utf-8' })
          response.end(JSON.stringify(result.body))
        },
      }),
    )
  } catch (error) {
    note('route-register-failed', { path, error: String(error?.message ?? error) })
  }
}

function readBody(request, limit = 65536) {
  return new Promise((resolve, reject) => {
    let data = ''
    request.setEncoding?.('utf8')
    request.on('data', (chunk) => {
      data += chunk
      if (data.length > limit) {
        reject(new Error('body too large'))
        request.destroy?.()
      }
    })
    request.on('end', () => resolve(data))
    request.on('error', reject)
  })
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

/* ------------------------------------------------------------------ state */

function configFile() {
  return join(stateDir(), 'state.json')
}

function readState() {
  if (cache) return cache
  try {
    const parsed = JSON.parse(readFileSync(configFile(), 'utf8'))
    cache = { ...EMPTY_STATE, ...parsed, disabled: parsed?.disabled ?? {}, known: parsed?.known ?? {} }
  } catch {
    cache = { ...EMPTY_STATE }
  }
  return cache
}

function saveState(state) {
  cache = state
  try {
    mkdirSync(stateDir(), { recursive: true })
    const tmp = configFile() + '.tmp'
    writeFileSync(tmp, JSON.stringify(state, null, 2))
    renameSync(tmp, configFile())
  } catch (error) {
    note('state-save-failed', { error: String(error?.message ?? error) })
  }
}

function note(event, detail) {
  try {
    mkdirSync(stateDir(), { recursive: true })
    appendFileSync(
      join(stateDir(), 'events.ndjson'),
      JSON.stringify({ at: new Date().toISOString(), event, ...detail }) + '\n',
    )
  } catch {
    /* 诊断写不进去不影响功能 */
  }
}

/** 这个技能此刻是否应当被隐藏，以及原因。 */
function hiddenReason(state, skillName, source) {
  // 一键全部关掉：优先级最高，压过技能包与单个开关。
  if (state.allOff === true) return 'all-off'
  if (state.agentsRoot === false && source === 'user-agents') return 'agents-root'
  const packs = (state.packs ?? []).filter(
    (pack) => Array.isArray(pack?.members) && pack.members.includes(skillName),
  )
  if (packs.length > 0) {
    if (!packs.some((pack) => pack.enabled !== false)) return 'pack'
  } else if (state.disabled?.[skillName]) {
    return 'manual'
  }
  return null
}

/* -------------------------------------------------------------- providers */

function agentKey(agent) {
  const session = agent?.session
  return String(session?.id ?? session?.sessionId ?? session ?? 'unknown')
}

function ensureProviders(ctx) {
  const agents = typeof ctx.agents?.list === 'function' ? ctx.agents.list() : []
  const live = new Set()
  for (const agent of agents) {
    live.add(agentKey(agent))
    registerFor(ctx, agent)
  }
  for (const [key, entry] of providers) {
    if (live.has(key)) continue
    for (const dispose of entry.disposers ?? []) {
      try {
        dispose()
      } catch {
        /* 已随作用域释放 */
      }
    }
    providers.delete(key)
    registrations.delete(entry)
  }
  return agents.length
}

/**
 * 挂策略 provider。
 *
 * 同一个 Agent 可能对应不止一个技能注册表实例（Agent 自己那一层，加上预设装配
 * 出来的那一份；冷会话还会读宿主层那份），而「哪个实例在读」决定了停用能不能
 * 生效。所以每个能拿到的实例都挂一份，名字、语义完全一样（按技能名停用），
 * 不复制正文、不改技能文件。
 */
function registerFor(ctx, agent) {
  const key = agentKey(agent)
  if (providers.has(key)) return
  const services = registryInstances(ctx, agent)
  if (services.length === 0) return
  const entry = { agent, services: [], disposers: [], invalidates: [], force: null }
  let registered = 0
  let duplicates2 = 0
  for (const service of services) {
    try {
      const dispose = service.registerProvider((control) => {
        entry.invalidates.push(() => {
          try {
            control.invalidate()
          } catch {
            /* 注册已释放 */
          }
        })
        return {
          name: PROVIDER_NAME,
          list: async () => shadowCandidates(),
          get: async () => undefined,
        }
      })
      entry.services.push(service)
      if (typeof dispose === 'function') entry.disposers.push(dispose)
      registered += 1
    } catch (error) {
      const message = String(error?.message ?? error)
      if (message.includes('is already registered')) {
        // 热重载后残留的同名 provider：那个实例已经有织音在管，视作已生效，
        // 不再每 2 秒重试一次（并把这条诊断压到一条）。
        duplicates2 += 1
      } else {
        note('provider-register-failed', { error: message })
      }
    }
  }
  if (registered === 0 && duplicates2 === 0) return
  entry.force = () => forceInvalidate(ctx, agent)
  providers.set(key, entry)
  registrations.add(entry)
  if (registered === 0 && !duplicates.has(key)) {
    duplicates.add(key)
    note('provider-already-registered', { key })
    return
  }
  note('provider-registered', { agents: registrations.size, layers: registered, duplicates: duplicates2 })
}

/**
 * 兜底失效：注册是热重载残留的（拿不到 control.invalidate），用一次
 * 即注册即撤销的 runtime 技能推动 registry 换 revision，让消费者重算目录。
 */
function forceInvalidate(ctx, agent) {
  for (const skills of registryInstances(ctx, agent)) {
    if (typeof skills.register !== 'function') continue
    try {
      const undo = skills.register({
        name: 'zhiyin-invalidate-probe',
        description: 'internal',
        invocation: { modelInvocable: false, userInvocable: false },
      })
      if (typeof undo === 'function') undo()
    } catch {
      /* 推不动就算了，目录最迟在下次 revision 变化时刷新 */
    }
  }
}

function skillsOf(agent) {
  try {
    return agent?.ctx?.get?.('skills')
  } catch {
    return undefined
  }
}

function safeGetService(ctx, name) {
  try {
    const service = ctx?.get?.(name)
    return service ?? undefined
  } catch {
    return undefined
  }
}

/**
 * 一个 Agent 可能被不止一个技能注册表实例看到：
 *   1. Agent 自己 ctx 上的那一份；
 *   2. 预设装配出来的那一份（`agentPresets.serviceFor(agent, 'skills')`）——
 *      / 菜单走的就是它（见 dsh-api-session-controller 的 SessionSkillCatalog.list：
 *      `scoped ?? this.ctx.get('skills')`）；
 *   3. 宿主层那一份，冷会话（还没有 live agent）读的是它。
 * 停用要在「谁在读」的那个实例里生效，所以三个都挂。
 */
function registryInstances(ctx, agent) {
  const out = []
  const push = (service) => {
    if (service && typeof service.registerProvider === 'function' && !out.includes(service)) out.push(service)
  }
  push(skillsOf(agent))
  try {
    const presets = safeGetService(ctx, 'agentPresets')
    if (presets && typeof presets.serviceFor === 'function') push(presets.serviceFor(agent, 'skills'))
  } catch {
    /* 预设服务不可用就只挂能拿到的那些 */
  }
  push(safeGetService(ctx, 'skills'))
  return out
}

function describeRegistry(service) {
  if (!service) return { present: false }
  try {
    return { present: true, layers: layerReport(service) }
  } catch {
    return { present: true, layers: [] }
  }
}

/** 摊开两条读取路径的真实结果：模型面（skills.list，scope=agent）与用户面（sessionSkillCatalog.list）。 */
async function uiProbe(ctx) {
  const agents = typeof ctx.agents?.list === 'function' ? ctx.agents.list() : []
  const presets = safeGetService(ctx, 'agentPresets')
  const hostSkills = safeGetService(ctx, 'skills')
  const catalog = safeGetService(ctx, 'sessionSkillCatalog')
  const out = { at: new Date().toISOString(), agents: [], catalog: [] }
  for (const agent of agents) {
    const sessionId = agentKey(agent)
    const agentSkills = skillsOf(agent)
    const presetSkills = (() => {
      try {
        return presets && typeof presets.serviceFor === 'function' ? presets.serviceFor(agent, 'skills') : undefined
      } catch {
        return undefined
      }
    })()
    let sameHandle = null
    try {
      const handle = ctx.agents?.get?.(sessionId)
      sameHandle = handle === agent
    } catch {
      sameHandle = null
    }
    out.agents.push({
      sessionId,
      sameHandle,
      registries: {
        agent: describeRegistry(agentSkills),
        preset: describeRegistry(presetSkills),
        host: describeRegistry(hostSkills),
        presetIsAgent: presetSkills === agentSkills,
      },
    })
  }
  if (catalog && typeof catalog.list === 'function') {
    for (const agent of agents) {
      const sessionId = agentKey(agent)
      try {
        const value = await catalog.list({ sessionId }, new AbortController().signal)
        const items = Array.isArray(value) ? value : (value?.skills ?? value?.items ?? [])
        const names = items.map((item) => item?.name).filter((name) => typeof name === 'string')
        const state = readState()
        const disabledVisible = names.filter((name) => hiddenReason(state, name, state.known?.[name]?.source) !== null)
        out.catalog.push({ sessionId, count: names.length, disabledVisible: disabledVisible.slice(0, 20) })
      } catch (error) {
        out.catalog.push({ sessionId, error: String(error?.message ?? error) })
      }
    }
  }
  return out
}

/**
 * 技能的逻辑位置与真实位置。
 *
 * ~/.dsh/skills 里的条目多数是指向 ~/.agents/skills 的符号链接，DSH 会把路径解析成
 * 真实路径展示 —— 于是用户看到「满屏都是 .agents/skills」，误以为开关没生效。
 * 这里同时给出逻辑根（用户安装到哪一层）和链接目标，页面据此区分。
 */
function locationOf(source, skillName, realPath) {
  const home = homedir()
  const roots = {
    'user-dsh': join(home, '.dsh', 'skills'),
    'user-agents': join(home, '.agents', 'skills'),
  }
  const root = roots[source]
  if (!root) return { root: null, logicalPath: realPath ?? null, linkTarget: null }
  const logicalPath = join(root, skillName, 'SKILL.md')
  const linked = typeof realPath === 'string' && realPath.length > 0 && realPath !== logicalPath
  return { root, logicalPath, linkTarget: linked ? realPath : null }
}

function shadowCandidates() {
  const state = readState()
  const out = []
  for (const [skillName, meta] of Object.entries(state.known ?? {})) {
    const reason = hiddenReason(state, skillName, meta?.source)
    if (!reason) continue
    const description =
      typeof meta?.description === 'string' && meta.description.trim().length > 0
        ? meta.description
        : '（已停用）'
    out.push({
      name: skillName,
      description,
      invocation: { modelInvocable: false, userInvocable: false },
      source: typeof meta?.source === 'string' ? meta.source : 'custom',
      provider: PROVIDER_NAME,
      rank: 0,
      locator: { name: skillName },
      ...(meta?.path ? { path: meta.path } : {}),
    })
  }
  return out
}

export const __test = { hiddenReason, shadowCandidates, agentKey }

function invalidateAll() {
  for (const entry of registrations) {
    try {
      if (Array.isArray(entry.invalidates) && entry.invalidates.length > 0) {
        for (const invalidate of entry.invalidates) invalidate()
      } else if (typeof entry.force === 'function') {
        entry.force()
      }
    } catch {
      /* 单个注册失效不影响其它 */
    }
  }
}

/* ------------------------------------------------------------- collection */

/**
 * 取一个 Agent 角度看得到的技能目录。
 *
 * 读取作用域 = Agent 自己那一层（我们的策略 provider 也注册在那里）。scope key
 * 是模块私有 Symbol 标记的对象：第三方插件自己 import 一份 dsh-scope 拿不到同一个
 * Symbol（scopeOf 会算成 undefined），所以改成从技能注册表自己的层表里反查 key。
 * 层表可能有多个 key（预设层 / Agent 层），全部试一遍，取条目最多的那份。
 */
function scopeKeysFor(skills) {
  const keys = []
  try {
    const scoped = skills?.layers?.scoped
    if (scoped !== undefined && typeof scoped.keys === 'function') {
      for (const key of scoped.keys()) if (!keys.includes(key)) keys.push(key)
    }
  } catch {
    /* 读不到就只剩全局层 */
  }
  return keys
}

/** 诊断用：列出各层里已注册的 provider 名，便于判断 key 反查是否命中。 */
function layerReport(skills) {
  const out = []
  try {
    const scoped = skills?.layers?.scoped
    if (scoped !== undefined && typeof scoped.keys === 'function') {
      for (const key of scoped.keys()) {
        let names = []
        try {
          names = [...scoped.get(key).providers.keys()]
        } catch {
          names = []
        }
        out.push({ scoped: true, names })
      }
    }
  } catch {
    /* 诊断失败不影响主流程 */
  }
  try {
    out.push({ scoped: false, names: [...skills.layers.global.providers.keys()] })
  } catch {
    /* 同上 */
  }
  return out
}

async function viewForAgent(ctx, agent) {
  const cwd = ctx.workingDirectory.get(agent.session)
  const skills = skillsOf(agent)
  const keys = scopeKeysFor(skills)
  const reads = []
  let best = null
  for (const scope of [...keys, undefined]) {
    let snapshot
    try {
      snapshot = await ctx.skills.snapshot(scope === undefined ? { cwd } : { cwd, scope })
    } catch (error) {
      if (scope === undefined) throw error
      continue
    }
    reads.push({ global: scope === undefined, count: snapshot.skills.length })
    if (!best || snapshot.skills.length > best.skills.length) best = snapshot
  }
  return { snapshot: best, scoped: keys.length > 0, layers: layerReport(skills), reads }
}

async function collectState(ctx) {
  ensureProviders(ctx)
  const state = readState()
  const byName = new Map()
  let complete = true
  let scopes = 0
  const failures = []
  const known = {}

  const noteSkill = (skill) => {
    if (!byName.has(skill.name)) byName.set(skill.name, skill)
    if (!known[skill.name]) {
      known[skill.name] = {
        description: skill.description,
        source: skill.source,
        ...(skill.path ? { path: skill.path } : {}),
      }
    }
  }

  let scopedScopes = 0
  const scopeDebug = []
  for (const agent of ctx.agents.list()) {
    try {
      const view = await viewForAgent(ctx, agent)
      scopes += 1
      scopeDebug.push({ agent: agentKey(agent), scoped: view.scoped, reads: view.reads, layers: view.layers })
      if (view.scoped) scopedScopes += 1
      complete = complete && view.snapshot.complete
      for (const skill of view.snapshot.skills) noteSkill(skill)
    } catch (error) {
      complete = false
      failures.push(String(error?.message ?? error))
    }
  }
  if (scopes > 0 && scopedScopes === 0) {
    failures.push('scope-key-unavailable: 只读到全局层，用户级技能未纳入统计')
  }

  if (scopes === 0) {
    try {
      const snapshot = await ctx.skills.snapshot({})
      complete = snapshot.complete
      for (const skill of snapshot.skills) noteSkill(skill)
    } catch (error) {
      complete = false
      failures.push(String(error?.message ?? error))
    }
  }

  const nextKnown = { ...state.known, ...known }
  if (JSON.stringify(nextKnown) !== JSON.stringify(state.known)) {
    saveState({ ...state, known: nextKnown })
  }

  const skills = [...byName.values()]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((skill) => {
      const meta = readState().known?.[skill.name]
      // 停用中的技能，列表里看到的是我们自己的影子候选 —— 展示信息回填原始元数据，
      // 免得设置页把来源写成 zhiyin、描述写成占位串。
      const shadowed = skill.provider === PROVIDER_NAME
      const source = shadowed ? (meta?.source ?? skill.source) : skill.source
      const reason = hiddenReason(readState(), skill.name, source)
      return {
        name: skill.name,
        description: shadowed && meta?.description ? meta.description : skill.description,
        whenToUse: skill.whenToUse ?? null,
        model: !shadowed && skill.invocation.modelInvocable && reason === null,
        user: !shadowed && skill.invocation.userInvocable && reason === null,
        source,
        provider: skill.provider,
        shadowed,
        ...locationOf(source, skill.name, skill.path),
        path: skill.path ?? null,
        resourceKind: skill.resourceBase?.kind ?? null,
        enabled: reason === null,
        hiddenReason: reason,
      }
    })

  const catalogChars =
    skills
      .filter((skill) => skill.enabled)
      .reduce((total, skill) => total + Math.min(skill.description.length, DESCRIPTION_MAX_LENGTH), 0) +
    200

  const current = readState()
  return {
    at: new Date().toISOString(),
    complete,
    scopes,
    scopedScopes,
    scopeDebug,
    failures,
    budgetChars: BUDGET_CHARS,
    descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
    catalogChars,
    skills,
    agentsRoot: current.agentsRoot !== false,
    allOff: current.allOff === true,
    managedScopes: registrations.size,
    takeover: { visible: registrations.size > 0 },
    counts: {
      total: skills.length,
      model: skills.filter((skill) => skill.model).length,
      user: skills.filter((skill) => skill.user).length,
      both: skills.filter((skill) => skill.model && skill.user).length,
      neither: skills.filter((skill) => !skill.model && !skill.user).length,
      disabled: skills.filter((skill) => !skill.enabled).length,
    },
    packs: current.packs ?? [],
  }
}
