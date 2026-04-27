import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import RootLayout from "../../app/_layout";

jest.mock("../../../global.css", () => ({}), { virtual: true });

const mockHydrateFromApi = jest
  .fn<Promise<void>, []>()
  .mockRejectedValueOnce(new TypeError("Network request failed"))
  .mockResolvedValueOnce(undefined);

const mockStoreState = {
  hydrateFromApi: mockHydrateFromApi,
};

jest.mock("expo-router", () => {
  const Stack = () => null;
  Stack.displayName = "MockStack";
  const Screen = () => null;
  Screen.displayName = "MockStackScreen";
  Stack.Screen = Screen;
  return { Stack };
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: unknown }) => children,
}));

jest.mock("@/state/store", () => {
  const hook = (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState);
  (hook as unknown as { getState: () => typeof mockStoreState }).getState = () => mockStoreState;
  return { useRollTrackStore: hook };
});

describe("RootLayout retry state", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.useRealTimers();
    mockHydrateFromApi.mockClear();
    mockHydrateFromApi
      .mockRejectedValueOnce(new TypeError("Network request failed"))
      .mockResolvedValueOnce(undefined);
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("shows error then retries successfully", async () => {
    const { getByText, queryByText } = render(<RootLayout />);

    await waitFor(() => expect(getByText("Cannot connect to API")).toBeTruthy());
    fireEvent.press(getByText("Retry"));

    await waitFor(() => expect(queryByText("Cannot connect to API")).toBeNull());
    expect(mockHydrateFromApi).toHaveBeenCalledTimes(2);
  });

  it("shows intro overlay then fades it out after load", async () => {
    jest.useFakeTimers();
    mockHydrateFromApi.mockReset();
    mockHydrateFromApi.mockResolvedValueOnce(undefined);

    const { getByText, queryByText } = render(<RootLayout />);
    expect(getByText("Loading data…")).toBeTruthy();

    await waitFor(() => expect(mockHydrateFromApi).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(getByText("RollTrack")).toBeTruthy());

    act(() => {
      jest.advanceTimersByTime(2600);
    });

    await waitFor(() =>
      expect(queryByText("Log your sessions, review your techniques, and track your progress.")).toBeNull(),
    );
  });
});
