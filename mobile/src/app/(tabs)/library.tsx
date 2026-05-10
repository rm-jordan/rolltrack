import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, HStack, Input, InputField, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useRolltrackColor } from "@/theme/useRolltrackToken";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import type { TechniqueLevel } from "@rolltrack/shared";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenCanvas from "@/components/ScreenCanvas";
import ScreenHeader from "@/components/ScreenHeader";
import TechniqueCard from "@/components/TechniqueCard";
import { LEVELS, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

type SortKey = "recent" | "practice" | "name";

export default function LibraryScreen() {
  const router = useRouter();
  const libraryAccent = useRolltrackColor("rtLibraryAccent");
  const onPrimary = useRolltrackColor("rtOnPrimary");
  const techniques = useRollTrackStore((state) => state.techniques);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"All" | TechniqueLevel>("All");
  const [sortBy, setSortBy] = useState<SortKey>("recent");

  const levelFilters: ("All" | TechniqueLevel)[] = ["All", ...LEVELS];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "recent", label: "Recent" },
    { key: "practice", label: "Most practiced" },
    { key: "name", label: "A–Z" },
  ];

  const filteredTechniques = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = techniques.filter((technique) => {
      const matchesLevel = selectedLevel === "All" || techniqueLevel(technique) === selectedLevel;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        technique.name.toLowerCase().includes(normalizedQuery) ||
        technique.position.toLowerCase().includes(normalizedQuery) ||
        technique.category.toLowerCase().includes(normalizedQuery) ||
        technique.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesLevel && matchesSearch;
    });

    const sorted = [...filtered];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "practice") {
      sorted.sort((a, b) => b.timesPracticed - a.timesPracticed);
    } else {
      sorted.sort((a, b) => {
        const da = a.lastPracticed ?? "";
        const db = b.lastPracticed ?? "";
        return db.localeCompare(da);
      });
    }
    return sorted;
  }, [searchQuery, selectedLevel, sortBy, techniques]);

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
          title="Library"
          subtitle="Search and filter your techniques."
          onBack={goHome}
          backLabel="Home"
          settingsGear
          rightAction={{ label: "Add move", onPress: () => router.push("/technique/new") }}
        />

        <Card variant="outline" size="lg" mt="$4" p="$4" borderColor="$rtBorder" bg="$backgroundLight0" sx={{ _dark: { bg: "$backgroundDark900" } }}>
          <HStack alignItems="center">
            <Ionicons name="search-outline" size={18} color={libraryAccent} />
            <Text color="$rtSubtle" fontSize="$xs" textTransform="uppercase" ml="$2" letterSpacing={1}>
              Search
            </Text>
          </HStack>
          <Text color="$rtBody" mt="$2" fontSize="$sm">
            By name, position, category, or tag. Tap a card for details.
          </Text>
        </Card>

        <Input
          mt="$4"
          borderRadius="$2xl"
          borderWidth={1}
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          px="$1"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <InputField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search techniques…"
            placeholderTextColor="$rtSubtle"
            color="$rtHeading"
            py="$3"
            px="$3"
          />
        </Input>

        <Text color="$rtBody" fontSize="$xs" fontWeight="$medium" mt="$4" mb="$2">
          Sort
        </Text>
        <HStack flexWrap="wrap">
          {sortOptions.map(({ key, label }) => {
            const active = sortBy === key;
            return (
              <Pressable
                key={key}
                onPress={() => setSortBy(key)}
                borderRadius="$full"
                px="$4"
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
                <Text color={active ? "$rtOnPrimary" : "$rtHeading"} fontWeight="$medium" fontSize="$sm">
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$rtBody" fontSize="$xs" fontWeight="$medium" mt="$2" mb="$2">
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
                  <Ionicons name="layers-outline" size={15} color={active ? onPrimary : libraryAccent} />
                ) : (
                  <Ionicons name="school-outline" size={15} color={active ? onPrimary : libraryAccent} />
                )}
                <Text ml="$1.5" color={active ? "$rtOnPrimary" : "$rtHeading"} fontWeight="$medium" fontSize="$sm">
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$rtSubtle" fontSize="$xs" mb="$3" mt="$1">
          {filteredTechniques.length} of {techniques.length} techniques
        </Text>

        {filteredTechniques.length === 0 ? (
          <EmptyStateCard
            title="No matching techniques"
            message="Try clearing search text or switching level/sort filters."
            actionLabel="Reset filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedLevel("All");
              setSortBy("recent");
            }}
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
      </ScrollView>
    </ScreenCanvas>
  );
}
