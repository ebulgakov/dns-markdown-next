import { NextResponse } from "next/server";
import { updateUserSection } from "@/db/profile/mutations";
import type { AvailableUpdateSectionNames, UserSections } from "@/types/user";

export async function POST(req: Request) {
  const {
    sections,
    sectionName
  }: {
    sections: UserSections;
    sectionName: AvailableUpdateSectionNames;
  } = await req.json();

  if (!sections) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  let updatedSections;
  try {
    updatedSections = await updateUserSection(sections, sectionName);
  } catch (error) {
    console.error(error);
    return new Response("Error occurred", {
      status: 400
    });
  }

  return NextResponse.json({ success: true, updatedSections }, { status: 200 });
}
