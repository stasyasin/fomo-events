# Instructions for coding agents

`fomo-events` is a concrete, public output repository for the French Riviera. It is not
the reusable discovery engine. When available, read the contracts in sibling
`../fomo-agent` before changing configuration, canonical data, reports, or scan tooling.

- Do not duplicate FOMO Agent discovery, ranking, ID, deduplication, archival, or schema
  logic here. Use its deterministic CLI where available.
- Never fabricate events, dates, prices, availability, venues, or URLs. Test fixtures must
  remain fictional and must never be copied to `data/events.json`.
- Preserve the canonical FOMO Agent containers and make site preparation read-only with
  respect to canonical data.
- Keep all public content safe: no secrets, personal addresses, booking references, or
  future-absence notes.
- Keep the GitHub Pages build deterministic and generated site data untracked.
- Do not modify `../fomo-agent`, Git remotes, identity, or SSH configuration without an
  explicit separate request.
- Do not commit or push unless the repository owner explicitly asks.
- `scripts/run-scheduled-scan.sh` is the sole versioned automated path that may commit
  and push an allowlisted scan result when the owner explicitly installs/runs its
  `systemd --user` timer. Other coding sessions still require explicit permission.
