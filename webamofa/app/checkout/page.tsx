import type { Metadata } from "next";
import { CheckoutPage } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Check out with Mobile Money in test mode: delivery details, provider, and phone approval. No money is taken.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
