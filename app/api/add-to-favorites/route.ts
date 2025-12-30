import { NextResponse } from "next/server";
import { addToFavorites } from "@/db/profile/mutations";

export async function POST(req: Request) {
  const { goods } = await req.json();

  if (!goods) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    await addToFavorites(goods);
  } catch (error) {
    console.error(error);
    return new Response("Error occured", {
      status: 400
    });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
