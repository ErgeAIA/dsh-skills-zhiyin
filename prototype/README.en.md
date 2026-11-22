# ZhiYin

A skill-management plugin for DeepSeek Harness (DSH): install, uninstall and toggle skills, and group them into **skill packs** you can switch as a unit.

Scope in one line: **ZhiYin decides what the model can see right now — not what a skill is.**

- User guide: [GUIDE.en.md](GUIDE.en.md) ｜ 中文: [GUIDE.md](GUIDE.md)
- Where to find it: the **ZhiYin** row in the left sidebar, or Settings → ZhiYin

## What it does

| Capability | Detail |
| --- | --- |
| Observe skills | Totals, model-invocable count, catalog characters; served by `GET /zhiyin/state` |
| Install skills | GitHub repo, single skill inside a repo, skills.sh page, `npx skills add` command, direct SKILL.md URL, or a local folder; only ever creates skill directories |
| Uninstall skills | **Never deletes** — moves the directory into an archive you can restore from, or delete permanently from the Archive tab |
| Toggle skills | Registers a strategy provider per agent; disabled skills are not listed and both invocation flags are off; switches apply immediately |
| Skill packs | Group toggling; the default "All skills" pack is mutually exclusive with the others |
| Skill market | Proxies skills.sh search; installs skills that have a public repository |
| Config backup | Export/import JSON config, up to 20 backups kept for rollback |

## Install

This package is a DSH **bundle**: `package.json` declares `dsh.bundle.patch`, and `cordis.patch.yml` inserts one plugin row into a profile.

```bash
# from a local folder (typical during development)
dsh plugin --profile <profile> add /path/to/this/folder

# from a tarball
npm pack
dsh plugin --profile <profile> add ./dsh-skills-zhiyin-0.1.0.tgz
```

After installing, **fully quit and reopen DSH** — the host half loads at process start, so reloading the page is not enough.

Requirements: Node.js ≥ 24; host-shared packages `@deepseek-ai/dsh-llm`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-tools` (pinned in `dependencies`).

## Data

State directory: `<DSH_HOME>/zhiyin-proto/` (falls back to the process working directory when `DSH_HOME` is unset).

| File / directory | Purpose |
| --- | --- |
| `state.json` | Persistent state: `agentsRoot`, `allOff`, `disabled`, `notes`, `packs`, `known` |
| `events.ndjson` | Diagnostic log, one JSON object per line |
| `archive/` | Skills moved out on uninstall, plus `origins.json` recording where each came from |

## Routes

Same-origin HTTP (third-party plugins have no Typert Remote). Write routes accept `POST` only, check that `Origin` matches `Host`, and cap the body at 64 KB.

`GET /zhiyin/state`, `/zhiyin/archive`, `/zhiyin/export`, `/zhiyin/backups`, `/zhiyin/market`
`POST /zhiyin/skill`, `/settings`, `/pack`, `/install`, `/install/batch`, `/install/abort`, `/uninstall`, `/restore`, `/archive/delete`, `/import`, `/rollback`, `/repair`, `/reveal`, `/note`

## Write boundaries

- Toggling and observing **never touch skill files**; they only write local state;
- Only explicit user actions write skill directories: **install** (create a directory) and **uninstall** (move into the archive);
- Installing into `~/.agents/skills` also creates a symlink under `~/.dsh/skills`, which uninstall cleans up.

## License

Private during development; no open-source license chosen yet.
