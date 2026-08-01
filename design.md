# FOMO Côte d’Azur — visual system

This document captures the design language of the current
`sample_to_extract_designmd.html` and the deliberate FOMO adaptation. It is a
design reference only: no source branding, copy, imagery, scripts, or menus are
copied into this project.

## Direction

**Midnight atelier.** FOMO should feel like a considered cultural journal for a
night on the Côte d’Azur: spacious, quiet, editorial, and a little cinematic.
The event data is the subject. Warm gold is used as a small signpost, never as a
signal of an event’s importance or availability.

## Extracted reference system

| Area                 | Reference value or pattern                                                        |
| -------------------- | --------------------------------------------------------------------------------- |
| Body font            | `Jost`, weights 300, 400, 500                                                     |
| Display font         | `Cormorant Garamond`, weights 300, 400, 500; italic 300 and 400                   |
| Page base            | `#0A0A0A`, with close alternates `#080808` and `#0D0D0D`                          |
| Surface              | `#171717` or `rgba(23, 23, 23, 0.2–0.4)`                                          |
| Accent               | `#C5A059` gold; hover `#D6B472`                                                   |
| Hairline borders     | `#171717`, `#262626`, `#404040`; 1 px throughout                                  |
| Text                 | headline `#FAFAFA`; supporting `#D4D4D4`, `#A3A3A3`, `#737373`                    |
| Shape language       | Square, framed, and almost unrounded; circular forms are reserved for icons       |
| Hero display type    | 3 rem mobile, 4.5 rem tablet, 6 rem desktop; `0.9` line-height and tight tracking |
| Section display type | 1.875 rem mobile / 3 rem desktop, normal weight, tight tracking                   |
| UI labels            | 0.75 rem, uppercase, `0.1–0.3em` letter-spacing, medium weight                    |
| Rhythm               | 8 px base: 8, 16, 24, 32, 48, 64, 96, 128 px                                      |
| Content width        | 87.5 rem / 1400 px; 24 px mobile and 48 px desktop gutters                        |

## Extracted interaction language

- Header and controls use colour/border transitions of 150–300 ms with a soft
  ease-out curve.
- Framed cards brighten their border toward gold over 500 ms. Their nested icon
  circles scale to 110%.
- Editorial imagery uses a 5% scale and opacity increase over 700 ms. FOMO does
  not add unverified stock or event images; its cards use the same restrained
  border-and-shadow lift instead.
- Primary actions are flat gold rectangles that brighten to `#D6B472` on hover.
  Secondary actions stay transparent and invert to warm white on hover.
- Text links shift from neutral to gold; the adjacent 2 rem rule shifts at the
  same time.
- The example changes its translucent fixed header from 80% to 95% black after
  50 px of scrolling. FOMO uses a stable opaque reading surface rather than
  adding scroll JavaScript to the data view.

## Motion and background

The reference is photo-led: large restaurant images get dark gradient overlays,
subtle scale treatment, and a small bouncing “discover” affordance.

FOMO mirrors its atmosphere without importing external photographs:

- a fixed, CSS-only midnight gradient supplies a warm lamp-like glow;
- two large, low-contrast framed shapes create depth behind the hero;
- the glow drifts slowly using only `transform` and `opacity`;
- all animation and hover transforms stop under `prefers-reduced-motion`.

There is no canvas, stock photography, parallax plugin, analytics, or third-party
script dependency.

## FOMO token set

```css
--midnight: #0a0a0a;
--midnight-deep: #080808;
--midnight-soft: #0d0d0d;
--surface: #171717;
--surface-quiet: rgba(23, 23, 23, 0.34);
--gold: #c5a059;
--gold-hover: #d6b472;
--ink: #fafafa;
--ink-soft: #d4d4d4;
--muted: #a3a3a3;
--quiet: #737373;
--line: #262626;
--line-strong: #404040;
--focus: #f0d08b;
```

The accent stays at the reference’s exact gold. It is intentionally visual only:
ranking, ticket status, price, and freshness continue to have their own text and
badge treatment.

## Component rules

### Masthead

- The first viewport is an editorial cover: a serif `FOMO Côte d’Azur` title,
  centred-leaning composition, and broad negative space.
- A small uppercase gold eyebrow is flanked by rules. Language and GitHub actions
  remain visible as utility controls at the top of the cover.
- The lede and the data timestamp use light Jost with subdued neutral text.

### Quick views and filters

- Quick views are thin, square outlined controls. The active view uses gold fill
  with dark type.
- The filter rail is a framed, low-contrast panel with concise uppercase labels.
- Inputs are transparent with one clear border. Focus gains a gold border and
  an accessible `--focus` outline.

### Event cards

- Cards are editorial rows with a calm date rail, 1 px border, and generous
  interior spacing.
- Titles use Cormorant Garamond; factual metadata stays in Jost for scanning.
- Hover lifts the card by 2 px, warms its border, and slightly brightens the
  surface. Nothing required to understand an event is hidden on hover.
- `must_go` has a gold date-rim rather than a louder colour field.

### Buttons, links, and focus

- Primary actions are gold rectangles; secondary actions are transparent outlined
  rectangles. Buttons remain at least 44 px high on touch devices.
- Links use neutral text by default, gold on hover, and retain an underline or
  border treatment where needed.
- Keyboard focus always uses a visible warm-gold outline; colour alone is never
  the sole state indicator.

## Responsive and accessibility rules

- The cover retains a minimum 600 px height but scales type with `clamp()` so it
  never overwhelms narrow screens.
- Filters sit above results on small screens and become a sticky left rail at
  70 rem and above.
- Event date rails stack above content below 42 rem.
- Motion is removed for reduced-motion users.
- Decoration is `aria-hidden` and ignores pointer events.
- The dark palette must keep readable contrast for text, borders, and controls.

## Non-goals

- Do not add the restaurant’s photos, name, logo, navigation, testimonials,
  reservation UI, icon library, Tailwind CDN, or its runtime scripts.
- Do not introduce fake event imagery or make a visual accent imply an event is
  verified, free, on sale, or high ranking.
- Do not replace FOMO’s filtering, calendar export, public-data safeguards, or
  Ukrainian/English language switcher.
