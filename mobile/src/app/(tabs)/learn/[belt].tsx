import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BeltLevel } from "@rolltrack/shared";
import BeltIcon from "@/components/BeltIcon";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
import TechniqueCard from "@/components/TechniqueCard";
import { useRollTrackStore } from "@/state/store";

function normalizeBelt(raw: string | string[] | undefined): BeltLevel | null {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s) return null;
  const capitalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const valid: BeltLevel[] = ["White", "Blue", "Purple", "Brown", "Black"];
  return valid.includes(capitalized as BeltLevel) ? (capitalized as BeltLevel) : null;
}

export default function BeltTechniquesScreen() {
  const router = useRouter();
  const { belt: beltParam } = useLocalSearchParams<{ belt: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);

  const belt = normalizeBelt(beltParam);

  const filtered = useMemo(() => {
    if (!belt) return [];
    return techniques.filter((t) => t.beltGuideline === belt);
  }, [belt, techniques]);

  const goHome = () => {
    router.navigate("/(tabs)");
  };

  if (!belt) {
    return (
      <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
        <View className="px-5 pt-4">
          <ScreenHeader title="Unknown belt level" onBack={goHome} backLabel="Home" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
        <ScreenHeader title={`${belt} belt`} onBack={goHome} backLabel="Belt home" />

        <View className="flex-row items-center mt-2">
          <BeltIcon belt={belt} size="lg" />
          <Text className="text-zinc-900 text-3xl font-bold ml-3">{belt} belt</Text>
        </View>
        <Text className="text-zinc-500 mt-1">
          {filtered.length} technique{filtered.length === 1 ? "" : "s"} · guideline, not a rule
        </Text>

        <View className="mt-4">
          {filtered.length === 0 ? (
            <EmptyStateCard
              title="No techniques for this belt"
              message="Add techniques in Library and tag them with this belt guideline."
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
