import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, HStack, Input, InputField, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TechniqueLevel } from "@rolltrack/shared";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
import TechniqueCard from "@/components/TechniqueCard";
import { LEVELS, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

type SortKey = "recent" | "practice" | "name";

export default function LibraryScreen() {
  const router = useRouter();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
      >
        <ScreenHeader
          title="Library"
          subtitle="Search and filter your techniques."
          onBack={goHome}
          backLabel="Home"
          rightAction={{ label: "Add move", onPress: () => router.push("/technique/new") }}
        />

        <Box mt="$4" borderRadius="$3xl" borderWidth={1} borderColor="#a5f3fc" bg="$white" p="$4">
          <HStack alignItems="center">
            <Ionicons name="search-outline" size={18} color="#0891b2" />
            <Text color="$coolGray500" fontSize="$xs" textTransform="uppercase" ml="$2" letterSpacing={1}>
              Search
            </Text>
          </HStack>
          <Text color="$coolGray700" mt="$2" fontSize="$sm">
            By name, position, category, or tag. Tap a card for details.
          </Text>
        </Box>

        <Input
          mt="$4"
          borderRadius="$2xl"
          borderWidth={1}
          borderColor="#e4e4e7"
          bg="$white"
          px="$1"
        >
          <InputField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search techniques…"
            placeholderTextColor="#a1a1aa"
            color="#18181b"
            py="$3"
            px="$3"
          />
        </Input>

        <Text color="$coolGray600" fontSize="$xs" fontWeight="$medium" mt="$4" mb="$2">
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
                bg={active ? "$cyan500" : "$white"}
                borderColor={active ? "$cyan400" : "#e4e4e7"}
                $pressed={{ opacity: 0.9 }}
              >
                <Text color={active ? "$white" : "$coolGray700"} fontWeight="$medium" fontSize="$sm">
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$coolGray600" fontSize="$xs" fontWeight="$medium" mt="$2" mb="$2">
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
                bg={active ? "$cyan500" : "$white"}
                borderColor={active ? "$cyan400" : "#e4e4e7"}
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

        <Text color="$coolGray400" fontSize="$xs" mb="$3" mt="$1">
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
    </SafeAreaView>
  );
}
