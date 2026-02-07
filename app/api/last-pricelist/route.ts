import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({
    hello: "1234",
    req
  });
}
