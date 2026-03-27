import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRollTrackStore } from "../../lib/store";

export default function HomeScreen() {
  const router = useRouter();
  const getStats = useRollTrackStore((state) => state.getStats);
  const sessionLogs = useRollTrackStore((state) => state.sessionLogs);
  const stats = getStats();
  const recentSessions = sessionLogs.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-5 pt-6">
        <Text className="text-white text-3xl font-bold">RollTrack</Text>
        <Text className="text-zinc-400 mt-2">Track your training and build your game.</Text>

        <View className="mt-4 flex-row">
          <Pressable
            onPress={() => router.push("/(tabs)/learn")}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 mr-2"
          >
            <Ionicons name="school-outline" size={16} color="#e4e4e7" />
            <Text className="text-zinc-100 mt-1">Go to Learn</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/library")}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 mx-1"
          >
            <Ionicons name="albums-outline" size={16} color="#e4e4e7" />
            <Text className="text-zinc-100 mt-1">Go to Library</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)/log")}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 ml-2"
          >
            <Ionicons name="create-outline" size={16} color="#e4e4e7" />
            <Text className="text-zinc-100 mt-1">Go to Log</Text>
          </Pressable>
        </View>

        <View className="mt-6 flex-row">
          <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mr-2">
            <Text className="text-zinc-400 text-xs">Sessions This Week</Text>
            <Text className="text-white text-2xl font-semibold mt-1">{stats.sessionsThisWeek}</Text>
          </View>
          <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 ml-2">
            <Text className="text-zinc-400 text-xs">Total Techniques</Text>
            <Text className="text-white text-2xl font-semibold mt-1">{stats.totalTechniques}</Text>
          </View>
        </View>

        <View className="mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <Text className="text-zinc-400 text-xs">Most Practiced Technique</Text>
          <Text className="text-white text-lg font-semibold mt-1">
            {stats.mostPracticedTechniqueName ?? "No data yet"}
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-white text-xl font-semibold">Recent Activity</Text>
          {recentSessions.length === 0 ? (
            <Text className="text-zinc-500 mt-2">No sessions logged yet.</Text>
          ) : (
            recentSessions.map((session) => (
              <View key={session.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mt-3">
                <Text className="text-white font-medium">
                  {session.date} • {session.giType} • {session.sessionType}
                </Text>
                <Text className="text-zinc-400 text-sm mt-1" numberOfLines={2}>
                  {session.notes}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}