/**
 * 织音 · 设置页（浏览器半边）
 *
 * 只读第一版：把「模型此刻能看见什么、目录要花多少字符」摆出来。
 * 数据走宿主注册的同源只读路由 /zhiyin/state —— 第三方插件无法新增 Remote。
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-zhiyin-proto',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'zhiyin'

    const dictionary = {
      zh: {
        nav: '织音',
        title: '织音',
        subtitle: '让技能自由编组，让能力彼此协奏',
        refresh: '重新观测',
        loading: '正在观测…',
        failed: '观测失败：',
        takeoverOn: '开关已生效',
        takeoverOff: '未接管',
        takeoverHintOn: '已为在跑的会话挂上策略 provider，开关即时生效。',
        takeoverHintOff: '还没有在跑的会话；新会话出现后自动挂钩。',
        statTotal: '技能总数',
        statModel: '模型可用',
        statUser: '仅用户可用',
        statNeither: '仅内部可用',
        budget: '目录字符数',
        budgetOf: '（预算 8000）',
        scope: '观测范围',
        scopeOf: '个在跑的会话',
        complete: '观测完整',
        incomplete: '观测不完整（已列出确认到的部分）',
        search: '按名称或描述搜索',
        filterHint: '点一下只列这一类，再点一下回到全部',
        linkBadge: '软链',
        tabList: '技能列表',
        tabPacks: '技能包',
        packNew: '+ 新建技能包',
        packMembers: '管理成员',
        packMembersTitle: '选择成员',
        packEmpty: '还没有成员',
        packOn: '启用中',
        packOff: '已停用',
        packNamePlaceholder: '技能包名称',
        packImport: '导入 txt',
        importTitle: '导入技能包',
        importHint: '一行一个技能：目录名 | 来源 | owner/repo | 分支 | 子目录；# 开头的行会被忽略',
        importPathPlaceholder: 'txt 文件绝对路径',
        importTextPlaceholder: '或把 txt 内容粘到这里',
        importRun: '导入',
        selectAll: '全选',
        selectNone: '全不选',
        save: '保存',
        cancel: '取消',
        install: '安装技能',
        installHint: '填一个含 SKILL.md 的文件夹绝对路径；安装只新建目录，不会改写已有技能',
        installPath: '文件夹路径，如 D:\skills\my-skill',
        installName: '技能名（留空则用文件夹名）',
        installUser: '用户目录 ~/.dsh/skills',
        installProject: '项目 .dsh/skills',
        uninstall: '卸载',
        uninstallAsk: '卸载并把技能移入归档目录？',
        uninstallHint: '移入归档目录，可恢复',
        linkBadgeTitle: '符号链接，实体在 ',
        statBundled: '内置技能',
        sourceBundled: '内置',
        sourceCustom: '自定义目录',
        skillsMaster: '启用技能',
        skillsMasterHint: '关掉 = 一键全部停用：模型目录为空、/ 菜单也选不到；重新打开会恢复各技能自己的开关状态',
        reasonAllOff: '全部停用',
        empty: '没有匹配的技能',
        modelBadge: '模型',
        userBadge: '用户',
        internalBadge: '内部',
        next: '技能包与组合在下一版接入；这一版先让你看清现状。',
        agentsRoot: '加载 ~/.agents/skills',
        agentsRootHint: '关掉后 DSH 只看 ~/.dsh/skills 与项目技能',
        disabledBadge: '已停用',
        enabledBadge: '启用中',
        toggleFailed: '开关失败：',
        reasonManual: '手动停用',
        reasonPack: '技能包停用',
        reasonAgents: 'agents 开关关闭',
        toggleHint: '点开关立即生效',
      },
      en: {
        nav: 'Zhiyin',
        title: 'Zhiyin',
        subtitle: 'Group skills freely; let capabilities play together',
        refresh: 'Refresh',
        loading: 'Observing…',
        failed: 'Observation failed: ',
        takeoverOn: 'Switches live',
        takeoverOff: 'Not taken over',
        takeoverHintOn: 'Policy providers are mounted on running sessions; switches apply immediately.',
        takeoverHintOff: 'No running session yet; new sessions get the provider automatically.',
        statTotal: 'Skills',
        statModel: 'Model-invocable',
        statUser: 'User-only',
        statNeither: 'Internal only',
        budget: 'Catalog characters',
        budgetOf: '(budget 8000)',
        scope: 'Observed scopes',
        scopeOf: 'running sessions',
        complete: 'Observation complete',
        incomplete: 'Observation incomplete (confirmed subset listed)',
        search: 'Search name or description',
        filterHint: 'Click a card to list that group; click again for all',
        linkBadge: 'link',
        tabList: 'Skills',
        tabPacks: 'Packs',
        packNew: 'New pack',
        packMembers: 'Members',
        packMembersTitle: 'Pick members',
        packEmpty: 'No members yet',
        packOn: 'on',
        packOff: 'off',
        packNamePlaceholder: 'Pack name',
        packImport: 'Import txt',
        importTitle: 'Import pack',
        importHint: 'One skill per line: name | source | owner/repo | branch | subdir; lines starting with # are ignored',
        importPathPlaceholder: 'Absolute path to the txt file',
        importTextPlaceholder: 'Or paste the txt content here',
        importRun: 'Import',
        selectAll: 'All',
        selectNone: 'None',
        save: 'Save',
        cancel: 'Cancel',
        install: 'Install',
        installHint: 'Absolute path to a folder containing SKILL.md; install only creates a new directory',
        installPath: 'Folder path, e.g. D:\skills\my-skill',
        installName: 'Skill name (blank = folder name)',
        installUser: 'User ~/.dsh/skills',
        installProject: 'Project .dsh/skills',
        uninstall: 'Uninstall',
        uninstallAsk: 'Move this skill into the archive directory?',
        uninstallHint: 'Moves into the archive directory; recoverable',
        linkBadgeTitle: 'Symbolic link, real path: ',
        statBundled: 'Bundled',
        sourceBundled: 'bundled',
        sourceCustom: 'custom dir',
        skillsMaster: 'Skills on',
        skillsMasterHint: 'Off = disable every skill at once (empty model catalog, nothing in the / menu); turning it back on restores each skill own switch',
        reasonAllOff: 'all disabled',
        empty: 'No matching skills',
        modelBadge: 'model',
        userBadge: 'user',
        internalBadge: 'internal',
        next: 'Packs and scores land next; this version shows the current state.',
        agentsRoot: 'Load ~/.agents/skills',
        agentsRootHint: 'Off: DSH only reads ~/.dsh/skills and project skills',
        disabledBadge: 'disabled',
        enabledBadge: 'enabled',
        toggleFailed: 'Toggle failed: ',
        reasonManual: 'disabled manually',
        reasonPack: 'pack disabled',
        reasonAgents: 'agents switch off',
        toggleHint: 'Takes effect immediately',
      },
    }

    const css = {
      page: { padding: '4px 0 48px', color: 'inherit' },
      overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
      },
      modal: {
        width: 560,
        maxWidth: '92vw',
        maxHeight: '76vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--vscode-editorWidget-background, #252526)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
        boxShadow: '0 18px 48px rgba(0,0,0,0.45)',
        padding: 14,
        gap: 10,
      },
      modalHead: { display: 'flex', alignItems: 'center', gap: 8 },
      modalTitle: { fontSize: 13, fontWeight: 600, flex: '1 1 auto', minWidth: 0 },
      modalBody: {
        flex: '1 1 auto',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: 120,
      },
      modalFoot: { display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
      seg: {
        display: 'inline-flex',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 6,
        overflow: 'hidden',
      },
      segBtn: {
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        fontSize: 12,
        padding: '3px 10px',
        cursor: 'pointer',
        opacity: 0.7,
      },
      segBtnOn: { background: 'rgba(96,165,250,0.18)', opacity: 1, fontWeight: 600 },
      head: { display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
      title: { fontSize: 20, fontWeight: 600, margin: 0 },
      subtitle: { opacity: 0.6, fontSize: 13 },
      row: { display: 'flex', alignItems: 'center', columnGap: 10, rowGap: 8, flexWrap: 'wrap', marginTop: 14 },
      switchRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: 12.5,
        flex: '0 0 auto',
        userSelect: 'none',
      },
      track: {
        width: 32,
        height: 18,
        borderRadius: 999,
        background: 'rgba(128,128,128,0.35)',
        position: 'relative',
        transition: 'background 120ms',
        flex: '0 0 auto',
      },
      trackOn: { background: 'rgba(96,165,250,0.9)' },
      knob: {
        position: 'absolute',
        top: 2,
        left: 2,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 120ms',
      },
      knobOn: { left: 16 },
      help: {
        width: 15,
        height: 15,
        borderRadius: '50%',
        border: '1px solid currentColor',
        fontSize: 10,
        lineHeight: '13px',
        textAlign: 'center',
        opacity: 0.55,
        cursor: 'help',
        flex: '0 0 auto',
        userSelect: 'none',
      },
      pill: (on) => ({
        fontSize: 12,
        padding: '2px 10px',
        borderRadius: 999,
        border: '1px solid currentColor',
        opacity: on ? 1 : 0.55,
      }),
      hint: { fontSize: 12, opacity: 0.6 },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(104px, 1fr))',
        gap: 8,
        marginTop: 16,
      },
      card: {
        border: '1px solid rgba(128,128,128,0.28)',
        borderRadius: 10,
        padding: '8px 10px',
      },
      cardActive: { borderColor: 'rgba(96,165,250,0.85)' },
      statLabel: { fontSize: 12, opacity: 0.6 },
      statValue: { fontSize: 20, fontWeight: 600, marginTop: 2 },
      bar: {
        height: 6,
        borderRadius: 999,
        background: 'rgba(128,128,128,0.22)',
        overflow: 'hidden',
        marginTop: 8,
      },
      barFill: (pct) => ({
        height: '100%',
        width: `${Math.min(100, pct)}%`,
        background: pct > 100 ? '#d9534f' : pct > 80 ? '#e0a33e' : '#4a9d6a',
      }),
      input: {
        flex: '1 1 200px',
        minWidth: 160,
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid rgba(128,128,128,0.35)',
        background: 'transparent',
        color: 'inherit',
      },
      textarea: {
        flex: '1 1 auto',
        minHeight: 120,
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid rgba(128,128,128,0.35)',
        background: 'transparent',
        color: 'inherit',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        resize: 'vertical',
      },
      btn: {
        padding: '6px 12px',
        borderRadius: 8,
        border: '1px solid rgba(128,128,128,0.35)',
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
      },
      list: { marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 },
      item: {
        border: '1px solid rgba(128,128,128,0.16)',
        borderRadius: 10,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 56,
        background: 'rgba(128,128,128,0.035)',
      },
      iconBtn: {
        flex: '0 0 auto',
        width: 24,
        height: 24,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        border: '1px solid rgba(128,128,128,0.3)',
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
        fontSize: 13,
        opacity: 0.7,
      },
      itemMain: { flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
      itemHead: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
      name: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
        flex: '0 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      badge: (on) => ({
        fontSize: 10.5,
        padding: '0 5px',
        borderRadius: 999,
        border: '1px solid currentColor',
        opacity: on ? 0.9 : 0.3,
        lineHeight: '16px',
        flex: '0 0 auto',
      }),
      desc: {
        fontSize: 12,
        opacity: 0.6,
        lineHeight: 1.45,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      },
      meta: {
        fontSize: 11,
        opacity: 0.45,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      itemOff: { opacity: 0.55 },
      switch: { flex: '0 0 auto', cursor: 'pointer', width: 16, height: 16, accentColor: 'currentColor' },
    }

    function Switch({ label, hint, checked, disabled, onChange }) {
      return h(
        'label',
        { style: css.switchRow, title: hint ?? undefined },
        h(
          'span',
          { style: { ...css.track, ...(checked ? css.trackOn : null) } },
          h('span', { style: { ...css.knob, ...(checked ? css.knobOn : null) } }),
        ),
        h('span', null, label),
        h('input', { type: 'checkbox', checked, disabled, onChange, style: { display: 'none' } }),
        hint
          ? h(
              'span',
              {
                style: css.help,
                title: hint,
                onClick: (event) => {
                  event.preventDefault()
                  event.stopPropagation()
                },
                onMouseDown: (event) => {
                  event.preventDefault()
                  event.stopPropagation()
                },
              },
              '?',
            )
          : null,
      )
    }

    function Toggle({ checked, disabled, title, onChange }) {
      return h(
        'label',
        { style: { flex: '0 0 auto', cursor: 'pointer', display: 'inline-flex' }, title: title ?? undefined },
        h(
          'span',
          { style: { ...css.track, ...(checked ? css.trackOn : null) } },
          h('span', { style: { ...css.knob, ...(checked ? css.knobOn : null) } }),
        ),
        h('input', { type: 'checkbox', checked, disabled, onChange, style: { display: 'none' } }),
      )
    }

    function Page({ close, t }) {
      const say = React.useCallback(
        (key, fallback) => {
          const value = typeof t === 'function' ? t(key) : undefined
          return value && value !== key ? value : fallback
        },
        [t],
      )
      const [state, setState] = React.useState({ loading: true, data: null, error: null })
      const [query, setQuery] = React.useState('')
      const [filter, setFilter] = React.useState('all')
      const [busy, setBusy] = React.useState(false)
      const [tab, setTab] = React.useState('list')
      const [editing, setEditing] = React.useState(null)
      const [draftMembers, setDraftMembers] = React.useState([])
      const [memberQuery, setMemberQuery] = React.useState('')
      const [creating, setCreating] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [importText, setImportText] = React.useState('')
  const [importPath, setImportPath] = React.useState('')
  const [importName, setImportName] = React.useState('')
      const [installing, setInstalling] = React.useState(false)
      const [installPath, setInstallPath] = React.useState('')
      const [installName, setInstallName] = React.useState('')
      const [installTarget, setInstallTarget] = React.useState('user')
      const [draftName, setDraftName] = React.useState('')

      const load = React.useCallback(() => {
        setState((previous) => ({ ...previous, loading: true, error: null }))
        fetch('/zhiyin/state', { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response.json()
          })
          .then((data) => setState({ loading: false, data, error: null }))
          .catch((error) =>
            setState((previous) => ({
              loading: false,
              data: previous.data,
              error: String(error?.message ?? error),
            })),
          )
      }, [])

      const write = React.useCallback(
        (path, body) => {
          setBusy(true)
          return fetch(path, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
          })
            .then((response) => response.json())
            .then((result) => {
              if (!result || result.ok !== true) throw new Error(result?.error ?? 'rejected')
              load()
              return result
            })
            .catch((error) =>
              setState((previous) => ({
                ...previous,
                error: String(error?.message ?? error),
              })),
            )
            .finally(() => setBusy(false))
        },
        [load],
      )

      React.useEffect(() => {
        load()
      }, [load])

      const data = state.data

      // 「此刻 DSH 的技能世界」：总开关关掉时，~/.agents/skills 整组不属于它。
      const scoped = React.useMemo(() => {
        const all = data?.skills ?? []
        if (data?.agentsRoot === false) return all.filter((skill) => skill.source !== 'user-agents')
        return all
      }, [data])

      // 统计卡的数字按同一口径算，保证「四张卡相加 = 技能总数」。
      const counts = React.useMemo(() => {
        let model = 0
        let user = 0
        let both = 0
        let neither = 0
        for (const skill of scoped) {
          const m = skill.model === true
          const u = skill.user === true
          if (m) model += 1
          if (u) user += 1
          if (m && u) both += 1
          if (!m && !u) neither += 1
        }
        const bundled = scoped.filter((skill) => skill.source === 'bundled').length
        return { total: scoped.length, model, user, both, neither, bundled }
      }, [scoped])

      const skills = React.useMemo(() => {
        const needle = query.trim().toLowerCase()
        return scoped.filter((skill) => {
          if (filter === 'model' && !skill.model) return false
          if (filter === 'user' && !(skill.user && !skill.model)) return false
          if (filter === 'internal' && (skill.model || skill.user)) return false
          if (filter === 'bundled' && skill.source !== 'bundled') return false
          if (needle === '') return true
          return (
            skill.name.toLowerCase().includes(needle) ||
            (skill.description ?? '').toLowerCase().includes(needle)
          )
        })
      }, [scoped, query, filter])

      const pct = data ? Math.round((data.catalogChars / data.budgetChars) * 100) : 0
      const sourceLabel = (skill) => {
        const root = skill.root
          ? skill.root.replace(/^[A-Za-z]:\\Users\\[^\\]+\\/, '~/').replace(/\\/g, '/')
          : null
        if (root) return root
        if (skill.source === 'bundled') return say('sourceBundled', '内置')
        if (skill.source === 'custom') return say('sourceCustom', '自定义目录')
        return skill.source
      }
      const reasonLabel = (reason) => {
        if (reason === 'manual') return say('reasonManual', '手动停用')
        if (reason === 'pack') return say('reasonPack', '技能包停用')
        if (reason === 'agents-root') return say('reasonAgents', 'agents 开关关闭')
        if (reason === 'all-off') return say('reasonAllOff', '全部停用')
        return ''
      }

      return h(
        'div',
        { style: css.page },
        h(
          'div',
          { style: css.head },
          h('h2', { style: css.title }, say('title', '织音')),
          h('span', { style: css.subtitle }, say('subtitle', '让技能自由编组，让能力彼此协奏')),
        ),

        data
          ? h(
              'div',
              { style: css.row },
              h(
                'span',
                { style: css.pill(data.takeover?.visible) },
                data.takeover?.visible ? say('takeoverOn', '已接管') : say('takeoverOff', '未接管'),
              ),
              h(
                'span',
                { style: css.hint },
                data.takeover?.visible
                  ? say('takeoverHintOn', '当前会话的技能目录由织音发布。')
                  : say('takeoverHintOff', '当前会话仍由 DSH 默认消费者发布目录；设置页只做观测。'),
              ),
            )
          : null,

        state.error
          ? h('p', { style: { ...css.hint, marginTop: 12 } }, `${say('failed', '观测失败：')}${state.error}`)
          : null,

        data
          ? h(
              'div',
              { style: css.grid },
              statCards(data, counts, say, filter, setFilter),
              h(
                'div',
                { style: css.card },
                h('div', { style: css.statLabel }, say('budget', '目录字符数')),
                h(
                  'div',
                  { style: css.statValue },
                  String(data.catalogChars),
                  h('span', { style: { fontSize: 12, opacity: 0.55, marginLeft: 6 } }, `/ ${data.budgetChars}`),
                ),
                h('div', { style: css.bar }, h('div', { style: css.barFill(pct) })),
                h(
                  'div',
                  { style: { ...css.statLabel, marginTop: 6 } },
                  data.complete ? say('complete', '观测完整') : say('incomplete', '观测不完整（已列出确认到的部分）'),
                ),
              ),
            )
          : null,

        data
          ? h(
              'div',
              { style: { ...css.row, justifyContent: 'space-between' } },
              h(
                'div',
                { style: css.seg },
                h('button', { type: 'button', style: tab === 'list' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('list') }, say('tabList', '技能列表')),
                h('button', { type: 'button', style: tab === 'packs' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('packs') }, say('tabPacks', '技能包')),
              ),
              tab === 'packs'
                ? h('span', { style: { display: 'inline-flex', gap: 6 } },
                    h('button', { type: 'button', style: css.btn, onClick: () => { setDraftName(''); setCreating(true) }, disabled: busy }, say('packNew', '+ 新建技能包')),
                    h('button', { type: 'button', style: css.btn, onClick: () => { setImportText(''); setImportPath(''); setImportName(''); setImporting(true) }, disabled: busy }, say('packImport', '导入 txt')),
                  )
                : null,
              tab === 'list' ? h('input', {
                style: css.input,
                value: query,
                placeholder: say('search', '按名称或描述搜索'),
                onChange: (event) => setQuery(event.target.value),
              }) : null,
              h(Switch, {
                label: say('agentsRoot', '启用 .agents 技能目录'),
                hint: say('agentsRootHint', '开启后，智能体将自动加载 .agents/skills 路径下的自定义技能'),
                checked: data.agentsRoot !== false,
                disabled: busy,
                onChange: () => write('/zhiyin/settings', { agentsRoot: data.agentsRoot === false }),
              }),
              h(Switch, {
                label: say('skillsMaster', '启用技能'),
                hint: say('skillsMasterHint', '关掉 = 一键全部停用：模型目录为空、/ 菜单也选不到；重新打开会恢复各技能自己的开关状态'),
                checked: data.allOff !== true,
                disabled: busy,
                onChange: () => write('/zhiyin/settings', { allOff: data.allOff !== true }),
              }),
              h(
                'button',
                {
                  type: 'button',
                  style: css.btn,
                  disabled: busy,
                  onClick: () => {
                    setInstallPath('')
                    setInstallName('')
                    setInstallTarget('user')
                    setInstalling(true)
                  },
                },
                say('install', '安装技能'),
              ),
              h(
                'button',
                { type: 'button', style: css.btn, onClick: load, disabled: state.loading },
                state.loading ? say('loading', '正在观测…') : say('refresh', '重新观测'),
              ),
            )
          : null,

        data && tab === 'packs'
          ? h(
              'div',
              { style: css.list },
              (data.packs ?? []).length === 0
                ? h('div', { style: css.hint }, say('packEmptyHint', '还没有技能包；点右上角新建，再把技能勾进来'))
                : null,
              (data.packs ?? []).map((pack) =>
                h(
                  'div',
                  { key: pack.id, style: css.item },
                  h(Toggle, {
                    checked: pack.enabled !== false,
                    disabled: busy,
                    title: pack.enabled === false ? say('packOff', '已停用') : say('packOn', '启用中'),
                    onChange: () => write('/zhiyin/pack', { action: 'toggle', id: pack.id, enabled: pack.enabled === false }),
                  }),
                  h(
                    'div',
                    { style: css.itemMain },
                    h(
                      'div',
                      { style: css.itemHead },
                      h('span', { style: css.name }, pack.name),
                      h('span', { style: css.badge(true) }, `${pack.members?.length ?? 0} 个技能`),
                      h('span', { style: { ...css.hint, marginLeft: 'auto' } }, pack.enabled === false ? say('packOff', '已停用') : say('packOn', '启用中')),
                    ),
                    pack.members?.length
                      ? h('div', { style: css.desc }, pack.members.join(' · '))
                      : h('div', { style: css.desc }, say('packEmpty', '还没有成员')),
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.btn,
                      disabled: busy,
                      onClick: () => {
                        setDraftMembers(pack.members ?? [])
                        setMemberQuery('')
                        setEditing(pack.id)
                      },
                    },
                    say('packMembers', '管理成员'),
                  ),
                  h(
                    'button',
                    { type: 'button', style: css.iconBtn, title: say('packDelete', '删除技能包'), onClick: () => write('/zhiyin/pack', { action: 'delete', id: pack.id }), disabled: busy },
                    '×',
                  ),
                ),
              ),
            )
          : null,

        data && tab === 'list'
          ? h(
              'div',
              { style: css.list },
              skills.length === 0
                ? h('div', { style: css.hint }, say('empty', '没有匹配的技能'))
                : skills.map((skill) =>
                    h(
                      'div',
                      {
                        key: skill.name,
                        style: skill.enabled === false ? { ...css.item, ...css.itemOff } : css.item,
                        title: skill.linkTarget ?? skill.logicalPath ?? skill.path ?? undefined,
                      },
                      h(Toggle, {
                        checked: skill.enabled !== false,
                        disabled: busy,
                        title: skill.hiddenReason
                          ? reasonLabel(skill.hiddenReason)
                          : say('toggleHint', '点开关立即生效'),
                        onChange: () =>
                          write('/zhiyin/skill', {
                            name: skill.name,
                            enabled: skill.enabled === false,
                            description: skill.description,
                            source: skill.source,
                          }),
                      }),
                      skill.source === 'user-dsh' || skill.source === 'user-agents'
                        ? h(
                            'button',
                            {
                              type: 'button',
                              title: say('uninstallHint', '移入归档目录，可恢复'),
                              style: css.iconBtn,
                              disabled: busy,
                              onClick: () => {
                                if (window.confirm(say('uninstallAsk', '卸载并把技能移入归档目录？') + ' ' + skill.name)) {
                                  write('/zhiyin/uninstall', { name: skill.name })
                                }
                              },
                            },
                            '⤓',
                          )
                        : null,
                      h(
                        'div',
                        { style: css.itemMain },
                        h(
                          'div',
                          { style: css.itemHead },
                          h('span', { style: css.name }, skill.name),
                        skill.enabled === false
                          ? h('span', { style: css.badge(true) }, say('disabledBadge', '已停用'))
                          : null,
                        h('span', { style: css.badge(skill.model) }, say('modelBadge', '模型')),
                        h('span', { style: css.badge(skill.user) }, say('userBadge', '用户')),
                        !skill.model && !skill.user
                          ? h('span', { style: css.badge(true) }, say('internalBadge', '内部'))
                          : null,
                        skill.linkTarget
                          ? h(
                              'span',
                              {
                                style: css.badge(false),
                                title: `${say('linkBadgeTitle', '符号链接，实体在')}${skill.linkTarget}`,
                              },
                              say('linkBadge', '软链'),
                            )
                          : null,
                        h(
                          'span',
                          { style: { ...css.hint, marginLeft: 'auto' } },
                          sourceLabel(skill),
                        ),
                      ),
                        skill.description
                          ? h('div', { style: css.desc }, skill.description)
                          : null,
                      ),
                    ),
                  ),
            )
          : h('p', { style: { ...css.hint, marginTop: 12 } }, say('loading', '正在观测…')),

        editing
          ? (function renderEditor() {
              const pack = (data.packs ?? []).find((candidate) => candidate.id === editing)
              if (!pack) return null
              const needle = memberQuery.trim().toLowerCase()
              const pool = scoped.filter(
                (skill) => needle === '' || skill.name.toLowerCase().includes(needle),
              )
              return h(
                'div',
                { style: css.overlay },
                h(
                  'div',
                  { style: css.modal },
                  h(
                    'div',
                    { style: css.modalHead },
                    h('span', { style: css.modalTitle }, pack.name + ' · ' + say('packMembersTitle', '选择成员')),
                    h('button', { type: 'button', style: css.btn, onClick: () => setEditing(null) }, '×'),
                  ),
                  h('input', {
                    style: css.input,
                    value: memberQuery,
                    placeholder: say('search', '按名称搜索'),
                    onChange: (event) => setMemberQuery(event.target.value),
                  }),
                  h(
                    'div',
                    { style: css.modalBody },
                    pool.map((skill) =>
                      h(
                        'label',
                        { key: skill.name, style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '2px 0' } },
                        h('input', {
                          type: 'checkbox',
                          style: css.switch,
                          checked: draftMembers.includes(skill.name),
                          onChange: () =>
                            setDraftMembers((previous) =>
                              previous.includes(skill.name)
                                ? previous.filter((name) => name !== skill.name)
                                : [...previous, skill.name],
                            ),
                        }),
                        h('span', { style: css.name }, skill.name),
                        h('span', { style: { ...css.hint, marginLeft: 'auto' } }, sourceLabel(skill)),
                      ),
                    ),
                  ),
                  h(
                    'div',
                    { style: css.modalFoot },
                    h('button', { type: 'button', style: css.btn, onClick: () => setDraftMembers(pool.map((skill) => skill.name)) }, say('selectAll', '全选')),
                    h('button', { type: 'button', style: css.btn, onClick: () => setDraftMembers([]) }, say('selectNone', '全不选')),
                    h(
                      'button',
                      {
                        type: 'button',
                        style: css.btn,
                        disabled: busy,
                        onClick: () => {
                          write('/zhiyin/pack', { action: 'members', id: editing, members: draftMembers })
                          setEditing(null)
                        },
                      },
                      say('save', '保存'),
                    ),
                  ),
                ),
              )
            })()
          : null,

        creating
          ? h(
              'div',
              { style: css.overlay },
              h(
                'div',
                { style: css.modal },
                h('div', { style: css.modalHead }, h('span', { style: css.modalTitle }, say('packNew', '新建技能包'))),
                h('input', {
                  style: css.input,
                  value: draftName,
                  placeholder: say('packNamePlaceholder', '技能包名称'),
                  onChange: (event) => setDraftName(event.target.value),
                }),
                h(
                  'div',
                  { style: css.modalFoot },
                  h('button', { type: 'button', style: css.btn, onClick: () => setCreating(false) }, say('cancel', '取消')),
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.btn,
                      disabled: busy || draftName.trim() === '',
                      onClick: () => {
                        write('/zhiyin/pack', { action: 'create', name: draftName.trim() })
                        setCreating(false)
                      },
                    },
                    say('save', '保存'),
                  ),
                ),
              ),
            )
          : null,

        installing
          ? h(
              'div',
              { style: css.overlay },
              h(
                'div',
                { style: css.modal },
                h('div', { style: css.modalHead }, h('span', { style: css.modalTitle }, say('install', '安装技能'))),
                h('p', { style: css.hint }, say('installHint', '填一个含 SKILL.md 的文件夹绝对路径；安装只新建目录，不会改写已有技能')),
                h('input', {
                  style: css.input,
                  value: installPath,
                  placeholder: say('installPath', '文件夹路径，如 D:\\skills\\my-skill'),
                  onChange: (event) => setInstallPath(event.target.value),
                }),
                h('input', {
                  style: css.input,
                  value: installName,
                  placeholder: say('installName', '技能名（留空则用文件夹名）'),
                  onChange: (event) => setInstallName(event.target.value),
                }),
                h(
                  'div',
                  { style: { display: 'flex', gap: 12, fontSize: 12, alignItems: 'center' } },
                  h('label', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                    h('input', {
                      type: 'radio',
                      checked: installTarget === 'user',
                      onChange: () => setInstallTarget('user'),
                    }),
                    say('installUser', '用户目录 ~/.dsh/skills'),
                  ),
                  h('label', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                    h('input', {
                      type: 'radio',
                      checked: installTarget === 'project',
                      onChange: () => setInstallTarget('project'),
                    }),
                    say('installProject', '项目 .dsh/skills'),
                  ),
                ),
                h(
                  'div',
                  { style: css.modalFoot },
                  h('button', { type: 'button', style: css.btn, onClick: () => setInstalling(false) }, say('cancel', '取消')),
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.btn,
                      disabled: busy || installPath.trim() === '',
                      onClick: () => {
                        write('/zhiyin/install', {
                          path: installPath.trim(),
                          name: installName.trim(),
                          target: installTarget,
                        })
                        setInstalling(false)
                      },
                    },
                    say('install', '安装技能'),
                  ),
                ),
              ),
            )
          : null,

        importing
          ? h(
              'div',
              { style: css.overlay },
              h(
                'div',
                { style: css.modal },
                h('div', { style: css.modalHead }, h('span', { style: css.modalTitle }, say('importTitle', '导入技能包'))),
                h('div', { style: css.hint }, say('importHint', '支持 AI Vault 导出的技能包 txt：每行「目录名 | 来源 | owner/repo | 分支 | 子目录」，# 开头的行会被忽略。')),
                h('input', {
                  style: css.input,
                  value: importName,
                  placeholder: say('packNamePlaceholder', '技能包名称（留空用文件里的名字）'),
                  onChange: (event) => setImportName(event.target.value),
                }),
                h('input', {
                  style: css.input,
                  value: importPath,
                  placeholder: say('importPathPlaceholder', 'txt 文件绝对路径，例如 D:\\packs\\mattpocock.txt'),
                  onChange: (event) => setImportPath(event.target.value),
                }),
                h('textarea', {
                  style: css.textarea,
                  value: importText,
                  placeholder: say('importTextPlaceholder', '或者直接把 txt 内容粘到这里'),
                  onChange: (event) => setImportText(event.target.value),
                }),
                h(
                  'div',
                  { style: css.modalFoot },
                  h('button', { type: 'button', style: css.btn, onClick: () => setImporting(false) }, say('cancel', '取消')),
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.btn,
                      disabled: busy || (importPath.trim() === '' && importText.trim() === ''),
                      onClick: () => {
                        write('/zhiyin/pack', {
                          action: 'import',
                          path: importPath.trim() || undefined,
                          text: importText.trim() || undefined,
                          name: importName.trim() || undefined,
                        })
                        setImporting(false)
                      },
                    },
                    say('importRun', '导入'),
                  ),
                ),
              ),
            )
          : null,

        h('p', { style: { ...css.hint, marginTop: 18 } }, say('next', '组合在下一版；技能包整组开关即可切换场景。')),
      )
    }

    function statCards(data, counts, say, filter, setFilter) {
      const items = [
        { key: 'statTotal', label: '技能总数', value: counts.total, filter: 'all' },
        { key: 'statModel', label: '模型可用', value: counts.model, filter: 'model' },
        {
          key: 'statUser',
          label: '仅用户可用',
          value: Math.max(0, counts.user - counts.both),
          filter: 'user',
        },
        { key: 'statNeither', label: '仅内部可用', value: counts.neither, filter: 'internal' },
        { key: 'statBundled', label: '内置技能', value: counts.bundled, filter: 'bundled' },
      ]
      return items.map((item) => {
        const active = filter === item.filter
        return h(
          'button',
          {
            key: item.key,
            type: 'button',
            title: say('filterHint', '点一下只列这一类，再点一下回到全部'),
            onClick: () => setFilter(active ? 'all' : item.filter),
            style: {
              ...css.card,
              ...(active ? css.cardActive : null),
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
              background: active ? 'rgba(96,165,250,0.12)' : 'transparent',
              font: 'inherit',
            },
          },
          h('div', { style: css.statLabel }, say(item.key, item.label)),
          h('div', { style: css.statValue }, String(item.value)),
        )
      })
    }

    function NavIcon({ size, active }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          'aria-hidden': true,
          opacity: active ? 1 : 0.72,
        },
        h('path', {
          d: 'M6 12.2V4.4l5.2-1.6v7.4',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
        h('circle', { cx: 4.6, cy: 12.2, r: 1.6, fill: 'currentColor' }),
        h('circle', { cx: 9.8, cy: 10.4, r: 1.6, fill: 'currentColor' }),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.locale.register(NS, dictionary)
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            {
              name: 'settings.section',
              id: 'zhiyin',
              order: 30,
              label: () => ctx.locale.bind(NS)('nav'),
              locale: NS,
            },
            Page,
          ),
        )
        ctx.slots.inject('settings.section.icon', () =>
          ctx.slots.register(
            { name: 'settings.section.icon', id: 'zhiyin' },
            NavIcon,
          ),
        )
      },
    }
  },
})