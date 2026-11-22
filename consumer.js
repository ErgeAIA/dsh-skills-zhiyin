/**
 * 织音 · 投影执行面（预设级）
 *
 * 只做三件事：
 *   1. pre-step 发布 / 退役模型可见的技能目录；
 *   2. 注册同名 `skill` 工具，正文一律走 ctx.skills.get()；
 *   3. 处理 `/name` 手势。
 *
 * 为什么必须挂在预设里：Web profile 的技能消费者是预设级装配的
 * （dsh-web-app/presets/standard.patch.yml 的 plugins 里有 tool-skill），
 * 全局注册同名工具永远赢不了更近的那一条。
 */
import { createHash } from 'node:crypto'
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { createUserMessage } from '@deepseek-ai/dsh-llm'
import {
  escapeText,
  isModelInvocable,
  isSkillName,
  isUserInvocable,
  renderSkillContent,
} from '@deepseek-ai/dsh-skill'
import { defineTool } from '@deepseek-ai/dsh-tools'

import { stateDir } from './paths.js'

export const name = 'zhiyin-consumer'
export const inject = ['tools', 'skills', 'workingDirectory']

/** 原型期的意图：空数组 = 不筛选（等价于上游行为）。 */
const ALLOWLIST = []
const DESCRIPTION_MAX_LENGTH = 500

