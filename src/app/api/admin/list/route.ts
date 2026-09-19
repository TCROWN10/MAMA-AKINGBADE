import { NextResponse } from "next/server";
import { getReservations } from "@/lib/reservations";

export const runtime = "nodejs";

function expectedPassword() {
  return (process.env.ADMIN_PASSWORD || "akingbade2026").trim();
}

function authorized(request: Request) {
  const expected = expectedPassword();
  const url = new URL(request.url);
  const fromQuery = (url.searchParams.get("password") || "").trim();
  const fromHeader = (request.headers.get("x-admin-password") || "").trim();
  const auth = request.headers.get("authorization") || "";
  const fromBearer = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
  return [fromQuery, fromHeader, fromBearer].includes(expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const reservations = await getReservations();
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("admin list failed", error);
    return NextResponse.json(
      { error: "Could not load reservations." },
      { status: 500 },
    );
  }
}
