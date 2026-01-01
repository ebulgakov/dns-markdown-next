import type { AvailableUpdateSectionNames, UserSections as UserSectionsType } from "@/types/user";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Button from "@/app/components/Button";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useUserSectionUpdate } from "@/app/hooks/useUserSectionUpdate";

type ProfileUpdateSectionsProps = {
  sectionName: AvailableUpdateSectionNames;
  userSections: UserSectionsType;
  allSections: string[];
  buttonLabel: string;
  placeholder: string;
};

export default function ProfileUpdateSections({
  userSections,
  allSections,
  sectionName,
  buttonLabel,
  placeholder
}: ProfileUpdateSectionsProps) {
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSections, setSelectedSections] = useState<UserSectionsType>([]);
  const [activeSections, setActiveSections] = useState<UserSectionsType>(userSections);
  const { updateUserSections } = useUserSectionUpdate(sectionName);

  //
  const outputAllSections = Array.from(new Set(allSections))
    .filter(str => !activeSections.includes(str))
    .sort((a, b) => a.localeCompare(b));
  const outputActiveSections = Array.from(new Set(activeSections)).sort((a, b) =>
    a.localeCompare(b)
  );

  const updateSections = async (sections: UserSectionsType) => {
    try {
      setLoading(true);
      const newSections = await updateUserSections(sections);
      setActiveSections(newSections);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error as Error);
    } finally {
      setLoading(false);
    }
  };

  //
  const handleRemoveActiveSection = async (section: string) => {
    const sections = activeSections.filter(sec => sec !== section);
    await updateSections(sections);
  };

  const handleSaveSelectedSections = async () => {
    const sections = Array.from(new Set([...activeSections, ...selectedSections]));
    await updateSections(sections);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSections(prev => [...prev, value]);
    } else {
      setSelectedSections(prev => prev?.filter(section => section !== value));
    }
  };

  return (
    <div>
      {errorMessage && <ErrorMessage className="mb-4">{errorMessage.message}</ErrorMessage>}
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
          <Button disabled={loading} type="button" onClick={handleSaveSelectedSections}>
            {buttonLabel}
          </Button>
        </div>
        <div className="flex-1">
          <div className="overflow-auto h-100 border border-neutral-300 px-2.5 py-1 border-solid flex flex-col items-start">
            {outputActiveSections.length > 0 ? (
              outputActiveSections.map(section => (
                <button
                  disabled={loading}
                  key={section}
                  onClick={() => handleRemoveActiveSection(section)}
                >
                  <Fa icon={faTimes} />
                  {section}
                </button>
              ))
            ) : (
              <p className="text-neutral-500">{placeholder}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
