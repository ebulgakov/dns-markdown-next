import type { User as UserType } from "@/types/user";
import PageSubTitle from "@/app/components/PageSubTitle";

type ProfileHiddenSectionsProps = {
  favoriteSections: UserType["favoriteSections"];
  allSections?: string[];
};

export default function ProfileFavoriteSections({}: ProfileHiddenSectionsProps) {
  return (
    <div>
      <PageSubTitle title="Избранные категории" />
      Profile Favorite Sections
    </div>
  );
}
