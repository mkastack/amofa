"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import Image from "next/image";
import { ArtRender, ProductRender } from "@/components/renders";
import { ColourPencilsRender, CrayonsRender, ExerciseBookRender, GeometrySetRender } from "@/components/catalog-renders";
import { Shelf, ShelfItem } from "@/components/shelf";
import { CatalogCard, DemoStage, FaqList, Footnote, PriceTag, ProductTile, QuickLinks } from "@/components/storefront";
import { questions } from "@/lib/content";
import { FREE_DELIVERY_OVER_GHS } from "@/lib/checkout";
import { categories, categoryBlurb, formatPrice, getProduct, onDeal, products, type Category, type ProductArt } from "@/lib/products";

const categoryArt: Record<Category, ProductArt> = {
  Pencils: "colour-pencils",
  Erasers: "pencil-eraser",
  Sharpeners: "sharpener",
  Notebooks: "exercise-book",
  Geometry: "geometry-set",
  Art: "crayons",
  Cases: "pencil-case",
};

const deals = products.filter(onDeal);
const picks = products.filter((p) => p.tags?.includes("pick")).slice(0, 8);
const bestSaving = Math.max(...deals.map((p) => Math.floor((1 - (p.priceGhs ?? 0) / (p.compareAtGhs ?? 1)) * 100)));

function Newsletter() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Sign-up isn’t open yet. Your email was not stored or sent.");
  }
  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="container newsletter-inner">
        <h2 id="newsletter-title">Be first to know. <span>New products, deals, and back-to-school offers from AMOFA.</span></h2>
        <form onSubmit={submit} className="newsletter-form">
          <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Email address" required autoComplete="email" />
          <button className="button button-on-blue" type="submit">Keep me posted</button>
          <p className="newsletter-status" role="status" aria-live="polite">{message || "Sign-up opens soon. Nothing is stored yet."}</p>
        </form>
      </div>
    </section>
  );
}

