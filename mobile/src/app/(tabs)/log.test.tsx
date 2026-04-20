import { fireEvent, render } from "@testing-library/react-native";
import LogScreen from "./log";

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

const mockRouterPush = jest.fn();
const mockRouterNavigate = jest.fn();

const mockStoreState = {
  addSessionLog: jest.fn(),
  sessionLogs: [],
  techniques: [],
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

describe("LogScreen states", () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
    mockRouterNavigate.mockClear();
    mockStoreState.addSessionLog.mockClear();
    mockStoreState.sessionLogs = [];
    mockStoreState.techniques = [];
  });

  it("shows techniques empty state and routes to library action", () => {
    const { getByText } = render(<LogScreen />);

    expect(getByText("No techniques available")).toBeTruthy();
    fireEvent.press(getByText("Go to library"));
    expect(mockRouterPush).toHaveBeenCalledWith("/(tabs)/library");
  });
});
