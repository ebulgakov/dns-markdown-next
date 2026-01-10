"use client";

import { X } from "lucide-react";
import { useState, useTransition, useOptimistic, Fragment } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { uniqAbcSort } from "@/app/helpers/sort";
import { updateUserSection } from "@/db/user/mutations/update-user-section";

import type { AvailableUpdateSectionNames, UserSections as UserSectionsType } from "@/types/user";

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

  const handleCheckboxChange = ({ section, checked }: { section: string; checked: boolean }) => {
    setSelectedSections(prev =>
      checked ? [...prev, section] : prev.filter(pSection => pSection !== section)
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
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`checkbox-option-${idx}`}
                        value={section}
                        onCheckedChange={checked =>
                          handleCheckboxChange({ section, checked: Boolean(checked) })
                        }
                      />
                      <Label htmlFor={`checkbox-option-${idx}`}>{section}</Label>
                    </div>
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
                      <button
                        className="flex gap-1"
                        onClick={() => handleRemoveActiveSection(section)}
                      >
                        <X className="size-6" />
                        <Label>{section}</Label>
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
