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
  disabled: {},
  packs: [],
  known: {},
}

let cache = null
/** agentSessionId -> { skills, dispose, invalidate } */
const providers = new Map()
const registrations = new Set()

export function apply(ctx) {
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: '/zhiyin/state',
      resource: async () => json(await collectState(ctx)),
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
    saveState(state)
    invalidateAll()
    return { status: 200, body: { ok: true, agentsRoot: state.agentsRoot } }
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
    registerFor(agent)
  }
  for (const [key, entry] of providers) {
    if (live.has(key)) continue
    try {
      entry.dispose?.()
    } catch {
      /* 已随作用域释放 */
    }
    providers.delete(key)
    registrations.delete(entry)
  }
  return agents.length
}

function registerFor(agent) {
  const key = agentKey(agent)
  if (providers.has(key)) return
  let skills
  try {
    skills = agent?.ctx?.get?.('skills')
  } catch {
    skills = undefined
  }
  if (!skills || typeof skills.registerProvider !== 'function') return
  const entry = { skills, dispose: null, invalidate: null }
  try {
    entry.dispose = skills.registerProvider((control) => {
      entry.invalidate = () => {
        try {
          control.invalidate()
        } catch {
          /* 注册已释放 */
        }
      }
      return {
        name: PROVIDER_NAME,
        list: async () => shadowCandidates(),
        get: async () => undefined,
      }
    })
    providers.set(key, entry)
    registrations.add(entry)
    note('provider-registered', { agents: registrations.size })
  } catch (error) {
    note('provider-register-failed', { error: String(error?.message ?? error) })
  }
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
  const state = readState()
  for (const entry of registrations) {
    if (typeof entry.invalidate === 'function') {
      try {
        entry.invalidate()
      } catch {
        /* 单个注册失效不影响其它 */
      }
    }
  }
  void state
}

/* ------------------------------------------------------------- collection */

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

  for (const agent of ctx.agents.list()) {
    try {
      const cwd = ctx.workingDirectory.get(agent.session)
      // 不带 scope：只读全局层，拿到的是原生文件系统 provider 的结果，
      // 不会被我们自己注册的影子候选遮蔽。
      const snapshot = await ctx.skills.snapshot({ cwd })
      scopes += 1
      complete = complete && snapshot.complete
      for (const skill of snapshot.skills) noteSkill(skill)
    } catch (error) {
      complete = false
      failures.push(String(error?.message ?? error))
    }
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
      const reason = hiddenReason(readState(), skill.name, skill.source)
      return {
        name: skill.name,
        description: skill.description,
        whenToUse: skill.whenToUse ?? null,
        model: skill.invocation.modelInvocable && reason === null,
        user: skill.invocation.userInvocable && reason === null,
        source: skill.source,
        provider: skill.provider,
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
    failures,
    budgetChars: BUDGET_CHARS,
    descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
    catalogChars,
    skills,
    agentsRoot: current.agentsRoot !== false,
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
