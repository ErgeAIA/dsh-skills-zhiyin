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
        packDeleteAsk: '删除技能包？包内技能不会被卸载。',
        packOn: '启用中',
        packOff: '已停用',
        packNamePlaceholder: '技能包名称',
        packImport: '导入 txt',
        searchPacks: '搜技能包名或成员',
        metaBoth: '模型 · 用户',
        metaModel: '仅模型',
        metaUser: '仅用户',
        metaInternal: '内部',
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
        agentsRootHintShort: '开启后读取 ~/.agents/skills 与 ~/.dsh/skills 的合集；关闭后只读 ~/.dsh/skills 与项目技能',
        disabledBadge: '已停用',
        enabledBadge: '启用中',
        toggleFailed: '开关失败：',
        reasonManual: '手动停用',
        reasonPack: '技能包停用',
        reasonAgents: 'agents 开关关闭',
        toggleHint: '点开关立即生效',
        exportConfig: '导出配置',
        exportConfigHint: '导出一份可移植的 JSON 配置（技能包 / 停用项）',
        exportConfigFailed: '导出失败：',
        importConfig: '导入配置',
        importConfigHint: '粘贴此前导出的 JSON 覆盖当前配置；旧配置会自动备份',
        importConfigHint2: '粘贴此前「导出配置」得到的 JSON。导入会覆盖当前的技能包与停用项；旧配置会先自动备份到插件状态目录。',
        importConfigPlaceholder: '{\n  "schemaVersion": 1,\n  "packs": []\n}',
        importConfigRun: '导入',
        importConfigOk: '导入完成',
        importConfigBadJson: '不是合法的 JSON',
        importConfigMissing: '个成员未安装',
        packUnit: '个技能包',
        observedAt: '观测于',
        masterDisable: '全部停用',
        masterEnable: '全部启用',
        masterDisableHint: '一键全部停用：模型目录为空、/ 菜单也选不到',
        masterEnableHint: '恢复各技能自己的开关状态',
        viewCards: '卡片',
        viewList: '列表',
        sortBy: '排序',
        sortName: '名称',
        sortSource: '来源',
        sortChars: '字符数',
        sortEnabled: '启用状态',
        packAllOn: '全部启用',
        packAllOff: '全部停用',
        packPartial: '部分启用',
        packGhost: '未安装',
        packMore: '更多操作',
        packRename: '改名',
        packCopy: '复制',
        packDelete: '删除',
        packEmptyHint: '还没有技能包；点右上角新建，再把技能勾进来',
        packEmptyHint2: '还没有成员',
        packNoMatch: '没有匹配技能包',
        packNameRule: '1–40 个字符；仅限中文、字母、数字、空格、下划线、连字符',
        alertBudget: '目录字符数已超出预算',
        alertConflict: '同名技能冲突',
        alertFrom: '个来源',
        alertGhost: '技能包引用了未安装技能',
        close: '关闭',
        enabled: '已启用',
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
        packDeleteAsk: 'Delete this pack? Its skills stay installed.',
        packOn: 'on',
        packOff: 'off',
        packNamePlaceholder: 'Pack name',
        packImport: 'Import txt',
        searchPacks: 'Search packs or members',
        metaBoth: 'model · user',
        metaModel: 'model only',
        metaUser: 'user only',
        metaInternal: 'internal',
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
        agentsRootHintShort: 'On: reads ~/.agents/skills and ~/.dsh/skills together; off: only ~/.dsh/skills and project skills',
        disabledBadge: 'disabled',
        enabledBadge: 'enabled',
        toggleFailed: 'Toggle failed: ',
        reasonManual: 'disabled manually',
        reasonPack: 'pack disabled',
        reasonAgents: 'agents switch off',
        toggleHint: 'Takes effect immediately',
        exportConfig: 'Export config',
        exportConfigHint: 'Download a portable JSON snapshot (packs / disabled items)',
        exportConfigFailed: 'Export failed: ',
        importConfig: 'Import config',
        importConfigHint: 'Paste a previously exported JSON to overwrite the current config; the old one is backed up first',
        importConfigHint2: 'Paste the JSON you exported earlier. Importing overwrites the current packs and disabled items; the old config is backed up into the plugin state directory first.',
        importConfigPlaceholder: '{\n  "schemaVersion": 1,\n  "packs": []\n}',
        importConfigRun: 'Import',
        importConfigOk: 'Import done',
        importConfigBadJson: 'Not valid JSON',
        importConfigMissing: 'members are not installed',
        packUnit: 'packs',
        observedAt: 'Observed at',
        masterDisable: 'Disable all',
        masterEnable: 'Enable all',
        masterDisableHint: 'Disable everything at once: empty model catalog, nothing in the / menu',
        masterEnableHint: 'Restore each skill own switch',
        viewCards: 'Cards',
        viewList: 'List',
        sortBy: 'Sort',
        sortName: 'Name',
        sortSource: 'Source',
        sortChars: 'Characters',
        sortEnabled: 'Enabled state',
        packAllOn: 'All enabled',
        packAllOff: 'All disabled',
        packPartial: 'Partly enabled',
        packGhost: 'not installed',
        packMore: 'More actions',
        packRename: 'Rename',
        packCopy: 'Duplicate',
        packDelete: 'Delete',
        packEmptyHint: 'No packs yet; create one at the top right, then tick skills into it',
        packEmptyHint2: 'No members yet',
        packNoMatch: 'No matching pack',
        packNameRule: '1-40 characters; letters, digits, spaces, underscore and hyphen only',
        alertBudget: 'Catalog characters exceed the budget',
        alertConflict: 'Duplicate skill names',
        alertFrom: 'sources',
        alertGhost: 'Pack references skills that are not installed',
        close: 'Close',
        enabled: 'Enabled',
      },
    }

    const css = {
      page: { maxWidth: 780, padding: '2px 0 48px', color: 'inherit' },
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
        border: 'none',
        borderRadius: 10,
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
        borderRadius: 10,
        border: '1px solid rgba(128,128,128,0.14)',
        background: 'rgba(128,128,128,0.04)',
        overflow: 'hidden',
        flex: '0 0 auto',
      },
      segBtn: {
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        fontSize: 12.5,
        padding: '6px 14px',
        cursor: 'pointer',
        opacity: 0.62,
      },
      segBtnOn: {
        background: 'rgba(224,116,60,0.16)',
        color: 'var(--zhiyin-accent, #e0743c)',
        opacity: 1,
        fontWeight: 600,
      },
      head: { display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
      headActions: {
        marginLeft: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      },
      title: { fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' },
      subtitle: { opacity: 0.6, fontSize: 13 },
      row: { display: 'flex', alignItems: 'center', columnGap: 10, rowGap: 8, flexWrap: 'wrap', marginTop: 18 },
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
        width: 36,
        height: 20,
        borderRadius: 999,
        background: 'rgba(128,128,128,0.22)',
        position: 'relative',
        transition: 'background 120ms',
        flex: '0 0 auto',
      },
      trackOn: { background: 'var(--zhiyin-accent, #e0743c)' },
      knob: {
        position: 'absolute',
        top: 2,
        left: 2,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.35)',
        transition: 'left 120ms',
      },
      knobOn: { left: 18 },
      help: {
        width: 15,
        height: 15,
        borderRadius: '50%',
        background: 'rgba(128,128,128,0.18)',
        fontSize: 10,
        lineHeight: '13px',
        textAlign: 'center',
        opacity: 0.55,
        cursor: 'help',
        flex: '0 0 auto',
        userSelect: 'none',
      },
      pill: (on) => ({
        fontSize: 11.5,
        padding: '2px 10px',
        borderRadius: 999,
        border: 'none',
        background: on ? 'rgba(224,116,60,0.16)' : 'rgba(128,128,128,0.14)',
        color: on ? 'var(--zhiyin-accent, #e0743c)' : 'inherit',
        opacity: on ? 1 : 0.6,
        flex: '0 0 auto',
      }),
      hint: { fontSize: 12, opacity: 0.6 },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))',
        gap: 8,
        marginTop: 18,
      },
      card: {
        borderRadius: 12,
        padding: '10px 12px',
        background: 'rgba(128,128,128,0.05)',
        border: '1px solid rgba(128,128,128,0.12)',
        transition: 'background 120ms, border-color 120ms',
      },
      cardActive: {
        background: 'rgba(128,128,128,0.16)',
        borderColor: 'var(--zhiyin-accent, #e0743c)',
      },
      statLabel: { fontSize: 11.5, opacity: 0.62 },
      statValue: { fontSize: 19, fontWeight: 600, marginTop: 3, lineHeight: 1.2 },

      group: {
        marginTop: 18,
        borderRadius: 12,
        border: '1px solid rgba(128,128,128,0.12)',
        background: 'rgba(128,128,128,0.035)',
        overflow: 'hidden',
      },
      groupRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 14px',
        borderBottom: '1px solid rgba(128,128,128,0.10)',
      },
      groupRowLast: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 14px',
      },
      groupMain: { flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 },
      groupTitle: { fontSize: 13, fontWeight: 500 },
      groupDesc: { fontSize: 12, opacity: 0.58, lineHeight: 1.45 },
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
      budgetRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: '0 2px',
      },
      budgetLabel: { fontSize: 11.5, opacity: 0.55, flex: '0 0 auto' },
      budgetNum: { fontSize: 12, fontWeight: 600, flex: '0 0 auto' },
      budgetCap: { fontSize: 11, opacity: 0.45, fontWeight: 400 },
      budgetTrack: {
        flex: '1 1 auto',
        height: 4,
        borderRadius: 999,
        background: 'rgba(128,128,128,0.18)',
        overflow: 'hidden',
        minWidth: 80,
      },
      budgetFill: (pct) => ({
        display: 'block',
        height: '100%',
        width: `${Math.min(100, pct)}%`,
        background: pct > 100 ? '#d9534f' : pct > 80 ? '#e0a33e' : 'rgba(128,128,128,0.55)',
      }),
      input: {
        flex: '1 1 220px',
        minWidth: 160,
        padding: '7px 12px',
        borderRadius: 10,
        border: '1px solid rgba(128,128,128,0.14)',
        background: 'rgba(128,128,128,0.05)',
        color: 'inherit',
        fontSize: 13,
      },
      field: {
        flex: '0 0 auto',
        width: '100%',
        boxSizing: 'border-box',
        padding: '7px 12px',
        borderRadius: 10,
        border: '1px solid rgba(128,128,128,0.14)',
        background: 'rgba(128,128,128,0.05)',
        color: 'inherit',
        fontSize: 13,
      },
      modalSm: { width: 420 },
      modalMd: { width: 520 },
      textarea: {
        flex: '1 1 auto',
        minHeight: 120,
        padding: '6px 10px',
        borderRadius: 8,
        border: 'none',
        background: 'rgba(128,128,128,0.12)',
        color: 'inherit',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        resize: 'vertical',
      },
      btn: {
        padding: '6px 14px',
        borderRadius: 10,
        border: '1px solid rgba(128,128,128,0.16)',
        background: 'transparent',
        color: 'inherit',
        fontSize: 12.5,
        cursor: 'pointer',
      },
      list: { marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 },
      item: {
        borderRadius: 12,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 62,
        background: 'rgba(128,128,128,0.045)',
        border: '1px solid rgba(128,128,128,0.10)',
      },
      iconBtn: {
        flex: '0 0 auto',
        width: 30,
        height: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: 'none',
        background: 'rgba(128,128,128,0.10)',
        color: 'inherit',
        cursor: 'pointer',
        fontSize: 13,
        opacity: 0.7,
      },
      itemMain: { flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
      itemHead: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
      name: {
        fontFamily: 'inherit',
        fontSize: 13.5,
        fontWeight: 600,
        flex: '0 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      badge: (on) => ({
        fontSize: 10.5,
        padding: '0 6px',
        borderRadius: 999,
        border: 'none',
        background: 'rgba(128,128,128,0.16)',
        opacity: on ? 0.95 : 0.3,
        lineHeight: '17px',
        flex: '0 0 auto',
      }),
      badgeWarn: {
        fontSize: 10.5,
        padding: '0 6px',
        borderRadius: 999,
        border: 'none',
        background: 'rgba(200,120,60,0.22)',
        lineHeight: '17px',
        flex: '0 0 auto',
      },
      metaText: { fontSize: 10.5, opacity: 0.5, flex: '0 0 auto', letterSpacing: '0.02em' },
      desc: {
        fontSize: 12.5,
        opacity: 0.62,
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

      // 元信息条（版本 · 观测时间 ｜ 右侧主按钮）
      metaBar: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        fontSize: 11.5,
        opacity: 0.62,
        flexWrap: 'wrap',
      },
      metaDot: { opacity: 0.5 },
      primaryBtn: {
        marginLeft: 'auto',
        padding: '5px 14px',
        borderRadius: 8,
        border: '1px solid var(--zhiyin-accent, #e0743c)',
        background: 'rgba(224,116,60,0.16)',
        color: 'var(--zhiyin-accent, #e0743c)',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
      },
      // 告警区（内容之上、点名具体对象）
      alertWrap: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 },
      alertItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 10,
        border: '1px solid rgba(224,163,62,0.35)',
        background: 'rgba(224,163,62,0.10)',
        fontSize: 12.5,
        lineHeight: 1.45,
      },
      alertIcon: { flex: '0 0 auto', opacity: 0.8, marginTop: 1 },
      // 工具条（卡片/列表 分段 · 搜索 · 排序）
      toolbar: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' },
      sortWrap: { display: 'inline-flex', alignItems: 'center', gap: 6, flex: '0 0 auto', fontSize: 12, opacity: 0.8 },
      sortSelect: {
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid rgba(128,128,128,0.14)',
        background: 'rgba(128,128,128,0.05)',
        color: 'inherit',
        fontSize: 12.5,
      },
      // 技能卡网格
      cardGrid: {
        marginTop: 12,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 10,
      },
      skillCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderRadius: 12,
        padding: '12px 14px',
        background: 'rgba(128,128,128,0.045)',
        border: '1px solid rgba(128,128,128,0.10)',
      },
      cardHead: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
      cardName: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
        fontWeight: 600,
        flex: '0 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      cardDesc: {
        fontSize: 12,
        opacity: 0.6,
        lineHeight: 1.45,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: 34,
      },
      cardFoot: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' },
      dot: (on) => ({
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: on ? '#4a9d6a' : 'rgba(128,128,128,0.5)',
        flex: '0 0 auto',
      }),
      // 技能包行尾 … 菜单
      menuWrap: { position: 'relative', flex: '0 0 auto' },
      menu: {
        position: 'absolute',
        right: 0,
        top: 34,
        zIndex: 20,
        minWidth: 132,
        padding: 4,
        borderRadius: 10,
        border: '1px solid rgba(128,128,128,0.16)',
        background: 'var(--vscode-editorWidget-background, #252526)',
        boxShadow: '0 10px 26px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
      },
      menuItem: {
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        textAlign: 'left',
        padding: '7px 10px',
        borderRadius: 7,
        fontSize: 12.5,
        cursor: 'pointer',
      },
    }

    const ICONS = {
  users: [
    ['path', 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'],
    ['circle', { cx: 9, cy: 7, r: 4 }],
    ['path', 'M22 21v-2a4 4 0 0 0-3-3.87'],
    ['path', 'M16 3.13a4 4 0 0 1 0 7.75'],
  ],
  archive: [
    ['rect', { x: 3, y: 4, width: 18, height: 5, rx: 1 }],
    ['path', 'M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9'],
    ['path', 'M10 13h4'],
  ],
  close: [
    ['path', 'M18 6 6 18'],
    ['path', 'm6 6 12 12'],
  ],
  trash: [
    ['path', 'M4 7h16'],
    ['path', 'M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
    ['path', 'M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12'],
    ['path', 'M10 11v5'],
    ['path', 'M14 11v5'],
  ],
  plus: [
    ['path', 'M12 5v14'],
    ['path', 'M5 12h14'],
  ],
  install: [
    ['path', 'M12 3v11'],
    ['path', 'm7 9 5 5 5-5'],
    ['path', 'M4 21h16'],
  ],
  import: [
    ['path', 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z'],
    ['path', 'M14 3v5h5'],
    ['path', 'M12 12v5'],
    ['path', 'm9.5 14.5 2.5 2.5 2.5-2.5'],
  ],
  refresh: [
    ['path', 'M21 12a9 9 0 1 1-3-6.7'],
    ['path', 'M21 3v6h-6'],
  ],
}

function Icon({ name, size = 15 }) {
  const shapes = ICONS[name] ?? []
  return h(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: { flex: '0 0 auto', display: 'block' },
      'aria-hidden': 'true',
    },
    shapes.map(([tag, spec], index) =>
      tag === 'circle' ? h('circle', { key: index, ...spec }) : h('path', { key: index, d: spec }),
    ),
  )
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
      const [state, setState] = React.useState({ loading: true, data: null, error: null, exportError: null })
      // 搜索输入与实际生效的查询分开：输入停 250ms 才过滤，避免每敲一个字就重排 177 张卡。
      const [queryInput, setQueryInput] = React.useState('')
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
      const [importingConfig, setImportingConfig] = React.useState(false)
      const [importConfigText, setImportConfigText] = React.useState('')
      const [importResult, setImportResult] = React.useState(null)
      const [draftName, setDraftName] = React.useState('')
      // 视图与排序偏好属于浏览器，存 localStorage，不写 state.json。
      const [view, setView] = React.useState(() => {
        try { return window.localStorage.getItem('zhiyin.view') || 'list' } catch { return 'list' }
      })
      const [sortField, setSortField] = React.useState(() => {
        try { return window.localStorage.getItem('zhiyin.sort') || 'name' } catch { return 'name' }
      })
      const [menuOpen, setMenuOpen] = React.useState(null)   // 技能包行尾 … 菜单
      const [renaming, setRenaming] = React.useState(null)   // 改名弹窗：{ id, name }
      React.useEffect(() => { try { window.localStorage.setItem('zhiyin.view', view) } catch {} }, [view])
      React.useEffect(() => { try { window.localStorage.setItem('zhiyin.sort', sortField) } catch {} }, [sortField])

      // 搜索防抖：250ms 静默期后再拿输入去过滤。
      React.useEffect(() => {
        const timer = setTimeout(() => setQuery(queryInput), 250)
        return () => clearTimeout(timer)
      }, [queryInput])

      const load = React.useCallback(() => {
        setState((previous) => ({ ...previous, loading: true, error: null, exportError: null }))
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

      // 导出配置：拉一份 JSON，直接让浏览器下载一份带时间戳的文件。
      const exportConfig = React.useCallback(() => {
        setBusy(true)
        fetch('/zhiyin/export', { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response.json()
          })
          .then((payload) => {
            const text = JSON.stringify(payload, null, 2)
            const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const stamp = String(payload?.exportedAt ?? '').replace(/[:.]/g, '-') || 'export'
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = `zhiyin-config-${stamp}.json`
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
            setTimeout(() => URL.revokeObjectURL(url), 2000)
          })
          .catch((error) =>
            setState((previous) => ({
              ...previous,
              exportError: String(error?.message ?? error),
            })),
          )
          .finally(() => setBusy(false))
      }, [])

      // 导入配置：粘贴此前导出的 JSON；后端先备份旧配置再覆盖，并回报缺失成员。
      const importConfig = React.useCallback(() => {
        const raw = importConfigText.trim()
        if (!raw) return
        let parsed = null
        try {
          parsed = JSON.parse(raw)
        } catch {
          setImportResult({ ok: false, text: say('importConfigBadJson', '不是合法的 JSON') })
          return
        }
        setBusy(true)
        fetch('/zhiyin/import', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ config: parsed }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result || result.ok !== true) throw new Error(result?.error ?? 'rejected')
            const missing = Array.isArray(result.missing) ? result.missing : []
            setImportResult({
              ok: true,
              text:
                `${say('importConfigOk', '导入完成')}：${result.packs} ${say('packUnit', '个技能包')}` +
                (missing.length > 0
                  ? `；${missing.length} ${say('importConfigMissing', '个成员未安装')}（${missing.slice(0, 4).join('、')}${missing.length > 4 ? ' …' : ''}）`
                  : ''),
            })
            load()
          })
          .catch((error) => setImportResult({ ok: false, text: String(error?.message ?? error) }))
          .finally(() => setBusy(false))
      }, [importConfigText, load, say])

      React.useEffect(() => {
        load()
      }, [load])

      // 点空白处收起技能包 … 菜单
      React.useEffect(() => {
        if (!menuOpen) return undefined
        const close = () => setMenuOpen(null)
        window.addEventListener('click', close)
        return () => window.removeEventListener('click', close)
      }, [menuOpen])

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
        const filtered = scoped.filter((skill) => {
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
        const chars = (skill) => Math.min((skill.description ?? '').length, 500)
        const sorted = filtered.slice().sort((a, b) => {
          if (sortField === 'source') return String(a.source).localeCompare(String(b.source)) || a.name.localeCompare(b.name)
          if (sortField === 'chars') return chars(b) - chars(a) || a.name.localeCompare(b.name)
          if (sortField === 'enabled') return Number(b.enabled !== false) - Number(a.enabled !== false) || a.name.localeCompare(b.name)
          return a.name.localeCompare(b.name)
        })
        return sorted
      }, [scoped, query, filter, sortField])

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
      const sourceShort = (skill) => {
        if (skill.source === 'bundled') return say('sourceBundled', '内置')
        if (skill.source === 'custom') return say('sourceCustom', '自定义')
        if (skill.source === 'user-dsh') return '.dsh'
        if (skill.source === 'user-agents') return '.agents'
        return String(skill.source)
      }
      const reasonLabel = (reason) => {
        if (reason === 'manual') return say('reasonManual', '手动停用')
        if (reason === 'pack') return say('reasonPack', '技能包停用')
        if (reason === 'agents-root') return say('reasonAgents', 'agents 开关关闭')
        if (reason === 'all-off') return say('reasonAllOff', '全部停用')
        return ''
      }

      const formatTime = (iso) => {
        if (!iso) return ''
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return ''
        const pad = (n) => String(n).padStart(2, '0')
        return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
      }

      // 当前作用域内所有技能名（用于判断包成员是否为「幽灵」）
      const scopedNames = React.useMemo(() => new Set(scoped.map((skill) => skill.name)), [scoped])

      // 技能包按搜索词过滤：包名或成员名命中即可。
      const visiblePacks = React.useMemo(() => {
        const packs = data?.packs ?? []
        const needle = query.trim().toLowerCase()
        if (needle === '') return packs
        return packs.filter(
          (pack) =>
            String(pack?.name ?? '').toLowerCase().includes(needle) ||
            (pack?.members ?? []).some((name) => String(name).toLowerCase().includes(needle)),
        )
      }, [data, query])

      // 技能包三态：由成员派生（全部启用 / 部分启用 / 全部停用）。
      const packStatus = (pack) => {
        const members = (pack.members ?? []).filter((name) => scopedNames.has(name))
        if (members.length === 0) return { kind: 'empty', on: 0, total: 0 }
        let on = 0
        for (const name of members) {
          const skill = scoped.find((entry) => entry.name === name)
          if (skill && skill.enabled !== false) on += 1
        }
        if (on === members.length) return { kind: 'all', on, total: members.length }
        if (on === 0) return { kind: 'none', on, total: members.length }
        return { kind: 'partial', on, total: members.length }
      }
      const packStatusLabel = (status) => {
        if (status.kind === 'all') return say('packAllOn', '全部启用')
        if (status.kind === 'none') return say('packAllOff', '全部停用')
        if (status.kind === 'partial') return say('packPartial', '部分启用')
        return say('packEmpty', '空包')
      }
      const packStatusStyle = (status) => ({
        ...css.badge(true),
        background:
          status.kind === 'all'
            ? 'rgba(74,157,106,0.20)'
            : status.kind === 'none'
              ? 'rgba(128,128,128,0.16)'
              : 'rgba(224,163,62,0.22)',
        opacity: status.kind === 'empty' ? 0.5 : 0.95,
      })

      // 复制技能包：名字加「副本」，按 1–40 字符与重名规则生成。
      const copyPack = (pack) => {
        const taken = new Set((data?.packs ?? []).map((entry) => entry.name))
        let candidate = pack.name.slice(0, 40 - 3) + ' 副本'
        let n = 2
        while (taken.has(candidate) || candidate.length > 40) {
          const tail = ` 副本${n}`
          candidate = pack.name.slice(0, 40 - tail.length) + tail
          n += 1
        }
        write('/zhiyin/pack', { action: 'create', name: candidate }).then((result) => {
          if (result?.ok && result.id) {
            write('/zhiyin/pack', { action: 'members', id: result.id, members: pack.members ?? [] })
          }
        })
      }

      // 告警：目录超预算 / 同名冲突 / 包内引用了未安装技能
      const alerts = React.useMemo(() => {
        const out = []
        if (data && data.catalogChars > data.budgetChars) {
          out.push({ key: 'budget', text: `${say('alertBudget', '目录字符数已超出预算')} ${data.catalogChars} / ${data.budgetChars}` })
        }
        if (data && Array.isArray(data.conflicts)) {
          for (const conflict of data.conflicts) {
            out.push({ key: 'conflict:' + conflict.name, text: `${say('alertConflict', '同名技能冲突')}：${conflict.name}（${conflict.count} ${say('alertFrom', '个来源')}）` })
          }
        }
        for (const pack of data?.packs ?? []) {
          const ghosts = (pack.members ?? []).filter((name) => !scopedNames.has(name))
          if (ghosts.length > 0) {
            out.push({ key: 'ghost:' + pack.id, text: `${say('alertGhost', '技能包引用了未安装技能')} · ${pack.name}：${ghosts.slice(0, 4).join('、')}${ghosts.length > 4 ? ' …' : ''}` })
          }
        }
        return out
      }, [data, scopedNames, say])

      return h(
        'div',
        { style: css.page },
        h(
          'div',
          { style: css.head },
          h('h2', { style: css.title }, say('title', '织音')),
          h('span', { style: css.subtitle }, say('subtitle', '让技能自由编组，让能力彼此协奏')),
          h(
            'div',
            { style: css.headActions },
            h(
              'button',
              {
                type: 'button',
                style: { ...css.btn, padding: '4px 11px', fontSize: 12, opacity: 0.8 },
                disabled: busy,
                title: say('exportConfigHint', '导出一份可移植的 JSON 配置（技能包 / 停用项）'),
                onClick: exportConfig,
              },
              say('exportConfig', '导出配置'),
            ),
            h(
              'button',
              {
                type: 'button',
                style: { ...css.btn, padding: '4px 11px', fontSize: 12, opacity: 0.8 },
                disabled: busy,
                title: say('importConfigHint', '粘贴此前导出的 JSON 覆盖当前配置；旧配置会自动备份'),
                onClick: () => {
                  setImportConfigText('')
                  setImportResult(null)
                  setImportingConfig(true)
                },
              },
              say('importConfig', '导入配置'),
            ),
            data
              ? h(
                  'span',
                  {
                    style: css.pill(data.takeover?.visible),
                    title: data.takeover?.visible
                      ? say('takeoverHintOn', '已为在跑的会话挂上策略 provider，开关即时生效。')
                      : say('takeoverHintOff', '还没有在跑的会话；新会话出现后自动挂钩。'),
                  },
                  data.takeover?.visible ? say('takeoverOn', '开关已生效') : say('takeoverOff', '未接管'),
                )
              : null,
          ),
        ),

        // 元信息条：版本 · 观测时间 ｜ 右侧主按钮（全部停用/全部启用）
        data
          ? h(
              'div',
              { style: css.metaBar },
              h('span', null, `@local/dsh-zhiyin-proto v${data.version ?? '0.0.0'}`),
              h('span', { style: css.metaDot }, '·'),
              h('span', null, `${say('observedAt', '观测于')} ${formatTime(data.at)}`),
              h(
                'button',
                {
                  type: 'button',
                  style: busy ? { ...css.primaryBtn, opacity: 0.5, cursor: 'default' } : css.primaryBtn,
                  disabled: busy,
                  title:
                    data.allOff === true
                      ? say('masterEnableHint', '恢复各技能自己的开关状态')
                      : say('masterDisableHint', '一键全部停用：模型目录为空、/ 菜单也选不到'),
                  onClick: () => write('/zhiyin/settings', { allOff: data.allOff !== true }),
                },
                data.allOff === true ? say('masterEnable', '全部启用') : say('masterDisable', '全部停用'),
              ),
            )
          : null,

        state.error
          ? h('p', { style: { ...css.hint, marginTop: 12 } }, `${say('failed', '观测失败：')}${state.error}`)
          : null,

        state.exportError
          ? h('p', { style: { ...css.hint, marginTop: 12 } }, `${say('exportConfigFailed', '导出失败：')}${state.exportError}`)
          : null,

        // 告警区：内容之上，点名具体对象
        alerts.length > 0
          ? h(
              'div',
              { style: css.alertWrap },
              alerts.map((alert) =>
                h(
                  'div',
                  { key: alert.key, style: css.alertItem },
                  h('span', { style: css.alertIcon }, '⚠'),
                  h('span', null, alert.text),
                ),
              ),
            )
          : null,

        data
          ? h(
              'div',
              { style: css.grid },
              statCards(data, counts, say, filter, setFilter),
            )
          : null,

        data
          ? h(
              'div',
              { style: css.group },
              h(
                'div',
                { style: css.groupRow },
                h(
                  'div',
                  { style: css.groupMain },
                  h('div', { style: css.groupTitle }, say('agentsRoot', '加载 ~/.agents/skills')),
                  h('div', { style: css.groupDesc }, say('agentsRootHintShort', '开启后读取 ~/.agents/skills 与 ~/.dsh/skills 的合集；关闭后只读 ~/.dsh/skills 与项目技能')),
                ),
                h(Toggle, {
                  checked: data.agentsRoot !== false,
                  disabled: busy,
                  title: say('agentsRootHint', '开启后，智能体将自动加载 .agents/skills 路径下的自定义技能'),
                  onChange: () => write('/zhiyin/settings', { agentsRoot: data.agentsRoot === false }),
                }),
              ),
              h(
                'div',
                { style: css.groupRowLast },
                h(
                  'div',
                  { style: css.groupMain },
                  h(
                    'div',
                    { style: css.groupTitle },
                    say('budget', '目录字符数'),
                    h('span', { style: { ...css.budgetNum, marginLeft: 8 } }, String(data.catalogChars),
                      h('span', { style: css.budgetCap }, ` / ${data.budgetChars}`)),
                  ),
                  h('div', { style: css.groupDesc },
                    data.complete ? say('complete', '观测完整') : say('incomplete', '观测不完整')),
                  h('span', { style: { ...css.budgetTrack, marginTop: 6 } }, h('span', { style: css.budgetFill(pct) })),
                ),
              ),
            )
          : null,

        // 标签页（技能 / 技能包）+ 右侧视图切换与刷新
        data
          ? h(
              'div',
              { style: { ...css.row, marginTop: 22 } },
              h(
                'div',
                { style: css.seg },
                h('button', { type: 'button', style: tab === 'list' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('list') }, `${say('tabList', '技能')} ${counts.total}`),
                h('button', { type: 'button', style: tab === 'packs' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('packs') }, `${say('tabPacks', '技能包')} ${(data.packs ?? []).length}`),
              ),
              tab === 'list'
                ? h(
                    'div',
                    { style: { ...css.seg, marginLeft: 'auto' } },
                    h('button', { type: 'button', style: view === 'cards' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setView('cards') }, say('viewCards', '卡片')),
                    h('button', { type: 'button', style: view === 'list' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setView('list') }, say('viewList', '列表')),
                  )
                : null,
              h('button', {
                type: 'button',
                style: { ...css.iconBtn, marginLeft: tab === 'list' ? 0 : 'auto' },
                title: say('refresh', '重新观测'),
                'aria-label': say('refresh', '重新观测'),
                onClick: load,
                disabled: state.loading,
              }, state.loading ? say('loading', '观测中') : h(Icon, { name: 'refresh', size: 14 })),
            )
          : null,

        // 工具条：分组动作 · 搜索（占满）· 排序 / 安装
        data
          ? h(
              'div',
              { style: css.toolbar },
              tab === 'packs'
                ? h('span', { style: { display: 'inline-flex', gap: 6 } },
                    h('button', { type: 'button', style: css.iconBtn, title: say('packNew', '新建技能包'), 'aria-label': say('packNew', '新建技能包'), onClick: () => { setDraftName(''); setCreating(true) }, disabled: busy }, h(Icon, { name: 'plus', size: 14 })),
                    h('button', { type: 'button', style: css.iconBtn, title: say('packImport', '导入 txt 技能包'), 'aria-label': say('packImport', '导入 txt 技能包'), onClick: () => { setImportText(''); setImportPath(''); setImportName(''); setImporting(true) }, disabled: busy }, h(Icon, { name: 'import', size: 14 })),
                  )
                : null,
              h('input', {
                style: css.input,
                value: queryInput,
                placeholder:
                  tab === 'list'
                    ? say('search', '按名称或描述搜索')
                    : say('searchPacks', '搜技能包名或成员'),
                onChange: (event) => setQueryInput(event.target.value),
              }),
              tab === 'list'
                ? h('label', { style: css.sortWrap },
                    say('sortBy', '排序'),
                    h('select', {
                      style: css.sortSelect,
                      value: sortField,
                      onChange: (event) => setSortField(event.target.value),
                    },
                      h('option', { value: 'name' }, say('sortName', '名称')),
                      h('option', { value: 'source' }, say('sortSource', '来源')),
                      h('option', { value: 'chars' }, say('sortChars', '字符数')),
                      h('option', { value: 'enabled' }, say('sortEnabled', '启用状态')),
                    ),
                  )
                : null,
              tab === 'list'
                ? h(
                    'button',
                    {
                      type: 'button',
                      style: css.iconBtn,
                      title: say('install', '安装技能'),
                      'aria-label': say('install', '安装技能'),
                      disabled: busy,
                      onClick: () => {
                        setInstallPath('')
                        setInstallName('')
                        setInstallTarget('user')
                        setInstalling(true)
                      },
                    },
                    h(Icon, { name: 'install', size: 14 }),
                  )
                : null,
            )
          : null,

        data && tab === 'packs'
          ? h(
              'div',
              { style: css.list },
              (data.packs ?? []).length === 0
                ? h('div', { style: css.hint }, say('packEmptyHint', '还没有技能包；点右上角新建，再把技能勾进来'))
                : null,
              visiblePacks.length === 0 && (data.packs ?? []).length > 0
                ? h('div', { style: css.hint }, say('packNoMatch', '没有匹配技能包'))
                : null,
              visiblePacks.map((pack) => {
                const status = packStatus(pack)
                const ghosts = (pack.members ?? []).filter((name) => !scopedNames.has(name))
                const openMembers = () => {
                  setDraftMembers(pack.members ?? [])
                  setMemberQuery('')
                  setEditing(pack.id)
                }
                return h(
                  'div',
                  { key: pack.id, style: css.item },
                  h(
                    'div',
                    { style: css.itemMain },
                    h(
                      'div',
                      { style: css.itemHead },
                      h('span', { style: css.name }, pack.name),
                      h('span', { style: css.badge(true) }, `${pack.members?.length ?? 0} 个技能`),
                      h('span', { style: { ...packStatusStyle(status), marginLeft: 'auto' } }, packStatusLabel(status)),
                    ),
                    pack.members?.length
                      ? h(
                          'div',
                          { style: css.desc },
                          pack.members.slice(0, 6).join(' · ') +
                            (pack.members.length > 6 ? ` … +${pack.members.length - 6}` : '') +
                            (ghosts.length ? `  ·  ${say('packGhost', '未安装')} ${ghosts.length}` : ''),
                        )
                      : h('div', { style: css.desc }, say('packEmptyHint2', '还没有成员')),
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.iconBtn,
                      title: say('packMembers', '管理成员'),
                      'aria-label': say('packMembers', '管理成员'),
                      disabled: busy,
                      onClick: openMembers,
                    },
                    h(Icon, { name: 'users', size: 14 }),
                  ),
                  h(
                    'div',
                    { style: css.menuWrap },
                    h(
                      'button',
                      {
                        type: 'button',
                        style: { ...css.iconBtn, fontWeight: 700, lineHeight: 1 },
                        title: say('packMore', '更多操作'),
                        'aria-label': say('packMore', '更多操作'),
                        disabled: busy,
                        onClick: (event) => {
                          event.stopPropagation()
                          setMenuOpen(menuOpen === pack.id ? null : pack.id)
                        },
                      },
                      '…',
                    ),
                    menuOpen === pack.id
                      ? h(
                          'div',
                          { style: css.menu, onClick: (event) => event.stopPropagation() },
                          h('button', { type: 'button', style: css.menuItem, onClick: () => { setMenuOpen(null); setRenaming({ id: pack.id, name: pack.name }) } }, say('packRename', '改名')),
                          h('button', { type: 'button', style: css.menuItem, onClick: () => { setMenuOpen(null); copyPack(pack) } }, say('packCopy', '复制')),
                          h('button', { type: 'button', style: css.menuItem, onClick: () => { setMenuOpen(null); openMembers() } }, say('packMembers', '管理成员')),
                          h('button', { type: 'button', style: { ...css.menuItem, color: '#d06464' }, onClick: () => {
                            setMenuOpen(null)
                            if (window.confirm(say('packDeleteAsk', '删除技能包？包内技能不会被卸载。') + ' ' + pack.name)) {
                              write('/zhiyin/pack', { action: 'delete', id: pack.id })
                            }
                          } }, say('packDelete', '删除')),
                        )
                      : null,
                  ),
                  h(Toggle, {
                    checked: pack.enabled !== false,
                    disabled: busy,
                    title: pack.enabled === false ? say('packOff', '已停用') : say('packOn', '启用中'),
                    onChange: () => write('/zhiyin/pack', { action: 'toggle', id: pack.id, enabled: pack.enabled === false }),
                  }),
                )
              }),
            )
          : null,

        // 卡片视图
        data && tab === 'list' && view === 'cards'
          ? h(
              'div',
              { style: css.cardGrid },
              skills.length === 0
                ? h('div', { style: css.hint }, say('empty', '没有匹配的技能'))
                : skills.map((skill) => {
                    const on = skill.enabled !== false
                    return h(
                      'div',
                      {
                        key: skill.name,
                        style: on ? css.skillCard : { ...css.skillCard, ...css.itemOff },
                        title: skill.linkTarget ?? skill.logicalPath ?? skill.path ?? undefined,
                      },
                      h(
                        'div',
                        { style: css.cardHead },
                        h('span', { style: css.cardName }, skill.name),
                        h('span', { style: { ...css.badge(true), flex: '0 0 auto' } }, sourceShort(skill)),
                        h('span', { style: { ...css.hint, flex: '0 0 auto' } }, String(Math.min((skill.description ?? '').length, 500))),
                      ),
                      h('div', { style: css.cardDesc }, skill.description ?? ''),
                      h(
                        'div',
                        { style: css.cardFoot },
                        h('span', { style: css.dot(on) }),
                        h('span', { style: { fontSize: 11.5, opacity: 0.6 } },
                          on ? say('enabled', '已启用') : (reasonLabel(skill.hiddenReason) || say('disabledBadge', '已停用'))),
                        skill.source === 'user-dsh' || skill.source === 'user-agents'
                          ? h('button', {
                              type: 'button',
                              title: say('uninstallHint', '移入归档目录，可恢复'),
                              'aria-label': say('uninstall', '卸载'),
                              style: { ...css.iconBtn, marginLeft: 'auto' },
                              disabled: busy,
                              onClick: () => {
                                if (window.confirm(say('uninstallAsk', '卸载并把技能移入归档目录？') + ' ' + skill.name)) {
                                  write('/zhiyin/uninstall', { name: skill.name })
                                }
                              },
                            }, h(Icon, { name: 'archive', size: 14 }))
                          : null,
                        h(Toggle, {
                          checked: on,
                          disabled: busy,
                          title: skill.hiddenReason ? reasonLabel(skill.hiddenReason) : say('toggleHint', '点开关立即生效'),
                          onChange: () => write('/zhiyin/skill', {
                            name: skill.name,
                            enabled: !on,
                            description: skill.description,
                            source: skill.source,
                          }),
                        }),
                      ),
                    )
                  }),
            )
          : null,

        // 列表视图
        data && tab === 'list' && view === 'list'
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
                      skill.source === 'user-dsh' || skill.source === 'user-agents'
                        ? h(
                            'button',
                            {
                              type: 'button',
                              title: say('uninstallHint', '移入归档目录，可恢复'),
                              'aria-label': say('uninstall', '卸载'),
                              style: css.iconBtn,
                              disabled: busy,
                              onClick: () => {
                                if (window.confirm(say('uninstallAsk', '卸载并把技能移入归档目录？') + ' ' + skill.name)) {
                                  write('/zhiyin/uninstall', { name: skill.name })
                                }
                              },
                            },
                            h(Icon, { name: 'archive', size: 15 }),
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
                          ? h('span', { style: css.badgeWarn }, say('disabledBadge', '已停用'))
                          : null,
                        h(
                          'span',
                          { style: css.metaText },
                          skill.model && skill.user
                            ? say('metaBoth', '模型 · 用户')
                            : skill.model
                              ? say('metaModel', '仅模型')
                              : skill.user
                                ? say('metaUser', '仅用户')
                                : say('metaInternal', '内部'),
                        ),
                        skill.linkTarget
                          ? h(
                              'span',
                              {
                                style: { ...css.metaText, opacity: 0.32 },
                                title: `${say('linkBadgeTitle', '符号链接，实体在')}${skill.linkTarget}`,
                              },
                              '⛓',
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
                    h('button', { type: 'button', style: css.iconBtn, title: say('close', '关闭'), 'aria-label': say('close', '关闭'), onClick: () => setEditing(null) }, h(Icon, { name: 'close', size: 13 }),),
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
                { style: { ...css.modal, ...css.modalSm } },
                h('div', { style: css.modalHead }, h('span', { style: css.modalTitle }, say('packNew', '新建技能包'))),
                h('input', {
                  style: css.field,
                  maxLength: 40,
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

        renaming
          ? h(
              'div',
              { style: css.overlay },
              h(
                'div',
                { style: { ...css.modal, ...css.modalSm } },
                h('div', { style: css.modalHead }, h('span', { style: css.modalTitle }, say('packRename', '改名'))),
                h('input', {
                  style: css.field,
                  maxLength: 40,
                  value: renaming.name,
                  placeholder: say('packNamePlaceholder', '技能包名称'),
                  onChange: (event) => setRenaming({ ...renaming, name: event.target.value }),
                }),
                h('p', { style: css.hint }, say('packNameRule', '1–40 个字符；仅限中文、字母、数字、空格、下划线、连字符')),
                h(
                  'div',
                  { style: css.modalFoot },
                  h('button', { type: 'button', style: css.btn, onClick: () => setRenaming(null) }, say('cancel', '取消')),
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.btn,
                      disabled: busy || renaming.name.trim().length < 1 || renaming.name.trim().length > 40,
                      onClick: () => {
                        write('/zhiyin/pack', { action: 'rename', id: renaming.id, name: renaming.name.trim() })
                        setRenaming(null)
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
                { style: { ...css.modal, ...css.modalMd } },
                h('div', { style: css.modalHead }, h('span', { style: css.modalTitle }, say('install', '安装技能'))),
                h('p', { style: css.hint }, say('installHint', '填一个含 SKILL.md 的文件夹绝对路径；安装只新建目录，不会改写已有技能')),
                h('input', {
                  style: css.field,
                  value: installPath,
                  placeholder: say('installPath', '文件夹路径，如 D:\\skills\\my-skill'),
                  onChange: (event) => setInstallPath(event.target.value),
                }),
                h('input', {
                  style: css.field,
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
                  style: css.field,
                  value: importName,
                  placeholder: say('packNamePlaceholder', '技能包名称（留空用文件里的名字）'),
                  onChange: (event) => setImportName(event.target.value),
                }),
                h('input', {
                  style: css.field,
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

        // 导入配置弹窗：粘贴此前导出的 JSON；导入前后端自动备份旧配置。
        importingConfig
          ? h(
              'div',
              { style: css.overlay },
              h(
                'div',
                { style: { ...css.modal, ...css.modalMd } },
                h('div', { style: css.modalHead }, h('span', { style: css.modalTitle }, say('importConfig', '导入配置'))),
                h('p', { style: css.hint }, say('importConfigHint2', '粘贴此前「导出配置」得到的 JSON。导入会覆盖当前的技能包与停用项；旧配置会先自动备份到插件状态目录。')),
                h('textarea', {
                  style: css.textarea,
                  value: importConfigText,
                  placeholder: say('importConfigPlaceholder', '{\n  "schemaVersion": 1,\n  "packs": []\n}'),
                  onChange: (event) => setImportConfigText(event.target.value),
                }),
                importResult
                  ? h(
                      'div',
                      { style: { ...css.alertItem, marginTop: 2, borderColor: importResult.ok ? 'rgba(74,157,106,0.4)' : 'rgba(208,100,100,0.4)', background: importResult.ok ? 'rgba(74,157,106,0.10)' : 'rgba(208,100,100,0.10)' } },
                      h('span', { style: css.alertIcon }, importResult.ok ? '✓' : '⚠'),
                      h('span', null, importResult.text),
                    )
                  : null,
                h(
                  'div',
                  { style: css.modalFoot },
                  h('button', { type: 'button', style: css.btn, onClick: () => setImportingConfig(false) }, say('cancel', '取消')),
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.btn,
                      disabled: busy || importConfigText.trim() === '',
                      onClick: importConfig,
                    },
                    say('importConfigRun', '导入'),
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
        { key: 'statTotal', label: '技能总数', value: counts.total, filter: 'all', hint: '当前作用域下观测到的全部技能（按名称去重）' },
        { key: 'statModel', label: '模型可用', value: counts.model, filter: 'model', hint: '可被模型侧调用的技能（modelInvocable）；对话时模型能自己选中它们' },
        {
          key: 'statUser',
          label: '仅用户可用',
          value: Math.max(0, counts.user - counts.both),
          filter: 'user',
          hint: '只出现在 / 菜单、模型不可直接调用的技能',
        },
        { key: 'statNeither', label: '仅内部可用', value: counts.neither, filter: 'internal', hint: '既不在模型侧也不在 / 菜单、只作为内部能力的技能' },
        { key: 'statBundled', label: '内置技能', value: counts.bundled, filter: 'bundled', hint: '随插件内置（bundled 来源）的技能' },
      ]
      return items.map((item) => {
        const active = filter === item.filter
        return h(
          'button',
          {
            key: item.key,
            type: 'button',
            title: item.hint + '｜' + say('filterHint', '点一下只看这类，再点回到全部'),
            onClick: () => setFilter(active ? 'all' : item.filter),
            style: {
              ...css.card,
              ...(active ? css.cardActive : null),
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
              background: active ? 'rgba(128,128,128,0.18)' : 'transparent',
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