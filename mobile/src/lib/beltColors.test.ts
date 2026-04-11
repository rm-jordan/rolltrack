import type { BeltLevel } from "@rolltrack/shared";
import {
  beltBorderColor,
  beltKnotColor,
  beltMainColor,
  blackBeltRedBar,
} from "./beltColors";

const levels: BeltLevel[] = ["White", "Blue", "Purple", "Brown", "Black"];

describe("beltColors", () => {
  it("defines a main color for every belt level", () => {
    for (const level of levels) {
      expect(beltMainColor[level]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("defines border and knot colors for every belt level", () => {
    for (const level of levels) {
      expect(beltBorderColor[level]).toMatch(/^#[0-9a-f]{6}$/i);
      expect(beltKnotColor[level]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("uses a red accent bar color for black belt graphic", () => {
    expect(blackBeltRedBar).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
