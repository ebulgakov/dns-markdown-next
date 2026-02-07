import { type NextRequest, NextResponse } from "next/server";

import { getLastPriceList } from "@/api/get";

export async function GET(req: NextRequest) {
  const city = req?.nextUrl?.searchParams.get("city");

  if (!city) {
    return NextResponse.json({ message: "City is required" }, { status: 400 });
  }

  try {
    const priceList = await getLastPriceList(city);

    if (!priceList) return NextResponse.json({ message: "priceList not found" }, { status: 404 });

    return NextResponse.json(priceList);
  } catch (e) {
    console.error("Failed to fetch last price list:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
