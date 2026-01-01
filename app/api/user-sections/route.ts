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

  if (!sections || !sectionName) {
    return NextResponse.json({ success: false, error: "No sections provided" }, { status: 400 });
  }

  let updatedSections;
  try {
    updatedSections = await updateUserSection(sections, sectionName);
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() }, { status: 400 });
  }

  return NextResponse.json({ success: true, updatedSections }, { status: 200 });
}
