import { NextResponse } from "next/server";
import { buildReservationsDocx } from "@/lib/export-docx";
import { getReservations } from "@/lib/reservations";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.ADMIN_PASSWORD || "akingbade2026";
  const header = request.headers.get("x-admin-password") || "";
  const url = new URL(request.url);
  const query = url.searchParams.get("password") || "";
  return header === expected || query === expected;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reservations = await getReservations();
    const buffer = await buildReservationsDocx(reservations);
    const filename = `mama-akingbade-guest-stays-${new Date().toISOString().slice(0, 10)}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("admin export failed", error);
    return NextResponse.json(
      { error: "Could not export reservations." },
      { status: 500 },
    );
  }
}
