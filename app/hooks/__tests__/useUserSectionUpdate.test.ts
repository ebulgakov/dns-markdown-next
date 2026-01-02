import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import { useUserSectionUpdate } from "../useUserSectionUpdate";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useUserSectionUpdate", () => {
  const sectionName = "testSection";

  it("should update user sections successfully", async () => {
    // Arrange
    const sections = ["section1", "section2"];
    const updatedSections = ["section1", "section2", "section3"];
    mockedAxios.post.mockResolvedValue({
      data: { success: true, updatedSections }
    });

    const { result } = renderHook(() => useUserSectionUpdate(sectionName));

    // Act
    let resultSections: string[] = [];
    await act(async () => {
      resultSections = await result.current.updateUserSections(sections);
    });

    // Assert
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/user-sections",
      { sections, sectionName },
      { headers: { "Content-Type": "application/json; charset=UTF-8" } }
    );
    expect(resultSections).toEqual(updatedSections);
  });

  it("should throw an error when api returns an error", async () => {
    // Arrange
    const sections = ["section1", "section2"];
    const errorMessage = "Failed to update";
    mockedAxios.post.mockRejectedValue({
      response: { data: { error: errorMessage } }
    });

    const { result } = renderHook(() => useUserSectionUpdate(sectionName));

    // Act & Assert
    await expect(result.current.updateUserSections(sections)).rejects.toThrow(errorMessage);
  });

  it("should throw a generic error for unexpected errors", async () => {
    // Arrange
    const sections = ["section1", "section2"];
    const unexpectedError = new Error("Network Error");
    mockedAxios.post.mockRejectedValue(unexpectedError);

    const { result } = renderHook(() => useUserSectionUpdate(sectionName));

    // Act & Assert
    await expect(result.current.updateUserSections(sections)).rejects.toThrow(
      "An unexpected error occurred"
    );
  });
});
