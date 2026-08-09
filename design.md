# FOMO Côte d’Azur — design language

This document is the visual source of truth for the public event radar. The current
system is derived from `tempalte_to_parse.html` (the filename is intentionally recorded
as it exists in the repository). It adapts the reference’s visual grammar; it does not
copy the Snapora name, photography, marketing copy, Webflow markup, scripts, animations,
or third-party assets.

## Direction: Riviera contact sheet

FOMO is an editorial cultural index: confident, useful, spacious, and a little raw. The
reference works because it combines an almost monochrome paper palette, very large
condensed type, hard rectangular geometry, small technical captions, and surprising
amounts of negative space. The event radar applies the same ideas to verified event
information.

The memorable gesture is the oversized `FOMO` masthead followed by a numbered event
index. Dates, filters, scan history, and actions feel like notations on a photographer’s
contact sheet rather than dashboard widgets. The result must stay content-first: there
are no invented event images, decorative gradients, glass cards, or ornamental data
visualisations.

## Extracted reference UI kit

### Type

The reference loads two Google font families:

| Role                  | Family                   | Weights in source | Reference behaviour                                         |
| --------------------- | ------------------------ | ----------------- | ----------------------------------------------------------- |
| Display and interface | `Oswald`, sans-serif     | 200–700           | Condensed, mostly uppercase, light display weights          |
| Technical metadata    | `Inconsolata`, monospace | 400, 700          | Small dates, counters, state labels, and machine-like notes |

Its desktop body is `16px / 140%` at weight 300. The source heading scale is unusually
large: `h1: 9.3vw`, `h2: 100px`, `h3: 30px`, with 120% line height. At tablet widths,
`h2` becomes `60px`; on smaller screens it moves through `40px` to `30px`, while the
hero grows proportionally to `12vw` and then `16vw`.

FOMO keeps those proportions but uses fluid `clamp()` values. Long descriptions remain
sentence case for scanning and accessibility; navigation, headings, dates, buttons,
badges, and filter labels use uppercase. Display type uses weight 200–300, interface
labels 400–500, and monospace metadata 700 when contrast is needed.

### Colour and background

| Token          | Value              | Origin / purpose                                              |
| -------------- | ------------------ | ------------------------------------------------------------- |
| `--paper`      | `#F5EFE5`          | Exact reference page background and dominant field            |
| `--ink`        | `#000000`          | Exact reference text, rule, active control, and action colour |
| `--surface`    | `#FFFFFF`          | Exact reference card and menu surface                         |
| `--muted`      | `#666666`          | Exact reference supporting-text colour                        |
| `--paper-deep` | `#E8E0D4`          | Derived paper shade for scrollbar tracks and quiet separation |
| `--line`       | `rgb(0 0 0 / 20%)` | Secondary rules and internal structure                        |
| `--line-quiet` | `rgb(0 0 0 / 10%)` | Low-contrast navigation and field separation                  |

The page background is deliberately flat warm paper. White appears only where a
functional surface must separate from that field, such as the filter panel, open menus,
empty states, and scan cards. Black is the sole accent and creates selected or primary
states by inversion. Do not reintroduce terracotta, navy, colourful gradients, glow,
blurred atmosphere graphics, or low-contrast cream-on-white text.

### Spacing and geometry

The source uses a strict `10 / 20 / 30 / 40 / 60 / 80 / 100px` spacing ladder. FOMO
exposes the same ladder as `--space-1` through `--space-10`. The reference container is
`1740px` wide with compact gutters; the site keeps the same maximum but uses responsive
gutters from `16px` to `40px` so controls remain comfortable on modern screens.

Main interface geometry is square:

- no card, input, button, badge, or menu corner radius;
- one-pixel black rules define groups and surfaces;
- no default card shadows;
- `44px` is the minimum practical control target;
- rectangular primary buttons start from the reference’s `14px 56px` proportion, then
  adapt to available event-card space;
- section rhythm is intentionally large, commonly `80px` to `140px`.

### Hover, focus, and motion

The original template uses split-letter vertical text swaps, image movement, and black
button inversion. FOMO translates those into lightweight CSS interactions:

- primary and repository buttons invert from black to paper; secondary buttons invert
  in the opposite direction;
