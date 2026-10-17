import describeError from "@src/helpers/describe-error";

export const logError = (endpoint: string, error: unknown) => {
  console.error(`Error fetching data from ${endpoint}:`, describeError(error));
};
