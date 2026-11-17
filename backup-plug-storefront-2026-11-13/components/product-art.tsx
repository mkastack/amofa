import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductArtwork({ product, detail = false, lifestyle = false }: { product: Product; detail?: boolean; lifestyle?: boolean }) {
  const pencil = product.category === "Pencils";
  return <div className={`product-art product-photo ${pencil ? "photo-pencil" : "photo-eraser"}${detail ? " product-art-detail" : ""}${lifestyle ? " photo-lifestyle" : ""}`}><Image src={lifestyle ? "/images/desk.jpg" : pencil ? "/images/pencils-cutout.png" : "/images/eraser-cutout.png"} alt={`${pencil ? "Pencils" : "Writing tools and an eraser"} shown as stationery inspiration; not the actual ${product.name}`} fill sizes={detail ? "(max-width:760px) 100vw, 55vw" : "(max-width:760px) 50vw, 40vw"} /><span className="art-caption">Reference photo · official AMOFA images coming soon</span></div>;
}
