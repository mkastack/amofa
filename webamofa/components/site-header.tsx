"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { useSavedProducts } from "@/components/saved-products-provider";
import { Icon } from "@/components/icons";
import { BrandMark, ProductRender } from "@/components/renders";
import { QuantityControl } from "@/components/quantity-control";
import { formatPrice, plainText, products, type Category } from "@/lib/products";

type NavLink = { label: string; href: string };
type NavSection = { title: string; links: NavLink[] };

const productLink = (slug: string): NavLink => {
  const p = products.find((entry) => entry.slug === slug);
  return { label: p?.shortName ?? slug, href: `/products/${slug}` };
};
const categoryProducts = (c: Category) => products.filter((p) => p.category === c).map((p) => productLink(p.slug));
const shopAll = (c: Category, label: string): NavLink => ({ label, href: `/shop?category=${c}` });

const menus: Record<string, NavSection[]> = {
  Store: [
    { title: "Shop", links: [{ label: "Shop all", href: "/shop" }, shopAll("Pencils", "Pencils"), shopAll("Erasers", "Erasers"), shopAll("Notebooks", "Notebooks"), shopAll("Geometry", "Geometry"), shopAll("Art", "Art & colour"), shopAll("Sharpeners", "Sharpeners"), shopAll("Cases", "Cases")] },
    { title: "Quick links", links: [{ label: "Your bag", href: "/cart" }, { label: "Delivery & returns", href: "/shipping-returns" }, { label: "Contact AMOFA", href: "/contact" }] },
    { title: "Shopping help", links: [{ label: "Questions & answers", href: "/faq" }, { label: "Paying with Mobile Money", href: "/faq" }, { label: "Stock & availability", href: "/faq" }] },
  ],
  Pencils: [
    { title: "Explore pencils", links: [...categoryProducts("Pencils"), shopAll("Pencils", "Shop all pencils")] },
    { title: "Pair with", links: [productLink("twin-sharpener"), productLink("soft-pencil-eraser"), productLink("zip-pencil-case")] },
    { title: "Get to know it", links: [{ label: "Watch the IQ Pencil™ unveiled", href: "/products/iq-pencil#unveil" }, { label: "Try the abacus demo", href: "/products/iq-pencil#product-demo-title" }, { label: "Product questions", href: "/faq" }] },
  ],
  Erasers: [
    { title: "Explore erasers", links: [...categoryProducts("Erasers"), shopAll("Erasers", "Shop all erasers")] },
    { title: "Pair with", links: [productLink("hb-pencils-10"), productLink("exercise-book-80")] },
    { title: "Get to know it", links: [{ label: "Try the ink demo", href: "/products/dual-eraser#product-demo-title" }, { label: "Product questions", href: "/faq" }] },
  ],
  Notebooks: [
    { title: "Explore notebooks", links: [...categoryProducts("Notebooks"), shopAll("Notebooks", "Shop all notebooks")] },
    { title: "Pair with", links: [productLink("hb-pencils-10"), productLink("ruler-30cm"), productLink("soft-pencil-eraser")] },
  ],
  Geometry: [
    { title: "Explore geometry", links: [...categoryProducts("Geometry"), shopAll("Geometry", "Shop all geometry")] },
    { title: "Pair with", links: [productLink("maths-book-60"), productLink("twin-sharpener")] },
  ],
  Art: [
    { title: "Explore art & colour", links: [...categoryProducts("Art"), productLink("colour-pencils-12"), shopAll("Art", "Shop all art & colour")] },
    { title: "Pair with", links: [productLink("exercise-book-80"), productLink("zip-pencil-case")] },
  ],
  About: [
    { title: "Meet AMOFA", links: [{ label: "Our story", href: "/about" }, { label: "Get in touch", href: "/contact" }] },
    { title: "Customer information", links: [{ label: "Questions & answers", href: "/faq" }, { label: "Shipping & returns", href: "/shipping-returns" }] },
    { title: "The details", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms & conditions", href: "/terms" }] },
  ],
  Support: [
    { title: "How can we help?", links: [{ label: "Questions & answers", href: "/faq" }, { label: "Contact AMOFA", href: "/contact" }] },
    { title: "Shopping information", links: [{ label: "Delivery & returns", href: "/shipping-returns" }, { label: "Your bag", href: "/cart" }] },
    { title: "Before you choose", links: [{ label: "Shop all", href: "/shop" }, { label: "About AMOFA", href: "/about" }] },
  ],
};

const navigation = [
  { label: "Store", href: "/", menu: "Store" },
  { label: "Pencils", href: "/shop?category=Pencils", menu: "Pencils" },
  { label: "Erasers", href: "/shop?category=Erasers", menu: "Erasers" },
  { label: "Notebooks", href: "/shop?category=Notebooks", menu: "Notebooks" },
  { label: "Geometry", href: "/shop?category=Geometry", menu: "Geometry" },
  { label: "Art & colour", href: "/shop?category=Art", menu: "Art" },
  { label: "About", href: "/about", menu: "About" },
  { label: "Support", href: "/faq", menu: "Support" },
];

/* Entrance timing measured on apple.com's global nav: labels at .08 / .16 / .20s, links from .12s in .02s steps. */
const LABEL_DELAY = [80, 160, 200];
const LINK_BASE = [120, 180, 220];
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const announcements = [
  <>Back-to-school deals are on. <Link href="/shop?deals=1">Shop deals</Link></>,
  <>Free standard delivery in Greater Accra on orders over GH₵150. <Link href="/shipping-returns">Delivery options</Link></>,
  <>Pay with MTN MoMo, Telecel Cash, or AT Money. Checkout runs in test mode. <Link href="/faq">Learn more</Link></>,
];

function Announcement() {
  const [index, setIndex] = useState(0);
  return (
    <div className="announce">
      <div className="announce-inner">
        <button type="button" aria-label="Previous announcement" onClick={() => setIndex((index + announcements.length - 1) % announcements.length)}><Icon name="chevron" className="flip" /></button>
        <p aria-live="polite">{announcements[index]}</p>
        <button type="button" aria-label="Next announcement" onClick={() => setIndex((index + 1) % announcements.length)}><Icon name="chevron" /></button>
      </div>
    </div>
  );
}

function MenuColumns({ name }: { name: string }) {
  return (
    <>
      {menus[name].map((section, col) => (
        <div className={col === 0 ? "flyout-primary" : "flyout-secondary"} key={section.title}>
          <p className="flyout-label flyout-item" style={delay(LABEL_DELAY[col] ?? 200)}>{section.title}</p>
          <ul>
            {section.links.map((link, i) => (
              <li className="flyout-item" style={delay((LINK_BASE[col] ?? 220) + i * 20)} key={`${link.label}${link.href}`}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(52);
  const pathname = usePathname();
  const router = useRouter();
  const { saved, toggle: toggleSaved } = useSavedProducts();
  const savedDialog = useRef<HTMLDialogElement>(null);
  const bagDialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const header = useRef<HTMLElement>(null);
  const flyout = useRef<HTMLDivElement>(null);
  const flyoutInner = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const skipFocusOpen = useRef(false);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const { items, itemCount, ready, removeItem, updateQuantity } = useCart();

  const panel = searchOpen ? "search" : activeMenu;
  const open = panel !== null;
  // Keep the last panel's content on screen while the flyout closes, then let it go.
  if (panel && panel !== shown) setShown(panel);

  function clearTimers() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
  }
  function closeNavigation() { clearTimers(); setActiveMenu(null); setSearchOpen(false); setMenuOpen(false); }
  function openMenu(name: string | null) { clearTimers(); setActiveMenu(name); setSearchOpen(false); }
  function scheduleClose() { clearTimers(); closeTimer.current = setTimeout(() => setActiveMenu(null), 160); }
  /** Hover intent: a short pause before the first open, instant switching once a flyout is showing. */
  function hoverMenu(name: string | null) {
    clearTimers();
    if (!name) { if (activeMenu) closeTimer.current = setTimeout(() => setActiveMenu(null), 120); return; }
    if (open) { openMenu(name); return; }
    openTimer.current = setTimeout(() => openMenu(name), 70);
  }
  function measureTop() { setMenuTop(Math.max(0, header.current?.getBoundingClientRect().bottom ?? 52)); }
  function openPanel(dialog: HTMLDialogElement | null) {
    if (!dialog) return;
    dialog.style.setProperty("--flyout-top", `${Math.round(Math.max(0, header.current?.getBoundingClientRect().bottom ?? 44)) + 10}px`);
    dialog.showModal();
  }

  // Route changes dismiss every overlay: menu state resets during render, dialogs close in an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setActiveMenu(null);
    setSearchOpen(false);
    setMenuOpen(false);
  }
  useEffect(() => { bagDialog.current?.close(); savedDialog.current?.close(); }, [pathname]);
  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);
  useEffect(() => () => clearTimers(), []);

  // The flyout's height follows its content, so switching menus glides between sizes (Apple: .242s).
  useLayoutEffect(() => {
    const panelEl = flyout.current;
    const inner = flyoutInner.current;
    if (!panelEl) return;
    if (!open || !inner) { panelEl.style.height = "0px"; return; }
    const sync = () => { panelEl.style.height = `${inner.offsetHeight}px`; };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [open, shown]);

  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (searchOpen) { setSearchOpen(false); searchTrigger.current?.focus(); }
      if (activeMenu) { setActiveMenu(null); skipFocusOpen.current = true; trigger.current?.focus(); }
      setMenuOpen(false);
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [activeMenu, searchOpen]);

  useEffect(() => {
    if (!open && !menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open, menuOpen]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 833px)");
    const dismiss = () => { setActiveMenu(null); setSearchOpen(false); setMenuOpen(false); };
    media.addEventListener("change", dismiss);
    return () => media.removeEventListener("change", dismiss);
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    closeNavigation();
  }
  const q = query.trim().toLowerCase();
  const results = q ? products.filter((p) => plainText(`${p.name} ${p.category}`).toLowerCase().includes(q)).slice(0, 6) : products.filter((p) => !p.sample || p.slug === "geometry-set").slice(0, 3);

  return (
    <>
      <Announcement />
      <header
        ref={header}
        className={`global-nav${open || menuOpen ? " is-open" : ""}`}
        style={{ "--menu-top": `${menuTop}px` } as CSSProperties}
        onPointerEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
        onPointerLeave={() => { if (openTimer.current) clearTimeout(openTimer.current); if (activeMenu) scheduleClose(); }}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { setActiveMenu(null); setSearchOpen(false); } }}
        onClickCapture={(event) => { if ((event.target as HTMLElement).closest("a[href]")) closeNavigation(); }}
      >
        <nav className="nav-inner" aria-label="Main navigation">
          <Link className="nav-logo" href="/" aria-label="AMOFA store home" onPointerEnter={() => hoverMenu(null)}>
            <BrandMark />
            <Image src="/images/brand/logo-wordmark-white.png" width={1010} height={165} alt="" className="nav-wordmark" priority />
          </Link>
          <ul className="nav-links">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  id={`nav-${item.menu.toLowerCase()}`}
                  href={item.href}
                  className={activeMenu === item.menu ? "is-active" : undefined}
                  aria-current={item.href === "/" && pathname === "/" ? "page" : undefined}
                  aria-expanded={activeMenu === item.menu}
                  aria-controls="nav-flyout"
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") { trigger.current = event.currentTarget; hoverMenu(item.menu); } }}
                  onFocus={(event) => { trigger.current = event.currentTarget; if (skipFocusOpen.current) { skipFocusOpen.current = false; return; } if (event.currentTarget.matches(":focus-visible")) openMenu(item.menu); }}
                  onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); trigger.current = event.currentTarget; openMenu(item.menu); requestAnimationFrame(() => flyout.current?.querySelector<HTMLAnchorElement>("a")?.focus()); } }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions" onPointerEnter={() => hoverMenu(null)}>
            <button ref={searchTrigger} type="button" className="icon-button" aria-label="Search the store" aria-expanded={searchOpen} aria-controls="nav-flyout" onClick={() => { clearTimers(); measureTop(); setSearchOpen(!searchOpen); setActiveMenu(null); setMenuOpen(false); }}><Icon name="search" /></button>
            <button type="button" className="icon-button" aria-label={`Saved products, ${saved.length} ${saved.length === 1 ? "item" : "items"}`} onClick={() => { closeNavigation(); openPanel(savedDialog.current); }}>
              <Icon name="heart" />
              {saved.length > 0 && <span className="nav-count">{saved.length}</span>}
            </button>
            <button type="button" className="icon-button" aria-label={`Bag, ${ready ? itemCount : 0} ${itemCount === 1 ? "item" : "items"}`} onClick={() => { closeNavigation(); openPanel(bagDialog.current); }}>
              <Icon name="bag" />
              {ready && itemCount > 0 && <span className="nav-count">{itemCount}</span>}
            </button>
            <button type="button" className="icon-button menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls={menuOpen ? "mobile-menu" : undefined} onClick={() => { measureTop(); setMenuOpen(!menuOpen); setSearchOpen(false); setActiveMenu(null); }}>
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </nav>

        <div
          id="nav-flyout"
          ref={flyout}
          className={`flyout${open ? " is-open" : ""}`}
          aria-hidden={!open}
          inert={!open}
          onPointerEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
          onTransitionEnd={(event) => { if (event.target === event.currentTarget && !open) setShown(null); }}
        >
          <div ref={flyoutInner} className={`flyout-inner${shown === "search" ? " search-inner" : ""}`} key={shown ?? "none"}>
            {shown === "search" ? (
              <section aria-label="Search the store">
                <form onSubmit={submitSearch} className="search-form flyout-item" style={delay(40)} role="search">
                  <Icon name="search" />
                  <input ref={searchInput} name="q" type="search" placeholder="Search amofa" aria-label="Search the store" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
                  <button className="icon-button" type="button" aria-label="Close search" onClick={() => { setSearchOpen(false); searchTrigger.current?.focus(); }}><Icon name="close" /></button>
                </form>
                <p className="flyout-label flyout-item" style={delay(80)}>{q ? `Results for “${query}”` : "Quick links"}</p>
                <ul className="search-results" aria-live="polite">
                  {results.map((p, i) => (
                    <li className="flyout-item" style={delay(120 + i * 20)} key={p.slug}>
                      <Link href={`/products/${p.slug}`}>
                        <span className="search-thumb"><ProductRender product={p} /></span>
                        <span>{p.name}<small>{formatPrice(p.priceGhs)}</small></span>
                      </Link>
                    </li>
                  ))}
                  {!q && [["Shop all", "/shop"], ["Delivery & returns", "/shipping-returns"], ["Contact AMOFA", "/contact"]].map(([label, href], i) => (
                    <li className="flyout-item" style={delay(180 + i * 20)} key={href}><Link href={href} className="search-link"><Icon name="arrow" />{label}</Link></li>
                  ))}
                </ul>
                {q && !results.length && (
                  <div className="search-empty">
                    <p>No products match “{query}”.</p>
                    <p>Try “pencil”, “book”, or “ruler”, or <Link href="/shop">see the whole store</Link>.</p>
                  </div>
                )}
              </section>
            ) : shown ? (
              <MenuColumns name={shown} />
            ) : null}
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
            <ul className="mobile-primary">
              {navigation.map((item, i) => <li className="flyout-item" style={delay(60 + i * 30)} key={item.label}><Link href={item.href}>{item.label}</Link></li>)}
            </ul>
            <p className="flyout-label flyout-item" style={delay(300)}>The collection</p>
            <ul className="mobile-secondary">
              {products.filter((p) => !p.sample).map((p, i) => <li className="flyout-item" style={delay(330 + i * 30)} key={p.slug}><Link href={`/products/${p.slug}`}>{p.name}</Link></li>)}
              <li className="flyout-item" style={delay(390)}><Link href="/shop">Shop all products</Link></li>
              <li className="flyout-item" style={delay(420)}><Link href="/shipping-returns">Shipping &amp; returns</Link></li>
              <li className="flyout-item" style={delay(450)}><Link href="/contact">Contact AMOFA</Link></li>
            </ul>
          </nav>
        )}
      </header>
      <button className={`nav-scrim${open ? " is-visible" : ""}`} type="button" tabIndex={-1} aria-hidden="true" onClick={closeNavigation} />

      <dialog ref={savedDialog} className="bag-flyout" aria-labelledby="saved-title" onClick={(e) => { if (e.target === e.currentTarget) savedDialog.current?.close(); }}>
        <div className="bag-flyout-inner">
          <div className="bag-flyout-head">
            <h2 id="saved-title">Saved for later</h2>
            <button className="icon-button" type="button" aria-label="Close saved products" onClick={() => savedDialog.current?.close()}><Icon name="close" /></button>
          </div>
          {saved.length ? (
            <ul className="flyout-lines">
              {products.filter((p) => saved.includes(p.slug)).map((p) => (
                <li key={p.slug}>
                  <span className="flyout-thumb"><ProductRender product={p} /></span>
                  <div>
                    <Link href={`/products/${p.slug}`} onClick={() => savedDialog.current?.close()}>{p.name}</Link>
                    <small>{formatPrice(p.priceGhs)}</small>
                    <button className="text-button" type="button" onClick={() => toggleSaved(p.slug)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flyout-empty">
              <p>Nothing saved yet.</p>
              <p>Tap the heart on a product to keep it here on this device.</p>
              <Link href="/shop" className="link-chevron" onClick={() => savedDialog.current?.close()}>Explore the collection<Icon name="chevron" /></Link>
            </div>
          )}
        </div>
      </dialog>

      <dialog ref={bagDialog} className="bag-flyout" aria-labelledby="bag-title" onClick={(e) => { if (e.target === e.currentTarget) bagDialog.current?.close(); }}>
        <div className="bag-flyout-inner">
          <div className="bag-flyout-head">
            <h2 id="bag-title">{items.length ? "Bag" : "Your bag is empty."}</h2>
            <button className="icon-button" type="button" aria-label="Close bag" onClick={() => bagDialog.current?.close()}><Icon name="close" /></button>
          </div>
          {items.length ? (
            <>
              <ul className="flyout-lines">
                {items.map((item) => {
                  const p = products.find((entry) => entry.slug === item.slug);
                  if (!p) return null;
                  return (
                    <li key={item.slug}>
                      <span className="flyout-thumb"><ProductRender product={p} /></span>
                      <div>
                        <Link href={`/products/${p.slug}`} onClick={() => bagDialog.current?.close()}>{p.name}</Link>
                        <small>{formatPrice(p.priceGhs)}</small>
                        <div className="flyout-line-controls">
                          <QuantityControl quantity={item.quantity} label={p.name} onChange={(n) => updateQuantity(p.slug, n)} max={p.stock ?? 99} />
                          <button className="text-button" type="button" onClick={() => removeItem(p.slug)}>Remove</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link className="button button-primary button-wide" href="/cart" onClick={() => bagDialog.current?.close()}>Review bag</Link>
              <p className="flyout-note">Delivery and some prices will be confirmed before ordering opens.</p>
            </>
          ) : (
            <div className="flyout-empty">
              <p>Find something for your everyday page.</p>
              <Link href="/shop" className="link-chevron" onClick={() => bagDialog.current?.close()}>Explore the collection<Icon name="chevron" /></Link>
            </div>
          )}
          <ul className="flyout-account">
            <li><button type="button" onClick={() => { bagDialog.current?.close(); openPanel(savedDialog.current); }}><Icon name="heart" />Saved for later</button></li>
            <li><Link href="/faq" onClick={() => bagDialog.current?.close()}><Icon name="help" />Questions & answers</Link></li>
          </ul>
        </div>
      </dialog>
    </>
  );
}
