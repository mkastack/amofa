import type { Metadata } from "next";
import { InformationPage } from "@/components/storefront";

export const metadata: Metadata = { title: "Contact AMOFA" };

export default function Page() {
  return <InformationPage slug="contact" />;
}
