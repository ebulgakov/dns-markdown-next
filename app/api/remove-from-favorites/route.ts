import { NextResponse } from "next/server";
import { removeFromFavorites } from "@/db/profile/mutations";

export async function POST(req: Request) {
  const { link } = await req.json();

  if (!link) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    await removeFromFavorites(link);
  } catch (error) {
    console.error(error);
    return new Response("Error occured", {
      status: 400
    });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
