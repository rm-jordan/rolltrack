import type { BeltLevel } from "./types";

/** Main belt body color per rank (BJJ-style). */
export const beltMainColor: Record<BeltLevel, string> = {
  White: "#f4f4f5",
  Blue: "#1d4ed8",
  Purple: "#6d28d9",
  Brown: "#78350f",
  Black: "#0f0f0f",
};

/** Border for light belts so they read on pale backgrounds. */
export const beltBorderColor: Record<BeltLevel, string> = {
  White: "#d4d4d8",
  Blue: "#1e40af",
  Purple: "#5b21b6",
  Brown: "#451a03",
  Black: "#27272a",
};

/** Center knot / shadow tone (slightly darker than main). */
export const beltKnotColor: Record<BeltLevel, string> = {
  White: "#e4e4e7",
  Blue: "#1e3a8a",
  Purple: "#5b21b6",
  Brown: "#451a03",
  Black: "#171717",
};

/** Red bar on black belt (common BJJ professor/coral convention — used as visual cue). */
export const blackBeltRedBar = "#dc2626";
