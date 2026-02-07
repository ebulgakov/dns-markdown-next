import { NextRequest, NextResponse } from "next/server";

import { getLastDiffByCity } from "@/api/get";

export async function GET(req: NextRequest) {
  const city = req?.nextUrl?.searchParams.get("city");

  if (!city) {
    return NextResponse.json({ message: "City is required" }, { status: 400 });
  }

  try {
    const collection = await getLastDiffByCity(city);

    if (!collection) {
      return NextResponse.json({ message: "No diff found for the city" }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (e) {
    console.error("Failed to fetch last price list:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
