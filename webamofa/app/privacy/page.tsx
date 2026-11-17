import type { Metadata } from "next";
import { InformationPage } from "@/components/storefront";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return <InformationPage slug="privacy" />;
}
