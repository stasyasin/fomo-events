# My FOMO profile — start here

This is the **only file a non-technical person needs to edit**. Write short sentences
in English, Ukrainian, or another language your coding agent can understand. No special
format, YAML, programming, or category names are needed.

## Change your preferences in a few minutes

1. Replace the answers under the headings below. Delete the examples if they do not fit
   and add your own points.
2. Open this repository in Codex, Claude, or another coding agent and ask: **“Update
   `config/preferences.yaml` from `config/PREFERENCES.md` by following
   `automation/sync-profile-prompt.md`.”**
3. Review the proposed diff, run the validation, and commit it. Only then run a real
   scan.

This text says _what_ the person wants. The technical `preferences.yaml` is the
machine-validated version of the same preferences. A scheduled scan deliberately never
rewrites the configuration itself: it may change only verified events and reports. If
this file and the YAML differ, the scan safely uses the YAML and warns about the
discrepancy.

Everything in this repository is public. Do not write a home address, precise
coordinates, phone numbers, ticket or booking details, passwords, tokens, or information
about when you will be away from home.

---

## My answers

### Where am I based, and where am I willing to travel?

I am based around Nice. Nice and nearby towns are most convenient; I am also willing to
travel to Cannes, Antibes, Monaco, Biot, Vallauris, Menton, and other French Riviera
towns when an event is genuinely interesting. I mostly use public transport. I am happy
to travel up to 90 minutes for a normal event and up to 180 minutes for an exceptional
one.

### What do I particularly want to see?

Concerts, classical music, opera, ballet, jazz and blues; Ukrainian cultural events;
English-language theatre or stand-up; food and wine festivals; cinema; AI, product, UX,
and design; and unusual local events.

### What should always receive special attention?

- Fireworks and drone shows. In Cannes, check the official city calendar and verify
  **each date separately**.
- Current, upcoming, and already-running museum exhibitions. Include the exhibition
  title, museum, dates, and a link to the official page.
- Free first Sundays at national museums. Check the policy for the specific museum;
  free admission does not mean that a tour or workshop is free.
- Events in English or Ukrainian where language matters.

### What budget feels right?

Free events are a major benefit. Up to EUR 80 per person is comfortable; EUR 180 is the
upper limit, above which an event should appear only when it is an exceptionally good
match.

### What do I not want, or want to see less often?

Ordinary recurring events without novelty. Never present an unknown price, language,
ticketing status, or opening time as a known fact.

### Anything else?

Write anything here in your own words: favourite artists, teams, topics, important dates,
cities, report preferences, or types of event to avoid.

---

## What to know about sources

This file can say “I want events in Toulon”, but it cannot make an arbitrary website into
evidence. A coding agent must verify any new official source and add it to
`config/sources.yaml`; aggregators and social media can be leads, not confirmation of
facts.
