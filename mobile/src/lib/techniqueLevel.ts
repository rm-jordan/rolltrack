import type { Technique, TechniqueLevel } from "@rolltrack/shared";

export const LEVELS: TechniqueLevel[] = ["Beginner", "Intermediate", "Advanced"];

export function techniqueLevel(technique: Technique): TechniqueLevel {
  return technique.level;
}

export function normalizeLevel(raw: string | string[] | undefined): TechniqueLevel | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "beginner") return "Beginner";
  if (normalized === "intermediate") return "Intermediate";
  if (normalized === "advanced") return "Advanced";
  return null;
}
