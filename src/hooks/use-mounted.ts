import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False while the server renders and during hydration, true once we are in the browser
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}