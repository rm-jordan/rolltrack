import { fireEvent } from "@testing-library/react-native";
import { renderWithGluestack } from "@/test-utils/renderWithGluestack";
import ScreenHeader from "./ScreenHeader";

const mockPush = jest.fn();

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

describe("ScreenHeader", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });
  it("renders title/subtitle and no back button by default", () => {
    const { getByText, queryByLabelText } = renderWithGluestack(
      <ScreenHeader title="Library" subtitle="Search and filter." />,
    );

    expect(getByText("Library")).toBeTruthy();
    expect(getByText("Search and filter.")).toBeTruthy();
    expect(queryByLabelText("Back")).toBeNull();
  });

  it("renders back button and calls onBack", () => {
    const onBack = jest.fn();
    const { getByLabelText } = renderWithGluestack(
      <ScreenHeader title="Learn" onBack={onBack} backLabel="Home" />,
    );

    fireEvent.press(getByLabelText("Home"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders right action and calls it", () => {
    const onPress = jest.fn();
    const { getByText } = renderWithGluestack(
      <ScreenHeader title="Library" rightAction={{ label: "Add move", onPress }} />,
    );

    fireEvent.press(getByText("Add move"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders settings gear and navigates to /settings", () => {
    const { getByLabelText } = renderWithGluestack(<ScreenHeader title="Library" settingsGear />);

    fireEvent.press(getByLabelText("Settings"));
    expect(mockPush).toHaveBeenCalledWith("/settings");
  });
});
