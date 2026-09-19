import { promises as fs } from "fs";
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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reservations.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function getReservations(): Promise<Reservation[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
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
  await fs.writeFile(DATA_FILE, JSON.stringify(reservations, null, 2), "utf8");
  return reservation;
}