- external-link arrows move slightly up and right;
- quick views invert to black on hover and when selected;
- event rows become white, gain horizontal breathing room, and shift the title by only
  a few pixels;
- scan-history tiles invert as one surface;
- custom menu choices use the same black selection state;
- all keyboard focus uses a visible 3px black outline with offset;
- entrance motion is limited to one page fade and a staggered hero rise; menu opening is
  a short downward reveal;
- `prefers-reduced-motion: reduce` disables non-essential motion and smooth scrolling.

Transitions should stay between `180ms` and `220ms` and use the shared expressive
ease-out curve. Never add looping animation, parallax, auto-scrolling marquees, or GSAP
as a dependency.

## Content and copy system

The reference’s copy hierarchy, not its photography business wording, is useful:

1. a short uppercase utility navigation;
2. one enormous declarative masthead;
3. compact numbered section labels;
4. large object titles;
5. small technical metadata and direct rectangular actions.

FOMO keeps all Ukrainian and English product copy in `site/src/i18n.ts`. Event titles,
descriptions, dates, venues, prices, availability, reasons, and URLs must come only from
canonical site data. The UI may label and format that information but must never fill
an unknown fact with promotional text. The reference’s Snapora paragraphs and calls to
action are not reusable FOMO content.

## Layout

### Fixed utility navigation

The slim fixed bar contains the FOMO wordmark, product context, language switcher, and
GitHub link. It uses an opaque paper background and a quiet bottom rule so dense event
information never shows through the controls.

### Masthead

The masthead occupies most of the first viewport. `FOMO` uses the most extreme display
size, while `Côte d’Azur` balances it at the opposite edge. A numbered eyebrow, the
short product statement, and the data freshness timestamp complete the composition.
The hierarchy collapses into a deliberate two-line lockup on mobile.

### Quick views

Quick views form a ruled typographic strip, not a row of rounded pills. Each choice has
an automatic two-digit index. The active item is black with paper text. On narrow
screens the strip scrolls horizontally with ten-rem-wide targets.

### Filters

The filter panel is a white rectangular sheet with black rules and underline-style
fields. It stays sticky on desktop, becomes a two-column sheet at tablet widths, and is
collapsed by default on mobile. Open option menus are solid white, bordered, vertically
bounded, and layered above surrounding content. Native values remain readable at every
state.

### Results and event rows

The results count is a large editorial heading. Events are grouped chronologically and
rendered as numbered ruled rows instead of rounded cards. A row has three desktop
columns: index, date, and event content. Ranking and free status use small rectangular
labels; the main title is condensed and oversized; descriptive text is quiet and
readable; actions are hard-edged black or outlined controls.

`must_go` receives a short black registration mark in addition to its text badge, so
importance never relies on colour alone. Unknown dates, prices, locations, languages,
and sources remain explicit text states.

### Scan history and footer

Run history adapts the reference’s editorial tile pattern to a readable two-column grid,
reducing to one column on mobile. This departure from the four-column reference is
intentional because real scan summaries and warnings are substantially longer than its
testimonial copy. Tiles are numbered and invert on hover. The footer ends with an
oversized FOMO wordmark, followed by the source, verification, privacy, and repository
notes in monospace text.

## Responsive and accessibility rules

- Break the two-column filters/results layout below `70rem`.
- Switch quick views to horizontal scrolling and the compact masthead below `48rem`.
- Keep event title, date, availability, and actions in a logical reading order.
- Do not hide filters on mobile without an explicit button and accurate
  `aria-expanded` state.
- Keep all input values at least `16px` where mobile browser zoom would otherwise harm
  usability.
- Use actual buttons for state changes, links for destinations, and native `details`
  for disclosures.
- Do not communicate ranking, ticket status, selected state, or warnings through colour
  alone.
- Ensure long Ukrainian, French, and English titles wrap without horizontal overflow.

## Non-goals

- Do not copy the reference brand, images, photography copy, Webflow classes, pop-up,
  scripts, or remote template dependencies.
- Do not invent event artwork to imitate the reference image grid.
- Do not reintroduce rounded card systems, colourful “premium” gradients, dashboard
  chrome, soft drop-shadow stacks, or decorative radar graphics.
- Do not put canonical event or discovery logic in the presentation layer.
