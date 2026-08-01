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

I also want the complete fixture list for **OGC Nice men's first-team home matches** at
Allianz Riviera. Football matches should name the opponent, competition, confirmed
kick-off time when published, and point to the club or its official ticketing page.

Please look for nearby tennis tournaments, especially the Rolex Monte-Carlo Masters and
other officially announced tournaments in the French Riviera / Monaco area.

For cinema, I want a **small monthly shortlist**, not every screening. Prioritise films
that feel like a real outing: major auteur or event releases, acclaimed festival films,
original-version screenings, previews, restorations, and director or cast discussions.
Big cinematic releases in the spirit of _The Odyssey_ or _Spider-Man_ are useful taste
signals, but do not claim a film is showing unless the cinema's current official
programme confirms it.

I am also interested in concerts in squares, parks, beaches, or other open-air places;
DJ and electronic sets in distinctive venues; hands-on creative workshops such as pottery,
ceramics, clay modelling, or wheel throwing; and astronomy. For astronomy, include public
observatory activities and genuinely notable sky phenomena only when they are visible from
the Nice area (for example, an eclipse, meteor shower, conjunction, or good planetary
visibility). Give practical viewing or booking information only when an official source
publishes it.

### What should always receive special attention?

- Fireworks and drone shows. In Cannes, check the official city calendar and verify
  **each date separately**.
- Current, upcoming, and already-running museum exhibitions. Include the exhibition
  title, museum, dates, and a link to the official page.
- Free first Sundays at national museums. Check the policy for the specific museum;
  free admission does not mean that a tour or workshop is free.
- Events in English or Ukrainian where language matters.
- OGC Nice home matches, nearby official tennis tournaments, and a concise current cinema
  shortlist rather than an exhaustive timetable.
- Outdoor live music, DJs/electronic music, and adult-friendly creative workshops. Do not
  treat every children's activity or routine class as a recommendation.
- Astronomical phenomena that are locally observable from Nice. A global phenomenon or an
  eclipse visible elsewhere is not enough.

### What budget feels right?

Free events are a major benefit. Up to EUR 80 per person is comfortable; EUR 180 is the
upper limit, above which an event should appear only when it is an exceptionally good
match.

### What do I not want, or want to see less often?

Ordinary recurring events without novelty. Never present an unknown price, language,
ticketing status, or opening time as a known fact.

### Anything else?

I support OGC Nice. Keep the event radar practical: a short, well-sourced selection is
better than a long list of low-signal cinema sessions, routine workshops, or generic
recurring activities.

---

## What to know about sources

This file can say “I want events in Toulon”, but it cannot make an arbitrary website into
evidence. A coding agent must verify any new official source and add it to
`config/sources.yaml`; aggregators and social media can be leads, not confirmation of
facts.
