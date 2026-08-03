# FOMO Côte d’Azur — design language

This document is the visual source of truth for the public event radar. It is an
adaptation of the UI language in `sample_again.html`, not a copy of that file’s
content, branding, imagery, third-party scripts, or markup.

## Direction: Riviera daybook

The site should feel like a well-made local guide read in a sunlit café: calm,
editorial, warm and useful. It is deliberately light, with generous breathing
room, fine brown rules, confident serif headlines and quiet sans-serif details.
Terracotta is an accent for actions and selected states, never a full-page
background. Information remains the focus; the interface must not imitate a
restaurant menu or rely on decorative photography.

## Typography

| Role               | Family                             | Weight / treatment                        | Use                                                  |
| ------------------ | ---------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Display            | `Playfair Display`, Georgia, serif | 400–500; italic only for a short emphasis | Masthead, section and event titles                   |
| Interface and body | `Manrope`, system-ui, sans-serif   | 300–500                                   | Navigation, filters, metadata, body copy and buttons |
| Small labels       | `Manrope`, system-ui, sans-serif   | 500; uppercase; `0.12em` tracking         | Eyebrows, form labels and status captions            |

Use fluid scales rather than fixed desktop-only sizes. The masthead title may
reach `6rem` on large screens, while section headings live around `2.25rem` and
event names around `1.75rem`. Keep normal reading copy relaxed (`1rem`–`1.0625rem`)
with a line height near 1.65.

## Colour tokens

| Token           | Value                 | Purpose                                          |
| --------------- | --------------------- | ------------------------------------------------ |
| `--paper`       | `#FDFCF8`             | Main page background                             |
| `--paper-warm`  | `#F6F0E7`             | Quiet section and date surfaces                  |
| `--surface`     | `#FFFEFB`             | Cards, panels and floating controls              |
| `--ink`         | `#3E2723`             | Headlines, primary buttons and strong text       |
| `--ink-soft`    | `#5D4037`             | Body text and hover tone for dark buttons        |
| `--muted`       | `#8D6E63`             | Supporting copy and labels                       |
| `--accent`      | `#D84315`             | Active controls, links, focus and small emphasis |
| `--accent-deep` | `#BF360C`             | Accent hover state                               |
| `--latte`       | `#BCAAA4`             | Text selection and subdued decorative detail     |
| `--line`        | `rgb(62 39 35 / 10%)` | Standard dividers and borders                    |
| `--line-quiet`  | `rgb(62 39 35 / 6%)`  | Low-contrast separators                          |

Selected text uses a `--latte` background with white text. Never use low-contrast
cream text on white controls; every filter option and action must remain clearly
readable in its native browser state.

## Layout and surfaces

- The content column is capped at `80rem` with responsive side gutters of
  `1.25rem`–`3rem`.
- The masthead is an airy editorial introduction, not a dark full-screen hero.
  It uses a lightly translucent warm surface, a subtle bottom rule and a soft
  daylight wash in the background.
- Cards are warm-white, bordered with `--line-quiet`, and use an `1.25rem` to
  `1.75rem` radius. Panels can be a little rounder (`2rem`); do not round every
  internal row.
- Use thin, brown hairline rules to create hierarchy. Shadow is restrained:
  a low, warm lift on hover only.
- On desktop, filters occupy a readable left column and remain vertically
  scrollable inside the viewport. They must never create a horizontal scrollbar.
- On small screens, filters begin collapsed and expand on demand. The event list
  always remains usable without opening them.

## Components

### Navigation and language switcher

The header is sticky with a translucent `--paper` backdrop and a soft blur. The
language control is a compact outlined pill; its active option is `--ink` with
light text. The repository link is understated text with a fine underline or
accent underline on hover.

### Quick views and buttons

Quick views are horizontally scrollable pills on narrow screens, without a
visible heavy scrollbar. Inactive pills use a warm surface and fine border;
their active state is dark brown with light text. Primary event actions are
full-round brown buttons. Secondary actions are outlined, light pills. Both use
clear keyboard focus and should never depend on colour alone.

### Filters and custom menus

The filter panel is a warm, paper-like card with a serif heading and understated
uppercase labels. Inputs have a single calm field surface and a `1rem` radius.
Custom option menus are solid light surfaces with dark text, a clear selected
row, and a bounded vertical scroll area. They must open above nearby content,
not be clipped by the panel, and never cause horizontal overflow.

### Event cards

An event card has a soft date block, restrained ranking/free badges, a strong
serif title, practical metadata and straightforward actions. Hovering can lift
the card by a few pixels and strengthen the border/shadow. `must go` events may
receive a terracotta edge or badge, but all ranking levels stay equally legible.

### Empty states and run history

Use the same warm surface and editorial hierarchy. Avoid neon icons, heavy
gradients, faux terminal language and excess decoration. Warnings should be
visibly distinct but calm: a pale terracotta wash and text, not a bright alert.

## Motion and interaction

The reference relies primarily on stillness. FOMO adds only small functional
motion:

- Page content may fade upward once on load (`180–360ms`).
- Buttons, links, pills, menu options and cards transition colour, border,
  shadow and a small transform over `150–220ms ease-out`.
- No looping background animation, parallax, flashing, automatic carousels or
  ornamental motion.
- Under `prefers-reduced-motion: reduce`, disable all non-essential animation
  and smooth scrolling.

## Responsive and accessibility rules

- Preserve a 44px minimum target for touch actions where practical.
- Use visible `:focus-visible` outlines in `--accent`.
- Keep body text and form values at a contrast level suitable for long reading.
- Do not hide essential labels behind hover states.
- Cards may become single-column below `42rem`; date, status and actions must
  remain readable in that order.
- Do not use external UI kits merely to style native controls. The custom menu
  implementation should remain lightweight, accessible and consistent with
  this document.

## Non-goals

- Do not copy restaurant content, food imagery, site identity, analytics,
  scripts or third-party dependencies from `sample_again.html`.
- Do not put operational or canonical event logic in the visual layer.
- Do not turn the public radar into a dashboard, a dark terminal, or a heavily
  animated landing page.
