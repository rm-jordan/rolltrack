import { fireEvent } from "@testing-library/react-native";
import { renderWithGluestack } from "@/test-utils/renderWithGluestack";
import EmptyStateCard from "./EmptyStateCard";

jest.mock("@gluestack-ui/config");
jest.mock("@expo/vector-icons/Ionicons", () => "Ionicons");

describe("EmptyStateCard", () => {
  it("renders title and message", () => {
    const { getByText, queryByText } = renderWithGluestack(
      <EmptyStateCard title="No items" message="Try adding one." />,
    );

    expect(getByText("No items")).toBeTruthy();
    expect(getByText("Try adding one.")).toBeTruthy();
    expect(queryByText("Retry")).toBeNull();
  });

  it("renders and handles action press when action props exist", () => {
    const onAction = jest.fn();
    const { getByText } = renderWithGluestack(
      <EmptyStateCard
        title="No data"
        message="Connect and retry."
        actionLabel="Retry"
        onAction={onAction}
      />,
    );

    fireEvent.press(getByText("Retry"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
