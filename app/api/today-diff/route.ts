import { NextResponse } from "next/server";

import { getLastDiffByCity } from "@/services/get";

export async function GET() {
  try {
    const collection = await getLastDiffByCity();

    if (!collection) {
      return NextResponse.json({ message: "No diff found for the city" }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (e) {
    console.error("Failed to fetch last price list:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
