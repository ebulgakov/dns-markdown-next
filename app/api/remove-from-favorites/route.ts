import { NextResponse } from "next/server";
import { removeFromFavorites } from "@/db/profile/mutations";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    await removeFromFavorites(id);
  } catch (error) {
    return new Response("Error occured", {
      status: 400
    });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