const SKILL_GESTURE = /(^|\s)\/([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g
const INCOMPLETE_NOTICE =
  'Some skills could not be checked. Only confirmed skills are listed; a lower-priority definition of the same name may be selected when a preferred source is unavailable. Discovery will be retried on the next request.'

export function apply(ctx) {
  const report = (payload) => {
    const line = { at: new Date().toISOString(), ...payload }
    try {
      const root = stateDir()
      mkdirSync(root, { recursive: true })
      writeFileSync(join(root, 'status.json'), JSON.stringify(line, null, 2))
      appendFileSync(join(root, 'events.ndjson'), `${JSON.stringify(line)}\n`)
    } catch {
      /* 诊断写不进去不能影响投影 */
    }
  }

  const admit = (skill) => ALLOWLIST.length === 0 || ALLOWLIST.includes(skill.name)

  const skillTool = defineTool({
    name: 'skill',
    description:
      'Load the full instructions for a skill. Call it before acting on a task that names or clearly matches a skill in the session skill catalog.',
    parameters: {
      name: {
        type: 'string',
        required: true,
        description: 'The exact skill name from the available skills list.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', required: true },
          provider: { type: 'string', required: true },
          resourceBase: {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  kind: { type: 'string', required: true, const: 'directory' },
                  path: { type: 'string', required: true },
                },
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  kind: { type: 'string', required: true, const: 'url' },
                  url: { type: 'string', required: true },
                },
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  kind: { type: 'string', required: true, const: 'opaque' },
                  description: { type: 'string', required: true },
                },
              },
            ],
          },
          content: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: renderSkillContent(value) }],
    },
    async execute(args, exec) {
      if (!isSkillName(args.name)) {
        throw new Error(`invalid skill name "${args.name}"`)
      }
      if (!admit({ name: args.name })) {
        throw new Error(`skill "${args.name}" is not available in the current ensemble`)
      }
      const cwd =
        exec.agent === undefined
          ? undefined
          : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
      const lookup = { cwd, signal: exec.signal, scope: exec.agent }
      const summary = (await ctx.skills.list(lookup)).find((skill) => skill.name === args.name)
      if (!summary) throw new Error(`skill "${args.name}" is unknown or no longer available`)
      if (!isModelInvocable(summary)) {
        throw new Error(`skill "${args.name}" is not available for model invocation`)
      }
      const skill = await ctx.skills.get(args.name, lookup)
      if (!skill) throw new Error(`skill "${args.name}" is unknown or no longer available`)
      if (!isModelInvocable(skill)) {
        throw new Error(`skill "${args.name}" is not available for model invocation`)
      }
      report({ event: 'tool-load', skill: skill.name, provider: skill.provider })
      return {
        name: skill.name,
        provider: skill.provider,
        ...(skill.resourceBase === undefined ? {} : { resourceBase: { ...skill.resourceBase } }),
        content: skill.content,
      }
    },
  })
  ctx.tools.register(skillTool)
  report({
    event: 'register',
    globalHoldsOurs: ctx.tools.get(skillTool.name, undefined) === skillTool,
  })

  ctx.on('agent/pre-step', async ({ agent, messages, signal }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    try {
      const names = invokedNames(messages)
      if (names.length === 0) return decision
      return await injectGestures(agent, names, decision, signal)
    } catch (error) {
      report({ event: 'gesture-error', message: String(error?.stack ?? error) })
      return decision
    }
  })

  async function injectGestures(agent, names, decision, signal) {
    signal.throwIfAborted()
    const cwd = await ctx.workingDirectory.ensure(agent, signal)
    const lookup = { cwd, signal, scope: agent }
    const injections = []
    for (const skillName of names) {
      if (!admit({ name: skillName })) continue
      const skill = await ctx.skills.get(skillName, lookup)
      signal.throwIfAborted()
      if (skill === undefined || !isUserInvocable(skill)) continue
      injections.push(
        createUserMessage({
          content: [{ type: 'text', text: renderSkillContent(skill) }],
          source: { kind: 'skill-invocation', name: skillName, form: 'instructions' },
        }),
      )
    }
    if (injections.length === 0) return decision
    report({ event: 'gesture', names, injected: injections.length })
    return { ...decision, messages: [...decision.messages, ...injections] }
  }

  ctx.on('agent/pre-step', async ({ agent, signal }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    try {
      return await projectCatalog(agent, decision, signal)
    } catch (error) {
      report({ event: 'catalog-error', message: String(error?.stack ?? error) })
      return decision
    }
  })

  async function projectCatalog(agent, decision, signal) {
    signal.throwIfAborted()
    // 同层同名工具先注册者胜；不是我们就说明本会话没被我们接管，别去动别人的目录。
    const visible = ctx.tools.get(skillTool.name, agent) === skillTool
    report({ event: 'pre-step', visible })
    if (!visible) return decision

    const cwd = await ctx.workingDirectory.ensure(agent, signal)
    const snapshot = await ctx.skills.snapshot({ cwd, signal, scope: agent })
    signal.throwIfAborted()

    const skills = snapshot.skills.filter(isModelInvocable).filter(admit)
    const entries = skills.map((skill) => ({
      name: skill.name,
      description: capDescription(skill.description, DESCRIPTION_MAX_LENGTH),
    }))
    const incomplete = !snapshot.complete
    const digest = digestEntries(entries, incomplete)
    const history = catalogHistory(agent)
    const existing = catalogMessage(decision.messages)

    if (history.visibleDigest === digest) {
      return existing === undefined
        ? decision
        : {
            ...decision,
            messages: decision.messages.filter((message) => message.id !== existing.message.id),
          }
    }
    if (existing !== undefined && digestEntries(existing.entries, existing.incomplete) === digest) {
      return decision
    }
    if (!history.published && skills.length === 0 && !incomplete) {
      return existing === undefined
        ? decision
        : {
            ...decision,
            messages: decision.messages.filter((message) => message.id !== existing.message.id),
          }
    }

    const catalog = history.published
      ? renderUpdate(entries, incomplete)
      : renderInitial(entries, incomplete)
    report({
      event: 'publish',
      action: history.published ? 'replacement' : 'initial',
      complete: snapshot.complete,
      entries: entries.length,
      catalogChars: catalogChars(entries),
      allowlist: ALLOWLIST.length,
      digest,
    })
    return {
      ...decision,
      messages:
        existing === undefined
          ? [...decision.messages, catalog]
          : decision.messages.map((message) =>
              message.id === existing.message.id ? catalog : message,
            ),
    }
  }

  report({ event: 'mount', allowlist: ALLOWLIST, descriptionMaxLength: DESCRIPTION_MAX_LENGTH })
}

/* ── 目录消息 ─────────────────────────────────────────────────────────────── */

