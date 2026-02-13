import { NextRequest, NextResponse } from "next/server";

import { getLLMDescribeProduct } from "@/services/get";

export async function GET(req: NextRequest) {
  const link = req?.nextUrl?.searchParams.get("link");

  if (!link) {
    return NextResponse.json({ message: "Link is required" }, { status: 400 });
  }

  try {
    const response = await getLLMDescribeProduct(link);

    if (!response) return NextResponse.json({ message: "product not found" }, { status: 404 });

    return NextResponse.json(response);
  } catch (e) {
    console.error("Failed to describe product:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
