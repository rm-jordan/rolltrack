import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
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
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
        <ScreenHeader
          title="Learn"
          subtitle="Technique levels are guidelines for progression, not strict rules."
          onBack={goHome}
          backLabel="Home"
        />

        <View className="mt-4 rounded-3xl border border-violet-200 bg-white p-4">
          <View className="flex-row items-center">
            <Ionicons name="school-outline" size={18} color="#7c3aed" />
            <Text className="text-zinc-500 text-xs uppercase ml-2 tracking-wide">Learning path</Text>
          </View>
          <Text className="text-zinc-700 mt-2 text-sm">
            Filter here, or use Home to jump straight into a level.
          </Text>
        </View>

        <Text className="text-zinc-600 text-xs font-medium mt-4 mb-2">Technique level</Text>
        <View className="flex-row flex-wrap">
          {levelFilters.map((level) => {
            const active = selectedLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => setSelectedLevel(level)}
                className={`flex-row items-center rounded-full px-3 py-2 mr-2 mb-2 border ${
                  active ? "bg-violet-600 border-violet-500" : "bg-white border-zinc-200"
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

        <View className="mt-2">
          {filteredTechniques.length === 0 ? (
            <EmptyStateCard
              title="No techniques yet"
              message="No techniques are tagged for this level yet."
              actionLabel="Show all levels"
              onAction={() => setSelectedLevel("All")}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
