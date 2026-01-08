"use client";

import type { AvailableUpdateSectionNames, UserSections as UserSectionsType } from "@/types/user";
import { X } from "lucide-react";
import { useState, type ChangeEvent, useTransition, useOptimistic } from "react";
import { Button } from "@/app/components/ui/button";
import { updateUserSection } from "@/db/user/mutations/update-user-section";
import { uniqAbcSort } from "@/app/helpers/sort";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

type ProfileUpdateSectionsProps = {
  sectionName: AvailableUpdateSectionNames;
  userSections: UserSectionsType;
  allSections: string[];
  buttonLabel: string;
  placeholder: string;
};

function ProfileUpdateSections({
  userSections,
  allSections,
  sectionName,
  buttonLabel,
  placeholder
}: ProfileUpdateSectionsProps) {
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedSections, setSelectedSections] = useState<UserSectionsType>([]);
  const [realActiveSections, setRealActiveSections] = useState<UserSectionsType>(userSections);
  const [activeSections, setActiveSections] = useOptimistic<UserSectionsType, UserSectionsType>(
    realActiveSections,
    (_, newSections) => newSections
  );

  const outputAllSections = uniqAbcSort(allSections).filter(str => !activeSections.includes(str));
  const outputActiveSections = uniqAbcSort(activeSections);

  const updateSections = async (sections: UserSectionsType) => {
    startTransition(async () => {
      setActiveSections(sections);
      setSelectedSections([]);
      try {
        const newSections = await updateUserSection(sections, sectionName);
        setRealActiveSections(newSections);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error as Error);
      }
    });
  };

  const handleRemoveActiveSection = async (section: string) => {
    const sections = activeSections.filter(sec => sec !== section);
    await updateSections(sections);
  };

  const handleSaveSelectedSections = async () => {
    if (selectedSections.length === 0) return;
    const sections = [...activeSections, ...selectedSections];
    await updateSections(sections);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedSections(prev =>
      checked ? [...prev, value] : prev.filter(section => section !== value)
    );
  };

  return (
    <div>
      {errorMessage && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertTitle>Ошибка обновления разделов</AlertTitle>
            <AlertDescription>{errorMessage.message}</AlertDescription>
          </Alert>
        </div>
      )}
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
          <div className="flex items-center gap-2">
            <Button
              disabled={selectedSections.length === 0}
              type="button"
              onClick={handleSaveSelectedSections}
            >
              {buttonLabel}
            </Button>
            {isPending && <span className="text-neutral-500">Сохранение...</span>}
          </div>
        </div>
        <div className="flex-1">
          <div className="overflow-auto h-100 border border-neutral-300 px-2.5 py-1 border-solid flex flex-col items-start">
            {outputActiveSections.length > 0 ? (
              outputActiveSections.map(section => (
                <button
                  key={section}
                  className="flex"
                  onClick={() => handleRemoveActiveSection(section)}
                >
                  <X />
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

export { ProfileUpdateSections };
