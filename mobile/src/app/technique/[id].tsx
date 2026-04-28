import Ionicons from "@expo/vector-icons/Ionicons";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

export default function TechniqueDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);
  const deleteTechnique = useRollTrackStore((state) => state.deleteTechnique);
  const technique = techniques.find((item) => item.id === id);
  const level = technique ? techniqueLevel(technique) : null;

  const onDelete = () => {
    if (!id) return;
    Alert.alert("Delete technique?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTechnique(id);
            router.replace("/(tabs)/library");
          } catch (e) {
            Alert.alert("Error", e instanceof Error ? e.message : "Unknown error");
          }
        },
      },
    ]);
  };

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
          <Ionicons name="layers-outline" size={28} color="#3f3f46" />
          <Text className="text-zinc-500 text-xs mt-3">Technique level: {level}</Text>
        </View>

        <View className="bg-white border border-zinc-200 rounded-3xl p-5">
          <Text className="text-zinc-900 text-2xl font-bold">{technique.name}</Text>

          <Text className="text-zinc-500 mt-2">
            {technique.position} • {technique.category}
          </Text>

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
            <Text className="text-zinc-500 text-xs">How to perform</Text>
            <Text className="text-zinc-700 mt-1">
              {technique.notes ?? "Add step-by-step explanation from Edit."}
            </Text>
          </View>

          <View className="flex-row gap-3 mt-6">
            <Pressable
              onPress={() =>
                router.push(`/technique/edit/${technique.id}` as Href)
              }
              className="flex-1 rounded-2xl bg-violet-600 py-3.5 items-center border border-violet-500"
            >
              <Text className="text-white font-semibold">Edit</Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              className="flex-1 rounded-2xl bg-red-50 py-3.5 items-center border border-red-200"
            >
              <Text className="text-red-700 font-semibold">Delete</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
