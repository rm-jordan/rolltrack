import { config as baseConfig } from "@gluestack-ui/config";

/**
 * RollTrack UI tokens: neutral “product UI” baseline (Vercel-adjacent)—muted canvas,
 * hairline borders, near-black primary in light / near-white in dark. Swap `primary*`
 * and accents here when the brand palette is ready.
 */
export const rolltrackConfig = {
  ...baseConfig,
  tokens: {
    ...baseConfig.tokens,
    colors: {
      ...baseConfig.tokens.colors,
      primary0: "#fafafa",
      primary50: "#f5f5f5",
      primary100: "#e5e5e5",
      primary200: "#d4d4d4",
      primary300: "#a3a3a3",
      primary400: "#737373",
      primary500: "#171717",
      primary600: "#0a0a0a",
      primary700: "#000000",
      primary800: "#000000",
      primary900: "#000000",
      primary950: "#000000",
      rtCanvas: "#fafafa",
      rtHeading: "#171717",
      rtBody: "#666666",
      rtSubtle: "#737373",
      rtIconMuted: "#737373",
      rtBorder: "#eaeaea",
      rtLevelBeginner: "#ffffff",
      rtLevelIntermediate: "#fafafa",
      rtLevelAdvanced: "#f5f5f5",
      rtCardIconBg: "#ffffff",
      rtLibraryAccent: "#171717",
      rtLogAccent: "#171717",
      /** Contrast text/icon on solid `primary500` (light: white, dark: near-black on light CTA). */
      rtOnPrimary: "#ffffff",
    },
  },
  themes: {
    dark: {
      colors: {
        primary0: "#0a0a0a",
        primary50: "#171717",
        primary100: "#262626",
        primary200: "#404040",
        primary300: "#737373",
        primary400: "#a3a3a3",
        primary500: "#fafafa",
        primary600: "#ffffff",
        primary700: "#f5f5f5",
        primary800: "#e5e5e5",
        primary900: "#d4d4d4",
        primary950: "#ffffff",
        rtCanvas: "#000000",
        rtHeading: "#ededed",
        rtBody: "#a3a3a3",
        rtSubtle: "#737373",
        rtIconMuted: "#a3a3a3",
        rtBorder: "#333333",
        rtLevelBeginner: "#0a0a0a",
        rtLevelIntermediate: "#111111",
        rtLevelAdvanced: "#171717",
        rtCardIconBg: "#171717",
        rtLibraryAccent: "#ededed",
        rtLogAccent: "#ededed",
        rtOnPrimary: "#0a0a0a",
      },
    },
  },
};
