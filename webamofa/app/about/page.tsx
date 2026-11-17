import type { Metadata } from "next";
import localFont from "next/font/local";
import { AboutPage } from "@/components/about-page";
import "./about.css";

/* The brand identity's typeface, used on the About page only. */
const openSans = localFont({
  src: "../../public/fonts/OpenSans.ttf",
  variable: "--font-open-sans",
  display: "swap",
  weight: "300 800",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

export const metadata: Metadata = {
  title: "About AMOFA",
  description: "Meet AMOFA: founder Nana Kofi Amofa, the team, the AMOFA IQ Pencil™ and Dual Eraser™, and the brand behind “Write It, Own It”.",
};

export default function Page() {
  return (
    <div className={openSans.variable}>
      <AboutPage />
    </div>
  );
}
