import { FlatList, SafeAreaView, Text, View } from "react-native";
import TechniqueCard from "../../components/TechniqueCard";
import { techniques } from "../../lib/mockData";

export default function LibraryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-5 pt-6 pb-3">
        <Text className="text-white text-3xl font-bold">Technique Library</Text>
        <Text className="text-zinc-400 mt-2">
          Browse your saved techniques and fundamentals.
        </Text>
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        data={techniques}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TechniqueCard technique={item} />}
      />
    </SafeAreaView>
  );
}