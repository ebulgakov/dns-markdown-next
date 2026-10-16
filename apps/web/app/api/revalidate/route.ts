import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// Only catalog/analysis tags are revalidated externally (see services/get.ts);
// user-${userId} tags are busted internally by the app itself after mutations,
// never by this webhook.
const ALLOWED_TAGS = ["daily-data", "llm-report"];

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

    if (!ALLOWED_TAGS.includes(tag)) {
      return NextResponse.json({ message: "Unknown tag" }, { status: 400 });
    }

    revalidateTag(tag, { expire: 0 });

    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
