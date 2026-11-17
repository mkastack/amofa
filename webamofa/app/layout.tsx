import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SavedProductsProvider } from "@/components/saved-products-provider";
import { CartProvider } from "@/components/cart-provider";
import { SiteShell } from "@/components/storefront";
import "./tokens.css";
import "./globals.css";

const monaSans = localFont({
  src: "../public/fonts/MonaSans.ttf",
  variable: "--font-mona",
  display: "swap",
  weight: "200 900",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});

export const metadata: Metadata = {
  title: {
    default: "AMOFA Store — Thoughtful stationery",
    template: "%s | AMOFA",
  },
  description:
    "Shop the AMOFA IQ Pencil™, Dual Eraser™, and school essentials. Write It, Own It.",
  openGraph: {
    title: "AMOFA Store — Thoughtful stationery",
    description: "Familiar tools, each with a new idea inside. The first AMOFA collection for students, teachers, and curious minds in Ghana.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F6F2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" data-scroll-behavior="smooth" className={monaSans.variable}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SavedProductsProvider>
          <CartProvider>
            <SiteShell>{children}</SiteShell>
          </CartProvider>
        </SavedProductsProvider>
      </body>
    </html>
  );
}
