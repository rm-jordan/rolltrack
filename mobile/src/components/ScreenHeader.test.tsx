import { fireEvent, render } from "@testing-library/react-native";
import ScreenHeader from "./ScreenHeader";

jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

describe("ScreenHeader", () => {
  it("renders title/subtitle and no back button by default", () => {
    const { getByText, queryByLabelText } = render(
      <ScreenHeader title="Library" subtitle="Search and filter." />,
    );

    expect(getByText("Library")).toBeTruthy();
    expect(getByText("Search and filter.")).toBeTruthy();
    expect(queryByLabelText("Back")).toBeNull();
  });

  it("renders back button and calls onBack", () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(
      <ScreenHeader title="Learn" onBack={onBack} backLabel="Home" />,
    );

    fireEvent.press(getByLabelText("Home"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders right action and calls it", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ScreenHeader title="Library" rightAction={{ label: "Add move", onPress }} />,
    );

    fireEvent.press(getByText("Add move"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
