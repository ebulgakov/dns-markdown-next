import { NextRequest, NextResponse } from "next/server";

import { getLLMCompareProducts } from "@/services/get";

export async function GET(req: NextRequest) {
  const links = req?.nextUrl?.searchParams.getAll("links[]");

  if (links.length < 2) {
    return NextResponse.json({ message: "Min 2 links are required" }, { status: 400 });
  }

  try {
    const response = await getLLMCompareProducts(links);

    if (!response) return NextResponse.json({ message: "product not found" }, { status: 404 });

    return NextResponse.json(response);
  } catch (e) {
    console.error("Failed to compare products:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
