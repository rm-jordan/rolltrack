import { SafeAreaView, Text, View } from "react-native";

export default function LearnScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-5 pt-6">
        <Text className="text-white text-3xl font-bold">Learn</Text>
        <Text className="text-zinc-400 mt-2">
          Belt-guided techniques will go here.
        </Text>
      </View>
    </SafeAreaView>
  );
}