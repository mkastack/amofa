import type { Metadata } from "next";
import { CheckoutPage } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your delivery details and Mobile Money preference. No payments are processed in this preview.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
