"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { QuantityControl } from "@/components/quantity-control";
import { useSavedProducts } from "@/components/saved-products-provider";
import { useCart } from "@/components/cart-provider";
import { Icon, type IconName } from "@/components/icons";
import { BrandMark, ProductRender } from "@/components/renders";
import { AbacusDemo, EraserDemo } from "@/components/demos";

/* The 3D unveiling ships only with the IQ Pencil page. */
const PencilUnveil = dynamic(() => import("@/components/pencil-unveil").then((m) => m.PencilUnveil), {
  ssr: false,
  loading: () => <section className="unveil unveil-loading" aria-label="Loading the IQ Pencil unveiling" />,
});
import { footnotes, questions, type Question } from "@/lib/content";
import { categories, categoryBlurb, formatPrice, onDeal, plainText, products, savingGhs, stockLabel, stockState, type Category, type Product } from "@/lib/products";
import { deliveryFee, deliveryOptions, FREE_DELIVERY_OVER_GHS, maskPhone, newOrderNumber, normaliseGhanaPhone, orderLines, providerForNumber, providers, saveTestOrder, type Provider, type TestOrder } from "@/lib/checkout";

/* ───────────────────────── shared pieces ───────────────────────── */

export function Footnote({ n }: { n: number }) {
  return (
    <sup className="footnote-mark">
      <a href={`#footnote-${n}`} aria-label={`Footnote ${n}`}>{n}</a>
    </sup>
  );
}

export function PageIntro({ title, tone, lede, children }: { title: string; tone?: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="container page-intro">
      <h1 className="page-title">
        {title} {tone && <span>{tone}</span>}
      </h1>
      {lede && <p className="page-lede">{lede}</p>}
      {children}
    </header>
  );
}

export function AddToBagButton({ product, quantity = 1, small = false, wide = false, announce = true }: { product: Product; quantity?: number; small?: boolean; wide?: boolean; announce?: boolean }) {
  const { addItem, items, ready, storageError } = useCart();
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const inBag = items.find((line) => line.slug === product.slug)?.quantity ?? 0;
  const room = product.stock === null ? Infinity : Math.max(0, product.stock - inBag);
  const soldOut = product.stock === 0;
  const full = !soldOut && room === 0;

  function add() {
    const amount = Math.min(quantity, room);
    if (amount <= 0) return;
    addItem(product.slug, amount);
    setAdded(true);
    setMessage(storageError
      ? "Added for this visit. This browser could not save your bag."
      : amount < quantity
        ? `Only ${amount} more available, so ${amount} ${amount === 1 ? "was" : "were"} added to your bag.`
        : `${product.name} added to your bag.`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setAdded(false); setMessage(""); }, 2600);
  }

  const label = !ready ? "Preparing bag…" : soldOut ? "Sold out" : full ? "All stock in your bag" : added ? <><Icon name="check" />Added</> : "Add to bag";
  return (
    <>
      <button className={`button button-primary${small ? " button-small" : ""}${wide ? " button-wide" : ""}${added ? " is-added" : ""}`} disabled={!ready || soldOut || full} onClick={add} type="button">
        {label}
      </button>
      <span className={announce ? "add-feedback" : "visually-hidden"} aria-live="polite">{message}</span>
    </>
  );
}

export function PriceTag({ product, className = "" }: { product: Product; className?: string }) {
  const saving = savingGhs(product);
  return (
    <p className={`price ${className}`}>
      <span className={saving ? "price-now is-sale" : "price-now"}>{formatPrice(product.priceGhs)}</span>
      {saving > 0 && product.compareAtGhs && <s className="price-was"><span className="visually-hidden">Was </span>{formatPrice(product.compareAtGhs)}</s>}
      <Footnote n={1} />
    </p>
  );
}

export function BuyNowButton({ product, quantity = 1 }: { product: Product; quantity?: number }) {
  const router = useRouter();
  const { addItem, items, ready } = useCart();
  const inBag = items.find((line) => line.slug === product.slug)?.quantity ?? 0;
  const room = product.stock === null ? Infinity : Math.max(0, product.stock - inBag);
  const soldOut = product.stock === 0;
  return (
    <button
      className="button button-secondary button-wide"
      type="button"
      disabled={!ready || soldOut}
      onClick={() => { const amount = Math.min(quantity, room); if (amount > 0) addItem(product.slug, amount); router.push("/checkout"); }}
    >
      Buy now
    </button>
  );
}

export function StockBadge({ stock, detailed = false }: { stock: number | null; detailed?: boolean }) {
  const state = stockState(stock);
  return (
    <p className={`stock stock-${state}`}>
      {state === "unknown" ? <Icon name="help" /> : <span className="stock-dot" aria-hidden="true" />}
      {stockLabel(stock)}
      {detailed && state === "in-stock" && <span className="stock-count"> · {stock} available</span>}
    </p>
  );
}

/** Compact catalogue card: Apple's accessory-card proportions, product image on a quiet field. */
export function CatalogCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  return (
    <article className={`catalog-card${product.stock === 0 ? " is-sold-out" : ""}`}>
      <div className="catalog-art">
        <ProductRender product={product} />
        {onDeal(product) ? <span className="card-badge badge-deal">Save {formatPrice(savingGhs(product))}</span> : product.tags?.includes("new") ? <span className="card-badge badge-new">New</span> : null}
      </div>
      <div className="catalog-body">
        <h3 className="catalog-title"><Link className="tile-link" href={href}>{product.name}</Link></h3>
        <PriceTag product={product} className="catalog-price" />
        <StockBadge stock={product.stock} />
        <div className="catalog-actions"><AddToBagButton product={product} small announce={false} /></div>
      </div>
      <SaveButton product={product} />
    </article>
  );
}

