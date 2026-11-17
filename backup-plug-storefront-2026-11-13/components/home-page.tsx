"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { ProductArtwork } from "@/components/product-art";
import { ProductCard } from "@/components/storefront";
import { products } from "@/lib/products";

const slides = [
  { title: "Everyday tools,\nAMOFA ideas.", body: "Discover a new take on stationery. Meet the Abacus Pencil and Ink-Cleaning Eraser — the beginning of the AMOFA collection.", href: "/shop", cta: "Shop the collection", image: "/images/stationery-cutout.png" },
  { title: "A fresh way\nto think pencil.", body: "Two familiar ideas, brought together. Get to know the AMOFA Abacus Pencil.", href: "/products/abacus-pencil", cta: "Explore the Abacus Pencil", image: "/images/pencils-cutout.png" },
  { title: "Make space\nfor new ideas.", body: "Discover the Ink-Cleaning Eraser, part of AMOFA’s first stationery collection.", href: "/products/ink-cleaning-eraser", cta: "Explore the eraser", image: "/images/eraser-cutout.png" },
];

const categories = [
  { title: "A fresh idea. A familiar pencil.", label: "Pencils", image: "/images/pencils-cutout.png", href: "/products/abacus-pencil" },
  { title: "A new chapter for corrections.", label: "Erasers", image: "/images/eraser-cutout.png", href: "/products/ink-cleaning-eraser" },
  { title: "Big questions start small.", label: "Learning", image: "/images/desk.jpg", href: "/shop" },
  { title: "For every everyday page.", label: "Writing", image: "/images/pencils-cutout.png", href: "/products/abacus-pencil" },
  { title: "Meet your next pencil-case idea.", label: "School essentials", image: "/images/stationery.jpg", href: "/shop" },
  { title: "Thoughtful tools. Curious minds.", label: "Explore AMOFA", image: "/images/desk.jpg", href: "/about" },
];

const notes = [
  { title: "Two familiar ideas, brought together.", body: "The Abacus Pencil is AMOFA’s starting point for rethinking familiar stationery. Explore the idea and see the latest product details.", product: products[0], label: "Inside the collection" },
  { title: "A fresh page starts with curiosity.", body: "The Ink-Cleaning Eraser is the second idea in our first collection. Materials, specifications, and use guidance will be shared when confirmed.", product: products[1], label: "Meet the product" },
  { title: "Get to know AMOFA.", body: "Quality, simplicity, innovation, and reliability guide our approach to stationery and educational products for Ghana.", product: products[0], label: "Our approach" },
];

const questions = [
  ["What is the AMOFA collection?", "Our first collection introduces the AMOFA Abacus Pencil and Ink-Cleaning Eraser — two new stationery ideas for students, teachers, and curious minds."],
  ["What is the Abacus Pencil?", "The Abacus Pencil brings a pencil and an abacus idea together. Confirmed specifications and use guidance will be added to its product page."],
  ["What is the Ink-Cleaning Eraser?", "It is the second product in AMOFA’s first stationery collection. Its materials, mechanism, and use instructions are still being confirmed."],
  ["Who is AMOFA for?", "Students and families in Ghana, alongside teachers and other stationery buyers."],
  ["How much do the products cost?", "Final prices are not available yet. Confirmed pricing will be displayed in Ghana cedis (GHS)."],
  ["Can I order right now?", "The store is currently a preview. You can explore products and use the cart, but checkout does not place an order or collect payment."],
  ["Where will AMOFA deliver?", "AMOFA is being built for customers in Ghana. Delivery areas, fees, and timing will be published once confirmed."],
  ["Will Mobile Money be available?", "MTN MoMo, Telecel Cash, and AT Money are under consideration. No payment provider is connected yet."],
  ["Are these photographs of the actual products?", "The site uses real stationery reference photography. Official AMOFA product photos will replace these images when available."],
  ["Where can I find returns information?", "Our Shipping & Returns page will carry the final policy when approved. No warranty or return period has been confirmed yet."],
];

