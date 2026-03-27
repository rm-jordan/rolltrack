import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRollTrackStore } from "../../lib/store";

export default function TechniqueDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);
  const technique = techniques.find((item) => item.id === id);

  if (!technique) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="px-5 pt-6">
          <Pressable onPress={() => router.back()} className="mb-5">
            <Text className="text-zinc-300">Back</Text>
          </Pressable>
          <Text className="text-white text-2xl font-bold">Technique not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 }}>
        <Pressable onPress={() => router.back()} className="flex-row items-center mb-5">
          <Ionicons name="chevron-back-outline" size={18} color="#d4d4d8" />
          <Text className="text-zinc-300 ml-1">Back</Text>
        </Pressable>

        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-bold flex-1 pr-3">{technique.name}</Text>
            <View className="bg-zinc-800 rounded-full px-3 py-1">
              <Text className="text-zinc-200 text-xs">{technique.beltGuideline}</Text>
            </View>
          </View>

          <Text className="text-zinc-400 mt-2">
            {technique.position} • {technique.category}
          </Text>

          <View className="bg-black/20 rounded-xl p-4 mt-4">
            <Text className="text-zinc-400 text-xs">Belt Guideline</Text>
            <Text className="text-zinc-200 mt-1">
              This belt level is a recommendation for organizing learning, not a strict rule.
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-zinc-400 text-xs">Tags</Text>
            <View className="flex-row flex-wrap mt-2">
              {technique.tags.map((tag) => (
                <View key={tag} className="bg-black/30 px-2 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-zinc-300 text-xs">{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-2">
            <Text className="text-zinc-400 text-xs">Practice History</Text>
            <Text className="text-white mt-1">Practiced {technique.timesPracticed} times</Text>
            <Text className="text-zinc-400 mt-1">
              Last practiced: {technique.lastPracticed ?? "No sessions yet"}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-zinc-400 text-xs">Personal Notes</Text>
            <Text className="text-zinc-200 mt-1">{technique.notes ?? "No note yet."}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
