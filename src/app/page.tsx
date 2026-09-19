import Link from "next/link";
import { FullBleedPortrait } from "@/components/FullBleedPortrait";

export default function SplashPage() {
  return (
    <main className="splash">
      <FullBleedPortrait priority />
      <div className="splash-veil" aria-hidden />
      <div className="splash-content">
        <p className="splash-kicker fade-up">Guest accommodation</p>
        <h1 className="splash-brand fade-up delay-1">Mama Akingbade</h1>
        <p className="splash-lead fade-up delay-2">
          Secure a hotel stay while we book on your behalf.
        </p>
        <Link href="/home" className="btn-primary splash-cta fade-up delay-3">
          Fill up for your accommodation
        </Link>
      </div>
    </main>
  );
}
