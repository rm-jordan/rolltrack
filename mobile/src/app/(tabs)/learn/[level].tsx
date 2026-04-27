import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
import TechniqueCard from "@/components/TechniqueCard";
import { normalizeLevel, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

export default function LevelTechniquesScreen() {
  const router = useRouter();
  const { level: levelParam } = useLocalSearchParams<{ level: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);

  const level = normalizeLevel(levelParam);

  const filtered = useMemo(() => {
    if (!level) return [];
    return techniques.filter((t) => techniqueLevel(t) === level);
  }, [level, techniques]);

  const goHome = () => {
    router.navigate("/(tabs)");
  };

  if (!level) {
    return (
      <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
        <View className="px-5 pt-4">
          <ScreenHeader title="Unknown level" onBack={goHome} backLabel="Home" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
        <ScreenHeader title={`${level} techniques`} onBack={goHome} backLabel="Home" />

        <Text className="text-zinc-900 text-3xl font-bold mt-2">{level}</Text>
        <Text className="text-zinc-500 mt-1">
          {filtered.length} technique{filtered.length === 1 ? "" : "s"} · level guidance
        </Text>

        <View className="mt-4">
          {filtered.length === 0 ? (
            <EmptyStateCard
              title="No techniques for this level"
              message="Add techniques in Library and tag them with this level."
              actionLabel="Go to library"
              onAction={() => router.push("/(tabs)/library")}
            />
          ) : (
            filtered.map((technique) => (
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
