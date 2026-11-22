# ZhiYin

> A skill-management plugin for DeepSeek Harness (DSH): install skills, group them into packs, switch them as needed — so the catalog the model sees is the one you intend.

**中文**: [README.md](README.md) ｜ **User guide**: [prototype/GUIDE.en.md](prototype/GUIDE.en.md)

Private repository during development; not released yet. The UI ships in both Chinese and English; the code is JavaScript (Node ESM, no build step).

## What it is

ZhiYin is a **DSH bundle**, not a standalone app. The host half `index.js` registers same-origin HTTP routes plus a skill strategy provider; the page half `client.js` registers two UI entries:

| Entry | Slots | Notes |
| --- | --- | --- |
| **ZhiYin** in the left sidebar | `sidebar.panellist` + `main` | Full page, fluid width (capped at 1600px) |
| Settings → ZhiYin | `settings.section` + `settings.section.icon` | Classic settings-page form |

Both render the same `Page` component, so content and state are identical.

Scope in one line: **ZhiYin decides what the model can see right now — not what a skill is.**

## Feature status

| Capability | Status | Detail |
| --- | --- | --- |
| Observe skills | Done | Totals, model-invocable count, catalog characters; `GET /zhiyin/state` |
| Dual entry points | Done | Sidebar full page + settings page, one component |
| Install skills | Done | GitHub / skills.sh / `npx skills add` / direct SKILL.md URL / local folder; multi-skill selection; cancellable |
| Uninstall (archive) | Done | Moves into `archive/`; restore to the original or any root; single and bulk permanent delete |
| Toggle a skill | Done | Writes `state.json`; strategy provider with both invocation flags off |
| Skill packs | Done | Create / rename / duplicate / delete / tick members; "All skills" is mutually exclusive |
| Skill market | Done | Proxies skills.sh search and description fetches; reinstall for installed skills |
| Config export/import/backup/repair | Done | Up to 20 backups with rollback |
| Hard catalog budget | Removed | Cost and reference ceilings only; never blocks |

## Install into a DSH profile (development)

The plugin is registered with `link:`; the profile lives at `<DSH_HOME>/profiles/<profile>/package.json`.

```jsonc
{
  "dependencies": {
    "@local/dsh-zhiyin-proto": "link:/path/to/dsh-skills-zhiyin/prototype"
  },
  "dsh": {
    "profile": {
      "bundles": ["@deepseek-ai/dsh-base", "@local/dsh-zhiyin-proto"]
    }
  }
}
```

`bundles` is append-only — do not replace existing rows. `link:` installs do not fetch dependencies, so run `npm install` once inside the package directory.

After changing the host half (`index.js`) you **must fully quit and reopen DSH**; changing `client.js` only needs a page reload (F5).

## Verify

Syntax check (every change):

```bash
node --check prototype/index.js
node --check prototype/client.js
```

[verified locally]

Package contents (confirm only the plugin itself ships):

```bash
cd prototype && npm pack --dry-run
```

[verified locally] 13 files, zero development documents.

Source archive (same as GitHub "Download ZIP"):

```bash
git archive --format=zip HEAD -o /tmp/zhiyin.zip
```

[verified locally] yields only `prototype/`; development docs are stripped by `.gitattributes` `export-ignore`.

Behaviour: open the sidebar **ZhiYin** or Settings → ZhiYin and flip any switch — it applies immediately; `<profile>/zhiyin-proto/events.ndjson` should log `provider-registered`.

## Layout

```
dsh-skills-zhiyin/
├── prototype/              # the plugin package (shipped)
│   ├── index.js            # host half: routes + skill strategy provider
│   ├── client.js           # page half: entry registration + UI
│   ├── paths.js            # state-directory resolution
│   ├── cordis.patch.yml    # bundle patch: inserts one zhiyin row
│   ├── locale/{zh,en}.json
│   ├── icon.svg
│   ├── README.md / README.en.md
│   ├── GUIDE.md / GUIDE.en.md   # user guides
│   └── consumer.js         # deprecated, kept for reference, not mounted
├── docs/                   # development docs (not shipped)
│   ├── prd/  adr/  design/  handoff/  agents/
├── AGENTS.md               # collaboration contract
└── .gitattributes          # source-export allowlist
```

## What ships

Development documentation never ships, enforced by two allowlists:

- **npm package**: the `files` field in `prototype/package.json`;
- **source archive**: `export-ignore` in `.gitattributes` for `/docs`, `/AGENTS.md`, `/PRODUCT.md`, `/CHANGELOG.md` and the root `/README.md`.

## Docs

| Document | Content |
| --- | --- |
| [`prototype/GUIDE.en.md`](prototype/GUIDE.en.md) | User guide: install, packs, archive (shipped) |
| [`docs/prd/ZhiYin-PRD-v0.2.md`](docs/prd/ZhiYin-PRD-v0.2.md) | Requirements baseline |
| [`docs/adr/ZhiYin-M0-ADR.md`](docs/adr/ZhiYin-M0-ADR.md) | Architecture trade-offs and evidence |
| [`docs/design/`](docs/design/) | UI decisions, sidebar-entry and distribution research |
| [`docs/handoff/`](docs/handoff/) | Cross-session handoffs |
| [`docs/agents/`](docs/agents/) | Progress, decisions, debugging, contract changes |
| [`AGENTS.md`](AGENTS.md) | Collaboration contract (Chinese) |

## Known limitations

- Disabling works by registering a strategy provider on each running agent's nearest layer: disabled entries are listed with both invocation flags off, and new agents are hooked by a 2-second poll;
- Catalog characters are estimated as "each description truncated to 500 characters + fixed overhead", not real tokens;
- skills.sh domain-hosted skills have no public repository and cannot be installed directly — the UI only links to their page;
- The version is pinned at `0.1.0` during development.
