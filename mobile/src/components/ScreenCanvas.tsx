import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

type ScreenCanvasProps = {
  children: ReactNode;
};

export default function ScreenCanvas({ children }: ScreenCanvasProps) {
  const bg = useRolltrackColor("rtCanvas");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top", "left", "right", "bottom"]}>
      {children}
    </SafeAreaView>
  );
}
