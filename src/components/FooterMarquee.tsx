"use client";

import { motion } from "framer-motion";

const LABEL = "MAMA AKINGBADE";

export function FooterMarquee() {
  const items = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="footer-marquee-item">
      {LABEL}
      <span className="footer-marquee-dot" aria-hidden>
        ·
      </span>
    </span>
  ));

  return (
    <footer className="site-footer">
      <div className="footer-marquee" aria-label="Mama Akingbade">
        <motion.div
          className="footer-marquee-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          <div className="footer-marquee-group">{items}</div>
          <div className="footer-marquee-group" aria-hidden>
            {items}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
