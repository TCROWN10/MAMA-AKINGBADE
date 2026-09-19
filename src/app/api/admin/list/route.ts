import { NextResponse } from "next/server";
import { getReservations } from "@/lib/reservations";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.ADMIN_PASSWORD || "akingbade2026";
  const header = request.headers.get("x-admin-password") || "";
  return header === expected;
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
