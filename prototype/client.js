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
        refresh: '刷新',
        loading: '正在读取技能列表…',
        failed: '读取失败：',
        takeoverOn: '开关已生效',
        takeoverOff: '未接管',
        takeoverHintOn: '已为在跑的会话挂上策略 provider，开关即时生效。',
        takeoverHintOff: '还没有在跑的会话；新会话出现后自动挂钩。',
        statTotal: '技能总数',
        statModel: '模型可用',
        statUser: '仅用户可用',
        statNeither: '仅内部可用',
        budget: '目录字符数',
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
        packSelectedCount: '已选 {n} / {m}',
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
        installHint: '粘贴 GitHub 仓库、技能目录、npx skills add 命令、SKILL.md 直链，或本地文件夹路径；技能名以 SKILL.md 的 name 为准，目录名同名',
        installPath: 'owner/repo、https://github.com/owner/repo 或 D:\skills\my-skill',
        installAgents: '技能库 ~/.agents/skills（装好会链接进 .dsh，DSH 可见）',
        installMultiple: '这个仓库里有多个技能，勾选后一起安装：',
        installSelected: '安装选中',
        installSelectedCount: '已选 {n} / {m}',
        installAll: '全选',
        installNone: '全不选',
        installProgress: '正在安装 {i}/{n}…',
        installDone: '已安装 {n} 个技能',
        installPartial: '部分安装失败：',
        installFailed: '安装失败：',
        installUser: '用户目录 ~/.dsh/skills（直接放这里，不走技能库）',
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
        next: '技能包开关决定包内技能是否对 agent 可见；单个技能也可以随时停用。',
        agentsRoot: '加载 ~/.agents/skills',
        agentsRootHint: '关掉后 DSH 只看 ~/.dsh/skills 与项目技能',
        agentsRootHintShort: '开启后读取 ~/.agents/skills 与 ~/.dsh/skills 的合集；关闭后只读 ~/.dsh/skills 与项目技能',
        disabledBadge: '已停用',
        enabledBadge: '启用中',
        toggleFailed: '开关失败：',
        reasonManual: '手动停用',
        reasonPack: '技能包停用',
        reasonUnpacked: '未加入技能包',
        reasonAgents: 'agents 开关关闭',
        toggleHint: '点开关立即生效',
        toggleBlocked: '上层开关已停用；先打开技能包或总开关',
        toggleUnpacked: '先把它加进一个启用的技能包；单技能开关只负责组内关掉',
        exportConfig: '导出配置',
        exportConfigHint: '导出一份可移植的 JSON 配置（技能包 / 停用项）',
        exportConfigFailed: '导出失败：',
        importConfig: '导入配置',
        importConfigHint: '粘贴此前导出的 JSON 覆盖当前配置；旧配置会自动备份',
        importConfigHint2: '粘贴此前「导出配置」得到的 JSON。导入会覆盖当前的技能包与停用项；旧配置会先自动备份到插件状态目录。',
        rollback: '撤销上次',
        rollbackHint: '退回最近一次导入前的状态（每次导入都会留一份备份）',
        rollbackAsk: '回滚到最近一次导入前的状态？当前配置会先另存一份备份。',
        importConfigPlaceholder: '{\n  "schemaVersion": 1,\n  "packs": []\n}',
        importConfigRun: '导入',
        importConfigOk: '导入完成',
        importConfigBadJson: '不是合法的 JSON',
        importConfigMissing: '个成员未安装',
        packUnit: '个技能包',
        observedAt: '更新于',
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
        packDefault: '默认',
        packAllHint: '包含当前能看到的全部技能，新技能自动加入；开它，具体技能包自动关闭',
        packCostUnit: '字符',
        packNotInCombo: '本组合未纳入',
        packHiddenAgents: '被 .agents 开关挡住',
              alertConflict: '同名技能冲突',
        alertFrom: '个来源',
        alertGhost: '技能包引用了未安装技能',
        close: '关闭',
        enabled: '已启用',
        tabCombos: '组合',
        comboNew: '新建组合',
        comboNamePlaceholder: '组合名称',
        comboNameRule: '1–40 个字符；仅限中文、字母、数字、空格、下划线、连字符',
        comboNameRuleShort: '名称需为 1–40 个字符',
        comboEmptyHint: '还没有组合。组合 = 按场景挑几个技能包；应用前会先给你看差异',
        comboEmptyHint2: '还没有选包，点「选择包」',
        comboNoMatch: '没有匹配组合',
        searchCombos: '搜组合名或其中的包',
        comboPacksCount: '个技能包',
        comboChoosePacks: '选择包',
        comboApply: '应用',
        comboApplied: '生效中',
        comboIdle: '未生效',
        comboMenu: '更多操作',
        comboRename: '改名',
        comboDelete: '删除',
        comboDeleteAsk: '删除组合？技能包和技能都不会受影响。',
        comboModeCompat: '兼容模式',
        comboModeOrchestrated: '合奏模式',
        comboModeHintCompat: '只观测，不接管生效面',
        comboModeHintOrchestrated: '生效面由当前组合决定：编配的包生效，未编配的技能不生效',
        comboExit: '退出合奏',
        comboPreviewTitle: '应用前预览',
        comboPreviewOn: '将生效的包',
        comboPreviewOff: '将停用的包',
        comboPreviewEnable: '将加入',
        comboPreviewHide: '将退出',
        comboPreviewUnassigned: '个未编配技能不会生效',
        comboPreviewNone: '没有可见变化',
        comboPreviewChars: '目录字符数',
        comboRunApply: '应用组合',
        comboRunStack: '叠加到当前',
        comboNoPacks: '还没有技能包；先到「技能包」建一个',
        exclude: '排除',
        includeBack: '恢复',
        excludeHint: '从生效面排除这个技能；不改动任何技能包',
        excludedBadge: '已排除',
        alwaysOn: '常驻',
        alwaysOnHint: '不受包启停与组合影响，始终生效',
        alwaysOnBadge: '常驻',
        reasonExcluded: '已排除',
        reasonUnassigned: '未编配',
        reasonCombo: '组合未纳入',
        batchPick: '选中以便批量启停',
        batchSelected: '已选',
        batchEnable: '批量启用',
        batchDisable: '批量停用',
        batchClear: '清除选择',
        alertUnassigned: '合奏模式下有未编配技能不生效',
        alertUnpacked: '有技能未加入技能包，当前不生效',
        alertPackConflict: '技能包冲突',
        note: '备注',
        noteEdit: '编辑备注',
        noteView: '查看完整备注',
        noteViewTitle: '技能备注',
        noteAdd: '加备注',
        noteHint: '备注只存在本地配置里，不会写进技能文件；导出配置时会一起带走。',
        notePlaceholder: '例如：做前端评审时先留着；下个项目再用',
        noteEmpty: '还没有备注',
        comboConflictAsk: '这些技能包互相冲突',
        comboConflictStill: '仍然应用并留痕？',
        packConflicts: '声明冲突包',
        packConflictBadge: '冲突',
        conflictsHint: '勾选与这个包互斥的其它包；任一方声明即视为冲突，应用/启用前会阻断，可选择仍然应用',
        conflictsEmpty: '没有其它技能包可供声明',
        consistencySynced: '一致',
        consistencyDegraded: '观测不完整',
        consistencyDrifted: '有漂移',
        consistencyHintSynced: '观测与投影一致',
        consistencyHintDegraded: '上次观测不完整，保留上次成功投影',
        consistencyHintDrifted: '技能包 / 组合引用了观测不到的技能，与投影不一致',
        readOnlyBadge: '只读',
        readOnlyHintBundled: '内置技能：织音只改可见性，不改动它的文件',
        readOnlyHintExternal: '外部来源：不在织音管理的目录里，只能启停',
        readOnlyHintRoot: '不在织音管理的安装目录里，只能启停',
        repair: '修复',
        repairAsk: '把观测不到的引用从技能包 / 组合 / 意图里剪掉？当前配置会先备份。',
        repairOk: '已剪掉失效引用：',
        repairNone: '没有需要修复的引用',
        repairHint: '清理指向已消失技能的引用，让观测与投影重新一致',
        matrixTitle: '生效面矩阵',
        matrixSub: '四个生效面各自由谁控制，别只盯着「已启用」',
        matrixCatalog: '模型目录',
        matrixTool: 'skill 工具',
        matrixSlash: '/name 菜单',
        matrixGet: '可信 get()',
        matrixBy: '由谁控制',
        matrixCatalogBy: '合奏成员 × 源允许模型',
        matrixToolBy: '合奏成员 × 源允许模型',
        matrixSlashBy: '合奏成员 × 源允许用户',
        matrixGetBy: '合奏成员（源策略不限制）',
        matrixMemberBy: '合奏成员：全部停用 / agents 开关 / 合奏 / 技能包 / 手动停用',
        matrixTaken: '技能包启用不会放宽源策略，最终取交集',
        matrixUncontrolled: 'GUI 斜杠菜单由宿主另一个服务读取，织音默认不接管',
        matrixReadOnly: '个技能属只读来源：只能启停，不改文件、不卸载',
        matrixNow: '当前',
        refCountTitle: '引用它的技能包',
        refCountNone: '没有被任何技能包引用',
        refCountShort: '引用',
        refCountHint: '停用其中一个包，只要另一个还在启用，技能依然有效',
        backupsTitle: '配置备份',
        backupsHint: '导入配置或回滚时自动留下；最多保留 20 份，新的在前',
        backupsEmpty: '还没有备份',
        backupsTime: '时间',
        backupsFile: '文件',
        backupsRollback: '回滚到这份',
        backupsAsk: '回滚到这份备份？当前配置会先另存一份备份。',
        backupsOpen: '备份列表',
      },
      en: {
        nav: 'Zhiyin',
        title: 'Zhiyin',
        subtitle: 'Group skills freely; let capabilities play together',
        refresh: 'Refresh',
        loading: 'Loading skill list…',
        failed: 'Load failed: ',
        takeoverOn: 'Switches live',
        takeoverOff: 'Not taken over',
        takeoverHintOn: 'Policy providers are mounted on running sessions; switches apply immediately.',
        takeoverHintOff: 'No running session yet; new sessions get the provider automatically.',
        statTotal: 'Skills',
        statModel: 'Model-invocable',
        statUser: 'User-only',
        statNeither: 'Internal only',
        budget: 'Catalog characters',
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
        packSelectedCount: '{n} of {m} selected',
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
        installHint: 'Paste a GitHub repo, skill folder, npx skills add command, raw SKILL.md link, or a local folder path; the skill name and its directory both follow the SKILL.md name',
        installPath: 'owner/repo, https://github.com/owner/repo, or D:\skills\my-skill',
        installAgents: 'Library ~/.agents/skills (linked into .dsh on install)',
        installMultiple: 'This repo has several skills; tick the ones to install:',
        installSelected: 'Install selected',
        installSelectedCount: '{n} of {m} selected',
        installAll: 'All',
        installNone: 'None',
        installProgress: 'Installing {i}/{n}…',
        installDone: 'Installed {n} skills',
        installPartial: 'Some installs failed: ',
        installFailed: 'Install failed: ',
        installUser: 'User ~/.dsh/skills (installed directly)',
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
        next: 'A pack switch decides whether its skills are visible to the agent; individual skills can be toggled anytime.',
        agentsRoot: 'Load ~/.agents/skills',
        agentsRootHint: 'Off: DSH only reads ~/.dsh/skills and project skills',
        agentsRootHintShort: 'On: reads ~/.agents/skills and ~/.dsh/skills together; off: only ~/.dsh/skills and project skills',
        disabledBadge: 'disabled',
        enabledBadge: 'enabled',
        toggleFailed: 'Toggle failed: ',
        reasonManual: 'disabled manually',
        reasonPack: 'pack disabled',
        reasonUnpacked: 'not in a pack',
        reasonAgents: 'agents switch off',
        toggleHint: 'Takes effect immediately',
        toggleBlocked: 'Blocked by a group switch: re-enable its pack or the master switch first',
        toggleUnpacked: 'Add it to an enabled pack first; the switch only turns it off inside a pack',
        exportConfig: 'Export config',
        exportConfigHint: 'Download a portable JSON snapshot (packs / disabled items)',
        exportConfigFailed: 'Export failed: ',
        importConfig: 'Import config',
        importConfigHint: 'Paste a previously exported JSON to overwrite the current config; the old one is backed up first',
        importConfigHint2: 'Paste the JSON you exported earlier. Importing overwrites the current packs and disabled items; the old config is backed up into the plugin state directory first.',
        rollback: 'Undo import',
        rollbackHint: 'Restore the state from before the most recent import (every import keeps a backup)',
        rollbackAsk: 'Roll back to the state before the last import? The current config is backed up first.',
        importConfigPlaceholder: '{\n  "schemaVersion": 1,\n  "packs": []\n}',
        importConfigRun: 'Import',
        importConfigOk: 'Import done',
        importConfigBadJson: 'Not valid JSON',
        importConfigMissing: 'members are not installed',
        packUnit: 'packs',
        observedAt: 'Updated',
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
        packDefault: 'default',
        packAllHint: 'Every visible skill; new skills join automatically. Turning it on turns the other packs off.',
        packCostUnit: 'chars',
        packNotInCombo: 'Not in active combo',
        packHiddenAgents: 'hidden by .agents switch',
              alertConflict: 'Duplicate skill names',
        alertFrom: 'sources',
        alertGhost: 'Pack references skills that are not installed',
        close: 'Close',
        enabled: 'Enabled',
        tabCombos: 'Combos',
        comboNew: 'New combo',
        comboNamePlaceholder: 'Combo name',
        comboNameRule: '1-40 characters; letters, digits, spaces, underscore and hyphen only',
        comboNameRuleShort: 'Name must be 1-40 characters',
        comboEmptyHint: 'No combos yet. A combo is a set of packs for one situation; you see the diff before it applies',
        comboEmptyHint2: 'No packs selected yet; use Choose packs',
        comboNoMatch: 'No matching combo',
        searchCombos: 'Search combo or its packs',
        comboPacksCount: 'packs',
        comboChoosePacks: 'Choose packs',
        comboApply: 'Apply',
        comboApplied: 'Active',
        comboIdle: 'Inactive',
        comboMenu: 'More actions',
        comboRename: 'Rename',
        comboDelete: 'Delete',
        comboDeleteAsk: 'Delete this combo? Packs and skills are untouched.',
        comboModeCompat: 'Compat mode',
        comboModeOrchestrated: 'Orchestrated',
        comboModeHintCompat: 'Observe only; the effective surface is untouched',
        comboModeHintOrchestrated: 'The effective surface follows the active combo: assigned packs play, unassigned skills do not',
        comboExit: 'Exit',
        comboPreviewTitle: 'Preview before applying',
        comboPreviewOn: 'Packs that will play',
        comboPreviewOff: 'Packs that will stop',
        comboPreviewEnable: 'Will join',
        comboPreviewHide: 'Will leave',
        comboPreviewUnassigned: 'unassigned skills will not play',
        comboPreviewNone: 'No visible change',
        comboPreviewChars: 'Catalog characters',
        comboRunApply: 'Apply combo',
        comboRunStack: 'Stack on current',
        comboNoPacks: 'No packs yet; create one in the Packs tab',
        exclude: 'Exclude',
        includeBack: 'Restore',
        excludeHint: 'Remove this skill from the effective surface; packs are untouched',
        excludedBadge: 'Excluded',
        alwaysOn: 'Always on',
        alwaysOnHint: 'Always plays, regardless of packs and combos',
        alwaysOnBadge: 'Always on',
        reasonExcluded: 'Excluded',
        reasonUnassigned: 'Unassigned',
        reasonCombo: 'Not in active combo',
        batchPick: 'Select for batch toggling',
        batchSelected: 'Selected',
        batchEnable: 'Enable all',
        batchDisable: 'Disable all',
        batchClear: 'Clear',
        alertUnassigned: 'Some unassigned skills do not play in orchestrated mode',
        alertUnpacked: 'Some skills are not in any pack and do not play',
        alertPackConflict: 'Pack conflict',
        note: 'Note',
        noteEdit: 'Edit note',
        noteView: 'View full note',
        noteViewTitle: 'Skill note',
        noteAdd: 'Add note',
        noteHint: 'Notes live in the local config only, never in skill files, and travel with config export.',
        notePlaceholder: 'e.g. keep for frontend reviews; revisit next project',
        noteEmpty: 'No note yet',
        comboConflictAsk: 'These packs conflict',
        comboConflictStill: 'Apply anyway and log it?',
        packConflicts: 'Declare conflicts',
        packConflictBadge: 'Conflict',
        conflictsHint: 'Tick the packs that conflict with this one; a conflict is mutual, and apply/enable is blocked unless you choose to apply anyway',
        conflictsEmpty: 'No other packs to declare against',
        consistencySynced: 'In sync',
        consistencyDegraded: 'Degraded',
        consistencyDrifted: 'Drifted',
        consistencyHintSynced: 'Observation matches projection',
        consistencyHintDegraded: 'Last observation was incomplete; last good projection kept',
        consistencyHintDrifted: 'Packs or combos reference skills that were not observed; out of sync with projection',
        readOnlyBadge: 'Read-only',
        readOnlyHintBundled: 'Bundled skill: Zhiyin only changes visibility, never its files',
        readOnlyHintExternal: 'External source: not in a Zhiyin-managed directory; toggle only',
        readOnlyHintRoot: 'Not in a Zhiyin-managed install root; toggle only',
        repair: 'Repair',
        repairAsk: 'Remove references to skills that were not observed from packs, combos and intent? The current config is backed up first.',
        repairOk: 'Removed stale references: ',
        repairNone: 'Nothing to repair',
        repairHint: 'Drop references to vanished skills so observation and projection agree again',
        matrixTitle: 'Effective-surface matrix',
        matrixSub: 'What controls each of the four surfaces — do not read "enabled" alone',
        matrixCatalog: 'Model catalog',
        matrixTool: 'skill tool',
        matrixSlash: '/name menu',
        matrixGet: 'Trusted get()',
        matrixBy: 'Controlled by',
        matrixCatalogBy: 'Ensemble member × model-invocable by source',
        matrixToolBy: 'Ensemble member × model-invocable by source',
        matrixSlashBy: 'Ensemble member × user-invocable by source',
        matrixGetBy: 'Ensemble member (source policy does not restrict)',
        matrixMemberBy: 'Membership: all-off / agents switch / orchestration / pack / manual disable',
        matrixTaken: 'Enabling a pack never relaxes the source policy; the result is the intersection',
        matrixUncontrolled: 'The GUI slash menu is read by another host service; Zhiyin does not take it over by default',
        matrixReadOnly: 'skills are read-only sources: toggle only, no file edits or uninstall',
        matrixNow: 'Now',
        refCountTitle: 'Packs referencing it',
        refCountNone: 'Referenced by no pack',
        refCountShort: 'Refs',
        refCountHint: 'Turn one pack off and the skill still plays as long as another pack is on',
        backupsTitle: 'Config backups',
        backupsHint: 'Written automatically on config import and rollback; at most 20 kept, newest first',
        backupsEmpty: 'No backups yet',
        backupsTime: 'Time',
        backupsFile: 'File',
        backupsRollback: 'Roll back to this',
        backupsAsk: 'Roll back to this backup? The current config is backed up first.',
        backupsOpen: 'Backups',
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
      costSection: { fontSize: 12.5, lineHeight: 1.6, opacity: 0.86, marginTop: 6 },
      costHead: { fontSize: 12, fontWeight: 600, marginTop: 12, color: 'var(--zhiyin-accent, #e0743c)' },
      costBullet: { fontSize: 12.5, lineHeight: 1.6, opacity: 0.86, marginTop: 4 },
      costLink: { color: 'var(--zhiyin-accent, #e0743c)', textDecoration: 'none' },
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
      // 生效面矩阵（FR-020）：四行，每行一个生效面 + 谁控制它 + 当前数量。
      matrixRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0,
        padding: '9px 14px',
        borderBottom: '1px solid rgba(128,128,128,0.10)',
      },
      matrixRowLast: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0,
        padding: '9px 14px',
      },
      matrixName: { fontSize: 12.5, fontWeight: 600, flex: '0 0 auto', minWidth: 88 },
      matrixBy: { fontSize: 12, opacity: 0.62, flex: '1 1 auto', minWidth: 0 },
      matrixNum: { fontSize: 12.5, opacity: 0.8, flex: '0 0 auto' },
      refBadge: { fontSize: 11, opacity: 0.72, flex: '0 0 auto' },
      budgetRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: '0 2px',
      },
      budgetLabel: { fontSize: 11.5, opacity: 0.55, flex: '0 0 auto' },
      budgetNum: { fontSize: 12, fontWeight: 600, flex: '0 0 auto' },
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
      // 备注编辑：清除/保存在编辑框内右下角并排，不弹外围按钮。
      noteEditWrap: { position: 'relative' },
      noteEditActions: { position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 4 },
      noteActBtn: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, borderRadius: 7, border: 'none', cursor: 'pointer',
        background: 'rgba(128,128,128,0.16)', color: 'inherit', opacity: 0.85,
      },
      noteActSave: { background: 'rgba(224,116,60,0.18)', color: 'var(--zhiyin-accent, #e0743c)' },
      clearBtn: {
        position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
        width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 999, border: 'none', cursor: 'pointer',
        background: 'rgba(128,128,128,0.22)', color: 'inherit', opacity: 0.7, padding: 0,
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
      // 批量条：选中若干技能后出现，一次提交只翻一遍目录。
      batchBar: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: '7px 10px',
        borderRadius: 12,
        background: 'rgba(224,116,60,0.10)',
      },
      pick: { flex: '0 0 auto', width: 14, height: 14, accentColor: 'var(--zhiyin-accent, #e0743c)', cursor: 'pointer' },
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
      // 原生 <option> 弹层不继承 select 样式，深色主题会白底浅字看不见——显式给深底浅字。
      optionStyle: {
        background: 'var(--vscode-editorWidget-background, #252526)',
        color: 'var(--vscode-foreground, #e6e6e6)',
      },
      // 技能卡网格
      // 瀑布流：按列宽自动分栏，卡片高度随内容变化，不再被同一行拉齐。
      cardGrid: {
        marginTop: 14,
        columnWidth: 320,
        columnGap: 12,
      },
      skillCard: {
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box',
        breakInside: 'avoid',
        marginBottom: 12,
        verticalAlign: 'top',
        flexDirection: 'column',
        gap: 10,
        borderRadius: 14,
        padding: '14px 16px',
        background: 'rgba(128,128,128,0.045)',
        border: '1px solid rgba(128,128,128,0.10)',
      },
      cardHead: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
      cardName: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 14,
        fontWeight: 600,
        flex: '0 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      cardDesc: {
        fontSize: 12.5,
        opacity: 0.64,
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: 20,
      },
      cardNote: {
        fontSize: 12,
        lineHeight: 1.5,
        padding: '6px 9px',
        borderRadius: 8,
        background: 'rgba(224,116,60,0.10)',
        borderLeft: '2px solid var(--zhiyin-accent, #e0743c)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: 84,
        overflow: 'hidden',
      },
      noteLine: {
        fontSize: 11.8,
        lineHeight: 1.45,
        marginTop: 4,
        paddingLeft: 8,
        borderLeft: '2px solid var(--zhiyin-accent, #e0743c)',
        opacity: 0.78,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
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
      sectionLabel: { fontSize: 11.5, opacity: 0.55, marginTop: 2 },
      previewList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxHeight: 168,
        overflowY: 'auto',
        fontSize: 12.5,
        lineHeight: 1.45,
      },
      cbRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 6px',
        borderRadius: 7,
        cursor: 'pointer',
        fontSize: 12.5,
      },
      mono: { fontFamily: 'var(--vscode-editor-font-family, monospace)', fontSize: 12.5 },
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
  layers: [
    ['path', 'm12 2 9 5-9 5-9-5 9-5Z'],
    ['path', 'm3 12 9 5 9-5'],
    ['path', 'm3 17 9 5 9-5'],
  ],
  eye: [
    ['path', 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z'],
    ['circle', { cx: 12, cy: 12, r: 3 }],
  ],
  ban: [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    ['path', 'm4.9 4.9 14.2 14.2'],
  ],
  pin: [
    ['path', 'M12 17v5'],
    ['path', 'M9 10.7V4h6v6.7l2 2.3H7l2-2.3Z'],
  ],
  check: [
    ['path', 'm20 6-11 11-5-5'],
  ],
  edit: [
    ['path', 'M12 20h9'],
    ['path', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z'],
  ],
  download: [
    ['path', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'],
    ['path', 'm7 10 5 5 5-5'],
    ['path', 'M12 15V3'],
  ],
  upload: [
    ['path', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'],
    ['path', 'm17 8-5-5-5 5'],
    ['path', 'M12 3v12'],
  ],
  undo: [
    ['path', 'M9 14 4 9l5-5'],
    ['path', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  ],
  history: [
    ['path', 'M3 12a9 9 0 1 0 3-6.7L3 8'],
    ['path', 'M3 3v5h5'],
    ['path', 'M12 7v5l4 2'],
  ],
  sort: [
    ['path', 'M8 4v16'],
    ['path', 'm5 7 3-3 3 3'],
    ['path', 'M16 20V4'],
    ['path', 'm13 17 3 3 3-3'],
  ],
  packagePlus: [
    ['path', 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14'],
    ['path', 'M3.29 7 12 12l8.71-5'],
    ['path', 'M12 22V12'],
    ['path', 'M16 16h6'],
    ['path', 'M19 13v6'],
  ],
  search: [
    ['circle', { cx: 11, cy: 11, r: 7 }],
    ['path', 'm21 21-4.3-4.3'],
  ],
  info: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', 'M12 11v6'],
    ['circle', { cx: 12, cy: 7.6, r: 0.6, fill: 'currentColor', stroke: 'none' }],
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

function ClearField({ value, onChange, style, wrapperStyle, multiline = false, clearLabel = '清除', ...rest }) {
  // 输入框内联「清除」X：所有文本输入共用，避免外围再加一排按钮。
  // 注意：这里是模块级组件，不能调用 Page 内部的 say（会在有值渲染 X 时抛 ReferenceError）。
  const clear = value
    ? h('button', {
        type: 'button',
        tabIndex: -1,
        title: clearLabel,
        'aria-label': clearLabel,
        onMouseDown: (event) => event.preventDefault(),
        onClick: () => onChange({ target: { value: '' } }),
        style: multiline ? { ...css.clearBtn, top: 8, transform: 'none' } : css.clearBtn,
      }, h(Icon, { name: 'close', size: 12 }))
    : null
  return h(
    'span',
    { style: { position: 'relative', display: 'block', ...wrapperStyle } },
    multiline
      ? h('textarea', { ...rest, value, onChange, style: { ...style, width: '100%', boxSizing: 'border-box', paddingRight: 30 } })
      : h('input', { ...rest, value, onChange, style: { ...style, width: '100%', boxSizing: 'border-box', paddingRight: 30 } }),
    clear,
  )
}

function formatInstalls(value) {
  const n = Number(value) || 0
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function Spinner({ size = 15 }) {
  // 旋转小圈：替代把长文本塞进 30x30 图标按钮（会竖排）的做法。用 SVG SMIL，无需注入 CSS。
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': 'true',
    style: { display: 'block', flex: '0 0 auto' },
  },
    h('g', null,
      h('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 12 12', to: '360 12 12', dur: '0.9s', repeatCount: 'indefinite' }),
      h('circle', { cx: 12, cy: 12, r: 9, fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeOpacity: 0.25 }),
      h('path', { d: 'M21 12a9 9 0 0 0-9-9', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' }),
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
        { style: { flex: '0 0 auto', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, display: 'inline-flex' }, title: title ?? undefined },
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
      const [installSkill, setInstallSkill] = React.useState('')
      const [installTarget, setInstallTarget] = React.useState('agents')
      const [installError, setInstallError] = React.useState('')
      const [installCandidates, setInstallCandidates] = React.useState([])
      const [installSelected, setInstallSelected] = React.useState([])
      const [installProgress, setInstallProgress] = React.useState('')
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
      const [selectedNames, setSelectedNames] = React.useState([])      // 批量提交选中的技能名
      const [noteEditing, setNoteEditing] = React.useState(null)       // 正在编辑备注的技能名；null 表示关闭
      const [noteDraft, setNoteDraft] = React.useState('')
      const [noteViewing, setNoteViewing] = React.useState(null)     // 查看完整备注的技能；null 表示关闭
      const [backups, setBackups] = React.useState(null)               // 配置备份列表
      const [backupsOpen, setBackupsOpen] = React.useState(false)      // 备份列表弹窗
      // 技能市场（skills.sh）：热门默认、关键词搜索、一键安装到 SSOT。
      const [marketQuery, setMarketQuery] = React.useState('')
      const [marketItems, setMarketItems] = React.useState([])
      const [marketTrending, setMarketTrending] = React.useState(true)
      const [marketLoading, setMarketLoading] = React.useState(false)
      const [marketError, setMarketError] = React.useState('')
      const [marketLoaded, setMarketLoaded] = React.useState(false)
      const [marketDesc, setMarketDesc] = React.useState({})
      // 归档：被「卸载」移入 archive 的技能，可查看并恢复到指定目录。
      const [archiveEntries, setArchiveEntries] = React.useState([])
      const [archiveLoading, setArchiveLoading] = React.useState(false)
      const [archiveError, setArchiveError] = React.useState('')
      const [archiveTarget, setArchiveTarget] = React.useState('origin')
      const [costInfoOpen, setCostInfoOpen] = React.useState(false)
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

      const loadArchive = React.useCallback(() => {
        setArchiveLoading(true)
        setArchiveError('')
        fetch('/zhiyin/archive', { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then((payload) => setArchiveEntries(Array.isArray(payload?.entries) ? payload.entries : []))
          .catch((error) => setArchiveError(String(error?.message ?? error)))
          .finally(() => setArchiveLoading(false))
      }, [])
      React.useEffect(() => { loadArchive() }, [loadArchive])
      const restoreArchived = (entry) => {
        setArchiveError('')
        setBusy(true)
        fetch('/zhiyin/restore', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ key: entry.key, target: archiveTarget }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result || result.ok !== true) throw new Error(result?.error ?? '恢复失败')
            loadArchive()
            load()
          })
          .catch((error) => setArchiveError(String(error?.message ?? error)))
          .finally(() => setBusy(false))
      }

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

      // 安装：一个输入框收链接或本地路径；返回多个技能时列出来，勾选后一次装完。
      const clearInstall = () => {
        setInstallCandidates([])
        setInstallSelected([])
        setInstallProgress('')
        setInstallError('')
        setInstalling(false)
        setInstallPath('')
        setInstallSkill('')
      }

      const runInstall = (subpath) => {
        const text = installPath.trim()
        if (!text) return
        setBusy(true)
        setInstallError('')
        fetch('/zhiyin/install', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            text,
            target: installTarget,
            ...(subpath === undefined ? {} : { subpath }),
            ...(installSkill ? { skill: installSkill } : {}),
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result?.ok === true) {
              clearInstall()
              load()
              return
            }
            if (result?.error === 'multiple') {
              const candidates = result.candidates ?? []
              setInstallCandidates(candidates)
              // 市场点选的技能没匹配到时，不要把整仓库默认勾上。
              setInstallSelected(installSkill ? [] : candidates.map((candidate) => candidate.subpath))
              return
            }
            setInstallError(result?.error ?? '安装失败')
          })
          .catch((error) => setInstallError(String(error?.message ?? error)))
          .finally(() => setBusy(false))
      }

      // 多技能：一次 clone 后端批量装入，勾选顺序即安装顺序。
      const runInstallSelected = () => {
        const text = installPath.trim()
        if (!text || installSelected.length === 0) return
        setBusy(true)
        setInstallError('')
        setInstallProgress(say('installProgress', '正在安装 {i}/{n}…').replace('{i}', '1').replace('{n}', String(installSelected.length)))
        fetch('/zhiyin/install/batch', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text, subpaths: installSelected, target: installTarget }),
        })
          .then((response) => response.json())
          .then((result) => {
            const done = result?.installed?.length ?? 0
            const failed = result?.failed ?? []
            load()
            if (failed.length === 0) {
              clearInstall()
              return
            }
            const detail = failed.map((item) => `${item.subpath || '(root)'}：${item.error}`).join('；')
            setInstallProgress(`${say('installDone', '已安装 {n} 个技能').replace('{n}', String(done))}`)
            setInstallError(`${say('installPartial', '部分安装失败：')}${detail}`)
            setInstallCandidates((previous) =>
              previous.filter((candidate) => failed.some((item) => item.subpath === candidate.subpath)),
            )
            setInstallSelected(failed.map((item) => item.subpath).filter(Boolean))
          })
          .catch((error) => setInstallError(String(error?.message ?? error)))
          .finally(() => setBusy(false))
      }

      // 技能市场：宿主代理由 skills.sh（浏览器跨域拿不到）；空查询 = 热门。
      const loadMarket = React.useCallback((q) => {
        setMarketLoaded(true)
        setMarketLoading(true)
        setMarketError('')
        fetch('/zhiyin/market?q=' + encodeURIComponent(q || '') + '&limit=40', { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then((payload) => {
            if (!payload || payload.ok !== true) throw new Error(payload?.error ?? '请求失败')
            setMarketItems(Array.isArray(payload.skills) ? payload.skills : [])
            setMarketDesc({})
            setMarketTrending(payload.trending !== false)
          })
          .catch((error) => setMarketError(String(error?.message ?? error)))
          .finally(() => setMarketLoading(false))
      }, [])
      // 市场点安装：打开安装弹窗，先选安装目录（与「通过地址安装」一致），再装这一个技能。
      const installFromMarket = (item) => {
        if (!item?.source || item.installable === false) return
        setInstallPath(item.source)
        setInstallSkill(item.skillId || item.name)
        setInstallTarget('agents')
        setInstallError('')
        setInstallCandidates([])
        setInstallSelected([])
        setInstallProgress('')
        setInstalling(true)
      }
      React.useEffect(() => {
        if (tab === 'market' && !marketLoaded) loadMarket('')
      }, [tab, marketLoaded, loadMarket])
      // 技能描述：搜索 API 不含描述，前 12 张卡片按需从详情页取（宿主代理 + 缓存）。
      React.useEffect(() => {
        if (!marketItems.length) return undefined
        const missing = marketItems
          .slice(0, 12)
          .filter((item) => item.id && !Object.prototype.hasOwnProperty.call(marketDesc, item.id))
        if (missing.length === 0) return undefined
        let cancelled = false
        Promise.all(
          missing.map((item) =>
            fetch('/zhiyin/market/desc?source=' + encodeURIComponent(item.source) + '&skill=' + encodeURIComponent(item.skillId), { headers: { accept: 'application/json' } })
              .then((response) => response.json())
              .then((payload) => [item.id, typeof payload?.description === 'string' ? payload.description : ''])
              .catch(() => [item.id, '']),
          ),
        ).then((pairs) => {
          if (cancelled) return
          setMarketDesc((previous) => {
            const next = { ...previous }
            for (const [id, text] of pairs) next[id] = text
            return next
          })
        })
        return () => { cancelled = true }
      }, [marketItems, marketDesc])

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

      // FR-017 观测刷新：从别的窗口/工具（如 AI Vault）装完或删掉技能后，
      // 切回本页或页面重新可见时自动重取，不必手动点刷新。3 秒节流，避免反复切换窗口时反复拉取。
      React.useEffect(() => {
        let last = 0
        const refresh = () => {
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
          const now = Date.now()
          if (now - last < 3000) return
          last = now
          load()
        }
        window.addEventListener('focus', refresh)
        document.addEventListener('visibilitychange', refresh)
        return () => {
          window.removeEventListener('focus', refresh)
          document.removeEventListener('visibilitychange', refresh)
        }
      }, [load])

      // 点空白处收起技能包 … 菜单
      React.useEffect(() => {
        if (!menuOpen) return undefined
        const close = () => setMenuOpen(null)
        window.addEventListener('click', close)
        return () => window.removeEventListener('click', close)
      }, [menuOpen])

      const data = state.data

      // 一致性修复：只剪掉指向已消失技能的引用，不猜技能去哪了；后端先备份。
      const repairDrift = React.useCallback(() => {
        const drift = data?.consistency?.drift ?? []
        const ask = say('repairAsk', '把观测不到的引用从技能包 / 组合 / 意图里剪掉？当前配置会先备份。')
        if (!window.confirm(drift.length > 0 ? ask + '\n\n' + drift.join('、') : ask)) return
        write('/zhiyin/repair', {}).then((result) => {
          if (!result || result.ok !== true) return
          const removed = result.missing ?? []
          window.alert(result.changed === true
            ? say('repairOk', '已剪掉失效引用：') + (removed.length > 0 ? removed.join('、') : '—')
            : say('repairNone', '没有需要修复的引用'))
        })
      }, [data, write, say])

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
        const bySource = { userDsh: 0, userAgents: 0, bundled: 0, custom: 0 }
        for (const skill of scoped) {
          if (skill.source === 'user-dsh') bySource.userDsh += 1
          else if (skill.source === 'user-agents') bySource.userAgents += 1
          else if (skill.source === 'bundled') bySource.bundled += 1
          else bySource.custom += 1
        }
        const bundled = bySource.bundled
        // 已停用 = 被总开关/.agents 开关/技能包/单技能开关挡住的（文件仍在盘上）。
        const disabled = scoped.filter((skill) => skill.enabled === false).length
        // 不可直接调用 = 两个入口都关、但技能本身仍在生效（源限制），与"已停用"区分开。
        const internal = scoped.filter((skill) => skill.enabled !== false && !skill.model && !skill.user).length
        // 「全部技能」的目录字符成本按可见世界算，与卡片同口径。
        const allCost = scoped.reduce((total, skill) => total + Math.min((skill.description ?? '').length, 500), 0)
        return { total: scoped.length, model, user, both, neither, bundled, disabled, internal, bySource, allCost }
      }, [scoped])

      // 来源构成：解释「技能总数」怎么来的（用户目录 / .agents 目录 / 内置 / 自定义）。
      const srcLine = [
        ['用户目录', counts.bySource.userDsh],
        ['.agents 目录', counts.bySource.userAgents],
        ['内置', counts.bySource.bundled],
        ['自定义', counts.bySource.custom],
      ].filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join(' · ')

      const skills = React.useMemo(() => {
        const needle = query.trim().toLowerCase()
        const filtered = scoped.filter((skill) => {
          if (filter === 'model' && !skill.model) return false
          if (filter === 'user' && !(skill.user && !skill.model)) return false
          if (filter === 'disabled' && skill.enabled !== false) return false
      if (filter === 'internal' && (skill.enabled === false || skill.model || skill.user)) return false
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

      const sourceLabel = (skill) => {
        const root = skill.root
          ? skill.root.replace(/^[A-Za-z]:\\Users\\[^\\]+\\/, '~/').replace(/\\/g, '/')
          : null
        if (root) return root
        if (skill.source === 'bundled') return say('sourceBundled', '内置')
        if (skill.source === 'custom') return say('sourceCustom', '自定义目录')
        return skill.source
      }
      const originLabel = (target) => {
        if (target === 'agents') return say('originAgents', '技能库 ~/.agents/skills')
        if (target === 'user') return say('originUser', '用户目录 ~/.dsh/skills')
        if (target === 'project') return say('originProject', '项目 .dsh/skills')
        return say('originUnknown', '未知')
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
        if (reason === 'unpacked') return say('reasonUnpacked', '未加入技能包')
        if (reason === 'pack') return say('reasonPack', '技能包停用')
        if (reason === 'agents-root') return say('reasonAgents', 'agents 开关关闭')
        if (reason === 'all-off') return say('reasonAllOff', '全部停用')
        if (reason === 'excluded') return say('reasonExcluded', '已排除')
        if (reason === 'unassigned') return say('reasonUnassigned', '未编配')
        if (reason === 'combo') return say('reasonCombo', '组合未纳入')
        return ''
      }
      const readOnlyHint = (skill) => {
        if (skill.readOnlyReason === 'bundled') return say('readOnlyHintBundled', '内置技能：织音只改可见性，不改动它的文件')
        if (skill.readOnlyReason === 'external') return say('readOnlyHintExternal', '外部来源：不在织音管理的目录里，只能启停')
        return say('readOnlyHintRoot', '不在织音管理的安装目录里，只能启停')
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
      // 全部观测到的技能名（不受 .agents 开关影响）：判断「未安装」只能用它。
      const observedNames = React.useMemo(() => new Set((data?.skills ?? []).map((skill) => skill.name)), [data])

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
        // 默认包没有静态成员：状态只看它自己的开关，成员数按观测到的技能算。
        if (pack.all) {
          const total = pack.memberCount ?? 0
          return { kind: pack.enabled !== false ? 'all' : 'none', on: total, total }
        }
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

      // 合奏意图：组合页已移除，此处仅保留给告警文案判断是否接管。
      const intent = data?.intent ?? { mode: 'compat', activePackIds: [], alwaysOnSkillNames: [], excludedSkillNames: [] }

      const fail = (error) => setState((prev) => ({ ...prev, error: String(error?.message ?? error) }))
      // 批量提交（FR-023）：多个开关只发一次请求，宿主一次写盘、一次投影。
      const toggleSelected = (name) =>
        setSelectedNames((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
      const runBatch = (enabled) => {
        if (selectedNames.length === 0) return
        setBusy(true)
        fetch('/zhiyin/skill', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ names: selectedNames, enabled }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result || result.ok !== true) throw new Error(result?.error ?? 'rejected')
            setSelectedNames([])
            load()
          })
          .catch(fail)
          .finally(() => setBusy(false))
      }
      // 技能备注：打开弹窗填一份本地笔记，跟着导出/导入走。
      const openNote = (skill) => {
        setNoteDraft(skill.note ?? '')
        setNoteEditing(skill.name)
      }
      const saveNote = () => {
        if (!noteEditing) return
        write('/zhiyin/note', { name: noteEditing, note: noteDraft }).then((result) => {
          if (result) setNoteEditing(null)
        })
      }

      // 备份列表（FR-025）：把导入/回滚留下的快照列出来，可任选一份退回。
      const loadBackups = React.useCallback(() => {
        fetch('/zhiyin/backups', { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response.json()
          })
          .then((payload) => setBackups(Array.isArray(payload?.backups) ? payload.backups : []))
          .catch((error) => setBackups({ error: String(error?.message ?? error) }))
      }, [])
      React.useEffect(() => {
        if (backupsOpen) loadBackups()
      }, [backupsOpen, loadBackups])
      const rollbackTo = (file) => {
        if (!window.confirm(say('backupsAsk', '回滚到这份备份？当前配置会先另存一份备份。'))) return
        setBusy(true)
        fetch('/zhiyin/rollback', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ file }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result || result.ok !== true) throw new Error(result?.error ?? 'rejected')
            setBackupsOpen(false)
            load()
          })
          .catch(fail)
          .finally(() => setBusy(false))
      }

      // 告警：同名冲突 / 包内引用了未安装技能（目录成本只展示，不设阈值，避免误导新用户）
      const alerts = React.useMemo(() => {
        const out = []
        if (data && Array.isArray(data.conflicts)) {
          for (const conflict of data.conflicts) {
            out.push({ key: 'conflict:' + conflict.name, text: `${say('alertConflict', '同名技能冲突')}：${conflict.name}（${conflict.count} ${say('alertFrom', '个来源')}）` })
          }
        }
        const unassigned = intent.mode === 'orchestrated'
          ? scoped.filter((skill) => skill.hiddenReason === 'unassigned').length
          : 0
        if (unassigned > 0) {
          out.push({ key: 'unassigned', text: `${say('alertUnassigned', '合奏模式下有未编配技能不生效')}：${unassigned}` })
        }
        const unpacked = scoped.filter((skill) => skill.hiddenReason === 'unpacked').length
        if (unpacked > 0) {
          out.push({ key: 'unpacked', text: `${say('alertUnpacked', '有技能未加入技能包，当前不生效')}：${unpacked}` })
        }
        // 只对「启用中的包」提醒，且按全部观测技能判断：被 .agents 开关挡住的技能仍然装着，不算未安装。
        for (const pack of data?.packs ?? []) {
          if (pack.enabled === false) continue
          const ghosts = (pack.members ?? []).filter((name) => !observedNames.has(name))
          if (ghosts.length > 0) {
            out.push({ key: 'ghost:' + pack.id, text: `${say('alertGhost', '技能包引用了未安装技能')} · ${pack.name}：${ghosts.slice(0, 4).join('、')}${ghosts.length > 4 ? ' …' : ''}` })
          }
        }

        return out
      }, [data, say, intent, scoped, observedNames])

      // 生效面矩阵（FR-020）：模型目录 / skill 工具 / /name 菜单 / 可信 get() 各自谁控制。
      // 数量按「当前作用域里真正生效的技能」取，与隐藏原因保持一致。
      const matrix = React.useMemo(() => {
        const playing = scoped.filter((skill) => skill.enabled !== false)
        return {
          catalog: {
            name: say('matrixCatalog', '模型目录'),
            by: say('matrixCatalogBy', '合奏成员 × 源允许模型'),
            n: playing.filter((skill) => skill.model).length,
          },
          tool: {
            name: say('matrixTool', 'skill 工具'),
            by: say('matrixToolBy', '合奏成员 × 源允许模型'),
            n: playing.filter((skill) => skill.model).length,
          },
          slash: {
            name: say('matrixSlash', '/name 菜单'),
            by: say('matrixSlashBy', '合奏成员 × 源允许用户'),
            n: playing.filter((skill) => skill.user).length,
          },
          get: {
            name: say('matrixGet', '可信 get()'),
            by: say('matrixGetBy', '合奏成员（源策略不限制）'),
            n: playing.length,
          },
        }
      }, [scoped, say])

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
            h('button', {
              type: 'button',
              style: css.iconBtn,
              disabled: busy,
              title: say('exportConfigHint', '导出一份可移植的 JSON 配置（技能包 / 停用项）'),
              'aria-label': say('exportConfig', '导出配置'),
              onClick: exportConfig,
            }, h(Icon, { name: 'download', size: 15 })),
            h('button', {
              type: 'button',
              style: css.iconBtn,
              disabled: busy,
              title: say('importConfigHint', '粘贴此前导出的 JSON 覆盖当前配置；旧配置会自动备份'),
              'aria-label': say('importConfig', '导入配置'),
              onClick: () => {
                setImportConfigText('')
                setImportResult(null)
                setImportingConfig(true)
              },
            }, h(Icon, { name: 'upload', size: 15 })),
            h('button', {
              type: 'button',
              style: css.iconBtn,
              disabled: busy,
              title: say('rollbackHint', '退回最近一次导入前的状态（每次导入都会留一份备份）'),
              'aria-label': say('rollback', '撤销上次'),
              onClick: () => {
                if (!window.confirm(say('rollbackAsk', '回滚到最近一次导入前的状态？当前配置会先另存一份备份。'))) return
                setBusy(true)
                fetch('/zhiyin/rollback', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: '{}',
                })
                  .then((response) => response.json())
                  .then((result) => {
                    if (!result || result.ok !== true) throw new Error(result?.error ?? 'rejected')
                    load()
                  })
                  .catch((error) => setState((prev) => ({ ...prev, error: String(error?.message ?? error) })))
                  .finally(() => setBusy(false))
              },
            }, h(Icon, { name: 'undo', size: 15 })),
            h('button', {
              type: 'button',
              style: css.iconBtn,
              disabled: busy,
              title: say('backupsHint', '导入配置或回滚时自动留下；最多保留 20 份，新的在前'),
              'aria-label': say('backupsOpen', '备份列表'),
              onClick: () => setBackupsOpen(true),
            }, h(Icon, { name: 'history', size: 15 })),
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

        h('p', { style: { ...css.hint, marginTop: 10 } }, say('next', '技能包开关决定包内技能是否对 agent 可见；单个技能也可以随时停用。')),

        // 元信息条：版本 · 观测时间 ｜ 右侧主按钮（全部停用/全部启用）
        data
          ? h(
              'div',
              { style: css.metaBar },
              h('span', null, `@local/dsh-zhiyin-proto v${data.version ?? '0.0.0'}`),
              h('span', { style: css.metaDot }, '·'),
              h('span', null, `${say('observedAt', '观测于')} ${formatTime(data.at)}`),
              h(
                'span',
                {
                  style: { ...css.pill(data.consistency?.status === 'synced'), cursor: 'default' },
                  title:
                    data.consistency?.status === 'degraded'
                      ? say('consistencyHintDegraded', '上次观测不完整，保留上次成功投影')
                      : data.consistency?.status === 'drifted'
                        ? `${say('consistencyHintDrifted', '有技能被外部改动或来源切换，与投影不一致')}：${(data.consistency?.drift ?? []).slice(0, 4).join('、')}`
                        : say('consistencyHintSynced', '观测与投影一致'),
                },
                data.consistency?.status === 'degraded'
                  ? say('consistencyDegraded', '观测不完整')
                  : data.consistency?.status === 'drifted'
                    ? say('consistencyDrifted', '有漂移')
                    : say('consistencySynced', '一致'),
              ),
              data.consistency?.status === 'drifted' && data.complete !== false
                ? h(
                    'button',
                    {
                      type: 'button',
                      style: { ...css.btn, padding: '2px 9px', fontSize: 11.5 },
                      disabled: busy,
                      title: say('repairHint', '清理指向已消失技能的引用，让观测与投影重新一致'),
                      onClick: repairDrift,
                    },
                    say('repair', '修复'),
                  )
                : null,
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
              null,
              h('div', { style: { ...css.grid, marginTop: 18 } }, statCards(data, counts, say, filter, setFilter)),
              h('div', { style: { ...css.hint, marginTop: 8 } }, `${say('statBySource', '来源')}：${srcLine}`),
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
                {
                  style: { ...css.groupRowLast, cursor: 'pointer' },
                  onClick: () => setCostInfoOpen(true),
                  title: say('costInfoTip', '点开看这个数字的含义、建议与出处'),
                },
                h(
                  'div',
                  { style: css.groupMain },
                  h(
                    'div',
                    { style: css.groupTitle },
                    h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4 } },
                      say('budget', '目录字符数'),
                      h(Icon, { name: 'info', size: 12 }),
                    ),
                    h('span', { style: { ...css.budgetNum, marginLeft: 8 } }, String(data.catalogChars)),
                  ),
                  h('div', { style: css.groupDesc },
                    data.complete ? say('complete', '观测完整') : say('incomplete', '观测不完整')),
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
                h('button', { type: 'button', style: tab === 'market' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('market') }, say('tabMarket', '技能市场')),
                h('button', { type: 'button', style: tab === 'archive' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('archive') }, `${say('tabArchive', '归档')} ${archiveEntries.length}`),
    
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
              }, state.loading ? h(Spinner, { size: 15 }) : h(Icon, { name: 'refresh', size: 14 })),
            )
          : null,

        // 工具条：分组动作 · 搜索（占满）· 排序 / 安装（技能市场页用自带搜索）
        data && tab !== 'market' && tab !== 'archive'
          ? h(
              'div',
              { style: css.toolbar },
              tab === 'packs'
                ? h('span', { style: { display: 'inline-flex', gap: 6 } },
                    h('button', { type: 'button', style: css.iconBtn, title: say('packNew', '新建技能包'), 'aria-label': say('packNew', '新建技能包'), onClick: () => { setDraftName(''); setCreating(true) }, disabled: busy }, h(Icon, { name: 'plus', size: 14 })),
                    h('button', { type: 'button', style: css.iconBtn, title: say('packImport', '导入 txt 技能包'), 'aria-label': say('packImport', '导入 txt 技能包'), onClick: () => { setImportText(''); setImportPath(''); setImportName(''); setImporting(true) }, disabled: busy }, h(Icon, { name: 'import', size: 14 })),
                  )
                : null,
              h(ClearField, {
                wrapperStyle: { flex: '1 1 220px', minWidth: 0 },
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
                    h(Icon, { name: 'sort', size: 13 }),
                    say('sortBy', '排序'),
                    h('select', {
                      style: css.sortSelect,
                      value: sortField,
                      onChange: (event) => setSortField(event.target.value),
                    },
                      h('option', { value: 'name', style: css.optionStyle }, say('sortName', '名称')),
                      h('option', { value: 'source', style: css.optionStyle }, say('sortSource', '来源')),
                      h('option', { value: 'chars', style: css.optionStyle }, say('sortChars', '字符数')),
                      h('option', { value: 'enabled', style: css.optionStyle }, say('sortEnabled', '启用状态')),
                    ),
                  )
                : null,
              tab === 'list'
                ? h(
                    'button',
                    {
                      type: 'button',
                      style: { ...css.primaryBtn, display: 'inline-flex', alignItems: 'center', gap: 6 },
                      title: say('installHintShort', '从 skills.sh / GitHub / 本地安装技能'),
                      'aria-label': say('install', '安装技能'),
                      disabled: busy,
                      onClick: () => {
                        setInstallPath('')
                        setInstallSkill('')
                        setInstallTarget('agents')
                        setInstallError('')
                        setInstallCandidates([])
                        setInstallSelected([])
                        setInstallProgress('')
                        setInstalling(true)
                      },
                    },
                    h(Icon, { name: 'packagePlus', size: 15 }),
                    say('install', '安装技能'),
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
                const ghosts = (pack.members ?? []).filter((name) => !observedNames.has(name))
                const hiddenAgents = (pack.members ?? []).filter((name) => observedNames.has(name) && !scopedNames.has(name))
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
                      h('span', { style: css.badge(true) }, `${pack.all ? counts.total : (pack.memberCount ?? pack.members?.length ?? 0)} 个技能`),
                      pack.all ? h('span', { style: { ...css.badge(true), opacity: 0.7 } }, say('packDefault', '默认')) : null,
                      (pack.all ? counts.allCost : pack.cost) > 0 ? h('span', { style: css.metaText }, `${pack.all ? counts.allCost : pack.cost} ${say('packCostUnit', '字符')}`) : null,

                      h('span', { style: { ...packStatusStyle(status), marginLeft: 'auto' } }, packStatusLabel(status)),
                    ),
                    pack.all
                      ? h('div', { style: css.desc }, say('packAllHint', '包含当前能看到的全部技能，新技能自动加入；开它，具体技能包自动关闭'))
                      : pack.members?.length
                      ? h(
                          'div',
                          { style: css.desc },
                          pack.members.slice(0, 6).join(' · ') +
                            (pack.members.length > 6 ? ` … +${pack.members.length - 6}` : '') +
                            (ghosts.length ? `  ·  ${say('packGhost', '未安装')} ${ghosts.length}` : '') +
                            (hiddenAgents.length ? `  ·  ${say('packHiddenAgents', '被 .agents 开关挡住')} ${hiddenAgents.length}` : ''),
                        )
                      : h('div', { style: css.desc }, say('packEmptyHint2', '还没有成员')),
                  ),
                  pack.all ? null : h(
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
                  pack.all ? null : h(
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

        !data
          ? h('p', { style: { ...css.hint, marginTop: 12 } }, say('loading', '正在读取技能列表…'))
          : null,

        // 技能市场（skills.sh）：热门默认、关键词搜索、一键安装
        data && tab === 'market'
          ? h(
              'div',
              null,
              h(
                'div',
                { style: css.toolbar },
                h(ClearField, {
                  wrapperStyle: { flex: '1 1 220px', minWidth: 0 },
                  style: css.input,
                  value: marketQuery,
                  placeholder: say('marketSearchPlaceholder', '搜索 skills.sh 技能（至少 2 个字符；留空看热门）'),
                  onChange: (event) => setMarketQuery(event.target.value),
                  onKeyDown: (event) => { if (event.key === 'Enter') loadMarket(marketQuery) },
                }),
                h(
                  'button',
                  {
                    type: 'button',
                    style: { ...css.btn, display: 'inline-flex', alignItems: 'center', gap: 6 },
                    disabled: marketLoading,
                    onClick: () => loadMarket(marketQuery),
                  },
                  marketLoading ? h(Spinner, { size: 14 }) : h(Icon, { name: 'search', size: 14 }),
                  say('marketSearch', '搜索'),
                ),
              ),
              h(
                'div',
                { style: { ...css.hint, marginTop: 8 } },
                marketTrending
                  ? say('marketTrending', '热门技能（按安装量排序）')
                  : `${say('marketResult', '搜索结果')}：${marketItems.length}`,
              ),
              marketError
                ? h('div', { style: { ...css.hint, marginTop: 8, color: '#d05a4a' } }, marketError)
                : null,
              marketLoading && marketItems.length === 0
                ? h('div', { style: { ...css.hint, marginTop: 10 } }, say('marketLoading', '正在读取技能市场…'))
                : null,
              !marketLoading && marketItems.length === 0 && !marketError
                ? h('div', { style: { ...css.hint, marginTop: 10 } }, say('marketEmpty', '没有找到技能；换个关键词试试'))
                : null,
              h(
                'div',
                { style: { ...css.cardGrid, marginTop: 12 } },
                marketItems.map((item) => {
                  const installed = (data.skills ?? []).some((skill) => skill.name === item.name)
                  const desc = marketDesc[item.id]
                  const descKnown = Object.prototype.hasOwnProperty.call(marketDesc, item.id)
                  return h(
                    'div',
                    { key: item.id || item.source + '/' + item.name, style: css.skillCard },
                    h(
                      'div',
                      { style: css.cardHead },
                      h('a', {
                        href: item.url || ('https://www.skills.sh/' + item.source + '/' + item.skillId),
                        target: '_blank',
                        rel: 'noreferrer',
                        title: say('marketOpen', '在 skills.sh 打开技能页'),
                        style: { ...css.cardName, color: 'inherit', textDecoration: 'none', cursor: 'pointer', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                      }, item.name),
                      h('span', { style: { ...css.badge(true), flex: '0 0 auto' } }, item.source),
                      installed
                        ? h('span', { style: { ...css.badge(true), flex: '0 0 auto', background: 'rgba(74,157,106,0.18)' } }, say('marketInstalled', '已安装'))
                        : item.installable === false
                          ? h('span', { style: { ...css.badge(true), flex: '0 0 auto', opacity: 0.7 }, title: say('marketHostedHint', 'skills.sh 托管技能（非 GitHub 仓库），暂不支持直接安装') }, say('marketHostedBadge', '托管'))
                          : null,
                    ),
                    desc
                      ? h('div', { style: css.cardDesc }, desc)
                      : h('div', { style: { ...css.cardDesc, opacity: 0.45 } }, descKnown ? say('marketNoDesc', '暂无描述') : '…'),
                    h(
                      'div',
                      { style: css.cardFoot },
                      h('span', { style: { ...css.hint, flex: '0 0 auto' } }, `${formatInstalls(item.installs)} ${say('marketInstalls', '次安装')}`),
                      h('span', { style: { flex: '1 1 auto' } }),
                      h(
                        'button',
                        {
                          type: 'button',
                          style: css.iconBtn,
                          title: installed
                            ? say('marketInstalled', '已安装')
                            : item.installable === false
                              ? say('marketHostedHint', 'skills.sh 托管技能（非 GitHub 仓库），暂不支持直接安装')
                              : say('install', '安装技能'),
                          'aria-label': installed ? say('marketInstalled', '已安装') : say('install', '安装技能'),
                          disabled: installed || item.installable === false,
                          onClick: () => installFromMarket(item),
                        },
                        h(Icon, { name: 'packagePlus', size: 14 }),
                      ),
                    ),
                  )
                }),
              ),
            )
          : null,

        // 归档：被「卸载」移入 archive 的技能，可查看并恢复到指定目录
        data && tab === 'archive'
          ? h(
              'div',
              null,
              h(
                'div',
                { style: css.toolbar },
                h(
                  'label',
                  { style: css.sortWrap },
                  say('restoreTarget', '恢复到'),
                  h(
                    'select',
                    {
                      style: css.sortSelect,
                      value: archiveTarget,
                      onChange: (event) => setArchiveTarget(event.target.value),
                    },
                    h('option', { value: 'origin', style: css.optionStyle }, say('restoreOrigin', '原目录（推荐）')),
                    h('option', { value: 'agents', style: css.optionStyle }, say('installAgents', '技能库 ~/.agents/skills')),
                    h('option', { value: 'user', style: css.optionStyle }, say('installUser', '用户目录 ~/.dsh/skills')),
                    h('option', { value: 'project', style: css.optionStyle }, say('installProject', '项目 .dsh/skills')),
                  ),
                ),
                h('span', { style: { flex: '1 1 auto' } }),
                h(
                  'button',
                  {
                    type: 'button',
                    style: css.iconBtn,
                    title: say('refresh', '重新观测'),
                    'aria-label': say('refresh', '重新观测'),
                    disabled: archiveLoading,
                    onClick: loadArchive,
                  },
                  archiveLoading ? h(Spinner, { size: 15 }) : h(Icon, { name: 'refresh', size: 14 }),
                ),
              ),
              archiveError
                ? h('div', { style: { ...css.hint, marginTop: 8, color: '#d05a4a' } }, say('archiveError', '归档操作失败：') + archiveError)
                : null,
              !archiveLoading && archiveEntries.length === 0
                ? h('div', { style: { ...css.hint, marginTop: 12 } }, say('archiveEmpty', '还没有归档的技能。在技能列表点「卸载」会把技能移到这里，可随时恢复。'))
                : h(
                    'div',
                    { style: { ...css.list, marginTop: 12 } },
                    archiveEntries.map((entry) =>
                      h(
                        'div',
                        { key: entry.key, style: css.item },
                        h(
                          'div',
                          { style: css.itemMain },
                          h(
                            'div',
                            { style: css.itemHead },
                            h('span', { style: css.name }, entry.name),
                            entry.archivedAt
                              ? h('span', { style: { ...css.hint, flex: '0 0 auto' } }, say('archivedAt', '归档于') + ' ' + entry.archivedAt)
                              : null,
                            h('span', { style: { ...css.hint, flex: '0 0 auto' } }, say('originAt', '原位置：') + originLabel(entry.origin)),
                          ),
                        ),
                        h(
                          'button',
                          {
                            type: 'button',
                            style: css.btn,
                            disabled: busy || archiveLoading,
                            title: say('restoreHint', '恢复到上方的目标目录'),
                            onClick: () => restoreArchived(entry),
                          },
                          say('restore', '恢复'),
                        ),
                      ),
                    ),
                  ),
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
                        skill.readOnly
                          ? h('span', { style: { ...css.metaText, flex: '0 0 auto' }, title: readOnlyHint(skill) }, say('readOnlyBadge', '只读'))
                          : null,
                        h('span', { style: { ...css.hint, flex: '0 0 auto' } }, String(Math.min((skill.description ?? '').length, 500))),
                      ),
                      h('div', { style: css.cardDesc }, skill.description ?? ''),
                      skill.note
                        ? h('div', { style: { ...css.cardNote, cursor: 'pointer' }, title: say('noteView', '查看完整备注'), onClick: () => setNoteViewing(skill) }, skill.note)
                        : null,
                      h(
                        'div',
                        { style: css.cardFoot },
                        h('span', { style: css.dot(on) }),
                        h('span', { style: { fontSize: 11.5, opacity: 0.6 } },
                          on ? say('enabled', '已启用') : (reasonLabel(skill.hiddenReason) || say('disabledBadge', '已停用'))),
                        h('span', { style: { flex: '1 1 auto' } }),
                        h('button', {
                          type: 'button',
                          title: say('noteEdit', '编辑备注'),
                          'aria-label': say('noteEdit', '编辑备注'),
                          style: css.iconBtn,
                          disabled: busy,
                          onClick: () => openNote(skill),
                        }, h(Icon, { name: 'edit', size: 14 })),

                        skill.refCount > 1
                          ? h(
                              'span',
                              {
                                style: css.refBadge,
                                title: `${say('refCountTitle', '引用它的技能包')}：${(skill.refs ?? []).join('、')}${skill.refCount > (skill.refs ?? []).length ? ' …' : ''}`,
                              },
                              say('refCountShort', '引用') + ' ' + skill.refCount,
                            )
                          : null,
                        skill.uninstallable === true
                          ? h('button', {
                              type: 'button',
                              title: say('uninstallHint', '移入归档目录，可恢复'),
                              'aria-label': say('uninstall', '卸载'),
                              style: css.iconBtn,
                              disabled: busy,
                              onClick: () => {
                                if (window.confirm(say('uninstallAsk', '卸载并把技能移入归档目录？') + ' ' + skill.name)) {
                                  write('/zhiyin/uninstall', { name: skill.name }).then(() => loadArchive())
                                }
                              },
                            }, h(Icon, { name: 'archive', size: 14 }))
                          : null,
                        h(Toggle, {
                          checked: on,
                          disabled: busy || skill.hiddenReason === 'pack' || skill.hiddenReason === 'all-off' || skill.hiddenReason === 'unpacked',
                          title: skill.hiddenReason === 'unpacked' ? say('toggleUnpacked', '先把它加进一个启用的技能包；单技能开关只负责组内关掉') : skill.hiddenReason === 'pack' || skill.hiddenReason === 'all-off' ? say('toggleBlocked', '上层开关已停用；先打开技能包或总开关') : skill.hiddenReason ? reasonLabel(skill.hiddenReason) : say('toggleHint', '点开关立即生效'),
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
        selectedNames.length > 0
          ? h(
              'div',
              { style: css.batchBar },
              h('span', { style: { fontSize: 12, opacity: 0.72 } }, say('batchSelected', '已选') + ' ' + selectedNames.length),
              h('button', { type: 'button', style: css.btn, disabled: busy, onClick: () => runBatch(true) }, say('batchEnable', '批量启用')),
              h('button', { type: 'button', style: css.btn, disabled: busy, onClick: () => runBatch(false) }, say('batchDisable', '批量停用')),
              h('button', { type: 'button', style: { ...css.btn, marginLeft: 'auto' }, onClick: () => setSelectedNames([]) }, say('batchClear', '清除选择')),
            )
          : null,

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
                      h('input', {
                        type: 'checkbox',
                        checked: selectedNames.includes(skill.name),
                        disabled: busy,
                        title: say('batchPick', '选中以便批量启停'),
                        'aria-label': say('batchPick', '选中以便批量启停'),
                        style: css.pick,
                        onChange: () => toggleSelected(skill.name),
                      }),
                      skill.uninstallable === true
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
                                  write('/zhiyin/uninstall', { name: skill.name }).then(() => loadArchive())
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
                        skill.readOnly
                          ? h('span', { style: { ...css.metaText, opacity: 0.5 }, title: readOnlyHint(skill) }, say('readOnlyBadge', '只读'))
                          : null,
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
                        skill.refCount > 1
                          ? h(
                              'span',
                              {
                                style: css.refBadge,
                                title: `${say('refCountTitle', '引用它的技能包')}：${(skill.refs ?? []).join('、')}${skill.refCount > (skill.refs ?? []).length ? ' …' : ''}`,
                              },
                              say('refCountShort', '引用') + ' ' + skill.refCount,
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
                        skill.note
                          ? h('div', { style: { ...css.noteLine, cursor: 'pointer' }, title: say('noteView', '查看完整备注'), onClick: () => setNoteViewing(skill) }, skill.note)
                          : null,
                      ),

                      h('button', {
                        type: 'button',
                        style: css.iconBtn,
                        title: say('noteEdit', '编辑备注'),
                        'aria-label': say('noteEdit', '编辑备注'),
                        disabled: busy,
                        onClick: () => openNote(skill),
                      }, h(Icon, { name: 'edit', size: 15 })),

                      h(Toggle, {
                        checked: skill.enabled !== false,
                        disabled: busy || skill.hiddenReason === 'pack' || skill.hiddenReason === 'all-off' || skill.hiddenReason === 'unpacked',
                        title: skill.hiddenReason === 'unpacked'
                          ? say('toggleUnpacked', '先把它加进一个启用的技能包；单技能开关只负责组内关掉')
                          : skill.hiddenReason === 'pack' || skill.hiddenReason === 'all-off'
                          ? say('toggleBlocked', '上层开关已停用；先打开技能包或总开关')
                          : skill.hiddenReason
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
          : null,

        editing
          ? (function renderEditor() {
              const pack = (data.packs ?? []).find((candidate) => candidate.id === editing)
              if (!pack) return null
              const needle = memberQuery.trim().toLowerCase()
              const match = (name) => needle === '' || String(name).toLowerCase().includes(needle)
              // 搜索只过滤显示，不动已选：包内被 .agents 挡住的成员也要能看见并取消。
              const keptHidden = draftMembers.filter((name) => !scopedNames.has(name))
              const rows = [
                ...scoped.filter((skill) => match(skill.name)).map((skill) => ({ name: skill.name, source: sourceLabel(skill) + (skill.hiddenReason === 'manual' ? ' · ' + say('disabledBadge', '已停用') : ''), ghost: false })),
                ...keptHidden.filter((name) => match(name)).map((name) => ({
                  name,
                  source: observedNames.has(name) ? say('packHiddenAgents', '被 .agents 开关挡住') : say('packGhost', '未安装'),
                  ghost: true,
                })),
              ]
              const poolSize = scoped.length + keptHidden.length
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
                  h(ClearField, {
                    wrapperStyle: { flex: '1 1 220px', minWidth: 0 },
                    style: css.input,
                    value: memberQuery,
                    placeholder: say('search', '按名称搜索'),
                    onChange: (event) => setMemberQuery(event.target.value),
                  }),
                  h('div', { style: { ...css.hint, marginTop: 6 } }, say('packSelectedCount', '已选 {n} / {m}').replace('{n}', String(draftMembers.length)).replace('{m}', String(poolSize))),
                  h(
                    'div',
                    { style: css.modalBody },
                    rows.map((row) =>
                      h(
                        'label',
                        { key: row.name, style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '2px 0', opacity: row.ghost ? 0.72 : 1 } },
                        h('input', {
                          type: 'checkbox',
                          checked: draftMembers.includes(row.name),
                          onChange: () =>
                            setDraftMembers((previous) =>
                              previous.includes(row.name)
                                ? previous.filter((name) => name !== row.name)
                                : [...previous, row.name],
                            ),
                        }),
                        h('span', { style: css.name }, row.name),
                        h('span', { style: { ...css.hint, marginLeft: 'auto' } }, row.source),
                      ),
                    ),
                  ),
                  h(
                    'div',
                    { style: css.modalFoot },
                    h('button', { type: 'button', style: css.btn, onClick: () => setDraftMembers(Array.from(new Set([...scoped.filter((skill) => skill.hiddenReason !== 'manual').map((skill) => skill.name), ...keptHidden]))) }, say('selectAll', '全选')),
                    h('button', { type: 'button', style: css.btn, onClick: () => setDraftMembers([]) }, say('selectNone', '全不选')),
                    h(
                      'button',
                      {
                        type: 'button',
                        style: css.btn,
                        disabled: busy,
                        onClick: () => {
                          write('/zhiyin/pack', { action: 'members', id: editing, members: Array.from(new Set(draftMembers)) })
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

        costInfoOpen
          ? h(
              'div',
              { style: css.overlay, onClick: () => setCostInfoOpen(false) },
              h(
                'div',
                { style: { ...css.modal, ...css.modalMd }, onClick: (event) => event.stopPropagation() },
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('costInfoTitle', '目录字符数是什么？')),
                  h('button', {
                    type: 'button',
                    style: css.iconBtn,
                    title: say('close', '关闭'),
                    'aria-label': say('close', '关闭'),
                    onClick: () => setCostInfoOpen(false),
                  }, h(Icon, { name: 'close', size: 13 })),
                ),
                h(
                  'div',
                  { style: css.modalBody },
                  h('div', { style: css.costSection }, say('costInfoWhat', '这是当前可见技能描述的成本估算：每条描述最多算 500 字符，累加后再加 200 框架开销。它是相对成本尺子，不是 DSH 实际注入的精确字符数（不含技能名和正文），也不是报错。')),
                  h('div', { style: css.costHead }, say('costInfoWhyHead', '为什么值得看')),
                  h('div', { style: css.costSection }, say('costInfoWhy', '技能描述是模型判断「何时调用这个技能」的路由信号。目录越长，每次请求付出的 token 越多；每次变更还会把新目录追加进会话历史。')),
                  h('div', { style: css.costHead }, say('costInfoRulesHead', '官方与社区给出的量级')),
                  h('div', { style: css.costBullet }, '• ' + say('costRule1', '单条描述 ≤ 1024 字符是官方硬上限（API 会拒绝）；写作目标 400–1000，触发词前置。')),
                  h('div', { style: css.costBullet }, '• ' + say('costRule2', 'Claude Code 路由清单把 description + when_to_use 合并截到约 1536 字符（v2.1.105 起）。')),
                  h('div', { style: css.costBullet }, '• ' + say('costRule3', '目录总量参考 ≈ 上下文窗口的 1%；超限后新版按「最近最少使用」丢弃描述而非截断——你以为可用的技能可能悄悄不参与路由。')),
                  h('div', { style: css.costBullet }, '• ' + say('costRule4', '中文约 1 字符 1 token、英文约 4 字符 1 token，所以不能用一个固定字符数当红线。')),
                  h('div', { style: css.costHead }, say('costAdviceHead', '我们的建议')),
                  h('div', { style: css.costBullet }, '• ' + say('costAdvice1', '长期不用的技能就关掉或移出启用包，比盯着数字更重要。')),
                  h('div', { style: css.costBullet }, '• ' + say('costAdvice2', '描述只写「做什么 + 何时用」，触发词前置，别堆废话。')),
                  h('div', { style: css.costBullet }, '• ' + say('costAdvice3', '这个数字只是成本尺子，不要为了压低它牺牲可用性。')),
                  h('div', { style: css.costHead }, say('costSourceHead', '出处与待核实')),
                  h('div', { style: css.costBullet },
                    h('a', { href: 'https://platform.claude.com/docs/zh-CN/build-with-claude/skills-guide', target: '_blank', rel: 'noreferrer', style: css.costLink }, 'Anthropic 平台文档 · 请求限制'),
                  ),
                  h('div', { style: css.costBullet },
                    h('a', { href: 'https://github.com/josiahsiegel/claude-plugin-marketplace/blob/main/plugins/plugin-master/skills/triggering-reliability/references/severity-and-limits.md', target: '_blank', rel: 'noreferrer', style: css.costLink }, 'Claude Code 描述长度上限与分层（2026）'),
                  ),
                  h('div', { style: css.costSection }, say('costInfoPending', '待核实：DSH 自身如何注入目录（截断/丢弃/压缩）尚未实测；我们会抓取真实会话目录来校准口径。')),
                ),
                h(
                  'div',
                  { style: css.modalFoot },
                  h('button', { type: 'button', style: css.primaryBtn, onClick: () => setCostInfoOpen(false) }, say('gotIt', '知道了')),
                ),
              ),
            )
          : null,

        creating
          ? h(
              'div',
              { style: css.overlay },
              h(
                'div',
                { style: { ...css.modal, ...css.modalSm } },
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('packNew', '新建技能包')),
                  h('button', { type: 'button', style: css.iconBtn, title: say('close', '关闭'), 'aria-label': say('close', '关闭'), onClick: () => setCreating(false) }, h(Icon, { name: 'close', size: 13 })),
                ),
                h(ClearField, {
                  wrapperStyle: { width: '100%' },
                  style: css.field,
                  maxLength: 40,
                  value: draftName,
                  placeholder: say('packNamePlaceholder', '技能包名称'),
                  onChange: (event) => setDraftName(event.target.value),
                }),
                h(
                  'div',
                  { style: css.modalFoot },
                  h(
                    'button',
                    {
                      type: 'button',
                      style: css.btn,
                      disabled: busy || draftName.trim() === '',
                      onClick: () => {
                        // AI Vault：新包默认把当前技能全选进来，先建组再排除比逐个勾更快。
                        write('/zhiyin/pack', { action: 'create', name: draftName.trim() }).then((result) => {
                          if (result?.id) {
                            setDraftMembers(scoped.filter((skill) => skill.hiddenReason !== 'manual').map((skill) => skill.name))
                            setMemberQuery('')
                            setEditing(result.id)
                          }
                        })
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
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('packRename', '改名')),
                  h('button', { type: 'button', style: css.iconBtn, title: say('close', '关闭'), 'aria-label': say('close', '关闭'), onClick: () => setRenaming(null) }, h(Icon, { name: 'close', size: 13 })),
                ),
                h(ClearField, {
                  wrapperStyle: { width: '100%' },
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
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('install', '安装技能')),
                  h('button', {
                    type: 'button',
                    style: css.iconBtn,
                    disabled: busy,
                    title: say('close', '关闭'),
                    'aria-label': say('close', '关闭'),
                    onClick: () => setInstalling(false),
                  }, h(Icon, { name: 'close', size: 13 })),
                ),
                h('p', { style: css.hint }, say('installHint', '粘贴 GitHub 仓库、技能目录、npx skills add 命令、SKILL.md 直链，或本地文件夹路径；只新建目录，不改已有技能。无论仓库里有多少技能，都按 SKILL.md 的 name 平级装到所选目录，不会多套一层仓库目录')),
                h(ClearField, {
                  wrapperStyle: { width: '100%' },
                  style: css.field,
                  value: installPath,
                  placeholder: say('installPath', 'owner/repo、https://github.com/owner/repo 或 D:\\skills\\my-skill'),
                  onChange: (event) => setInstallPath(event.target.value),
                }),
                installSkill
                  ? h('div', { style: css.hint }, say('installSkillHint', '将安装这个技能：') + installSkill)
                  : null,
                h(
                  'div',
                  { style: { display: 'flex', gap: 12, fontSize: 12, alignItems: 'center', flexWrap: 'wrap' } },
                  h('label', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                    h('input', {
                      type: 'radio',
                      checked: installTarget === 'agents',
                      onChange: () => setInstallTarget('agents'),
                    }),
                    say('installAgents', '技能库 ~/.agents/skills（装好会链接进 .dsh）'),
                  ),
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
                installCandidates.length > 0
                  ? h(
                      'div',
                      { style: { marginTop: 10 } },
                      h('div', { style: css.hint }, say('installMultiple', '这个仓库里有多个技能，勾选后一起安装（都平级装到所选目录）：')),
                      h('div', { style: { ...css.hint, marginTop: 2 } }, say('installSelectedCount', '已选 {n} / {m}').replace('{n}', String(installSelected.length)).replace('{m}', String(installCandidates.length))),
                      h(
                        'div',
                        { style: { ...css.previewList, marginTop: 6 } },
                        installCandidates.map((candidate) =>
                          h(
                            'label',
                            { key: candidate.subpath, style: css.cbRow },
                            h('input', {
                              type: 'checkbox',
                              checked: installSelected.includes(candidate.subpath),
                              onChange: () =>
                                setInstallSelected((previous) =>
                                  previous.includes(candidate.subpath)
                                    ? previous.filter((item) => item !== candidate.subpath)
                                    : [...previous, candidate.subpath],
                                ),
                            }),
                            h('span', { style: css.name }, candidate.name),
                            h('span', { style: { ...css.hint, marginLeft: 'auto' } }, candidate.subpath || '(root)'),
                          ),
                        ),
                      ),
                    )
                  : null,
                installProgress
                  ? h('p', { style: css.hint }, installProgress)
                  : null,
                installError
                  ? h('p', { style: { ...css.hint, color: '#d05a4a' } }, say('installFailed', '安装失败：') + installError)
                  : null,
                h(
                  'div',
                  { style: css.modalFoot },
                  installCandidates.length > 0
                    ? h(
                        'div',
                        { style: { display: 'flex', gap: 8, marginLeft: 'auto' } },
                        h('button', { type: 'button', style: css.btn, disabled: busy, onClick: () => setInstallSelected(installCandidates.map((candidate) => candidate.subpath)) }, say('installAll', '全选')),
                        h('button', { type: 'button', style: css.btn, disabled: busy, onClick: () => setInstallSelected([]) }, say('installNone', '全不选')),
                        h(
                          'button',
                          {
                            type: 'button',
                            style: { ...css.primaryBtn, display: 'inline-flex', alignItems: 'center', gap: 6 },
                            disabled: busy || installSelected.length === 0,
                            onClick: runInstallSelected,
                          },
                          busy ? h(Spinner, { size: 14 }) : h(Icon, { name: 'packagePlus', size: 14 }),
                          ` ${busy ? say('installing', '安装中…') : `${say('installSelected', '安装选中')} (${installSelected.length})`}`,
                        ),
                      )
                    : h(
                        'button',
                        {
                          type: 'button',
                          style: { ...css.primaryBtn, display: 'inline-flex', alignItems: 'center', gap: 6 },
                          disabled: busy || installPath.trim() === '',
                          onClick: () => runInstall(),
                        },
                        busy ? h(Spinner, { size: 14 }) : h(Icon, { name: 'packagePlus', size: 14 }),
                        ` ${busy ? say('installing', '安装中…') : say('install', '安装技能')}`,
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
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('importTitle', '导入技能包')),
                  h('button', { type: 'button', style: css.iconBtn, title: say('close', '关闭'), 'aria-label': say('close', '关闭'), onClick: () => setImporting(false) }, h(Icon, { name: 'close', size: 13 })),
                ),
                h('div', { style: css.hint }, say('importHint', '支持 AI Vault 导出的技能包 txt：每行「目录名 | 来源 | owner/repo | 分支 | 子目录」，# 开头的行会被忽略。')),
                h(ClearField, {
                  wrapperStyle: { width: '100%' },
                  style: css.field,
                  value: importName,
                  placeholder: say('packNamePlaceholder', '技能包名称（留空用文件里的名字）'),
                  onChange: (event) => setImportName(event.target.value),
                }),
                h(ClearField, {
                  wrapperStyle: { width: '100%' },
                  style: css.field,
                  value: importPath,
                  placeholder: say('importPathPlaceholder', 'txt 文件绝对路径，例如 D:\\packs\\mattpocock.txt'),
                  onChange: (event) => setImportPath(event.target.value),
                }),
                h(ClearField, {
                  multiline: true,
                  wrapperStyle: { display: 'block' },
                  style: css.textarea,
                  value: importText,
                  placeholder: say('importTextPlaceholder', '或者直接把 txt 内容粘到这里'),
                  onChange: (event) => setImportText(event.target.value),
                }),
                h(
                  'div',
                  { style: css.modalFoot },
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
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('importConfig', '导入配置')),
                  h('button', { type: 'button', style: css.iconBtn, title: say('close', '关闭'), 'aria-label': say('close', '关闭'), onClick: () => setImportingConfig(false) }, h(Icon, { name: 'close', size: 13 })),
                ),
                h('p', { style: css.hint }, say('importConfigHint2', '粘贴此前「导出配置」得到的 JSON。导入会覆盖当前的技能包与停用项；旧配置会先自动备份到插件状态目录。')),
                h(ClearField, {
                  multiline: true,
                  wrapperStyle: { display: 'block' },
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

        // 备份列表弹窗（FR-025）：列出导入/回滚留下的快照，可任选一份退回。
        backupsOpen
          ? h(
              'div',
              { style: css.overlay },
              h(
                'div',
                { style: { ...css.modal, ...css.modalMd } },
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('backupsTitle', '配置备份')),
                  h('button', { type: 'button', style: css.iconBtn, title: say('close', '关闭'), 'aria-label': say('close', '关闭'), onClick: () => setBackupsOpen(false) }, h(Icon, { name: 'close', size: 13 })),
                ),
                h('p', { style: css.hint }, say('backupsHint', '导入配置或回滚时自动留下；最多保留 20 份，新的在前')),
                backups
                  ? Array.isArray(backups)
                    ? backups.length === 0
                      ? h('p', { style: css.hint }, say('backupsEmpty', '还没有备份'))
                      : h(
                          'div',
                          { style: css.previewList },
                          backups.map((entry) =>
                            h(
                              'div',
                              { key: entry.file, style: { ...css.cbRow, cursor: 'default' } },
                              h(
                                'div',
                                { style: css.groupMain },
                                h('div', { style: { ...css.matrixName, minWidth: 0 } }, String(entry.at ?? '')),
                                h('div', { style: { ...css.matrixBy, marginTop: 2 } }, String(entry.file ?? '')),
                              ),
                              h('button', {
                                type: 'button',
                                style: css.btn,
                                disabled: busy,
                                onClick: () => rollbackTo(entry.file),
                              }, say('backupsRollback', '回滚到这份')),
                            ),
                          )
                        )
                    : h('p', { style: css.hint }, String(backups.error ?? ''))
                  : null,
              ),
            )
          : null,

        noteViewing
          ? h(
              'div',
              { style: css.overlay, onClick: () => setNoteViewing(null) },
              h(
                'div',
                { style: { ...css.modal, ...css.modalMd }, onClick: (event) => event.stopPropagation() },
                h(
                  'div',
                  { style: css.modalHead },
                  h('div', { style: css.modalTitle }, `${say('noteViewTitle', '技能备注')} · ${noteViewing.name}`),
                  h('button', { type: 'button', style: css.iconBtn, title: say('close', '关闭'), 'aria-label': say('close', '关闭'), onClick: () => setNoteViewing(null) }, h(Icon, { name: 'close', size: 15 })),
                ),
                h(
                  'div',
                  { style: { ...css.previewList, maxHeight: '60vh', whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.65 } },
                  noteViewing.note,
                ),
                h(
                  'div',
                  { style: css.modalFoot },
                  h('button', { type: 'button', style: css.primaryBtn, onClick: () => { const target = noteViewing; setNoteViewing(null); openNote(target) } }, say('noteEdit', '编辑备注')),
                ),
              ),
            )
          : null,

        noteEditing
          ? h(
              'div',
              { style: css.overlay, onClick: () => setNoteEditing(null) },
              h(
                'div',
                { style: { ...css.modal, ...css.modalSm }, onClick: (event) => event.stopPropagation() },
                h(
                  'div',
                  { style: css.modalHead },
                  h('div', { style: css.modalTitle }, `${say('noteEdit', '编辑备注')} · ${noteEditing}`),
                  h('button', {
                    type: 'button',
                    style: css.iconBtn,
                    title: say('close', '关闭'),
                    'aria-label': say('close', '关闭'),
                    onClick: () => setNoteEditing(null),
                  }, h(Icon, { name: 'close', size: 15 })),
                ),
                h('p', { style: css.hint }, say('noteHint', '备注只存在本地配置里，不会写进技能文件；导出配置时会一起带走。')),
                h(
                  'div',
                  { style: css.noteEditWrap },
                  h('textarea', {
                    style: { ...css.textarea, width: '100%', boxSizing: 'border-box', minHeight: 96, paddingBottom: 34, fontFamily: 'inherit' },
                    maxLength: 500,
                    value: noteDraft,
                    placeholder: say('notePlaceholder', '例如：做前端评审时先留着；下个项目再用'),
                    onChange: (event) => setNoteDraft(event.target.value),
                  }),
                  h(
                    'div',
                    { style: css.noteEditActions },
                    h('button', {
                      type: 'button',
                      style: css.noteActBtn,
                      title: say('noteClear', '清除内容'),
                      'aria-label': say('noteClear', '清除内容'),
                      disabled: busy || noteDraft === '',
                      onClick: () => setNoteDraft(''),
                    }, h(Icon, { name: 'close', size: 14 })),
                    h('button', {
                      type: 'button',
                      style: { ...css.noteActBtn, ...css.noteActSave },
                      title: say('save', '保存'),
                      'aria-label': say('save', '保存'),
                      disabled: busy,
                      onClick: saveNote,
                    }, busy ? h(Spinner, { size: 14 }) : h(Icon, { name: 'check', size: 14 })),
                  ),
                ),
                h('div', { style: { ...css.hint, marginTop: 6 } }, `${noteDraft.length} / 500`),
              ),
            )
          : null,

      )
    }

    function statCards(data, counts, say, filter, setFilter) {
      const items = [
        { key: 'statTotal', label: '技能总数', value: counts.total, filter: 'all', hint: '此刻织音能看见的全部技能（= 可自动调用 + 仅手动调用）' },
        { key: 'statModel', label: '可自动调用', value: counts.model, filter: 'model', hint: 'Agent 会在对话里自己选用的技能（modelInvocable）；手动调用的也在其中' },
        {
          key: 'statUser',
          label: '仅手动调用',
          value: Math.max(0, counts.user - counts.both),
          filter: 'user',
          hint: '只能用 /名字 手动唤起，模型不会自己选（disable-model-invocation: true）',
        },
        { key: 'statDisabled', label: '已停用', value: counts.disabled, filter: 'disabled', hint: '被总开关、.agents 开关、技能包或单技能开关挡住的技能；文件仍在盘上，随时能打开' },
        { key: 'statBundled', label: '内置技能', value: counts.bundled, filter: 'bundled', hint: '随 DSH 内置的技能，已计入「可自动调用」，不额外相加' },
      ]
      if ((counts.internal ?? 0) > 0) {
        items.push({ key: 'statInternal', label: '不可直接调用', value: counts.internal, filter: 'internal', hint: '模型与 / 菜单两个入口都关了（disable-model-invocation: true 且 user-invocable: false），只能被别的技能引用' })
      }
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