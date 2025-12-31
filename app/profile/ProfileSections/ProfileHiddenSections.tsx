import type { User as UserType } from "@/types/user";
import PageSubTitle from "@/app/components/PageSubTitle";

type ProfileHiddenSectionsProps = {
  hiddenSections: UserType["hiddenSections"];
  allSections?: string[];
};

export default function ProfileHiddenSections({}: ProfileHiddenSectionsProps) {
  return (
    <div>
      <PageSubTitle title="Скрытые категории" />
      Profile Hidden Sections
    </div>
  );
}
