import { View } from "react-native";
import type { BeltLevel } from "@rolltrack/shared";
import { blackBeltRedBar, beltBorderColor, beltKnotColor, beltMainColor } from "@/lib/beltColors";

const sizes = {
  xs: { w: 32, h: 12, knot: 5, radius: 2, redH: 1.5 },
  sm: { w: 40, h: 16, knot: 6, radius: 3, redH: 2 },
  md: { w: 52, h: 20, knot: 8, radius: 4, redH: 2.5 },
  lg: { w: 64, h: 24, knot: 10, radius: 5, redH: 3 },
} as const;

type BeltIconProps = {
  belt: BeltLevel;
  size?: keyof typeof sizes;
};

export default function BeltIcon({ belt, size = "md" }: BeltIconProps) {
  const s = sizes[size];
  const main = beltMainColor[belt];
  const border = beltBorderColor[belt];
  const knot = beltKnotColor[belt];

  return (
    <View
      style={{
        width: s.w,
        height: s.h + 4,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: s.w,
          height: s.h,
          borderRadius: s.radius,
          backgroundColor: main,
          borderWidth: belt === "White" ? 1.5 : 0,
          borderColor: border,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {belt === "Black" ? (
          <View
            style={{
              position: "absolute",
              width: s.w * 0.55,
              height: s.redH,
              borderRadius: 1,
              backgroundColor: blackBeltRedBar,
            }}
          />
        ) : null}

        <View
          style={{
            width: s.knot,
            height: s.h - 4,
            borderRadius: 2,
            backgroundColor: knot,
            opacity: belt === "White" ? 0.9 : 0.85,
          }}
        />
      </View>
    </View>
  );
}
