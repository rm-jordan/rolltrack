import { Box, GluestackUIProvider, Pressable, Text, VStack } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRollTrackStore } from "@/state/store";
import { rolltrackConfig } from "@/theme/rolltrackGluestackConfig";
import { ThemePreferenceProvider, useThemePreference } from "@/theme/ThemePreferenceContext";
import "../../global.css";

function AppProviders({ children }: { children: ReactNode }) {
  const { resolvedScheme } = useThemePreference();
  return (
    <GluestackUIProvider config={rolltrackConfig} colorMode={resolvedScheme}>
      <SafeAreaProvider>
        <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />
        {children}
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}

function RootLayoutBody() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const introOpacity = useRef(new Animated.Value(1)).current;
  const { resolvedScheme } = useThemePreference();

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
      <VStack flex={1} bg="$rtCanvas" alignItems="center" justifyContent="center" px="$6">
        <ActivityIndicator color="#7c3aed" size="large" />
        <Text color="$rtBody" mt="$3" fontSize="$sm">
          Loading data…
        </Text>
      </VStack>
    );
  }

  if (loadError) {
    return (
      <VStack flex={1} bg="$rtCanvas" alignItems="center" justifyContent="center" px="$6">
        <Text color="$rtHeading" fontSize="$lg" fontWeight="$semibold" textAlign="center">
          Cannot connect to API
        </Text>
        <Text color="$rtBody" fontSize="$sm" mt="$3" textAlign="center">
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
            borderColor="$rtBorder"
            bg="$backgroundLight0"
            px="$4"
            py="$2"
            sx={{
              _dark: { bg: "$backgroundDark900" },
            }}
            $pressed={{ opacity: 0.9 }}
          >
            <Text color="$rtHeading" fontWeight="$medium">
              Retry
            </Text>
          </Pressable>
        </Box>
        <Text color="$rtSubtle" fontSize="$xs" mt="$4" textAlign="center">
          Start the server: npm run server{"\n"}
          Set EXPO_PUBLIC_GRAPHQL_URL in mobile/.env (see mobile/.env.example).
        </Text>
      </VStack>
    );
  }

  const introBg = resolvedScheme === "dark" ? "#0c0a12" : "#f3effc";

  return (
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
            backgroundColor: introBg,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <Box h={64} w={64} borderRadius="$3xl" bg="$primary500" alignItems="center" justifyContent="center">
            <Text color="$white" fontSize="$3xl" fontWeight="$bold">
              R
            </Text>
          </Box>
          <Text color="$rtHeading" fontSize="$3xl" fontWeight="$bold" mt="$5">
            RollTrack
          </Text>
          <Text color="$rtBody" textAlign="center" mt="$3">
            Log your sessions, review your techniques, and track your progress.
          </Text>
        </Animated.View>
      ) : null}
    </Box>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <AppProviders>
        <RootLayoutBody />
      </AppProviders>
    </ThemePreferenceProvider>
  );
}
