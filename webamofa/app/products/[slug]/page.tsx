import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/storefront";
import { getProduct, products } from "@/lib/products";

type ProductRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name.replace(/\u2011/g, "-"),
    description: `${product.shortDescription} Product specifications and pricing are being confirmed.`,
  };
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return <ProductPage product={product} />;
}
