import { fireEvent, render } from "@testing-library/react-native";
import LibraryScreen from "../../app/(tabs)/library";

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

const mockRouterPush = jest.fn();
const mockRouterNavigate = jest.fn();

const technique = {
  id: "tech-1",
  name: "Armbar",
  position: "Guard",
  category: "Submission",
  level: "Beginner",
  tags: ["fundamental"],
  notes: null,
  timesPracticed: 0,
  lastPracticed: null,
};

const mockStoreState = {
  techniques: [technique],
};

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    navigate: mockRouterNavigate,
  }),
}));

jest.mock("@/state/store", () => ({
  useRollTrackStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

describe("LibraryScreen filters", () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
    mockRouterNavigate.mockClear();
    mockStoreState.techniques = [technique];
  });

  it("resets filters from empty state action", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<LibraryScreen />);

    fireEvent.changeText(getByPlaceholderText("Search techniques…"), "zzzz");

    expect(getByText("No matching techniques")).toBeTruthy();
    expect(getByText("0 of 1 techniques")).toBeTruthy();

    fireEvent.press(getByText("Reset filters"));

    expect(getByText("1 of 1 techniques")).toBeTruthy();
    expect(queryByText("No matching techniques")).toBeNull();
  });
});
