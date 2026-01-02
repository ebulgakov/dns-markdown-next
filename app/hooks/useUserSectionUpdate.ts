import axios, { type AxiosError } from "axios";

export const useUserSectionUpdate = (sectionName: string) => {
  const updateUserSections = async (sections: string[]): Promise<string[]> => {
    let updatedSections: string[] = [];
    {
      try {
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
          updatedSections = data.updatedSections;
        }
      } catch (e) {
        const error = e as AxiosError;
        if (error.response) {
          const { error: err } = error.response.data as { error: string };
          throw new Error(err);
        } else {
          throw new Error("An unexpected error occurred", { cause: e });
        }
      }
    }

    return updatedSections;
  };

  return { updateUserSections };
};
