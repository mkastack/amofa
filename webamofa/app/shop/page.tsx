import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the AMOFA IQ Pencil™, Dual Eraser™, and school essentials for the new term.",
};

export default function ShopRoute() {
  return (
    <Suspense fallback={<header className="container page-intro" aria-busy="true"><h1 className="page-title">Shop the collection. <span>Loading products…</span></h1></header>}>
      <ShopPage />
    </Suspense>
  );
}
