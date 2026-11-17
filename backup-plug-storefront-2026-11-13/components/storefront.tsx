"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { QuantityControl } from "@/components/quantity-control";
import { useSavedProducts } from "@/components/saved-products-provider";
import { useCart } from "@/components/cart-provider";
import { Icon } from "@/components/icons";
import { ProductArtwork } from "@/components/product-art";
import { formatPrice, products, type Product } from "@/lib/products";

function SiteFooter() {
  return (
    <><div className="footer-service-strip"><div><Icon name="pencil" /><h2>Fresh ideas, familiar tools</h2><p>Discover a new take on everyday stationery.</p></div><div><Icon name="pin" /><h2>For customers in Ghana</h2><p>Delivery details will be shared when confirmed.</p></div><div><Icon name="book" /><h2>Get to know the collection</h2><p>Explore product ideas and the latest details.</p></div><div><Icon name="chat" /><h2>Here for your questions</h2><p><Link href="/contact">Contact AMOFA</Link> to find out more.</p></div></div><footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark wordmark-footer" href="/">
            AMOFA
          </Link>
          <h2>About AMOFA</h2><p>We create innovative stationery and educational products for students, teachers, families, and curious minds.</p><p>Our first collection introduces the Abacus Pencil and Ink-Cleaning Eraser. Thoughtful ideas for the everyday page.</p><Link className="footer-contact" href="/contact">Let’s talk <Icon name="arrow" /></Link>
        </div>
        <div className="footer-links">
          <div>
            <h2>Quick links</h2>
            <Link href="/products/abacus-pencil">Abacus Pencil</Link>
            <Link href="/products/ink-cleaning-eraser">Ink-Cleaning Eraser</Link>
            <Link href="/shop">Shop all</Link>
            <Link href="/about">About AMOFA</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h2>Information</h2>
            <Link href="/faq">FAQ</Link>
            <Link href="/shipping-returns">Shipping &amp; Returns</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 AMOFA. All rights reserved.</span>
        <span>Ghana · GHS pricing to be confirmed</span>
      </div>
    </footer></>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { storageError } = useCart();
  return (
    <>
      <SiteHeader />
      {storageError && (
        <p className="storage-warning" role="alert">
          This browser could not save your bag. You can continue shopping, but
          your items may not remain after you leave.
        </p>
      )}
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}

function ProductPrice({ product }: { product: Pick<Product, "priceGhs"> }) {
  return (
    <span className="price-label">{formatPrice(product.priceGhs)}</span>
  );
}

function AddToBagButton({
  product,
  quantity = 1,
  className = "button button-dark",
}: {
  product: Product;
  quantity?: number;
  className?: string;
}) {
  const { addItem, ready, storageError } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    addItem(product.slug, quantity);
    setAdded(true);
  }

  return (
    <div className="add-action">
      <button
        className={className}
        disabled={!ready}
        onClick={add}
        type="button"
      >
        {ready ? (
          <>
            Add to bag <Icon name="arrow" />
          </>
        ) : (
          "Preparing bag…"
        )}
      </button>
      {added && (
        <p aria-live="polite" className="inline-feedback">
          {storageError
            ? "Added for this visit. The bag could not be saved in this browser."
            : `${product.name} added to your bag.`}
        </p>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { saved, toggle, persistenceError } = useSavedProducts();
  const isSaved = saved.includes(product.slug);
  return (
    <article className="product-card">
      <button className="product-save" aria-label={`${isSaved ? "Unsave" : "Save"} ${product.name}`} aria-pressed={isSaved} onClick={() => toggle(product.slug)}><Icon name="heart" /></button>
      {persistenceError && isSaved && <span className="save-notice" role="status">Saved for this visit</span>}
      <Link
        aria-label={`View ${product.name}`}
        className="product-card-art"
        href={`/products/${product.slug}`}
      >
        <ProductArtwork product={product} />
      </Link>
      <div className="product-card-info">
        <div>
          <p className="product-category">AMOFA · {product.category}</p>
          <h3>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <ProductPrice product={product} />
        </div>
        <AddToBagButton className="button button-dark" product={product} />
      </div>
    </article>
  );
}

function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export function ShopPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "All";
  return <ShopResults key={`${query}:${category}`} initialQuery={query} initialCategory={category} />;
}

function ShopResults({ initialQuery, initialCategory }: { initialQuery: string; initialCategory: string }) {
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState(["Pencils", "Erasers"].includes(initialCategory) ? initialCategory : "All");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const visible = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.shortDescription}`
          .toLocaleLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });

    if (sort === "name") {
      return [...visible].sort((a, b) => a.name.localeCompare(b.name));
    }
    return visible;
  }, [category, search, sort]);

  return (
    <div className="page-shell">
      <header className="page-heading shop-heading">
        <h1>The AMOFA collection</h1>
        <p>
          Explore the first two AMOFA products. Prices and full product details
          are still being confirmed.
        </p>
      </header>
      <div className="shop-tools">
        <div aria-label="Product categories" className="filter-list">
          {["All", "Pencils", "Erasers"].map((item) => (
            <button
              aria-pressed={category === item}
              className="filter-button"
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="shop-controls">
          <label className="search-field">
            <Icon name="search" />
            <span className="visually-hidden">Search products</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              type="search"
              value={search}
            />
          </label>
          <label className="sort-field">
            <span>Sort by</span>
            <select
              onChange={(event) => setSort(event.target.value)}
              value={sort}
            >
              <option value="featured">Featured</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      </div>
      <p aria-live="polite" className="results-count">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"}
      </p>
      {filteredProducts.length ? (
        <ProductGrid items={filteredProducts} />
      ) : (
        <div className="empty-results">
          <h2>No products match that search.</h2>
          <p>Try a different name or clear the current filters.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            type="button"
          >
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductPage({ product }: { product: Product }) {
  const { ready } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [galleryView, setGalleryView] = useState<"product" | "lifestyle">("product");

  function changeQuantity(next: number) {
    setQuantity(Math.max(1, Math.min(20, next)));
  }

  return (
    <>
      <div className="page-shell product-page">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <Link href="/shop">Shop</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>
        <div className="product-detail-layout">
          <section aria-label="Product imagery" className="product-gallery">
            <div className="product-gallery-main">
              <ProductArtwork detail product={product} lifestyle={galleryView === "lifestyle"} />
              <span className="gallery-note">Reference photography</span>
            </div>
            <div aria-label="Product image views" className="gallery-thumbs"><button className="photo-thumb" aria-pressed={galleryView === "product"} onClick={() => setGalleryView("product")}><ProductArtwork product={product} /><span>Reference view</span></button><button className="photo-thumb" aria-pressed={galleryView === "lifestyle"} onClick={() => setGalleryView("lifestyle")}><Image src="/images/desk.jpg" alt="Desktop stationery" width={100} height={80} /><span>Inspiration</span></button></div>
            <p className="gallery-pending">Reference photography. Official AMOFA product images coming soon.</p>
          </section>
          <section className="product-detail-copy">
            <p className="product-category">{product.category}</p>
            <h1>{product.name}</h1>
            <ProductPrice product={product} />
            <p className="product-description">{product.description}</p>
            <p className="detail-pending">
              Final specifications, materials, and availability are being
              confirmed.
            </p>
            <dl className="product-facts">
              <div>
                <dt>Product idea</dt>
                <dd>{product.shortDescription}</dd>
              </div>
              <div>
                <dt>Materials</dt>
                <dd>To be confirmed</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd>To be confirmed</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>To be confirmed</dd>
              </div>
            </dl>
            <div className="detail-actions">
              <div aria-label="Choose quantity" className="quantity-control">
                <button
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => changeQuantity(quantity - 1)}
                  type="button"
                >
                  <Icon name="minus" />
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  disabled={quantity >= 20}
                  onClick={() => changeQuantity(quantity + 1)}
                  type="button"
                >
                  <Icon name="plus" />
                </button>
              </div>
              <AddToBagButton
                className="button button-dark"
                product={product}
                quantity={quantity}
              />
            </div>
            {!ready && <p className="detail-pending">Preparing your bag…</p>}
            <div className="delivery-note">
              <h2>Delivery in Ghana</h2>
              <p>
                Delivery areas, fees, and timing will be published when
                confirmed. No shipping promise is being made yet.
              </p>
            </div>
            <details className="product-accordion">
              <summary>Product details</summary>
              <p>
                Product dimensions, materials, care, and use instructions have
                not been supplied yet.
              </p>
            </details>
          </section>
        </div>
        <section className="related-section">
          <div className="section-heading">
            <div>
              <h2>Keep exploring</h2>
              <p>See the other idea in the AMOFA collection.</p>
            </div>
          </div>
          <ProductGrid
            items={products.filter((item) => item.slug !== product.slug)}
          />
        </section>
      </div>
    </>
  );
}

export function CartPage() {
  const { items, ready, removeItem, updateQuantity } = useCart();

  if (!ready) {
    return (
      <div className="page-shell cart-page">
        <h1>Your cart</h1>
        <p aria-live="polite">Loading your saved items…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="page-shell cart-page cart-empty">
        <h1>Your cart is waiting for its first idea.</h1>
        <p>
          When something catches your eye, add it here and keep exploring.
        </p>
        <Link className="button button-dark" href="/shop">
          Explore the collection <Icon name="arrow" />
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell cart-page">
      <header className="page-heading">
        <h1>Your cart</h1>
        <p>{items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
      </header>
      <div className="cart-layout">
        <div className="cart-lines">
          {items.map((item) => {
            const product = products.find((entry) => entry.slug === item.slug);
            return (
              <article className="cart-line" key={item.slug}>
                <div className="cart-line-art">
                  {product ? (
                    <ProductArtwork product={product} />
                  ) : (
                    <div className="unknown-item-art">AMOFA</div>
                  )}
                </div>
                <div className="cart-line-info">
                  <div>
                    <p className="product-category">
                      {product?.category ?? "Saved item"}
                    </p>
                    <h2>{product?.name ?? "Product details unavailable"}</h2>
                    <ProductPrice product={product ?? { priceGhs: null }} />
                  </div>
                  <div className="cart-line-controls">
                    <QuantityControl
                      label={product?.name ?? "saved item"}
                      onChange={(quantity) =>
                        updateQuantity(item.slug, quantity)
                      }
                      quantity={item.quantity}
                    />
                    <button
                      aria-label={`Remove ${product?.name ?? "saved item"}`}
                      className="remove-button"
                      onClick={() => removeItem(item.slug)}
                      type="button"
                    >
                      <Icon name="remove" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside aria-labelledby="summary-heading" className="cart-summary">
          <h2 id="summary-heading">Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>To be confirmed</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>To be confirmed</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>To be confirmed</span>
          </div>
          <p className="summary-note">
            Prices and delivery charges are not available yet. Continuing will
            not place an order or start a payment.
          </p>
          <Link className="button button-dark button-wide" href="/checkout">
            Continue to checkout <Icon name="arrow" />
          </Link>
          <Link className="text-link summary-back" href="/shop">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { items, ready } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Payment is not connected. Your details were not sent, no order was placed, and no payment was made.",
    );
  }

  if (!ready) {
    return (
      <div className="page-shell checkout-page">
        <h1>Checkout</h1>
        <p aria-live="polite">Loading your bag…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="page-shell cart-empty">
        <h1>Your bag is empty.</h1>
        <p>Add a product before continuing to checkout.</p>
        <Link className="button button-dark" href="/shop">
          Explore the collection <Icon name="arrow" />
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell checkout-page">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link href="/cart">Your bag</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Checkout</span>
      </nav>
      <header className="page-heading">
        <h1>Checkout</h1>
        <p>
          Review your details and preferred payment option. This preview does
          not submit or store personal information.
        </p>
      </header>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Contact details</legend>
            <div className="form-grid">
              <label>
                Full name
                <input autoComplete="name" name="name" required />
              </label>
              <label>
                Email address
                <input
                  autoComplete="email"
                  name="email"
                  required
                  type="email"
                />
              </label>
              <label>
                Phone number
                <input
                  autoComplete="tel"
                  inputMode="tel"
                  name="phone"
                  placeholder="+233"
                  required
                  type="tel"
                />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Delivery address in Ghana</legend>
            <div className="form-grid">
              <label className="form-span">
                Street address
                <input
                  autoComplete="street-address"
                  name="address"
                  required
                />
              </label>
              <label>
                Town or city
                <input autoComplete="address-level2" name="city" required />
              </label>
              <label>
                Region
                <input autoComplete="address-level1" name="region" required />
              </label>
              <label className="form-span">
                Delivery notes <span className="optional-label">Optional</span>
                <textarea name="delivery-notes" rows={3} />
              </label>
            </div>
          </fieldset>
          <fieldset className="payment-fieldset">
            <legend>Mobile Money</legend>
            <p className="fieldset-intro">
              Choose a preferred provider for planning. None is connected yet.
            </p>
            {[
              ["mtn", "MTN MoMo"],
              ["telecel", "Telecel Cash"],
              ["at", "AT Money"],
            ].map(([value, label]) => (
              <label className="payment-option" key={value}>
                <input
                  checked={paymentMethod === value}
                  name="payment-method"
                  onChange={() => setPaymentMethod(value)}
                  type="radio"
                  value={value}
                />
                <span>{label}</span>
                <span className="pending-chip">Integration pending</span>
              </label>
            ))}
            <p className="integration-note">
              A payment provider must be selected and securely integrated
              before customers can pay.
            </p>
          </fieldset>
          <button className="button button-dark" type="submit">
            Check payment availability <Icon name="arrow" />
          </button>
          {message && (
            <p aria-live="polite" className="form-feedback form-feedback-alert">
              {message}
            </p>
          )}
        </form>
        <aside aria-labelledby="checkout-summary-heading" className="cart-summary checkout-summary">
          <h2 id="checkout-summary-heading">Order summary</h2>
          <ul className="checkout-items">
            {items.map((item) => {
              const product = products.find((entry) => entry.slug === item.slug);
              return (
                <li key={item.slug}>
                  <span>
                    {product?.name ?? "Product details unavailable"}{" "}
                    <span className="checkout-quantity">× {item.quantity}</span>
                  </span>
                  <span>To be confirmed</span>
                </li>
              );
            })}
          </ul>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>To be confirmed</span>
          </div>
          <p className="summary-note">
            GHS prices, taxes, and delivery charges will be shown when they are
            confirmed. No charge will be made here.
          </p>
        </aside>
      </div>
    </div>
  );
}

const pageContent: Record<
  string,
  { title: string; intro: string; sections: { title: string; body: string }[] }
> = {
  about: {
    title: "About AMOFA",
    intro:
      "AMOFA creates innovative stationery and educational products for students, families, teachers, and stationery buyers.",
    sections: [
      {
        title: "A thoughtful collection",
        body:
          "The AMOFA Abacus Pencil and Ink-Cleaning Eraser are the first products presented here. Their final specifications and the story behind their development will be shared when confirmed.",
      },
      {
        title: "Built around useful ideas",
        body:
          "Quality, simplicity, innovation, and reliability guide the brand. More about the people and process behind AMOFA will be added when those details are ready to share.",
      },
    ],
  },
  contact: {
    title: "Contact AMOFA",
    intro:
      "Have a question about the collection? Contact details are being confirmed.",
    sections: [
      {
        title: "Get in touch",
        body:
          "A public support email and phone number have not been supplied yet. This preview form does not send or store your message.",
      },
    ],
  },
  "shipping-returns": {
    title: "Shipping & Returns",
    intro:
      "Delivery areas, shipping fees, timeframes, and return terms are not confirmed yet.",
    sections: [
      {
        title: "Before placing an order",
        body:
          "This store preview does not accept or fulfill orders. AMOFA will publish the confirmed Ghana delivery and returns information before checkout becomes available.",
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    intro: "Privacy information is a placeholder and is not final legal copy.",
    sections: [
      {
        title: "Draft status",
        body:
          "AMOFA has not supplied its data controller details, contact information, retention policy, or service-provider list. This page must be completed and reviewed before collecting customer information.",
      },
      {
        title: "This preview",
        body:
          "The checkout and contact forms do not send or store the information entered into them. Cart items are stored locally in this browser only.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "Terms shown here are not final legal terms.",
    sections: [
      {
        title: "Draft status",
        body:
          "Pricing, availability, order acceptance, payment, delivery, returns, and governing terms have not been supplied. This store preview does not accept orders or payments. Final terms must be published before sales begin.",
      },
    ],
  },
};

const faqs = [
  {
    question: "How much do the AMOFA products cost?",
    answer:
      "Prices have not been supplied yet. Confirmed GHS prices will be shown before orders are enabled.",
  },
  {
    question: "What are the product specifications?",
    answer:
      "Materials, dimensions, and full use instructions are still being confirmed. No unverified specifications are listed here.",
  },
  {
    question: "Do you deliver across Ghana?",
    answer:
      "Delivery areas, fees, and timeframes have not been confirmed. Shipping information will be published before checkout becomes available.",
  },
  {
    question: "Can I pay with Mobile Money?",
    answer:
      "MTN MoMo, Telecel Cash, and AT Money are being considered. No provider is connected yet, so the checkout preview does not take payment.",
  },
];

export function InformationPage({ slug }: { slug: string }) {
  if (slug === "faq") {
    return (
      <div className="page-shell info-page">
        <header className="page-heading">
          <h1>Frequently asked questions</h1>
          <p>What we know about the collection, and what is still pending.</p>
        </header>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    );
  }

  const page = pageContent[slug];
  if (!page) return null;

  return (
    <div className="page-shell info-page">
      <header className="page-heading">
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </header>
      {slug === "contact" && <ContactForm />}
      <div className="info-sections">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
      {slug === "about" && (
        <Link className="button button-dark" href="/shop">
          Explore the collection <Icon name="arrow" />
        </Link>
      )}
    </div>
  );
}

function ContactForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "The contact form is not connected. Your message was not sent or stored.",
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Your name
        <input autoComplete="name" name="name" required />
      </label>
      <label>
        Email address
        <input
          autoComplete="email"
          name="email"
          required
          type="email"
        />
      </label>
      <label>
        Message
        <textarea name="message" required rows={5} />
      </label>
      <button className="button button-dark" type="submit">
        Check contact availability <Icon name="arrow" />
      </button>
      {message && (
        <p aria-live="polite" className="form-feedback">
          {message}
        </p>
      )}
    </form>
  );
}
