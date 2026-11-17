import type { Metadata } from "next";
import { InformationPage } from "@/components/storefront";

export const metadata: Metadata = { title: "Frequently Asked Questions" };

export default function Page() {
  return <InformationPage slug="faq" />;
}
