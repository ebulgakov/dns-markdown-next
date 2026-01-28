"use server";
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";

import type { UserSections, AvailableUpdateSectionNames, UserNotifications } from "@/types/user";

const availableSections: AvailableUpdateSectionNames[] = [
  "hiddenSections",
  "favoriteSections",
  "notifications"
];

export const updateUserSection = async (
  sections: UserSections | UserNotifications,
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
