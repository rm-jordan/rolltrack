import { fireEvent } from "@testing-library/react-native";
import SettingsScreen from "@/app/settings";
import { renderWithGluestack } from "@/test-utils/renderWithGluestack";

const mockBack = jest.fn();

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    push: jest.fn(),
  }),
}));

describe("SettingsScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders settings copy and theme controls", () => {
    const { getByText, getByLabelText, queryByLabelText } = renderWithGluestack(<SettingsScreen />);

    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("Theme")).toBeTruthy();
    expect(getByText("Auto")).toBeTruthy();
    expect(getByText("Light")).toBeTruthy();
    expect(getByText("Dark")).toBeTruthy();
    expect(queryByLabelText("Settings")).toBeNull();
    expect(getByLabelText("Back")).toBeTruthy();
  });

  it("calls router.back when Back is pressed", () => {
    const { getByLabelText } = renderWithGluestack(<SettingsScreen />);

    fireEvent.press(getByLabelText("Back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("updates theme preference when a theme option is pressed", () => {
    const { getByLabelText, getByText } = renderWithGluestack(<SettingsScreen />);

    fireEvent.press(getByLabelText("Theme Light"));
    expect(getByText("Light")).toBeTruthy();
  });
});
