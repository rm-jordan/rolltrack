import { config as baseConfig } from "@gluestack-ui/config";

/**
 * RollTrack colour system aligned with **astro.build** marketing tokens (from their Tailwind bundle):
 * - Accent gradient: `linear-gradient(83.21deg, #3245ff, #b845ed)` → solid CTAs use Astro blue; Library/Log use blue + purple stops.
 * - Light canvas: astro-gray-100 `#f2f6fa`; text: gray-700 / gray-400 / gray-300.
 * - Dark canvas: gray-700 `#17191e`; cards `#23262d`; borders / outline `#343841`; muted `#858b98`.
 * - Focus on web: `#e8c4f9` (astro-pink-light) — wire in components if you add focus rings.
 *
 * Icon semantics: `rtIconMuted` chevrons / navigation; `rtLibraryAccent` / `rtLogAccent` for home shortcuts;
 * `primary500` (via `useRolltrackColor("primary500")`) for feature / category / empty-state accents.
 */
export const rolltrackConfig = {
  ...baseConfig,
  tokens: {
    ...baseConfig.tokens,
    colors: {
      ...baseConfig.tokens.colors,
      /** Surfaces (inputs, chips, cards) — Astro light grays */
      backgroundLight0: "#ffffff",
      backgroundLightMuted: "#e4e9f0",
      backgroundLight200: "#d0d7e2",
      primary0: "#f8f9ff",
      primary50: "#eef1ff",
      primary100: "#dde3ff",
      primary200: "#b9c5ff",
      primary300: "#8c9dff",
      primary400: "#5a6fff",
      primary500: "#3245ff",
      primary600: "#2538e0",
      primary700: "#1c2bb8",
      primary800: "#1a2487",
      primary900: "#171a52",
      primary950: "#0d0f2a",
      rtCanvas: "#f2f6fa",
      rtHeading: "#17191e",
      rtBody: "#545864",
      rtSubtle: "#858b98",
      rtIconMuted: "#858b98",
      rtBorder: "#d8dee6",
      rtLevelBeginner: "#ffffff",
      rtLevelIntermediate: "#f7f9fc",
      rtLevelAdvanced: "#eef2f8",
      rtCardIconBg: "#ffffff",
      rtLibraryAccent: "#b845ed",
      rtLogAccent: "#3245ff",
      rtOnPrimary: "#ffffff",
    },
  },
  themes: {
    dark: {
      colors: {
        backgroundDark900: "#23262d",
        backgroundDarkMuted: "#1c2127",
        backgroundDark700: "#343841",
        primary0: "#0a0c12",
        primary50: "#12151f",
        primary100: "#181c28",
        primary200: "#1f2433",
        primary300: "#2a3145",
        primary400: "#5e6fff",
        primary500: "#3245ff",
        primary600: "#5b6eff",
        primary700: "#7d8fff",
        primary800: "#a8b4ff",
        primary900: "#d6dcff",
        primary950: "#eef1ff",
        rtCanvas: "#17191e",
        rtHeading: "#f2f6fa",
        rtBody: "#bfc1c9",
        rtSubtle: "#858b98",
        rtIconMuted: "#858b98",
        rtBorder: "#343841",
        rtLevelBeginner: "#17191e",
        rtLevelIntermediate: "#1b1e25",
        rtLevelAdvanced: "#1f2229",
        rtCardIconBg: "#23262d",
        rtLibraryAccent: "#d68df5",
        rtLogAccent: "#7c8cff",
        rtOnPrimary: "#ffffff",
      },
    },
  },
};
