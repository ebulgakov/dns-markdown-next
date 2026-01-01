import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { updateUser } from "@/db/profile/mutations/update-user";
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
  if (!user) return null;

  const update = { [`${sectionName}`]: sections };
  await updateUser(update);

  const updatedUser = await getUser();
  if (!updatedUser) return null;

  return updatedUser[sectionName];
};
