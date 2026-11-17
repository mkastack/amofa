import type { Metadata } from "next";
import { CartPage } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review items in your AMOFA shopping bag.",
};

export default function CartRoute() {
  return <CartPage />;
}
