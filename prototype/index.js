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
import { execFileSync } from 'node:child_process'
import { appendFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, readlinkSync, renameSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { basename, join, resolve, sep } from 'node:path'


import { stateDir } from './paths.js'

export const name = 'zhiyin-host'
export const inject = ['webServer', 'skills', 'agents', 'workingDirectory']

/** 目录字符预算（PRD §6.8 默认值）。 */
const BUDGET_CHARS = 8000
const DESCRIPTION_MAX_LENGTH = 500
// 托管来源：必须挂在启用的技能包上才生效；内置/自定义来源不受包约束。
const PACK_GATED_SOURCES = new Set(['user-dsh', 'user-agents'])
/** 技能备注上限：本地笔记，不写技能文件，随导出/导入走。 */
const NOTE_MAX = 500
const PROVIDER_NAME = 'zhiyin'
const PLUGIN_VERSION = (() => {
  try {
    return JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
})()

/** 合奏意图的默认值（PRD §7.4）：compat = 不接管，orchestrated = 由织音投影。 */
const EMPTY_INTENT = {
  schemaVersion: 1,
  mode: 'compat',
  activePackIds: [],
  alwaysOnSkillNames: [],
  excludedSkillNames: [],
  revision: 0,
  updatedAt: null,
}

const EMPTY_STATE = {
  v: 1,
  agentsRoot: false,
  allOff: false,
  disabled: {},
  notes: {},
  packs: [],
  combos: [],
  intent: { ...EMPTY_INTENT },
  known: {},
}

/** 技能包名规则：1–40 字符，允许中日韩、空格、下划线、连字符；重名拒绝。 */
const PACK_NAME_MAX = 40
function packNameValid(name) {
  if (typeof name !== 'string') return false
  const trimmed = name.trim()
  if (trimmed.length < 1 || trimmed.length > PACK_NAME_MAX) return false
  return !/[^\p{L}\p{N} _-]/u.test(trimmed)
}
function packNameTaken(packs, name, exceptId) {
  const needle = name.trim()
  return packs.some((pack) => pack.id !== exceptId && (pack.name ?? '').trim() === needle)
}

/** 组合名规则与技能包一致：1–40 字符；重名拒绝。 */
function comboNameTaken(combos, name, exceptId) {
  const needle = name.trim()
  return combos.some((combo) => combo.id !== exceptId && (combo.name ?? '').trim() === needle)
}

function newId(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

/** 把磁盘上的 intent 补成完整形状；每次返回新对象，避免改到 EMPTY_INTENT。 */
function normalizeIntent(state) {
  const raw = state?.intent && typeof state.intent === 'object' ? state.intent : {}
  const list = (value) =>
    Array.isArray(value)
      ? value.filter((entry) => typeof entry === 'string' && entry.trim()).map((entry) => entry.trim())
      : []
  return {
    schemaVersion: 1,
    mode: raw.mode === 'orchestrated' ? 'orchestrated' : 'compat',
    activePackIds: list(raw.activePackIds),
    alwaysOnSkillNames: list(raw.alwaysOnSkillNames),
    excludedSkillNames: list(raw.excludedSkillNames),
    revision: Number.isInteger(raw.revision) ? raw.revision : 0,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : null,
  }
}

/** 只保留真实存在的包 ID 并去重；组合里被删掉的包会静默退出。 */
function normalizePackIds(state, input) {
  const available = new Set((state.packs ?? []).map((pack) => pack.id))
  const seen = new Set()
  const out = []
  for (const entry of Array.isArray(input) ? input : []) {
    if (typeof entry !== 'string') continue
    const id = entry.trim()
    if (!id || seen.has(id) || !available.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

/** 某个包此刻是否生效：自己的开关 + 合奏模式下的组合约束。 */
function packActive(state, pack, intent) {
  if (!pack || pack.enabled === false) return false
  const plan = intent ?? normalizeIntent(state)
  if (plan.mode === 'orchestrated') return plan.activePackIds.includes(pack.id)
  return true
}

/** 含这个技能的包（含被停用的包，用于区分「包停用」与「未编配」）。 */
function memberPacks(state, skillName) {
  return (state.packs ?? []).filter(
    (pack) => Array.isArray(pack?.members) && pack.members.includes(skillName),
  )
}

/** 规范化包的冲突声明：只保留存在且非自身的包 ID，去重（FR-005）。 */
function normalizeConflicts(state, packId, input) {
  const available = new Set((state.packs ?? []).map((pack) => pack.id))
  const seen = new Set()
  const out = []
  for (const entry of Array.isArray(input) ? input : []) {
    if (typeof entry !== "string") continue
    const id = entry.trim()
    if (!id || id === packId || seen.has(id) || !available.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

/** 当前处于生效状态的包 ID 列表。 */
function activePackIds(state, intent) {
  const plan = intent ?? normalizeIntent(state)
  return (state.packs ?? []).filter((pack) => packActive(state, pack, plan)).map((pack) => pack.id)
}

/** 指定生效集合里两两冲突的包对；冲突是双向语义，任一方声明即成立（FR-005）。 */
function conflictPairsFor(state, activeIds) {
  const active = new Set(activeIds)
  const byId = new Map((state.packs ?? []).map((pack) => [pack.id, pack]))
  const out = []
  const seen = new Set()
  for (const pack of state.packs ?? []) {
    if (!active.has(pack.id)) continue
    for (const otherId of normalizeConflicts(state, pack.id, pack.conflictsWith)) {
      if (!active.has(otherId)) continue
      const key = [pack.id, otherId].sort().join("::")
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ a: { id: pack.id, name: pack.name }, b: { id: otherId, name: byId.get(otherId)?.name ?? otherId } })
    }
  }
  return out
}

/** 观测不完整时阻止批量停用（FR-019）：仅在上一次观测明确不完整时生效。 */
function incompleteGuard(state) {
  if (state && state.lastComplete === false) {
    return {
      status: 409,
      body: {
        ok: false,
        error: "上次观测不完整，为避免误停用已阻止本次批量变更；请先重新观测后再试",
        incomplete: true,
      },
    }
  }
  return null
}

/** 应用前预览：只算差异，不写 state，也不改任何技能包。 */
async function previewIntent(ctx, state, packIds, stack) {
  const base = normalizeIntent(state)
  const next = {
    ...base,
    mode: 'orchestrated',
    activePackIds: normalizePackIds(state, stack ? [...base.activePackIds, ...packIds] : packIds),
  }
  const draft = { ...state, intent: next }
  const observed = await collectState(ctx)
  const skills = Array.isArray(observed?.skills) ? observed.skills : []
  const visible = (plan) =>
    new Set(skills.filter((skill) => hiddenReason(plan, skill.name, skill.source) === null).map((skill) => skill.name))
  const before = visible(state)
  const after = visible(draft)
  const packsBefore = (state.packs ?? []).filter((pack) => packActive(state, pack, base)).map((pack) => pack.id)
  const packsAfter = (state.packs ?? []).filter((pack) => packActive(draft, pack, next)).map((pack) => pack.id)
  const catalogChars =
    skills
      .filter((skill) => after.has(skill.name))
      .reduce((total, skill) => total + Math.min((skill.description ?? '').length, DESCRIPTION_MAX_LENGTH), 0) + 200
  const allPackIds = (state.packs ?? []).map((pack) => pack.id)
  return {
    mode: 'orchestrated',
    activePackIds: next.activePackIds,
    conflicts: conflictPairsFor(state, packsAfter),
    // 生效面用「最终集合」而不是增量：用户看的是应用后哪些包在场上。
    packsOn: packsAfter,
    packsOff: allPackIds.filter((id) => !packsAfter.includes(id)),
    packsEnter: packsAfter.filter((id) => !packsBefore.includes(id)),
    packsLeave: packsBefore.filter((id) => !packsAfter.includes(id)),
    enable: [...after].filter((name) => !before.has(name)).sort(),
    hide: [...before].filter((name) => !after.has(name)).sort(),
    unassigned: skills.filter((skill) => hiddenReason(draft, skill.name, skill.source) === 'unassigned').length,
    catalogChars,
    budgetChars: BUDGET_CHARS,
  }
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

  // 单个技能的开关；传 names 时合并成一次提交（FR-023 批量提交：  
  // 一次写盘 / 一次 invalidate，目录只翻一遍）。
  post(ctx, '/zhiyin/skill', async (body) => {
    const state = readState()
    const incoming = Array.isArray(body?.names) ? body.names : [body?.name]
    const names = [...new Set(incoming.filter((name) => typeof name === 'string' && name.trim()).map((name) => name.trim()))]
    if (names.length === 0) return { status: 400, body: { ok: false, error: 'name is required' } }
    if (body.enabled === false && names.length > 1) {
      const guard = incompleteGuard(state)
      if (guard) return guard
    }
    const at = new Date().toISOString()
    for (const skillName of names) {
      if (names.length === 1 && body.description && !state.known[skillName]) {
        state.known[skillName] = {
          description: String(body.description).slice(0, 400),
          source: typeof body.source === 'string' ? body.source : 'custom',
        }
      }
      if (body.enabled === true) delete state.disabled[skillName]
      else state.disabled[skillName] = { at }
    }
    saveState(state)
    invalidateAll()
    return { status: 200, body: { ok: true, applied: names.length, disabled: Object.keys(state.disabled).length } }
  })

  post(ctx, '/zhiyin/settings', async (body) => {
    const state = readState()
    if (body?.allOff === true) {
      const guard = incompleteGuard(state)
      if (guard) return guard
    }
    if (typeof body?.agentsRoot === 'boolean') state.agentsRoot = body.agentsRoot
    if (typeof body?.allOff === 'boolean') state.allOff = body.allOff
    saveState(state)
    invalidateAll()
    return { status: 200, body: { ok: true, agentsRoot: state.agentsRoot, allOff: state.allOff === true } }
  })

  post(ctx, '/zhiyin/pack', async (body) => {
    const state = readState()
    const packs = Array.isArray(state.packs) ? state.packs : (state.packs = [])
    const action = typeof body?.action === 'string' ? body.action : ''
    const id = typeof body?.id === 'string' ? body.id : ''
    const index = packs.findIndex((pack) => pack.id === id)

    if (action === 'import') {
      let raw = typeof body?.text === 'string' ? body.text : ''
      const importPath = cleanPath(body?.path)
      if (!raw && importPath) {
        try {
          raw = readFileSync(importPath, 'utf8')
        } catch (error) {
          return { status: 400, body: { ok: false, error: 'cannot read file: ' + String(error?.message ?? error) } }
        }
      }
      if (!raw.trim()) return { status: 400, body: { ok: false, error: 'text or path is required' } }
      const names = []
      let title = ''
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (trimmed.startsWith('#')) {
          const matched = trimmed.match(/Skill Pack:\s*([^|#]+)/i)
          if (matched) title = matched[1].trim()
          continue
        }
        const first = trimmed.split('|')[0].trim()
        if (first && !names.includes(first)) names.push(first)
      }
      if (names.length === 0) return { status: 400, body: { ok: false, error: 'no skill names found' } }
      const name = (typeof body?.name === 'string' ? body.name.trim() : '') || title || '导入的技能包'
      const newId = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
      packs.push({ id: newId, name, enabled: true, members: names, conflictsWith: [], order: packs.length })
      saveState(state)
      invalidateAll()
      return { status: 200, body: { ok: true, id: newId, members: names.length, names } }
    }

    if (action === 'create') {
      const name = typeof body?.name === 'string' ? body.name.trim() : ''
      if (!name) return { status: 400, body: { ok: false, error: 'name is required' } }
      if (!packNameValid(name)) return { status: 400, body: { ok: false, error: '技能包名需为 1–40 个字符，仅限中文、字母、数字、空格、下划线、连字符' } }
      if (packNameTaken(packs, name)) return { status: 400, body: { ok: false, error: '已有同名技能包' } }
      const newId = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
      packs.push({ id: newId, name, enabled: true, members: [], conflictsWith: [], order: packs.length })
      saveState(state)
      invalidateAll()
      return { status: 200, body: { ok: true, id: newId } }
    }

    if (index < 0) return { status: 404, body: { ok: false, error: 'pack not found' } }
    const pack = packs[index]

    if (action === 'rename') {
      const name = typeof body?.name === 'string' ? body.name.trim() : ''
      if (!name) return { status: 400, body: { ok: false, error: 'name is required' } }
      if (!packNameValid(name)) return { status: 400, body: { ok: false, error: '技能包名需为 1–40 个字符，仅限中文、字母、数字、空格、下划线、连字符' } }
      if (packNameTaken(packs, name, pack.id)) return { status: 400, body: { ok: false, error: '已有同名技能包' } }
      pack.name = name
    } else if (action === 'toggle') {
      const turningOn = body?.enabled === true
      if (!turningOn) {
        const guard = incompleteGuard(state)
        if (guard) return guard
      }
      if (turningOn) {
        const plan = normalizeIntent(state)
        const activeAfter = (state.packs ?? [])
          .filter((candidate) => packActive(state, candidate.id === pack.id ? { ...candidate, enabled: true } : candidate, plan))
          .map((candidate) => candidate.id)
        const conflicts = conflictPairsFor(state, activeAfter)
        if (conflicts.length > 0 && body?.ack !== true) {
          return { status: 409, body: { ok: false, error: 'conflict', conflicts } }
        }
        if (conflicts.length > 0) {
          note('conflict-ack', { scope: 'pack-toggle', pack: pack.id, revision: plan.revision, pairs: conflicts.map((pair) => [pair.a.id, pair.b.id]) })
        }
      }
      pack.enabled = turningOn
    } else if (action === 'copy') {
      const newId = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
      packs.push({ id: newId, name: (pack.name || '未命名') + ' 副本', enabled: false, members: [...(pack.members ?? [])], conflictsWith: [], order: packs.length })
      saveState(state)
      invalidateAll()
      return { status: 200, body: { ok: true, id: newId } }
    } else if (action === 'delete') {
      packs.splice(index, 1)
    } else if (action === 'members') {
      const members = Array.isArray(body?.members) ? body.members : null
      if (!members) return { status: 400, body: { ok: false, error: 'members must be an array' } }
      const seen = new Set()
      pack.members = members
        .filter((name) => typeof name === 'string' && name.trim())
        .map((name) => name.trim())
        .filter((name) => (seen.has(name) ? false : (seen.add(name), true)))
    } else if (action === 'reorder') {
      const ids = Array.isArray(body?.ids) ? body.ids : []
      for (let i = 0; i < ids.length; i += 1) {
        const target = packs.find((candidate) => candidate.id === ids[i])
        if (target) target.order = i
      }
      packs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    } else if (action === 'conflicts') {
      pack.conflictsWith = normalizeConflicts(state, pack.id, body?.conflictsWith)
    } else {
      return { status: 400, body: { ok: false, error: 'unknown action: ' + action } }
    }

    saveState(state)
    invalidateAll()
    return { status: 200, body: { ok: true, packs: packs.length } }
  })

  // 组合（PRD §7.3）：只保存包 ID 列表；应用/叠加写进 intent，改生效面而不是包本身。
  post(ctx, '/zhiyin/combo', async (body) => {
    const state = readState()
    const combos = Array.isArray(state.combos) ? state.combos : (state.combos = [])
    const action = typeof body?.action === 'string' ? body.action : ''
    const id = typeof body?.id === 'string' ? body.id : ''
    const index = combos.findIndex((combo) => combo.id === id)
    const now = new Date().toISOString()

    if (action === 'create') {
      const name = typeof body?.name === 'string' ? body.name.trim() : ''
      if (!name) return { status: 400, body: { ok: false, error: 'name is required' } }
      if (!packNameValid(name)) return { status: 400, body: { ok: false, error: '组合名需为 1–40 个字符，仅限中文、字母、数字、空格、下划线、连字符' } }
      if (comboNameTaken(combos, name)) return { status: 400, body: { ok: false, error: '已有同名组合' } }
      const newComboId = newId('c')
      combos.push({ id: newComboId, name, description: '', packIds: [], order: combos.length, createdAt: now, updatedAt: now })
      saveState(state)
      invalidateAll()
      return { status: 200, body: { ok: true, id: newComboId } }
    }

    // 退出合奏：回到兼容模式，包自己的开关原样保留。
    if (action === 'exit') {
      const current = normalizeIntent(state)
      state.intent = { ...current, mode: 'compat', activePackIds: [], revision: current.revision + 1, updatedAt: now }
      saveState(state)
      invalidateAll()
      note('intent-exit', { revision: state.intent.revision })
      return { status: 200, body: { ok: true, intent: normalizeIntent(state) } }
    }

    // 差异预览：不写 state；应用前必须让用户看到「会加入谁、会退出谁」。
    if (action === 'preview') {
      const combo = index >= 0 ? combos[index] : null
      const packIds = Array.isArray(body?.packIds) ? body.packIds : (combo?.packIds ?? [])
      const preview = await previewIntent(ctx, state, packIds, body?.stack === true)
      return { status: 200, body: { ok: true, preview } }
    }

    if (index < 0) return { status: 404, body: { ok: false, error: 'combo not found' } }
    const combo = combos[index]

    if (action === 'rename') {
      const name = typeof body?.name === 'string' ? body.name.trim() : ''
      if (!name) return { status: 400, body: { ok: false, error: 'name is required' } }
      if (!packNameValid(name)) return { status: 400, body: { ok: false, error: '组合名需为 1–40 个字符，仅限中文、字母、数字、空格、下划线、连字符' } }
      if (comboNameTaken(combos, name, combo.id)) return { status: 400, body: { ok: false, error: '已有同名组合' } }
      combo.name = name
    } else if (action === 'setPacks') {
      combo.packIds = normalizePackIds(state, body?.packIds)
    } else if (action === 'delete') {
      combos.splice(index, 1)
    } else if (action === 'apply' || action === 'stack') {
      const guard = incompleteGuard(state)
      if (guard) return guard
      const current = normalizeIntent(state)
      const active = action === 'stack' ? [...current.activePackIds, ...combo.packIds] : combo.packIds
      const nextActive = normalizePackIds(state, active)
      const activeAfter = (state.packs ?? [])
        .filter((pack) => nextActive.includes(pack.id) && pack.enabled !== false)
        .map((pack) => pack.id)
      const conflicts = conflictPairsFor(state, activeAfter)
      if (conflicts.length > 0 && body?.ack !== true) {
        return { status: 409, body: { ok: false, error: 'conflict', conflicts } }
      }
      if (conflicts.length > 0) {
        note('conflict-ack', { scope: action, combo: combo.id, revision: current.revision, pairs: conflicts.map((pair) => [pair.a.id, pair.b.id]) })
      }
      state.intent = {
        ...current,
        mode: 'orchestrated',
        activePackIds: nextActive,
        revision: current.revision + 1,
        updatedAt: now,
      }
      note('intent-applied', { combo: combo.id, action, packs: state.intent.activePackIds.length })
    } else {
      return { status: 400, body: { ok: false, error: 'unknown action: ' + action } }
    }

    combo.updatedAt = now
    saveState(state)
    invalidateAll()
    return { status: 200, body: { ok: true, combos: combos.length, intent: normalizeIntent(state) } }
  })

  // 合奏层开关：单技能排除（FR-011）与常驻技能（FR-010）。只改 intent，不动任何包。
  post(ctx, '/zhiyin/intent', async (body) => {
    const state = readState()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    if (!name) return { status: 400, body: { ok: false, error: 'name is required' } }
    const field = body?.field === 'alwaysOn' ? 'alwaysOnSkillNames' : 'excludedSkillNames'
    const on = body?.value === true
    const current = normalizeIntent(state)
    // 常驻与排除互斥（FR-010）：冲突时报错，不静默改写。
    if (on && field === 'excludedSkillNames' && current.alwaysOnSkillNames.includes(name)) {
      return { status: 400, body: { ok: false, error: '该技能已设为常驻，不能同时排除；请先取消常驻' } }
    }
    if (on && field === 'alwaysOnSkillNames' && current.excludedSkillNames.includes(name)) {
      return { status: 400, body: { ok: false, error: '该技能已被排除，不能同时设为常驻；请先取消排除' } }
    }
    const next = { ...current }
    const names = new Set(current[field])
    if (on) names.add(name)
    else names.delete(name)
    next[field] = [...names]
    next.revision = current.revision + 1
    next.updatedAt = new Date().toISOString()
    state.intent = next
    saveState(state)
    invalidateAll()
    note('intent-updated', { field, name, on })
    return { status: 200, body: { ok: true, intent: next } }
  })

  // 技能备注：只存本地 state，不写技能文件；清空即删除。
  post(ctx, '/zhiyin/note', async (body) => {
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    if (!name) return { status: 400, body: { ok: false, error: 'name is required' } }
    const text = typeof body?.note === 'string' ? body.note.trim().slice(0, NOTE_MAX) : ''
    const state = readState()
    const notes = { ...(state.notes ?? {}) }
    if (text) notes[name] = text
    else delete notes[name]
    state.notes = notes
    saveState(state)
    note('skill-note', { name, chars: text.length })
    return { status: 200, body: { ok: true, name, note: text } }
  })

  post(ctx, '/zhiyin/install', async (body) => {
    // 统一入口：一个输入框既收本地文件夹，也收 GitHub / npx skills add / 直链。
    if (typeof body?.text === 'string' && body.text.trim()) return installFromText(ctx, body)
    const source = cleanPath(body?.path ?? body?.text)
    if (!source) return { status: 400, body: { ok: false, error: '需要安装来源（链接或本地文件夹）' } }
    let stat
    try {
      stat = statSync(source)
    } catch {
      return { status: 404, body: { ok: false, error: '找不到这个文件夹：' + source } }
    }
    if (!stat.isDirectory()) return { status: 400, body: { ok: false, error: '这个路径不是文件夹：' + source } }
    if (!existsSync(join(source, 'SKILL.md'))) {
      return { status: 400, body: { ok: false, error: '这个文件夹里没有 SKILL.md' } }
    }
    return installDirectory(ctx, body, source, basename(source).replace(/[\\/]+$/, ''))
  })

  // 批量安装：扫描出多个技能后，客户端把勾选的子目录一次交回来。
  post(ctx, '/zhiyin/install/batch', async (body) => installBatch(ctx, body))

  post(ctx, '/zhiyin/uninstall', async (body) => {
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    if (!name) return { status: 400, body: { ok: false, error: 'name is required' } }
    const roots = [installRoot(ctx, 'agents'), installRoot(ctx, 'user'), installRoot(ctx, 'project')].filter(Boolean)
    let from = null
    for (const root of roots) {
      const candidate = join(root, name)
      if (existsSync(candidate)) {
        from = candidate
        break
      }
    }
    if (!from) return { status: 404, body: { ok: false, error: '该技能不在织音管理的技能目录里（只读来源），无法卸载' } }
    const archiveRoot = join(stateDir(), 'archive')
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const to = join(archiveRoot, stamp + '-' + name)
    try {
      mkdirSync(archiveRoot, { recursive: true })
      renameSync(from, to)
    } catch (error) {
      return { status: 500, body: { ok: false, error: String(error?.message ?? error) } }
    }
    // 如果这个技能曾被包链接进 .dsh/skills，归档后把断链清掉。
    try {
      const link = join(dshSkillsRoot(), name)
      if (lstatSync(link).isSymbolicLink()) unlinkSync(link)
    } catch {
      /* 没有链接就跳过 */
    }
    note('skill-archived', { name, from, to })
    invalidateAll()
    return { status: 200, body: { ok: true, name, to } }
  })

  // 导出配置：只导出可移植的编排状态（包 / 停用项 / 总开关），
  // 跟「导出配置 / 导入配置」呼应 PRD DR-10（配置丢失是唯一不可恢复事故）。
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: '/zhiyin/export',
      resource: async () => {
        const state = readState()
        return json({
          schemaVersion: 1,
          exportedAt: new Date().toISOString(),
          pluginVersion: PLUGIN_VERSION,
          agentsRoot: state.agentsRoot !== false,
          allOff: state.allOff === true,
          disabled: state.disabled ?? {},
          notes: state.notes ?? {},
          packs: (state.packs ?? []).map((pack, index) => ({
            id: pack?.id,
            name: pack?.name,
            enabled: pack?.enabled !== false,
            members: Array.isArray(pack?.members) ? pack.members : [],
            conflictsWith: Array.isArray(pack?.conflictsWith) ? pack.conflictsWith : [],
            order: typeof pack?.order === 'number' ? pack.order : index,
          })),
          // 不导出 known：它是观测缓存（可随时由 collectState 重建），且会让文件涨到 80KB+，
          // 既超出 PRD C-18「最小导出」边界，也会撑爆导入侧 64KB body 限制。
          combos: (state.combos ?? []).map((combo, index) => ({
            id: combo?.id,
            name: combo?.name,
            description: combo?.description ?? '',
            packIds: Array.isArray(combo?.packIds) ? combo.packIds : [],
            order: typeof combo?.order === 'number' ? combo.order : index,
          })),
          // 意图（PRD §7.4）：模式 / 生效包 / 常驻 / 排除，一并导出，导入方能原样恢复生效面。
          intent: normalizeIntent(state),
        })
      },
    }),
  )

  // 导入侧给更宽的 body 上限：导出已经瘦身成「最小导出」，
  // 但用户手写的配置可能含很长的成员清单，别因为体积把格式错误报成「太大」。
  post(ctx, '/zhiyin/import', async (body) => {
    const payload = body && typeof body === 'object' && body.config && typeof body.config === 'object' ? body.config : body
    const incomingPacks = Array.isArray(payload?.packs) ? payload.packs : null
    if (incomingPacks === null && payload?.schemaVersion === undefined) {
      return { status: 400, body: { ok: false, error: '不是有效的织音配置：缺少 packs 或 schemaVersion' } }
    }
    // 规范化专业技能包：给缺 id/order 的补默认值、去重成员、截断超长包名。
    const packs = incomingPacks === null
      ? []
      : incomingPacks
          .filter((pack) => pack && typeof pack === 'object')
          .map((pack, index) => ({
            id: typeof pack.id === 'string' && pack.id ? pack.id : 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5) + index,
            name: typeof pack.name === 'string' ? pack.name.trim().slice(0, PACK_NAME_MAX) : ('包 ' + (index + 1)),
            enabled: pack.enabled !== false,
            members: Array.isArray(pack.members)
              ? [...new Set(pack.members.filter((name) => typeof name === 'string' && name.trim()).map((name) => name.trim()))]
              : [],
            conflictsWith: Array.isArray(pack.conflictsWith) ? pack.conflictsWith.filter((entry) => typeof entry === 'string') : [],
            order: typeof pack.order === 'number' ? pack.order : index,
          }))
    // 组合同样规范化：缺 id/order 补默认值，成员只留字符串。
    const incomingCombos = Array.isArray(payload?.combos) ? payload.combos : null
    const combos = incomingCombos === null
      ? []
      : incomingCombos
          .filter((combo) => combo && typeof combo === 'object')
          .map((combo, index) => ({
            id: typeof combo.id === 'string' && combo.id ? combo.id : 'c' + Date.now().toString(36) + index,
            name: typeof combo.name === 'string' ? combo.name.trim().slice(0, PACK_NAME_MAX) : ('组合 ' + (index + 1)),
            description: typeof combo.description === 'string' ? combo.description.slice(0, 200) : '',
            packIds: Array.isArray(combo.packIds) ? combo.packIds.filter((packId) => typeof packId === 'string') : [],
            order: typeof combo.order === 'number' ? combo.order : index,
            createdAt: typeof combo.createdAt === 'string' ? combo.createdAt : new Date().toISOString(),
            updatedAt: typeof combo.updatedAt === 'string' ? combo.updatedAt : new Date().toISOString(),
          }))

    // 导入 = 恢复配置（替换语义），先给当前 state 落一份带时间戳的备份，再覆盖可编辑字段。
    const backup = backupState()
    const state = readState()
    // 只有确实带了 packs 数组才覆盖：粘贴的 JSON 缺 packs 时不清空现有技能包。
    if (incomingPacks !== null) {
      state.packs = packs
      for (const pack of state.packs) pack.conflictsWith = normalizeConflicts(state, pack.id, pack.conflictsWith)
    }
    if (payload && typeof payload === 'object') {
      if (typeof payload.agentsRoot === 'boolean') state.agentsRoot = payload.agentsRoot
      if (typeof payload.allOff === 'boolean') state.allOff = payload.allOff
      if (payload.disabled && typeof payload.disabled === 'object' && !Array.isArray(payload.disabled)) state.disabled = payload.disabled
      // 备注跟着配置走：只收字符串值，逐条截断上限。
      if (payload.notes && typeof payload.notes === 'object' && !Array.isArray(payload.notes)) {
        state.notes = Object.fromEntries(
          Object.entries(payload.notes)
            .filter(([key, value]) => typeof key === 'string' && typeof value === 'string')
            .map(([key, value]) => [key, value.trim().slice(0, NOTE_MAX)])
            .filter(([, value]) => value.length > 0),
        )
      }
      // 组合引用的包可能在本机不存在：先落地，再把幽灵 ID 洗干净。
      if (incomingCombos !== null) {
        state.combos = combos.map((combo) => ({ ...combo, packIds: normalizePackIds(state, combo.packIds) }))
      }
      if (payload.intent && typeof payload.intent === 'object') {
        const intent = normalizeIntent({ intent: payload.intent })
        intent.activePackIds = normalizePackIds(state, intent.activePackIds)
        state.intent = intent
      }
      // known 是缓存不是配置：导入时只做合并，本地观测到的元信息优先，避免被旧快照覆盖。
      if (payload.known && typeof payload.known === 'object' && !Array.isArray(payload.known)) {
        state.known = { ...payload.known, ...state.known }
      }
    }
    saveState(state)
    invalidateAll()
    // 导入后实际生效的技能包（粘贴的 JSON 没带 packs 时就是原有那些）。
    const effective = Array.isArray(state.packs) ? state.packs : []
    // 列出包内引用、但当前作用域观测不到的技能（best-effort，失败不影响导入）。
    let missing = []
    try {
      const snapshot = await collectState(ctx)
      const names = new Set((snapshot.skills ?? []).map((skill) => skill.name))
      const wanted = new Set(effective.flatMap((pack) => pack.members ?? []))
      missing = [...wanted].filter((name) => !names.has(name))
    } catch {
      /* 缺失清单失败不影响导入 */
    }
    const effectiveCombos = Array.isArray(state.combos) ? state.combos.length : 0
    note('config-imported', { packs: effective.length, combos: effectiveCombos, backup, missing: missing.length })
    return { status: 200, body: { ok: true, packs: effective.length, combos: effectiveCombos, backup, missing } }
  }, 1048576)

  // 投影日志与回滚（FR-025）：列出导入前留下的快照，并允许退回任意一份。
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: '/zhiyin/backups',
      resource: async () => json({ backups: listBackups() }),
    }),
  )
  post(ctx, '/zhiyin/rollback', async (body) => {
    const wanted = typeof body?.file === 'string' ? body.file.trim() : ''
    const backups = listBackups()
    const target = wanted || backups[0]?.file || ''
    if (!target || !backups.some((entry) => entry.file === target)) {
      return { status: 404, body: { ok: false, error: '没有可回滚的备份' } }
    }
    // 回滚本身也可能手滑：先把当前状态再备份一份，任何一步都可退。
    const safety = backupState()
    try {
      cpSync(join(stateDir(), target), configFile())
    } catch (error) {
      note('state-rollback-failed', { file: target, error: String(error?.message ?? error) })
      return { status: 500, body: { ok: false, error: '回滚失败：' + String(error?.message ?? error) } }
    }
    cache = null // 下一位读者必须重新读盘，而不是继续用内存里的旧状态。
    invalidateAll()
    note('state-rolled-back', { file: target, safety })
    return { status: 200, body: { ok: true, file: target, safety } }
  })
  // 一致性修复（FR-022）：把观测不到的引用从包 / 组合 / 意图里剪掉。
  // 不猜技能去哪了，只清理指向不存在对象的引用；修复前照样留一份备份。
  post(ctx, '/zhiyin/repair', async () => {
    const state = readState()
    const guard = incompleteGuard(state)
    if (guard) return guard
    const observed = await collectState(ctx)
    if (observed?.complete === false) {
      return { status: 409, body: { ok: false, error: '观测不完整，无法判断哪些引用已失效；请先重新观测后再试', incomplete: true } }
    }
    const names = new Set((observed?.skills ?? []).map((skill) => skill.name))
    const prunedPacks = []
    const packs = (state.packs ?? []).map((pack) => {
      const members = Array.isArray(pack.members) ? pack.members : []
      const kept = members.filter((name) => names.has(name))
      if (kept.length !== members.length) {
        prunedPacks.push({ id: pack.id, name: pack.name, names: members.filter((name) => !names.has(name)) })
      }
      return { ...pack, members: kept }
    })
    const packIds = new Set(packs.map((pack) => pack.id))
    const combos = (state.combos ?? []).map((combo) => {
      const ids = Array.isArray(combo.packIds) ? combo.packIds : []
      const kept = ids.filter((id) => packIds.has(id))
      return { ...combo, packIds: kept }
    })
    const combosPruned = combos.reduce((total, combo, index) => {
      const before = (state.combos?.[index]?.packIds ?? []).length
      return total + (before - combo.packIds.length)
    }, 0)
    const intent = normalizeIntent(state)
    const alwaysOn = intent.alwaysOnSkillNames.filter((name) => names.has(name))
    const excluded = intent.excludedSkillNames.filter((name) => names.has(name))
    const next = {
      ...state,
      packs,
      combos,
      intent: {
        ...intent,
        activePackIds: intent.activePackIds.filter((id) => packIds.has(id)),
        alwaysOnSkillNames: alwaysOn,
        excludedSkillNames: excluded,
        revision: intent.revision + 1,
        updatedAt: new Date().toISOString(),
      },
    }
    const missing = [
      ...new Set([
        ...prunedPacks.flatMap((pack) => pack.names),
        ...intent.alwaysOnSkillNames.filter((name) => !names.has(name)),
        ...intent.excludedSkillNames.filter((name) => !names.has(name)),
      ]),
    ]
    const changed = prunedPacks.length > 0 || combosPruned > 0 || missing.length > 0
      || intent.activePackIds.length !== next.intent.activePackIds.length
    if (!changed) {
      return { status: 200, body: { ok: true, changed: false, missing: [], packs: [], combos: 0 } }
    }
    const backup = backupState()
    saveState(next)
    invalidateAll()
    note('consistency-repaired', { packs: prunedPacks.length, combos: combosPruned, missing: missing.length, backup })
    return {
      status: 200,
      body: { ok: true, changed: true, missing, packs: prunedPacks, combos: combosPruned, backup },
    }
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

/** 技能 SSOT 根：~/.agents/skills。所有可管理的技能先落在这里，再由技能包决定谁上场。 */
function agentsRoot() {
  const home = cleanPath(process.env.DSH_AGENTS_HOME) || join(homedir(), '.agents')
  return join(home, 'skills')
}

/** DSH 的用户技能目录：启用包里的成员以软链接出现在这里，DSH 才看得到。 */
function dshSkillsRoot() {
  return join(homedir(), '.dsh', 'skills')
}

function installRoot(ctx, target) {
  if (target === 'agents') return agentsRoot()
  if (target !== 'project') return dshSkillsRoot()
  const agents = typeof ctx.agents?.list === 'function' ? ctx.agents.list() : []
  for (const agent of agents) {
    try {
      const cwd = ctx.workingDirectory?.get?.(agent)
      if (typeof cwd === 'string' && cwd.length > 0) return join(cwd, '.dsh', 'skills')
    } catch {
      /* 拿不到工作目录就继续找下一个 */
    }
  }
  return null
}

/** 某个技能在 SSOT 里的真实目录；找不到返回 null。 */
function ssotDir(name) {
  const dir = join(agentsRoot(), name)
  return existsSync(join(dir, 'SKILL.md')) ? dir : null
}

/** 从 SKILL.md 的 frontmatter 取 name；取不到返回空串。 */
function skillFrontmatterName(file) {
  try {
    const text = readFileSync(file, 'utf8')
    const head = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
    if (!head) return ''
    for (const line of head[1].split(/\r?\n/)) {
      const hit = /^\s*name\s*:\s*(.+?)\s*$/.exec(line)
      if (hit) return hit[1].replace(/^["']|["']$/g, '').trim()
    }
  } catch {
    /* 读不到就当没有名字 */
  }
  return ''
}

/** 在解压目录里找所有含 SKILL.md 的子目录（相对路径，'' 表示仓库根）。 */
function findSkillDirs(base, rel = '', depth = 0, out = []) {
  if (depth > 5) return out
  const dir = rel ? join(base, rel) : base
  let entries = []
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  if (entries.some((entry) => entry.isFile() && entry.name === 'SKILL.md')) {
    out.push(rel)
    return out
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    findSkillDirs(base, rel ? rel + '/' + entry.name : entry.name, depth + 1, out)
  }
  return out
}

/** 把 owner/repo、GitHub 链接、npx skills add、gh repo clone 统一成仓库坐标。 */
function resolveGithubSource(text) {
  let raw = String(text || '').trim()
  raw = raw.replace(/^npx\s+skills\s+add\s+/i, '').replace(/^gh\s+repo\s+clone\s+/i, '').replace(/^git\s+clone\s+/i, '')
  raw = raw.replace(/^["']|["']$/g, '').split(/[?#]/)[0]
  if (/^https?:\/\//i.test(raw) && !/github\.com/i.test(raw)) return null
  let rest = raw.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\.git$/i, '')
  rest = rest.replace(/\/+$/, '')
  const parts = rest.split('/').filter(Boolean)
  if (parts.length < 2) return null
  if (!/^[\w.-]+$/.test(parts[0]) || !/^[\w.-]+$/.test(parts[1])) return null
  const owner = parts[0]
  const repo = parts[1]
  let branch = ''
  let subpath = ''
  if (parts[2] === 'tree' || parts[2] === 'blob') {
    branch = parts[3] ?? ''
    subpath = parts.slice(4).join('/')
    if (parts[2] === 'blob' && /SKILL\.md$/i.test(subpath)) subpath = subpath.replace(/\/?SKILL\.md$/i, '')
  } else if (parts.length > 2) {
    subpath = parts.slice(2).join('/')
  }
  return { owner, repo, repoUrl: 'https://github.com/' + owner + '/' + repo + '.git', branch, subpath }
}

/** 子路径必须落在仓库临时目录里，防止 ../ 越界。 */
function safeJoin(base, rel) {
  const target = resolve(base, rel || '.')
  const root = resolve(base)
  if (target !== root && !target.startsWith(root + sep)) return null
  return target
}

const repoCache = new Map()

/** 同一仓库 10 分钟内复用一次 clone：多技能勾选安装不再反复拉取。 */
function cloneRepo(source) {
  const key = source.repoUrl + '#' + (source.branch || '')
  const hit = repoCache.get(key)
  if (hit && existsSync(hit.dir) && Date.now() - hit.at < 10 * 60 * 1000) {
    hit.at = Date.now()
    return { dir: hit.dir }
  }
  const dir = mkdtempSync(join(tmpdir(), 'zhiyin-repo-'))
  try {
    const args = ['clone', '--depth', '1']
    if (source.branch) args.push('--branch', source.branch)
    args.push(source.repoUrl, dir)
    execFileSync('git', args, { stdio: 'ignore', timeout: 120000 })
  } catch {
    rmSync(dir, { recursive: true, force: true })
    return { error: '拉取仓库失败：检查地址、网络或私有仓库权限' }
  }
  for (const [oldKey, entry] of repoCache) {
    if (Date.now() - entry.at > 10 * 60 * 1000) {
      try { rmSync(entry.dir, { recursive: true, force: true }) } catch {}
      repoCache.delete(oldKey)
    }
  }
  repoCache.set(key, { dir, at: Date.now() })
  return { dir }
}

/** 批量安装：一次 clone，多个子目录逐个装入，返回成功与失败清单。 */
function installBatch(ctx, body) {
  const text = cleanPath(String(body?.text ?? ''))
  const source = resolveGithubSource(text)
  if (!source) return { status: 400, body: { ok: false, error: '批量安装只接受 GitHub 仓库地址' } }
  const subpaths = Array.isArray(body?.subpaths)
    ? body.subpaths.filter((item) => typeof item === 'string' && item.trim()).slice(0, 50)
    : []
  if (subpaths.length === 0) return { status: 400, body: { ok: false, error: '没有选中要安装的技能' } }
  const clone = cloneRepo(source)
  if (clone.error) return { status: 400, body: { ok: false, error: clone.error } }
  const installed = []
  const failed = []
  for (const rel of subpaths) {
    const dir = safeJoin(clone.dir, rel)
    if (!dir || !existsSync(join(dir, 'SKILL.md'))) {
      failed.push({ subpath: rel, name: basename(rel) || source.repo, error: '这个目录里没有 SKILL.md' })
      continue
    }
    const result = installDirectory(ctx, { ...body, name: '' }, dir, basename(rel) || source.repo)
    if (result.status === 200) installed.push(result.body)
    else failed.push({ subpath: rel, name: basename(rel) || source.repo, error: result.body?.error ?? '安装失败' })
  }
  const ok = installed.length > 0
  return { status: ok ? 200 : 400, body: { ok, installed, failed } }
}

/** 复制一个含 SKILL.md 的目录到安装根；冲突与非法名都在这里拦。 */
function installDirectory(ctx, body, source, fallbackName) {
  const fromFile = skillFrontmatterName(join(source, 'SKILL.md'))
  const asked = typeof body?.name === 'string' ? body.name.trim() : ''
  // 技能名就是 DSH 调用时用的标识（/name），来自 SKILL.md 的 name；目录名也用它，避免两套名字。
  if (asked && fromFile && asked !== fromFile) {
    return { status: 400, body: { ok: false, error: '技能名要和 SKILL.md 里的 name 一致：SKILL.md 是“' + fromFile + '”，你填的是“' + asked + '”' } }
  }
  const name = String(fromFile || asked || fallbackName || basename(source)).trim()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    return { status: 400, body: { ok: false, error: '技能名不合法：' + name + '（DSH 要求小写字母或数字，单词之间用单个连字符，例如 code-review）' } }
  }
  const root = installRoot(ctx, body?.target)
  if (!root) return { status: 400, body: { ok: false, error: '目标目录不可用' } }
  const dest = join(root, name)
  if (existsSync(dest)) return { status: 409, body: { ok: false, error: '已存在同名技能：' + dest } }
  // 先落到同目录临时名，再原子 rename：中途失败不会留下半个技能目录。
  const tmpDest = dest + '.zhiyin-tmp-' + Date.now().toString(36)
  try {
    mkdirSync(root, { recursive: true })
    cpSync(source, tmpDest, { recursive: true, errorOnExist: true, force: false, filter: (entry) => !/(^|[\\/])(\.git|node_modules)([\\/]|$)/.test(entry) })
    renameSync(tmpDest, dest)
  } catch (error) {
    try { rmSync(tmpDest, { recursive: true, force: true }) } catch {}
    return { status: 500, body: { ok: false, error: String(error?.message ?? error) } }
  }
  note('skill-installed', { name, dest })
  // 装进技能库（.agents）后顺手在 .dsh/skills 建一条软链接，否则 DSH 看不到它。
  if (body?.target === 'agents') {
    try {
      const link = join(dshSkillsRoot(), name)
      mkdirSync(dshSkillsRoot(), { recursive: true })
      if (!existsSync(link)) symlinkSync(dest, link, 'junction')
    } catch (error) {
      note('skill-link-failed', { name, error: String(error?.message ?? error) })
    }
  }
  invalidateAll()
  return { status: 200, body: { ok: true, name, dest } }
}

/** 从直链 SKILL.md 安装：只接受纯文本，写完再走同一套目录安装。 */
async function installRawSkill(ctx, body, url) {
  let text = ''
  try {
    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok) return { status: 400, body: { ok: false, error: '下载 SKILL.md 失败：HTTP ' + response.status } }
    text = await response.text()
  } catch (error) {
    return { status: 400, body: { ok: false, error: '下载 SKILL.md 失败：' + String(error?.message ?? error) } }
  }
  if (!/^---/.test(text.trim())) return { status: 400, body: { ok: false, error: '这个直链不是 SKILL.md（缺少 frontmatter）' } }
  const tmp = mkdtempSync(join(tmpdir(), 'zhiyin-skill-'))
  try {
    writeFileSync(join(tmp, 'SKILL.md'), text)
    const fallback = decodeURIComponent((url.split('/').slice(-2, -1)[0] || '').trim())
    return installDirectory(ctx, body, tmp, fallback)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

/** 文本安装：GitHub 仓库 / npx skills add / 直链 SKILL.md。 */
async function installFromText(ctx, body) {
  const text = cleanPath(String(body?.text ?? ''))
  if (/^([a-zA-Z]:[\\/]|\\\\|\/|\.\.?[\\/])/.test(text) && existsSync(text)) {
    return installDirectory(ctx, body, cleanPath(text), '')
  }
  if (/^https?:\/\//i.test(text) && /\.md(\?|$)/i.test(text)) return installRawSkill(ctx, body, text)
  const source = resolveGithubSource(text)
  if (!source) {
    return { status: 400, body: { ok: false, error: '看不懂这个来源：支持 owner/repo、GitHub 链接、npx skills add …、SKILL.md 直链或本地文件夹' } }
  }
  // 扫描与随后勾选安装共用同一份 clone，避免一个仓库拉两遍。
  const clone = cloneRepo(source)
  if (clone.error) return { status: 400, body: { ok: false, error: clone.error } }
  const tmp = clone.dir
  const wanted = typeof body?.subpath === 'string' ? body.subpath.trim() : source.subpath
  const rels = []
  if (wanted) {
    const dir = safeJoin(tmp, wanted)
    if (!dir || !existsSync(join(dir, 'SKILL.md'))) {
      return { status: 400, body: { ok: false, error: '这个目录里没有 SKILL.md：' + wanted } }
    }
    rels.push(wanted)
  } else {
    rels.push(...findSkillDirs(tmp))
    if (rels.length === 0 && existsSync(join(tmp, 'SKILL.md'))) rels.push('')
  }
  if (rels.length === 0) return { status: 400, body: { ok: false, error: '仓库里没有找到 SKILL.md' } }
  if (rels.length > 1) {
    const candidates = rels.slice(0, 30).map((rel) => ({
      subpath: rel,
      name: skillFrontmatterName(join(tmp, rel, 'SKILL.md')) || basename(rel) || source.repo,
    }))
    return { status: 409, body: { ok: false, error: 'multiple', repo: source.owner + '/' + source.repo, count: rels.length, candidates } }
  }
  const sourceDir = join(tmp, rels[0])
  return installDirectory(ctx, body, sourceDir, basename(rels[0]) || source.repo)
}

function post(ctx, path, run, limit = 65536) {
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
            raw = await readBody(request, limit)
          } catch (error) {
            // 请求体超限时要说清楚是哪一类问题：以前一律吞成空体，
            // 上层只能报「不是有效的织音配置」，把「太大」误报成「格式不对」。
            const tooLarge = String(error?.message ?? error).includes('body too large')
            response.writeHead(tooLarge ? 413 : 400, { 'content-type': 'application/json; charset=utf-8' })
            response.end(
              JSON.stringify({
                ok: false,
                error: tooLarge
                  ? `请求体过大：超过 ${limit} 字节`
                  : '读取请求体失败',
              }),
            )
            return
          }
          let body = {}
          if (raw.length > 0) {
            try {
              body = JSON.parse(raw)
            } catch {
              response.writeHead(400, { 'content-type': 'application/json; charset=utf-8' })
              response.end(JSON.stringify({ ok: false, error: '请求体不是合法的 JSON' }))
              return
            }
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

/**
 * 去掉路径最外层引号：Windows「复制为路径」会带双引号，输入框里也常带单/中文引号。
 * 只剥一层，不改路径本身。
 */
function cleanPath(value) {
  if (typeof value !== 'string') return ''
  let text = value.trim()
  const pairs = [
    ['"', '"'],
    ["'", "'"],
    ['\u201c', '\u201d'],
    ['\u2018', '\u2019'],
  ]
  for (const [open, close] of pairs) {
    if (text.length > 1 && text.startsWith(open) && text.endsWith(close)) {
      text = text.slice(1, -1).trim()
      break
    }
  }
  return text
}

function readState() {
  if (cache) return cache
  try {
    const parsed = JSON.parse(readFileSync(configFile(), 'utf8'))
    const next = { ...EMPTY_STATE, ...parsed, disabled: parsed?.disabled ?? {}, notes: parsed?.notes ?? {}, known: parsed?.known ?? {} }
    // v2 简化：只保留「技能包启用 = 成员可见」。清掉合奏/排除/常驻/冲突声明，避免旧状态把技能卡在不可见。
    if (next.v !== 2) {
      next.v = 2
      next.intent = { ...EMPTY_INTENT }
      next.combos = []
      next.packs = (next.packs ?? []).map((pack) => ({ ...pack, conflictsWith: [] }))
    }
    cache = next
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

/** 把当前 state.json 复制一份带时间戳的备份，返回备份路径；失败返回 null。 */
function backupState() {
  try {
    const file = configFile()
    if (!existsSync(file)) return null
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const dest = join(stateDir(), 'backup-' + stamp + '.json')
    cpSync(file, dest)
    // 只留最近 20 份：回滚容量够用，状态目录不会无限膨胀。
    for (const stale of listBackups().slice(20)) {
      try {
        unlinkSync(join(stateDir(), stale.file))
      } catch {
        /* 删不掉就留着，不影响回滚 */
      }
    }
    return dest
  } catch (error) {
    note('state-backup-failed', { error: String(error?.message ?? error) })
    return null
  }
}

/** 可用备份（新的在前）：只认 stateDir 下的 backup-*.json。 */
function listBackups() {
  try {
    return readdirSync(stateDir())
      .filter((name) => /^backup-.*\.json$/.test(name))
      .sort()
      .reverse()
      .map((file) => ({ file, at: statSync(join(stateDir(), file)).mtime.toISOString() }))
  } catch {
    return []
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

/**
 * 这个技能此刻是否应当被隐藏，以及原因。
 *
 * 优先级：全部停用 > agents 目录开关 > 合奏层排除 > 常驻技能 > 合奏模式（未编配 / 组合未纳入）> 包停用 > 手动停用。
 * 合奏层只决定「生效面」，从不修改技能包自己的开关，所以退出合奏能原样恢复。
 */
function hiddenReason(state, skillName, source) {
  // 一键全部关掉：优先级最高，压过技能包、组合与单个开关。
  if (state.allOff === true) return 'all-off'
  if (state.agentsRoot === false && source === 'user-agents') return 'agents-root'
  const intent = normalizeIntent(state)
  const alwaysOn = intent.alwaysOnSkillNames.includes(skillName)
  // 单技能排除（FR-011）：只影响生效面，不改任何包。
  if (intent.excludedSkillNames.includes(skillName)) {
    if (alwaysOn) note('intent-conflict', { skillName, detail: '同时被设为常驻，按排除处理' })
    return 'excluded'
  }
  // 常驻技能（FR-010）：不受包启停与组合约束。
  if (alwaysOn) return null
  const packs = memberPacks(state, skillName)
  // 单技能开关是底线：包只决定「这一组能不能上场」，不会替成员强行打开。
  if (state.disabled?.[skillName]) return 'manual'
  if (intent.mode === 'orchestrated') {
    // 接管后：未编配的技能不自动生效；编配了但组合没纳入的包也不生效。
    if (packs.length === 0) return 'unassigned'
    if (!packs.some((pack) => packActive(state, pack, intent))) return 'combo'
    return null
  }
  // 技能包就是生效集：托管目录（.dsh / .agents）里的技能必须挂在启用包上才生效；
  // 内置与自定义来源不归包管。文件永远不因包的开关而增删。
  if (packs.length === 0) return PACK_GATED_SOURCES.has(String(source)) ? 'unpacked' : null
  if (!packs.some((pack) => pack.enabled !== false)) return 'pack'
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
  // 同名冲突：同一技能名在不同来源/路径出现多次，提示用户可能互相遮蔽。
  const nameOrigins = new Map()

  const noteSkill = (skill) => {
    if (!byName.has(skill.name)) byName.set(skill.name, skill)
    const originKey = String(skill.source) + '|' + String(skill.path ?? skill.logicalPath ?? '')
    if (!nameOrigins.has(skill.name)) nameOrigins.set(skill.name, new Set())
    nameOrigins.get(skill.name).add(originKey)
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

  // 只读来源（FR-026）：不在织音管理的安装根里的技能，只能启停、不能卸载。
  const uninstallRoots = [installRoot(ctx, 'user'), installRoot(ctx, 'project')].filter(Boolean)
  const skills = [...byName.values()]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((skill) => {
      const current = readState()
      const meta = current.known?.[skill.name]
      // 停用中的技能，列表里看到的是我们自己的影子候选 —— 展示信息回填原始元数据，
      // 免得设置页把来源写成 zhiyin、描述写成占位串。
      const shadowed = skill.provider === PROVIDER_NAME
      const source = shadowed ? (meta?.source ?? skill.source) : skill.source
      const reason = hiddenReason(current, skill.name, source)
      // 引用计数（FR-008）：含这个技能的技能包，用于「停用不误关共享」。
      const refs = memberPacks(current, skill.name).map((pack) => pack.name)
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
        refCount: refs.length,
        refs,
        note: typeof current.notes?.[skill.name] === 'string' ? current.notes[skill.name] : '',
        uninstallable: uninstallRoots.some((root) => existsSync(join(root, skill.name))),
        readOnly: !uninstallRoots.some((root) => existsSync(join(root, skill.name))),
        readOnlyReason:
          source === 'bundled' ? 'bundled' : source === 'custom' ? 'external' : 'root',
      }
    })

  const catalogChars =
    skills
      .filter((skill) => skill.enabled)
      .reduce((total, skill) => total + Math.min(skill.description.length, DESCRIPTION_MAX_LENGTH), 0) +
    200

  // 同名冲突清单（>1 个不同来源/路径）。
  const conflicts = []
  for (const [name, origins] of nameOrigins) {
    if (origins.size > 1) conflicts.push({ name, count: origins.size })
  }

  const current = readState()
  const intent = normalizeIntent(current)
  // 一致性（FR-022）：观测不完整 → degraded；包引用了观测不到的技能 → drifted；否则 synced。
  const observedNames = new Set(skills.map((skill) => skill.name))
  const ghostMembers = [
    ...new Set(
      (current.packs ?? []).flatMap((pack) =>
        (Array.isArray(pack.members) ? pack.members : []).filter((name) => !observedNames.has(name)),
      ),
    ),
  ]
  // 记录上一次观测是否完整与最近一次成功时间，供批量停用保护与 UI 展示。
  const lifecycle = {}
  if (current.lastComplete !== complete) lifecycle.lastComplete = complete
  if (complete && (current.lastGoodAt == null || current.lastComplete === false)) lifecycle.lastGoodAt = new Date().toISOString()
  if (Object.keys(lifecycle).length > 0) saveState({ ...current, ...lifecycle })
  const lastGoodAt = lifecycle.lastGoodAt ?? current.lastGoodAt ?? null
  const consistency = !complete
    ? { status: 'degraded', lastGoodAt }
    : ghostMembers.length > 0
      ? { status: 'drifted', drift: ghostMembers, lastGoodAt }
      : { status: 'synced', lastGoodAt }
  // 每个包的目录成本（FR-021）：按已知描述截断到 500 字符累加，用来判断这个包值不值。
  const packsOut = (current.packs ?? []).map((pack) => {
    const members = Array.isArray(pack.members) ? pack.members : []
    const cost = members.reduce((total, name) => {
      const description = current.known?.[name]?.description
      return total + Math.min(typeof description === 'string' ? description.length : 0, DESCRIPTION_MAX_LENGTH)
    }, 0)
    return { ...pack, members, conflictsWith: normalizeConflicts(current, pack.id, pack.conflictsWith), active: packActive(current, pack, intent), cost }
  })
  const combosOut = (current.combos ?? []).map((combo, index) => ({ ...combo, order: combo.order ?? index }))
  return {
    at: new Date().toISOString(),
    version: PLUGIN_VERSION,
    complete,
    scopes,
    scopedScopes,
    scopeDebug,
    failures,
    conflicts,
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
      readOnly: skills.filter((skill) => skill.readOnly).length,
    },
    packs: packsOut,
    combos: combosOut,
    intent,
    packConflicts: conflictPairsFor(current, activePackIds(current, intent)),
    consistency,
  }
}
