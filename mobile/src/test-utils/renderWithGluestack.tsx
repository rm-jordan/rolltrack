import { GluestackUIProvider } from "@gluestack-ui/themed";
import { render, type RenderOptions } from "@testing-library/react-native";
import type { ReactElement, ReactNode } from "react";
import { rolltrackConfig } from "@/theme/rolltrackGluestackConfig";
import { ThemePreferenceProvider, useThemePreference } from "@/theme/ThemePreferenceContext";

function GluestackWithResolvedMode({ children }: { children: ReactNode }) {
  const { resolvedScheme } = useThemePreference();
  return (
    <GluestackUIProvider config={rolltrackConfig} colorMode={resolvedScheme}>
      {children}
    </GluestackUIProvider>
  );
}

export function renderWithGluestack(ui: ReactElement, options?: RenderOptions) {
  return render(
    <ThemePreferenceProvider>
      <GluestackWithResolvedMode>{ui}</GluestackWithResolvedMode>
    </ThemePreferenceProvider>,
    options,
  );
}
