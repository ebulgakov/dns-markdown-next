export const uniqAbcSort = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr)).sort(
    (a, b) => a && a.toString().localeCompare(b && b.toString())
  );
};
