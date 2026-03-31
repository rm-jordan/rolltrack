import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BeltIcon from "../../components/BeltIcon";
import { useRollTrackStore } from "../../lib/store";

export default function TechniqueDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);
  const technique = techniques.find((item) => item.id === id);

  if (!technique) {
    return (
      <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
        <View className="px-5 pt-6">
          <Pressable onPress={() => router.back()} className="mb-5 flex-row items-center">
            <Ionicons name="chevron-back" size={20} color="#3f3f46" />
            <Text className="text-zinc-700 ml-1">Back</Text>
          </Pressable>
          <Text className="text-zinc-900 text-2xl font-bold">Technique not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <Pressable onPress={() => router.back()} className="flex-row items-center mb-4">
          <Ionicons name="chevron-back" size={20} color="#3f3f46" />
          <Text className="text-zinc-700 ml-1 font-medium">Back</Text>
        </Pressable>

        <View className="rounded-3xl border border-zinc-200 bg-white p-6 mb-4 items-center justify-center">
          <BeltIcon belt={technique.beltGuideline} size="lg" />
          <Text className="text-zinc-500 text-xs mt-3">Belt guideline</Text>
        </View>

        <View className="bg-white border border-zinc-200 rounded-3xl p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-zinc-900 text-2xl font-bold flex-1 pr-3">{technique.name}</Text>
            <View className="flex-row items-center bg-zinc-50 border border-zinc-200 rounded-full pl-2 pr-3 py-1.5">
              <BeltIcon belt={technique.beltGuideline} size="xs" />
              <Text className="text-zinc-800 text-xs font-medium ml-1.5">{technique.beltGuideline}</Text>
            </View>
          </View>

          <Text className="text-zinc-500 mt-2">
            {technique.position} • {technique.category}
          </Text>

          <View className="bg-zinc-50 rounded-2xl p-4 mt-4 border border-zinc-100">
            <Text className="text-zinc-500 text-xs">Belt guideline</Text>
            <Text className="text-zinc-700 mt-1 text-sm">
              This belt level is a recommendation for organizing learning, not a strict rule.
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-zinc-500 text-xs">Tags</Text>
            <View className="flex-row flex-wrap mt-2">
              {technique.tags.map((tag) => (
                <View key={tag} className="bg-zinc-100 px-2 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-zinc-600 text-xs">{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-2">
            <Text className="text-zinc-500 text-xs">Practice history</Text>
            <Text className="text-zinc-900 mt-1 font-medium">Practiced {technique.timesPracticed} times</Text>
            <Text className="text-zinc-500 mt-1 text-sm">
              Last practiced: {technique.lastPracticed ?? "—"}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-zinc-500 text-xs">Personal notes</Text>
            <Text className="text-zinc-700 mt-1">{technique.notes ?? "No note yet."}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
