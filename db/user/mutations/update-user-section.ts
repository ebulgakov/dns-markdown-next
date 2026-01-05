"use server";
import { dbConnect } from "@/db/database";
import { getUser } from "@/db/user/queries";
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

  const user = await getUser();
  if (!user) throw new Error("User not found");

  const update = { [`${sectionName}`]: sections };
  await updateUser(update);

  const updatedUser = await getUser();
  if (!updatedUser) throw new Error("User not found after update");

  return updatedUser[sectionName];
};
