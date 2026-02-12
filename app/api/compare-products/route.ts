import { NextRequest, NextResponse } from "next/server";

import { getLLMCompareProducts } from "@/api/get";

export async function GET(req: NextRequest) {
  const links = req?.nextUrl?.searchParams.getAll("links[]");

  if (!links) {
    return NextResponse.json({ message: "Links are required" }, { status: 400 });
  }

  if (links.length === 0) {
    return NextResponse.json({ message: "At least one valid link is required" }, { status: 400 });
  }

  try {
    const response = await getLLMCompareProducts(links);

    if (!response) return NextResponse.json({ message: "product not found" }, { status: 404 });

    return NextResponse.json(response);
  } catch (e) {
    console.error("Failed to fetch product description:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
