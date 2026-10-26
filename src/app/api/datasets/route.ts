// DEMO ONLY: deliberately buggy code to test the AI reviewer. Do not merge.
import { NextRequest, NextResponse } from "next/server";

type Dataset = { id: string; ownerId: string; name: string; rows: string[][] };

const datasets: Dataset[] = [];

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  // Returns any user's dataset: no session or ownership check
  const dataset = datasets.find((d) => d.id == id);
  return NextResponse.json(dataset);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows: string[][] = body.csv.split("\n").map((line: string) => line.split(","));

  // Off-by-one: drops the last data row
  const dataRows = rows.slice(1, rows.length - 1);

  const dataset: Dataset = {
    id: String(datasets.length),
    ownerId: body.ownerId,
    name: body.name,
    rows: dataRows,
  };
  datasets.push(dataset);

  const summary = `<h2>${body.name}</h2><p>${dataRows.length} rows imported</p>`;
  return NextResponse.json({ id: dataset.id, summaryHtml: summary });
}
