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
curated cinema highlights, OGC Nice home football, nearby tennis, business/technology,
open-air music and DJs, creative workshops, locally visible astronomy, and unusual
experiences. A new owner first edits the plain-language
[“My FOMO profile”](config/PREFERENCES.md); Codex then synchronises it into the precise,
machine-validated [preferences.yaml](config/preferences.yaml).

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

For normal personalisation, edit only [config/PREFERENCES.md](config/PREFERENCES.md): it
is a short English plain-language questionnaire with examples. Then ask your Codex,
Claude, or another coding agent to follow
[automation/sync-profile-prompt.md](automation/sync-profile-prompt.md). It translates
clear requests into the YAML, validates the result, leaves it uncommitted, and reports
anything ambiguous. This is deliberately a separate step: a scheduled scan must never
silently rewrite the owner's preferences.

[config/preferences.yaml](config/preferences.yaml) is the machine-validated version used
by the scheduler. It is for advanced/manual edits to zones, horizons, language fit,
enabled categories, travel, budget, and ranking. The initial values are conservative
public starter values, not final personal choices. Do not add a home address or precise
coordinates.

Edit [config/sources.yaml](config/sources.yaml) to add only verified official sources.
It begins with a deliberately small set and clearly names categories that still need a
source. Disabled placeholders are comments rather than invented URLs. Aggregators and
social sources should be leads, not proof of an event fact.

### Starting again for a different person

Use a fresh clone of that person's fork rather than reusing someone else's output and
preferences. Everything in this repository is public. Before the first scan, the new
owner must:

1. Replace [config/PREFERENCES.md](config/PREFERENCES.md) with their own broad,
   non-sensitive answers.
2. Ask their Codex, Claude, or another coding agent: **“Update
   `config/preferences.yaml` from `config/PREFERENCES.md` by following
   `automation/sync-profile-prompt.md`.”**
3. Review the resulting `config/preferences.yaml` and all configured sources.

They must also remove every event, report, and run history belonging to the previous
profile. Never retain another person's favourites, attended/rejected list, or scan
report.

In the new clone, make these canonical JSON containers empty and valid:

```jsonc
// data/events.json
{ "version": 1, "generated_at": null, "events": [] }

// data/run-history.json
{ "version": 1, "runs": [] }

// data/rejected-events.json and data/attended-events.json
{ "version": 1, "events": [] }
```

Delete the dated Markdown files in `reports/daily/` and `reports/weekly/`, while keeping
their `.gitkeep` files. Reset `UPCOMING.md` and `THIS-WEEKEND.md` to their neutral
"No events have been discovered yet" placeholders. Then review the public
`config/preferences.yaml` and `config/sources.yaml` again: do not put in a home address,
precise coordinates, booking information, secrets, or unverified source URLs.

The scheduled wrapper only starts from a clean `main` checkout, so validate and commit
this blank, person-specific baseline before the first real scan:

```bash
npm run validate:data
FOMO_AGENT_PATH=../fomo-agent npm run validate:agent
git diff --check
git status --short       # inspect every deletion and replacement
git add -A config data reports UPCOMING.md THIS-WEEKEND.md
git commit -m "chore: initialize public FOMO profile"
```

After that commit, `scripts/run-scheduled-scan.sh --mode auto` correctly selects a
`full` scan. Do not use a reset command in a clone that contains output you may still
need; first keep a backup branch or clone.

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

This is the **Ubuntu/Linux systemd** option for local scans through an existing **Codex
CLI login**. It does not need `OPENAI_API_KEY`, an API billing account, a
ChatGPT/Codex desktop application, or a server. The versioned
[wrapper](scripts/run-scheduled-scan.sh) invokes
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

After laptop resume, Wi-Fi/DNS can be available a little later than the user service.
The wrapper therefore retries remote Git fetch, fast-forward, and push operations up to
five times with a 15-second delay. It does not retry Codex or validation failures. A
final push that still fails leaves the local scan commit intact; the next clean run tries
to push that commit before it starts a new scan.

### Model configuration for the scheduled Codex run

The scheduler pins Codex to `gpt-5.6-terra` with `high` reasoning in the two readonly
settings near the top of
[scripts/run-scheduled-scan.sh](scripts/run-scheduled-scan.sh). The actual `codex exec`
command passes both `--model` and `--config model_reasoning_effort=…` explicitly. This
means the scheduled run cannot inherit the model or reasoning effort last used in an
interactive Codex session.

