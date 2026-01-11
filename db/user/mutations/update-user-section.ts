"use server";
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";

import type { UserSections, AvailableUpdateSectionNames } from "@/types/user";

const availableSections: AvailableUpdateSectionNames[] = ["hiddenSections", "favoriteSections"];

export const updateUserSection = async (
  sections: UserSections,
  sectionName: AvailableUpdateSectionNames
) => {
  // Validate section name
  if (!availableSections.includes(sectionName)) throw new Error("Invalid section name");

  await dbConnect();
  const update = { [`${sectionName}`]: sections };
  const newUser = await updateUser(update);

  if (!newUser) throw new Error("User not found");

  return newUser[sectionName];
};
