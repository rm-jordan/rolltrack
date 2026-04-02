import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRollTrackStore } from "../lib/store";
import "../global.css";

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(() => useRollTrackStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useRollTrackStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useRollTrackStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-[#efedf8] items-center justify-center">
          <ActivityIndicator color="#059669" size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}