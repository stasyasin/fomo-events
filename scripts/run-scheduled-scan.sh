#!/usr/bin/env bash
# Run a FOMO scan locally through an authenticated Codex CLI session.
#
# This script is intentionally the only scheduled path that may commit and push data
# changes. It never installs dependencies, changes Git identity, or writes outside the
# output/report paths listed in `is_allowed_output_path` below.

set -Eeuo pipefail

readonly SCRIPT_NAME="$(basename "$0")"
readonly INITIAL_DIRECTORY="$PWD"
readonly SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
readonly REPOSITORY_ROOT="$(cd "$SCRIPT_DIRECTORY/.." && pwd -P)"
readonly DEFAULT_AGENT_PATH="$REPOSITORY_ROOT/../fomo-agent"

MODE="auto"
DRY_RUN=false
# Pin the scheduled agent independently from the model selected in an interactive
# Codex session. These two values are the scheduler's model configuration.
readonly CODEX_MODEL="gpt-5.6-terra"
readonly CODEX_REASONING_EFFORT="high"
readonly NETWORK_RETRY_ATTEMPTS=5
readonly NETWORK_RETRY_DELAY_SECONDS=15

log() {
  printf '[%s] %s\n' "$SCRIPT_NAME" "$*"
}

fail() {
  printf '[%s] Error: %s\n' "$SCRIPT_NAME" "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage: scripts/run-scheduled-scan.sh [--mode auto|full|daily|weekend] [--dry-run]

Runs an authenticated local `codex exec` scan in this repository, validates the result,
then commits and pushes only approved FOMO output files to origin/main.

Options:
  --mode MODE  auto (default), full, daily, or weekend
  --dry-run    validate the current local setup and show the selected mode, but do not
               fetch, scan, modify files, commit, or push
  --help       show this help

Environment:
  FOMO_AGENT_PATH  Absolute or relative path to the local fomo-agent checkout. Defaults
                   to the sibling ../fomo-agent checkout.

`auto` selects `full` when data/events.json is empty and `daily` otherwise.
The checkout must start clean and on branch main. On failure after a scan, changed files
are deliberately left uncommitted for human review.
EOF
}

while (($# > 0)); do
  case "$1" in
    --mode)
      (($# >= 2)) || fail "--mode needs a value."
      MODE="$2"
      shift 2
      ;;
    --mode=*)
      MODE="${1#--mode=}"
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help | -h)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1. Use --help for usage."
      ;;
  esac
done

case "$MODE" in
  auto | full | daily | weekend) ;;
  *) fail "Unsupported mode '$MODE'. Use auto, full, daily, or weekend." ;;
esac

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command is unavailable: $1"
}

# Wi-Fi and DNS commonly take a short time to recover after a laptop resumes. Retry
# only the remote Git operations, with a fixed upper bound, so a timer run never waits
# indefinitely. A failed final push still leaves its local commit for the next clean run
# to publish before it starts a new scan.
retry_remote_git() {
  local description="$1"
  shift

  local attempt
  local exit_code
  for ((attempt = 1; attempt <= NETWORK_RETRY_ATTEMPTS; attempt += 1)); do
    if "$@"; then
      return 0
    else
      exit_code=$?
    fi

    if ((attempt == NETWORK_RETRY_ATTEMPTS)); then
      fail "$description failed after $NETWORK_RETRY_ATTEMPTS attempt(s) (last exit code: $exit_code)."
    fi

    log "$description failed (exit $exit_code); retrying in ${NETWORK_RETRY_DELAY_SECONDS}s (attempt $((attempt + 1))/$NETWORK_RETRY_ATTEMPTS)."
    sleep "$NETWORK_RETRY_DELAY_SECONDS"
  done
}

