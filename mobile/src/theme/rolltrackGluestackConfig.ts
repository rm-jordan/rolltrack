import { config as baseConfig } from "@gluestack-ui/config";

/**
 * RollTrack brand (violet primary) + semantic surface tokens for light/dark.
 * `themes.dark` overrides only the `rt*` keys (and primary stays readable in both modes via component _dark styles).
 */
export const rolltrackConfig = {
  ...baseConfig,
  tokens: {
    ...baseConfig.tokens,
    colors: {
      ...baseConfig.tokens.colors,
      primary0: "#f5f3ff",
      primary50: "#ede9fe",
      primary100: "#ddd6fe",
      primary200: "#c4b5fd",
      primary300: "#a78bfa",
      primary400: "#8b5cf6",
      primary500: "#7c3aed",
      primary600: "#6d28d9",
      primary700: "#5b21b6",
      primary800: "#4c1d95",
      primary900: "#3b0764",
      primary950: "#1e0a3d",
      rtCanvas: "#f3effc",
      rtHeading: "#18181b",
      rtBody: "#52525b",
      rtSubtle: "#71717a",
      rtIconMuted: "#52525b",
      rtBorder: "#e4e4e7",
      rtLevelBeginner: "#ecfdf5",
      rtLevelIntermediate: "#eff6ff",
      rtLevelAdvanced: "#ede9fe",
      rtCardIconBg: "rgba(255,255,255,0.92)",
      rtLibraryAccent: "#0891b2",
      rtLogAccent: "#059669",
    },
  },
  themes: {
    dark: {
      colors: {
        rtCanvas: "#0c0a12",
        rtHeading: "#f4f4f5",
        rtBody: "#a1a1aa",
        rtSubtle: "#71717a",
        rtIconMuted: "#a1a1aa",
        rtBorder: "#3f3d52",
        rtLevelBeginner: "#052e26",
        rtLevelIntermediate: "#0c1a2e",
        rtLevelAdvanced: "#1e1033",
        rtCardIconBg: "rgba(30,27,40,0.95)",
        rtLibraryAccent: "#22d3ee",
        rtLogAccent: "#34d399",
      },
    },
  },
};
