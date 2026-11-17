# Photography sources

Real stationery photographs downloaded from Unsplash on 2026-11-13. These are reference imagery, not photographs of AMOFA products.

- stationery.jpg: Nik, https://unsplash.com/photos/NP-ANwG4gI8 — https://images.unsplash.com/photo-1517237284472-3b62e4863e4b
- pencils.jpg: https://images.unsplash.com/photo-1518826778770-a729fb53327c
- desk.jpg: https://unsplash.com/photos/yMXrQl0aW3c — https://images.unsplash.com/photo-1661732017117-66f0a46bf1c1

Replace with official AMOFA product photography when supplied. Captions and alt text disclose the reference status.

Heading typography matches the reference's Space Grotesk family. The variable font is self-hosted at `/fonts/SpaceGrotesk.ttf`, downloaded from https://github.com/google/fonts/tree/main/ofl/spacegrotesk under the SIL Open Font License; the license ships alongside it.

## Transparent hero edit

- `stationery-cutout.png` is a background-extraction edit of `stationery.jpg`, made with the built-in image tool. It remains reference imagery, not an AMOFA product photo.
- Prompt: "Use case: background-extraction. Edit the provided real photograph for an ecommerce website hero. Remove ONLY the white/gray tabletop background, leaving a genuinely transparent alpha background. Keep the photographed red pencil case, all pencils, markers, pens, and the white eraser exactly as they appear: their real details, colors, material textures and existing arrangement. Fit the complete visible object group within the output canvas without cutting off any more than the source already does, with a small transparent margin. Keep crisp, accurate photographic edges and subtle natural shadows at the object boundaries. Do not add new objects, lettering, logos, branding, illustrations, gradients or a replacement scene. This is a faithful cutout of the source photograph, not a new product design."
- UI typography also uses self-hosted Inter from https://github.com/google/fonts/tree/main/ofl/inter under the SIL Open Font License; the license ships in `/fonts/Inter-LICENSE.txt`.

- `pencils-cutout.png` and `eraser-cutout.png` are photo-based extraction edits made with the built-in image tool from `pencils.jpg` and `stationery.jpg`. Exact edit prompts are in `EDIT-PROMPTS.json` and embedded in the PNG metadata. These remain reference images, not official AMOFA product photographs.
