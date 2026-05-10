import { render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemePreferenceProvider, useThemePreference } from "./ThemePreferenceContext";

function PreferenceProbe() {
  const { preference, resolvedScheme } = useThemePreference();
  return (
    <Text testID="probe">
      {preference}:{resolvedScheme}
    </Text>
  );
}

describe("ThemePreferenceProvider", () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it("defaults to dark before and after storage resolves empty", async () => {
    const { getByTestId } = render(
      <ThemePreferenceProvider>
        <PreferenceProbe />
      </ThemePreferenceProvider>,
    );

    const probe = getByTestId("probe");
    expect(probe).toHaveTextContent("dark:dark");

    await waitFor(() => {
      expect(getByTestId("probe")).toHaveTextContent("dark:dark");
    });
  });

  it("restores stored preference when set", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("light");

    const { getByTestId } = render(
      <ThemePreferenceProvider>
        <PreferenceProbe />
      </ThemePreferenceProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("probe")).toHaveTextContent("light:light");
    });
  });
});
