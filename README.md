# FOMO Côte d’Azur

FOMO means “Fear of Missing Out”. This is the public French Riviera installation of
[FOMO Agent](https://github.com/stasyasin/fomo-agent): a small, human-readable event
radar for Nice, the Côte d’Azur, Monaco, and selected nearby destinations.

The public site is intended to be available at
[stasyasin.github.io/fomo-events](https://stasyasin.github.io/fomo-events/). It is not
enabled or deployed by this repository alone; see the GitHub checklist below.

The reusable `fomo-agent` repository owns the provider-agnostic discovery workflow,
schemas, stable IDs, merging, validation, archive, and Markdown utilities. This
repository owns the editable local profile, trusted source list, canonical event data,
reports, and static presentation. It deliberately has no scraper, AI invocation,
backend, login, database, or ticket purchasing automation.

## Scope

The initial profile covers Nice; the French Riviera; Monaco; Cannes; Antibes and
Juan-les-Pins; Menton; Cagnes-sur-Mer; Saint-Paul-de-Vence; Vence; Grasse; Biot;
Mougins; and nearby Italian Riviera locations including Sanremo and Bordighera.
Major exceptional events in Marseille, Aix-en-Provence, Toulon, and Genoa can also be
considered.

It prioritises concerts, classical music, opera and ballet, jazz, Ukrainian and
English-language cultural events, festivals, public/free events, food and wine, art,
cinema, football and selected sport, business/technology, outdoor, astronomy, and
unusual experiences. See [preferences](config/preferences.yaml) for the precise,
editable priorities and starter budget values.

## Repository map

```text
config/       Public preferences and verified-source configuration
data/         Canonical FOMO Agent JSON containers
reports/      Daily and weekly human-readable scan history
UPCOMING.md   Current readable event view, generated after scans
site/         Mobile-first Vite website; generated data is not committed
scripts/      Site preparation and intentionally lightweight local checks
tests/        Offline deterministic utility tests with fictional fixtures
```

`data/events.json` is the canonical event database. Its v1 FOMO Agent container is
`{ "version": 1, "generated_at": null, "events": [] }`; unknown facts stay `null` or
explicitly unknown. `data/run-history.json` is the corresponding `{ "version": 1,
"runs": [] }` record of agent runs. `rejected-events.json` and `attended-events.json`
are intentionally empty v1 event collections until a later FOMO Agent convention
defines richer containers for them.

The website is generated from the root canonical data into `site/public/generated/`.
That directory is ignored and must never be edited as a second source of truth.

## Local development

Node.js 22 or newer and npm are required. `.nvmrc` selects Node 22.

```bash
npm ci
npm run dev
```

`npm run dev` first prepares local generated data, then starts Vite at a local `/` base
path. The Pages build uses the repository path automatically, currently
`/fomo-events/`.

Useful commands:

```bash
npm run validate:data       # JSON/YAML and rendering-safety checks only
npm run validate:agent      # asks the sibling FOMO Agent CLI to validate config + events
npm run test                # offline Vitest suite
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run preview             # serve dist/ after a build
npm run check               # complete local gate
```

`validate:data` deliberately does not replace authoritative FOMO Agent validation. It
only checks what this static viewer must safely render and rejects obvious secret-key
names in canonical data. `validate:agent` searches in this order:

1. `FOMO_AGENT_PATH`
2. sibling `../fomo-agent`
3. optional `FOMO_AGENT_FALLBACK_PATH`

It never installs or copies the agent. When it cannot find the engine, use for example:

```bash
FOMO_AGENT_PATH=/path/to/fomo-agent npm run validate:agent
```

## Editing the public configuration

Edit [config/preferences.yaml](config/preferences.yaml) to adjust zones, horizons,
language fit, categories, favourite artists, travel, budget, and ranking. The initial
values are conservative public starter values, not final personal choices. Do not add
a home address or precise coordinates.

Edit [config/sources.yaml](config/sources.yaml) to add only verified official sources.
It begins with a deliberately small set and clearly names categories that still need a
source. Disabled placeholders are comments rather than invented URLs. Aggregators and
social sources should be leads, not proof of an event fact.

## Future FOMO Agent scans

Before a scan, an AI agent must read the active configuration here and the current
contracts in `../fomo-agent`: `AGENT_INSTRUCTIONS.md`, `WORKFLOW.md`,
`OUTPUT_CONTRACT.md`, and `QUALITY_RULES.md`.

A **full scan** is the first or deep refresh: the AI researches enabled categories and
travel zones, preserves evidence, normalises verified candidates, then uses the FOMO
Agent deterministic utilities for IDs, deduplication, validation, archival, and
Markdown. It updates canonical data atomically, writes an honest report, then rebuilds
the site. No scan is implemented or run by this repository itself.

A **daily scan** seeks newly announced events, rechecks selected entries, records
material changes, writes `reports/daily/YYYY-MM-DD.md`, refreshes `UPCOMING.md`, and
updates run history. A **weekend** run prepares `THIS-WEEKEND.md` and can add a weekly
report. Event facts must be rechecked on their official source before travelling or
buying tickets.

Typical scan preparation, once both repositories exist locally:

```bash
cd ../fomo-agent
npm ci
npm run fomo -- validate-config ../fomo-events/config/preferences.yaml
npm run fomo -- validate-events ../fomo-events/data/events.json
```

Then ask a browsing-capable AI to follow the FOMO Agent full or daily workflow against
this output repository. Review source evidence and all uncertainty before publishing.

### Responsibilities at a glance

- **Codex locally:** can edit this repository, run its validation/build tooling, and use
  the local FOMO Agent CLI. It must not invent events or silently browse/scan on behalf
  of a requested implementation task.
- **AI during a scan:** researches permitted sources, verifies claims, assesses relevance
  and uncertainty, then follows FOMO Agent’s deterministic workflow to update data and
  reports atomically.
- **Repository owner on GitHub:** reviews public content, pushes it, enables Pages, and
  reviews deployments. No local tool can perform those GitHub settings steps implicitly.

## Website behaviour

The Ukrainian mobile-first viewer provides search, category/city/language/ticket/date
filters, sharable query-string filter state, quick collections, price and ticket
uncertainty labels, run-history summaries, report links, and local `.ics` downloads.
It does not call a runtime API or third-party calendar service. `must_go` records are
visually highlighted; “Великі події” is a view-only filter for the explicit
`major_event` tag supplied by FOMO Agent data, not a duplicate ranking system.

Events that are cancelled or expired are excluded from the upcoming list. Unknown dates
are shown separately; date-only records remain date-only. The calendar action is absent
when an event does not have enough date precision. An unknown price is displayed as
“Ціну не вказано”, never as free, and unknown ticket status is equally explicit.

To install the site on a phone, open it in Safari or Chrome, use Share/Menu, then choose
**Add to Home Screen**. The included web manifest enables a standalone app-like launch;
version 0.1.0 intentionally has no service worker, avoiding stale event data.

## GitHub Pages

The Pages workflow uses official GitHub Actions, Node 22, `npm ci`, type checking,
tests, lint, Prettier checking, and a Vite build before deploying `dist/`. The validation
workflow repeats the full local gate and checks the current public `stasyasin/fomo-agent`
CLI contract for preferences and events. Pages deployment itself does not depend on the
sibling repository, so an empty valid database can deploy independently.

After review, the owner must do these manual GitHub steps:

1. Push the initial commit to `main`.
2. Open repository **Settings**.
3. Open **Pages**.
4. Confirm **GitHub Actions** is the deployment source when GitHub requests it.
5. Open the first successful Pages deployment.
6. Add the resulting site to the phone home screen.

No deployment is claimed to be active until that process succeeds.

## Local scheduled scans on Ubuntu

This repository can run scans locally through an existing **Codex CLI login**. It does
not need `OPENAI_API_KEY`, an API billing account, a ChatGPT/Codex desktop application,
or a server. The versioned [wrapper](scripts/run-scheduled-scan.sh) invokes
`codex exec` with the current local authentication, validates the result, and then
commits/pushes an allowlisted set of public data/report files to `origin/main`.

The intended sequence is:

```text
systemd --user timer → run-scheduled-scan.sh → codex exec → validation → commit/push main
                                                                    ↓
                                              GitHub validation + Pages workflows
```

`--mode auto` performs the first scan as `full` while `data/events.json` is empty, then
uses `daily` for later runs. A run begins only from a clean `main` checkout, first
fast-forwards it from `origin/main`, and refuses to commit anything outside canonical
data and Markdown reports. Before its full validation gate, it applies the local
Prettier formatter only to that allowlisted scan output. It never changes Git identity or
remotes. If Codex, a validator, commit, or push fails, the script stops; after Codex
changes, those files are left uncommitted for review rather than being reset or pushed
partially.

### One-time setup

Use a dedicated clone for the timer, so normal development work cannot block it. The
paths in the templates match the current local layout; edit them first if yours differs.
The Node/Codex path is explicit because `systemd --user` does not load NVM from
`.bashrc`.

```bash
cd ~/git_clones/my-github/fomo/fomo-events
chmod +x scripts/run-scheduled-scan.sh

# This checks the local CLI, FOMO Agent checkout, current config, and event database.
# It does not browse, change files, commit, or push.
FOMO_AGENT_PATH=../fomo-agent scripts/run-scheduled-scan.sh --mode auto --dry-run

mkdir -p ~/.config/systemd/user
cp automation/fomo-events-scan.service ~/.config/systemd/user/
cp automation/fomo-events-scan.timer ~/.config/systemd/user/
# Review/edit the copied service if checkout paths or the Node version differ.
systemctl --user daemon-reload

# First run the service deliberately and inspect its journal before enabling the timer.
systemctl --user start fomo-events-scan.service
journalctl --user -u fomo-events-scan.service -n 200 --no-pager

# Only after the manual service run is satisfactory:
systemctl --user enable --now fomo-events-scan.timer
systemctl --user list-timers fomo-events-scan.timer
```

The initial timer runs daily around 08:30 in `Europe/Paris` with up to 20 minutes of
random delay and catches up once after a powered-off interval (`Persistent=true`). Edit
the copied timer and run `systemctl --user daemon-reload` to change the schedule.

For an intentional manual first scan, use one of the following commands only when ready
for real event discovery and a possible commit/push:

```bash
scripts/run-scheduled-scan.sh --mode full
scripts/run-scheduled-scan.sh --mode daily
```

The service needs the same non-interactive Git authentication that makes
`git push origin main` work on this machine. If its journal reports an SSH-agent or
credential error, fix the local user-level Git/SSH setup and retest the service; never
store a personal access token, private key, or passphrase in this repository or service
template. If scans should continue after logout/reboot, enable user lingering manually:

```bash
loginctl enable-linger "$USER"
```

This command is optional and changes a system setting, so it is intentionally not run by
the repository tooling.

## Public-data privacy and licence

Everything committed here, including preferences, event choices, reports, and Git
history, is public. Never commit secrets, tokens, booking references, home addresses,
precise coordinates, or notes about when a household will be away. There is no
analytics, tracking pixel, cookie banner, advertising, external font, or runtime API.

Code is released under the [MIT License](LICENSE). Event facts remain attributable to
their original sources; linked third-party content is not relicensed by this repository.

## Current status and next steps

The installation is ready for its first real full scan, but contains no real or
fictional production event. Next: review the public preferences and sources, add more
verified official sources, perform the GitHub Pages steps above, and then request a
careful FOMO Agent full scan.
