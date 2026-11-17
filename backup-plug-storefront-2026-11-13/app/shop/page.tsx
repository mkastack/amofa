import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Explore the AMOFA Abacus Pencil and Ink-Cleaning Eraser. Prices and full product details are being confirmed.",
};

export default function ShopRoute() {
  return <Suspense fallback={<div className="page-shell" aria-busy="true"><h1>The AMOFA collection</h1><p>Loading products…</p></div>}><ShopPage /></Suspense>;
}
