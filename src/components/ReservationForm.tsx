"use client";

import { useEffect, useMemo, useState } from "react";

type FormState = {
  name: string;
  telephone: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  daysToBook: string;
  numberOfRooms: string;
  peoplePerRoom: string;
  totalPeopleNeedingStay: string;
  priceRange: string;
  hotelRating: string;
};

const empty: FormState = {
  name: "",
  telephone: "",
  email: "",
  arrivalDate: "",
  departureDate: "",
  daysToBook: "1",
  numberOfRooms: "1",
  peoplePerRoom: "1",
  totalPeopleNeedingStay: "1",
  priceRange: "",
  hotelRating: "",
};

const PRICE_OPTIONS = [
  "Under ₦30,000",
  "₦30,000 – ₦60,000",
  "₦60,000 – ₦100,000",
  "₦100,000+",
] as const;

function nightsBetween(arrival: string, departure: string) {
  if (!arrival || !departure) return "";
  const start = new Date(arrival);
  const end = new Date(departure);
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
  return diff > 0 ? String(diff) : "";
}

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`field ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

function Stepper({
  value,
  min = 1,
  max,
  onChange,
  ariaLabel,
}: {
  value: string;
  min?: number;
  max?: number;
  onChange: (next: string) => void;
  ariaLabel: string;
}) {
  const n = Number(value) || min;

  function set(next: number) {
    let v = next;
    if (max != null) v = Math.min(max, v);
    v = Math.max(min, v);
    onChange(String(v));
  }

  return (
    <div className="stepper" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className="stepper-btn"
        aria-label="Decrease"
        onClick={() => set(n - 1)}
        disabled={n <= min}
      >
        −
      </button>
      <input
        className="stepper-value"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        className="stepper-btn"
        aria-label="Increase"
        onClick={() => set(n + 1)}
        disabled={max != null && n >= max}
      >
        +
      </button>
    </div>
  );
}

export function ReservationForm({
  compact = false,
  embedded = false,
}: {
  compact?: boolean;
  embedded?: boolean;
}) {
  const [form, setForm] = useState<FormState>(empty);
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const autoDays = useMemo(
    () => nightsBetween(form.arrivalDate, form.departureDate),
    [form.arrivalDate, form.departureDate],
  );

  useEffect(() => {
    if (autoDays) {
      setForm((prev) => ({ ...prev, daysToBook: autoDays }));
    }
  }, [autoDays]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    const peoplePerRoom = Number(form.peoplePerRoom);
    const totalPeopleNeedingStay = Number(form.totalPeopleNeedingStay);
    const daysToBook = Number(form.daysToBook);
    const numberOfRooms = Number(form.numberOfRooms);
    const hotelRating = Number(form.hotelRating);
    const submittedName = form.name.trim();

    if (peoplePerRoom < 1 || peoplePerRoom > 2) {
      setStatus("error");
      setMessage("People in a room must be 1 or 2.");
      return;
    }

    if (!Number.isFinite(numberOfRooms) || numberOfRooms < 1) {
      setStatus("error");
      setMessage("Number of rooms must be at least 1.");
      return;
    }

    if (!form.priceRange) {
      setStatus("error");
      setMessage("Please select a hotel price range.");
      return;
    }

    if (![1, 2, 3, 4, 5].includes(hotelRating)) {
      setStatus("error");
      setMessage("Please select a hotel rating.");
      return;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: submittedName,
          telephone: form.telephone.trim(),
          email: form.email.trim(),
          arrivalDate: form.arrivalDate,
          departureDate: form.departureDate,
          daysToBook,
          numberOfRooms,
          peoplePerRoom,
          totalPeopleNeedingStay,
          priceRange: form.priceRange,
          hotelRating,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not save. Please try again.");
        return;
      }
      setGuestName(submittedName);
      setForm(empty);
      setStatus("ok");
    } catch {
      setStatus("error");
      setMessage("Could not save. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div
        className={`thank-you ${compact || embedded ? "is-compact" : ""}`}
        role="status"
        aria-live="polite"
      >
        <p className="thank-you-kicker">Request received</p>
        <h3 className="thank-you-title">Thank you{guestName ? `, ${guestName}` : ""}</h3>
        <p className="thank-you-lead">
          Thank you for coming to honor Mama Akingbade. Your accommodation
          request has been saved, and we will book your hotel stay for you.
        </p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setStatus("idle");
            setGuestName("");
          }}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`reservation-form ${compact || embedded ? "is-compact" : ""} ${embedded ? "is-embedded" : ""}`}
    >
      <div className="form-grid">
        <Field label="Name">
          <input
            className="field-control"
            required
            name="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Tumininu Akingbade"
            autoComplete="name"
          />
        </Field>

        <Field label="Telephone no">
          <input
            className="field-control"
            required
            name="telephone"
            type="tel"
            value={form.telephone}
            onChange={(e) => update("telephone", e.target.value)}
            placeholder="e.g. +234 801 234 5678"
            autoComplete="tel"
          />
        </Field>

        <Field label="Email" hint="Optional">
          <input
            className="field-control"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="e.g. name@email.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Date of arrival">
          <div className="date-shell">
            <input
              className="field-control date-control"
              required
              name="arrivalDate"
              type="date"
              value={form.arrivalDate}
              onChange={(e) => update("arrivalDate", e.target.value)}
            />
          </div>
        </Field>

        <Field label="Departure date">
          <div className="date-shell">
            <input
              className="field-control date-control"
              required
              name="departureDate"
              type="date"
              value={form.departureDate}
              min={form.arrivalDate || undefined}
              onChange={(e) => update("departureDate", e.target.value)}
            />
          </div>
        </Field>

        <Field
          label="Days to book the hotel"
          hint="Fills in from your dates — you can still edit it"
        >
          <Stepper
            ariaLabel="Days to book"
            value={form.daysToBook}
            min={1}
            onChange={(v) => update("daysToBook", v)}
          />
        </Field>

        <Field label="How many rooms">
          <Stepper
            ariaLabel="How many rooms"
            value={form.numberOfRooms}
            min={1}
            onChange={(v) => update("numberOfRooms", v)}
          />
        </Field>

        <Field label="People in a room" hint="Maximum of 2 per room">
          <div
            className="choice-row"
            role="radiogroup"
            aria-label="People in a room"
          >
            {(["1", "2"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={form.peoplePerRoom === opt}
                className={`choice-chip ${form.peoplePerRoom === opt ? "is-active" : ""}`}
                onClick={() => update("peoplePerRoom", opt)}
              >
                <strong>{opt}</strong>
                <span>{opt === "1" ? "person" : "people"}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field
          className="full"
          label="How many people need accommodation"
        >
          <Stepper
            ariaLabel="Total people needing accommodation"
            value={form.totalPeopleNeedingStay}
            min={1}
            onChange={(v) => update("totalPeopleNeedingStay", v)}
          />
        </Field>

        <Field
          className="full"
          label="Hotel price range"
          hint="Per night, in Naira"
        >
          <div
            className="choice-row choice-row-wrap"
            role="radiogroup"
            aria-label="Hotel price range"
          >
            {PRICE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={form.priceRange === opt}
                className={`choice-chip choice-chip-wide ${form.priceRange === opt ? "is-active" : ""}`}
                onClick={() => update("priceRange", opt)}
              >
                <strong>{opt}</strong>
              </button>
            ))}
          </div>
        </Field>

        <Field
          className="full"
          label="Hotel rating"
          hint="Preferred star rating"
        >
          <div
            className="choice-row choice-row-stars"
            role="radiogroup"
            aria-label="Hotel rating"
          >
            {([1, 2, 3, 4, 5] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={form.hotelRating === String(opt)}
                className={`choice-chip ${form.hotelRating === String(opt) ? "is-active" : ""}`}
                onClick={() => update("hotelRating", String(opt))}
              >
                <strong>{opt}★</strong>
                <span>star{opt > 1 ? "s" : ""}</span>
              </button>
            ))}
          </div>
        </Field>
      </div>

      <button type="submit" className="btn-primary form-submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Submit accommodation request"}
      </button>

      {message ? (
        <p className="form-msg err" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
