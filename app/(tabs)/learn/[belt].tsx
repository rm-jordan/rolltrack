import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BeltIcon from "../../../components/BeltIcon";
import TechniqueCard from "../../../components/TechniqueCard";
import { useRollTrackStore } from "../../../lib/store";
import type { BeltLevel } from "../../../lib/types";

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
    router.navigate("/(tabs)/");
  };

  if (!belt) {
    return (
      <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
        <View className="px-5 pt-4">
          <Pressable onPress={goHome} className="flex-row items-center mb-4">
            <Ionicons name="chevron-back" size={22} color="#3f3f46" />
            <Text className="text-zinc-800 ml-1 font-medium">Home</Text>
          </Pressable>
          <Text className="text-zinc-900 text-lg">Unknown belt level.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
        <Pressable
          onPress={goHome}
          className="flex-row items-center self-start py-2 pr-4 mb-2"
          accessibilityRole="button"
          accessibilityLabel="Back to belt home"
        >
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text className="text-zinc-800 ml-1 font-semibold">Belt home</Text>
        </Pressable>

        <View className="flex-row items-center">
          <BeltIcon belt={belt} size="lg" />
          <Text className="text-zinc-900 text-3xl font-bold ml-3">{belt} belt</Text>
        </View>
        <Text className="text-zinc-500 mt-1">
          {filtered.length} technique{filtered.length === 1 ? "" : "s"} · guideline, not a rule
        </Text>

        <View className="mt-4">
          {filtered.length === 0 ? (
            <Text className="text-zinc-500 mt-2">No techniques in the library for this belt yet.</Text>
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
