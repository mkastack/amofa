"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { useSavedProducts } from "@/components/saved-products-provider";
import { Icon } from "@/components/icons";
import { ProductArtwork } from "@/components/product-art";
import { QuantityControl } from "@/components/quantity-control";
import { formatPrice, products } from "@/lib/products";

type NavLink = { label: string; href: string };
type NavSection = { title: string; links: NavLink[] };
const menus: Record<string, NavSection[]> = {
  Shop: [
    { title: "Explore the collection", links: [{ label: "Shop all stationery", href: "/shop" }, { label: "Abacus Pencil", href: "/products/abacus-pencil" }, { label: "Ink-Cleaning Eraser", href: "/products/ink-cleaning-eraser" }] },
    { title: "Shop by category", links: [{ label: "Pencils", href: "/shop?category=Pencils" }, { label: "Erasers", href: "/shop?category=Erasers" }] },
    { title: "A little guidance", links: [{ label: "About AMOFA", href: "/about" }, { label: "Shopping questions", href: "/faq" }, { label: "Delivery & returns", href: "/shipping-returns" }] },
  ],
  Pencils: [
    { title: "Explore pencils", links: [{ label: "All pencils", href: "/shop?category=Pencils" }, { label: "The Abacus Pencil", href: "/products/abacus-pencil" }] },
    { title: "Get to know AMOFA", links: [{ label: "Our approach", href: "/about" }, { label: "Product questions", href: "/faq" }] },
    { title: "More to explore", links: [{ label: "Ink-Cleaning Eraser", href: "/products/ink-cleaning-eraser" }, { label: "The full collection", href: "/shop" }] },
  ],
  Erasers: [
    { title: "Explore erasers", links: [{ label: "All erasers", href: "/shop?category=Erasers" }, { label: "The Ink-Cleaning Eraser", href: "/products/ink-cleaning-eraser" }] },
    { title: "A little guidance", links: [{ label: "Product questions", href: "/faq" }, { label: "Delivery & returns", href: "/shipping-returns" }] },
    { title: "More to explore", links: [{ label: "Abacus Pencil", href: "/products/abacus-pencil" }, { label: "The full collection", href: "/shop" }] },
  ],
  About: [
    { title: "Meet AMOFA", links: [{ label: "Our story", href: "/about" }, { label: "Get in touch", href: "/contact" }] },
    { title: "Customer information", links: [{ label: "Frequently asked questions", href: "/faq" }, { label: "Shipping & returns", href: "/shipping-returns" }] },
    { title: "The details", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms & conditions", href: "/terms" }] },
  ],
  Help: [
    { title: "How can we help?", links: [{ label: "Frequently asked questions", href: "/faq" }, { label: "Contact AMOFA", href: "/contact" }] },
    { title: "Shopping information", links: [{ label: "Delivery & returns", href: "/shipping-returns" }, { label: "Your cart", href: "/cart" }] },
    { title: "Before you choose", links: [{ label: "Explore the collection", href: "/shop" }, { label: "About AMOFA", href: "/about" }] },
  ],
};
const navigation = [
  { label: "Shop", href: "/shop", menu: "Shop" },
  { label: "Pencils", href: "/shop?category=Pencils", menu: "Pencils" },
  { label: "Erasers", href: "/shop?category=Erasers", menu: "Erasers" },
  { label: "About", href: "/about", menu: "About" },
  { label: "Help", href: "/faq", menu: "Help" },
  { label: "Contact", href: "/contact", menu: null },
];

function Announcement() {
  const [index, setIndex] = useState(0);
  const messages = ["Fresh ideas for everyday learning.", "Discover the first AMOFA collection.", "Stationery. Reimagined in Ghana."];
  return <div className="announcement"><button aria-label="Previous announcement" onClick={() => setIndex((index + 2) % 3)}><Icon name="arrow" /></button><p aria-live="polite">{messages[index]}</p><button aria-label="Next announcement" onClick={() => setIndex((index + 1) % 3)}><Icon name="arrow" /></button></div>;
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { saved, toggle: toggleSaved } = useSavedProducts();
  const savedDialog = useRef<HTMLDialogElement>(null);
  const cartDialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const header = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const skipFocusOpen = useRef(false);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const mobileSearchTrigger = useRef<HTMLButtonElement>(null);
  const { items, itemCount, ready, removeItem, updateQuantity } = useCart();

  function focusSearchTrigger() { (searchTrigger.current?.offsetParent ? searchTrigger.current : mobileSearchTrigger.current)?.focus(); }
  function cancelClose() { if (closeTimer.current) clearTimeout(closeTimer.current); }
  function closeNavigation() { cancelClose(); setActiveMenu(null); setSearchOpen(false); setMenuOpen(false); }
  function openMenu(name: string | null) { cancelClose(); setActiveMenu(name); setSearchOpen(false); }
  function scheduleClose() { cancelClose(); closeTimer.current = setTimeout(() => setActiveMenu(null), 160); }

  useEffect(() => { closeNavigation(); cartDialog.current?.close(); savedDialog.current?.close(); }, [pathname]); // Route changes dismiss every overlay.
  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (searchOpen) { setSearchOpen(false); focusSearchTrigger(); }
      if (activeMenu) { setActiveMenu(null); skipFocusOpen.current = true; trigger.current?.focus(); }
      setMenuOpen(false);
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [activeMenu, searchOpen]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    closeNavigation();
  }
  const results = products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const overlayOpen = !!activeMenu || searchOpen;
  useEffect(() => {
    if (!overlayOpen && !menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [overlayOpen, menuOpen]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const dismiss = () => closeNavigation();
    media.addEventListener("change", dismiss);
    return () => media.removeEventListener("change", dismiss);
  }, []);

  return <>
    <Announcement />
    <header ref={header} className={`site-header${overlayOpen ? " navigation-expanded" : ""}`} onPointerEnter={cancelClose} onPointerLeave={() => { if (activeMenu) scheduleClose(); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) closeNavigation(); }} onClickCapture={event => { if ((event.target as HTMLElement).closest("a[href]")) closeNavigation(); }}>
      <div className="header-inner">
        <button type="button" className="icon-button mobile-menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => {setMenuOpen(!menuOpen);setSearchOpen(false);setActiveMenu(null);}}><Icon name={menuOpen ? "close" : "menu"} /></button>
        <Link className="wordmark" href="/" aria-label="AMOFA home" onPointerEnter={() => openMenu(null)}><span className="logo-symbol" />amofa</Link>
        <nav className="plug-navigation" aria-label="Main navigation">
          {navigation.map(item => <Link key={item.label} id={`nav-${item.label.toLowerCase()}`} href={item.href} aria-current={item.label === "Contact" && pathname === "/contact" ? "page" : undefined} aria-expanded={item.menu ? activeMenu === item.menu : undefined} aria-controls={item.menu ? "mega-menu" : undefined} onPointerEnter={event => {if(event.pointerType === "mouse") {trigger.current=event.currentTarget;openMenu(item.menu);}}} onFocus={event => {trigger.current=event.currentTarget;if(skipFocusOpen.current){skipFocusOpen.current=false;return;}if(event.currentTarget.matches(":focus-visible")) openMenu(item.menu);}} onKeyDown={event => {if(event.key === "ArrowDown" && item.menu){event.preventDefault();trigger.current=event.currentTarget;openMenu(item.menu);requestAnimationFrame(()=>header.current?.querySelector<HTMLAnchorElement>(".mega-menu a")?.focus());}}}>{item.label}</Link>)}
        </nav>
        <div className="header-actions" onPointerEnter={() => {cancelClose();setActiveMenu(null);}}>
          <button ref={searchTrigger} type="button" className="icon-button search-trigger" aria-label="Search products" aria-expanded={searchOpen} aria-controls="search-panel" onClick={() => {cancelClose();setSearchOpen(!searchOpen);setActiveMenu(null);setMenuOpen(false);}}><Icon name="search" /></button>
          <button type="button" className="icon-button saved-trigger" aria-label={`Open saved products, ${saved.length} items`} onClick={() => {closeNavigation();savedDialog.current?.showModal();}}><Icon name="heart" /></button>
          <Link className="icon-button header-help" href="/contact" aria-label="Contact AMOFA"><Icon name="chat" /></Link>
          <button type="button" className="icon-button cart-trigger" aria-label={`Open cart, ${ready ? itemCount : 0} items`} onClick={() => {closeNavigation();cartDialog.current?.showModal();}}><Icon name="cart" />{ready && itemCount > 0 && <span className="cart-badge">{itemCount}</span>}</button>
        </div>
      </div>
      <button ref={mobileSearchTrigger} className="mobile-search-bar mobile-search-trigger" type="button" aria-label="Open product search" aria-expanded={searchOpen} aria-controls="search-panel" onClick={() => {setSearchOpen(true);setActiveMenu(null);setMenuOpen(false);}}><span>Search AMOFA</span><Icon name="search" /></button>
      {activeMenu && <div id="mega-menu" className="mega-menu apple-navigation-panel" aria-labelledby={`nav-${activeMenu.toLowerCase()}`} onPointerEnter={cancelClose}><div className="mega-menu-columns" key={activeMenu}>{menus[activeMenu].map((section,index) => <div className={index===0 ? "mega-primary" : "mega-secondary"} key={section.title}><p className="navigation-group-label">{section.title}</p>{section.links.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>)}</div><button type="button" className="icon-button mega-close" aria-label="Close menu" onClick={() => {setActiveMenu(null);skipFocusOpen.current=true;trigger.current?.focus();}}><Icon name="close" /></button></div>}
      {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <Link href={item.href} key={item.label}>{item.label}<Icon name="arrow" /></Link>)}<div className="mobile-product-links"><p>Explore the products</p>{products.map(product => <Link key={product.slug} href={`/products/${product.slug}`}>{product.name}</Link>)}</div><Link href="/shipping-returns">Shipping & returns</Link></nav>}
      {searchOpen && <section id="search-panel" className="search-panel apple-search-panel" aria-label="Search products"><form onSubmit={submitSearch}><Icon name="search" /><input ref={searchInput} name="q" type="search" placeholder="Search AMOFA" aria-label="Search products" value={query} onChange={event=>setQuery(event.target.value)} autoComplete="off" /><button className="icon-button search-submit" type="submit" aria-label="Submit search"><Icon name="arrow" /></button><button className="icon-button" type="button" aria-label="Close search" onClick={() => {setSearchOpen(false);focusSearchTrigger();}}><Icon name="close" /></button></form><div className="search-panel-content"><div className="search-quick-links"><h2>{query ? "Explore more" : "Quick links"}</h2>{[{label:"Shop all stationery",href:"/shop"},{label:"Pencils",href:"/shop?category=Pencils"},{label:"Erasers",href:"/shop?category=Erasers"},{label:"Contact AMOFA",href:"/contact"}].map(link=><Link href={link.href} key={link.href}><Icon name="arrow" />{link.label}</Link>)}</div><div className="search-products"><h2>{query ? `Results for “${query}”` : "Explore the collection"}</h2><div className="search-results" aria-live="polite">{results.map(product=><Link href={`/products/${product.slug}`} key={product.slug}><ProductArtwork product={product} /><span>{product.name}<small>{formatPrice(product.priceGhs)}</small></span><Icon name="arrow" /></Link>)}{!results.length && <div className="search-empty"><p>No products found.</p><span>Try “pencil” or “eraser”, or explore the collection.</span><Link href="/shop">Shop all stationery <Icon name="arrow" /></Link></div>}</div></div></div></section>}
    </header>
    {overlayOpen && <button className="navigation-scrim" type="button" tabIndex={-1} aria-label="Close navigation overlay" onClick={closeNavigation} />}
    <dialog ref={savedDialog} className="cart-drawer saved-drawer"><div className="drawer-inner"><div className="drawer-heading"><h2>Saved products ({saved.length})</h2><button className="icon-button" aria-label="Close saved products" onClick={() => savedDialog.current?.close()}><Icon name="close" /></button></div>{saved.length ? <div className="saved-products-list">{products.filter(p => saved.includes(p.slug)).map(p => <article key={p.slug}><Link href={`/products/${p.slug}`} onClick={() => savedDialog.current?.close()}><ProductArtwork product={p} /><h3>{p.name}</h3></Link><button className="remove-button" onClick={() => toggleSaved(p.slug)}>Remove from saved products</button></article>)}</div> : <div className="drawer-empty"><Icon name="heart" /><h3>Keep your next idea close.</h3><p>Tap the heart on a product to save it here.</p><Link href="/shop" className="button button-dark" onClick={() => savedDialog.current?.close()}>Explore the collection</Link></div>}</div></dialog>
    <dialog ref={cartDialog} className="cart-drawer" onClick={e => {if(e.target === e.currentTarget) cartDialog.current?.close();}}><div className="drawer-inner"><div className="drawer-heading"><h2>Your cart ({itemCount})</h2><button className="icon-button" aria-label="Close cart" onClick={() => cartDialog.current?.close()}><Icon name="close" /></button></div>{items.length ? <><div className="drawer-lines">{items.map(item => {const p = products.find(p => p.slug === item.slug);return p ? <article className="drawer-line" key={item.slug}><ProductArtwork product={p} /><div><Link href={`/products/${p.slug}`} onClick={() => cartDialog.current?.close()}>{p.name}</Link><p>{formatPrice(p.priceGhs)}</p><QuantityControl quantity={item.quantity} label={p.name} onChange={n => updateQuantity(p.slug,n)} /><button className="remove-button" onClick={() => removeItem(p.slug)}>Remove</button></div></article> : null;})}</div><div className="drawer-checkout"><div className="summary-row"><strong>Subtotal</strong><span>To be confirmed</span></div><p>Pricing and delivery will be confirmed before ordering.</p><Link className="button button-dark button-wide" href="/cart" onClick={() => cartDialog.current?.close()}>View cart <Icon name="arrow" /></Link><Link className="text-link" href="/checkout" onClick={() => cartDialog.current?.close()}>Continue to checkout</Link></div></> : <div className="drawer-empty"><Icon name="cart" /><h3>Your cart is waiting for its first idea.</h3><p>Find something for your everyday page.</p><Link className="button button-dark" href="/shop" onClick={() => cartDialog.current?.close()}>Explore AMOFA <Icon name="arrow" /></Link></div>}</div></dialog>
  </>;
}