export function HomePage() {
  const abacus = getProduct("iq-pencil");
  return (
    <div className="home">
      <section className="container shop-hero" aria-labelledby="hero-title">
        <div className="hero-banner">
          <div className="hero-copy">
            <h1 id="hero-title">Back to school, <span>sorted.</span></h1>
            <p>Pencils, exercise books, geometry sets and more for the new term, plus the first AMOFA ideas.</p>
            <div className="hero-actions">
              <Link className="button button-on-blue" href="/shop">Shop now</Link>
              <Link className="link-on-blue" href="/shop?deals=1">See deals<Icon name="chevron" /></Link>
            </div>
            <p className="hero-fineprint">Free standard delivery in Greater Accra over {formatPrice(FREE_DELIVERY_OVER_GHS)}<Footnote n={4} /></p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-piece piece-book"><ExerciseBookRender /></div>
            <div className="hero-piece piece-geo"><GeometrySetRender /></div>
            <div className="hero-piece piece-colour"><ColourPencilsRender /></div>
            <div className="hero-piece piece-crayons"><CrayonsRender /></div>
          </div>
        </div>
        <div className="hero-side">
          {abacus && (
            <article className="promo-tile tone-stone">
              <div className="promo-copy">
                <h2 className="tile-title"><Link className="tile-link" href="/products/iq-pencil">New: the AMOFA IQ Pencil™.</Link></h2>
                <PriceTag product={abacus} className="promo-price" />
                <span className="link-chevron">Shop now<Icon name="chevron" /></span>
              </div>
              <div className="promo-art promo-photo"><ProductRender product={abacus} sizes="(max-width: 1068px) 45vw, 200px" /></div>
            </article>
          )}
          <article className="promo-tile tone-blue">
            <div className="promo-copy">
              <h2 className="tile-title"><Link className="tile-link" href="/shop?deals=1">Deals up to {bestSaving}% off.</Link></h2>
              <p className="tile-text">Sample savings on school favourites.<Footnote n={1} /></p>
              <span className="link-chevron">Shop deals<Icon name="chevron" /></span>
            </div>
            <div className="promo-art"><CrayonsRender /></div>
          </article>
        </div>
      </section>

      <section className="container benefits" aria-label="Shopping with AMOFA">
        <ul>
          <li><Icon name="truck" /><span><strong>Delivery across Ghana</strong>Sample fees from {formatPrice(15)}</span></li>
          <li><Icon name="phone" /><span><strong>Pay with Mobile Money</strong>MTN MoMo, Telecel Cash, AT Money</span></li>
          <li><Icon name="pin" /><span><strong>Free pickup in Accra</strong>Ready the next working day</span></li>
          <li><Icon name="heart" /><span><strong>Save for later</strong>Favourites stay on this device</span></li>
        </ul>
      </section>

      <section className="container shop-categories" aria-labelledby="categories-title">
        <div className="section-head">
          <h2 className="shelf-title" id="categories-title">Shop by category. <span>Everything for the pencil case.</span></h2>
          <Link className="link-chevron shelf-link" href="/shop">Shop all<Icon name="chevron" /></Link>
        </div>
        <ul className="category-grid-shop">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c).length;
            return (
              <li key={c}>
                <Link className="category-card" href={`/shop?category=${c}`}>
                  <span className="category-card-art"><ArtRender art={categoryArt[c]} /></span>
                  <span className="category-card-name">{c === "Art" ? "Art & colour" : c}</span>
                  <span className="category-card-meta">{count} {count === 1 ? "item" : "items"}</span>
                  <span className="visually-hidden">{categoryBlurb[c]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Shelf id="deals" className="shelf-catalog" title={<>Deals for the new term. <span>Sample savings, while stocks last.</span></>} aside={<Link className="link-chevron shelf-link" href="/shop?deals=1">All deals<Icon name="chevron" /></Link>}>
        {deals.map((product) => (
          <ShelfItem key={product.slug}><CatalogCard product={product} /></ShelfItem>
        ))}
      </Shelf>

      <Shelf id="latest" title={<>New from AMOFA. <span>Two familiar tools, each with a new idea inside.</span></>}>
        {products.filter((p) => !p.sample).map((product) => (
          <ShelfItem key={product.slug}><ProductTile product={product} className="tile-tall" /></ShelfItem>
        ))}
        <ShelfItem>
          <Link href="/products/iq-pencil" className="tile tile-tall tile-photo">
            <h3 className="tile-title">Twelve to a box.</h3>
            <p className="tile-text">The IQ Pencil™ comes in boxes of 12, labelled “The Abacus Pencil”.</p>
            <span className="link-chevron">Shop the IQ Pencil™<Icon name="chevron" /></span>
            <span className="tile-photo-art"><Image src="/images/about/product/iq-pencil-display.jpg" alt="AMOFA IQ Pencil boxes beside a gold bowl of colourful pencils" fill sizes="(max-width: 600px) 84vw, 400px" style={{ objectFit: "cover", objectPosition: "center 60%" }} /></span>
          </Link>
        </ShelfItem>
        <ShelfItem>
          <Link href="/faq" className="tile tile-tall tile-blue tile-promo">
            <h3 className="tile-title">Pay with Mobile Money. <span>Try it in test mode.</span></h3>
            <p className="tile-text">Choose MTN MoMo, Telecel Cash, or AT Money at checkout and approve on your phone. No money is taken in this preview.</p>
            <ul className="provider-stack" aria-label="Mobile Money providers">
              <li><Icon name="phone" />MTN MoMo</li>
              <li><Icon name="phone" />Telecel Cash</li>
              <li><Icon name="phone" />AT Money</li>
            </ul>
            <span className="link-chevron">How payment works<Icon name="chevron" /></span>
          </Link>
        </ShelfItem>
        <ShelfItem>
          <Link href="/shipping-returns" className="tile tile-tall tile-dark tile-promo">
            <h3 className="tile-title">Free delivery in Greater Accra.</h3>
            <p className="tile-text">On orders over {formatPrice(FREE_DELIVERY_OVER_GHS)}, under this preview’s sample delivery terms.</p>
            <p className="price-glyph" aria-hidden="true">GH₵<span>150+</span></p>
            <span className="link-chevron">Delivery options<Icon name="chevron" /></span>
          </Link>
        </ShelfItem>
      </Shelf>

      <section className="container top-picks" aria-labelledby="picks-title">
        <div className="section-head">
          <h2 className="shelf-title" id="picks-title">Top picks for school. <span>The everyday kit, in one place.</span></h2>
          <Link className="link-chevron shelf-link" href="/shop">Shop all<Icon name="chevron" /></Link>
        </div>
        <div className="catalog-grid">
          {picks.map((product) => <CatalogCard key={product.slug} product={product} />)}
        </div>
      </section>

      <DemoStage />

      <section className="container faq-section" aria-labelledby="faq-title">
        <h2 className="shelf-title" id="faq-title">Questions? Answers. <span>Prices, delivery, and paying with Mobile Money.</span></h2>
        <FaqList items={questions.slice(0, 6)} />
        <p className="faq-more"><Link className="link-chevron" href="/faq">See all questions<Icon name="chevron" /></Link></p>
      </section>

      <Newsletter />
      <QuickLinks />
    </div>
  );
}
