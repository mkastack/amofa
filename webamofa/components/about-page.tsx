import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";

/*
 * About AMOFA, set in the brand identity (navy #0E1C34, gold #FFBE0E, light yellow #FFF669, Open Sans).
 * Every photo is the owner's own (see public/images/about/SOURCES.md).
 */

const IMG = "/images/about";
const PHONE = "+233 53 503 2221";
const PHONE_HREF = "tel:+233535032221";

const team = [
  { src: `${IMG}/team/official-launch.jpg`, w: 810, h: 1080, alt: "Three members of the AMOFA team in AMOFA shirts, holding IQ Pencil boxes at the official AMOFA launch", caption: "The official AMOFA launch." },
  { src: `${IMG}/team/team.jpg`, w: 1500, h: 2000, alt: "Four members of the AMOFA team standing together in black AMOFA “Write It, Own It” shirts", caption: "The AMOFA team." },
  { src: `${IMG}/team/onua-showtime.jpg`, w: 1500, h: 2000, alt: "The AMOFA team in the studio of Onua TV’s Showtime with the show’s host, who holds AMOFA pencil boxes", caption: "On set at Onua TV’s Showtime." },
  { src: `${IMG}/team/founder-card.jpg`, w: 1080, h: 1080, alt: "Graphic introducing Nana Kofi Amofa, 17-year-old founder and CEO of AMOFA Inc., creator of the AMOFA IQ Pencil and AMOFA Dual Eraser", caption: "Meet the founder. Graphic © Skelvin Creative Studios." },
];

const packages = [
  {
    name: "Scholar Package",
    edition: "Creative Core Edition",
    card: { src: `${IMG}/product/rate-card-scholar.jpg`, w: 828, h: 1019 },
    features: ["Varieties of premium fragrances", "Sweet-scented and air-refreshing", "Aesthetic finish", "Unique ID code", "Long-lasting fragrance", "Mood-enhancing aroma effect", "Pre-sharpened pencil with eraser", "AMOFA name and logo", "Local name identification"],
  },
  {
    name: "Smart Package",
    edition: "Standard Edition",
    card: { src: `${IMG}/product/rate-card-smart.jpg`, w: 690, h: 813 },
    features: ["Premium craftsmanship", "AMOFA name and logo", "Unique ID code", "Variety of colours", "Pre-sharpened pencil with eraser"],
  },
];

const rationale = [
  { title: "Letter A", body: "The flowing form subtly shapes an “A,” linking directly to AMOFA for instant recognition." },
  { title: "Number 8", body: "The intertwined loop reflects “8,” symbolising infinity, timelessness, endless creativity, calculation, and strength." },
  { title: "Infinity & Flow", body: "The continuous loop conveys an unbroken flow of ideas, imagination, and creativity." },
];

const colours = [
  { name: "Black", hex: "#000000", cmyk: "0, 0, 0, 100", role: "Primary", ink: "light" },
  { name: "AMOFA Navy", hex: "#0E1C34", cmyk: "73, 46, 0, 80", role: "Primary", ink: "light" },
  { name: "AMOFA Gold", hex: "#FFBE0E", cmyk: "0, 25, 95, 0", role: "Primary", ink: "dark" },
  { name: "Light Yellow", hex: "#FFF669", cmyk: "0, 4, 59, 0", role: "Primary", ink: "dark" },
  { name: "Teal", hex: "#007575", cmyk: "100, 0, 0, 54", role: "Secondary", ink: "light" },
  { name: "Red", hex: "#D10700", cmyk: "0, 97, 100, 18", role: "Secondary", ink: "light" },
];

const mockups = [
  { src: `${IMG}/brand/pencil-mockup.jpg`, alt: "Two navy AMOFA pencils with gold logo marks and abacus dots", caption: "Pencil" },
  { src: `${IMG}/brand/packaging.jpg`, alt: "AMOFA “The Abacus Pencil” 12-pencil box with a colourful African-pattern top and base", caption: "Packaging" },
  { src: `${IMG}/brand/tshirt.jpg`, alt: "Navy t-shirt printed with the gold AMOFA logo and “Write It, Own It”", caption: "Apparel" },
  { src: `${IMG}/brand/business-card.jpg`, alt: "Navy AMOFA business card with a gold logo on dark textured foam", caption: "Business card" },
];