export function SaveButton({ product, labelled = false }: { product: Product; labelled?: boolean }) {
  const { saved, toggle, persistenceError } = useSavedProducts();
  const isSaved = saved.includes(product.slug);
  return (
    <button
      type="button"
      className={labelled ? "save-text" : "save-button"}
      aria-label={labelled ? undefined : `${isSaved ? "Remove" : "Save"} ${product.name} ${isSaved ? "from" : "to"} your saved list`}
      aria-pressed={isSaved}
      onClick={() => toggle(product.slug)}
    >
      <Icon name="heart" />
      {labelled && <span>{isSaved ? "Saved" : "Save for later"}</span>}
      {persistenceError && isSaved && <span className="visually-hidden" role="status">Saved for this visit only</span>}
    </button>
  );
}

export function ProductTile({ product, className = "" }: { product: Product; className?: string }) {
  const href = `/products/${product.slug}`;
  return (
    <article className={`tile tile-product ${product.art === "abacus-pencil" ? "tone-blue" : "tone-stone"} ${className}`}>
      <div className="tile-copy">
        <h3 className="tile-title"><Link className="tile-link" href={href}>{product.name}</Link></h3>
        <p className="tile-text">{product.shortDescription}</p>
        <PriceTag product={product} className="tile-price" />
      </div>
      <div className="tile-actions">
        <AddToBagButton product={product} small announce={false} />
        <Link className="link-chevron" href={href} aria-label={`Learn more about the ${product.name}`}>Learn more<Icon name="chevron" /></Link>
      </div>
      <div className="tile-art"><ProductRender product={product} /></div>
      <SaveButton product={product} />
    </article>
  );
}

