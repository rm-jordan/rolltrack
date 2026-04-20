import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRollTrackStore } from "@/state/store";
import "../../global.css";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hydrate = async () => {
    setLoadError(null);
    await useRollTrackStore.getState().hydrateFromApi();
  };

  useEffect(() => {
    let cancelled = false;

    hydrate()
      .then(() => {
        if (cancelled) return;
        setReady(true);
      })
      .catch((err: unknown) => {
        console.error("RollTrack API load failed:", err);
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load data from the API.");
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-[#efedf8] items-center justify-center px-6">
          <ActivityIndicator color="#059669" size="large" />
          <Text className="text-zinc-500 mt-3 text-sm">Loading data…</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (loadError) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-[#efedf8] items-center justify-center px-6">
          <Text className="text-zinc-900 text-lg font-semibold text-center">Cannot connect to API</Text>
          <Text className="text-zinc-600 text-sm mt-3 text-center">{loadError}</Text>
          <View className="flex-row mt-4 gap-3">
            <Pressable
              onPress={() => {
                setReady(false);
                hydrate()
                  .then(() => setReady(true))
                  .catch((err: unknown) => {
                    setLoadError(err instanceof Error ? err.message : "Could not load data from the API.");
                    setReady(true);
                  });
              }}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2"
            >
              <Text className="text-zinc-700 font-medium">Retry</Text>
            </Pressable>
          </View>
          <Text className="text-zinc-500 text-xs mt-4 text-center">
            Start the server: npm run server{"\n"}
            Set EXPO_PUBLIC_GRAPHQL_URL in mobile/.env (see mobile/.env.example).
          </Text>
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
