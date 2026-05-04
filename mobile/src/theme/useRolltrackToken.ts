import { useToken } from "@gluestack-ui/themed";

/** Resolves RollTrack semantic color tokens (rt*) with Gluestack color mode. */
export function useRolltrackColor(name: string) {
  return useToken("colors", name as never);
}
