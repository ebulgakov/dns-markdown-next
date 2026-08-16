import { NextResponse } from "next/server";

import { getLastDiffByCity } from "@/entities/product";
import { getPriceListCity } from "@/entities/user";

export async function GET() {
  try {
    const city = await getPriceListCity();
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
