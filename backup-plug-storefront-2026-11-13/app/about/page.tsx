import type { Metadata } from "next";
import { InformationPage } from "@/components/storefront";

export const metadata: Metadata = { title: "About AMOFA" };

export default function Page() {
  return <InformationPage slug="about" />;
}
