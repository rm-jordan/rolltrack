import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { TechniqueLevel } from "@rolltrack/shared";
import TechniqueCard from "@/components/TechniqueCard";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
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
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
        <ScreenHeader
          title="Library"
          subtitle="Search and filter your techniques."
          onBack={goHome}
          backLabel="Home"
          rightAction={{ label: "Add move", onPress: () => router.push("/technique/new") }}
        />

        <View className="mt-4 rounded-3xl border border-cyan-200 bg-white p-4">
          <View className="flex-row items-center">
            <Ionicons name="search-outline" size={18} color="#0891b2" />
            <Text className="text-zinc-500 text-xs uppercase ml-2 tracking-wide">Search</Text>
          </View>
          <Text className="text-zinc-700 mt-2 text-sm">
            By name, position, category, or tag. Tap a card for details.
          </Text>
        </View>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search techniques…"
          placeholderTextColor="#a1a1aa"
          className="bg-white text-zinc-900 border border-zinc-200 rounded-2xl px-4 py-3 mt-4"
        />

        <Text className="text-zinc-600 text-xs font-medium mt-4 mb-2">Sort</Text>
        <View className="flex-row flex-wrap">
          {sortOptions.map(({ key, label }) => {
            const active = sortBy === key;
            return (
              <Pressable
                key={key}
                onPress={() => setSortBy(key)}
                className={`rounded-full px-4 py-2 mr-2 mb-2 border ${
                  active ? "bg-cyan-500 border-cyan-400" : "bg-white border-zinc-200"
                }`}
              >
                <Text className={active ? "text-white font-medium text-sm" : "text-zinc-700 text-sm"}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-zinc-600 text-xs font-medium mt-2 mb-2">Technique level</Text>
        <View className="flex-row flex-wrap">
          {levelFilters.map((level) => {
            const active = selectedLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => setSelectedLevel(level)}
                className={`flex-row items-center rounded-full px-3 py-2 mr-2 mb-2 border ${
                  active ? "bg-cyan-500 border-cyan-400" : "bg-white border-zinc-200"
                }`}
              >
                {level === "All" ? (
                  <Ionicons name="layers-outline" size={15} color={active ? "#ffffff" : "#3f3f46"} />
                ) : (
                  <Ionicons name="school-outline" size={15} color={active ? "#ffffff" : "#3f3f46"} />
                )}
                <Text className={`ml-1.5 ${active ? "text-white font-medium" : "text-zinc-700 font-medium"}`}>
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-zinc-400 text-xs mb-3 mt-1">
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
          filteredTechniques.map((technique) => (
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
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}