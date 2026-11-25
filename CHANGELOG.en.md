# Changelog

All notable changes to ZhiYin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

**中文**: [CHANGELOG.md](CHANGELOG.md)

## [Unreleased]

## [0.1.9] - 2026-11-25

### Added

- **New SkillHub (skillhub.cn) market tab**: sits beside SKILLS.SH and targets users in China. Supports trending (by downloads), keyword search, paged loading and one-click install
- Cards show upstream source, download count, version and summary, and flag "paid" / "needs key" when the upstream says so
- Filter by 13 categories and sort by downloads / relevance / recently updated / stars / installs
- Installs now use a **single zip package**: each extracted file is checked against the upstream sha256 manifest; encrypted, zip64, path-traversal and oversized packages are rejected
- **SkillHub detail dialog**: click a skill name to review security scans (Tencent keen/sanbu), latest changes, SKILL.md preview and version history before installing
- SKILL.md preview now sits above the file list, and the file list is a collapsed accordion by default
- SKILL.md preview renders as readable Markdown (headings / lists / tables / code) by default, strips YAML frontmatter, and keeps a "View source" toggle; external links are limited to http/https

### Fixed

- **"Cancel update" did nothing during the fetch phase**: cancelling only set a flag while the git child process kept running, so on a slow network the cancel appeared unresponsive for tens of seconds. Cancellation now uses a real AbortController that kills the running git process — measured to return "update cancelled" within 500 ms
- Cancelling no longer surfaces a red error; it shows a neutral "Update cancelled; the skill was not changed" notice
- SkillHub category/sort dropdown options were white-on-white in the dark theme; native `<option>`s now use `optionStyle` with a dark background and light text

### Changed

- The former "Market" tab is now **SKILLS.SH**, using the upstream name rather than an invented translation
- The toolbar button now reads "Check again (N updates)" when updates exist, distinguishing it from the info-row "N updates" (which only filters) — both previously shared a label while behaving differently
- Update progress and "Cancel update" are no longer limited to the skills tab; they stay visible on other tabs

### Notes

- Cancellation takes precedence over the "locally modified" verdict: once the user has cancelled, the panel no longer answers with a local-edit warning

## [0.1.8] - 2026-11-25

### Added

- Three-step update flow: **filter → confirm → interruptible**. Clicking "N updates" first filters to updatable skills; clicking a card's "Update" badge asks for confirmation before writing; while updating, a "Cancel update" button is shown
- Faster checks: read HEAD with `ls-remote` first and skip whole repos already verified at that SHA

### Notes

- Skill updates write directly to the upstream SSOT directory (`~/.agents/skills/<name>` in unified mode) and never replace the `~/.dsh/skills` symlink. AI Vault keeps its own HEAD cache and will not recalculate after a ZhiYin update — a cross-app cache difference, not files written to the wrong place

## [0.1.7] - 2026-11-25

### Changed

- **Skill update checks went from 577s to 33–43s**: a check only needs to know whether upstream moved, but every repo was fetched unconditionally. Now `ls-remote` reads the HEAD first and the whole repo is skipped when every member is already verified at that SHA; concurrency raised from 2 to 6
- A verified HEAD becomes the baseline (`headSha` / `digest`), so the same SHA short-circuits next time

## [0.1.6] - 2026-11-25

### Fixed

- **Skill update check finished instantly and marked everything as failed on desktop** (BUG-017): the DSH snapshot gives `skill.path` as the `SKILL.md` file, which was treated as a directory. The path is now normalized before hashing
- Skills from the same repo each fetched separately (213 requests / 577s); now each repo fetches once and subtrees are sliced locally from one `ls-tree` (51 requests / 214s)

## [0.1.5] - 2026-11-24

### Added

- Automatic skill update checks: toggle plus interval (6h / 12h / daily / 3d / 7d) in settings; first run five minutes after startup, then on the chosen interval in the background without blocking the interface
- The "last full check" time and results **refresh automatically** when a check finishes; no manual reload needed
- The button shows progress while a check runs, and repeated clicks do not stack

### Fixed

- **The whole interface failed to render on the web host** (BUG-016): the interval-dropdown style used `...css.btn` inside the `css` object itself, so evaluating `css` threw `ReferenceError`, the entire client bundle failed to evaluate and no entry was registered. The desktop loader tolerated the self-reference; now the fields are inlined.
- The first check for a fresh install backfills provenance from the AI Vault database (verified by SKILL.md hash) instead of reporting a fake 85ms success with zero sources
- The interval dropdown is a custom dark menu; the native `select` was white-on-white in dark themes
- The status/settings area is a single collapsible row with catalog characters and last-check time on the right, instead of four rows with a large empty area

## [0.1.4] - 2026-11-24

### Fixed

- Header: grouped "Check for updates / Cards / List" in that order and removed the separate refresh icon (checking now refreshes the list)
- Catalog-character-cost dialog: removed the leading bullet on every line

