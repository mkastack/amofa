import type { Metadata } from "next";
import { InformationPage } from "@/components/storefront";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function Page() {
  return <InformationPage slug="terms" />;
}
