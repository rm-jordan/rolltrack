import { fireEvent } from "@testing-library/react-native";
import { renderWithGluestack } from "@/test-utils/renderWithGluestack";
import SettingsGearButton from "./SettingsGearButton";

const mockPush = jest.fn();

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

describe("SettingsGearButton", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("navigates to /settings when pressed", () => {
    const { getByLabelText } = renderWithGluestack(<SettingsGearButton />);

    fireEvent.press(getByLabelText("Settings"));
    expect(mockPush).toHaveBeenCalledWith("/settings");
  });
});
