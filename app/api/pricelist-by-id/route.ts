import { type NextRequest, NextResponse } from "next/server";

import { getPriceListById } from "@/api/get";

export async function GET(req: NextRequest) {
  const id = req?.nextUrl?.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const priceList = await getPriceListById(id);

    if (!priceList) return NextResponse.json({ message: "priceList not found" }, { status: 404 });

    return NextResponse.json(priceList);
  } catch (e) {
    console.error("Failed to fetch price list by ID:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
