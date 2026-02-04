import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
  const secret = authHeader?.split(" ")[1] || "";

  if (secret !== process.env.WEBHOOK_SECRET_KEY) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tag } = body;

    if (!tag) {
      return NextResponse.json({ message: "Tag is required" }, { status: 400 });
    }

    revalidateTag(tag, { expire: 0 });

    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
