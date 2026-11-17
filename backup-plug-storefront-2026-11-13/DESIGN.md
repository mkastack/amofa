---
name: AMOFA Storefront
description: Plug-style retail interface adapted to AMOFA stationery.
colors:
  primary: "#173f43"
  foreground: "#092326"
  background: "#ffffff"
  muted: "#52666a"
  surface: "#e6f0ed"
  border: "#dce3e1"
  accent: "#b6570a"
typography:
  display:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "67px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
rounded:
  card: "14px"
  media: "16px"
  button: "999px"
spacing:
  compact: "16px"
  medium: "24px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.button}"
    height: "46px"
---
# AMOFA Design System

## Overview
User direction: upgrade the full UI to closely match plug.tech, adapted to AMOFA, with real images. The reference was inspected in a live browser. The resulting interface uses compact retail navigation, teal controls, gradient campaign surfaces, photography, and clear shopping paths.

## Colors
Deep teal controls and text sit on white and pale mint surfaces. The announcement strip transitions from #f3cf45 to #4dbda6. Orange #ef882a identifies the current carousel slide.

## Typography
Use self-hosted Space Grotesk for headings and Inter for UI/body copy, matching the inspected reference. Desktop heading sizes are 67px for hero/brand/FAQ, 52px for section titles, and 28px for category cards, at weight 700. Mobile uses 32px and 28px headline sizes and 19.5px category headings. Body text is 16px desktop and 14px in mobile supporting copy.

## Layout
Desktop navigation occupies a 60px row below a 54px announcement strip. The homepage follows the measured full reference: 720px campaign; 89px benefits strip; 720px category section; 1017px angled teal product carousel; roughly 1010px tabbed picks; 910px white brand split; notes; community media; panoramic banner; centered FAQ; journal; gradient newsletter; service strip; dense footer. Desktop category cards are 480px tall with three visible across a horizontal track. At 760px categories become a two-column grid of 335px cards, product rows scroll horizontally, brand content stacks, and a persistent mobile search row appears. The mobile campaign is 605px tall. Product pages stack photography before details.

## Elevation & Depth
Product cards use restrained borders and low diffuse shadows. Search and category panels use a downward shadow. Cart and saved products use native modal dialogs with dimmed backdrops.

## Shapes
Shopping controls are rounded pills. Category cards and brand media use 24px corners; product and journal cards use 16–18px. Hero stationery is a transparent photographic cutout, placed directly on the campaign background.

## Components
Navigation includes category menus, persistent mobile search, an inline desktop search panel, cart and saved-products drawers. Product hearts persist a saved list locally. Search filters the small catalog and supports a query URL. The hero has three slides, manual selection, pause/play, and respects reduced motion. Product galleries have reference and inspiration views. Existing cart persistence, checkout preview, contact form, and information pages are retained.

## Do's and Don'ts
Use actual product facts from PRODUCT.md. Current real photographs are stationery references, with visible disclosure; replace them with official AMOFA product images when available. Do not present reference stationery as AMOFA products or import Plug's inventory, ratings, discounts, warranty, or delivery claims. Payment and newsletter integrations remain explicitly unavailable.
