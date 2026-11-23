# Changelog

All notable changes to ZhiYin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

**中文**: [CHANGELOG.md](CHANGELOG.md)

## [Unreleased]

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
