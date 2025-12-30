import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Fix React Hydration on the client side
export const useClientRendering = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
};
