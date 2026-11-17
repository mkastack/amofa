"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

const key = "amofa-saved-products-v1";
const listeners = new Set<() => void>();
let snapshot = "[]";
let initialized = false;
function readSaved() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(value) && value.every(item => typeof item === "string")) snapshot = JSON.stringify(value);
    } catch { /* Saved products remain available for this visit. */ }
  }
  return snapshot;
}
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
const SavedContext = createContext<{ saved: string[]; toggle: (slug: string) => void; persistenceError: boolean } | null>(null);

export function SavedProductsProvider({ children }: { children: ReactNode }) {
  const value = useSyncExternalStore(subscribe, readSaved, () => "[]");
  const [persistenceError, setPersistenceError] = useState(false);
  const saved: string[] = JSON.parse(value);
  function toggle(slug: string) {
    const current: string[] = JSON.parse(readSaved());
    snapshot = JSON.stringify(current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
    try { localStorage.setItem(key, snapshot); } catch { setPersistenceError(true); }
    listeners.forEach(listener => listener());
  }
  return <SavedContext.Provider value={{ saved, toggle, persistenceError }}>{children}</SavedContext.Provider>;
}

export function useSavedProducts() {
  const context = useContext(SavedContext);
  if (!context) throw new Error("SavedProductsProvider is required.");
  return context;
}