function renderInitial(entries, incomplete) {
  return createUserMessage({
    content: [
      {
        type: 'text',
        text: [
          '<system-reminder>',
          entries.length === 0
            ? 'No skills could be confirmed in this discovery attempt.'
            : 'A skill is a reusable set of task-specific instructions. The following skills are available in this session:',
          '',
          '<available_skills>',
          ...renderEntries(entries),
          '</available_skills>',
          '',
          ...(incomplete ? [INCOMPLETE_NOTICE, ''] : []),
          entries.length === 0
            ? 'Wait for an updated catalog before calling the `skill` tool. Do not infer skill instructions from an empty catalog.'
            : "If the user names a skill, or the task clearly matches a skill's description, call the `skill` tool with the exact skill name before taking task actions. Load all applicable skills, then follow their full instructions. This catalog contains summaries only; do not infer or follow a skill's instructions until it has been loaded.",
          'A user may also invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool again for that skill.',
          '</system-reminder>',
        ].join('\n'),
      },
    ],
    source: {
      kind: 'skill-catalog',
      form: 'catalog',
      entries,
      ...(incomplete ? { incomplete: true } : {}),
    },
  })
}

function renderUpdate(entries, incomplete) {
  const availability =
    entries.length === 0
      ? [
          incomplete
            ? 'No skills could be confirmed in this discovery attempt. Do not use names from earlier skill catalogs.'
            : 'No skills are currently available through the `skill` tool. Do not use names from earlier skill catalogs.',
          'A user may still invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool for it.',
        ]
      : [
          'Use only names in this replacement catalog. If the user names a listed skill, or the task clearly matches its description, call the `skill` tool with the exact name before acting.',
          'A user may also invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool again for that skill.',
        ]
  return createUserMessage({
    content: [
      {
        type: 'text',
        text: [
          '<system-reminder>',
          incomplete
            ? 'Skill discovery is incomplete. This catalog of currently available skills replaces every earlier available-skills list in this session:'
            : 'The available skill catalog changed. This complete catalog replaces every earlier available-skills list in this session:',
          '',
          '<available_skills>',
          ...renderEntries(entries),
          '</available_skills>',
          '',
          ...(incomplete ? [INCOMPLETE_NOTICE, ''] : []),
          ...availability,
          '</system-reminder>',
        ].join('\n'),
      },
    ],
    source: {
      kind: 'skill-catalog',
      form: 'catalog',
      update: true,
      entries,
      ...(incomplete ? { incomplete: true } : {}),
    },
  })
}

const renderEntries = (entries) =>
  entries.map((entry) => `- \`${entry.name}\`: ${escapeText(entry.description)}`)

export const catalogChars = (entries) =>
  entries.reduce((total, entry) => total + entry.description.length, 0) + 200

function capDescription(value, maxLength) {
  const normalized = value.replaceAll(/\s+/g, ' ').trim()
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 3)}...`
}

function digestEntries(entries, incomplete = false) {
  const canonical = entries.map((entry) => JSON.stringify([entry.name, entry.description])).join('\n')
  return createHash('sha256')
    .update(incomplete ? 'incomplete\n' : '')
    .update(canonical)
    .digest('hex')
}

function readEntries(source) {
  const entries = source?.entries
  if (!Array.isArray(entries)) return undefined
  const readable = []
  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null) return undefined
    const { name: entryName, description } = entry
    if (typeof entryName !== 'string' || entryName === '' || typeof description !== 'string') {
      return undefined
    }
    readable.push({ name: entryName, description })
  }
  return readable
}

function catalogHistory(agent) {
  const visible = new Set(agent.session.surface.nodes)
  let published = false
  for (let index = agent.session.seq - 1; index >= 0; index -= 1) {
    const event = agent.session.eventAt(index)
    if (event === undefined) {
      throw new Error(`skill catalog cannot read seq ${index} below the current Session length`)
    }
    if (event.type !== 'user/message' || event.data.source?.kind !== 'skill-catalog') continue
    const entries = readEntries(event.data.source)
    if (entries === undefined) continue
    const digest = digestEntries(entries, event.data.source.incomplete === true)
    published = true
    if (visible.has(event.seq ?? index)) return { visibleDigest: digest, published }
  }
  return { published }
}

function catalogMessage(messages) {
  for (const message of messages) {
    if (message.source?.kind !== 'skill-catalog') continue
    const entries = readEntries(message.source)
    if (entries !== undefined) {
      return { message, entries, incomplete: message.source.incomplete === true }
    }
  }
  return undefined
}

function invokedNames(messages) {
  const names = []
  for (const message of messages) {
    if (message.source?.kind !== 'user') continue
    for (const block of message.content) {
      if (block.type !== 'text') continue
      for (const match of block.text.matchAll(SKILL_GESTURE)) {
        const found = match[2]
        if (found !== undefined && !names.includes(found)) names.push(found)
      }
    }
  }
  return names
}