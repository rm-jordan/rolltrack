import { Box, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
import TechniqueCard from "@/components/TechniqueCard";
import { normalizeLevel, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

export default function LevelTechniquesScreen() {
  const router = useRouter();
  const { level: levelParam } = useLocalSearchParams<{ level: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);

  const level = normalizeLevel(levelParam);

  const filtered = useMemo(() => {
    if (!level) return [];
    return techniques.filter((t) => techniqueLevel(t) === level);
  }, [level, techniques]);

  const goHome = () => {
    router.navigate("/(tabs)");
  };

  if (!level) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
        <Box px="$5" pt="$4">
          <ScreenHeader title="Unknown level" onBack={goHome} backLabel="Home" />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
      >
        <ScreenHeader title={`${level} techniques`} onBack={goHome} backLabel="Home" />

        <Text color="$coolGray900" fontSize="$3xl" fontWeight="$bold" mt="$2">
          {level}
        </Text>
        <Text color="$coolGray500" mt="$1">
          {filtered.length} technique{filtered.length === 1 ? "" : "s"} · level guidance
        </Text>

        <Box mt="$4">
          {filtered.length === 0 ? (
            <EmptyStateCard
              title="No techniques for this level"
              message="Add techniques in Library and tag them with this level."
              actionLabel="Go to library"
              onAction={() => router.push("/(tabs)/library")}
            />
          ) : (
            <VStack>
              {filtered.map((technique) => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  onPress={() =>
                    router.push({
                      pathname: "/technique/[id]",
                      params: { id: technique.id },
                    })
                  }
                />
              ))}
            </VStack>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
