import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your AMOFA test order confirmation.",
  robots: { index: false },
};

export default function ConfirmationRoute() {
  return <OrderConfirmation />;
}
