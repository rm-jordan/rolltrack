import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { BeltLevel } from "@rolltrack/shared";
import BeltIcon from "@/components/BeltIcon";
import TechniqueCard from "@/components/TechniqueCard";
import { useRollTrackStore } from "@/state/store";

type SortKey = "recent" | "practice" | "name";

export default function LibraryScreen() {
  const router = useRouter();
  const techniques = useRollTrackStore((state) => state.techniques);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBelt, setSelectedBelt] = useState<"All" | BeltLevel>("All");
  const [sortBy, setSortBy] = useState<SortKey>("recent");

  const beltFilters: ("All" | BeltLevel)[] = ["All", "White", "Blue", "Purple", "Brown", "Black"];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "recent", label: "Recent" },
    { key: "practice", label: "Most practiced" },
    { key: "name", label: "A–Z" },
  ];

  const filteredTechniques = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = techniques.filter((technique) => {
      const matchesBelt = selectedBelt === "All" || technique.beltGuideline === selectedBelt;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        technique.name.toLowerCase().includes(normalizedQuery) ||
        technique.position.toLowerCase().includes(normalizedQuery) ||
        technique.category.toLowerCase().includes(normalizedQuery) ||
        technique.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesBelt && matchesSearch;
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
  }, [searchQuery, selectedBelt, sortBy, techniques]);

  const goHome = () => {
    router.navigate("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
        <Pressable
          onPress={goHome}
          className="flex-row items-center self-start py-2 pr-4 mb-2"
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text className="text-zinc-800 ml-1 font-semibold">Home</Text>
        </Pressable>

        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-zinc-900 text-3xl font-bold">Library</Text>
            <Text className="text-zinc-500 mt-2">Search and filter your techniques.</Text>
          </View>
          <Pressable
            onPress={() => router.push("/technique/new")}
            className="rounded-2xl bg-emerald-500 px-4 py-3 border border-emerald-400"
          >
            <Text className="text-white font-semibold text-sm">Add move</Text>
          </Pressable>
        </View>

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

        <Text className="text-zinc-600 text-xs font-medium mt-2 mb-2">Belt guideline</Text>
        <View className="flex-row flex-wrap">
          {beltFilters.map((belt) => {
            const active = selectedBelt === belt;
            return (
              <Pressable
                key={belt}
                onPress={() => setSelectedBelt(belt)}
                className={`flex-row items-center rounded-full px-3 py-2 mr-2 mb-2 border ${
                  active ? "bg-cyan-500 border-cyan-400" : "bg-white border-zinc-200"
                }`}
              >
                {belt === "All" ? (
                  <Ionicons name="layers-outline" size={15} color={active ? "#ffffff" : "#3f3f46"} />
                ) : (
                  <BeltIcon belt={belt} size="xs" />
                )}
                <Text className={`ml-1.5 ${active ? "text-white font-medium" : "text-zinc-700 font-medium"}`}>
                  {belt}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-zinc-400 text-xs mb-3 mt-1">
          {filteredTechniques.length} of {techniques.length} techniques
        </Text>

        {filteredTechniques.length === 0 ? (
          <Text className="text-zinc-500 mt-2">No techniques match your filters.</Text>
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