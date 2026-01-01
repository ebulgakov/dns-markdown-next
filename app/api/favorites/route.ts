import { NextResponse } from "next/server";
import { addToFavorites, removeFromFavorites } from "@/db/profile/mutations";

export async function POST(req: Request) {
  const { goods } = await req.json();

  if (!goods) {
    return NextResponse.json({ success: false, error: "No goods provided" }, { status: 400 });
  }

  try {
    await addToFavorites(goods);
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(req: Request) {
  const { link } = await req.json();

  if (!link) {
    return NextResponse.json({ success: false, error: "No link provided" }, { status: 400 });
  }

  try {
    await removeFromFavorites(link);
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() }, { status: 400 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