export function InfoCard({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <div className="info-card">
      <Icon name={icon} />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function FaqList({ items, firstOpen = true }: { items: Question[]; firstOpen?: boolean }) {
  const [open, setOpen] = useState<number | null>(firstOpen ? 0 : null);
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div className="faq-item" key={item.question}>
          <h3>
            <button type="button" aria-expanded={open === i} aria-controls={`${base}-${i}`} onClick={() => setOpen(open === i ? null : i)}>
              {item.question}
              <Icon name="plus" />
            </button>
          </h3>
          <div className="faq-answer" id={`${base}-${i}`} hidden={open !== i}>
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StageFacts({ demo }: { demo: "abacus" | "eraser" }) {
  const product = products.find((p) => p.demo === demo);
  const other = products.find((p) => p.demo && p.demo !== demo);
  if (!product || !other) return null;
  return (
    <aside className="stage-aside" aria-labelledby="stage-facts-title">
      <h3 id="stage-facts-title">What we can say so far.</h3>
      <dl>
        <div><dt>Product idea</dt><dd>{product.shortDescription}</dd></div>
        <div><dt>Price</dt><dd>To be confirmed<Footnote n={1} /></dd></div>
        <div><dt>Materials and size</dt><dd>To be confirmed</dd></div>
        <div><dt>Delivery in Ghana</dt><dd>To be confirmed<Footnote n={4} /></dd></div>
      </dl>
      <p>The demonstration uses a concept render, not the final product.<Footnote n={2} /></p>
      <Link className="link-chevron" href={`/products/${other.slug}#product-demo-title`}>Try the {other.shortName} demo<Icon name="chevron" /></Link>
    </aside>
  );
}

export function DemoStage({ only, id = "closer-look" }: { only?: "abacus" | "eraser"; id?: string }) {
  return (
    <section className={`stage${only ? " stage-single" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <h2 className="stage-title" id={`${id}-title`}>
          Take a closer look. <span>{only === "abacus" ? "Two familiar ideas in one pencil." : only === "eraser" ? "An eraser with ink in mind." : "Two familiar tools, each with something new."}</span>
        </h2>
        <div className="stage-grid">
          {only !== "eraser" && (
            <article className="demo-card">
              <div className="demo-copy">
                <h3>Count on the pencil.</h3>
                <p>Tap a bead to slide it across, or focus the beads and use your arrow keys.<Footnote n={2} /></p>
              </div>
              <AbacusDemo />
            </article>
          )}
          {only !== "abacus" && (
            <article className="demo-card">
              <div className="demo-copy">
                <h3>Clean up the ink.</h3>
                <p>Drag across the page to try the idea.<Footnote n={2} /></p>
              </div>
              <EraserDemo />
            </article>
          )}
          {only && <StageFacts demo={only} />}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── shell ───────────────────────── */

const footerColumns: { title: string; links: [string, string][] }[] = [
  { title: "Shop", links: [["IQ Pencil™", "/products/iq-pencil"], ["Dual Eraser™", "/products/dual-eraser"], ["Shop all", "/shop"], ["Your bag", "/cart"]] },
  { title: "Help", links: [["Frequently asked questions", "/faq"], ["Shipping & returns", "/shipping-returns"], ["Contact AMOFA", "/contact"]] },
  { title: "Categories", links: categories.map((c) => [c === "Art" ? "Art & colour" : c, `/shop?category=${c}`] as [string, string]) },
  { title: "AMOFA", links: [["About AMOFA", "/about"], ["Contact", "/contact"]] },
  { title: "Legal", links: [["Privacy policy", "/privacy"], ["Terms & conditions", "/terms"]] },
];

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <ol className="footnotes">
          {footnotes.map((note, i) => <li id={`footnote-${i + 1}`} key={note}>{note}</li>)}
        </ol>
        <div className="footer-lockup">
          <Link href="/" className="footer-logo" aria-label="AMOFA home">
            <BrandMark />
            <span className="footer-logo-text">
              <Image src="/images/brand/logo-wordmark-white.png" alt="" width={1010} height={165} />
              <span>Write It, Own It</span>
            </span>
          </Link>
        </div>
        <nav className="footer-columns" aria-label="Footer">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2>{column.title}</h2>
              <ul>{column.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
            </div>
          ))}
        </nav>
        <p className="footer-promo">Planning to buy for a school or class? <Link href="/contact">Tell AMOFA what you need</Link>.</p>
        <div className="footer-legal">
          <span>Copyright © 2026 AMOFA. All rights reserved.</span>
          <span className="footer-legal-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/shipping-returns">Shipping &amp; returns</Link></span>
          <span>Ghana · Store preview</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { storageError } = useCart();
  return (
    <>
      <SiteHeader />
      {storageError && (
        <p className="storage-warning" role="alert">
          This browser could not save your bag. You can keep shopping, but your items may not remain after you leave.
        </p>
      )}
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}

/* ───────────────────────── shop ───────────────────────── */

export function ShopPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "All";
  const deals = searchParams.get("deals") === "1";
  return <ShopResults key={`${query}:${category}:${deals}`} initialQuery={query} initialCategory={category} initialDeals={deals} />;
}

type SortKey = "featured" | "price-asc" | "price-desc" | "name";
type PriceBand = "any" | "under-10" | "10-25" | "over-25";
const priceBands: [PriceBand, string][] = [["any", "Any price"], ["under-10", "Under GH₵10"], ["10-25", "GH₵10 to GH₵25"], ["over-25", "Over GH₵25"]];
const inBand = (price: number | null, band: PriceBand) => {
  if (band === "any") return true;
  if (price === null) return false;
  if (band === "under-10") return price < 10;
  if (band === "10-25") return price >= 10 && price <= 25;
  return price > 25;
};
const categoryLabel = (c: Category | "All") => (c === "Art" ? "Art & colour" : c);

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="toggle-field">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-track" aria-hidden="true"><span /></span>
      {label}
    </label>
  );
}

function ShopResults({ initialQuery, initialCategory, initialDeals }: { initialQuery: string; initialCategory: string; initialDeals: boolean }) {
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState<Category | "All">((categories as string[]).includes(initialCategory) ? (initialCategory as Category) : "All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [band, setBand] = useState<PriceBand>("any");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(initialDeals);

  const visible = useMemo(() => {
    const q = search.trim().toLocaleLowerCase();
    const list = products.filter((p) =>
      (category === "All" || p.category === category) &&
      (!inStockOnly || (p.stock ?? 1) > 0) &&
      (!dealsOnly || onDeal(p)) &&
      inBand(p.priceGhs, band) &&
      (!q || plainText(`${p.name} ${p.category} ${p.shortDescription}`).toLocaleLowerCase().includes(q)));
    const price = (p: Product) => p.priceGhs ?? Number.POSITIVE_INFINITY;
    if (sort === "price-asc") return [...list].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") return [...list].sort((a, b) => (b.priceGhs ?? -1) - (a.priceGhs ?? -1));
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, search, sort, inStockOnly, dealsOnly, band]);

  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c, products.filter((p) => p.category === c).length])), []);
  const filtered = category !== "All" || band !== "any" || inStockOnly || dealsOnly || search.trim() !== "";
  function reset() { setSearch(""); setCategory("All"); setBand("any"); setInStockOnly(false); setDealsOnly(false); }

  return (
    <>
      <PageIntro title={dealsOnly && category === "All" ? "Shop deals." : category === "All" ? "Shop the collection." : `Shop ${categoryLabel(category).toLowerCase()}.`} tone={dealsOnly && category === "All" ? "Sample savings on school favourites." : category === "All" ? "Everything for the pencil case." : categoryBlurb[category]} />
      <div className="container shop-layout">
        <aside className="shop-filters" aria-label="Filters">
          <div className="filter-group">
            <h2>Category</h2>
            <ul>
              {(["All", ...categories] as const).map((item) => (
                <li key={item}>
                  <button type="button" className="filter-option" aria-pressed={category === item} onClick={() => setCategory(item)}>
                    {categoryLabel(item)}<span>{item === "All" ? products.length : counts[item]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-group">
            <h2>Price</h2>
            <ul>
              {priceBands.map(([value, label]) => (
                <li key={value}>
                  <button type="button" className="filter-option" aria-pressed={band === value} onClick={() => setBand(value)}>{label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-group filter-switches">
            <h2>Show</h2>
            <Toggle label="Deals only" checked={dealsOnly} onChange={setDealsOnly} />
            <Toggle label="In stock only" checked={inStockOnly} onChange={setInStockOnly} />
          </div>
          {filtered && <button type="button" className="text-button" onClick={reset}>Clear all filters</button>}
        </aside>
        <div className="shop-results">
          <div className="shop-toolbar">
            <div className="chip-row" role="group" aria-label="Filter by category">
              {(["All", ...categories] as const).map((item) => (
                <button aria-pressed={category === item} className="chip-filter" key={item} onClick={() => setCategory(item)} type="button">
                  {categoryLabel(item)}
                  <span className="chip-count">{item === "All" ? products.length : counts[item]}</span>
                </button>
              ))}
            </div>
            <div className="shop-controls">
              <label className="search-field">
                <Icon name="search" />
                <span className="visually-hidden">Search products</span>
                <input onChange={(e) => setSearch(e.target.value)} placeholder="Search the store" type="search" value={search} />
              </label>
              <div className="mobile-switches">
                <Toggle label="Deals" checked={dealsOnly} onChange={setDealsOnly} />
                <Toggle label="In stock" checked={inStockOnly} onChange={setInStockOnly} />
              </div>
              <label className="select-field">
                <span>Sort</span>
                <select onChange={(e) => setSort(e.target.value as SortKey)} value={sort}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>
          </div>
          <p aria-live="polite" className="results-count">{visible.length} {visible.length === 1 ? "product" : "products"}</p>
          {visible.length ? (
            <div className="catalog-grid">
              {visible.map((p) => <CatalogCard key={p.slug} product={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h2>{search ? `Nothing matches “${search}”.` : "No products match these filters."}</h2>
              <p>Try another word, widen the price range, or show sold-out items too.</p>
              <button className="button button-secondary" onClick={reset} type="button">Clear search and filters</button>
            </div>
          )}
        </div>
      </div>
      <QuickLinks />
    </>
  );
}

/* ───────────────────────── product ───────────────────────── */

function relatedFor(product: Product) {
  const others = products.filter((p) => p.slug !== product.slug);
  const same = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category && p.stock !== 0);
  return [...same, ...rest].slice(0, 4);
}

export function ProductPage({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const photos = product.photos ?? [];
  const [photoIndex, setPhotoIndex] = useState(0);
  const soldOut = product.stock === 0;
  const maxQuantity = Math.max(1, Math.min(20, product.stock ?? 20));

  return (
    <>
      <div className="container buy">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <Link href="/">Store</Link><Icon name="chevron" />
          <Link href={`/shop?category=${product.category}`}>{product.category === "Art" ? "Art & colour" : product.category}</Link><Icon name="chevron" />
          <span aria-current="page">{product.shortName}</span>
        </nav>
        <header className="buy-header">
          <h1 className="buy-title">Buy {product.shortName}</h1>
          <p className="buy-sub">{product.shortDescription}</p>
        </header>
        <div className="buy-layout">
          <section className="buy-gallery" aria-label="Product views">
            <div className={`gallery-stage${photos.length ? " is-photo" : ""}`}>
              <ProductRender product={product} photo={photoIndex} sizes="(max-width: 1068px) 100vw, 700px" key={photoIndex} />
            </div>
            {photos.length > 1 && (
              <div className="gallery-views" role="group" aria-label="Choose a photo">
                {photos.map((p, i) => (
                  <button key={p.src} type="button" aria-pressed={photoIndex === i} onClick={() => setPhotoIndex(i)}>{p.label}</button>
                ))}
              </div>
            )}
            <p className="gallery-note">{photos.length ? <>AMOFA product photos and brand mockups<Footnote n={2} /></> : <>Concept render, not a photograph<Footnote n={2} /></>}</p>
          </section>
          <section className="buy-panel" id="buy" aria-label="Purchase options">
            <div className="buy-price-row">
              <PriceTag product={product} className="buy-price" />
              <StockBadge stock={product.stock} detailed />
            </div>
            {onDeal(product) && <p className="buy-saving">You save {formatPrice(savingGhs(product))} on this sample deal.</p>}
            {product.sample && <p className="sample-note">Sample listing<Footnote n={5} /></p>}
            <p className="buy-description">{product.description}</p>
            <div className="buy-step">
              <h2>Quantity</h2>
              {soldOut ? <span className="buy-step-note">Unavailable while sold out</span> : (
                <QuantityControl quantity={Math.min(quantity, maxQuantity)} onChange={(n) => setQuantity(Math.max(1, Math.min(maxQuantity, n)))} label={product.name} max={maxQuantity} />
              )}
            </div>
            <div className="buy-actions">
              <AddToBagButton product={product} quantity={Math.min(quantity, maxQuantity)} wide />
              <BuyNowButton product={product} quantity={Math.min(quantity, maxQuantity)} />
              <SaveButton product={product} labelled />
            </div>
            <div className="info-stack">
              <InfoCard icon="truck" title="Delivery in Ghana">From {formatPrice(15)} in Greater Accra, free over {formatPrice(FREE_DELIVERY_OVER_GHS)}. Pickup in Accra is free.<Footnote n={4} /></InfoCard>
              <InfoCard icon="phone" title="Pay with Mobile Money">MTN MoMo, Telecel Cash, or AT Money at checkout, in test mode.<Footnote n={3} /></InfoCard>
              <InfoCard icon="chat" title="Have a question?"><Link href="/contact">Contact AMOFA</Link> or read the <Link href="/faq">FAQ</Link>.</InfoCard>
            </div>
            <dl className="spec-list">
              {product.details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </section>
        </div>
      </div>
      {product.slug === "iq-pencil" && <PencilUnveil />}
      {product.demo && <DemoStage only={product.demo} id="product-demo" />}
      <section className="container related" aria-labelledby="related-title">
        <h2 className="shelf-title" id="related-title">Complete the set. <span>More for the pencil case.</span></h2>
        <div className="catalog-grid">
          {relatedFor(product).map((p) => <CatalogCard key={p.slug} product={p} />)}
        </div>
      </section>
    </>
  );
}

/* ───────────────────────── bag ───────────────────────── */

function bagTotals(items: { slug: string; quantity: number }[]) {
  let known = 0;
  let pending = 0;
  let saved = 0;
  for (const item of items) {
    const p = products.find((entry) => entry.slug === item.slug);
    if (p?.priceGhs == null) { pending += item.quantity; continue; }
    known += p.priceGhs * item.quantity;
    saved += savingGhs(p) * item.quantity;
  }
  return { known, pending, saved };
}

function FreeDeliveryMeter({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, FREE_DELIVERY_OVER_GHS - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_OVER_GHS) * 100);
  return (
    <div className="delivery-meter">
      <p>{left > 0 ? <>Add <strong>{formatPrice(left)}</strong> more for free standard delivery in Greater Accra.</> : <>You’ve unlocked free standard delivery in Greater Accra.</>}<Footnote n={4} /></p>
      <div className="meter-track" role="progressbar" aria-label="Progress toward free delivery" aria-valuemin={0} aria-valuemax={FREE_DELIVERY_OVER_GHS} aria-valuenow={Math.min(subtotal, FREE_DELIVERY_OVER_GHS)}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function CartPage() {
  const { items, ready, removeItem, updateQuantity, itemCount } = useCart();

  if (!ready) {
    return <PageIntro title="Your bag." tone="Loading your saved items…" />;
  }

  if (!items.length) {
    return (
      <>
        <PageIntro title="Your bag is empty." tone="Find something for your everyday page." lede="Products you add will stay here on this device while you keep exploring.">
          <div className="intro-actions"><Link className="button button-primary" href="/shop">Start shopping</Link><Link className="button button-secondary" href="/shop?deals=1">See deals</Link></div>
        </PageIntro>
        <QuickLinks />
      </>
    );
  }

  const { known, pending, saved } = bagTotals(items);

  return (
    <div className="container bag">
      <header className="bag-header">
        <h1 className="page-title">Your bag total is {formatPrice(known)}. <span>{itemCount} {itemCount === 1 ? "item" : "items"}, ready to check out.</span></h1>
        <Link className="button button-primary" href="/checkout">Check out</Link>
      </header>
      <div className="bag-layout">
        <div className="bag-lines">
          <FreeDeliveryMeter subtotal={known} />
          {items.map((item) => {
            const product = products.find((entry) => entry.slug === item.slug);
            return (
              <article className="bag-line" key={item.slug}>
                <div className="bag-art">{product ? <ProductRender product={product} /> : <BrandMark />}</div>
                <div className="bag-line-main">
                  <div className="bag-line-top">
                    <h2>{product ? <Link href={`/products/${product.slug}`}>{product.name}</Link> : "Product details unavailable"}</h2>
                    {product ? <PriceTag product={product} className="bag-line-price" /> : <p className="bag-line-price">Price to be confirmed</p>}
                    {product && <StockBadge stock={product.stock} />}
                  </div>
                  <div className="bag-line-controls">
                    <QuantityControl label={product?.name ?? "saved item"} onChange={(q) => updateQuantity(item.slug, q)} quantity={item.quantity} max={product?.stock ?? 99} />
                    <button aria-label={`Remove ${product?.name ?? "saved item"} from your bag`} className="text-button" onClick={() => removeItem(item.slug)} type="button">Remove</button>
                    {product?.priceGhs != null && <span className="bag-line-total">{formatPrice(product.priceGhs * item.quantity)}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside aria-labelledby="summary-title" className="bag-summary">
          <h2 id="summary-title">Order summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(known)}{pending > 0 && <span className="subtotal-pending">+ {pending} {pending === 1 ? "item" : "items"} to be confirmed</span>}</dd></div>
            {saved > 0 && <div className="summary-saving"><dt>You save</dt><dd>{formatPrice(saved)}</dd></div>}
            <div><dt>Delivery</dt><dd>Chosen at checkout</dd></div>
            <div className="summary-total"><dt>Estimated total</dt><dd>{formatPrice(known)}<Footnote n={1} /></dd></div>
          </dl>
          <Link className="button button-primary button-wide" href="/checkout">Check out</Link>
          <p className="summary-note"><Icon name="phone" />Pay with MTN MoMo, Telecel Cash, or AT Money. Checkout runs in test mode, so no money is taken.<Footnote n={3} /></p>
          <Link className="link-chevron summary-back" href="/shop">Continue shopping<Icon name="chevron" /></Link>
        </aside>
      </div>
    </div>
  );
}

/* ───────────────────────── checkout (test mode) ───────────────────────── */

function Field({ label, name, type = "text", autoComplete, required = true, span = false, hint, textarea = false, inputMode, defaultValue, error }: { label: string; name: string; type?: string; autoComplete?: string; required?: boolean; span?: boolean; hint?: string; textarea?: boolean; inputMode?: "tel" | "email" | "text" | "numeric"; defaultValue?: string; error?: string }) {
  const id = useId();
  const hintId = hint || error ? `${id}-hint` : undefined;
  return (
    <div className={`field${span ? " field-span" : ""}${textarea ? " field-textarea" : ""}${error ? " has-error" : ""}`}>
      {textarea
        ? <textarea id={id} name={name} placeholder=" " rows={3} required={required} aria-describedby={hintId} defaultValue={defaultValue} />
        : <input id={id} name={name} type={type} placeholder=" " autoComplete={autoComplete} required={required} inputMode={inputMode} aria-describedby={hintId} aria-invalid={error ? true : undefined} defaultValue={defaultValue} />}
      <label htmlFor={id}>{label}{!required && <span className="optional"> (optional)</span>}</label>
      {(error || hint) && <p className={error ? "field-error" : "field-hint"} id={hintId}>{error ?? hint}</p>}
    </div>
  );
}

type Details = { name: string; email: string; phone: string; address: string; city: string; region: string; notes: string };
type Step = "details" | "payment" | "approve";
const STEPS: [Step, string][] = [["details", "Delivery"], ["payment", "Payment"], ["approve", "Approve"]];

function CheckoutSteps({ step }: { step: Step }) {
  const current = STEPS.findIndex(([value]) => value === step);
  return (
    <ol className="checkout-steps" aria-label="Checkout progress">
      {STEPS.map(([value, label], i) => (
        <li key={value} className={i < current ? "is-done" : i === current ? "is-current" : undefined} aria-current={i === current ? "step" : undefined}>
          <span className="step-dot">{i < current ? <Icon name="check" /> : i + 1}</span>{label}
        </li>
      ))}
    </ol>
  );
}

const APPROVAL_SECONDS = 6;
const article = (label: string) => (/^(?:[AEIOU]|MTN)/.test(label) ? "an" : "a");

export function CheckoutPage() {
  const router = useRouter();
  const { items, ready, clearCart } = useCart();
  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<Details | null>(null);
  const [delivery, setDelivery] = useState(deliveryOptions[0].id);
  const [provider, setProvider] = useState<Provider["id"]>("mtn");
  const [momo, setMomo] = useState("");
  const [momoError, setMomoError] = useState("");
  const [approval, setApproval] = useState<"waiting" | "declined">("waiting");
  const [remaining, setRemaining] = useState(APPROVAL_SECONDS);
  const heading = useRef<HTMLHeadingElement>(null);

  const lines = orderLines(items);
  const subtotal = lines.reduce((sum, line) => sum + line.priceGhs * line.quantity, 0);
  const saved = items.reduce((sum, item) => { const p = products.find((entry) => entry.slug === item.slug); return sum + (p ? savingGhs(p) * item.quantity : 0); }, 0);
  const fee = deliveryFee(delivery, subtotal);
  const total = subtotal + fee;
  const providerLabel = providers.find((p) => p.id === provider)?.label ?? "Mobile Money";

  function go(next: Step) {
    setStep(next);
    requestAnimationFrame(() => { window.scrollTo({ top: 0, behavior: "smooth" }); heading.current?.focus(); });
  }

  function submitDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    setDetails({ name: get("name"), email: get("email"), phone: get("phone"), address: get("address"), city: get("city"), region: get("region"), notes: get("notes") });
    go("payment");
  }

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const local = normaliseGhanaPhone(momo);
    if (!local) { setMomoError("Enter a 10-digit Ghana mobile number, for example 024 123 4567."); return; }
    const match = providerForNumber(local);
    if (match && match.id !== provider) { setMomoError(`That number looks like ${article(match.label)} ${match.label} number. Choose ${match.label}, or use ${article(providerLabel)} ${providerLabel} number.`); return; }
    setMomo(local);
    setMomoError("");
    setApproval("waiting");
    setRemaining(APPROVAL_SECONDS);
    go("approve");
  }

  function completeOrder() {
    if (!details) return;
    const local = normaliseGhanaPhone(momo) ?? momo;
    saveTestOrder({
      number: newOrderNumber(),
      placedAt: new Date().toISOString(),
      name: details.name,
      email: details.email,
      phone: details.phone,
      address: [details.address, details.city, details.region].filter(Boolean).join(", "),
      delivery: deliveryOptions.find((d) => d.id === delivery) ?? deliveryOptions[0],
      provider: providerLabel,
      momoNumber: maskPhone(local),
      lines,
      subtotal,
      deliveryFeeGhs: fee,
      total,
    });
    clearCart();
    router.push("/checkout/confirmation");
  }
  const finishApproval = useEffectEvent(() => completeOrder());

  // Test mode: the "phone prompt" approves itself after a short countdown unless the shopper declines or cancels.
  useEffect(() => {
    if (step !== "approve" || approval !== "waiting") return;
    if (remaining <= 0) { finishApproval(); return; }
    const timer = window.setTimeout(() => setRemaining((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [step, approval, remaining]);

  if (!ready) return <PageIntro title="Checkout." tone="Loading your bag…" />;

  if (!items.length) {
    return (
      <PageIntro title="Your bag is empty." tone="Add a product before checking out.">
        <div className="intro-actions"><Link className="button button-primary" href="/shop">Start shopping</Link></div>
      </PageIntro>
    );
  }

  return (
    <div className="container checkout">
      <p className="test-banner" role="note"><Icon name="help" /><span><strong>Test mode.</strong> Payments are simulated. No money is taken and no order is sent to AMOFA.<Footnote n={3} /></span></p>
      <header className="checkout-header">
        <h1 className="page-title" ref={heading} tabIndex={-1}>
          {step === "details" ? <>Checkout. <span>Where should we send your order?</span></> : step === "payment" ? <>Payment. <span>Pay with Mobile Money.</span></> : <>Approve. <span>Check your phone.</span></>}
        </h1>
        <CheckoutSteps step={step} />
      </header>
      <div className="checkout-layout">
        <div className="checkout-main">
          {step === "details" && (
            <form className="checkout-form" onSubmit={submitDetails}>
              <fieldset>
                <legend>Contact details</legend>
                <div className="form-grid">
                  <Field label="Full name" name="name" autoComplete="name" span defaultValue={details?.name} />
                  <Field label="Email address" name="email" type="email" autoComplete="email" inputMode="email" defaultValue={details?.email} />
                  <Field label="Phone number" name="phone" type="tel" autoComplete="tel" inputMode="tel" hint="For delivery updates, for example 024 123 4567." defaultValue={details?.phone} />
                </div>
              </fieldset>
              <fieldset>
                <legend>Delivery address</legend>
                <div className="form-grid">
                  <Field label="House number and street" name="address" autoComplete="street-address" span defaultValue={details?.address} />
                  <Field label="Town or city" name="city" autoComplete="address-level2" defaultValue={details?.city} />
                  <Field label="Region" name="region" autoComplete="address-level1" defaultValue={details?.region ?? "Greater Accra"} />
                  <Field label="Landmark or delivery notes" name="notes" required={false} textarea span defaultValue={details?.notes} />
                </div>
              </fieldset>
              <fieldset>
                <legend>Delivery option</legend>
                <div className="pay-options">
                  {deliveryOptions.map((option) => {
                    const optionFee = deliveryFee(option.id, subtotal);
                    return (
                      <label className="pay-option delivery-option" key={option.id}>
                        <input checked={delivery === option.id} name="delivery" onChange={() => setDelivery(option.id)} type="radio" value={option.id} />
                        <span className="option-text"><span>{option.label}</span><small>{option.detail}</small></span>
                        <span className="option-price">{optionFee === 0 ? "Free" : formatPrice(optionFee)}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="fieldset-intro">Standard delivery in Greater Accra is free over {formatPrice(FREE_DELIVERY_OVER_GHS)}.<Footnote n={4} /></p>
              </fieldset>
              <button className="button button-primary button-wide" type="submit">Continue to payment</button>
            </form>
          )}

          {step === "payment" && details && (
            <form className="checkout-form" onSubmit={submitPayment} noValidate>
              <div className="review-card">
                <div>
                  <h2>Delivering to</h2>
                  <p>{details.name}<br />{[details.address, details.city, details.region].filter(Boolean).join(", ")}</p>
                  <p className="review-meta">{deliveryOptions.find((d) => d.id === delivery)?.label} · {fee === 0 ? "Free" : formatPrice(fee)}</p>
                </div>
                <button type="button" className="text-button" onClick={() => go("details")}>Change</button>
              </div>
              <fieldset>
                <legend>Choose your Mobile Money provider</legend>
                <div className="provider-grid">
                  {providers.map((p) => (
                    <label className="provider-option" key={p.id}>
                      <input checked={provider === p.id} name="provider" onChange={() => { setProvider(p.id); setMomoError(""); }} type="radio" value={p.id} />
                      <span className={`provider-mark provider-${p.id}`} aria-hidden="true"><Icon name="phone" /></span>
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Mobile Money number</legend>
                <div className={`field${momoError ? " has-error" : ""}`}>
                  <input id="momo-number" name="momo" type="tel" inputMode="tel" autoComplete="tel" placeholder=" " value={momo} onChange={(e) => { setMomo(e.target.value); setMomoError(""); }} aria-invalid={momoError ? true : undefined} aria-describedby="momo-hint" required />
                  <label htmlFor="momo-number">{providerLabel} number</label>
                  <p className={momoError ? "field-error" : "field-hint"} id="momo-hint" role={momoError ? "alert" : undefined}>{momoError || "We’ll send a payment request to this number. You approve it with your Mobile Money PIN on your phone."}</p>
                </div>
              </fieldset>
              <button className="button button-primary button-wide" type="submit">Pay {formatPrice(total)}</button>
              <p className="secure-note"><Icon name="check" />You won’t be charged in test mode. Never share your PIN with anyone.</p>
            </form>
          )}

          {step === "approve" && (
            <section className="approve-panel" aria-live="polite">
              {approval === "waiting" ? (
                <>
                  <div className="approve-phone" aria-hidden="true">
                    <Icon name="phone" />
                    <span className="approve-pulse" />
                  </div>
                  <h2>Approve {formatPrice(total)} on your phone.</h2>
                  <p>We’ve sent {article(providerLabel)} {providerLabel} payment request to <strong>{maskPhone(normaliseGhanaPhone(momo) ?? momo)}</strong>. Enter your Mobile Money PIN on your phone to approve it.</p>
                  <p className="approve-timer">Test mode will approve automatically in {remaining} {remaining === 1 ? "second" : "seconds"}.</p>
                  <div className="approve-actions">
                    <button className="button button-primary" type="button" onClick={completeOrder}>Simulate approval now</button>
                    <button className="button button-secondary" type="button" onClick={() => setApproval("declined")}>Simulate a decline</button>
                    <button className="text-button" type="button" onClick={() => go("payment")}>Cancel and go back</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="approve-phone is-declined" aria-hidden="true"><Icon name="close" /></div>
                  <h2>Payment declined.</h2>
                  <p>The request to {maskPhone(normaliseGhanaPhone(momo) ?? momo)} wasn’t approved, so nothing was taken. Check your balance and try again, or use another Mobile Money number.</p>
                  <div className="approve-actions">
                    <button className="button button-primary" type="button" onClick={() => { setApproval("waiting"); setRemaining(APPROVAL_SECONDS); }}>Try again</button>
                    <button className="button button-secondary" type="button" onClick={() => go("payment")}>Change payment details</button>
                  </div>
                </>
              )}
            </section>
          )}
        </div>

        <aside aria-labelledby="checkout-summary-title" className="bag-summary checkout-summary">
          <h2 id="checkout-summary-title">Order summary</h2>
          <ul className="summary-items">
            {items.map((item) => {
              const product = products.find((entry) => entry.slug === item.slug);
              return (
                <li key={item.slug}>
                  <div className="summary-art">{product ? <ProductRender product={product} /> : <BrandMark />}</div>
                  <span>{product?.name ?? "Product details unavailable"}<small>Qty {item.quantity}</small></span>
                  <span>{product?.priceGhs != null ? formatPrice(product.priceGhs * item.quantity) : "To be confirmed"}</span>
                </li>
              );
            })}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {saved > 0 && <div className="summary-saving"><dt>You save</dt><dd>{formatPrice(saved)}</dd></div>}
            <div><dt>Delivery</dt><dd>{fee === 0 ? "Free" : formatPrice(fee)}</dd></div>
            <div className="summary-total"><dt>Total</dt><dd>{formatPrice(total)}<Footnote n={1} /></dd></div>
          </dl>
          <Link className="link-chevron summary-back" href="/cart">Edit bag<Icon name="chevron" /></Link>
        </aside>
      </div>
    </div>
  );
}

/* ───────────────────────── order confirmation (test mode) ───────────────────────── */

const noopSubscribe = () => () => {};

export function OrderConfirmation() {
  const raw = useSyncExternalStore(noopSubscribe, () => { try { return window.sessionStorage.getItem("amofa-last-test-order-v1"); } catch { return null; } }, () => null);
  const order = useMemo(() => { try { return raw ? (JSON.parse(raw) as TestOrder) : null; } catch { return null; } }, [raw]);

  if (!order) {
    return (
      <PageIntro title="No recent order." tone="Orders you place in this browser will show here." lede="Fill your bag and go through checkout to see the confirmation.">
        <div className="intro-actions"><Link className="button button-primary" href="/shop">Start shopping</Link></div>
      </PageIntro>
    );
  }

  const placed = new Date(order.placedAt);
  const first = order.name.split(" ")[0] || "there";
  return (
    <div className="container confirmation">
      <p className="test-banner" role="note"><Icon name="help" /><span><strong>Test order.</strong> This was a simulated payment. No money was taken and AMOFA has not received this order.<Footnote n={3} /></span></p>
      <div className="confirm-hero">
        <span className="confirm-check" aria-hidden="true"><Icon name="check" /></span>
        <h1 className="page-title">Thank you, {first}. <span>Your order is placed.</span></h1>
        <p className="page-lede">We’ve sent the order details to {order.email || "your email"} (in test mode, nothing is actually sent).</p>
      </div>
      <div className="confirm-grid">
        <section className="confirm-card" aria-labelledby="order-number">
          <h2 id="order-number">Order {order.number}</h2>
          <dl className="confirm-facts">
            <div><dt>Placed</dt><dd>{placed.toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
            <div><dt>Paid with</dt><dd>{order.provider} · {order.momoNumber} (test)</dd></div>
            <div><dt>Delivery</dt><dd>{order.delivery.label}, {order.delivery.detail.toLowerCase()}</dd></div>
            <div><dt>Deliver to</dt><dd>{order.name}, {order.address}</dd></div>
          </dl>
        </section>
        <section className="confirm-card" aria-labelledby="order-items">
          <h2 id="order-items">Items</h2>
          <ul className="summary-items">
            {order.lines.map((line) => {
              const product = products.find((p) => p.slug === line.slug);
              return (
                <li key={line.slug}>
                  <div className="summary-art">{product ? <ProductRender product={product} /> : <BrandMark />}</div>
                  <span>{line.name}<small>Qty {line.quantity}</small></span>
                  <span>{formatPrice(line.priceGhs * line.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd>{order.deliveryFeeGhs === 0 ? "Free" : formatPrice(order.deliveryFeeGhs)}</dd></div>
            <div className="summary-total"><dt>Total paid (test)</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </section>
      </div>
      <div className="intro-actions confirm-actions">
        <Link className="button button-primary" href="/shop">Continue shopping</Link>
        <Link className="button button-secondary" href="/">Back to the store</Link>
      </div>
    </div>
  );
}

/* ───────────────────────── information pages ───────────────────────── */

const pageContent: Record<string, { title: string; tone: string; intro: string; sections: { icon: IconName; title: string; body: string }[] }> = {
  contact: {
    title: "Contact AMOFA.",
    tone: "We’re setting up our help channels.",
    intro: "Have a question about the collection? A public support email and phone number have not been supplied yet.",
    sections: [
      { icon: "chat", title: "This form is a preview", body: "The contact form does not send or store your message yet. When it is connected, this page will say so." },
      { icon: "help", title: "Looking for a quick answer?", body: "The FAQ covers prices, delivery, Mobile Money, and what is still being confirmed." },
    ],
  },
  "shipping-returns": {
    title: "Shipping & Returns.",
    tone: "Details for Ghana are on the way.",
    intro: "Delivery areas, shipping fees, timeframes, and return terms are not confirmed yet.",
    sections: [
      { icon: "truck", title: "Before placing an order", body: "This store preview does not accept or fulfil orders. AMOFA will publish confirmed Ghana delivery and returns information before checkout opens." },
      { icon: "reset", title: "Returns", body: "No warranty or return period has been confirmed. The final policy will appear here once approved." },
    ],
  },
  privacy: {
    title: "Privacy.",
    tone: "Draft, not final legal copy.",
    intro: "Privacy information is a placeholder and is not final legal copy.",
    sections: [
      { icon: "book", title: "Draft status", body: "AMOFA has not supplied its data controller details, contact information, retention policy, or service-provider list. This page must be completed and reviewed before collecting customer information." },
      { icon: "bag", title: "This preview", body: "The checkout and contact forms do not send or store the information entered into them. Bag items and saved products are stored in this browser only." },
    ],
  },
  terms: {
    title: "Terms & Conditions.",
    tone: "Draft, not final legal terms.",
    intro: "Terms shown here are not final legal terms.",
    sections: [
      { icon: "book", title: "Draft status", body: "Pricing, availability, order acceptance, payment, delivery, returns, and governing terms have not been supplied. This store preview does not accept orders or payments. Final terms must be published before sales begin." },
    ],
  },
};

export function InformationPage({ slug }: { slug: string }) {
  if (slug === "faq") {
    return (
      <>
        <PageIntro title="Questions? Answers." tone="What we know now, and what’s still pending." />
        <div className="container faq-page">
          <FaqList items={questions} />
          <InfoCard icon="chat" title="Still have a question?"><Link href="/contact">Contact AMOFA</Link> and tell us what you need.</InfoCard>
        </div>
        <QuickLinks />
      </>
    );
  }

  const page = pageContent[slug];
  if (!page) return null;

  return (
    <>
      <PageIntro title={page.title} tone={page.tone} lede={page.intro} />
      <div className="container info-page">
        {slug === "contact" && <ContactForm />}
        <div className="info-rows">
          {page.sections.map((section) => (
            <section className="info-row" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
      <QuickLinks />
    </>
  );
}

function ContactForm() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("The contact form isn’t connected yet. Your message was not sent or stored.");
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <Field label="Your name" name="name" autoComplete="name" />
        <Field label="Email address" name="email" type="email" autoComplete="email" inputMode="email" />
        <Field label="Message" name="message" textarea span />
      </div>
      <button className="button button-primary" type="submit">Check contact availability</button>
      {message && <p aria-live="polite" className="form-alert" role="status">{message}</p>}
    </form>
  );
}

/* ───────────────────────── quick links ───────────────────────── */

export function QuickLinks() {
  const links: [string, string][] = [["Shop all", "/shop"], ["Your bag", "/cart"], ["Delivery & returns", "/shipping-returns"], ["Questions & answers", "/faq"], ["Contact AMOFA", "/contact"]];
  return (
    <section className="container quick-links" aria-labelledby="quick-links-title">
      <h2 id="quick-links-title">Quick links</h2>
      <ul>{links.map(([label, href]) => <li key={href}><Link href={href}>{label}<Icon name="arrow" /></Link></li>)}</ul>
    </section>
  );
}
