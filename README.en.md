# ZhiYin

A skill-management plugin for DeepSeek Harness: install skills, group them into packs, switch them on and off.

English ｜ [中文](README.md)

ZhiYin turns "which skills can the model see right now" into something you can operate directly: what gets installed, which ones stay, and who has them on. It never edits skill files and never replaces DSH's own skill machinery — it only decides the visible set around them.

## Features

| Capability | Detail |
| --- | --- |
| Skill list | Totals, model-invocable count, catalog characters; sort by source, size or enabled state |
| Install | GitHub repository, one skill inside a repo, skills.sh page, `npx skills add` command, direct SKILL.md URL, or a local folder; pick individual skills when a repo contains several |
| Uninstall and archive | Uninstalling never deletes — the skill moves into an archive you can restore to its original location or elsewhere, or delete permanently |
| Per-skill toggles | Switches apply immediately and write local state only, never skill files |
| Skill packs | Group skills and switch each group as a unit; the default "All skills" pack is mutually exclusive with the others |
| Skill market | Search skills.sh and install any skill backed by a public repository |
| Config backup | Export/import JSON config, up to 20 backups kept for rollback |

## Install

Install into a profile as a DSH bundle:

```bash
# from a local folder
dsh plugin --profile <profile> add /path/to/dsh-skills-zhiyin

# from a tarball
npm pack
dsh plugin --profile <profile> add ./dsh-skills-zhiyin-0.1.0.tgz
```

After installing, **fully quit and reopen DSH** — the host half loads at process start, so reloading the page is not enough.

Requirements: Node.js ≥ 24; host-shared packages `@deepseek-ai/dsh-llm`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-tools`.

## Usage

Two entry points, identical content: the **ZhiYin** row in the left sidebar, or Settings → ZhiYin.

The full walkthrough lives in **[GUIDE.en.md](GUIDE.en.md)** — installing, how packs group skills, archive and restore, and catalog characters.

## What it writes

| Location | When |
| --- | --- |
| `<DSH_HOME>/zhiyin-proto/state.json` | Whenever toggles, packs or notes change |
| `<DSH_HOME>/zhiyin-proto/events.ndjson` | Appended diagnostic log |
| `<DSH_HOME>/zhiyin-proto/archive/` | When a skill is uninstalled |
| `~/.dsh/skills`, `<project>/.dsh/skills`, `~/.agents/skills` | Only when you explicitly install or uninstall a skill |

Toggling and viewing **never** touch skill files. Installation and uninstallation only happen on explicit user action.

## Known limitations

- Disabling works by registering a strategy provider on every running agent; new sessions are hooked by polling;
- Catalog characters are an estimate (each description capped at 500 characters plus fixed overhead), not real token counts;
- Skills hosted only on a skills.sh domain, with no public repository, cannot be installed directly — the UI only links to them;
- In development; the version stays at `0.1.0`.

## Development

```bash
npm install          # install dependencies
node --check index.js
node --check client.js
npm pack --dry-run   # inspect what would be published
```

Host-half changes need a DSH restart; page-half changes only need a page reload.

## License

No open-source license chosen yet.
