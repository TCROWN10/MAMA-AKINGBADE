import { promises as fs } from "fs";
import os from "os";
import path from "path";

export type Reservation = {
  id: string;
  name: string;
  telephone: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  daysToBook: number;
  numberOfRooms: number;
  peoplePerRoom: number;
  totalPeopleNeedingStay: number;
  priceRange: string;
  hotelRating: number;
  createdAt: string;
};

function dataFilePath() {
  // Vercel’s app directory is read-only; use /tmp for writable storage.
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "mama-akingbade-reservations.json");
  }
  return path.join(process.cwd(), "data", "reservations.json");
}

async function ensureStore() {
  const file = dataFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "[]", "utf8");
  }
}

export async function getReservations(): Promise<Reservation[]> {
  await ensureStore();
  const raw = await fs.readFile(dataFilePath(), "utf8");
  try {
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addReservation(
  input: Omit<Reservation, "id" | "createdAt">,
): Promise<Reservation> {
  const reservations = await getReservations();
  const reservation: Reservation = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  reservations.unshift(reservation);
  await fs.writeFile(
    dataFilePath(),
    JSON.stringify(reservations, null, 2),
    "utf8",
  );
  return reservation;
}
