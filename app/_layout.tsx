import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeRollTrackDatabase } from "../lib/db";
import { useRollTrackStore } from "../lib/store";
import "../global.css";

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    initializeRollTrackDatabase()
      .then((data) => {
        if (cancelled) return;
        useRollTrackStore.setState(data);
        setReady(true);
      })
      .catch((err) => {
        console.error("RollTrack DB init failed:", err);
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
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