## [0.1.3] - 2026-11-24

### Added

- **Skill update detection**: each skill records its source repo, branch, subpath and content fingerprint (backfillable from the AI Vault database by matching the SKILL.md hash — never guessed by name), then compares that with upstream
  - Six states: `up-to-date` / `update-available` / `locally-modified` / `both-changed` / `check-failed` / `unknown-source`
  - The verdict uses the **skill subtree's content fingerprint**, not the repo HEAD — an upstream README-only commit is not reported
  - `git ls-remote` reads the HEAD (no GitHub API quota); the subtree is fetched with a `blob:none` partial clone only when HEAD moved
  - Cards show an `Update` badge; clicking updates to the upstream version by writing the directory the `~/.dsh/skills` link points at, so the link follows automatically
- **Local-edit protection**: the local fingerprint is re-checked right before writing; an edited copy is refused (409)
- **Back up and force**: the `Edited` badge is clickable — after confirmation the current version is copied into the archive first, then overwritten, so the edit can be recovered
- One automatic check five minutes after startup (24-hour window, concurrency 2, fully async so the host is never blocked)
- Manual entry: the "Check for updates" button and `POST /zhiyin/updates/check`

### Fixed

- Skill market cards: dropped the meaningless "installable" label; `✓ Installed` no longer wraps onto a second line
- Pack management: the status label sat on a different centre line than the members / more / toggle buttons

## [0.1.2] - 2026-11-24

### Security

- Every `/zhiyin/*` HTTP route now runs DSH's admission check (`connection.requestRejection`: the Host/Origin fence plus the browser session). Before this, only the write routes compared Origin/Host themselves; the read routes had no admission check at all, so any web page open in the browser could call them
- A gate that throws is treated as 403; there is no fail-open. A host that provides no gate is admitted (there is no check to run, which is different from waving requests through)
- Read routes moved to handler style, matching dshmarket and dsh-better-sidebar, and the now-unused `json()` helper was removed

### Fixed

- The UI shows the host's rejection reason on 401/403 instead of a bare `HTTP 403`

## [0.1.1] - 2026-11-24

### Fixed

- The README shipped inside the published package was out of date: it offered no npm install route and declared three host-shared package dependencies that do not exist (this package has zero runtime dependencies). Both languages corrected
- The `npm install` line in the README development section was a no-op (no dependencies) and is replaced with commands that do something

### Changed

- Added `.github/workflows/publish.yml`: releases now go through npm trusted publishing (OIDC), with no publish token held or used

## [0.1.0] - 2026-11-24

### Added

- Two entry points: a full ZhiYin page in the left sidebar alongside Settings → ZhiYin, both rendering the same component
- Skill installation and market: GitHub repositories, a single skill inside a repo, skills.sh pages / commands / direct SKILL.md URLs and local folders; search skills.sh and install in one click, reinstall installed skills, and cancel an install in progress
- Skill packs and archive: toggle a whole pack at once, with the default "All skills" pack mutually exclusive; uninstalling only moves a skill into the archive, where it can be restored or deleted for good
- Supporting features: a dialog explaining catalog characters, config export/import with backups and rollback, per-skill notes, opening a skill's folder, and an in-app user guide
- Switchable interface language (中文 / English) with the choice remembered; a GitHub icon in the header opens the repository

### Changed

- The UI shows user concepts only, dropping internal terms and entries for removed features
- Disabling a skill now means fully invisible: absent from the model catalog, rejected by the `skill` tool, missing from the slash menu
- The page is fluid width, with typography and spacing unified
- The package is named `dsh-skills-zhiyin` and the repository root is the plugin itself, so a GitHub download installs directly
- Licensed under Apache-2.0, with LICENSE and NOTICE added; redistributors only need to keep the copyright notice, without opening their own source
- Unused official dependencies were dropped; runtime dependencies now come entirely from the host
- The in-app plugin icon now uses a small-size variant for the 30px / 36px list and card renderings; the full mark remains on the marketplace tile
- The README banner now shares that visual language and uses the mark itself in its final stage; a separate small-size version covers 16–32px contexts
- README and CHANGELOG are bilingual

### Fixed

- The English banner rendered an XML parsing error in the browser (an attribute value lost its quotes)
- The settings page returned 400 and stayed loading, and the skill total drifted between 111 and 112
- The market install button wrapped, cards showed a duplicate "Installed" badge, and requests returned 502
- "Open folder" did nothing, and symlinked skills showed no badge
- A synchronous clone during install blocked the host and froze the settings page
- Under an English interface, the market, archive, install flow and catalog-characters dialog still rendered in Chinese

### Removed

- The v1 combo and ensemble features: their UI entry points, the `/zhiyin/combo` and `/zhiyin/intent` routes, and `consumer.js`
- The hard catalog budget threshold and its over-budget warning; cost is now reported only
