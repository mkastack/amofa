import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import { SavedProductsProvider } from "@/components/saved-products-provider";
import { CartProvider } from "@/components/cart-provider";
import { SiteShell } from "@/components/storefront";
import "./tokens.css";
import "./globals.css";
import "./reference-home.css";
import "./brand.css";

const inter = localFont({ src: "../public/fonts/Inter.ttf", variable: "--font-inter", display: "swap" });
const spaceGrotesk = localFont({ src: "../public/fonts/SpaceGrotesk.ttf", variable: "--font-space-grotesk", display: "swap" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AMOFA — Thoughtful stationery",
    template: "%s | AMOFA",
  },
  description:
    "Discover AMOFA’s Abacus Pencil and Ink-Cleaning Eraser. Product details and GHS pricing are being confirmed.",
  openGraph: {
    title: "AMOFA — Thoughtful stationery",
    description:
      "Discover AMOFA’s first stationery ideas for students, teachers, and curious minds.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SavedProductsProvider><CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider></SavedProductsProvider>
      </body>
    </html>
  );
}
