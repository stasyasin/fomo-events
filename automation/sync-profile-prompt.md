# Synchronise the human FOMO profile

The repository owner has edited `config/PREFERENCES.md` in natural language. Translate
only its clear, non-sensitive preferences into the machine-validated
`config/preferences.yaml`.

## Scope and safety

1. Read `AGENTS.md`, `README.md`, `config/PREFERENCES.md`, and
   `config/preferences.yaml` before editing.
2. Modify only `config/preferences.yaml` unless the owner explicitly asks for another
   file. Do not browse, scan events, alter canonical data/reports, add sources, modify
   `fomo-agent`, change Git settings, or commit/push.
3. Preserve the v1 schema and every required field. Translate only unambiguous requests:
   locations/zones, travel limits, horizons, languages, enabled categories, interests,
   budget, and ranking preferences.
4. Do not invent a home address, coordinates, source URL, personal data, or a preference
   that the profile does not actually state. If a sentence is ambiguous, retain the
   existing safe YAML value and call it out in the final summary.
5. Keep this public profile broadly identifying at most; do not add private information.

## Validation and hand-off

After editing, run:

```bash
npm run validate:data
FOMO_AGENT_PATH=../fomo-agent npm run validate:agent
git diff --check
```

Leave every change uncommitted. Return a short summary of the YAML fields changed and
any natural-language request that needs the owner's clarification.
