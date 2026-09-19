import { list, put } from "@vercel/blob";
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

const BLOB_PATHNAME = "mama-akingbade/reservations.json";

type GlobalStore = {
  __mamaReservationsCache?: Reservation[];
};

function globalStore() {
  return globalThis as typeof globalThis & GlobalStore;
}

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function localFilePath() {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "mama-akingbade-reservations.json");
  }
  return path.join(process.cwd(), "data", "reservations.json");
}

async function readLocal(): Promise<Reservation[]> {
  const file = localFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(reservations: Reservation[]) {
  const file = localFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(reservations, null, 2), "utf8");
}

async function readBlob(): Promise<Reservation[]> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME });
  const match = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
  if (!match) return [];
  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return [];
  const parsed = (await res.json()) as Reservation[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeBlob(reservations: Reservation[]) {
  await put(BLOB_PATHNAME, JSON.stringify(reservations, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getReservations(): Promise<Reservation[]> {
  const g = globalStore();
  if (useBlob()) {
    const reservations = await readBlob();
    g.__mamaReservationsCache = reservations;
    return reservations;
  }

  if (g.__mamaReservationsCache) {
    return g.__mamaReservationsCache;
  }

  const reservations = await readLocal();
  g.__mamaReservationsCache = reservations;
  return reservations;
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
  const next = [reservation, ...reservations];
  globalStore().__mamaReservationsCache = next;

  if (useBlob()) {
    await writeBlob(next);
  } else {
    await writeLocal(next);
  }

  return reservation;
}
