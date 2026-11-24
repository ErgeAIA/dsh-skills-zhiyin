/**
 * 织音 · 设置页（浏览器半边）
 *
 * 只读第一版：把「模型此刻能看见什么、目录要花多少字符」摆出来。
 * 数据走宿主注册的同源只读路由 /zhiyin/state —— 第三方插件无法新增 Remote。
 */
window.__ModuleLoader__.load({
  id: 'dsh-skills-zhiyin',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'zhiyin'
    // skills.sh 搜索接口实测上限 200 条（limit>200 会被截到 200）；offset 参数无效，一次取满即可。
    const MARKET_MAX = 200
    // 仓库地址：源码仓库即插件仓库，设置页右上角的 GitHub 图标指向这里。
    const REPO_URL = 'https://github.com/' + 'ErgeAIA' + '/' + 'dsh-skills-zhiyin'

    const dictionary = {
      zh: {
        versionLabel: '织音',
        guideOpen: '使用指南',
        guideLoading: '正在读取使用指南…',
        guideFailed: '读取使用指南失败：',
        guideLang: 'zh',
        langSwitch: 'EN',
        repoHint: '在 GitHub 上打开仓库',
        starCta: 'Star 一下~',
        langSwitchTitle: '切换到 English 界面',
        nav: '织音',
        title: '织音',
        subtitle: '安装、启停、编组技能，随时看清模型此刻能用什么',
        refresh: '刷新',
        loading: '正在读取技能列表…',
        failed: '读取失败：',
        statTotal: '技能总数',
        statModel: '模型可用',
        statUser: '仅用户可用',
        budget: '目录字符数',
        complete: '已完整读取',
        incomplete: '读取不完整（已列出确认到的部分）',
        search: '按名称或描述搜索',
        filterHint: '点一下只列这一类，再点一下回到全部',
        linkBadge: '软链',
        checkUpdates: '检查更新',
        autoCheck: '自动检查技能更新',
        infoStatus: '状态详情',
        infoAll: '状态与更新设置',
        infoCost: '目录成本',
        lastCheckedShort: '检查于 ',
        infoUpdate: '更新设置',
        infoSource: '来源与版本',
        updatesBadge: '有 {n} 个更新',
        costInfoOpen: '查看计算方式与建议',
        everyDay: '每天',
        autoCheckHint: '开启后按所选周期在后台检查，不会卡住界面',
        checkInterval: '检查周期',
        lastChecked: '最近完整检查：',
        neverChecked: '还没检查过',
        checkNow: '立即检查',
        checkUpdatesHint: '按上游仓库检查技能是否有新版本；每天启动后会自动检查一次',
        checkUpdatesFound: '有 {n} 个更新',
        updateBadge: '有更新',
        updateLocalOnly: '本地已改',
        updateApplyHint: '更新到上游当前版本；本地没改过才允许',
        updateBlockedHint: '本地内容被改过：点一下可先备份到归档再强制更新',
        forceUpdateAsk: '本地内容被改过。先把当前版本整份备份到归档，再用上游版本覆盖？',
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
        reasonAllOff: '全部停用',
        empty: '没有匹配的技能',
        next: '技能包开关决定包内技能是否对 agent 可见；单个技能也可以随时停用。',
        agentsRoot: '加载 ~/.agents/skills',
        agentsRootHint: '关掉后 DSH 只看 ~/.dsh/skills 与项目技能',
        agentsRootHintShort: '开启后读取 ~/.agents/skills 与 ~/.dsh/skills 的合集；关闭后只读 ~/.dsh/skills 与项目技能',
        disabledBadge: '已停用',
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
        packHiddenAgents: '被 .agents 开关挡住',
              alertConflict: '同名技能冲突',
        alertFrom: '个来源',
        alertGhost: '技能包引用了未安装技能',
        close: '关闭',
        enabled: '已启用',
        reasonExcluded: '已排除',
        reasonUnassigned: '未加入技能包',
        reasonCombo: '未纳入任何技能包',
        batchPick: '选中以便批量启停',
        batchSelected: '已选',
        batchEnable: '批量启用',
        batchDisable: '批量停用',
        batchClear: '清除选择',
        alertUnpacked: '有技能未加入技能包，当前不生效',
        noteEdit: '编辑备注',
        noteViewTitle: '技能备注',
        needLogin: '需要先登录 DSH：请重新打开 dsh web 启动时打印的网址',
        refusedOrigin: '请求来源不受信任，已拒绝',
        statFavorite: '收藏',
        statFavoriteHint: '已收藏的技能，始终置顶；点一下只看收藏',
        favoriteOn: '收藏并置顶',
        favoriteOff: '取消收藏',
        favoriteFailed: '收藏失败：',
        marketMore: '加载更多',
        marketMoreLoading: '加载中…',
        noteHint: '备注只存在本地配置里，不会写进技能文件；导出配置时会一起带走。',
        notePlaceholder: '例如：做前端评审时先留着；下个项目再用',
        consistencySynced: '一致',
        consistencyDegraded: '读取不完整',
        consistencyDrifted: '有漂移',
        consistencyHintSynced: '配置与已装技能一致',
        consistencyHintDegraded: '上次读取不完整，沿用上一次的结果',
        consistencyHintDrifted: '技能包引用了已不存在的技能',
        readOnlyBadge: '只读',
        readOnlyHintBundled: '内置技能：织音只改可见性，不改动它的文件',
        readOnlyHintExternal: '外部来源：不在织音管理的目录里，只能启停',
        readOnlyHintRoot: '不在织音管理的安装目录里，只能启停',
        repair: '修复',
        repairAsk: '把指向已消失技能的引用从技能包里移除？当前配置会先备份。',
        repairOk: '已剪掉失效引用：',
        repairNone: '没有需要修复的引用',
        repairHint: '清理指向已消失技能的引用',
        refCountTitle: '引用它的技能包',
        refCountShort: '引用',
        backupsTitle: '配置备份',
        backupsHint: '导入配置或回滚时自动留下；最多保留 20 份，新的在前',
        backupsEmpty: '还没有备份',
        backupsRollback: '回滚到这份',
        backupsAsk: '回滚到这份备份？当前配置会先另存一份备份。',
        backupsOpen: '备份列表',
        revealFailed: '打开技能目录失败：',
        archiveDeleteAsk: '彻底删除这份归档？技能目录会被永久移除，无法恢复。',
        archiveDeleteAskMany: '彻底删除选中的 {n} 份归档？技能目录会被永久移除，无法恢复。',
        installAborting: '正在中止…',
        installAborted: '已中止安装',
        srcLinked: '其中 {n} 个用户目录技能是 .agents 的软链，同名只算一次',
        originAgents: '技能库 ~/.agents/skills',
        originUser: '用户目录 ~/.dsh/skills',
        originProject: '项目 .dsh/skills',
        originUnknown: '未知',
        statBySource: '来源',
        costInfoTip: '点开看这个数字的含义、建议与出处',
        tabMarket: '技能市场',
        tabArchive: '归档',
        installHintShort: '从 skills.sh / GitHub / 本地安装技能',
        packEmptyTitle: '还没有技能包',
        emptyHint: '换个关键词，或清空搜索框看看全部技能',
        marketSearchPlaceholder: '搜索 skills.sh 技能（至少 2 个字符；留空看热门）',
        marketSearch: '搜索',
        searchDone: '已更新',
        searchFailed: '失败',
        marketTrending: '热门技能（按安装量排序）',
        marketResult: '搜索结果',
        marketEmpty: '没有找到技能',
        marketEmptyHint: '换个关键词试试；至少 2 个字符，留空看热门',
        marketOpen: '在 skills.sh 打开技能页',
        marketHostedHint: 'skills.sh 托管技能，没有公开 GitHub 仓库，无法直接安装',
        marketHostedBadge: '托管',
        marketSourceTitle: '来源仓库',
        marketInstallsTitle: 'skills.sh 记录的安装次数',
        marketInstalls: '次安装',
        marketNoDesc: '暂无描述',
        marketCmdHint: '对应的 skills CLI 命令',
        marketInstallable: '可安装',
        marketInstalled: '已安装',
        marketReinstallHint: '重新安装（覆盖到所选目录，用于更新）',
        marketReinstall: '重新安装',
        marketHostedHint2: 'skills.sh 托管技能，没有公开仓库；点此在 skills.sh 打开安装说明',
        marketOpenShort: '查看',
        marketInstalling: '正在安装…',
        marketBusyOther: '另一个技能正在安装，请稍候',
        installShort: '安装',
        restoreTarget: '恢复到',
        restoreOrigin: '原目录（推荐）',
        archiveDeletePicked: '删除选中',
        archiveError: '归档操作失败：',
        archiveEmptyTitle: '还没有归档的技能',
        archiveEmpty: '在技能列表点「卸载」会把技能移到这里，可随时恢复。',
        archivePick: '选中以便批量删除',
        archivedAt: '归档于',
        originAt: '原位置：',
        restoreHint: '恢复到上方的目标目录',
        restore: '恢复',
        archiveDeleteHint: '彻底删除这份归档（不可恢复）',
        archiveDelete: '删除归档',
        descCharsTitle: 'SKILL.md 描述字符数（计入目录成本）',
        charsUnit: '字符',
        revealHint: '在文件管理器里打开这个技能的目录',
        reveal: '打开目录',
        costInfoTitle: '目录字符数 · 计算方式与建议上限',
        costWhatHead: '计算方式',
        costWhat1: '每个可见技能取 min(描述长度, 500) 字符，全部相加后再加 200 字符框架开销。',
        costWhat2: '只计描述，不含技能名与 SKILL.md 正文，因此是本目录的成本下限。',
        costWhat3: '停用、未加入启用包、被上层开关挡住的技能不计入。',
        costWhyHead: '成本构成',
        costWhy1: '描述是模型判断「何时调用该技能」的路由信号，随每次请求注入。',
        costWhy2: '目录变化会作为新条目追加进会话历史，一次请求承载多份目录。',
        costWhy3: '总量超过模型承受范围时，实现会按最近最少使用丢弃描述，被丢弃的技能不再参与路由。',
        costLimitHead: '建议上限',
        costLimit1: '目录总量：上下文窗口的 1%。200K 窗口折算为 2,000 token。',
        costLimit2: '按 token 折算字符：中文 1 字符 ≈ 1 token → 建议 ≤ 2,000 字符；英文 4 字符 ≈ 1 token → 建议 ≤ 8,000 字符。中英混排按实际比例折算。',
        costLimit3: '单条描述：目标 400–1,000 字符，硬上限 1,024 字符（API 拒绝超限）。',
        costDoHead: '优化方式',
        costDo1: '描述只保留「做什么 + 何时用」，触发词放在开头，删去背景与套话。',
        costDo2: '长期不用的技能移出启用包或停用，成本直接归零。',
        costDo3: '同领域技能合并，减少重复的路由信号。',
        costSourceHead: '依据',
        costSrc1: 'Anthropic 平台文档 · Agent Skills 请求限制',
        costSrc1Note: '：description 上限 1,024 字符，name 上限 64 字符。',
        costSrc2: 'Claude Code 描述长度分层（2026）',
        costSrc2Note: '：路由清单合并截断 1,536 字符；目录总量预算为上下文窗口的 1%，超限按 LRU 丢弃描述。',
        gotIt: '知道了',
        installSkillHint: '将安装这个技能：',
        installing: '安装中…',
        installAbortHint: '中止这次安装（正在克隆的仓库会被终止）',
        installAbort: '中止',
        backupsEmptyHint: '导入配置或回滚时会自动留一份，最多 20 份',
        noteClear: '清除内容',
      },
      en: {
        versionLabel: 'ZhiYin',
        guideOpen: 'User guide',
        guideLoading: 'Loading the guide…',
        guideFailed: 'Could not load the guide: ',
        guideLang: 'en',
        langSwitch: '中',
        repoHint: 'Open the repository on GitHub',
        starCta: 'Star it~',
        langSwitchTitle: 'Switch to Chinese',
        nav: 'Zhiyin',
        title: 'Zhiyin',
        subtitle: 'Install, toggle and group skills — see what the model can use right now',
        refresh: 'Refresh',
        loading: 'Loading skill list…',
        failed: 'Load failed: ',
        statTotal: 'Skills',
        statModel: 'Model-invocable',
        statUser: 'User-only',
        budget: 'Catalog characters',
        complete: 'Fully read',
        incomplete: 'Read incomplete (confirmed subset listed)',
        search: 'Search name or description',
        filterHint: 'Click a card to list that group; click again for all',
        linkBadge: 'link',
        checkUpdates: 'Check for updates',
        autoCheck: 'Automatic skill update check',
        infoStatus: 'Status details',
        infoAll: 'Status and update settings',
        infoCost: 'Catalog cost',
        lastCheckedShort: 'checked ',
        infoUpdate: 'Update settings',
        infoSource: 'Source and version',
        updatesBadge: '{n} updates',
        costInfoOpen: 'View calculation and guidance',
        everyDay: 'Daily',
        autoCheckHint: 'Checks in the background at the chosen interval without blocking the interface',
        checkInterval: 'Interval',
        lastChecked: 'Last full check: ',
        neverChecked: 'Never checked',
        checkNow: 'Check now',
        checkUpdatesHint: 'Check each upstream repo for a newer version; also runs once a day after startup',
        checkUpdatesFound: '{n} updates',
        updateBadge: 'Update',
        updateLocalOnly: 'Edited',
        updateApplyHint: 'Update to the current upstream version (only when the local copy is unedited)',
        updateBlockedHint: 'Local files were edited; click to back up and force the update',
        forceUpdateAsk: 'The local copy was edited. Back it up to the archive first, then overwrite with the upstream version?',
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
        reasonAllOff: 'all disabled',
        empty: 'No matching skills',
        next: 'A pack switch decides whether its skills are visible to the agent; individual skills can be toggled anytime.',
        agentsRoot: 'Load ~/.agents/skills',
        agentsRootHint: 'Off: DSH only reads ~/.dsh/skills and project skills',
        agentsRootHintShort: 'On: reads ~/.agents/skills and ~/.dsh/skills together; off: only ~/.dsh/skills and project skills',
        disabledBadge: 'disabled',
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
        packHiddenAgents: 'hidden by .agents switch',
              alertConflict: 'Duplicate skill names',
        alertFrom: 'sources',
        alertGhost: 'Pack references skills that are not installed',
        close: 'Close',
        enabled: 'Enabled',
        reasonExcluded: 'Excluded',
        reasonUnassigned: 'Unassigned',
        reasonCombo: 'Not in any skill pack',
        batchPick: 'Select for batch toggling',
        batchSelected: 'Selected',
        batchEnable: 'Enable all',
        batchDisable: 'Disable all',
        batchClear: 'Clear',
        alertUnpacked: 'Some skills are not in any pack and do not play',
        noteEdit: 'Edit note',
        noteViewTitle: 'Skill note',
        needLogin: 'DSH login required: reopen the URL dsh web printed at startup',
        refusedOrigin: 'This request came from an untrusted origin and was refused',
        statFavorite: 'Favourites',
        statFavoriteHint: 'Favourited skills stay pinned to the top; click to show only these',
        favoriteOn: 'Favourite and pin to top',
        favoriteOff: 'Remove from favourites',
        favoriteFailed: 'Could not update favourites: ',
        marketMore: 'Load more',
        marketMoreLoading: 'Loading…',
        noteHint: 'Notes live in the local config only, never in skill files, and travel with config export.',
        notePlaceholder: 'e.g. keep for frontend reviews; revisit next project',
        consistencySynced: 'In sync',
        consistencyDegraded: 'Read incomplete',
        consistencyDrifted: 'Drifted',
        consistencyHintSynced: 'Config matches installed skills',
        consistencyHintDegraded: 'Last read was incomplete; previous result kept',
        consistencyHintDrifted: 'Packs reference skills that no longer exist',
        readOnlyBadge: 'Read-only',
        readOnlyHintBundled: 'Bundled skill: Zhiyin only changes visibility, never its files',
        readOnlyHintExternal: 'External source: not in a Zhiyin-managed directory; toggle only',
        readOnlyHintRoot: 'Not in a Zhiyin-managed install root; toggle only',
        repair: 'Repair',
        repairAsk: 'Remove references to skills that no longer exist from your packs? The current config is backed up first.',
        repairOk: 'Removed stale references: ',
        repairNone: 'Nothing to repair',
        repairHint: 'Drop references to skills that no longer exist',
        refCountTitle: 'Packs referencing it',
        refCountShort: 'Refs',
        backupsTitle: 'Config backups',
        backupsHint: 'Written automatically on config import and rollback; at most 20 kept, newest first',
        backupsEmpty: 'No backups yet',
        backupsRollback: 'Roll back to this',
        backupsAsk: 'Roll back to this backup? The current config is backed up first.',
        backupsOpen: 'Backups',
        revealFailed: 'Could not open the skill folder: ',
        archiveDeleteAsk: 'Delete this archived skill permanently? Its directory will be removed for good.',
        archiveDeleteAskMany: 'Delete the {n} selected archived skills permanently? Their directories will be removed for good.',
        installAborting: 'Cancelling…',
        installAborted: 'Install cancelled',
        srcLinked: '{n} skills in the user directory are symlinks to .agents and counted once',
        originAgents: 'Skill library ~/.agents/skills',
        originUser: 'User directory ~/.dsh/skills',
        originProject: 'Project .dsh/skills',
        originUnknown: 'Unknown',
        statBySource: 'Source',
        costInfoTip: 'Open the meaning, suggested ceilings and sources behind this number',
        tabMarket: 'Market',
        tabArchive: 'Archive',
        installHintShort: 'Install a skill from skills.sh, GitHub or a local folder',
        packEmptyTitle: 'No skill packs yet',
        emptyHint: 'Try another keyword, or clear the search to see every skill',
        marketSearchPlaceholder: 'Search skills.sh (2+ characters; leave empty for trending)',
        marketSearch: 'Search',
        searchDone: 'Updated',
        searchFailed: 'Failed',
        marketTrending: 'Trending skills (by install count)',
        marketResult: 'Search results',
        marketEmpty: 'No skills found',
        marketEmptyHint: 'Try another keyword; 2+ characters, or leave empty for trending',
        marketOpen: 'Open the skill page on skills.sh',
        marketHostedHint: 'Hosted on skills.sh with no public GitHub repository, so it cannot be installed directly',
        marketHostedBadge: 'Hosted',
        marketSourceTitle: 'Source repository',
        marketInstallsTitle: 'Install count recorded by skills.sh',
        marketInstalls: 'installs',
        marketNoDesc: 'No description yet',
        marketCmdHint: 'Matching skills CLI command',
        marketInstallable: 'Installable',
        marketInstalled: 'Installed',
        marketReinstallHint: 'Reinstall (overwrites the chosen directory; use it to update)',
        marketReinstall: 'Reinstall',
        marketHostedHint2: 'Hosted on skills.sh with no public repository; click to open the install notes there',
        marketOpenShort: 'View',
        marketInstalling: 'Installing…',
        marketBusyOther: 'Another skill is installing; please wait',
        installShort: 'Install',
        restoreTarget: 'Restore to',
        restoreOrigin: 'original location (recommended)',
        archiveDeletePicked: 'Delete selected',
        archiveError: 'Archive action failed: ',
        archiveEmptyTitle: 'Nothing archived yet',
        archiveEmpty: 'Uninstall a skill on the Skills tab and it moves here, ready to restore at any time.',
        archivePick: 'Select for bulk deletion',
        archivedAt: 'Archived',
        originAt: 'Originally: ',
        restoreHint: 'Restore into the target directory chosen above',
        restore: 'Restore',
        archiveDeleteHint: 'Delete this archived skill permanently (cannot be undone)',
        archiveDelete: 'Delete from archive',
        descCharsTitle: 'SKILL.md description characters (counted into catalog cost)',
        charsUnit: 'chars',
        revealHint: 'Open this skill folder in your file manager',
        reveal: 'Open folder',
        costInfoTitle: 'Catalog characters · how it is counted and what to aim for',
        costWhatHead: 'How it is counted',
        costWhat1: 'Each visible skill contributes min(description length, 500) characters; 200 characters of framing overhead are added on top.',
        costWhat2: 'Descriptions only — no skill names and no SKILL.md body, so this is the lower bound of the catalog cost.',
        costWhat3: 'Disabled skills, skills outside enabled packs, and skills blocked by an outer switch are not counted.',
        costWhyHead: 'Where the cost comes from',
        costWhy1: 'The description is the routing signal the model uses to decide when to call a skill, and it is injected with every request.',
        costWhy2: 'Catalog changes are appended to the session history as new entries, so a single request can carry several catalogs.',
        costWhy3: 'When the total exceeds what the model can hold, the implementation drops descriptions that were used least recently, and dropped skills stop being routable.',
        costLimitHead: 'What to aim for',
        costLimit1: 'Total catalog: 1% of the context window. A 200K window works out to 2,000 tokens.',
        costLimit2: 'Characters per token: Chinese is about 1 character per token, so aim for 2,000 characters or less; English is about 4 characters per token, so 8,000 or less. Mixed text falls in between.',
        costLimit3: 'A single description: aim for 400–1,000 characters; the hard limit is 1,024 (the API rejects anything longer).',
        costDoHead: 'How to bring it down',
        costDo1: 'Keep only "what it does + when to use it" in the description, put trigger words first, and drop background and filler.',
        costDo2: 'Move long-unused skills out of the enabled pack or disable them; the cost drops to zero.',
        costDo3: 'Merge skills in the same domain to cut duplicate routing signals.',
        costSourceHead: 'Sources',
        costSrc1: 'Anthropic docs · Agent Skills request limits',
        costSrc1Note: ': description is capped at 1,024 characters and name at 64 characters.',
        costSrc2: 'Claude Code description-length tiers (2026)',
        costSrc2Note: ': the routing list merges at 1,536 characters; the catalog budget is 1% of the context window, and over-budget descriptions are dropped by LRU.',
        gotIt: 'Got it',
        installSkillHint: 'This skill will be installed: ',
        installing: 'Installing…',
        installAbortHint: 'Cancel this install (a repository being cloned is terminated)',
        installAbort: 'Cancel',
        backupsEmptyHint: 'A backup is kept automatically on import or rollback, up to 20',
        noteClear: 'Clear content',
      },
    }

    // 字号与透明度 token：原先散落 52 处硬编码，正文只有 12.5px、说明 12px + opacity 0.6，
    // 100% 缩放下中文阅读吃力。这里收敛成一套可读尺度，其余样式一律引用。
    const fs = { body: 14, hint: 13, meta: 12, badge: 11.5, cardName: 15, title: 22, section: 13.5 }
    const op = { hint: 0.78, meta: 0.65, dim: 0.72, faint: 0.55 }

    const css = {
      // 左侧入口打开的整页：自己承担页边距与滚动（设置弹窗那套外壳不在这里）。
      mainPage: {
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        padding: '24px 32px 56px',
      },
      // 设置弹窗里用固定窄宽；左侧入口是整页，用流式宽度（窗口能拉多宽就用多宽，封顶 1600）。
      page: { maxWidth: 780, margin: '0 auto', padding: '2px 0 48px', color: 'inherit' },
      pageWide: { width: '100%', maxWidth: 1600, margin: '0 auto', padding: '2px 0 48px', color: 'inherit' },
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
      modalTitle: { fontSize: fs.body, fontWeight: 600, flex: '1 1 auto', minWidth: 0 },
      modalBody: {
        flex: '1 1 auto',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: 120,
      },
      modalFoot: { display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
      costSection: { fontSize: fs.hint, lineHeight: 1.65, opacity: 0.88, marginTop: 8 },
      costHead: { fontSize: fs.body, fontWeight: 600, marginTop: 16, color: 'var(--zhiyin-accent, #e0743c)' },
      costBullet: {
        fontSize: fs.hint,
        lineHeight: 1.65,
        opacity: 0.88,
        marginTop: 8,
        // 支持 text-wrap: pretty 的浏览器会主动避免末行只剩一两个字。
        textWrap: 'pretty',
      },
      costLink: { color: 'var(--zhiyin-accent, #e0743c)', textDecoration: 'none' },
      // 首屏骨架屏：市场要并发拉 5 组 skills.sh 数据，先占位，避免空白让人以为没加载。
      skeletonCard: {
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box',
        breakInside: 'avoid',
        marginBottom: 16,
        verticalAlign: 'top',
        borderRadius: 14,
        padding: '14px 16px 12px',
        background: 'rgba(128,128,128,0.045)',
        border: '1px solid rgba(128,128,128,0.10)',
      },
      skeletonBar: (width, height = 12) => ({
        width,
        height,
        borderRadius: 6,
        background: 'linear-gradient(90deg, rgba(128,128,128,0.10) 25%, rgba(128,128,128,0.20) 37%, rgba(128,128,128,0.10) 63%)',
        backgroundSize: '400% 100%',
        animation: 'zhiyin-shimmer 1.4s ease-in-out infinite',
        marginTop: 8,
      }),
      // 技能市场卡片：瀑布流（多列、高度随内容）、hover 抬升；与列表视图明显区分。
      marketGrid: {
        marginTop: 16,
        columnWidth: 360,
        columnGap: 16,
      },
      marketCard: (hover) => ({
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box',
        breakInside: 'avoid',
        marginBottom: 16,
        verticalAlign: 'top',
        borderRadius: 14,
        padding: '14px 16px 12px',
        background: hover ? 'rgba(128,128,128,0.10)' : 'rgba(128,128,128,0.045)',
        border: '1px solid ' + (hover ? 'var(--zhiyin-accent, #e0743c)' : 'rgba(128,128,128,0.10)'),
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.28)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease',
      }),
      marketCardTop: { display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0 },
      marketCardTitle: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: fs.cardName,
        fontWeight: 600,
        lineHeight: 1.3,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        wordBreak: 'break-word',
      },
      marketCardMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 8, fontSize: fs.meta, opacity: op.meta },
      marketCardDesc: {
        fontSize: fs.hint,
        lineHeight: 1.6,
        opacity: op.hint,
        marginTop: 10,
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        wordBreak: 'break-word',
      },
      marketCardCmd: {
        display: 'block',            // code 默认是 inline，overflow/ellipsis 对它无效，长命令会撑破卡片
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: fs.meta,
        opacity: 0.62,
        marginTop: 10,
        padding: '6px 8px',
        borderRadius: 8,
        background: 'rgba(128,128,128,0.10)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      marketCardFoot: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(128,128,128,0.12)' },
      // 空态与错误态：之前都是一行裸 hint，分不清「没事」和「出错」。
      emptyBox: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '28px 20px', marginTop: 16, textAlign: 'center',
        borderRadius: 12, border: '1px dashed rgba(128,128,128,0.22)',
        background: 'rgba(128,128,128,0.03)',
        fontSize: fs.hint, opacity: op.hint, lineHeight: 1.6,
      },
      emptyTitle: { fontSize: fs.body, fontWeight: 600, opacity: 0.9 },
      errorBox: {
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '10px 12px', marginTop: 12,
        borderRadius: 10, border: '1px solid rgba(208,90,74,0.35)',
        background: 'rgba(208,90,74,0.10)', color: '#e08a7e',
        fontSize: fs.hint, lineHeight: 1.55,
      },
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
        fontSize: fs.body,
        padding: '7px 15px',
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
      title: { fontSize: fs.title, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' },
      subtitle: { opacity: op.hint, fontSize: fs.body },
      // Star 入口：与副标题同一行、视觉重量比副标题轻一档（opacity 0.7），点击进入仓库。
      starLink: {
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        marginLeft: 2,
        borderRadius: 999,
        border: '1px solid transparent',
        background: 'rgba(128,128,128,0.08)',
        color: 'inherit',
        font: 'inherit',
        fontSize: fs.hint,
        opacity: 0.7,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'opacity 120ms ease, background 120ms ease, border-color 120ms ease',
      },
      row: { display: 'flex', alignItems: 'center', columnGap: 12, rowGap: 8, flexWrap: 'wrap', marginTop: 18 },
      switchRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: fs.body,
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
        fontSize: fs.meta,
        lineHeight: '13px',
        textAlign: 'center',
        opacity: 0.55,
        cursor: 'help',
        flex: '0 0 auto',
        userSelect: 'none',
      },
      pill: (on) => ({
        fontSize: fs.meta,
        padding: '2px 10px',
        borderRadius: 999,
        border: 'none',
        background: on ? 'rgba(224,116,60,0.16)' : 'rgba(128,128,128,0.14)',
        color: on ? 'var(--zhiyin-accent, #e0743c)' : 'inherit',
        opacity: on ? 1 : 0.6,
        flex: '0 0 auto',
      }),
      hint: { fontSize: fs.hint, opacity: op.hint, lineHeight: 1.55 },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
        gap: 8,
        // 整页模式下页面能到 1600px，统计卡摊太开会显得松散，这里封住。
        maxWidth: 900,
        marginTop: 16,
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
      statLabel: { fontSize: fs.meta, opacity: op.meta },
      statValue: { fontSize: 20, fontWeight: 600, marginTop: 4, lineHeight: 1.2 },

      // 折叠信息区：默认全收起，只占一行标题；点开一项时其它项自动收起。
      infoWrap: {
        marginTop: 14,
        borderRadius: 12,
        border: '1px solid rgba(128,128,128,0.12)',
        background: 'rgba(128,128,128,0.035)',
        overflow: 'hidden',
      },
      infoHead: {
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '10px 14px', border: 'none', background: 'transparent', color: 'inherit',
        fontSize: fs.hint, textAlign: 'left', cursor: 'pointer',
      },
      infoHeadOn: { background: 'rgba(128,128,128,0.08)' },
      infoBody: { padding: '2px 14px 14px' },
      // 展开后的每一块：用极淡的分隔线区隔，不靠标题行占位。
      infoSection: { paddingTop: 10, marginTop: 10, borderTop: '1px solid rgba(128,128,128,0.10)' },
      infoSectionLabel: { fontSize: fs.hint, fontWeight: 600, opacity: 0.62, marginBottom: 4 },
      infoAlert: {
        display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto',
        color: 'var(--zhiyin-accent, #e0743c)', fontSize: fs.hint, fontWeight: 600,
      },
      group: {
        marginTop: 16,
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
      groupTitle: { fontSize: fs.body, fontWeight: 600 },
      groupDesc: { fontSize: fs.hint, opacity: op.hint, lineHeight: 1.55 },
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
      matrixName: { fontSize: fs.body, fontWeight: 600, flex: '0 0 auto', minWidth: 96 },
      matrixBy: { fontSize: fs.hint, opacity: op.hint, flex: '1 1 auto', minWidth: 0 },
      matrixNum: { fontSize: fs.body, opacity: 0.85, flex: '0 0 auto' },
      refBadge: { fontSize: fs.meta, opacity: 0.8, flex: '0 0 auto' },
      budgetRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        padding: '0 2px',
      },
      budgetLabel: { fontSize: fs.meta, opacity: op.meta, flex: '0 0 auto' },
      budgetNum: { fontSize: fs.body, fontWeight: 600, flex: '0 0 auto' },
      input: {
        flex: '1 1 220px',
        minWidth: 160,
        padding: '7px 12px',
        borderRadius: 10,
        border: '1px solid rgba(128,128,128,0.14)',
        background: 'rgba(128,128,128,0.05)',
        color: 'inherit',
        fontSize: fs.body,
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
        fontSize: fs.body,
      },
      modalSm: { width: 420 },
      modalMd: { width: 520 },
      // 说明类弹窗：正文是长句，520px 下常出现「第二行只剩一两个字」，这里放宽一档。
      modalWide: { width: 720 },
      modalGuide: { width: 900, maxWidth: '92vw', maxHeight: '84vh' },
      guideBody: { fontSize: fs.hint, lineHeight: 1.7, opacity: 0.94 },
      guideH1: { fontSize: fs.title - 4, fontWeight: 600, margin: '0 0 10px' },
      guideH2: { fontSize: fs.cardName, fontWeight: 600, margin: '20px 0 8px' },
      guideH3: { fontSize: fs.body, fontWeight: 600, margin: '14px 0 6px' },
      guidePara: { margin: '8px 0', opacity: 0.9 },
      guideList: { margin: '6px 0', paddingLeft: 18 },
      guideBullet: { margin: '4px 0', opacity: 0.9 },
      guideCode: { padding: '1px 5px', borderRadius: 4, background: 'rgba(128,128,128,0.18)', fontSize: fs.meta },
      guidePre: { padding: 10, borderRadius: 8, background: 'rgba(128,128,128,0.1)', overflowX: 'auto', fontSize: fs.meta, margin: '8px 0' },
      guideTable: { width: '100%', borderCollapse: 'collapse', margin: '10px 0', fontSize: fs.meta },
      guideTh: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid rgba(128,128,128,0.28)', fontWeight: 600, whiteSpace: 'nowrap' },
      guideTd: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid rgba(128,128,128,0.12)', verticalAlign: 'top' },
      guideHr: { border: 'none', borderTop: '1px solid rgba(128,128,128,0.2)', margin: '16px 0' },
      guideLink: { color: 'inherit', textDecoration: 'underline' },
      textarea: {
        flex: '1 1 auto',
        minHeight: 120,
        padding: '6px 10px',
        borderRadius: 8,
        border: 'none',
        background: 'rgba(128,128,128,0.12)',
        color: 'inherit',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: fs.hint,
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
        fontSize: fs.body,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
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
      // 语言切换按钮上的小字：标出点下去切到哪种语言
      langTag: { fontSize: 10, fontWeight: 600, letterSpacing: 0.4, opacity: 0.8 },
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
        fontSize: fs.body,
        opacity: 0.7,
      },
      itemMain: { flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
      itemHead: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
      name: {
        fontFamily: 'inherit',
        fontSize: fs.body,
        fontWeight: 600,
        flex: '0 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      badge: (on) => ({
        fontSize: fs.badge,
        padding: '0 6px',
        borderRadius: 999,
        border: 'none',
        background: 'rgba(128,128,128,0.16)',
        opacity: on ? 0.95 : 0.3,
        lineHeight: '17px',
        flex: '0 0 auto',
      }),
      badgeWarn: {
        fontSize: fs.badge,
        padding: '0 6px',
        borderRadius: 999,
        border: 'none',
        background: 'rgba(200,120,60,0.22)',
        lineHeight: '17px',
        flex: '0 0 auto',
      },
      metaText: { fontSize: fs.meta, opacity: op.meta, flex: '0 0 auto', letterSpacing: '0.01em' },
      desc: {
        fontSize: fs.hint,
        opacity: op.hint,
        lineHeight: 1.55,
        lineHeight: 1.45,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      },
      meta: {
        fontSize: fs.meta,
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
        fontSize: fs.meta,
        opacity: 0.62,
        flexWrap: 'wrap',
      },
      metaDot: { opacity: 0.6 },
      primaryBtn: {
        marginLeft: 'auto',
        padding: '5px 14px',
        borderRadius: 8,
        border: '1px solid var(--zhiyin-accent, #e0743c)',
        background: 'rgba(224,116,60,0.16)',
        color: 'var(--zhiyin-accent, #e0743c)',
        fontSize: fs.body,
        fontWeight: 600,
        cursor: 'pointer',
        // 图标 + 文字必须同一行：窄卡片里之前被挤成上下两行。
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        flex: '0 0 auto',
      },
      // 告警区（内容之上、点名具体对象）
      alertWrap: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 },
      alertItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 10,
        border: '1px solid rgba(224,163,62,0.35)',
        background: 'rgba(224,163,62,0.10)',
        fontSize: fs.body,
        lineHeight: 1.45,
      },
      alertIcon: { flex: '0 0 auto', opacity: 0.8, marginTop: 1 },
      // 工具条（卡片/列表 分段 · 搜索 · 排序）
      toolbar: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' },
      sortWrap: { display: 'inline-flex', alignItems: 'center', gap: 6, flex: '0 0 auto', fontSize: fs.hint, opacity: 0.85 },
      sortSelect: {
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid rgba(128,128,128,0.14)',
        background: 'rgba(128,128,128,0.05)',
        color: 'inherit',
        fontSize: fs.body,
      },
      // 原生 <option> 弹层不继承 select 样式，深色主题会白底浅字看不见——显式给深底浅字。
      optionStyle: {
        background: 'var(--vscode-editorWidget-background, #252526)',
        color: 'var(--vscode-foreground, #e6e6e6)',
      },
      // 技能卡网格
      // 瀑布流：按列宽自动分栏，卡片高度随内容变化，不再被同一行拉齐。
      cardGrid: {
        marginTop: 16,
        columnWidth: 380,
        columnGap: 16,
      },
      // 技能卡：与市场卡片同一套视觉语言（hover 抬升、品牌色边框、阴影）。
      skillCard: (hover) => ({
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box',
        breakInside: 'avoid',
        marginBottom: 16,
        verticalAlign: 'top',
        borderRadius: 14,
        padding: '14px 16px 12px',
        background: hover ? 'rgba(128,128,128,0.10)' : 'rgba(128,128,128,0.045)',
        border: '1px solid ' + (hover ? 'var(--zhiyin-accent, #e0743c)' : 'rgba(128,128,128,0.10)'),
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.28)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease',
      }),
      cardHead: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
      cardName: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: fs.cardName,
        fontWeight: 600,
        flex: '0 1 auto',
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      cardDesc: {
        fontSize: fs.hint,
        opacity: op.hint,
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: 20,
      },
      cardFoot: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' },
      // 收藏按钮：未收藏是灰色空心星，收藏后点亮为主题强调色。
      favBtn: (active) => ({
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        padding: 0,
        marginRight: 2,
        border: 'none',
        borderRadius: 5,
        background: 'transparent',
        cursor: 'pointer',
        color: active ? 'var(--zhiyin-accent, #e0743c)' : 'inherit',
        opacity: active ? 1 : 0.32,
        transition: 'opacity 120ms ease, color 120ms ease',
      }),
      loadMoreWrap: { display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 8 },
      dot: (on) => ({
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: on ? '#4a9d6a' : 'rgba(128,128,128,0.5)',
        flex: '0 0 auto',
      }),
      // 技能包行尾 … 菜单
      sectionLabel: { fontSize: fs.meta, opacity: op.meta, marginTop: 4 },
      previewList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxHeight: 168,
        overflowY: 'auto',
        fontSize: fs.hint,
        lineHeight: 1.45,
      },
      cbRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 6px',
        borderRadius: 7,
        cursor: 'pointer',
        fontSize: fs.hint,
      },
      mono: { fontFamily: 'var(--vscode-editor-font-family, monospace)', fontSize: fs.hint },
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
        fontSize: fs.hint,
        cursor: 'pointer',
      },
      menuItemOn: {
        background: 'rgba(128,128,128,0.14)',
        color: 'var(--zhiyin-accent, #e0743c)',
      },
      intervalBtn: {
        // 不用 ...css.btn：本对象就是 css 自身，初始化时引用会抛 Cannot access 'css' before initialization。
        borderRadius: 10,
        border: '1px solid rgba(128,128,128,0.16)',
        background: 'transparent',
        color: 'inherit',
        fontSize: fs.body,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        padding: '6px 10px',
        minWidth: 110,
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        textAlign: 'left',
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
  alert: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', 'M12 7.5v5'],
    ['path', 'M12 16.2v.1'],
  ],
  info: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', 'M12 11v6'],
    ['circle', { cx: 12, cy: 7.6, r: 0.6, fill: 'currentColor', stroke: 'none' }],
  ],
  folder: [
    ['path', 'M3 7.5A2.5 2.5 0 0 1 5.5 5h3.2c.5 0 1 .22 1.33.6l1.1 1.2c.33.38.83.6 1.33.6h4.04A2.5 2.5 0 0 1 19 9.9v6.6A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5z'],
  ],
  chevronDown: [
    ['path', 'M6 9l6 6 6-6'],
  ],
  star: [
    ['path', 'M12 3.5l2.6 5.3 5.9 0.86-4.25 4.14 1 5.87L12 16.9l-5.25 2.76 1-5.87L3.5 9.66l5.9-0.86z'],
  ],
  github: [
    ['path', 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'],
  ],
  globe: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['path', 'M3 12h18'],
    ['path', 'M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18'],
  ],
  book: [
    ['path', 'M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z'],
    ['path', 'M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5A1.5 1.5 0 0 0 20 18.5z'],
  ],
}

