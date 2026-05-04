import { config } from "@gluestack-ui/config";
import { Box, GluestackUIProvider, Pressable, Text, VStack } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRollTrackStore } from "@/state/store";
import "../../global.css";

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const introOpacity = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (!ready || loadError || !showIntro) return;

    const animation = Animated.sequence([
      Animated.delay(1800),
      Animated.timing(introOpacity, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        setShowIntro(false);
      }
    });

    return () => {
      animation.stop();
    };
  }, [introOpacity, loadError, ready, showIntro]);

  if (!ready) {
    return (
      <AppProviders>
        <VStack flex={1} bg="#efedf8" alignItems="center" justifyContent="center" px="$6">
          <ActivityIndicator color="#059669" size="large" />
          <Text color="$coolGray500" mt="$3" fontSize="$sm">
            Loading data…
          </Text>
        </VStack>
      </AppProviders>
    );
  }

  if (loadError) {
    return (
      <AppProviders>
        <VStack flex={1} bg="#efedf8" alignItems="center" justifyContent="center" px="$6">
          <Text color="$coolGray900" fontSize="$lg" fontWeight="$semibold" textAlign="center">
            Cannot connect to API
          </Text>
          <Text color="$coolGray600" fontSize="$sm" mt="$3" textAlign="center">
            {loadError}
          </Text>
          <Box flexDirection="row" mt="$4">
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
              borderRadius="$xl"
              borderWidth={1}
              borderColor="#d4d4d8"
              bg="$white"
              px="$4"
              py="$2"
              $pressed={{ opacity: 0.9 }}
            >
              <Text color="$coolGray700" fontWeight="$medium">
                Retry
              </Text>
            </Pressable>
          </Box>
          <Text color="$coolGray500" fontSize="$xs" mt="$4" textAlign="center">
            Start the server: npm run server{"\n"}
            Set EXPO_PUBLIC_GRAPHQL_URL in mobile/.env (see mobile/.env.example).
          </Text>
        </VStack>
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <Box flex={1}>
        <Stack screenOptions={{ headerShown: false }} />
        {showIntro ? (
          <Animated.View
            style={{
              opacity: introOpacity,
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "#efedf8",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            <Box h={64} w={64} borderRadius="$3xl" bg="#8b5cf6" alignItems="center" justifyContent="center">
              <Text color="$white" fontSize="$3xl" fontWeight="$bold">
                R
              </Text>
            </Box>
            <Text color="$coolGray900" fontSize="$3xl" fontWeight="$bold" mt="$5">
              RollTrack
            </Text>
            <Text color="$coolGray600" textAlign="center" mt="$3">
              Log your sessions, review your techniques, and track your progress.
            </Text>
          </Animated.View>
        ) : null}
      </Box>
    </AppProviders>
  );
}
