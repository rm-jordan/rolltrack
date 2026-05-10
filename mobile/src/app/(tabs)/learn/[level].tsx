import { Box, ScrollView, VStack } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenCanvas from "@/components/ScreenCanvas";
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
      <ScreenCanvas>
        <Box px="$5" pt="$4">
          <ScreenHeader title="Unknown level" onBack={goHome} backLabel="Home" appearanceToggle />
        </Box>
      </ScreenCanvas>
    );
  }

  const subtitle = `${filtered.length} technique${filtered.length === 1 ? "" : "s"} · level guidance`;

  return (
    <ScreenCanvas>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
      >
        <ScreenHeader
          title={level}
          subtitle={subtitle}
          onBack={goHome}
          backLabel="Home"
          appearanceToggle
        />

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
    </ScreenCanvas>
  );
}
