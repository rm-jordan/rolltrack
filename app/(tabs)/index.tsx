import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-5 pt-6">
        <Text className="text-white text-3xl font-bold">RollTrack</Text>
        <Text className="text-zinc-400 mt-2">
          Track your training and build your game.
        </Text>
      </View>
    </SafeAreaView>
  );
}