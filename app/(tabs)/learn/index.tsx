import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import BeltIcon from "../../../components/BeltIcon";
import TechniqueCard from "../../../components/TechniqueCard";
import { useRollTrackStore } from "../../../lib/store";
import type { BeltLevel } from "../../../lib/types";

const beltFilters: ("All" | BeltLevel)[] = ["All", "White", "Blue", "Purple", "Brown", "Black"];

export default function LearnIndexScreen() {
  const router = useRouter();
  const techniques = useRollTrackStore((state) => state.techniques);
  const [selectedBelt, setSelectedBelt] = useState<"All" | BeltLevel>("All");

  const filteredTechniques = useMemo(() => {
    if (selectedBelt === "All") {
      return techniques;
    }
    return techniques.filter((technique) => technique.beltGuideline === selectedBelt);
  }, [selectedBelt, techniques]);

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

        <Text className="text-zinc-900 text-3xl font-bold">Learn</Text>
        <Text className="text-zinc-500 mt-2">
          Belt levels are guidelines for learning, not rules. Open a belt from Home for a focused list.
        </Text>

        <View className="mt-4 rounded-3xl border border-violet-200 bg-white p-4">
          <View className="flex-row items-center">
            <Ionicons name="school-outline" size={18} color="#7c3aed" />
            <Text className="text-zinc-500 text-xs uppercase ml-2 tracking-wide">Learning path</Text>
          </View>
          <Text className="text-zinc-700 mt-2 text-sm">
            Filter here, or go back to Home to jump straight into a belt.
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
                className={`flex-row items-center rounded-full px-3 py-2 mr-2 mb-2 border ${
                  active ? "bg-violet-600 border-violet-500" : "bg-white border-zinc-200"
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
