import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}>
        <Text className="text-zinc-900 text-3xl font-bold">Learn</Text>
        <Text className="text-zinc-500 mt-2">
          Belt levels are guidelines for learning, not rules.
        </Text>

        <View className="mt-4 rounded-3xl border border-violet-200 bg-white p-4">
          <View className="flex-row items-center">
            <Ionicons name="school-outline" size={18} color="#7c3aed" />
            <Text className="text-zinc-500 text-xs uppercase ml-2 tracking-wide">Learning path</Text>
          </View>
          <Text className="text-zinc-700 mt-2 text-sm">
            Pick a belt filter, then open any technique for details.
          </Text>
        </View>

        <Text className="text-zinc-600 text-xs font-medium mt-4 mb-2">Belt guideline</Text>
        <View className="flex-row flex-wrap">
          {beltFilters.map((belt) => {
            const active = selectedBelt === belt;
            return (
              <Pressable
                key={belt}
                onPress={() => setSelectedBelt(belt)}
                className={`rounded-full px-4 py-2 mr-2 mb-2 border ${
                  active ? "bg-violet-600 border-violet-500" : "bg-white border-zinc-200"
                }`}
              >
                <Text className={active ? "text-white font-medium" : "text-zinc-700"}>{belt}</Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-2">
          {filteredTechniques.length === 0 ? (
            <Text className="text-zinc-500 mt-2">No techniques for this filter.</Text>
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