function CarouselArrow({ direction, onClick, label }: { direction: "previous" | "next"; onClick: () => void; label: string }) {
  return <button className={`round-arrow arrow-${direction}`} aria-label={label} onClick={onClick}><Icon name="arrow" /></button>;
}

function CollectionCarousel() {
  const track = useRef<HTMLDivElement>(null);
  function move(direction: number) { track.current?.scrollBy({ left: direction * 480, behavior: "smooth" }); }
  return <section className="reference-categories" aria-labelledby="categories-heading">
    <h2 id="categories-heading" className="reference-title">Explore our everyday essentials</h2>
    <div className="category-carousel"><div className="reference-category-track" ref={track}>{categories.map((category) => <Link href={category.href} className="reference-category-card" key={category.label}><h3>{category.label}<span>{category.title}</span></h3><div className="category-photo"><Image src={category.image} alt={`${category.label} stationery inspiration`} fill sizes="(max-width:760px) 45vw, 33vw" /></div></Link>)}</div><div className="category-arrows"><CarouselArrow direction="previous" label="Previous categories" onClick={() => move(-1)} /><CarouselArrow direction="next" label="Next categories" onClick={() => move(1)} /></div></div>
  </section>;
}

function AngledCollection() {
  const [selected, setSelected] = useState(0);
  return <section className="angled-collection" aria-labelledby="featured-heading">
    <h2 id="featured-heading" className="reference-title">Meet your next everyday idea</h2><p>Two stationery ideas. One AMOFA collection.</p>
    <div className="angled-stage"><div className="angled-preview preview-far-left" aria-hidden="true"><ProductArtwork product={products[selected]} /><span>{products[selected].name}</span></div><button className="angled-preview preview-left" aria-label={`Feature ${products[1-selected].name}`} onClick={() => setSelected(1-selected)}><ProductArtwork product={products[1-selected]} /><span>{products[1-selected].name}</span></button><div className="angled-center"><ProductCard product={products[selected]} /></div><button className="angled-preview preview-right" aria-label={`Feature ${products[1-selected].name}`} onClick={() => setSelected(1-selected)}><ProductArtwork product={products[1-selected]} /><span>{products[1-selected].name}</span></button><div className="angled-preview preview-far-right" aria-hidden="true"><ProductArtwork product={products[selected]} /><span>{products[selected].name}</span></div></div>
    <div className="angled-dots">{products.map((product,index) => <button key={product.slug} aria-label={`Feature ${product.name}`} aria-pressed={selected===index} onClick={() => setSelected(index)} />)}</div><Link href="/shop" className="button button-mint">Explore the collection</Link>
  </section>;
}

