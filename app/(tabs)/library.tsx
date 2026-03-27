import { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import TechniqueCard from "../../components/TechniqueCard";
import { useRollTrackStore } from "../../lib/store";
import type { BeltLevel } from "../../lib/types";

export default function LibraryScreen() {
  const router = useRouter();
  const techniques = useRollTrackStore((state) => state.techniques);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBelt, setSelectedBelt] = useState<"All" | BeltLevel>("All");

  const beltFilters: ("All" | BeltLevel)[] = ["All", "White", "Blue", "Purple", "Brown", "Black"];

  const filteredTechniques = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return techniques.filter((technique) => {
      const matchesBelt = selectedBelt === "All" || technique.beltGuideline === selectedBelt;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        technique.name.toLowerCase().includes(normalizedQuery) ||
        technique.position.toLowerCase().includes(normalizedQuery) ||
        technique.category.toLowerCase().includes(normalizedQuery) ||
        technique.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesBelt && matchesSearch;
    });
  }, [searchQuery, selectedBelt, techniques]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 }}>
        <Text className="text-white text-3xl font-bold">Technique Library</Text>
        <Text className="text-zinc-400 mt-2">Search your techniques and drill focus areas.</Text>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by technique, position, category, or tag"
          placeholderTextColor="#71717a"
          className="bg-zinc-900 text-white border border-zinc-800 rounded-xl px-4 py-3 mt-4"
        />

        <View className="flex-row flex-wrap mt-3">
          {beltFilters.map((belt) => {
            const active = selectedBelt === belt;
            return (
              <Text
                key={belt}
                onPress={() => setSelectedBelt(belt)}
                className={`rounded-full px-4 py-2 mr-2 mb-2 border ${active ? "bg-white border-white text-black font-medium" : "bg-zinc-900 border-zinc-700 text-zinc-200"}`}
              >
                {belt}
              </Text>
            );
          })}
        </View>

        <Text className="text-zinc-500 text-xs mb-2">
          Showing {filteredTechniques.length} of {techniques.length}
        </Text>

        {filteredTechniques.length === 0 ? (
          <Text className="text-zinc-500 mt-3">No techniques match your filters.</Text>
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