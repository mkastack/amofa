export type Category = "Pencils" | "Erasers" | "Sharpeners" | "Notebooks" | "Geometry" | "Art" | "Cases";

export type ProductArt =
  | "abacus-pencil"
  | "ink-eraser"
  | "colour-pencils"
  | "hb-pencils"
  | "pencil-eraser"
  | "sharpener"
  | "exercise-book"
  | "maths-book"
  | "ruler"
  | "geometry-set"
  | "crayons"
  | "pencil-case";

export type ProductPhoto = { src: string; w: number; h: number; alt: string; label: string; position?: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: Category;
  shortDescription: string;
  description: string;
  /** null = not yet confirmed. */
  priceGhs: number | null;
  /** Units available. null = availability not yet confirmed. Sample data for preview. */
  stock: number | null;
  /** Placeholder listing that previews the store; not a confirmed AMOFA product. */
  sample: boolean;
  /** Sample pre-sale price, shown struck through when the product is on a sample deal. */
  compareAtGhs?: number;
  /** Merchandising tags for the shop rows. */
  tags?: ("new" | "pick")[];
  art: ProductArt;
  demo?: "abacus" | "eraser";
  details: [string, string][];
  /** Real product photos or official brand mockups. The first is the card and thumbnail image. */
  photos?: ProductPhoto[];
};

export const categories: Category[] = ["Pencils", "Erasers", "Sharpeners", "Notebooks", "Geometry", "Art", "Cases"];

export const categoryBlurb: Record<Category, string> = {
  Pencils: "Pencils with a new idea inside.",
  Erasers: "Clean corrections, pencil or ink.",
  Sharpeners: "A fresh point, every lesson.",
  Notebooks: "Pages for every subject.",
  Geometry: "Measure, draw, and construct.",
  Art: "Colour for every page.",
  Cases: "Keep the whole kit together.",
};

