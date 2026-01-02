import { uniqAbcSort } from "../sort";

describe("uniqAbcSort", () => {
  // Test case 1: Sorts an array of strings alphabetically
  it("should sort an array of strings alphabetically", () => {
    const inputArray = ["banana", "apple", "cherry", "date"];
    const expectedArray = ["apple", "banana", "cherry", "date"];
    expect(uniqAbcSort(inputArray)).toEqual(expectedArray);
  });

  // Test case 2: Removes duplicate values from the array
  it("should remove duplicate values from the array", () => {
    const inputArray = ["apple", "banana", "apple", "cherry", "banana"];
    const expectedArray = ["apple", "banana", "cherry"];
    expect(uniqAbcSort(inputArray)).toEqual(expectedArray);
  });

  // Test case 3: Handles an empty array
  it("should return an empty array when given an empty array", () => {
    const inputArray: string[] = [];
    const expectedArray: string[] = [];
    expect(uniqAbcSort(inputArray)).toEqual(expectedArray);
  });

  // Test case 4: Sorts an array of numbers (lexicographically)
  it("should sort an array of numbers lexicographically", () => {
    const inputArray = [10, 2, 1, 100, 2];
    const expectedArray = [1, 10, 100, 2];
    expect(uniqAbcSort(inputArray)).toEqual(expectedArray);
  });

  // Test case 5: Sorts an array of mixed types (lexicographically)
  it("should sort an array of mixed types lexicographically", () => {
    const inputArray = ["banana", 10, "apple", 2];
    const expectedArray = [10, 2, "apple", "banana"];
    expect(uniqAbcSort(inputArray)).toEqual(expectedArray);
  });

  // Test case 6: Handles null and undefined values
  it("should handle null and undefined values", () => {
    const inputArray = ["banana", null, "apple", undefined, "cherry"];
    const expectedArray = ["apple", "banana", "cherry", null, undefined];
    expect(uniqAbcSort(inputArray)).toEqual(expectedArray);
  });

  // Test case 7: Handles an array with only null and undefined
  it("should handle an array with only null and undefined", () => {
    const inputArray = [null, undefined, null];
    const expectedArray = [null, undefined];
    expect(uniqAbcSort(inputArray)).toEqual(expectedArray);
  });
});
