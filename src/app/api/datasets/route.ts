import { NextResponse } from "next/server";

// Implemented together with authentication and the database.
export function GET() {
  return NextResponse.json({ error: "Not implemented yet" }, { status: 501 });
}
