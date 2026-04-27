import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TechniqueLevel } from "@rolltrack/shared";

const levelButtons: { level: TechniqueLevel; subtitle: string; cardBg: string }[] = [
  { level: "Beginner", subtitle: "Core fundamentals and base movement", cardBg: "#eefaf3" },
  { level: "Intermediate", subtitle: "Combinations, timing, and transitions", cardBg: "#eff6ff" },
  { level: "Advanced", subtitle: "Refinement, pressure, and chain attacks", cardBg: "#f5f3ff" },
];

export default function HomeScreen() {
  const router = useRouter();

  const openLevelTechniques = (level: TechniqueLevel) => {
    router.push(`/(tabs)/learn/${level}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 px-4 pt-3 pb-5">
        <Text className="text-zinc-900 text-3xl font-bold mt-2 text-center">RollTrack</Text>
        <View className="h-12 w-12 rounded-2xl bg-violet-500 items-center justify-center mt-3 self-center">
          <Ionicons name="fitness" size={24} color="#ffffff" />
        </View>
        <Text className="text-zinc-900 text-xl font-bold mt-5 mb-3">Technique levels</Text>

        {levelButtons.map(({ level, subtitle, cardBg }) => (
          <Pressable
            key={level}
            onPress={() => openLevelTechniques(level)}
            className="rounded-2xl border border-zinc-200 px-4 py-3.5 mb-3 flex-row items-center active:opacity-90"
            style={{ backgroundColor: cardBg }}
          >
            <View className="h-11 w-11 rounded-xl bg-white/90 border border-zinc-200 items-center justify-center mr-3">
              <Ionicons name="layers-outline" size={18} color="#52525b" />
            </View>
            <View className="flex-1">
              <Text className="text-zinc-900 text-lg font-semibold">{level}</Text>
              <Text className="text-zinc-500 text-sm mt-0.5">{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
          </Pressable>
        ))}

        <View className="mt-3">
          <View className="flex-row">
          <Pressable
            onPress={() => router.push("/(tabs)/library")}
            className="flex-1 mr-2 rounded-2xl bg-white border border-zinc-200 py-4 px-3.5"
          >
            <Ionicons name="albums-outline" size={22} color="#0891b2" />
            <Text className="text-zinc-900 font-semibold text-base mt-2">Library</Text>
            <Text className="text-zinc-500 text-sm mt-0.5">Search techniques</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/log")}
            className="flex-1 ml-2 rounded-2xl bg-white border border-zinc-200 py-4 px-3.5"
          >
            <Ionicons name="create-outline" size={22} color="#059669" />
            <Text className="text-zinc-900 font-semibold text-base mt-2">Log</Text>
            <Text className="text-zinc-500 text-sm mt-0.5">Track session notes</Text>
          </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)/learn")}
          className="mt-3 py-4 rounded-2xl bg-white border border-zinc-200"
          >
          <Text className="text-zinc-700 text-center text-base font-semibold">Browse Learn (all filters)</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
