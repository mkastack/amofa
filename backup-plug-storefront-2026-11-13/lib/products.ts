export type Product = {
  slug: string;
  name: string;
  category: "Pencils" | "Erasers";
  shortDescription: string;
  description: string;
  priceGhs: number | null;
};

export const products: Product[] = [
  {
    slug: "abacus-pencil",
    name: "AMOFA Abacus Pencil",
    category: "Pencils",
    shortDescription: "A pencil with an abacus idea.",
    description:
      "AMOFA’s Abacus Pencil brings two familiar ideas together. Product specifications, materials, and use guidance will be added when confirmed.",
    priceGhs: null,
  },
  {
    slug: "ink-cleaning-eraser",
    name: "AMOFA Ink-Cleaning Eraser",
    category: "Erasers",
    shortDescription: "A dedicated idea for ink cleanup.",
    description:
      "The Ink-Cleaning Eraser is part of AMOFA’s first stationery collection. Product specifications, materials, and use guidance will be added when confirmed.",
    priceGhs: null,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(priceGhs: number | null): string {
  if (priceGhs === null) return "Price to be confirmed";
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(priceGhs);
}
