import { mock } from "bun:test";

type Call = (url: string, ...args: unknown[]) => Promise<{ data: unknown }>;

// Mock axios-like `{ get, post }` transport for createApiClient({ http }) from
// @dns-markdown/api-client. Every call resolves with `{ data: defaultData }` until overridden.
export const createHttpMock = (defaultData?: unknown) => {
  const respond = async () => ({ data: defaultData });
  const get = mock<Call>(respond);
  const post = mock<Call>(respond);

  return {
    get,
    post,
    // Route GET responses by url; an unexpected url throws.
    mockGetResponses(responses: Record<string, unknown>) {
      get.mockImplementation(async (url: string) => {
        if (!(url in responses)) throw new Error(`Unexpected GET ${url}`);
        return { data: responses[url] };
      });
    },
    // Body of the first POST to a url.
    postBody: (url: string) => post.mock.calls.find(([called]) => called === url)?.[1],
    postedEndpoints: () => post.mock.calls.map(([url]) => url),
    reset() {
      for (const fn of [get, post]) {
        fn.mockReset();
        fn.mockImplementation(respond);
      }
    }
  };
};
