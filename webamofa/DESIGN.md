---
name: AMOFA Store
description: An Apple Store-led stationery shop for Ghana, lit with plug.tech-style AMOFA blue fields.
colors:
  warm-paper: "#F7F6F2"
  graphite-ink: "#24272B"
  amofa-blue: "#315CBB"
  amofa-blue-deep: "#264C9F"
  stone-surface: "#E9E7E1"
  card-white: "#FFFFFF"
  hairline: "#DFDED8"
  graphite-secondary: "#5C6066"
  graphite-tertiary: "#767A80"
  footer-stone: "#EFEDE7"
  control-border: "#8E9196"
  disabled-fill: "#D4D3CE"
  disabled-ink: "#676B70"
  blue-900: "#142B5E"
  heading-navy: "#1C3A7C"
  blue-300: "#9DB6EC"
  blue-200: "#C9D6F0"
  blue-150: "#DCE5F7"
  blue-100: "#E6ECF8"
  sun-bead: "#F4B841"
  on-dark-muted: "#C9CBCF"
  stock-in: "#1E7A46"
  stock-low: "#A4590B"
  error: "#B3261E"
  error-soft: "#FBE9E7"
typography:
  display:
    fontFamily: "Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(56px, 6vw, 80px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(34px, 4.6vw, 56px)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(24px, 2.3vw, 28px)"
    fontWeight: 600
    lineHeight: 1.143
    letterSpacing: "0.004em"
  body:
    fontFamily: "Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.012em"
  label:
    fontFamily: "Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.012em"
rounded:
  control: "12px"
  tile: "20px"
  stage: "28px"
  pill: "980px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  shelf-gap: "20px"
  card-padding: "28px"
  container: "1160px"
  nav-height: "44px"
components:
  button-primary:
    backgroundColor: "{colors.amofa-blue}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.amofa-blue-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.amofa-blue}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  button-on-blue:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.amofa-blue-deep}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  button-disabled:
    backgroundColor: "{colors.disabled-fill}"
    textColor: "{colors.disabled-ink}"
  shelf-card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.stage}"
    padding: "28px"
    width: "400px"
    height: "500px"
  shelf-card-tone-blue:
    backgroundColor: "{colors.blue-100}"
  shelf-card-tone-stone:
    backgroundColor: "{colors.stone-surface}"
  quick-link-pill:
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 15px"
    height: "38px"
  field:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.control}"
    padding: "24px 16px 8px"
    height: "56px"
  chip:
    backgroundColor: "{colors.stone-surface}"
    textColor: "{colors.graphite-secondary}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: AMOFA Store

## Overview

**Creative North Star: "Lit Objects on Quiet Shelves"**

The AMOFA Store borrows its structure from apple.com/store and its colour energy from plug.tech, with Apple leading. Two stationery products sit as lit objects on warm off-white shelves: big tinted cards with drawn concept renders that bleed off the bottom edge, side-scrolling rows, a confident "Store" title, and a row of product icons at one object weight. The shelf geometry was measured from the live Apple Store (400 by 500 cards, 28px radius, a soft 2px 4px 12px shadow, 28px padding, 20px gaps, a 1160px container that gives a 140px inset at 1440).

Plug's contribution is saturated AMOFA blue, used as full-bleed fields at the moments that sell: the announcement gradient, the demo stage where visitors slide abacus beads and erase ink, the promo tiles, and the newsletter band. Between those fields the page stays quiet: paper, graphite type, hairline dividers, and one blue for actions.

The system is honest about what is unconfirmed. Every pending fact (price, renders, Mobile Money, delivery) carries an Apple-style superscript footnote that resolves to a numbered list in the footer. The design never shows a payment, order, signup or message as successful.