is_allowed_output_path() {
  case "$1" in
    data/events.json | data/run-history.json | data/rejected-events.json | data/attended-events.json | UPCOMING.md | THIS-WEEKEND.md | reports/daily/*.md | reports/weekly/*.md)
      return 0
      ;;
    *) return 1 ;;
  esac
}

require_command git
require_command node
require_command npm
require_command codex
require_command flock

git -C "$REPOSITORY_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1 || \
  fail "$REPOSITORY_ROOT is not a Git worktree."

if [[ -n "${FOMO_AGENT_PATH:-}" ]]; then
  AGENT_CANDIDATE="$FOMO_AGENT_PATH"
  if [[ "$AGENT_CANDIDATE" != /* ]]; then
    AGENT_CANDIDATE="$INITIAL_DIRECTORY/$AGENT_CANDIDATE"
  fi
else
  AGENT_CANDIDATE="$DEFAULT_AGENT_PATH"
fi

[[ -d "$AGENT_CANDIDATE" ]] || \
  fail "Could not find fomo-agent at $AGENT_CANDIDATE. Set FOMO_AGENT_PATH=/path/to/fomo-agent."
readonly AGENT_ROOT="$(cd "$AGENT_CANDIDATE" && pwd -P)"
[[ -f "$AGENT_ROOT/package.json" ]] || fail "$AGENT_ROOT does not look like a fomo-agent checkout."

if [[ "$(git -C "$REPOSITORY_ROOT" branch --show-current)" != "main" ]]; then
  fail "Scheduled scans only run on branch main. Switch to main first."
fi

if [[ -n "$(git -C "$REPOSITORY_ROOT" status --porcelain)" ]]; then
  fail "The worktree is not clean. Use a dedicated clean checkout or review local changes first."
fi

# Avoid overlapping manual and timer-triggered runs. The lock is released automatically.
readonly LOCK_DIRECTORY="${XDG_RUNTIME_DIR:-/tmp}"
readonly LOCK_FILE="$LOCK_DIRECTORY/fomo-events-scan.lock"
exec 9>"$LOCK_FILE"
flock -n 9 || fail "Another fomo-events scan is already running."

cd "$REPOSITORY_ROOT"

select_auto_mode() {
  node -e '
    const { readFileSync } = require("node:fs");
    const database = JSON.parse(readFileSync(process.argv[1], "utf8"));
    if (!database || !Array.isArray(database.events)) {
      throw new Error("data/events.json does not contain an events array");
    }
    process.stdout.write(database.events.length === 0 ? "full" : "daily");
  ' "$REPOSITORY_ROOT/data/events.json"
}

if [[ "$MODE" == "auto" ]]; then
  MODE="$(select_auto_mode)" || fail "Could not select an automatic scan mode from data/events.json."
fi

log "Selected $MODE scan mode."
log "Validating the current configuration and canonical event database."
npm run validate:data
FOMO_AGENT_PATH="$AGENT_ROOT" npm run validate:agent

if [[ "$DRY_RUN" == true ]]; then
  log "Dry run passed. A real run would fast-forward from origin/main, ask Codex to perform a $MODE scan, validate the allowed output changes, commit, and push."
  exit 0
fi

# Never wait for an interactive credentials prompt in a scheduled process. SSH-agent or
# another non-interactive Git authentication mechanism must already be available.
export GIT_TERMINAL_PROMPT=0

log "Synchronising the clean main checkout with origin/main."
retry_remote_git "Fetching origin/main" git fetch --quiet origin main
retry_remote_git "Fast-forwarding main from origin/main" git pull --ff-only --quiet origin main

# Recover cleanly if a prior completed scan committed successfully but its push failed.
log "Ensuring origin/main has no pending local scan commit."
retry_remote_git "Pushing a pending local scan commit" git push --porcelain origin main

readonly SCAN_PROMPT="$REPOSITORY_ROOT/automation/fomo-scan-prompt.md"
[[ -f "$SCAN_PROMPT" ]] || fail "Missing scheduled scan prompt: $SCAN_PROMPT"

log "Starting Codex with $CODEX_MODEL reasoning $CODEX_REASONING_EFFORT. It will use the existing local Codex login; no API key is read."
{
  cat "$SCAN_PROMPT"
  printf '\n\n## Invocation details\n\n- Scan mode: `%s`\n- Output repository: `%s`\n- FOMO Agent checkout: `%s`\n' \
    "$MODE" "$REPOSITORY_ROOT" "$AGENT_ROOT"
} | FOMO_AGENT_PATH="$AGENT_ROOT" codex exec \
  --ephemeral \
  --color never \
  --sandbox workspace-write \
  --model "$CODEX_MODEL" \
  --config "model_reasoning_effort=\"$CODEX_REASONING_EFFORT\"" \
  --cd "$REPOSITORY_ROOT" \
  -

changed_paths=()
while IFS= read -r -d '' entry; do
  status="${entry:0:2}"
  path="${entry:3}"

  case "$status" in
    *D* | *R* | *C*)
      fail "Refusing deleted, renamed, or copied path from scan: $path ($status). Review it manually."
      ;;
  esac

  if ! is_allowed_output_path "$path"; then
    fail "Refusing an out-of-scope scan change: $path. Only canonical data and Markdown reports may be committed."
  fi

  changed_paths+=("$path")
done < <(git status --porcelain=v1 -z)

if ((${#changed_paths[@]} == 0)); then
  log "Codex reported no tracked or untracked output changes. Nothing to commit."
  exit 0
fi

log "Formatting ${#changed_paths[@]} allowed output change(s) with local Prettier."
# Scan output is intentionally restricted to the whitelist above. Formatting only that
# list keeps the repository-wide formatting gate useful without modifying source code or
# unrelated local work.
npm exec prettier -- --write "${changed_paths[@]}"

log "Validating ${#changed_paths[@]} allowed output change(s)."
npm run validate:data
FOMO_AGENT_PATH="$AGENT_ROOT" npm run validate:agent
npm run check
git diff --check

git add -- "${changed_paths[@]}"
git diff --cached --check

if git diff --cached --quiet; then
  log "No staged content changes remain after validation. Nothing to commit."
  exit 0
fi

readonly TODAY="$(TZ=Europe/Paris date +%F)"
log "Committing the validated $MODE scan output."
git commit -m "chore(events): $MODE FOMO scan $TODAY"

log "Pushing the scan commit to origin/main."
retry_remote_git "Pushing the scan commit" git push origin main
log "Scheduled $MODE scan completed successfully."
