import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import TechniqueCard from "../../components/TechniqueCard";
import { useRollTrackStore } from "../../lib/store";
import type { BeltLevel } from "../../lib/types";

const beltFilters: ("All" | BeltLevel)[] = ["All", "White", "Blue", "Purple", "Brown", "Black"];

export default function LearnScreen() {
  const router = useRouter();
  const techniques = useRollTrackStore((state) => state.techniques);
  const [selectedBelt, setSelectedBelt] = useState<"All" | BeltLevel>("All");

  const filteredTechniques = useMemo(() => {
    if (selectedBelt === "All") {
      return techniques;
    }

    return techniques.filter((technique) => technique.beltGuideline === selectedBelt);
  }, [selectedBelt, techniques]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 }}>
        <Text className="text-white text-3xl font-bold">Learn</Text>
        <Text className="text-zinc-400 mt-2">
          Browse by belt guideline. These are recommendations, not restrictions.
        </Text>

        <View className="mt-4 rounded-2xl border border-violet-500/30 bg-zinc-900 p-4">
          <View className="flex-row items-center">
            <Ionicons name="school-outline" size={16} color="#a78bfa" />
            <Text className="text-zinc-300 text-xs uppercase ml-2">Learning Path</Text>
          </View>
          <Text className="text-zinc-100 mt-2">
            Filter by belt to focus your progression, then open any card for deeper details.
          </Text>
        </View>

        <View className="flex-row flex-wrap mt-4">
          {beltFilters.map((belt) => {
            const active = selectedBelt === belt;
            return (
              <Pressable
                key={belt}
                onPress={() => setSelectedBelt(belt)}
                className={`rounded-full px-4 py-2 mr-2 mb-2 border ${active ? "bg-violet-500 border-violet-400" : "bg-zinc-900 border-zinc-700"}`}
              >
                <Text className={active ? "text-white font-medium" : "text-zinc-200"}>{belt}</Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-2">
          {filteredTechniques.length === 0 ? (
            <Text className="text-zinc-500 mt-2">No techniques for this belt filter yet.</Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}