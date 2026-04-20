import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BeltLevel } from "@rolltrack/shared";
import BeltIcon from "@/components/BeltIcon";

const beltButtons: { level: BeltLevel; subtitle: string; cardBg: string }[] = [
  { level: "White", subtitle: "Fundamentals & basics", cardBg: "#fafafa" },
  { level: "Blue", subtitle: "Build your game", cardBg: "#eff6ff" },
  { level: "Purple", subtitle: "Advanced chains", cardBg: "#f5f3ff" },
  { level: "Brown", subtitle: "Refinement & pressure", cardBg: "#fffbeb" },
  { level: "Black", subtitle: "Mastery & depth", cardBg: "#f4f4f5" },
];

export default function HomeScreen() {
  const router = useRouter();

  const openBeltTechniques = (level: BeltLevel) => {
    router.push(`/(tabs)/learn/${level}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-zinc-900 text-3xl font-bold mt-2 text-center">RollTrack</Text>
        <View className="h-12 w-12 rounded-2xl bg-violet-500 items-center justify-center mt-3 self-center">
          <Ionicons name="fitness" size={24} color="#ffffff" />
        </View>
        <Text className="text-zinc-900 text-xl font-bold mt-4 mb-3">Belt tactics</Text>

        {beltButtons.map(({ level, subtitle, cardBg }) => (
          <Pressable
            key={level}
            onPress={() => openBeltTechniques(level)}
            className="rounded-3xl border border-zinc-200 p-4 mb-3 flex-row items-center active:opacity-90"
            style={{ backgroundColor: cardBg }}
          >
            <View className="h-14 w-16 items-center justify-center mr-3">
              <BeltIcon belt={level} size="lg" />
            </View>
            <View className="flex-1">
              <Text className="text-zinc-900 text-lg font-semibold">{level} belt</Text>
              <Text className="text-zinc-500 text-sm mt-0.5">{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
          </Pressable>
        ))}

        <View className="mt-6 flex-row">
          <Pressable
            onPress={() => router.push("/(tabs)/library")}
            className="flex-1 mr-2 rounded-2xl bg-white border border-zinc-200 py-4 px-3"
          >
            <Ionicons name="albums-outline" size={22} color="#0891b2" />
            <Text className="text-zinc-900 font-semibold mt-2">Library</Text>
            <Text className="text-zinc-500 text-xs mt-1">Search all techniques</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/log")}
            className="flex-1 ml-2 rounded-2xl bg-white border border-zinc-200 py-4 px-3"
          >
            <Ionicons name="create-outline" size={22} color="#059669" />
            <Text className="text-zinc-900 font-semibold mt-2">Log</Text>
            <Text className="text-zinc-500 text-xs mt-1">Date + what you learned</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/(tabs)/learn")}
          className="mt-4 py-4 rounded-2xl bg-white border border-zinc-200"
        >
          <Text className="text-zinc-700 text-center font-semibold">Browse Learn (all filters)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
