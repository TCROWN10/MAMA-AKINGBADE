import { NextResponse } from "next/server";
import { addReservation } from "@/lib/reservations";

export const runtime = "nodejs";

const PRICE_RANGES = new Set([
  "Under ₦30,000",
  "₦30,000 – ₦60,000",
  "₦60,000 – ₦100,000",
  "₦100,000+",
]);

type Body = {
  name?: string;
  telephone?: string;
  email?: string;
  arrivalDate?: string;
  departureDate?: string;
  daysToBook?: number;
  numberOfRooms?: number;
  peoplePerRoom?: number;
  totalPeopleNeedingStay?: number;
  priceRange?: string;
  hotelRating?: number;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const telephone = body.telephone?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const arrivalDate = body.arrivalDate ?? "";
  const departureDate = body.departureDate ?? "";
  const daysToBook = Number(body.daysToBook);
  const numberOfRooms = Number(body.numberOfRooms);
  const peoplePerRoom = Number(body.peoplePerRoom);
  const totalPeopleNeedingStay = Number(body.totalPeopleNeedingStay);
  const priceRange = body.priceRange?.trim() ?? "";
  const hotelRating = Number(body.hotelRating);

  if (!name || !telephone || !arrivalDate || !departureDate) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(daysToBook) || daysToBook < 1) {
    return NextResponse.json(
      { error: "Days to book must be at least 1." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(numberOfRooms) || numberOfRooms < 1) {
    return NextResponse.json(
      { error: "Number of rooms must be at least 1." },
      { status: 400 },
    );
  }

  if (peoplePerRoom < 1 || peoplePerRoom > 2) {
    return NextResponse.json(
      { error: "People in a room must be 1 or 2." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(totalPeopleNeedingStay) || totalPeopleNeedingStay < 1) {
    return NextResponse.json(
      { error: "Total people needing accommodation must be at least 1." },
      { status: 400 },
    );
  }

  if (!PRICE_RANGES.has(priceRange)) {
    return NextResponse.json(
      { error: "Please select a hotel price range." },
      { status: 400 },
    );
  }

  if (![1, 2, 3, 4, 5].includes(hotelRating)) {
    return NextResponse.json(
      { error: "Please select a hotel rating from 1 to 5 stars." },
      { status: 400 },
    );
  }

  if (new Date(departureDate) <= new Date(arrivalDate)) {
    return NextResponse.json(
      { error: "Departure date must be after arrival date." },
      { status: 400 },
    );
  }

  const reservation = await addReservation({
    name,
    telephone,
    email,
    arrivalDate,
    departureDate,
    daysToBook,
    numberOfRooms,
    peoplePerRoom,
    totalPeopleNeedingStay,
    priceRange,
    hotelRating,
  });

  return NextResponse.json({ ok: true, reservation }, { status: 201 });
}
