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
              This site helps guests request hotel accommodation. Our family
              will book your stay for you.
            </p>
            <div className="hero-actions">
              <a href="#register" className="btn-primary">
                Request accommodation
              </a>
            </div>
          </div>
        </section>

        <section id="accommodation" className="section band">
          <div className="section-inner narrow">
            <h2>Accommodation</h2>
            <p className="section-lead">
              Tell us your travel dates and how many people need a room. We
              handle the hotel booking manually from your request.
            </p>
            <ul className="plain-list">
              <li>Submit your details once — they are saved immediately.</li>
              <li>Rooms are planned for a maximum of 2 people each.</li>
              <li>You will be contacted if anything else is needed.</li>
            </ul>
          </div>
        </section>

        <section className="section register-section">
          <div className="section-inner narrow">
            <h2>Registration</h2>
            <p className="section-lead">
              Open the card below and fill in your stay details so we can book
              for you.
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
