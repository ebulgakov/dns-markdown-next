"use client";

import type { AvailableUpdateSectionNames, UserSections as UserSectionsType } from "@/types/user";
import { X } from "lucide-react";
import { useState, type ChangeEvent, useTransition, useOptimistic, Fragment } from "react";
import { Button } from "@/app/components/ui/button";
import { updateUserSection } from "@/db/user/mutations/update-user-section";
import { uniqAbcSort } from "@/app/helpers/sort";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Card } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";

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
          <Card className="p-2">
            <ScrollArea className="h-100">
              <div className="flex flex-col items-start ">
                {outputAllSections.map((section, idx) => (
                  <Fragment key={section}>
                    {idx > 0 && <Separator className="my-2" />}
                    <label>
                      <input
                        type="checkbox"
                        className="mr-1"
                        value={section}
                        onChange={handleCheckboxChange}
                      />
                      {section}
                    </label>
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
          </Card>
          <div className="flex items-center gap-2 mt-2">
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
          <Card className="p-2">
            <ScrollArea className="h-100">
              <div className="flex flex-col items-start ">
                {outputActiveSections.length > 0 ? (
                  outputActiveSections.map((section, idx) => (
                    <Fragment key={section}>
                      {idx > 0 && <Separator className="my-2" />}
                      <button className="flex" onClick={() => handleRemoveActiveSection(section)}>
                        <X />
                        {section}
                      </button>
                    </Fragment>
                  ))
                ) : (
                  <p className="text-neutral-500">{placeholder}</p>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { ProfileUpdateSections };
