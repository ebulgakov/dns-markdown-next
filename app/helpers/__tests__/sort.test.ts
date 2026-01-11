import { uniqAbcSort } from "../sort";

describe("uniqAbcSort", () => {
  const testCases = [
    {
      name: "should sort an array of strings alphabetically",
      input: ["banana", "apple", "cherry", "date"],
      expected: ["apple", "banana", "cherry", "date"]
    },
    {
      name: "should remove duplicate values from the array",
      input: ["apple", "banana", "apple", "cherry", "banana"],
      expected: ["apple", "banana", "cherry"]
    },
    {
      name: "should return an empty array when given an empty array",
      input: [],
      expected: []
    },
    {
      name: "should sort an array of numbers lexicographically",
      input: [10, 2, 1, 100, 2],
      expected: [1, 10, 100, 2]
    },
    {
      name: "should sort an array of mixed types lexicographically",
      input: ["banana", 10, "apple", 2],
      expected: [10, 2, "apple", "banana"]
    },
    {
      name: "should handle null and undefined values",
      input: ["banana", null, "apple", undefined, "cherry"],
      expected: ["apple", "banana", "cherry", null, undefined]
    },
    {
      name: "should handle an array with only null and undefined",
      input: [null, undefined, null],
      expected: [null, undefined]
    }
  ];

  it.each(testCases)("$name", ({ input, expected }) => {
    expect(uniqAbcSort(input)).toEqual(expected);
  });
});