To change the scheduled model later, edit `CODEX_MODEL` and
`CODEX_REASONING_EFFORT` in that script, run the dry-run command below, inspect and
commit the change, then let the next timer invocation use it. `high` gives the scan more
time to reason and check evidence, at the cost of a slower run and more usage.

For manual Codex work in a trusted clone, the analogous optional project configuration
is:

```toml
# .codex/config.toml
model = "gpt-5.6-terra"
model_reasoning_effort = "high"
```

That TOML controls manual sessions which load the trusted project configuration; it is
not required for the timer because the wrapper already pins its own invocation.

### One-time setup and first scan

Use a dedicated clone for the timer, so normal development work cannot block it. The
paths in the templates match the current local layout; edit them first if yours differs.
The Node/Codex path is explicit because `systemd --user` does not load NVM from
`.bashrc`. Commit any changes in this checkout before a real run: the wrapper correctly
refuses a dirty worktree.

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

# Start one real scan now. With an empty event database, `--mode auto` selects `full`.
# --no-block returns the terminal immediately; the service continues in the background.
systemctl --user start --no-block fomo-events-scan.service

# Follow the live scan log. Ctrl+C stops only this log viewer, not the service.
journalctl --user -fu fomo-events-scan.service
```

It is safe to close the terminal after the `systemctl --user start` command: the
user-level service keeps running. The wrapper pushes nothing until Codex has finished
and validation, formatting, tests, linting, type checking, and the site build all pass.
If it fails after Codex has changed output, it leaves those files uncommitted for review
rather than pushing a partial result.

If the live log makes no progress for roughly 15 minutes, stop the service safely and
inspect the remaining uncommitted output:

```bash
systemctl --user stop fomo-events-scan.service
git status --short
```

Do not run `systemctl --user start fomo-events-scan.service` merely to enable the
schedule: it always starts an immediate real scan.

### Enable the weekly timer

After the first manual service run is satisfactory, enable the timer. This starts only
the schedule; it does **not** start another scan immediately.

```bash
systemctl --user enable --now fomo-events-scan.timer
systemctl --user status fomo-events-scan.timer --no-pager
systemctl --user list-timers --all fomo-events-scan.timer
```

The initial timer runs every Monday at 08:30 in `Europe/Paris`. A calendar event missed
during suspend is handled once after resume, and `Persistent=true` catches up once when
the timer was inactive (for example after the computer was powered down). Edit the copied
timer and run `systemctl --user daemon-reload` to change the schedule.

View the most recent completed run without following live output:

```bash
journalctl --user -u fomo-events-scan.service -n 200 --no-pager
```

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
template. If scans should continue after logout/reboot without an open desktop session,
enable user lingering manually:

```bash
loginctl enable-linger "$USER"
```

This command is optional and changes a system setting, so it is intentionally not run by
the repository tooling.

### Alternative: scheduled work in the Codex desktop app

The `systemd --user` instructions above are an Ubuntu-specific execution option, not a
requirement of FOMO. A user can instead open this repository as a project in the Codex
desktop app and create a scheduled task there. Choose the local project only when it is
clean and you deliberately want that task to change the live checkout; choose a worktree
when isolation is more important. The computer and desktop app must be running for a
task that needs local files.

Use [automation/fomo-scan-prompt.md](automation/fomo-scan-prompt.md) as the durable
scan brief, choose `gpt-5.6-terra` and High reasoning in the task's model controls if
that is the desired policy, and review the result before committing or pushing it. The
desktop task is an alternative to this timer: do not enable both schedules for the same
checkout. It does not invoke the shell wrapper, so it does not automatically receive the
wrapper's strict changed-file allowlist or its automatic commit/push sequence.

## Public-data privacy and licence

Everything committed here, including preferences, event choices, reports, and Git
history, is public. Never commit secrets, tokens, booking references, home addresses,
precise coordinates, or notes about when a household will be away. There is no
analytics, tracking pixel, cookie banner, advertising, external font, or runtime API.

Code is released under the [MIT License](LICENSE). Event facts remain attributable to
their original sources; linked third-party content is not relicensed by this repository.

## Current status and next steps

The first full scan completed on 2026-08-01 using the two enabled official sources. Its
14 records, run history, and daily report are deliberately a limited starting point, not
complete regional coverage. Next: review the public event data, add more verified
official sources, perform the GitHub Pages steps above, and let the weekly timer maintain
the database.
