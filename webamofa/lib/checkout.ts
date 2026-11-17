import { products } from "@/lib/products";

/* Sample delivery and payment data for the test-mode checkout. Every fee here is a placeholder (footnote 4). */

export type DeliveryOption = { id: string; label: string; detail: string; feeGhs: number };

export const FREE_DELIVERY_OVER_GHS = 150;

export const deliveryOptions: DeliveryOption[] = [
  { id: "accra", label: "Standard delivery, Greater Accra", detail: "2–3 working days", feeGhs: 15 },
  { id: "nationwide", label: "Nationwide delivery", detail: "3–5 working days", feeGhs: 30 },
  { id: "pickup", label: "Pickup point, Accra", detail: "Ready the next working day", feeGhs: 0 },
];

export function deliveryFee(optionId: string, subtotal: number): number {
  const option = deliveryOptions.find((entry) => entry.id === optionId) ?? deliveryOptions[0];
  if (option.id === "accra" && subtotal >= FREE_DELIVERY_OVER_GHS) return 0;
  return option.feeGhs;
}

export type Provider = { id: "mtn" | "telecel" | "at"; label: string; prefixes: string[] };

export const providers: Provider[] = [
  { id: "mtn", label: "MTN MoMo", prefixes: ["024", "025", "053", "054", "055", "059"] },
  { id: "telecel", label: "Telecel Cash", prefixes: ["020", "050"] },
  { id: "at", label: "AT Money", prefixes: ["026", "027", "056", "057"] },
];

/** Normalise +233 / 233 / 0-prefixed Ghana mobile numbers to 10 digits starting with 0. */
export function normaliseGhanaPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let local = digits;
  if (digits.startsWith("233")) local = `0${digits.slice(3)}`;
  if (/^[2-5]\d{8}$/.test(local)) local = `0${local}`;
  return /^0[2-5]\d{8}$/.test(local) ? local : null;
}

export function formatGhanaPhone(local: string): string {
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

export function maskPhone(local: string): string {
  return `${local.slice(0, 3)} *** ${local.slice(6)}`;
}

export function providerForNumber(local: string): Provider | undefined {
  return providers.find((provider) => provider.prefixes.includes(local.slice(0, 3)));
}

export type OrderLine = { slug: string; name: string; quantity: number; priceGhs: number };

export type TestOrder = {
  number: string;
  placedAt: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  delivery: DeliveryOption;
  provider: Provider["label"];
  momoNumber: string;
  lines: OrderLine[];
  subtotal: number;
  deliveryFeeGhs: number;
  total: number;
};

export function orderLines(items: { slug: string; quantity: number }[]): OrderLine[] {
  return items.flatMap((item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    if (!product || product.priceGhs === null) return [];
    return [{ slug: product.slug, name: product.name, quantity: item.quantity, priceGhs: product.priceGhs }];
  });
}

export function newOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const random = Math.floor(Math.random() * 900 + 100);
  return `AMF-${stamp}${random}`;
}

const ORDER_KEY = "amofa-last-test-order-v1";

export function saveTestOrder(order: TestOrder) {
  try { window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch { /* confirmation falls back to a generic message */ }
}

export function readTestOrder(): TestOrder | null {
  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    return raw ? (JSON.parse(raw) as TestOrder) : null;
  } catch {
    return null;
  }
}
