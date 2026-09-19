import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  HeadingLevel,
} from "docx";
import type { Reservation } from "./reservations";

function cell(text: string, bold = false) {
  return new TableCell({
    width: { size: 1400, type: WidthType.DXA },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold, size: 18 })],
      }),
    ],
  });
}

export async function buildReservationsDocx(
  reservations: Reservation[],
): Promise<Buffer> {
  const header = new TableRow({
    children: [
      cell("Name", true),
      cell("Telephone", true),
      cell("Email", true),
      cell("Arrival", true),
      cell("Departure", true),
      cell("Days", true),
      cell("Rooms", true),
      cell("Per room", true),
      cell("Total guests", true),
      cell("Submitted", true),
    ],
  });

  const rows = reservations.map(
    (r) =>
      new TableRow({
        children: [
          cell(r.name),
          cell(r.telephone),
          cell(r.email || "—"),
          cell(r.arrivalDate),
          cell(r.departureDate),
          cell(String(r.daysToBook)),
          cell(String(r.numberOfRooms ?? "")),
          cell(String(r.peoplePerRoom)),
          cell(String(r.totalPeopleNeedingStay)),
          cell(new Date(r.createdAt).toLocaleString()),
        ],
      }),
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "Mama Akingbade — Guest Stay Requests",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Exported ${new Date().toLocaleString()} · ${reservations.length} request(s)`,
                italics: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [header, ...rows],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
