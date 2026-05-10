import { Box, Button, ButtonText, GluestackUIProvider, Pressable, Text, VStack } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRollTrackStore } from "@/state/store";
import { rolltrackConfig } from "@/theme/rolltrackGluestackConfig";
import { ThemePreferenceProvider, useThemePreference } from "@/theme/ThemePreferenceContext";
import { useRolltrackColor } from "@/theme/useRolltrackToken";
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
  const [showIntro, setShowIntro] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);
  const introOpacity = useRef(new Animated.Value(1)).current;
  const canvasColor = useRolltrackColor("rtCanvas");
  const spinnerColor = useRolltrackColor("rtHeading");

  const INTRO_KEY = "rolltrack-intro-seen";

  const markIntroSeen = async () => {
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        localStorage.setItem(INTRO_KEY, "1");
      } else {
        await AsyncStorage.setItem(INTRO_KEY, "1");
      }
    } catch {
      // best-effort only; ignore storage failures
    }
    setIntroSeen(true);
  };

  const hydrate = async () => {
    setLoadError(null);
    await useRollTrackStore.getState().hydrateFromApi();
  };

  useEffect(() => {
    let cancelled = false;

    // Check if intro has already been seen
    void (async () => {
      try {
        let seen = false;
        if (Platform.OS === "web" && typeof localStorage !== "undefined") {
          seen = localStorage.getItem(INTRO_KEY) === "1";
        } else {
          const stored = await AsyncStorage.getItem(INTRO_KEY);
          seen = stored === "1";
        }
        if (!cancelled) {
          setIntroSeen(seen);
          if (seen) {
            setShowIntro(false);
          }
        }
      } catch {
        if (!cancelled) {
          setIntroSeen(false);
        }
      }
    })();

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
    if (!ready || loadError || introSeen || showIntro) return;

    const animation = Animated.sequence([
      Animated.delay(1800),
      Animated.timing(introOpacity, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    setShowIntro(true);

    animation.start(async ({ finished }) => {
      if (finished) {
        setShowIntro(false);
        await markIntroSeen();
      }
    });

    return () => {
      animation.stop();
    };
  }, [introOpacity, loadError, ready, showIntro]);

  if (!ready) {
    return (
      <VStack flex={1} bg="$rtCanvas" alignItems="center" justifyContent="center" px="$6">
        <ActivityIndicator color={spinnerColor} size="large" />
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
            borderRadius="$md"
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
            backgroundColor: canvasColor,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <Box h={64} w={64} borderRadius="$3xl" bg="$primary500" alignItems="center" justifyContent="center">
            <Text color="$rtOnPrimary" fontSize="$3xl" fontWeight="$bold">
              R
            </Text>
          </Box>
          <Text color="$rtHeading" fontSize="$3xl" fontWeight="$bold" mt="$5">
            RollTrack
          </Text>
          <Text color="$rtBody" textAlign="center" mt="$3">
            Log your sessions, review your techniques, and track your progress.
          </Text>
          <Button
            size="sm"
            variant="outline"
            action="secondary"
            mt="$6"
            borderRadius="$md"
            borderColor="$rtBorder"
            onPress={async () => {
              setShowIntro(false);
              await markIntroSeen();
            }}
          >
            <ButtonText>Skip intro</ButtonText>
          </Button>
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
