import type { User as UserType } from "@/types/user";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Button from "@/app/components/Button";

type ProfileHiddenSectionsProps = {
  hiddenSections: UserType["hiddenSections"];
  allSections: string[];
};

export default function ProfileHiddenSections({
  hiddenSections,
  allSections
}: ProfileHiddenSectionsProps) {
  const [selectedSections, setSelectedSections] = useState<UserType["hiddenSections"]>([]);
  const [activeSections, setActiveSections] = useState<UserType["hiddenSections"]>(hiddenSections);

  //
  const outputAllSections = Array.from(new Set(allSections))
    .filter(str => !activeSections.includes(str))
    .sort((a, b) => a.localeCompare(b));
  const outputActiveSections = Array.from(new Set(activeSections)).sort((a, b) =>
    a.localeCompare(b)
  );

  //
  const handleRemove = (section: string) => {
    setActiveSections(prev => prev.filter(sec => sec !== section));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSections(prev => (prev ? [...prev, value] : [value]));
    } else {
      setSelectedSections(prev => prev?.filter(section => section !== value));
    }
  };

  const handleSaveSelection = () => {
    setActiveSections(Array.from(new Set([...activeSections, ...selectedSections])));
  };

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="overflow-auto h-100 border border-neutral-300 px-2.5 py-1 border-solid flex flex-col items-start mb-2">
            {outputAllSections.map(section => (
              <label key={section}>
                <input
                  type="checkbox"
                  className="mr-1"
                  value={section}
                  onChange={handleCheckboxChange}
                />
                {section}
              </label>
            ))}
          </div>
          <Button type="button" onClick={handleSaveSelection}>
            Скрывать эти секции
          </Button>
        </div>
        <div className="flex-1">
          <div className="overflow-auto h-100 border border-neutral-300 px-2.5 py-1 border-solid flex flex-col items-start">
            {outputActiveSections.map(section => (
              <button key={section} onClick={() => handleRemove(section)}>
                <Fa icon={faTimes} />
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