function FeaturedPicks() {
  const [category, setCategory] = useState("All");
  const items = products.filter(p => category === "All" || p.category === category);
  return <section className="reference-picks" id="collection"><h2 className="reference-title">Stationery you’ll love — picks for you</h2><div className="reference-tabs" aria-label="Featured product categories">{["All", "Pencils", "Erasers"].map(item => <button aria-pressed={category === item} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="reference-picks-track" aria-live="polite">{items.map(p => <ProductCard product={p} key={p.slug} />)}<Link href="/about" className="collection-story-card"><div><Image src="/images/desk.jpg" alt="Pencils laid out for a new page" fill sizes="(max-width:760px) 80vw, 30vw" /></div><h3>Thoughtful ideas for the everyday page.</h3><span>Discover the AMOFA story <Icon name="arrow" /></span></Link></div><Link className="button button-dark reference-view-all" href="/shop">View all</Link></section>;
}

function BrandStory() {
  return <section className="reference-brand"><div className="reference-brand-photo"><Image src="/images/stationery.jpg" alt="A pencil case and stationery on a white desk" fill sizes="(max-width:760px) 100vw, 50vw" /><span>Real stationery inspiration · official AMOFA photography coming soon</span></div><div className="reference-brand-copy"><h2>Your connection to thoughtful, everyday stationery.</h2><p>We believe familiar tools can make room for new ideas. AMOFA is building stationery and educational products around quality, simplicity, and curiosity.</p><div className="brand-points"><article><Icon name="pencil" /><div><h3>A fresh take on familiar tools</h3><p>Meet our Abacus Pencil and Ink-Cleaning Eraser.</p></div></article><article><Icon name="book" /><div><h3>For learning and everyday life</h3><p>Ideas for students, teachers, families, and curious minds.</p></div></article><article><Icon name="pin" /><div><h3>Made with Ghana in mind</h3><p>A straightforward store with pricing in GHS when confirmed.</p></div></article></div><Link className="button button-dark" href="/about">Learn more</Link></div></section>;
}

function ProductNotes() {
  const track = useRef<HTMLDivElement>(null);
  return <section className="reference-notes"><h2 className="reference-title">Small ideas. Everyday possibilities.</h2><p className="section-description">A closer look at AMOFA. Product notes, rather than customer reviews.</p><div className="notes-carousel"><div className="notes-track" ref={track}>{notes.map(note => <article className="note-card" key={note.title}><div className="note-card-top"><span>{note.label}</span><div><ProductArtwork product={note.product} /></div></div><h3>{note.title}</h3><p>{note.body}</p><div className="note-card-bottom"><span>{note.product.name}</span><Link href={note.label === "Our approach" ? "/about" : `/products/${note.product.slug}`}>Explore <Icon name="arrow" /></Link></div></article>)}</div><CarouselArrow direction="previous" label="Previous product notes" onClick={() => track.current?.scrollBy({left:-430,behavior:"smooth"})} /><CarouselArrow direction="next" label="Next product notes" onClick={() => track.current?.scrollBy({left:430,behavior:"smooth"})} /></div></section>;
}

function Community() {
  const track = useRef<HTMLDivElement>(null);
  const scenes = [{image:"/images/pencils.jpg",title:"A fresh perspective",product:products[0]},{image:"/images/stationery.jpg",title:"Everyday essentials",product:products[1]},{image:"/images/desk.jpg",title:"Room for curiosity",product:products[0]},{image:"/images/stationery.jpg",title:"The next chapter",product:products[1]}];
  return <section className="reference-community"><div className="community-heading"><h2 className="reference-title">A little everyday AMOFA inspiration</h2><p>Ideas for the desk, the pencil case, and the page.</p></div><div className="community-carousel"><div className="community-track" ref={track}>{scenes.map(scene => <Link href={`/products/${scene.product.slug}`} className="community-card" key={scene.title}><div className="community-image"><Image src={scene.image} alt={scene.title+" — reference stationery photography"} fill sizes="(max-width:760px) 75vw, 24vw" /><span>{scene.title}</span></div><div className="community-product"><span>{scene.product.name}<small>Explore the product</small></span><Icon name="plus" /></div></Link>)}</div><CarouselArrow direction="previous" label="Previous inspiration" onClick={() => track.current?.scrollBy({left:-320,behavior:"smooth"})} /><CarouselArrow direction="next" label="Next inspiration" onClick={() => track.current?.scrollBy({left:320,behavior:"smooth"})} /></div></section>;
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="reference-faq"><h2 className="reference-title">Frequently Asked Questions</h2><div className="reference-accordion">{questions.map(([question,answer],i) => <div className="reference-question" key={question}><h3><button aria-expanded={open===i} aria-controls={`answer-${i}`} onClick={() => setOpen(open===i?null:i)}>{question}<Icon name={open===i?"minus":"plus"} /></button></h3><div id={`answer-${i}`} hidden={open!==i}><p>{answer}</p></div></div>)}</div></section>;
}

function Journal() {
  const articles = [{image:"/images/pencils.jpg",title:"Meet the AMOFA Abacus Pencil",text:"Two familiar ideas come together in the first AMOFA pencil. Explore the product and its latest details.",href:"/products/abacus-pencil"},{image:"/images/stationery.jpg",title:"A new idea for your pencil case",text:"Get to know the Ink-Cleaning Eraser, the second idea in our first stationery collection.",href:"/products/ink-cleaning-eraser"},{image:"/images/desk.jpg",title:"The ideas behind AMOFA",text:"Quality, simplicity, innovation, and reliability. Discover the approach behind our everyday tools.",href:"/about"}];
  return <section className="reference-journal"><h2 className="reference-title">The AMOFA journal</h2><div className="journal-track">{articles.map(article => <Link href={article.href} className="journal-card" key={article.title}><div className="journal-image"><Image src={article.image} alt="Stationery reference photography" fill sizes="(max-width:760px) 85vw, 33vw" /></div><div className="journal-copy"><h3>{article.title}</h3><p>{article.text}</p><span>Read more <Icon name="arrow" /></span></div></Link>)}</div><Link href="/about" className="button button-dark reference-view-all">Discover AMOFA</Link></section>;
}

function Newsletter() {
  const [message,setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {event.preventDefault();setMessage("Sign-up opens soon. Your email has not been stored or sent.");}
  return <section className="reference-newsletter"><div><h2>Keep up with our next great ideas.</h2><p>Discover collection news and fresh stationery ideas. Newsletter sign-up will open soon.</p><form onSubmit={submit}><label className="visually-hidden" htmlFor="reference-newsletter-email">Email address</label><input id="reference-newsletter-email" type="email" placeholder="Enter email" required autoComplete="email" /><button className="button button-dark" type="submit">Keep me posted</button>{message && <p role="status">{message}</p>}</form></div><div className="newsletter-photo"><Image src="/images/stationery-cutout.png" alt="Stationery arranged for a new school day" fill sizes="(max-width:760px) 90vw, 45vw" /></div></section>;
}

export function HomePage() {
  const [slide,setSlide] = useState(0);
  const [playing,setPlaying] = useState(true);
  useEffect(() => {if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;const timer=window.setInterval(()=>setSlide(n=>(n+1)%slides.length),7000);return ()=>window.clearInterval(timer);},[playing]);
  const current=slides[slide];
  return <div className="reference-home">
    <section className={`reference-hero campaign-${slide}`} aria-roledescription="carousel" aria-label="Discover AMOFA"><div className="reference-hero-inner" key={slide}><div className="reference-hero-copy"><h1>{current.title.split("\n").map(line=><span key={line}>{line}</span>)}</h1><p>{current.body}</p><Link href={current.href} className="button button-dark">{current.cta}</Link></div><div className="reference-hero-media"><Image src={current.image} alt="Real stationery reference photograph" fill sizes="(max-width:760px) 100vw, 48vw" priority /><span>Stationery reference photo · AMOFA photography coming soon</span></div></div><div className="carousel-controls"><button className="carousel-pause" aria-label={playing?"Pause slideshow":"Play slideshow"} onClick={()=>setPlaying(!playing)}><Icon name={playing?"pause":"play"} /></button>{slides.map((item,i)=><button key={item.href} className="carousel-indicator" aria-label={`Show slide ${i+1}`} aria-pressed={slide===i} onClick={()=>setSlide(i)} />)}</div></section>
    <div className="retail-benefits"><span><Icon name="pencil" />Fresh stationery ideas</span><span><Icon name="book" />For school & everyday learning</span><span><Icon name="pin" />Discover AMOFA in Ghana</span><Link href="/contact"><Icon name="chat" />Here for your questions</Link></div>
    <CollectionCarousel /><AngledCollection /><FeaturedPicks /><BrandStory /><ProductNotes /><Community />
    <section className="reference-banner"><Image src="/images/desk.jpg" alt="Pencils on a tabletop" fill sizes="100vw" /><div><h2>Small tools can open up a world of ideas.</h2><p>Let curiosity be part of the everyday.</p><Link href="/about" className="text-link">Discover AMOFA <Icon name="arrow" /></Link></div></section>
    <FAQ /><Journal /><Newsletter />
  </div>;
}
