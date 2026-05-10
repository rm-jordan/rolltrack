import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Card, HStack, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import type { TechniqueLevel } from "@rolltrack/shared";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenCanvas from "@/components/ScreenCanvas";
import ScreenHeader from "@/components/ScreenHeader";
import TechniqueCard from "@/components/TechniqueCard";
import { LEVELS, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

const levelFilters: ("All" | TechniqueLevel)[] = ["All", ...LEVELS];

export default function LearnIndexScreen() {
  const router = useRouter();
  const onPrimary = useRolltrackColor("rtOnPrimary");
  const filterIconMuted = useRolltrackColor("rtIconMuted");
  const techniques = useRollTrackStore((state) => state.techniques);
  const [selectedLevel, setSelectedLevel] = useState<"All" | TechniqueLevel>("All");

  const filteredTechniques = useMemo(() => {
    if (selectedLevel === "All") {
      return techniques;
    }
    return techniques.filter((technique) => techniqueLevel(technique) === selectedLevel);
  }, [selectedLevel, techniques]);

  const goHome = () => {
    router.navigate("/(tabs)");
  };

  return (
    <ScreenCanvas>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
      >
        <ScreenHeader
          title="Learn"
          subtitle="Technique levels are guidelines for progression, not strict rules."
          onBack={goHome}
          backLabel="Home"
          appearanceToggle
        />

        <Card variant="outline" size="lg" mt="$4" p="$4" borderColor="$rtBorder" bg="$backgroundLight0" sx={{ _dark: { bg: "$backgroundDark900" } }}>
          <HStack alignItems="center">
            <Ionicons name="school-outline" size={18} color={filterIconMuted} />
            <Text color="$rtSubtle" fontSize="$xs" textTransform="uppercase" ml="$2" letterSpacing={1}>
              Learning path
            </Text>
          </HStack>
          <Text color="$rtBody" mt="$2" fontSize="$sm">
            Filter here, or use Home to jump straight into a level.
          </Text>
        </Card>

        <Text color="$rtBody" fontSize="$xs" fontWeight="$medium" mt="$4" mb="$2">
          Technique level
        </Text>
        <HStack flexWrap="wrap">
          {levelFilters.map((level) => {
            const active = selectedLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => setSelectedLevel(level)}
                flexDirection="row"
                alignItems="center"
                borderRadius="$full"
                px="$3"
                py="$2"
                mr="$2"
                mb="$2"
                borderWidth={1}
                borderColor={active ? "$primary400" : "$rtBorder"}
                bg={active ? "$primary500" : "$backgroundLightMuted"}
                sx={{
                  _dark: {
                    bg: active ? "$primary500" : "$backgroundDarkMuted",
                    borderColor: active ? "$primary400" : "$rtBorder",
                  },
                }}
                $pressed={{ opacity: 0.9 }}
              >
                {level === "All" ? (
                  <Ionicons name="layers-outline" size={15} color={active ? onPrimary : filterIconMuted} />
                ) : (
                  <Ionicons name="school-outline" size={15} color={active ? onPrimary : filterIconMuted} />
                )}
                <Text ml="$1.5" color={active ? "$rtOnPrimary" : "$rtHeading"} fontWeight="$medium" fontSize="$sm">
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Box mt="$4">
          {filteredTechniques.length === 0 ? (
            <EmptyStateCard
              title="No techniques yet"
              message="Add techniques from Library to start learning."
              actionLabel="Open library"
              onAction={() => router.push("/(tabs)/library")}
            />
          ) : (
            <VStack>
              {filteredTechniques.map((technique) => (
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