**Key Characteristics:**
- Warm paper ground (#F7F6F2) with white, blue-tinted, and stone-tinted shelf cards.
- Two-tone headings: a navy lead phrase, then a gray continuation.
- One action blue in pill-shaped controls; blue-gradient fields at the selling moments.
- Drawn, logo-free concept renders that bleed off card edges.
- Numbered footnotes carry every pending fact.
- Calm ease-out motion; a slight settle on the abacus beads only.

## Colors

A warm neutral paper-and-graphite base with one saturated AMOFA blue and its derived navy ramp.

### Primary
- **AMOFA Blue** (#315CBB): the official accent. Primary buttons, links and chevron links, the focus ring, the bag count badge, the abacus count, checked states, and the bright end of every blue field gradient.
- **AMOFA Blue Deep** (#264C9F): accent hover and the mid stop of the stage and newsletter gradients. Text colour of the white button that sits on blue fields.
- **Heading Navy** (#1C3A7C): the lead phrase of every two-tone heading ("Store", shelf titles, page titles, the tagline) and the dark end of every blue field gradient.
- **Blue 900** (#142B5E): text on pale blue notices (form alerts, storage warning) and selection text.

### Secondary
- **Blue 200** (#C9D6F0): the continuation phrase in headings set on blue fields, the 3px focus halo on fields, ruled lines on the ink-paper demo, and text selection.
- **Blue 150** (#DCE5F7): body and status text on blue fields.
- **Blue 100** (#E6ECF8): the tone-blue shelf card, the pencil category tile, the About band, help-icon wells, and pale notices.

### Tertiary
- **Sun Bead** (#F4B841): the counted beads in the abacus renders and the single bead in the brand mark. It is a bead colour only.

### Neutral
- **Warm Paper** (#F7F6F2): page background, translucent nav (at 80% with blur), flyouts, render wells and the abacus track.
- **Card White** (#FFFFFF): default shelf cards, demo cards, bag summary, info cards, inputs.
- **Stone Surface** (#E9E7E1): the tone-stone shelf card, the eraser category tile, chips.
- **Footer Stone** (#EFEDE7): the footer band.
- **Graphite Ink** (#24272B): body text, the dark promo tile, the quick-link pill border, the "added" state of the primary button.
- **Graphite Secondary** (#5C6066): descriptions, captions, footer text, field labels.
- **Graphite Tertiary** (#767A80): the gray continuation of two-tone headings. Large text only (24px and up).
- **Hairline** (#DFDED8): dividers, list rules, FAQ rows, footer rules.
- **Control Border** (#8E9196): input, stepper and payment-option strokes (3:1 against white).
- **Disabled Fill / Ink** (#D4D3CE / #676B70): disabled buttons.

### Named Rules
**The Two-Tone Heading Rule.** A heading opens with a short lead phrase in Heading Navy and continues in Graphite Tertiary ("The latest. Take a look at what's new from AMOFA."). On blue fields the lead is white and the continuation is Blue 200.

**The Blue Field Rule.** Saturated blue arrives only as full fields: the announcement gradient (navy to blue), the demo stage (deep to navy), the promo tiles (blue to navy at 165deg), and the newsletter band (navy to blue at 115deg). Everything else stays on paper, and AMOFA Blue appears there only as actions and links.

**The Bead-Only Sun Rule.** Sun (#F4B841) fills beads and nothing else: never text, button fills, borders, badges or states.

## Typography

**Display Font:** Mona Sans, self-hosted variable (weights 200 to 900, widths 75 to 125%; with Helvetica Neue, Helvetica, Arial)
**Body Font:** Mona Sans (same stack)

**Character:** A single humanist grotesk carries everything, with Apple Store sizing: big, tight 600-weight titles and calm 17px body copy with slight negative tracking.

### Hierarchy
- **Display** (600, clamp 56 to 80px, 1.05, -0.015em): the "Store" page title, in Heading Navy.
- **Headline** (600, clamp 34 to 56px, about 1.06, -0.03em): stage titles, page titles, section and newsletter headings, product names on buy pages. Every heading in the system is weight 600, as measured on the Apple Store.
- **Title** (600, clamp 24 to 28px, 1.143, +0.004em): shelf headings and shelf card titles, both measured at 28px on the Apple Store. The store tagline uses the same size, right-aligned.
- **Body** (400, 17px, 1.47, -0.012em): running text. Descriptions hold to about 32 to 68ch.
- **Label** (400, 12px): global nav links (12px on a 44px line), footer and footnotes. Small UI text runs at 13 to 15px.

### Named Rules
**The Measured Store Rule.** Store-derived roles keep their measured sizes: the 80px/600 "Store" title, 28px/600 shelf headings and card titles, 12px nav links. Do not round them toward a generic scale.

**The No Eyebrow Rule.** Headings stand alone. Nothing small or uppercase sits above a heading to introduce it.

## Layout

Content sits in a 1160px container with a fluid gutter (clamp 16 to 40px). The global nav and footer use a narrower 1024px measure, as on the Apple Store. Shelves scroll sideways with scroll snap, a 20px gap between cards, and padding that keeps the first card aligned with the container edge (an inset of max(gutter, (100% - 1160px) / 2)). Round paddle buttons sit beneath each shelf. Vertical rhythm between sections is fluid, typically clamp(40px, 5vw, 64px) between shelves and up to 120px before the FAQ and the newsletter.

Breakpoints are 1068px (stage, buy, bag and checkout grids collapse to one column; benefits go to two columns), 833px (nav links become a menu toggle; the Store intro stacks left-aligned; category tiles stack; footer goes to two columns) and 600px (card padding tightens to 24px by 22px, tall cards become min(84vw, 340px) by 470px, forms go to one column).

## Elevation & Depth

Depth is soft and ambient, measured from the Apple Store. Cards rest on a faint shadow and lift slightly on hover. Blue fields and tinted cards carry hierarchy through colour, not shadow.

### Shadow Vocabulary
- **Store card** (`box-shadow: 2px 4px 12px rgb(0 0 0 / 8%)`): every shelf and grid card at rest.
- **Store card hover** (`box-shadow: 2px 4px 16px rgb(0 0 0 / 16%)`): with `scale(1.01)` on hover.
- **Ambient card** (`box-shadow: 0 4px 14px rgb(36 39 43 / 6%)`): the benefits strip.
- **Ambient card hover** (`box-shadow: 0 14px 34px rgb(36 39 43 / 12%)`): category tiles on hover.
- **Panel** (`box-shadow: 0 24px 48px -16px rgb(36 39 43 / 22%)`): the nav flyout and the bag and saved dialogs.
- **Demo card on blue** (`box-shadow: 0 30px 60px -30px rgb(10 20 50 / 45%)`): white demo cards on the blue stage.

### Named Rules
**The Quiet Lift Rule.** Hover lifts a card by 1% scale and a deeper soft shadow over 0.5s ease-out. No offset or hard-edged shadows. Touch devices skip the lift.

## Shapes

Corners are generously rounded and come from four radii: 12px for inputs, selects and payment options; 20px for dialogs, the benefits strip and the bag summary; 28px for shelf cards, category tiles, the demo card, the buy gallery and the About band; and full pills (980px) for every button, quick link, segmented control, stepper and chip. Small round controls (nav icons, paddles, save hearts, steppers) are circles. Product renders are clipped by their card and bleed past its lower edge.

## Components

### Buttons
Confident blue pills, Apple-sized.
- **Shape:** full pill (980px), 44px tall (34px small, 52px on buy and checkout).
- **Primary:** AMOFA Blue with white text, 0 22px padding, 17px weight 500. Turns graphite when an item has been added.
- **Hover / Focus:** hover deepens to AMOFA Blue Deep over 0.2s; press scales to 0.97; focus is a 2px AMOFA Blue outline at 3px offset (white on blue fields).
- **Secondary:** transparent with a 1px AMOFA Blue border and blue text; fills blue on hover.
- **On blue:** a white pill with Blue Deep text, used on the newsletter band; hover goes to Blue 100.
- **Chevron link:** blue text with a trailing chevron that slides 3px right on hover.

### Chips
- **Style:** Stone Surface pill, 12px weight 550, secondary text. Marks status such as "Planned" on payment options.

### Cards / Containers
- **Corner Style:** 28px.
- **Background:** white, tone-blue (Blue 100, used for pencils) or tone-stone (Stone Surface, used for erasers). Promo tiles use the blue gradient or graphite.
- **Shadow Strategy:** Store card shadow at rest, Store card hover on hover (see Elevation).
- **Border:** none.
- **Internal Padding:** 28px (24px by 22px under 600px). Tall shelf cards are 400 by 500 at desktop.
- **Render bleed:** product art fills the lower card and is pushed past the bottom edge with negative margins equal to the padding.

### Inputs / Fields
- **Style:** white, 1px Control Border stroke, 12px radius, 56px tall, with a floating label that shrinks to 72% when filled.
- **Focus:** border turns AMOFA Blue with a 3px Blue 200 halo.
- **Newsletter input:** a 52px white pill with no border, set on the blue band.

### Navigation
- **Announcement:** a 40px gold-to-yellow gradient strip (brand gold #E0A400 → #FFF669 → #FFBE0E) in navy 13px text, with previous/next controls.
- **Global nav:** 44px, sticky, AMOFA navy at 90% (`rgb(14 28 52 / 90%)`) with saturate and blur, a hairline bottom rule. Gold logo icon and white wordmark at left, 12px links in white at 82% (full white and 600 when current), then search, saved and bag icon buttons with a gold count badge. Flyouts, search and the mobile menu drop full-width on the same navy. (Changed from warm paper on 2026-11-17 at the owner's request; see "Navy Header, Footer and Unveiling".)
- **Mobile (833px and down):** links fold into a menu toggle that opens a full-screen menu of 28px primary links.
- **Quick links:** 38px pills with a 1px graphite border, 14px text; hover turns border and text blue.

### Footnotes
An Apple-style footnote system. A small superscript number (0.62em) links to a numbered list at the top of the footer: 1 price, 2 concept renders and demos, 3 Mobile Money, 4 delivery. The targeted note darkens to graphite.

### Demo Stage (signature)
A full-bleed blue gradient field holding a white demo card. The **abacus bead slider** works by pointer and keyboard (arrow keys, Home, End). Its beads move on `--ease-bead` (cubic-bezier(.3, 1.22, .5, 1), 0.58s), a slight settle on the rod, beside a large blue tabular count. The **ink-erasing canvas** is ruled notebook paper (Blue 200 lines and a red margin) that you drag an eraser cursor across.

## Do's and Don'ts

### Do:
- **Do** set shelf cards at 400 by 500, 28px radius, 28px padding, 20px gaps, with the Store card shadow.
- **Do** write every heading in two tones: navy lead phrase, gray continuation (Graphite Tertiary at 24px and above only).
- **Do** reserve saturated blue for the four field types (announcement, demo stage, promo tiles, newsletter) and for actions and links.
- **Do** tint product cards by category, tone-blue for pencils and tone-stone for erasers, and let the render bleed off the bottom edge.
- **Do** attach a numbered footnote to every pending fact (price, renders, Mobile Money, delivery).
- **Do** label every concept render as a concept render, not a photograph, in its accessible name and with footnote 2.
- **Do** use ease-out (cubic-bezier(.16, 1, .3, 1)) for UI motion and respect prefers-reduced-motion everywhere, in CSS and in scripted scrolling and demos.

### Don't:
- **Don't** show a payment, order, signup or message as successful; status copy says nothing was stored or sent.
- **Don't** put eyebrow or kicker labels above headings.
- **Don't** show competitor or third-party branding in product imagery; renders are drawn and logo-free.
- **Don't** use Sun (#F4B841) for any UI element; it is a bead colour.
- **Don't** use the bead settle easing on anything but the abacus beads.
- **Don't** use Graphite Tertiary (#767A80) for text under 24px.

## Catalogue and Stock (added 2026-11-16)

**Catalogue card.** The compact product card follows Apple's accessory-card proportions: a white card at the 28px store radius and store shadow, the concept render on a quiet field (aspect 1 / 0.8), then name (17px/600), price (14px) with its footnote, stock state, and a small Add to bag pinned to the bottom. Grids use `repeat(auto-fill, minmax(248px, 1fr))` with 20px gaps on desktop and two columns with 12px gaps on phones. Sold-out cards mute the render (55% opacity, 40% greyscale) and disable the action as "Sold out".

**Stock states.** Availability always sits under the price, never above the name (the No Eyebrow Rule). In stock: Stock Green #1E7A46 with a filled dot. Only N left (5 or fewer): Stock Amber #A4590B with a filled dot. Sold out: secondary graphite with a hollow dot. Availability to be confirmed: secondary graphite with a help icon. These are the only non-blue hues in the UI, and they are reserved for stock state. Quantity steppers cap at the units in stock.

**Sample data.** Sample listings carry footnote 5 on their price. Real AMOFA products keep footnote 1 ("to be confirmed").

**Filters.** Category filters are pill chips (38px, 1px hairline, graphite fill when pressed) with a count badge, in a row that scrolls sideways. "In stock only" is a switch inside a 44px control field.

## Global Nav Motion (measured on apple.com, 2026-11-16)

- **Flyout panel.** One persistent panel under the 44px bar. Its height transitions over `.242s var(--ease-nav)`, where `--ease-nav` is `cubic-bezier(.4, 0, .6, 1)`. Moving between menus resizes it without closing it.
- **Backdrop.** The page behind gets a backdrop of `rgb(233 231 225 / 40%)` with a 20px blur, fading in over .32s after a .08s delay.
- **Entrance.** Each column label and link enters with `nav-item-in`: from 4px above and transparent, over .32s.
- **Stagger.** Labels start at .08s, .16s and .20s by column. Links start at .12s, .18s and .22s by column and step .02s apart.
- **Close.** Closing fades the content over .24s with no stagger.
- **Hover intent.** The first open waits 70ms; switching between open menus is instant.
- **Link colour.** Nav and flyout links shift from 80–88% graphite to full graphite over .32s.
- **Layout.** Columns pack to the left with 44px gaps. The first column uses 24px/600 links on 38px rows; the others use 12px/600 links on 24px rows, under 12px secondary labels.
- **Mobile menu.** Items use the same entrance at a 30ms stagger.

## Shop Homepage and Test Checkout (added 2026-11-17)

**Homepage.** The homepage is now a classic online shop, laid out in this order:
1. Hero row: a 2:1 grid. On the left, the blue gradient campaign banner (28px radius) with the headline "Back to school, sorted.", white Shop now pill, a See deals link, and a still life of five product renders. On the right, two promo tiles (stone and blue-100) with renders bleeding off the corner.
2. Benefits strip.
3. Shop-by-category cards: seven white cards with render, name, and item count.
4. Deals shelf.
5. New from AMOFA shelf (the tall Apple-measured tiles).
6. Top picks grid.
7. Blue demo stage.
8. FAQ, newsletter, quick links.

**Sale prices.** The sale price is set in Blue 700 at weight 600, followed by the struck-through old price in secondary graphite. Cards carry a "Save GH₵X" pill (blue 600) or a "New" pill (graphite) at the image's top-left corner, never above the name.

**Shop sidebar.** At 1068px and wider, the shop is a 220px sticky filter sidebar plus results. The sidebar holds category and price-band options as quiet list buttons (selected option = white chip with soft shadow) and Deals only / In stock only switches. Below 1068px, the sidebar gives way to the chip row and inline switches.

**Checkout.** Three steps: Delivery, Payment, Approve. A numbered step indicator sits beside the title; the sequence is information, so it earns numbers.
- **Test banner:** a blue-100 band opens every checkout and confirmation screen.
- **Delivery and provider choices:** radio cards with the control-border outline and an accent ring when selected.
- **Validation:** errors use Error #B3261E text and a matching border.
- **Approve:** a white panel with a pulsing phone tile, a countdown in Blue 700, and simulate approve / decline actions.
- **Confirmation:** a green check, a two-tone "Thank you" headline, and two white cards (order facts, items and totals).

## About Page: AMOFA Brand Identity (added 2026-11-17)

`/about` is the one surface set in the owner's brand identity rather than the store system. Scope:
- **Scoping:** the brand tokens live under `.amo` in `app/about/about.css`. Open Sans loads through `next/font/local` in `app/about/page.tsx`, so no other route downloads it.
- **Palette:** navy #0E1C34 fields alternate with the store's paper ground. Gold #FFBE0E is used for fills only, never text on light grounds (it fails contrast there). Light yellow #FFF669 carries headline continuations on navy and the product quote card.
- **Logo:** the logo icon (`public/images/about/brand/logo-icon.png`) is extracted from the brand PDF with true alpha. The lockup sets "AMOFA" in Open Sans Bold at .32em tracking over "Write It, Own It" at .18em, as on brand guide page 2.
- **Photography:** all photos are the owner's own, served through `next/image`, with origins in `public/images/about/SOURCES.md` and embedded in each file.

## Real Logo and Product Imagery (added 2026-11-17)

- **Navbar and footer logo:** the navbar shows AMOFA's real logo: the gold ribbon icon (30px tall) beside the “AMOFA” wordmark, extracted from the brand PDF and recoloured navy #0E1C34 (13px tall).
  - `BrandMark` now renders the real icon everywhere, footer included.
  - `app/icon.png` and `app/apple-icon.png` show the icon on an AMOFA navy rounded square.
- **Photos instead of renders:** products with `photos` render real images in place of concept renders.
  - Cards, tiles, and thumbnails crop the first photo full-bleed (object-fit cover, on a navy ground).
  - The product gallery switches between photos by label.
  - Only the AMOFA IQ Pencil™ has photos (the brand-guide pencil design, the box mockup, two owner photos); everything else is still a labelled concept render.
  - The navbar and footer wordmark is now the white recolour (`logo-wordmark-white.png`); the navy one is kept for light grounds.

## Navy Header, Footer and Unveiling (added 2026-11-17)

The owner asked for the logo colours on the navbar and footer. The store body keeps the blue palette; the chrome takes the brand identity.
- **Tokens:** `--brand-navy #0E1C34`, `--brand-navy-2 #12264A`, `--brand-gold #FFBE0E`, `--brand-gold-deep #E0A400`, `--brand-yellow #FFF669`, `--on-navy-muted #B8C1D3` in `app/tokens.css`.
- **Footer:** navy ground. A lockup (gold icon, white AMOFA wordmark, "Write It, Own It" in yellow) sits above yellow column headings, muted link text and white hover. Footnotes stay at the top in muted text.
- **IQ Pencil™ unveiling** (`components/pencil-unveil.tsx`, on `/products/iq-pencil#unveil`): a scroll-driven, Blender-style design review in three.js, built from the brand-guide pencil mockup.
  - Stages: wireframe on a viewport grid with red/green axes → clay → a gold scanline render sweep → a close-up of the number and abacus dots → exploded parts with labels → the hero pair "5" and "10" with a contact shadow and the gold ribbons at the frame edges, as in the mockup.
  - Proportions follow the mockup (about 1:21). The barrel print is a canvas texture with the real wordmark and icon; it is drawn pre-stretched by 1/SLIM so it stays true on the slimmed barrel.
  - Framing is computed, not fixed. Each wide shot is pushed back until the pencil fits the area between the stage HUD and the captions; phones reserve the bottom 31% for the caption and fade the scene there with a mask.
  - Landscape lays the exploded view eraser-right so the print reads left to right, with labels alternating above and below. Narrow screens explode vertically with labels to the right.
  - Reduced motion renders the final frame only, in a 100svh section. Without WebGL, the section shows the brand mockup photo. The render loop only runs while the section is near the viewport.