export const products: Product[] = [
  {
    slug: "iq-pencil",
    name: "AMOFA IQ Pencil™",
    shortName: "IQ Pencil™",
    category: "Pencils",
    shortDescription: "An all-in-one pencil for quick thinking and faster calculation.",
    description:
      "A premium all-in-one pencil with a unique code, designed for quick thinking and faster calculation using the abacus concept. It comes pre-sharpened with an eraser, in boxes of 12 labelled “The Abacus Pencil”.",
    priceGhs: 12,
    stock: 64,
    sample: false,
    art: "abacus-pencil",
    demo: "abacus",
    tags: ["new", "pick"],
    details: [["Concept", "Abacus counting for faster calculation"], ["Pack", "Box of 12 pencils"], ["Finish", "Pre-sharpened, with eraser"], ["Identity", "Unique ID code, AMOFA name and logo"], ["Colours", "Variety of colours"]],
    photos: [
      { src: "/images/products/iq-pencil-card.jpg", w: 1500, h: 1200, label: "Pencil design", alt: "Two navy AMOFA IQ Pencils with the gold AMOFA mark and numbered abacus dots, from the AMOFA brand guide" },
      { src: "/images/about/brand/packaging.jpg", w: 1800, h: 1080, label: "The box", alt: "The AMOFA “Abacus Pencil” box of 12, with a colourful African-pattern top and base" },
      { src: "/images/about/product/iq-pencil-display-wide.jpg", w: 2000, h: 1404, label: "In person", alt: "AMOFA IQ Pencil boxes on a glass table beside a gold bowl of colourful pencils" },
      { src: "/images/about/product/iq-pencil-boxes.jpg", w: 1400, h: 1560, label: "Close-up", position: "center 72%", alt: "Open AMOFA IQ Pencil boxes with red, blue, and green pencils" },
    ],
  },
  {
    slug: "dual-eraser",
    name: "AMOFA Dual Eraser™",
    shortName: "Dual Eraser™",
    category: "Erasers",
    shortDescription: "One eraser for pencil and ink.",
    description:
      "The AMOFA Dual Eraser™ is part of AMOFA’s first stationery collection, created by founder Nana Kofi Amofa. Specifications, materials, and use guidance will be added when confirmed.",
    priceGhs: 7.5,
    stock: 85,
    sample: false,
    art: "ink-eraser",
    demo: "eraser",
    tags: ["new"],
    details: [["Product idea", "One eraser for pencil and ink"], ["Materials", "To be confirmed"], ["Dimensions", "To be confirmed"]],
  },
  {
    slug: "colour-pencils-12",
    name: "AMOFA Colour Pencils, 12 Pack",
    shortName: "Colour Pencils, 12 Pack",
    category: "Pencils",
    shortDescription: "Twelve bright colours for maps, diagrams, and art.",
    description: "A sample listing for a 12-colour pencil pack, sized for the school pencil case.",
    priceGhs: 35,
    compareAtGhs: 42,
    stock: 42,
    sample: true,
    tags: ["pick"],
    art: "colour-pencils",
    details: [["Pack size", "12 colours"], ["Barrel", "Hexagonal"], ["Best for", "Art and diagrams"]],
  },
  {
    slug: "hb-pencils-10",
    name: "AMOFA HB Pencils, 10 Pack",
    shortName: "HB Pencils, 10 Pack",
    category: "Pencils",
    shortDescription: "Everyday writing pencils with eraser tips.",
    description: "A sample listing for a ten-pencil pack of everyday HB writing pencils.",
    priceGhs: 18,
    compareAtGhs: 22,
    stock: 128,
    sample: true,
    tags: ["pick"],
    art: "hb-pencils",
    details: [["Pack size", "10 pencils"], ["Grade", "HB"], ["Tip", "Eraser top"]],
  },
  {
    slug: "soft-pencil-eraser",
    name: "AMOFA Soft Pencil Eraser",
    shortName: "Soft Pencil Eraser",
    category: "Erasers",
    shortDescription: "A gentle eraser for pencil work.",
    description: "A sample listing for a soft white eraser for everyday pencil corrections.",
    priceGhs: 3.5,
    stock: 260,
    sample: true,
    tags: ["pick"],
    art: "pencil-eraser",
    details: [["Pack size", "1 eraser"], ["Best for", "Pencil and graphite"], ["Sleeve", "Card sleeve"]],
  },
  {
    slug: "twin-sharpener",
    name: "AMOFA Twin Sharpener",
    shortName: "Twin Sharpener",
    category: "Sharpeners",
    shortDescription: "Two hole sizes for standard and jumbo pencils.",
    description: "A sample listing for a two-hole sharpener for standard and jumbo pencils.",
    priceGhs: 6.5,
    stock: 4,
    sample: true,
    tags: ["new"],
    art: "sharpener",
    details: [["Holes", "Standard and jumbo"], ["Body", "Moulded plastic"], ["Pack size", "1 sharpener"]],
  },
  {
    slug: "exercise-book-80",
    name: "AMOFA Exercise Book, 80 Pages",
    shortName: "Exercise Book, 80 Pages",
    category: "Notebooks",
    shortDescription: "Ruled pages with a margin, ready for class.",
    description: "A sample listing for an 80-page ruled exercise book with a name-and-subject label.",
    priceGhs: 9,
    stock: 200,
    sample: true,
    tags: ["pick"],
    art: "exercise-book",
    details: [["Pages", "80, ruled with margin"], ["Cover", "Card with label"], ["Size", "Standard school"]],
  },
  {
    slug: "maths-book-60",
    name: "AMOFA Maths Book, Squared, 60 Pages",
    shortName: "Maths Book, 60 Pages",
    category: "Notebooks",
    shortDescription: "Squared pages for sums, tables, and graphs.",
    description: "A sample listing for a 60-page squared maths book.",
    priceGhs: 8,
    stock: 38,
    sample: true,
    tags: ["new"],
    art: "maths-book",
    details: [["Pages", "60, squared"], ["Cover", "Card with label"], ["Best for", "Maths and graphs"]],
  },
  {
    slug: "ruler-30cm",
    name: "AMOFA 30 cm Ruler",
    shortName: "30 cm Ruler",
    category: "Geometry",
    shortDescription: "A clear ruler with centimetre markings.",
    description: "A sample listing for a clear 30 cm ruler.",
    priceGhs: 5,
    stock: 75,
    sample: true,
    tags: ["pick"],
    art: "ruler",
    details: [["Length", "30 cm"], ["Markings", "Centimetres and millimetres"], ["Body", "Clear plastic"]],
  },
  {
    slug: "geometry-set",
    name: "AMOFA Geometry Set",
    shortName: "Geometry Set",
    category: "Geometry",
    shortDescription: "Everything for construction lessons, in one tin.",
    description: "A sample listing for a geometry set in a metal tin.",
    priceGhs: 32,
    compareAtGhs: 38,
    stock: 16,
    sample: true,
    tags: ["pick"],
    art: "geometry-set",
    details: [["Includes", "Compass, protractor, set squares, ruler"], ["Case", "Metal tin"], ["Best for", "Mathematics"]],
  },
  {
    slug: "wax-crayons-16",
    name: "AMOFA Wax Crayons, 16 Colours",
    shortName: "Wax Crayons, 16 Colours",
    category: "Art",
    shortDescription: "Bold colours for young artists.",
    description: "A sample listing for a box of 16 wax crayons.",
    priceGhs: 15,
    compareAtGhs: 18,
    stock: 3,
    sample: true,
    art: "crayons",
    details: [["Pack size", "16 colours"], ["Type", "Wax crayons"], ["Box", "Flip-top card box"]],
  },
  {
    slug: "zip-pencil-case",
    name: "AMOFA Zip Pencil Case",
    shortName: "Zip Pencil Case",
    category: "Cases",
    shortDescription: "A roomy zip case for the whole kit.",
    description: "A sample listing for a zip pencil case that holds pencils, erasers, and a ruler.",
    priceGhs: 28,
    compareAtGhs: 34,
    stock: 0,
    sample: true,
    art: "pencil-case",
    details: [["Closure", "Zip"], ["Fits", "Pencils, erasers, sharpener"], ["Material", "Woven fabric"]],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(priceGhs: number | null): string {
  if (priceGhs === null) return "Price to be confirmed";
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(priceGhs);
}

export type StockState = "unknown" | "sold-out" | "low" | "in-stock";

export function stockState(stock: number | null): StockState {
  if (stock === null) return "unknown";
  if (stock <= 0) return "sold-out";
  if (stock <= 5) return "low";
  return "in-stock";
}

export function stockLabel(stock: number | null): string {
  const state = stockState(stock);
  if (state === "unknown") return "Availability to be confirmed";
  if (state === "sold-out") return "Sold out";
  if (state === "low") return `Only ${stock} left`;
  return "In stock";
}

/** Plain-hyphen text for search and metadata. */
export function plainText(text: string): string {
  return text.replace(/‑/g, "-");
}

export function savingGhs(product: Product): number {
  return product.compareAtGhs && product.priceGhs !== null ? Math.max(0, product.compareAtGhs - product.priceGhs) : 0;
}

export const onDeal = (product: Product) => savingGhs(product) > 0;

