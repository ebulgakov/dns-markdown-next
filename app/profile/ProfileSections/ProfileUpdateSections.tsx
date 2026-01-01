import type { AvailableUpdateSectionNames, UserSections as UserSectionsType } from "@/types/user";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Button from "@/app/components/Button";
import axios, { type AxiosError } from "axios";
import ErrorMessage from "@/app/components/ErrorMessage";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSections, setSelectedSections] = useState<UserSectionsType>([]);
  const [activeSections, setActiveSections] = useState<UserSectionsType>(userSections);

  const sendRequest = async (
    sections: UserSectionsType,
    sectionName: AvailableUpdateSectionNames
  ) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/user-sections",
        { sections, sectionName },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        }
      );

      if (data.success) {
        setActiveSections(data.updatedSections);
      } else {
        setErrorMessage(data.error || "An unexpected error occurred");
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const { error: err } = error.response.data as { error: string };
        setErrorMessage(err);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  //
  const outputAllSections = Array.from(new Set(allSections))
    .filter(str => !activeSections.includes(str))
    .sort((a, b) => a.localeCompare(b));
  const outputActiveSections = Array.from(new Set(activeSections)).sort((a, b) =>
    a.localeCompare(b)
  );

  //
  const handleRemove = async (section: string) => {
    const sections = activeSections.filter(sec => sec !== section);
    await sendRequest(sections, sectionName);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSections(prev => (prev ? [...prev, value] : [value]));
    } else {
      setSelectedSections(prev => prev?.filter(section => section !== value));
    }
  };

  const handleSaveSelection = async () => {
    const sections = Array.from(new Set([...activeSections, ...selectedSections]));
    await sendRequest(sections, sectionName);
  };

  return (
    <div>
      {errorMessage && <ErrorMessage className="mb-4">{errorMessage}</ErrorMessage>}
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
          <Button disabled={loading} type="button" onClick={handleSaveSelection}>
            {buttonLabel}
          </Button>
        </div>
        <div className="flex-1">
          <div className="overflow-auto h-100 border border-neutral-300 px-2.5 py-1 border-solid flex flex-col items-start">
            {outputActiveSections.length > 0 ? (
              outputActiveSections.map(section => (
                <button disabled={loading} key={section} onClick={() => handleRemove(section)}>
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
