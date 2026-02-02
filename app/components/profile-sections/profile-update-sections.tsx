"use client";

import { X, ArrowRight } from "lucide-react";
import { useState, useTransition, useOptimistic, Fragment } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { uniqAbcSort } from "@/app/helpers/sort";

import type { SectionsResponse } from "@/api/post";
import type { UserSections as UserSectionsType } from "@/types/user";

type ProfileUpdateSectionsProps = {
  userSections: UserSectionsType;
  allSections: string[];
  buttonLabel: string;
  placeholder: string;
  onAddSection: (title: string) => Promise<SectionsResponse | null>;
  onRemoveSection: (title: string) => Promise<SectionsResponse | null>;
};

function ProfileUpdateSections({
  userSections,
  allSections,
  placeholder,
  onAddSection,
  onRemoveSection
}: ProfileUpdateSectionsProps) {
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();
  const [realActiveSections, setRealActiveSections] = useState<UserSectionsType>(userSections);
  const [activeSections, setActiveSections] = useOptimistic<UserSectionsType, UserSectionsType>(
    realActiveSections,
    (_, newSections) => newSections
  );

  const outputAllSections = uniqAbcSort(allSections).filter(str => !activeSections.includes(str));
  const outputActiveSections = uniqAbcSort(activeSections);

  const handleRemoveActiveSection = async (section: string) => {
    const sections = activeSections.filter(sec => sec !== section);
    startTransition(async () => {
      setActiveSections(sections);
      try {
        const list = await onRemoveSection(section);
        if (!list) throw new Error("No data returned from server");

        setRealActiveSections(list.sections);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error as Error);
      }
    });
  };

  const handleSaveSelectedSection = async (section: string) => {
    const sections = [...activeSections, section];
    startTransition(async () => {
      setActiveSections(sections);
      try {
        const list = await onAddSection(section);
        if (!list) throw new Error("No data returned from server");

        setRealActiveSections(list.sections);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error as Error);
      }
    });
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
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <Card className="p-2">
            <ScrollArea className="h-100">
              <div className="flex flex-col items-start">
                {outputAllSections.map((section, idx) => (
                  <Fragment key={section}>
                    {idx > 0 && <Separator className="my-2" />}
                    <button
                      className="group hover:text-primary flex w-full cursor-pointer gap-1"
                      onClick={() => handleSaveSelectedSection(section)}
                    >
                      <Label>{section}</Label>
                      <ArrowRight className="ml-auto size-6" />
                    </button>
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
          </Card>
          <div className="flex h-8 items-center gap-2">
            {isPending && <span className="text-neutral-500">Сохранение...</span>}
          </div>
        </div>
        <div className="flex-1">
          <Card className="p-2">
            <ScrollArea className="h-100">
              <div className="flex flex-col items-start">
                {outputActiveSections.length > 0 ? (
                  outputActiveSections.map((section, idx) => (
                    <Fragment key={section}>
                      {idx > 0 && <Separator className="my-2" />}
                      <button
                        className="group hover:text-primary flex w-full cursor-pointer gap-1"
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
