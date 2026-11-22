# Changelog

All notable changes to ZhiYin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

**中文**: [CHANGELOG.md](CHANGELOG.md)

## [Unreleased]

### Added

- Dual entry points: a full ZhiYin page in the left sidebar alongside Settings → ZhiYin, both rendering the same component
- Skill installation: GitHub repositories, a single skill inside a repo, skills.sh skill pages, `npx skills add` commands, direct SKILL.md URLs and local folders; pick individual skills when a repo contains several; installs can be cancelled and reinstalled
- Skill market: proxies skills.sh search, shows install counts and the matching CLI command, and installs any skill backed by a public repository
- Skill packs: create, rename, duplicate, delete and tick members; the default "All skills" pack is mutually exclusive with the others
- Archive and restore: uninstalling moves a skill into the archive instead of deleting it; restore to the original location or any root; single and bulk permanent deletion
- Catalog characters dialog: how it is calculated, suggested ceilings, optimisation advice and sources
- Config export, import, automatic backup and rollback, plus repair of dangling references
- Per-skill notes, stored in local config and carried by config export
- Open a skill's folder from its card
- In-app user guide dialog: reads the marked section of the README instead of keeping a second copy
- UI language switch: 中文 / English, with the choice remembered
- Brand banners (Chinese and English) and a plugin logo

### Changed

- The UI now shows user concepts only: internal terms such as "observe", "projection", "ensemble" and "takeover" are gone, as are entry points for removed features
- The sidebar page is fluid width (capped at 1600px), and skill cards reflow into as many columns as fit
- Typography and opacity are tokenised; spacing follows an 8pt grid
- Market cards became a masonry layout with hover lift, and skill-list cards now share the market card's visual language
- The catalog budget no longer blocks anything; it only reports cost
- Disabling a skill now means fully invisible: absent from the model catalog, rejected by the `skill` tool, and missing from the slash menu
- The plugin package moved to the repository root, so a clone or download is directly installable
- README rewritten in Chinese and English; the user guide merged into its Usage section
- Explanation dialogs widened to 720px so a last line never holds only one or two characters

### Fixed

- The panel showed "Load failed: HTTP 400" and stayed in a loading state (a module-level variable shadowed a local one, causing a TDZ error)
- The skill total drifted between 111 and 112 (shadow candidates iterated an append-only cache)
- The market install button wrapped its icon and label onto two lines
- Market cards showed a duplicate "Installed" badge
- Importing a skill pack did not turn "All skills" off under the mutual-exclusion rule
- Clicking "open folder" did nothing (`explorer.exe` suppresses its window under `windowsHide`)
- Symlinked skills showed no badge in cards or lists
- The whole settings page rendered blank (a module-level component called a page-scoped text function)
- A synchronous git clone blocked the host event loop during installs, freezing the settings page
- Skill market requests returned 502 (Node `fetch` ignores proxy environment variables)
- Skills hosted on a skills.sh domain with no public repository were treated as installable

### Removed

- The v1 ensemble, combo, exclude, always-on, conflict declaration and "surface matrix" UI, along with their dead code
- The "takeover / not taken over" status badge: internal machinery the user could not act on
- The hard catalog budget threshold and its over-budget warning
- Standalone `GUIDE.md` / `GUIDE.en.md`; the content now lives in the README
