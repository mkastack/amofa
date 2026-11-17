"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "amofa-cart-v1";

export type CartLine = {
  slug: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  ready: boolean;
  storageError: boolean;
  addItem: (slug: string, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const listeners = new Set<() => void>();
let cartSnapshot = "[]";
let initialized = false;
let canPersist = false;
let storageError = false;

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.slug === "string" &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function initializeStore() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(isCartLine)) {
        throw new Error("Saved cart data is not valid.");
      }
      const legacy: Record<string, string> = { "abacus-pencil": "iq-pencil", "ink-cleaning-eraser": "dual-eraser" };
      cartSnapshot = JSON.stringify(parsed.map((line) => ({ ...line, slug: legacy[line.slug] ?? line.slug })));
    }
    canPersist = true;
  } catch (error) {
    console.error("AMOFA could not restore the saved cart.", error);
    storageError = true;
  }
}

function getCartSnapshot() {
  initializeStore();
  return cartSnapshot;
}

function getServerCartSnapshot() {
  return "[]";
}

function getReadySnapshot() {
  initializeStore();
  return initialized;
}

function getServerReadySnapshot() {
  return false;
}

function getStorageErrorSnapshot() {
  initializeStore();
  return storageError;
}

function getServerStorageErrorSnapshot() {
  return false;
}

function handleStorage(event: StorageEvent) {
  if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
  try {
    const parsed: unknown = event.newValue ? JSON.parse(event.newValue) : [];
    if (!Array.isArray(parsed) || !parsed.every(isCartLine)) {
      throw new Error("Saved cart data is not valid.");
    }
    cartSnapshot = JSON.stringify(parsed);
    canPersist = true;
    storageError = false;
  } catch (error) {
    console.error("AMOFA could not read a cart update from another tab.", error);
    storageError = true;
  }
  notifyListeners();
}

function subscribe(listener: () => void) {
  const shouldSubscribeToStorage = listeners.size === 0;
  listeners.add(listener);
  if (shouldSubscribeToStorage && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function writeItems(items: CartLine[]) {
  cartSnapshot = JSON.stringify(items);
  notifyListeners();
  if (!canPersist) return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, cartSnapshot);
  } catch (error) {
    console.error("AMOFA could not save the cart in this browser.", error);
    storageError = true;
    notifyListeners();
  }
}

function addItem(slug: string, quantity = 1) {
  const safeQuantity = Math.max(1, Math.floor(quantity));
  const current: CartLine[] = JSON.parse(getCartSnapshot());
  const existing = current.find((item) => item.slug === slug);
  const next = existing
    ? current.map((item) =>
        item.slug === slug
          ? { ...item, quantity: item.quantity + safeQuantity }
          : item,
      )
    : [...current, { slug, quantity: safeQuantity }];
  writeItems(next);
}

function updateQuantity(slug: string, quantity: number) {
  const current: CartLine[] = JSON.parse(getCartSnapshot());
  const safeQuantity = Math.floor(quantity);
  const next =
    safeQuantity < 1
      ? current.filter((item) => item.slug !== slug)
      : current.map((item) =>
          item.slug === slug ? { ...item, quantity: safeQuantity } : item,
        );
  writeItems(next);
}

function clearCart() {
  writeItems([]);
}

function removeItem(slug: string) {
  const current: CartLine[] = JSON.parse(getCartSnapshot());
  writeItems(current.filter((item) => item.slug !== slug));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribe,
    getReadySnapshot,
    getServerReadySnapshot,
  );
  const storageError = useSyncExternalStore(
    subscribe,
    getStorageErrorSnapshot,
    getServerStorageErrorSnapshot,
  );
  const items = JSON.parse(snapshot) as CartLine[];
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const value = useMemo(
    () => ({
      items,
      itemCount,
      ready,
      storageError,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [itemCount, items, ready, storageError],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}
