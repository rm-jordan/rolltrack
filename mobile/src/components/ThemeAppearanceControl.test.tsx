import { renderWithGluestack } from "@/test-utils/renderWithGluestack";
import ThemeAppearanceControl from "./ThemeAppearanceControl";

describe("ThemeAppearanceControl", () => {
  it("renders all theme options in compact mode", () => {
    const { getByText, getByLabelText } = renderWithGluestack(<ThemeAppearanceControl />);

    expect(getByText("Auto")).toBeTruthy();
    expect(getByText("Light")).toBeTruthy();
    expect(getByText("Dark")).toBeTruthy();
    expect(getByLabelText("Theme Dark")).toBeTruthy();
  });

  it("renders all theme options in panel mode", () => {
    const { getByText } = renderWithGluestack(<ThemeAppearanceControl variant="panel" />);

    expect(getByText("Auto")).toBeTruthy();
    expect(getByText("Light")).toBeTruthy();
    expect(getByText("Dark")).toBeTruthy();
  });
});
