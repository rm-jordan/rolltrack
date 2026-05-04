import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, HStack, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TechniqueLevel } from "@rolltrack/shared";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
import TechniqueCard from "@/components/TechniqueCard";
import { LEVELS, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

const levelFilters: ("All" | TechniqueLevel)[] = ["All", ...LEVELS];

export default function LearnIndexScreen() {
  const router = useRouter();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
      >
        <ScreenHeader
          title="Learn"
          subtitle="Technique levels are guidelines for progression, not strict rules."
          onBack={goHome}
          backLabel="Home"
        />

        <Box mt="$4" borderRadius="$3xl" borderWidth={1} borderColor="#ddd6fe" bg="$white" p="$4">
          <HStack alignItems="center">
            <Ionicons name="school-outline" size={18} color="#7c3aed" />
            <Text color="$coolGray500" fontSize="$xs" textTransform="uppercase" ml="$2" letterSpacing={1}>
              Learning path
            </Text>
          </HStack>
          <Text color="$coolGray700" mt="$2" fontSize="$sm">
            Filter here, or use Home to jump straight into a level.
          </Text>
        </Box>

        <Text color="$coolGray600" fontSize="$xs" fontWeight="$medium" mt="$4" mb="$2">
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
                bg={active ? "$violet600" : "$white"}
                borderColor={active ? "$violet500" : "#e4e4e7"}
                $pressed={{ opacity: 0.9 }}
              >
                {level === "All" ? (
                  <Ionicons name="layers-outline" size={15} color={active ? "#ffffff" : "#3f3f46"} />
                ) : (
                  <Ionicons name="school-outline" size={15} color={active ? "#ffffff" : "#3f3f46"} />
                )}
                <Text
                  ml="$1.5"
                  color={active ? "$white" : "$coolGray700"}
                  fontWeight="$medium"
                  fontSize="$sm"
                >
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Box mt="$2">
          {filteredTechniques.length === 0 ? (
            <EmptyStateCard
              title="No techniques yet"
              message="No techniques are tagged for this level yet."
              actionLabel="Show all levels"
              onAction={() => setSelectedLevel("All")}
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
    </SafeAreaView>
  );
}
