"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ReservationForm } from "./ReservationForm";

type Props = {
  defaultOpen?: boolean;
  compact?: boolean;
};

export function RegisterCard({ defaultOpen = false, compact = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#register") {
      setOpen(true);
    }
  }, []);

  return (
    <div className={`register-card ${open ? "is-open" : ""} ${compact ? "is-compact" : ""}`} id="register">
      <div className="register-card-head">
        <div className="register-card-icon" aria-hidden>
          <Image
            src="/mama-akingbade.jpg"
            alt=""
            width={44}
            height={44}
            className="register-card-photo"
          />
        </div>
        <div className="register-card-titles">
          <h3>Registration</h3>
          <p>GUEST ACCOMMODATION</p>
        </div>
      </div>

      <button
        type="button"
        className="register-dropdown-trigger"
        aria-expanded={open}
        aria-controls="register-dropdown-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          {open ? "Hide accommodation form" : "Fill up for your accommodation..."}
        </span>
        <span className={`register-chevron ${open ? "is-open" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      <div
        id="register-dropdown-panel"
        className="register-dropdown-panel"
        hidden={!open}
      >
        {open ? <ReservationForm embedded /> : null}
      </div>
    </div>
  );
}
