import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { render, type RenderOptions } from "@testing-library/react-native";
import type { ReactElement } from "react";

export function renderWithGluestack(ui: ReactElement, options?: RenderOptions) {
  return render(<GluestackUIProvider config={config}>{ui}</GluestackUIProvider>, options);
}
