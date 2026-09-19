"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  name: string;
  telephone: string;
  email?: string;
  arrivalDate: string;
  departureDate: string;
  daysToBook: number;
  numberOfRooms: number;
  peoplePerRoom: number;
  totalPeopleNeedingStay: number;
  priceRange?: string;
  hotelRating?: number;
  createdAt: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Reservation[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(pw: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/list", {
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) {
        setAuthed(false);
        setError("Wrong password.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRows(data.reservations || []);
      setAuthed(true);
      sessionStorage.setItem("admin-pw", pw);
    } catch {
      setError("Could not load requests.");
    }
    setLoading(false);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-pw");
    if (saved) {
      setPassword(saved);
      void load(saved);
    }
  }, []);

  function downloadDoc() {
    const pw = password || sessionStorage.getItem("admin-pw") || "";
    window.location.href = `/api/admin/export?password=${encodeURIComponent(pw)}`;
  }

  if (!authed) {
    return (
      <main className="admin-page">
        <div className="admin-card">
          <h1>Organizer access</h1>
          <p>For family/organizers only — not for guests.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void load(password);
            }}
          >
            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Checking…" : "Open requests"}
            </button>
          </form>
          {error ? <p className="form-msg err">{error}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-top">
          <div>
            <h1>Guest stay requests</h1>
            <p>{rows.length} saved request(s)</p>
          </div>
          <div className="admin-actions">
            <button type="button" className="btn-primary" onClick={downloadDoc}>
              Download Word document
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => void load(password)}
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Telephone</th>
                <th>Email</th>
                <th>Arrival</th>
                <th>Departure</th>
                <th>Days</th>
                <th>Rooms</th>
                <th>Per room</th>
                <th>Total guests</th>
                <th>Price range</th>
                <th>Rating</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={12}>No requests yet.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.telephone}</td>
                    <td>{r.email || "—"}</td>
                    <td>{r.arrivalDate}</td>
                    <td>{r.departureDate}</td>
                    <td>{r.daysToBook}</td>
                    <td>{r.numberOfRooms ?? "—"}</td>
                    <td>{r.peoplePerRoom}</td>
                    <td>{r.totalPeopleNeedingStay}</td>
                    <td>{r.priceRange || "—"}</td>
                    <td>{r.hotelRating ? `${r.hotelRating}★` : "—"}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
