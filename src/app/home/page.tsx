import { FooterMarquee } from "@/components/FooterMarquee";
import { FullBleedPortrait } from "@/components/FullBleedPortrait";
import { RegisterCard } from "@/components/RegisterCard";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <div className="home-shell">
      <SiteHeader />

      <main>
        <section id="home" className="hero">
          <FullBleedPortrait priority />
          <div className="hero-veil" aria-hidden />
          <div className="hero-copy">
            <p className="hero-kicker">In loving memory</p>
            <h1>Mama Akingbade</h1>
            <p>
              A memorial space for Mama Akingbade. Accommodation registration
              is now closed; the site remains open for family and guests.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn-primary">
                Contact family
              </a>
            </div>
          </div>
        </section>

        <section id="accommodation" className="section band">
          <div className="section-inner narrow">
            <h2>Accommodation</h2>
            <p className="section-lead">
              Guest hotel registration for this gathering is no longer
              available. Existing arrangements stand; new requests are not
              being accepted.
            </p>
          </div>
        </section>

        <section className="section register-section">
          <div className="section-inner narrow">
            <h2>Registration</h2>
            <p className="section-lead">
              Online registration has closed. Thank you to everyone who
              already submitted their stay details.
            </p>
            <RegisterCard />
          </div>
        </section>

        <section id="contact" className="section band">
          <div className="section-inner narrow">
            <h2>Contact</h2>
            <p className="section-lead">
              Questions about your stay request? Reach the organizing family
              using the details below.
            </p>
            <div className="contact-block">
              <p className="contact-name">Wale Akingbade</p>
              <a className="contact-phone" href="tel:08024434252">
                08024434252
              </a>
            </div>
          </div>
        </section>
      </main>

      <FooterMarquee />
    </div>
  );
}