function Icon({ name, size = 15, filled = false, spin = false }) {
  const shapes = ICONS[name] ?? []
  return h(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      // filled 用于收藏星标这类「点亮」状态：填充当前色，描边保留轮廓。
      fill: filled ? 'currentColor' : 'none',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className: spin ? 'zhiyin-spin' : undefined,
      style: spin
        ? { flex: '0 0 auto', display: 'block', animation: 'zhiyin-spin 0.9s linear infinite' }
        : { flex: '0 0 auto', display: 'block' },
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

    /**
     * 使用指南渲染：GUIDE.md 只用到 Markdown 的最小子集（标题、列表、表格、代码块、
     * 行内代码、粗体、链接）。这里只实现这个子集，不引第三方依赖。
     */
    function renderMarkdown(markdown) {
      const source = String(markdown ?? '').replace(/\r\n/g, '\n').split('\n')
      const blocks = []
      let seq = 0
      const nextKey = () => 'g' + seq++
      const inline = (text) => {
        const nodes = []
        const pattern = /\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)/g
        let last = 0
        let match
        while ((match = pattern.exec(text)) !== null) {
          if (match.index > last) nodes.push(text.slice(last, match.index))
          const token = match[0]
          if (token.slice(0, 2) === '**') {
            nodes.push(h('strong', { key: nextKey() }, token.slice(2, -2)))
          } else if (token.charAt(0) === '\x60') {
            nodes.push(h('code', { key: nextKey(), style: css.guideCode }, token.slice(1, -1)))
          } else {
            const parts = token.match(/\[([^\]]+)\]\(([^)]+)\)/) ?? []
            nodes.push(h('a', { key: nextKey(), href: parts[2] ?? '#', target: '_blank', rel: 'noreferrer', style: css.guideLink }, parts[1] ?? token))
          }
          last = match.index + token.length
        }
        if (last < text.length) nodes.push(text.slice(last))
        return nodes
      }
      let i = 0
      while (i < source.length) {
        const line = source[i]
        const trimmed = line.trim()
        if (!trimmed) { i += 1; continue }
        if (trimmed.slice(0, 3) === '\x60\x60\x60') {
          const code = []
          i += 1
          while (i < source.length && source[i].trim().slice(0, 3) !== '\x60\x60\x60') { code.push(source[i]); i += 1 }
          i += 1
          blocks.push(h('pre', { key: nextKey(), style: css.guidePre }, h('code', null, code.join('\n'))))
          continue
        }
        const heading = trimmed.match(/^(#{1,3})\s+(.*)$/)
        if (heading) {
          const level = heading[1].length
          const style = level === 1 ? css.guideH1 : level === 2 ? css.guideH2 : css.guideH3
          blocks.push(h('div', { key: nextKey(), style }, inline(heading[2])))
          i += 1
          continue
        }
        if (trimmed === '---') {
          blocks.push(h('hr', { key: nextKey(), style: css.guideHr }))
          i += 1
          continue
        }
        if (trimmed.charAt(0) === '|') {
          const rows = []
          while (i < source.length && source[i].trim().charAt(0) === '|') { rows.push(source[i]); i += 1 }
          const cells = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
          const head = cells(rows[0] ?? '')
          const body = rows.slice(1).filter((row) => !/^[\s|:-]+$/.test(row)).map(cells)
          blocks.push(h('table', { key: nextKey(), style: css.guideTable },
            h('thead', null, h('tr', null, head.map((cell, ci) => h('th', { key: ci, style: css.guideTh }, inline(cell))))),
            h('tbody', null, body.map((row, ri) => h('tr', { key: ri }, row.map((cell, ci) => h('td', { key: ci, style: css.guideTd }, inline(cell)))))),
          ))
          continue
        }
        if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
          const items = []
          while (i < source.length && (/^[-*]\s+/.test(source[i].trim()) || /^\d+\.\s+/.test(source[i].trim()))) {
            items.push(source[i].trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))
            i += 1
          }
          blocks.push(h('ul', { key: nextKey(), style: css.guideList },
            items.map((item, ii) => h('li', { key: ii, style: css.guideBullet }, inline(item)))))
          continue
        }
        const para = []
        while (i < source.length) {
          const t = source[i].trim()
          if (!t || t.charAt(0) === '|' || /^#{1,3}\s/.test(t) || /^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t) || t === '---' || t.slice(0, 3) === '\x60\x60\x60') break
          para.push(t)
          i += 1
        }
        blocks.push(h('p', { key: nextKey(), style: css.guidePara }, inline(para.join(' '))))
      }
      return blocks
    }
    /**
     * 品牌字标「织音」的路径（描摹稿）。三种颜色与三条股线一一对应：
     * paper 跟随主题前景色，weave / light 用品牌双橙——与交叉标记、logo.svg 保持同步。
     */
    const WORDMARK_COLORS = { paper: 'currentColor', weave: '#F26A1B', light: '#FF955C' }
    const WORDMARK_PATHS = [
        { d: 'M98.13 139.26 L94.36 133.57 L83.87 134.83 L57.97 144.04 L50.49 150.28 L56.53 155.08 L70.16 152.22 L89.5 146.4 L95.69 143.19 Z', color: 'paper' },
        { d: 'M81.67 39.72 L75.72 40.5 L65.75 47.32 L58.59 55.47 L54.81 66.03 L55.4 76.75 L62.84 86.18 L54.34 99.87 L52.66 110.38 L57.64 122.03 L69.29 128.38 L82.75 125.46 L90.32 120.12 L92.91 114.15 L87.59 108.66 L75.26 115.09 L68.22 115.12 L64.08 107.11 L71.46 93.91 L86.42 83.73 L90.29 79.37 L89.44 75.06 L84.95 71.22 L75.71 76 L69.37 76 L64.91 69.92 L69.62 58.51 L83.86 48.17 L85.11 42.97 Z', color: 'paper' },
        { d: 'M122.71 41.96 L113.7 46.49 L101.76 59.31 L96.54 74.49 L99.07 85.33 L107.91 95.28 L122.51 103.02 L134.82 103.98 L147.01 100.8 L157.21 95.36 L164.77 84.68 L166.47 73.17 L163.7 61.42 L152.03 48.38 L134.3 41.93 Z M128.97 66.25 L124.71 52.6 L137.97 52.51 L149.61 63.6 L153 70.02 L140.09 73.52 L147.88 87.27 L136.21 92 L127.74 92 L118.03 89.05 L125.84 79.71 L108.49 69.4 Z', color: 'paper' },
        { d: 'M121.58 117.67 L111.05 118.82 L103.73 128.37 L104.43 139.29 L111.57 146.26 L122.52 146.51 L131.11 137.52 L131.23 126.99 L128.02 120.73 Z M117 122.5 L118.75 141 L110.45 136.25 Z', color: 'weave' },
        { d: 'M158.25 117.25 C140.34 123.52 143.76 141.46 161.25 144.5 C177.42 139.58 178.13 129.14 167.5 118 C164.42 117.75 161.33 117.5 152.77 119.61 Z M166.75 123.75 C166.81 123.97 156.81 144.47 154.09 136.25 C157.42 133.33 159.08 130.67 153.85 125.67 C165.41 123.34 163 123.75 168.18 133.97 Z', color: 'weave' },
        { d: 'M207.36 84.49 L212.41 91.75 L310.42 91.75 L318.86 94.1 L312.16 83.24 L215.42 86.11 Z', color: 'paper' },
        { d: 'M216.75 58.88 L220.77 63.48 L304.42 63.51 L308.34 59.32 L305.55 53.88 L220.29 53.74 Z', color: 'paper' },
        { d: 'M229.44 110.37 L224.05 123.03 L223.97 137.75 L229.76 146.7 L239 153.24 L255.21 156.76 L271.36 156.73 L287.84 150.47 L295.24 142.42 L297.75 135.24 L297.75 118.41 L292.25 108.93 L283.74 102.66 L272.28 98.94 L249.78 98.89 L239.6 102.77 Z M237.25 133.32 L277.16 127.34 L287.57 133.92 L285.17 138.82 L274.78 142.5 L255.18 143.67 L240.75 141.97 Z M235.75 121.75 C240.25 104.88 263.82 106.88 276.4 107.66 C281.1 111.93 291.7 118.14 285.91 125.06 C268.42 121.92 252.08 121.83 235.75 121.75 Z', color: 'paper' },
        { d: 'M244 69 C239.71 72.58 241.19 70.21 240.25 76.5 C249.05 87.94 258.79 69 246.91 75.42 Z', color: 'light' },
        { d: 'M266.32 38.99 L261.9 37.85 L257 41.15 L257 47.07 L259.47 49.75 L263.96 49.75 L268.75 46.81 L268.75 41.97 Z', color: 'paper' },
        { d: 'M277.31 69 L274 72.31 L281 74.99 L275.5 79.55 L282.07 79.75 L284.75 77.07 L284.75 72.52 L281.21 69 Z', color: 'light' },
        { d: 'M 317.75 140 C 309.05 140 309 140.65 309 149.75 C 304.51 153.68 308.19 156.29 312.75 153.25 C 312.42 150.17 312.08 147.08 311.75 144 C 314.48 142.48 317.75 143.72 317.75 140 Z', color: 'paper' },
        { d: 'M 325.75 40.25 C 317.12 35.58 316.85 35.48 314 44.75 C 311.86 46.89 313.33 45.92 309 46.5 C 307.83 51.17 309.71 52.9 314.5 52.5 C 316.77 48.97 316.27 44.48 319 41.75 C 325.78 42.6 324.36 44.41 325.75 40.25 Z', color: 'paper' },
    ]
    const WORDMARK_VIEW = { minX: 50.49, minY: 35.48, w: 275.29, h: 121.28 }
    /** 页面标题位的品牌字标：随主题变色，不依赖外部图片。 */
    function Wordmark({ height = 26 }) {
      const v = WORDMARK_VIEW
      const scale = height / v.h
      return h('svg', {
        viewBox: v.minX + ' ' + v.minY + ' ' + v.w + ' ' + v.h,
        width: Math.round(v.w * scale),
        height: Math.round(height),
        role: 'img',
        'aria-label': '织音',
        style: { flex: '0 0 auto', display: 'block' },
      }, WORDMARK_PATHS.map((path, index) =>
        h('path', { key: 'wm-' + index, d: path.d, fill: WORDMARK_COLORS[path.color], fillRule: 'evenodd' }),
      ))
    }
    /**
     * 搜索按钮的相位样式（tuyi 编排层）：
     * burst 只做一次性 2px 轻推（「点到了」），sync 由内部 Spinner 承担旋转，
     * done / error 用结论色静态停留，不抖动（抖动只留给输入校验）。
     */
    function searchBtnStyle(phase) {
      const base = { display: 'inline-flex', alignItems: 'center', gap: 6 }
      if (phase === 'burst') return { ...base, transform: 'translateY(1px)', transition: 'transform 120ms ease' }
      if (phase === 'done') return { ...base, color: '#4a9d6a', borderColor: 'rgba(74,157,106,0.5)' }
      if (phase === 'error') return { ...base, color: '#d05a4a', borderColor: 'rgba(208,90,74,0.5)' }
      return base
    }
    /** 收藏星标：卡片视图与列表视图共用同一实现，避免两处各写一遍判断。 */
    function FavoriteButton({ skill, busy, say, onToggle }) {
      const active = skill.favorite === true
      const label = active ? say('favoriteOff', '取消收藏') : say('favoriteOn', '收藏并置顶')
      return h(
        'button',
        {
          type: 'button',
          style: css.favBtn(active),
          title: label,
          'aria-label': label,
          'aria-pressed': active ? 'true' : 'false',
          disabled: busy,
          onClick: () => onToggle(skill.name, !active),
        },
        h(Icon, { name: 'star', size: 13, filled: active }),
      )
    }
    function Page({ close, t, wide }) {
      // 界面语言：默认跟随宿主（t 返回的就是宿主当前语言），用户可在这里覆盖并记住。
      const hostLang = typeof t === 'function' && t('guideLang') === 'en' ? 'en' : 'zh'
      const [lang, setLang] = React.useState(() => {
        try {
          const saved = window.localStorage.getItem('zhiyin.lang')
          if (saved === 'zh' || saved === 'en') return saved
        } catch {
          /* localStorage 不可用就走宿主语言 */
        }
        return hostLang
      })
      React.useEffect(() => {
        try { window.localStorage.setItem('zhiyin.lang', lang) } catch { /* 忽略 */ }
      }, [lang])
      // 优先级：本插件的语言设置 > 宿主语言 > 字面兜底。
      const say = React.useCallback(
        (key, fallback) => {
          const own = dictionary[lang]
          if (own && Object.prototype.hasOwnProperty.call(own, key) && own[key]) return own[key]
          const value = typeof t === 'function' ? t(key) : undefined
          return value && value !== key ? value : fallback
        },
        [t, lang],
      )
      // 骨架屏的 shimmer 动画需要 @keyframes，行内样式写不了，挂一次 <style>。
      React.useEffect(() => {
        const id = 'zhiyin-keyframes'
        if (document.getElementById(id)) return undefined
        const tag = document.createElement('style')
        tag.id = id
        tag.textContent =
          '@keyframes zhiyin-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}' +
          '@keyframes zhiyin-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}' +
          '@media (prefers-reduced-motion: reduce){.zhiyin-spin{animation:none!important}}' +
          '@media (prefers-reduced-motion: reduce){.zhiyin-skeleton{animation:none!important}}'
        document.head.appendChild(tag)
        return undefined
      }, [])
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
      const [backups, setBackups] = React.useState(null)               // 配置备份列表
      const [backupsOpen, setBackupsOpen] = React.useState(false)      // 备份列表弹窗
      // 技能市场（skills.sh）：热门默认、关键词搜索、一键安装到 SSOT。
      const [marketQuery, setMarketQuery] = React.useState('')
      const [marketItems, setMarketItems] = React.useState([])
      const [marketTrending, setMarketTrending] = React.useState(true)
      const [marketLoading, setMarketLoading] = React.useState(false)
      // 骨架屏占位数量跟随窗口宽度，而不是写死 6 个：最大化时列数变多，占位也要跟上。
      const skeletonCount = (() => {
        const width = typeof window === 'undefined' ? 1280 : window.innerWidth
        return Math.max(4, Math.min(12, Math.floor((width - 260) / 320)))
      })()
      const [marketError, setMarketError] = React.useState('')
      const [marketLoaded, setMarketLoaded] = React.useState(false)
      const [marketBusy, setMarketBusy] = React.useState(null)   // 正在安装的条目 id
      const [marketDone, setMarketDone] = React.useState({})     // 已装完的条目 id
      const [marketHover, setMarketHover] = React.useState(null) // 鼠标悬停的卡片 id
      const [marketLimit, setMarketLimit] = React.useState(40)   // 每次加载条数；「加载更多」按 20 递增（上限与 MARKET_MAX 一致：200）
      const [marketMore, setMarketMore] = React.useState(false)  // 正在加载更多
      const [marketRefreshing, setMarketRefreshing] = React.useState(false) // 刷新按钮自己的执行态
      /**
       * 搜索按钮的五相位（tuyi 编排层）：idle → burst（点到了）→ sync（在跑）
       * → done / error（结论色停留）→ idle。只有 burst 与 sync 会动；
       * done / error 是「有结论」的相位，用静态色 + 驻留表达。
       */
      const [searchPhase, setSearchPhase] = React.useState('idle')
      const searchTimers = React.useRef([])
      const clearSearchTimers = React.useCallback(() => {
        for (const timer of searchTimers.current) window.clearTimeout(timer)
        searchTimers.current = []
      }, [])
      // 组件卸载清定时器，避免状态机在已卸载组件上回写。
      React.useEffect(() => () => clearSearchTimers(), [clearSearchTimers])
      const [skillHover, setSkillHover] = React.useState(null)   // 鼠标悬停的技能卡 name
      const [marketDesc, setMarketDesc] = React.useState({})
      // 收藏：点一次切换，成功后重载 state 让置顶顺序生效。
      const toggleFavorite = (name, next) => {
        fetch('/zhiyin/favorite', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, value: next }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result || result.ok !== true) throw new Error(result?.error ?? '收藏失败')
            load()
          })
          .catch((error) => setState((previous) => ({ ...previous, error: say('favoriteFailed', '收藏失败：') + String(error?.message ?? error) })))
      }
      // 归档：被「卸载」移入 archive 的技能，可查看并恢复到指定目录。
      const [archiveEntries, setArchiveEntries] = React.useState([])
      const [archiveLoading, setArchiveLoading] = React.useState(false)
      const [archiveError, setArchiveError] = React.useState('')
      const [archiveTarget, setArchiveTarget] = React.useState('origin')
      const [costInfoOpen, setCostInfoOpen] = React.useState(false)
      const [guideOpen, setGuideOpen] = React.useState(false)         // 使用指南弹窗
      const [guideData, setGuideData] = React.useState(null)          // { zh, en } 两份正文
      const [guideBusy, setGuideBusy] = React.useState(false)
      const [guideError, setGuideError] = React.useState('')
      const [archivePicked, setArchivePicked] = React.useState([])   // 勾选的归档 key，用于批量删除
      const [installJobId, setInstallJobId] = React.useState('')     // 本次安装任务 id，用于中止
      React.useEffect(() => { try { window.localStorage.setItem('zhiyin.view', view) } catch {} }, [view])
      React.useEffect(() => { try { window.localStorage.setItem('zhiyin.sort', sortField) } catch {} }, [sortField])

      // 搜索防抖：250ms 静默期后再拿输入去过滤。
      React.useEffect(() => {
        const timer = setTimeout(() => setQuery(queryInput), 250)
        return () => clearTimeout(timer)
      }, [queryInput])

      // 使用指南：宿主直接读随包分发的 GUIDE.md / GUIDE.en.md，页面不再抄一份正文。
      const openGuide = React.useCallback(() => {
        setGuideOpen(true)
        if (guideData || guideBusy) return
        setGuideBusy(true)
        setGuideError('')
        fetch('/zhiyin/guide', { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then((payload) => setGuideData(payload))
          .catch((error) => setGuideError(String(error?.message ?? error)))
          .finally(() => setGuideBusy(false))
      }, [guideData, guideBusy])

      const load = React.useCallback(() => {
        setState((previous) => ({ ...previous, loading: true, error: null, exportError: null }))
        // 更新状态与技能列表一起取：徽标要和卡片同时出现，不能先没徽标再跳一下。
        const readJson = (url) => fetch(url, { headers: { accept: 'application/json' } })
          .then(async (response) => {
            if (!response.ok) {
              // 401/403 来自宿主的准入闸门：把原因说清楚，不要只留一个 HTTP 状态码。
              if (response.status === 401 || response.status === 403) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? (response.status === 401
                  ? say('needLogin', '需要先登录 DSH：请重新打开 dsh web 启动时打印的网址')
                  : say('refusedOrigin', '请求来源不受信任，已拒绝')))
              }
              throw new Error(`HTTP ${response.status}`)
            }
            return response.json()
          })
        Promise.all([readJson('/zhiyin/state'), readJson('/zhiyin/updates').catch(() => null)])
          .then(([data, updates]) => setState({ loading: false, data, error: null, exportError: null, updates }))
          .catch((error) =>
            setState((previous) => ({
              loading: false,
              data: previous.data,
              error: String(error?.message ?? error),
            })),
          )
      }, [])

      // 更新动作独立于全局 busy：检查一轮要一两分钟，不该把整页按钮都锁死。
      const [updateBusy, setUpdateBusy] = React.useState('')
      const [intervalOpen, setIntervalOpen] = React.useState(false)
      const [openInfo, setOpenInfo] = React.useState('')
      // 检查一轮要一两分钟：发起后不阻塞界面，改用轮询读取进度，跑完自动刷新。
      const [polling, setPolling] = React.useState(false)
      const checkUpdates = React.useCallback(() => {
        if (updateBusy === 'check') return
        setUpdateBusy('check')
        setPolling(true)
        // 只负责发起，不等结果；进度由下面的轮询 effect 读 /zhiyin/updates 的 running。
        fetch('/zhiyin/updates/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
          .then((response) => response.json())
          .then((result) => {
            if (result && result.ok === false && result.running !== true) {
              throw new Error(result?.error ?? '检查失败')
            }
            return null
          })
          .catch((error) => { setPolling(false); setUpdateBusy(''); setState((previous) => ({ ...previous, error: String(error?.message ?? error) })) })
      }, [updateBusy])

      // 轮询：只要有一轮在跑，每 2.5 秒读一次；跑完自动 load()，最近检查时间随之更新。
      React.useEffect(() => {
        if (!polling) return undefined
        let stopped = false
        const tick = async () => {
          if (stopped) return
          try {
            const response = await fetch('/zhiyin/updates', { headers: { accept: 'application/json' } })
            const payload = await response.json()
            if (stopped) return
            setState((previous) => ({ ...previous, updates: payload }))
            if (payload && payload.running === true) {
              setTimeout(tick, 2500)
              return
            }
            // 服务端已经不在跑了：结束轮询并整页刷新一次，拿到新的最近检查时间。
            setPolling(false)
            setUpdateBusy('')
            load()
          } catch {
            setTimeout(tick, 3000)
          }
        }
        const timer = setTimeout(tick, 1200)
        return () => { stopped = true; clearTimeout(timer) }
      }, [polling, load])

      // 打开页面时若后台已有一轮在跑（如启动 5 分钟后的自动检查），也接上轮询。
      React.useEffect(() => {
        if (state.updates?.running === true && polling === false) setPolling(true)
      }, [state.updates?.running, polling])

      const applyUpdate = React.useCallback((name, force) => {
        if (updateBusy) return
        setUpdateBusy(name)
        fetch('/zhiyin/updates/apply', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(force === true ? { name, force: true } : { name }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result || result.ok !== true) throw new Error(result?.error ?? '更新失败')
            return null
          })
          .then(() => load())
          .catch((error) => setState((previous) => ({ ...previous, error: String(error?.message ?? error) })))
          .finally(() => setUpdateBusy(''))
      }, [updateBusy, load])

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
      // 打开技能所在目录：宿主用系统文件管理器打开「这个技能的目录」，不是技能根。
      const revealSkill = (skill) => {
        fetch('/zhiyin/reveal', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: skill.name, path: skill.linkTarget ?? skill.path ?? undefined }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result || result.ok !== true) throw new Error(result?.error ?? '打开失败')
          })
          .catch((error) => setState((previous) => ({ ...previous, error: say('revealFailed', '打开技能目录失败：') + String(error?.message ?? error) })))
      }
      // 删除归档：单条或批量，真删目录，需二次确认。
      const deleteArchived = (keys) => {
        const list = (Array.isArray(keys) ? keys : [keys]).filter(Boolean)
        if (list.length === 0) return
        const ask = list.length === 1
          ? say('archiveDeleteAsk', '彻底删除这份归档？技能目录会被永久移除，无法恢复。')
          : say('archiveDeleteAskMany', '彻底删除选中的 {n} 份归档？技能目录会被永久移除，无法恢复。').replace('{n}', String(list.length))
        if (!window.confirm(ask)) return
        setArchiveError('')
        setBusy(true)
        fetch('/zhiyin/archive/delete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ keys: list }),
        })
          .then((response) => response.json())
          .then((result) => {
            const failed = Array.isArray(result?.failed) ? result.failed : []
            if (failed.length > 0) setArchiveError(failed.map((item) => item.error).join('；'))
            setArchivePicked((previous) => previous.filter((key) => !list.includes(key)))
            loadArchive()
          })
          .catch((error) => setArchiveError(String(error?.message ?? error)))
          .finally(() => setBusy(false))
      }
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

      // 中止安装：杀掉宿主正在跑的 git 克隆，立刻解除安装中状态。
      const abortInstall = () => {
        const jobId = installJobId
        setInstallProgress(say('installAborting', '正在中止…'))
        fetch('/zhiyin/install/abort', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jobId }),
        })
          .catch(() => null)
          .finally(() => {
            setInstallJobId('')
            setBusy(false)
            setInstallProgress('')
            setInstallError(say('installAborted', '已中止安装'))
          })
      }
      const runInstall = (subpath) => {
        const text = installPath.trim()
        if (!text) return
        const jobId = 'job-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
        setInstallJobId(jobId)
        setBusy(true)
        setInstallError('')
        fetch('/zhiyin/install', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            text,
            target: installTarget,
            jobId,
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
        const jobId = 'job-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
        setInstallJobId(jobId)
        setBusy(true)
        setInstallError('')
        setInstallProgress(say('installProgress', '正在安装 {i}/{n}…').replace('{i}', '1').replace('{n}', String(installSelected.length)))
        fetch('/zhiyin/install/batch', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text, subpaths: installSelected, target: installTarget, jobId }),
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
        return fetch('/zhiyin/market?q=' + encodeURIComponent(q || '') + '&limit=' + marketLimit, { headers: { accept: 'application/json' } })
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
          .catch((error) => {
            setMarketError(String(error?.message ?? error))
            throw error
          })
          .finally(() => setMarketLoading(false))
      }, [marketLimit])
      // 加载更多：按 +20 递增直到 MARKET_MAX（skills.sh 单次上限 200 条）。
      const loadMoreMarket = React.useCallback(() => {
        setMarketMore(true)
        const next = Math.min(MARKET_MAX, marketLimit + 20)
        fetch('/zhiyin/market?q=' + encodeURIComponent(marketQuery || '') + '&limit=' + next, { headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then((payload) => {
            if (!payload || payload.ok !== true) throw new Error(payload?.error ?? '请求失败')
            setMarketItems(Array.isArray(payload.skills) ? payload.skills : [])
            setMarketLimit(next)
          })
          .catch((error) => setMarketError(String(error?.message ?? error)))
          .finally(() => setMarketMore(false))
      }, [marketLimit, marketQuery])
      /**
       * 跑一次搜索相位。失败驻留比成功长（读原因 vs 看清结论），
       * 参数取 tuyi proposal 锚点：成功 1.5s、失败 3s。
       */
      const runSearchPhase = React.useCallback((task) => {
        clearSearchTimers()
        setSearchPhase('burst')
        searchTimers.current.push(window.setTimeout(() => setSearchPhase('sync'), 150))
        return Promise.resolve(task()).then(
          () => {
            setSearchPhase('done')
            searchTimers.current.push(window.setTimeout(() => setSearchPhase('idle'), 1500))
          },
          (error) => {
            setSearchPhase('error')
            searchTimers.current.push(window.setTimeout(() => setSearchPhase('idle'), 3000))
            throw error
          },
        )
      }, [clearSearchTimers])
      // 市场点安装：直接在卡片上安装（进行中转圈 + 完成标记），失败才回落到安装弹窗。
      const installFromMarket = (item, reinstall = false) => {
        if (!item?.source || item.installable === false) return
        const key = item.id || item.source + '/' + item.name
        setMarketBusy(key)
        setMarketError('')
        fetch('/zhiyin/install', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: item.source, target: 'agents', skill: item.skillId || item.name, overwrite: reinstall === true }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result?.ok === true) {
              setMarketDone((previous) => ({ ...previous, [key]: true }))
              load()
              return
            }
            if (result?.error === 'multiple') {
              // 同名匹配不到：交给弹窗让人选。
              setInstallPath(item.source)
              setInstallSkill(item.skillId || item.name)
              setInstallTarget('agents')
              setInstallCandidates(Array.isArray(result.candidates) ? result.candidates : [])
              setInstallSelected([])
              setInstallProgress('')
              setInstallError('')
              setInstalling(true)
              return
            }
            setMarketError((result?.error ?? '安装失败') + ' · ' + item.name)
          })
          .catch((error) => setMarketError(String(error?.message ?? error)))
          .finally(() => setMarketBusy(null))
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
      // 最近检查时间：本地时区，和界面其它时间显示保持一致。
      const fmtTime = (value) => {
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return String(value)
        const pad = (n) => String(n).padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
      }
      // 更新徽标只认六态里的两种：有新版可点、本地改过只提示。
      const updateResults = state.updates?.results ?? {}
      const updateCount = Object.keys(updateResults).filter((name) => updateResults[name]?.status === 'update-available').length

      // 一致性修复：只剪掉指向已消失技能的引用，不猜技能去哪了；后端先备份。
      const repairDrift = React.useCallback(() => {
        const drift = data?.consistency?.drift ?? []
        const ask = say('repairAsk', '把指向已消失技能的引用从技能包里移除？当前配置会先备份。')
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
      // ~/.dsh/skills 里大量是指向 ~/.agents/skills 的软链：同名技能只算一次，
      // 所以关掉 .agents 后总数基本不变。这里明确说明，避免「开关一开数字反而变少」的困惑。
      const linkedCount = scoped.filter(
        (skill) => skill.source === 'user-dsh' && (data?.skills ?? []).some((other) => other.name === skill.name && other.source === 'user-agents'),
      ).length
      const srcNote = linkedCount > 0
        ? say('srcLinked', '其中 {n} 个用户目录技能是 .agents 的软链，同名只算一次').replace('{n}', String(linkedCount))
        : ''

      const skills = React.useMemo(() => {
        const needle = query.trim().toLowerCase()
        const filtered = scoped.filter((skill) => {
          if (filter === 'model' && !skill.model) return false
          if (filter === 'user' && !(skill.user && !skill.model)) return false
          if (filter === 'disabled' && skill.enabled !== false) return false
      if (filter === 'internal' && (skill.enabled === false || skill.model || skill.user)) return false
          if (filter === 'bundled' && skill.source !== 'bundled') return false
          if (filter === 'favorite' && !(skill.favorite === true)) return false
          if (needle === '') return true
          return (
            skill.name.toLowerCase().includes(needle) ||
            (skill.description ?? '').toLowerCase().includes(needle)
          )
        })
        const chars = (skill) => Math.min((skill.description ?? '').length, 500)
        const favorites = data?.favorites ?? {}
        const isFav = (skill) => skill.favorite === true || Object.prototype.hasOwnProperty.call(favorites, skill.name)
        const sorted = filtered.slice().sort((a, b) => {
          // 收藏永远在最前，且不受排序字段影响；收藏之间按收藏时间倒序。
          const fa = isFav(a), fb = isFav(b)
          if (fa !== fb) return fa ? -1 : 1
          if (fa && fb) return (favorites[b.name] ?? 0) - (favorites[a.name] ?? 0) || a.name.localeCompare(b.name)
          if (sortField === 'source') return String(a.source).localeCompare(String(b.source)) || a.name.localeCompare(b.name)
          if (sortField === 'chars') return chars(b) - chars(a) || a.name.localeCompare(b.name)
          if (sortField === 'enabled') return Number(b.enabled !== false) - Number(a.enabled !== false) || a.name.localeCompare(b.name)
          return a.name.localeCompare(b.name)
        })
        return sorted
      }, [scoped, query, filter, sortField, data])

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
        if (reason === 'combo') return say('reasonCombo', '未纳入任何技能包')
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


      return h(
        'div',
        { style: wide ? css.pageWide : css.page },
        h(
          'div',
          { style: css.head },
          lang === 'en' ? h('h2', { style: css.title }, say('title', 'ZhiYin')) : h(Wordmark, { height: 26 }),
          h('span', { style: css.subtitle }, say('subtitle', '安装、启停、编组技能，随时看清模型此刻能用什么')),
          // 仓库入口跟着副标题走：一句「Star 一下~」比一个孤零零的图标更能促成人去点。
          h('button', {
            type: 'button',
            style: css.starLink,
            title: say('repoHint', '在 GitHub 上打开仓库'),
            'aria-label': say('repoHint', '在 GitHub 上打开仓库'),
            onClick: () => window.open(REPO_URL, '_blank', 'noreferrer'),
          },
            h(Icon, { name: 'github', size: 14 }),
            h('span', null, say('starCta', 'Star 一下~')),
          ),
          h(
            'div',
            { style: css.headActions },
            h('button', {
              type: 'button',
              style: { ...css.iconBtn, width: 'auto', padding: '0 9px', gap: 4 },
              title: say('langSwitchTitle', '切换界面语言'),
              'aria-label': say('langSwitchTitle', '切换界面语言'),
              onClick: () => setLang(lang === 'zh' ? 'en' : 'zh'),
            },
              h(Icon, { name: 'globe', size: 15 }),
              h('span', { style: css.langTag }, say('langSwitch', 'English')),
            ),
            h('button', {
              type: 'button',
              style: css.iconBtn,
              title: say('guideOpen', '使用指南'),
              'aria-label': say('guideOpen', '使用指南'),
              onClick: openGuide,
            }, h(Icon, { name: 'book', size: 15 })),
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
          ),
        ),

        h('p', { style: { ...css.hint, marginTop: 12 } }, say('next', '技能包开关决定包内技能是否对 agent 可见；单个技能也可以随时停用。')),

        // 元信息条：版本 · 观测时间 ｜ 右侧主按钮（全部停用/全部启用）
        data
          ? h(
              'div',
              { style: css.metaBar },
              h('span', null, `${say('versionLabel', '织音')} v${data.version ?? '0.1.0'}`),
              h('span', { style: css.metaDot }, '·'),
              h('span', null, `${say('observedAt', '更新于')} ${formatTime(data.at)}`),
              h(
                'span',
                {
                  style: { ...css.pill(data.consistency?.status === 'synced'), cursor: 'default' },
                  title:
                    data.consistency?.status === 'degraded'
                      ? say('consistencyHintDegraded', '上次读取不完整，沿用上一次的结果')
                      : data.consistency?.status === 'drifted'
                        ? `${say('consistencyHintDrifted', '有技能被外部改动或来源切换')}：${(data.consistency?.drift ?? []).slice(0, 4).join('、')}`
                        : say('consistencyHintSynced', '配置与已装技能一致'),
                },
                data.consistency?.status === 'degraded'
                  ? say('consistencyDegraded', '读取不完整')
                  : data.consistency?.status === 'drifted'
                    ? say('consistencyDrifted', '有漂移')
                    : say('consistencySynced', '一致'),
              ),
              data.consistency?.status === 'drifted' && data.complete !== false
                ? h(
                    'button',
                    {
                      type: 'button',
                      style: { ...css.btn, padding: '3px 10px', fontSize: fs.meta },
                      disabled: busy,
                      title: say('repairHint', '清理指向已消失技能的引用'),
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
          ? h('div', { style: css.errorBox }, h(Icon, { name: 'info', size: 14 }), h('span', null, `${say('failed', '读取失败：')}${state.error}`))
          : null,

        state.exportError
          ? h('div', { style: css.errorBox }, h(Icon, { name: 'info', size: 14 }), h('span', null, `${say('exportConfigFailed', '导出失败：')}${state.exportError}`))
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
              // 核心答案：模型此刻能用多少，放在最前、不再被设置挤到下面。
              h('div', { style: { ...css.grid, marginTop: 16 } }, statCards(data, counts, say, filter, setFilter)),
              // 手风琴：默认全收起，只占一行；放在技能卡片上方，随时能看到。
              h(
                'div',
                { style: css.infoWrap },
                h(
                  'button',
                  {
                    type: 'button',
                    style: { ...css.infoHead, ...(openInfo === 'all' ? css.infoHeadOn : {}) },
                    onClick: () => setOpenInfo((open) => (open === 'all' ? '' : 'all')),
                    'aria-expanded': openInfo === 'all',
                  },
                  h(Icon, { name: 'chevronDown', size: 12 }),
                  h('span', null, say('infoAll', '状态与更新设置')),
                  // 摘要写在折叠行右侧：不展开也能看到关键数字，右侧不再空一片。
                  h('span', { style: { marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 12, ...css.hint } },
                    h('span', null, say('budget', '目录字符数') + ' ' + String(data.catalogChars)),
                    state.updates?.checkedAt ? h('span', null, say('lastCheckedShort', '检查于 ') + fmtTime(state.updates.checkedAt)) : null,
                    updateCount > 0
                      ? h('span', { style: css.infoAlert }, say('updatesBadge', '有 {n} 个更新').replace('{n}', String(updateCount)))
                      : null,
                  ),
                ),
                openInfo === 'all'
                  ? h(
                      'div',
                      { style: css.infoBody },
                      h('div', { style: css.infoSection },
                        h('div', { style: css.infoSectionLabel }, say('infoStatus', '状态详情')),
                        h('div', { style: css.groupDesc }, `${say('statBySource', '来源')}：${srcLine}`),
                        srcNote ? h('div', { style: { ...css.groupDesc, opacity: 0.7 } }, srcNote) : null,
                      ),
                      h('div', { style: css.infoSection },
                        h('div', { style: css.infoSectionLabel }, say('infoCost', '目录成本')),
                        h('div', {
                          style: { ...css.groupDesc, cursor: 'pointer', textDecoration: 'underline', width: 'fit-content' },
                          onClick: () => setCostInfoOpen(true),
                          title: say('costInfoTip', '点开看这个数字的含义、建议与出处'),
                        }, say('costInfoOpen', '查看计算方式与建议')),
                        h('div', { style: css.groupDesc }, data.complete ? say('complete', '已完整读取') : say('incomplete', '读取不完整')),
                      ),
                      h('div', { style: css.infoSection },
                        h('div', { style: css.infoSectionLabel }, say('infoUpdate', '更新设置')),
                        h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' } },
                          h('div', { style: css.groupMain },
                            h('div', { style: css.groupTitle }, say('autoCheck', '自动检查技能更新')),
                            h('div', { style: css.groupDesc }, say('autoCheckHint', '开启后按所选周期在后台检查，不会卡住界面')),
                          ),
                          h(Toggle, {
                            checked: (state.updates?.settings?.enabled ?? true) !== false,
                            disabled: busy,
                            title: say('autoCheck', '自动检查技能更新'),
                            onChange: () => write('/zhiyin/settings', { updateCheck: { enabled: (state.updates?.settings?.enabled ?? true) === false } }),
                          }),
                        ),
                        h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' } },
                          h('span', { style: css.groupTitle }, say('checkInterval', '检查周期')),
                          h('div', { style: css.menuWrap },
                            h('button', {
                              type: 'button',
                              style: css.intervalBtn,
                              disabled: busy || (state.updates?.settings?.enabled ?? true) === false,
                              onClick: () => setIntervalOpen((open) => !open),
                              'aria-haspopup': 'listbox',
                              'aria-expanded': intervalOpen,
                            }, h('span', null, (state.updates?.intervals ?? []).find((item) => item.ms === (state.updates?.settings?.intervalMs ?? 86400000))?.label ?? say('everyDay', '每天')), h(Icon, { name: 'chevronDown', size: 12 })),
                            intervalOpen
                              ? h('div', { style: css.menu, role: 'listbox' }, (state.updates?.intervals ?? []).map((item) => h('button', {
                                  type: 'button',
                                  key: item.ms,
                                  role: 'option',
                                  'aria-selected': item.ms === (state.updates?.settings?.intervalMs ?? 86400000),
                                  style: { ...css.menuItem, ...(item.ms === (state.updates?.settings?.intervalMs ?? 86400000) ? css.menuItemOn : {}) },
                                  onClick: () => {
                                    setIntervalOpen(false)
                                    write('/zhiyin/settings', { updateCheck: { intervalMs: item.ms } })
                                  },
                                }, item.label)))
                              : null,
                          ),
                          h('span', { style: { ...css.hint, flex: '1 1 auto', textAlign: 'right' } },
                            state.updates?.checkedAt
                              ? say('lastChecked', '最近完整检查：') + fmtTime(state.updates.checkedAt)
                              : say('neverChecked', '还没检查过')),
                          h('button', {
                            type: 'button',
                            style: { ...css.btn, flex: '0 0 auto', whiteSpace: 'nowrap' },
                            disabled: updateBusy === 'check' || state.updates?.running === true,
                            onClick: checkUpdates,
                          }, (updateBusy === 'check' || state.updates?.running === true) ? h(Spinner, { size: 14 }) : say('checkNow', '立即检查')),
                        ),
                      ),
                      h('div', { style: css.infoSection },
                        h('div', { style: css.infoSectionLabel }, say('infoSource', '来源与版本')),
                        h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' } },
                          h('div', { style: css.groupMain },
                            h('div', { style: css.groupTitle }, say('agentsRoot', '加载 ~/.agents/skills')),
                            h('div', { style: css.groupDesc }, say('agentsRootHintShort', '开启后读取 ~/.agents/skills 与 ~/.dsh/skills 的合集')),
                          ),
                          h(Toggle, {
                            checked: data.agentsRoot !== false,
                            disabled: busy,
                            title: say('agentsRootHint', '开启后，智能体将自动加载 .agents/skills 路径下的自定义技能'),
                            onChange: () => write('/zhiyin/settings', { agentsRoot: data.agentsRoot === false }),
                          }),
                        ),
                        h('div', { style: css.groupDesc }, `${say('versionLabel', '织音')} v${data.version ?? '0.1.0'} · ${say('observedAt', '更新于')} ${formatTime(data.at)}`),
                      ),
                    )
                  : null,
              ),
            )
          : null,

        // 标签页（技能 / 技能包）+ 右侧视图切换与刷新
        data
          ? h(
              'div',
              { style: { ...css.row, marginTop: 24 } },
              h(
                'div',
                { style: css.seg },
                h('button', { type: 'button', style: tab === 'list' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('list') }, `${say('tabList', '技能')} ${counts.total}`),
                h('button', { type: 'button', style: tab === 'packs' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('packs') }, `${say('tabPacks', '技能包')} ${(data.packs ?? []).length}`),
                h('button', { type: 'button', style: tab === 'market' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('market') }, say('tabMarket', '技能市场')),
                h('button', { type: 'button', style: tab === 'archive' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setTab('archive') }, `${say('tabArchive', '归档')} ${archiveEntries.length}`),
    
              ),
              // 检查更新 / 卡片 / 列表 收进同一组，顺序固定；检查完成后 load() 本身就是刷新，不再单独留刷新图标。
              tab === 'market' || tab === 'archive'
                ? null
                : h(
                    'div',
                    { style: { display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 'auto' } },
                    h('button', {
                      type: 'button',
                      style: { ...css.btn, whiteSpace: 'nowrap' },
                      title: say('checkUpdatesHint', '按上游仓库检查技能是否有新版本；检查完成后会刷新列表'),
                      disabled: updateBusy === 'check',
                      onClick: checkUpdates,
                    }, updateBusy === 'check'
                      ? h(Spinner, { size: 14 })
                      : updateCount > 0
                        ? say('checkUpdatesFound', '有 {n} 个更新').replace('{n}', String(updateCount))
                        : say('checkUpdates', '检查更新')),
                    tab === 'list'
                      ? h(
                          'div',
                          { style: css.seg },
                          h('button', { type: 'button', style: view === 'cards' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setView('cards') }, say('viewCards', '卡片')),
                          h('button', { type: 'button', style: view === 'list' ? { ...css.segBtn, ...css.segBtnOn } : css.segBtn, onClick: () => setView('list') }, say('viewList', '列表')),
                        )
                      : null,
                  ),
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
                ? h('div', { style: css.emptyBox },
                    h('span', { style: css.emptyTitle }, say('packEmptyTitle', '还没有技能包')),
                    h('span', null, say('packEmptyHint', '点右上角新建，再把技能勾进来')))
                : null,
              visiblePacks.length === 0 && (data.packs ?? []).length > 0
                ? h('div', { style: css.emptyBox },
                    h('span', { style: css.emptyTitle }, say('packNoMatch', '没有匹配技能包')),
                    h('span', null, say('emptyHint', '换个关键词，或清空搜索框看看全部技能')))
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
                  h('span', { style: { ...packStatusStyle(status), flex: '0 0 auto', whiteSpace: 'nowrap' } }, packStatusLabel(status)),
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
                  onKeyDown: (event) => {
                    // 回车与点按钮走同一条相位链路，否则键盘提交没有 burst/sync/done/error。
                    if (event.key !== 'Enter') return
                    event.preventDefault()
                    runSearchPhase(() => loadMarket(marketQuery)).catch(() => {})
                  },
                }),
                h(
                  'button',
                  {
                    type: 'button',
                    style: { ...css.btn, ...searchBtnStyle(searchPhase) },
                    disabled: searchPhase === 'sync' || searchPhase === 'burst',
                    'aria-busy': searchPhase === 'sync' ? 'true' : 'false',
                    onClick: () => { runSearchPhase(() => loadMarket(marketQuery)).catch(() => {}) },
                  },
                  searchPhase === 'sync'
                    ? h(Spinner, { size: 14 })
                    : searchPhase === 'done'
                      ? h(Icon, { name: 'check', size: 14 })
                      : searchPhase === 'error'
                        ? h(Icon, { name: 'alert', size: 14 })
                        : h(Icon, { name: 'search', size: 14 }),
                  h('span', null,
                    searchPhase === 'done'
                      ? say('searchDone', '已更新')
                      : searchPhase === 'error'
                        ? say('searchFailed', '失败')
                        : say('marketSearch', '搜索')),
                ),
                // 刷新：marketLoading 时图标持续旋转，让「点到了」这件事看得见。
                h(
                  'button',
                  {
                    type: 'button',
                    style: css.iconBtn,
                    title: say('refresh', '刷新'),
                    'aria-label': say('refresh', '刷新'),
                    'aria-busy': marketRefreshing ? 'true' : 'false',
                    disabled: marketRefreshing,
                    onClick: () => {
                      setMarketRefreshing(true)
                      loadMarket(marketQuery)
                        .catch(() => {})
                        .finally(() => setMarketRefreshing(false))
                    },
                  },
                  h(Icon, { name: 'refresh', size: 15, spin: marketRefreshing }),
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
                ? h('div', { style: css.errorBox }, h(Icon, { name: 'info', size: 14 }), h('span', null, marketError))
                : null,
              marketLoading && marketItems.length === 0
                ? h(
                    'div',
                    { style: css.marketGrid },
                    Array.from({ length: skeletonCount }).map((_, index) =>
                      h(
                        'div',
                        { key: 'sk-' + index, style: css.skeletonCard },
                        h('div', { style: css.skeletonBar('70%', 16) }),
                        h('div', { style: css.skeletonBar('45%') }),
                        h('div', { style: css.skeletonBar('100%') }),
                        h('div', { style: css.skeletonBar('92%') }),
                        h('div', { style: css.skeletonBar('60%') }),
                        h('div', { style: { ...css.skeletonBar('38%', 28), marginTop: 14 } }),
                      ),
                    ),
                  )
                : null,
              !marketLoading && marketItems.length === 0 && !marketError
                ? h('div', { style: css.emptyBox },
                    h('span', { style: css.emptyTitle }, say('marketEmpty', '没有找到技能')),
                    h('span', null, say('marketEmptyHint', '换个关键词试试；至少 2 个字符，留空看热门')))
                : null,
              h(
                'div',
                { style: css.marketGrid },
                marketItems.map((item) => {
                  const key = item.id || item.source + '/' + item.name
                  const installed = (data.skills ?? []).some((skill) => skill.name === item.name)
                  const desc = marketDesc[item.id]
                  const descKnown = Object.prototype.hasOwnProperty.call(marketDesc, item.id)
                  const hovered = marketHover === key
                  const running = marketBusy === key
                  const done = marketDone[key] === true
                  const busyElsewhere = marketBusy != null && !running
                  return h(
                    'div',
                    {
                      key,
                      style: css.marketCard(hovered),
                      onMouseEnter: () => setMarketHover(key),
                      onMouseLeave: () => setMarketHover((previous) => (previous === key ? null : previous)),
                    },
                    h(
                      'div',
                      { style: css.marketCardTop },
                      h('a', {
                        href: item.url || ('https://www.skills.sh/' + item.source + '/' + item.skillId),
                        target: '_blank',
                        rel: 'noreferrer',
                        title: say('marketOpen', '在 skills.sh 打开技能页'),
                        style: { ...css.marketCardTitle, color: 'inherit', textDecoration: 'none', cursor: 'pointer', flex: '1 1 auto' },
                      }, item.name),
                      // 右上角只保留「托管」这类需要警示的状态；「已安装」放底部操作区，避免同一信息出现两次。
                      item.installable === false && !installed
                        ? h('span', { style: { ...css.badge(true), flex: '0 0 auto', opacity: 0.75 }, title: say('marketHostedHint', 'skills.sh 托管技能，没有公开 GitHub 仓库，无法直接安装') }, say('marketHostedBadge', '托管'))
                        : null,
                    ),
                    h(
                      'div',
                      { style: css.marketCardMeta },
                      h('span', { title: say('marketSourceTitle', '来源仓库') }, String(item.source || '')),
                      h('span', { style: { opacity: 0.5 } }, '·'),
                      h('span', { title: say('marketInstallsTitle', 'skills.sh 记录的安装次数') },
                        `${formatInstalls(item.installs)} ${say('marketInstalls', '次安装')}`),
                    ),
                    desc
                      ? h('div', { style: css.marketCardDesc }, desc)
                      : h('div', { style: { ...css.marketCardDesc, opacity: 0.55 } }, descKnown ? say('marketNoDesc', '暂无描述') : '…'),
                    item.installCommand
                      ? h('code', {
                          style: css.marketCardCmd,
                          title: say('marketCmdHint', '对应的 skills CLI 命令') + '：' + item.installCommand,
                        }, item.installCommand)
                      : null,
                    h(
                      'div',
                      { style: css.marketCardFoot },
                      item.installable === false
                        ? h('span', { style: { ...css.hint, flex: '0 0 auto' } }, say('marketHostedBadge', '托管'))
                        : null,
                      h('span', { style: { flex: '1 1 auto' } }),
                      done || installed
                        ? h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, flex: '0 0 auto', whiteSpace: 'nowrap' } },
                            h('span', { style: { ...css.metaText, color: '#4a9d6a', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }, title: say('marketInstalled', '已安装') },
                              h(Icon, { name: 'check', size: 13 }), say('marketInstalled', '已安装')),
                            h('button', {
                              type: 'button',
                              style: css.iconBtn,
                              title: say('marketReinstallHint', '重新安装（覆盖到所选目录，用于更新）'),
                              'aria-label': say('marketReinstall', '重新安装'),
                              disabled: busyElsewhere,
                              onClick: () => installFromMarket(item, true),
                            }, h(Icon, { name: 'refresh', size: 13 })),
                          )
                        : item.installable === false
                          ? h('button', {
                              type: 'button',
                              style: css.btn,
                              title: say('marketHostedHint2', 'skills.sh 托管技能，没有公开仓库；点此在 skills.sh 打开安装说明'),
                              onClick: () => window.open(item.url, '_blank', 'noreferrer'),
                            }, say('marketOpenShort', '查看'))
                          : h('button', {
                              type: 'button',
                              style: running ? { ...css.primaryBtn, opacity: 0.8, cursor: 'progress' } : css.primaryBtn,
                              title: running ? say('marketInstalling', '正在安装…') : busyElsewhere ? say('marketBusyOther', '另一个技能正在安装，请稍候') : say('install', '安装技能'),
                              'aria-busy': running ? 'true' : 'false',
                              disabled: running || busyElsewhere,
                              onClick: () => installFromMarket(item),
                            },
                            running ? h(Spinner, { size: 14 }) : h(Icon, { name: 'packagePlus', size: 14 }),
                            running ? say('marketInstalling', '安装中…') : say('installShort', '安装')),
                    ),
                  )
                }),
              ),
              marketItems.length > 0 && marketItems.length < MARKET_MAX
                ? h(
                    'div',
                    { style: css.loadMoreWrap },
                    h('button', {
                      type: 'button',
                      style: {
                        ...css.btn,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        ...(marketMore ? { opacity: 0.7, cursor: 'progress' } : null),
                      },
                      disabled: marketMore,
                      onClick: loadMoreMarket,
                    },
                      marketMore
                        ? h(Spinner, { size: 14 })
                        : h(Icon, { name: 'chevronDown', size: 14 }),
                      h('span', null,
                        marketMore
                          ? say('marketMoreLoading', '加载中…')
                          : say('marketMore', '加载更多') + '（' + marketItems.length + ' / ' + MARKET_MAX + '）')),
                  )
                : null,
            )
          : null,

        // 归档：被「卸载」移入 archive 的技能，可查看或恢复到指定目录
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
                archivePicked.length > 0
                  ? h(
                      'button',
                      {
                        type: 'button',
                        style: css.btn,
                        disabled: busy || archiveLoading,
                        onClick: () => deleteArchived(archivePicked),
                      },
                      say('archiveDeletePicked', '删除选中') + ` (${archivePicked.length})`,
                    )
                  : null,
                h(
                  'button',
                  {
                    type: 'button',
                    style: css.iconBtn,
                    title: say('refresh', '刷新'),
                    'aria-label': say('refresh', '刷新'),
                    disabled: archiveLoading,
                    onClick: loadArchive,
                  },
                  archiveLoading ? h(Spinner, { size: 15 }) : h(Icon, { name: 'refresh', size: 14 }),
                ),
              ),
              archiveError
                ? h('div', { style: css.errorBox }, h(Icon, { name: 'info', size: 14 }), h('span', null, say('archiveError', '归档操作失败：') + archiveError))
                : null,
              !archiveLoading && archiveEntries.length === 0
                ? h('div', { style: css.emptyBox },
                    h('span', { style: css.emptyTitle }, say('archiveEmptyTitle', '还没有归档的技能')),
                    h('span', null, say('archiveEmpty', '在技能列表点「卸载」会把技能移到这里，可随时恢复。')))
                : h(
                    'div',
                    { style: { ...css.list, marginTop: 12 } },
                    archiveEntries.map((entry) =>
                      h(
                        'div',
                        { key: entry.key, style: css.item },
                        h('input', {
                          type: 'checkbox',
                          checked: archivePicked.includes(entry.key),
                          disabled: busy,
                          title: say('archivePick', '选中以便批量删除'),
                          'aria-label': say('archivePick', '选中以便批量删除'),
                          style: css.pick,
                          onChange: () =>
                            setArchivePicked((previous) =>
                              previous.includes(entry.key)
                                ? previous.filter((key) => key !== entry.key)
                                : [...previous, entry.key],
                            ),
                        }),
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
                        h(
                          'button',
                          {
                            type: 'button',
                            style: css.iconBtn,
                            title: say('archiveDeleteHint', '彻底删除这份归档（不可恢复）'),
                            'aria-label': say('archiveDelete', '删除归档'),
                            disabled: busy || archiveLoading,
                            onClick: () => deleteArchived(entry.key),
                          },
                          h(Icon, { name: 'trash', size: 14 }),
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
                ? h('div', { style: css.emptyBox },
                    h('span', { style: css.emptyTitle }, say('empty', '没有匹配的技能')),
                    h('span', null, say('emptyHint', '换个关键词，或清空搜索框看看全部技能')))
                : skills.map((skill) => {
                    const on = skill.enabled !== false
                    const hovered = skillHover === skill.name
                    const updateState = updateResults[skill.name]?.status
                    const updatable = updateState === 'update-available'
                    const updateBlocked = updateState === 'locally-modified' || updateState === 'both-changed'
                    return h(
                      'div',
                      {
                        key: skill.name,
                        style: { ...css.skillCard(hovered), ...(on ? {} : css.itemOff) },
                        // 备注只在悬停卡片时以原生 tooltip 出现；没有备注就什么都不加。
                        ...(skill.note ? { title: say('noteViewTitle', '技能备注') + '：' + skill.note } : {}),
                        onMouseEnter: () => setSkillHover(skill.name),
                        onMouseLeave: () => setSkillHover((previous) => (previous === skill.name ? null : previous)),
                      },
                      h(
                        'div',
                        { style: css.cardHead },
                        h(FavoriteButton, { skill, busy, say, onToggle: toggleFavorite }),
                        h('span', { style: css.cardName }, skill.name),
                        h('span', { style: { ...css.badge(on), flex: '0 0 auto' } }, sourceShort(skill)),
                        skill.linkTarget
                          ? h('span', {
                              style: { ...css.metaText, flex: '0 0 auto', cursor: 'pointer' },
                              title: `${say('linkBadgeTitle', '符号链接，实体在')}${skill.linkTarget}`,
                              onClick: () => revealSkill(skill),
                            }, say('linkBadge', '软链'))
                          : null,
                        // 更新徽标：只放一个词，不加图标；可更新的才可点。
                        updatable || updateBlocked
                          ? h('span', {
                              style: {
                                ...css.metaText,
                                flex: '0 0 auto',
                                whiteSpace: 'nowrap',
                                display: 'inline-flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                ...(updatable ? { color: 'var(--zhiyin-accent, #e0743c)', fontWeight: 600 } : { opacity: 0.7 }),
                              },
                              title: updatable
                                ? say('updateApplyHint', '更新到上游当前版本；本地没改过才允许')
                                : say('updateBlockedHint', '本地内容被改过：点一下可先备份到归档再强制更新'),
                              onClick: updatable
                                ? () => applyUpdate(skill.name)
                                : () => {
                                    if (window.confirm(say('forceUpdateAsk', '本地内容被改过。先把当前版本整份备份到归档，再用上游版本覆盖？'))) {
                                      applyUpdate(skill.name, true)
                                    }
                                  },
                            }, updateBusy === skill.name
                              ? h(Spinner, { size: 12 })
                              : updatable ? say('updateBadge', '有更新') : say('updateLocalOnly', '本地已改'))
                          : null,
                        skill.readOnly
                          ? h('span', { style: { ...css.metaText, flex: '0 0 auto' }, title: readOnlyHint(skill) }, say('readOnlyBadge', '只读'))
                          : null,
                      ),
                      // 信息带：与市场卡片同构（来源已在头部徽标，这里只放成本信息）。
                      h(
                        'div',
                        { style: css.marketCardMeta },
                        h('span', { title: say('descCharsTitle', 'SKILL.md 描述字符数（计入目录成本）') },
                          String(Math.min((skill.description ?? '').length, 500)) + ' ' + say('charsUnit', '字符')),
                        skill.refCount > 1
                          ? h('span', { style: { opacity: 0.5 } }, '·')
                          : null,
                        skill.refCount > 1
                          ? h('span', { title: `${say('refCountTitle', '引用它的技能包')}：${(skill.refs ?? []).join('、')}` },
                              say('refCountShort', '引用') + ' ' + skill.refCount)
                          : null,
                      ),
                      h('div', { style: css.cardDesc }, skill.description ?? ''),
                      h(
                        'div',
                        { style: css.marketCardFoot },
                        h('span', { style: css.dot(on) }),
                        h('span', { style: { ...css.hint, flex: '0 0 auto' } },
                          on ? say('enabled', '已启用') : (reasonLabel(skill.hiddenReason) || say('disabledBadge', '已停用'))),
                        h('span', { style: { flex: '1 1 auto' } }),
                        h('button', {
                          type: 'button',
                          title: say('revealHint', '在文件管理器里打开这个技能的目录'),
                          'aria-label': say('reveal', '打开目录'),
                          style: css.iconBtn,
                          disabled: busy,
                          onClick: () => revealSkill(skill),
                        }, h(Icon, { name: 'folder', size: 14 })),
                        h('button', {
                          type: 'button',
                          title: say('noteEdit', '编辑备注'),
                          'aria-label': say('noteEdit', '编辑备注'),
                          style: css.iconBtn,
                          disabled: busy,
                          onClick: () => openNote(skill),
                        }, h(Icon, { name: 'edit', size: 14 })),

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
              h('span', { style: { fontSize: fs.hint, opacity: 0.85 } }, say('batchSelected', '已选') + ' ' + selectedNames.length),
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
                ? h('div', { style: css.emptyBox },
                    h('span', { style: css.emptyTitle }, say('empty', '没有匹配的技能')),
                    h('span', null, say('emptyHint', '换个关键词，或清空搜索框看看全部技能')))
                : skills.map((skill) =>
                    h(
                      'div',
                      {
                        key: skill.name,
                        style: skill.enabled === false ? { ...css.item, ...css.itemOff } : css.item,
                        ...(skill.note ? { title: say('noteViewTitle', '技能备注') + '：' + skill.note } : {}),
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
                          h(FavoriteButton, { skill, busy, say, onToggle: toggleFavorite }),
                          h('span', { style: css.name }, skill.name),
                        skill.readOnly
                          ? h('span', { style: { ...css.metaText, opacity: op.meta }, title: readOnlyHint(skill) }, say('readOnlyBadge', '只读'))
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
                                style: { ...css.metaText, opacity: 0.7, cursor: 'pointer' },
                                title: `${say('linkBadgeTitle', '符号链接，实体在')}${skill.linkTarget}`,
                                onClick: () => revealSkill(skill),
                              },
                              say('linkBadge', '软链'),
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
                  h('div', { style: { ...css.hint, marginTop: 8 } }, say('packSelectedCount', '已选 {n} / {m}').replace('{n}', String(draftMembers.length)).replace('{m}', String(poolSize))),
                  h(
                    'div',
                    { style: css.modalBody },
                    rows.map((row) =>
                      h(
                        'label',
                        { key: row.name, style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: fs.hint, padding: '3px 0', opacity: row.ghost ? 0.72 : 1 } },
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

        guideOpen
          ? h(
              'div',
              { style: css.overlay, onClick: () => setGuideOpen(false) },
              h(
                'div',
                { style: { ...css.modal, ...css.modalGuide }, onClick: (event) => event.stopPropagation() },
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('guideOpen', '使用指南')),
                  h('button', {
                    type: 'button',
                    style: css.iconBtn,
                    title: say('close', '关闭'),
                    'aria-label': say('close', '关闭'),
                    onClick: () => setGuideOpen(false),
                  }, h(Icon, { name: 'close', size: 13 })),
                ),
                h(
                  'div',
                  { style: css.modalBody },
                  guideError
                    ? h('div', { style: css.errorBox }, say('guideFailed', '读取使用指南失败：') + guideError)
                    : !guideData
                      ? h('div', { style: css.hint }, say('guideLoading', '正在读取使用指南…'))
                      : h('div', { style: css.guideBody },
                          renderMarkdown(lang === 'en' ? guideData.en : guideData.zh)),
                ),
              ),
            )
          : null,

        costInfoOpen
          ? h(
              'div',
              { style: css.overlay, onClick: () => setCostInfoOpen(false) },
              h(
                'div',
                { style: { ...css.modal, ...css.modalWide }, onClick: (event) => event.stopPropagation() },
                h(
                  'div',
                  { style: css.modalHead },
                  h('span', { style: css.modalTitle }, say('costInfoTitle', '目录字符数 · 计算方式与建议上限')),
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
                  h('div', { style: css.costHead }, say('costWhatHead', '计算方式')),
                  h('div', { style: css.costBullet }, say('costWhat1', '每个可见技能取 min(描述长度, 500) 字符，全部相加后再加 200 字符框架开销。')),
                  h('div', { style: css.costBullet }, say('costWhat2', '只计描述，不含技能名与 SKILL.md 正文，因此是本目录的成本下限。')),
                  h('div', { style: css.costBullet }, say('costWhat3', '停用、未加入启用包、被上层开关挡住的技能不计入。')),
                  h('div', { style: css.costHead }, say('costWhyHead', '成本构成')),
                  h('div', { style: css.costBullet }, say('costWhy1', '描述是模型判断「何时调用该技能」的路由信号，随每次请求注入。')),
                  h('div', { style: css.costBullet }, say('costWhy2', '目录变化会作为新条目追加进会话历史，一次请求承载多份目录。')),
                  h('div', { style: css.costBullet }, say('costWhy3', '总量超过模型承受范围时，实现会按最近最少使用丢弃描述，被丢弃的技能不再参与路由。')),
                  h('div', { style: css.costHead }, say('costLimitHead', '建议上限')),
                  h('div', { style: css.costBullet }, say('costLimit1', '目录总量：上下文窗口的 1%。200K 窗口折算为 2,000 token。')),
                  h('div', { style: css.costBullet }, say('costLimit2', '按 token 折算字符：中文 1 字符 ≈ 1 token → 建议 ≤ 2,000 字符；英文 4 字符 ≈ 1 token → 建议 ≤ 8,000 字符。中英混排按实际比例折算。')),
                  h('div', { style: css.costBullet }, say('costLimit3', '单条描述：目标 400–1,000 字符，硬上限 1,024 字符（API 拒绝超限）。')),
                  h('div', { style: css.costHead }, say('costDoHead', '优化方式')),
                  h('div', { style: css.costBullet }, say('costDo1', '描述只保留「做什么 + 何时用」，触发词放在开头，删去背景与套话。')),
                  h('div', { style: css.costBullet }, say('costDo2', '长期不用的技能移出启用包或停用，成本直接归零。')),
                  h('div', { style: css.costBullet }, say('costDo3', '同领域技能合并，减少重复的路由信号。')),
                  h('div', { style: css.costHead }, say('costSourceHead', '依据')),
                  h('div', { style: css.costBullet },
                    h('a', { href: 'https://platform.claude.com/docs/zh-CN/build-with-claude/skills-guide', target: '_blank', rel: 'noreferrer', style: css.costLink }, say('costSrc1', 'Anthropic 平台文档 · Agent Skills 请求限制')),
                    say('costSrc1Note', '：description 上限 1,024 字符，name 上限 64 字符。'),
                  ),
                  h('div', { style: css.costBullet },
                    h('a', { href: 'https://github.com/josiahsiegel/claude-plugin-marketplace/blob/main/plugins/plugin-master/skills/triggering-reliability/references/severity-and-limits.md', target: '_blank', rel: 'noreferrer', style: css.costLink }, say('costSrc2', 'Claude Code 描述长度分层（2026）')),
                    say('costSrc2Note', '：路由清单合并截断 1,536 字符；目录总量预算为上下文窗口的 1%，超限按 LRU 丢弃描述。'),
                  ),
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
                h('p', { style: css.hint }, say('installHint', '粘贴 GitHub 仓库、skills.sh 技能页链接、技能目录、npx skills add 命令、SKILL.md 直链，或本地文件夹路径；只新建目录，不改已有技能。无论仓库里有多少技能，都按 SKILL.md 的 name 平级装到所选目录，不会多套一层仓库目录')),
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
                  { style: { display: 'flex', gap: 14, fontSize: fs.hint, alignItems: 'center', flexWrap: 'wrap' } },
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
                      { style: { marginTop: 12 } },
                      h('div', { style: css.hint }, say('installMultiple', '这个仓库里有多个技能，勾选后一起安装（都平级装到所选目录）：')),
                      h('div', { style: { ...css.hint, marginTop: 2 } }, say('installSelectedCount', '已选 {n} / {m}').replace('{n}', String(installSelected.length)).replace('{m}', String(installCandidates.length))),
                      h(
                        'div',
                        { style: { ...css.previewList, marginTop: 8 } },
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
                  ? h('div', { style: css.errorBox }, h(Icon, { name: 'info', size: 14 }), h('span', null, say('installFailed', '安装失败：') + installError))
                  : null,
                h(
                  'div',
                  { style: css.modalFoot },
                  // 安装进行中：把主按钮换成「中止」，避免用户以为卡住而反复点击。
                  busy && installJobId
                    ? h(
                        'div',
                        { style: { display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' } },
                        h('span', { style: { ...css.hint, display: 'inline-flex', alignItems: 'center', gap: 6 } },
                          h(Spinner, { size: 13 }),
                          say('installing', '安装中…')),
                        h('button', {
                          type: 'button',
                          style: css.btn,
                          title: say('installAbortHint', '中止这次安装（正在克隆的仓库会被终止）'),
                          onClick: abortInstall,
                        }, say('installAbort', '中止')),
                      )
                    : installCandidates.length > 0
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
                            h(Icon, { name: 'packagePlus', size: 14 }),
                            ` ${say('installSelected', '安装选中')} (${installSelected.length})`,
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
                          h(Icon, { name: 'packagePlus', size: 14 }),
                          ` ${say('install', '安装技能')}`,
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
                      ? h('div', { style: css.emptyBox }, h('span', { style: css.emptyTitle }, say('backupsEmpty', '还没有备份')), h('span', null, say('backupsEmptyHint', '导入配置或回滚时会自动留一份，最多 20 份')))
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
                    : h('div', { style: css.errorBox }, h(Icon, { name: 'info', size: 14 }), h('span', null, String(backups.error ?? '')))
                  : null,
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
                h('div', { style: { ...css.hint, marginTop: 8 } }, `${noteDraft.length} / 500`),
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
      // 收藏筛选：排在最后（内置技能之后），且只在确实有收藏时出现，避免一张永远为 0 的空卡。
      // 按「此刻真实存在且已收藏」计数：卸载的技能在 state 里可能留着旧记录，
      // 直接数 favorites 的键会让卡片数字大于列表实际条数。
      const favCount = (data?.skills ?? []).filter((skill) => skill.favorite === true).length
      if (favCount > 0) {
        items.push({
          key: 'statFavorite',
          label: say('statFavorite', '收藏'),
          value: favCount,
          filter: 'favorite',
          hint: say('statFavoriteHint', '已收藏的技能，始终置顶；点一下只看收藏'),
        })
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

    /** 左侧入口的整页外壳：给 Page 一个可滚动的容器，其余交给 Page 自己。 */
    function MainPage(props) {
      return h('div', { style: css.mainPage }, h(Page, { ...props, wide: true }))
    }

    /**
     * 左栏入口图标：三条股线交叉，与品牌标记同构。
     * 用 16 单位坐标系重画 96 单位的三条路径（等比 1/6），线宽按比例放大到 1.5，
     * 让它在 16px 下仍然是三条可分辨的线而不是一团墨。
     */
    function NavIcon({ size = 16, active }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          'aria-hidden': true,
          // 选中时用品牌橙，未选中跟随主题前景色；透明度只做次级区分。
          style: { color: active ? '#F26A1B' : 'inherit', display: 'block' },
          opacity: active ? 1 : 0.72,
        },
        h(
          'g',
          {
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          h('path', { d: 'M2.2 12.7C6.3 12.7 6.3 8 10.8 8H13.8' }),
          h('path', { d: 'M2.2 3.3C6.3 3.3 6.3 12.7 10.8 12.7H13.8' }),
          h('path', { d: 'M2.2 8C6.3 8 6.3 3.3 10.8 3.3H13.8' }),
        ),
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

        // 方案 A（双入口）：设置页保留传统做法，同时加一个左侧竖栏入口。
        // 左侧那行点下去是把 layout 的当前面板切到 key 为 zhiyin 的整页。
        ctx.slots.inject('main', () =>
          ctx.slots.register(
            {
              name: 'main',
              key: 'zhiyin',
              locale: NS,
              inject: () => ({ t: ctx.locale.bind(NS) }),
            },
            MainPage,
          ),
        )
        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            {
              name: 'sidebar.panellist',
              id: 'zhiyin',
              order: 10,
              label: () => ctx.locale.bind(NS)('nav'),
              locale: NS,
            },
            NavIcon,
          ),
        )
      },
    }
  },
})