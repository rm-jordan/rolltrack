import { render } from "@testing-library/react-native";
import BeltIcon from "./BeltIcon";

describe("BeltIcon", () => {
  it("renders for each belt level without throwing", () => {
    const belts = ["White", "Blue", "Purple", "Brown", "Black"] as const;
    for (const belt of belts) {
      const { toJSON, unmount } = render(<BeltIcon belt={belt} />);
      expect(toJSON()).not.toBeNull();
      unmount();
    }
  });

  it("renders with each size variant", () => {
    for (const size of ["xs", "sm", "md", "lg"] as const) {
      const { toJSON, unmount } = render(<BeltIcon belt="Blue" size={size} />);
      expect(toJSON()).not.toBeNull();
      unmount();
    }
  });
});