function Lockup({ size = "large" }: { size?: "large" | "small" }) {
  return (
    <div className={`amo-lockup amo-lockup-${size}`}>
      <Image src={`${IMG}/brand/logo-icon.png`} width={836} height={1000} alt="" className="amo-lockup-icon" priority={size === "large"} />
      <span className="amo-wordmark">AMOFA</span>
      <span className="amo-tagline">Write It, Own It</span>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="amo">
      <section className="amo-hero" aria-labelledby="about-title">
        <div className="container amo-hero-inner">
          <Lockup />
          <h1 id="about-title" className="amo-hero-title">About AMOFA. <span>Stationery for quick thinking and faster calculation.</span></h1>
          <p className="amo-hero-lede">AMOFA creates innovative stationery and educational products for students, families, and teachers in Ghana. It was founded by 17-year-old Nana Kofi Amofa, creator of the AMOFA IQ Pencil™ and the AMOFA Dual Eraser™.</p>
          <div className="amo-actions">
            <Link className="amo-button" href="/shop">Shop the collection</Link>
            <a className="amo-link" href="#team">Meet the team<Icon name="chevron" /></a>
          </div>
        </div>
      </section>

      <section className="container amo-founder" aria-labelledby="founder-title">
        <figure className="amo-founder-photo">
          <Image src={`${IMG}/team/founder-nana-kofi-amofa.jpg`} width={1080} height={1080} sizes="(max-width: 833px) 100vw, 520px" alt="Portrait of Nana Kofi Amofa, founder and CEO of AMOFA, in a white shirt in front of a navy patterned background" />
          <figcaption>Portrait © Skelvin Creative Studios</figcaption>
        </figure>
        <div className="amo-founder-copy">
          <h2 className="amo-title" id="founder-title">Meet Nana Kofi Amofa. <span>17-year-old Founder &amp; CEO, AMOFA Inc.</span></h2>
          <p>Nana Kofi created the AMOFA IQ Pencil™ and the AMOFA Dual Eraser™ to bring new ideas to the tools students reach for every day.</p>
          <dl className="amo-facts">
            <div><dt>Founder &amp; CEO</dt><dd>Nana Kofi Amofa</dd></div>
            <div><dt>Created</dt><dd>AMOFA IQ Pencil™, AMOFA Dual Eraser™</dd></div>
            <div><dt>Produced by</dt><dd>N.K.A. Enterprises</dd></div>
            <div><dt>Based in</dt><dd>Ghana</dd></div>
          </dl>
          <ul className="amo-values" aria-label="What guides AMOFA">
            <li>Quality</li><li>Simplicity</li><li>Innovation</li><li>Reliability</li>
          </ul>
        </div>
      </section>

      <section className="amo-team" id="team" aria-labelledby="team-title">
        <div className="container">
          <h2 className="amo-title amo-on-navy" id="team-title">The team behind AMOFA. <span>From the official launch to live TV.</span></h2>
          <div className="amo-team-grid">
            {team.map((photo) => (
              <figure className="amo-team-photo" key={photo.src}>
                <Image src={photo.src} width={photo.w} height={photo.h} sizes="(max-width: 600px) 100vw, (max-width: 1068px) 50vw, 290px" alt={photo.alt} />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container amo-product" aria-labelledby="product-title">
        <h2 className="amo-title" id="product-title">The AMOFA IQ Pencil™. <span>Sold as “The Abacus Pencil”, 12 to a box.</span></h2>
        <div className="amo-product-grid">
          <figure className="amo-product-main">
            <Image src={`${IMG}/product/iq-pencil-display-wide.jpg`} width={2000} height={1404} sizes="(max-width: 1068px) 100vw, 760px" alt="AMOFA IQ Pencil boxes on a glass table beside a gold bowl filled with colourful pencils" />
          </figure>
          <figure>
            <Image src={`${IMG}/product/iq-pencil-display.jpg`} width={1877} height={2000} sizes="(max-width: 1068px) 50vw, 380px" alt="Front and back of AMOFA IQ Pencil boxes, showing the 12-pencil count and the product description" />
          </figure>
          <figure>
            <Image src={`${IMG}/product/iq-pencil-boxes.jpg`} width={1400} height={1560} sizes="(max-width: 1068px) 50vw, 380px" alt="Close-up of open AMOFA IQ Pencil boxes with red, blue, and green pencils" />
          </figure>
          <blockquote className="amo-quote">
            <p>“A premium all-in-one pencil with a unique code, designed for quick thinking &amp; faster calculation using the abacus concept.”</p>
            <cite>From every IQ Pencil™ box</cite>
            <div className="amo-actions">
              <Link className="amo-button amo-button-navy" href="/products/iq-pencil">Shop the IQ Pencil™</Link>
              <Link className="amo-link amo-link-dark" href="/products/dual-eraser">See the Dual Eraser™<Icon name="chevron" /></Link>
            </div>
          </blockquote>
        </div>
      </section>

      <section className="amo-packages" aria-labelledby="packages-title">
        <div className="container">
          <h2 className="amo-title amo-on-navy" id="packages-title">Choose your package. <span>Two editions of the AMOFA pencil set.</span></h2>
          <div className="amo-package-grid">
            {packages.map((pack) => (
              <article className="amo-package" key={pack.name}>
                <div className="amo-package-copy">
                  <h3>{pack.name}<span>{pack.edition}</span></h3>
                  <ul>{pack.features.map((feature) => <li key={feature}><Icon name="check" />{feature}</li>)}</ul>
                </div>
                <a className="amo-package-card" href={pack.card.src} target="_blank" rel="noopener">
                  <Image src={pack.card.src} width={pack.card.w} height={pack.card.h} sizes="(max-width: 600px) 60vw, 220px" alt={`AMOFA ${pack.name} (${pack.edition}) rate card listing its features`} />
                  <span>View rate card<Icon name="arrow" /></span>
                </a>
              </article>
            ))}
          </div>
          <p className="amo-order">For prices, bulk purchases, and customisation, call <a href={PHONE_HREF}>{PHONE}</a>.</p>
        </div>
      </section>

      <section className="container amo-brand" aria-labelledby="brand-title">
        <div className="amo-rationale">
          <div className="amo-rationale-mark" aria-hidden="true">
            <Image src={`${IMG}/brand/logo-icon.png`} width={836} height={1000} alt="" sizes="320px" />
          </div>
          <div>
            <h2 className="amo-title" id="brand-title">The logo. <span>An A, an 8, and a loop that never ends.</span></h2>
            <ol className="amo-rationale-list">
              {rationale.map((item) => <li key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>)}
            </ol>
          </div>
        </div>

        <div className="amo-identity">
          <div>
            <h3 className="amo-subtitle">Brand colours</h3>
            <ul className="amo-swatches">
              {colours.map((c) => (
                <li key={c.hex} className={`amo-swatch ink-${c.ink}`} style={{ background: c.hex }}>
                  <span className="swatch-name">{c.name}</span>
                  <span className="swatch-meta">{c.hex}<br />CMYK {c.cmyk}</span>
                  <span className="swatch-role">{c.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="amo-type">
            <h3 className="amo-subtitle">Typography</h3>
            <div className="amo-type-card">
              <p className="amo-type-glyph" aria-hidden="true">Aa</p>
              <p className="amo-type-name">Open Sans</p>
              <p className="amo-type-set" aria-hidden="true">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm<br />Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz<br />123456789 @#$%^&amp;*()</p>
            </div>
          </div>
        </div>
      </section>

      <section className="amo-mockups" aria-labelledby="mockups-title">
        <div className="container">
          <h2 className="amo-title amo-on-navy" id="mockups-title">The brand in use. <span>On the pencil, the box, and beyond.</span></h2>
          <div className="amo-mockup-grid">
            {mockups.map((m) => (
              <figure key={m.src}>
                <Image src={m.src} width={1800} height={1080} sizes="(max-width: 833px) 100vw, 580px" alt={m.alt} />
                <figcaption>{m.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container amo-close" aria-labelledby="close-title">
        <Lockup size="small" />
        <h2 className="amo-close-title" id="close-title">Write it. Own it.</h2>
        <div className="amo-actions">
          <Link className="amo-button amo-button-navy" href="/shop">Shop the collection</Link>
          <a className="amo-link amo-link-dark" href={PHONE_HREF}>Call {PHONE}<Icon name="chevron" /></a>
        </div>
      </section>
    </div>
  );
}
