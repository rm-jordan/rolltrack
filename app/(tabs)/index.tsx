import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRollTrackStore } from "../../lib/store";

export default function HomeScreen() {
  const router = useRouter();
  const getStats = useRollTrackStore((state) => state.getStats);
  const stats = getStats();
  const upcomingDays = [
    { day: "Sun", date: 22 },
    { day: "Mon", date: 23 },
    { day: "Tue", date: 24 },
    { day: "Wed", date: 25, active: true },
    { day: "Thu", date: 26 },
    { day: "Fri", date: 27 },
    { day: "Sat", date: 28 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 }}>
        <View className="rounded-3xl bg-white px-4 py-3 border border-zinc-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-11 w-11 rounded-full bg-zinc-200 items-center justify-center">
                <Ionicons name="person" size={18} color="#111827" />
              </View>
              <View className="ml-3">
                <Text className="text-zinc-900 font-semibold text-xl">Hello, Ryan</Text>
                <Text className="text-zinc-500 text-xs mt-0.5">Today 27 Mar.</Text>
              </View>
            </View>
            <Pressable className="h-10 w-10 rounded-full bg-zinc-100 items-center justify-center">
              <Ionicons name="search-outline" size={18} color="#111827" />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/(tabs)/log")}
          className="mt-5 rounded-3xl bg-[#9d8ef5] p-5 overflow-hidden"
        >
          <View className="absolute right-4 top-4 h-20 w-20 rounded-full bg-[#ffb84d]" />
          <View className="absolute right-16 top-10 h-16 w-16 rounded-full bg-[#3b3b4f]/90" />
          <View className="absolute right-2 top-16 h-14 w-14 rounded-full bg-[#e2d64f]/90" />
          <Text className="text-zinc-950 text-4xl font-bold">Daily</Text>
          <Text className="text-zinc-950 text-4xl font-bold -mt-1">challenge</Text>
          <Text className="text-zinc-900/70 mt-2 text-xs">Do your plan before 09:00 PM.</Text>
          <View className="mt-4 flex-row items-center">
            <View className="h-6 w-6 rounded-full bg-white/90 mr-1.5" />
            <View className="h-6 w-6 rounded-full bg-white/75 -ml-2 mr-1.5" />
            <View className="h-6 w-6 rounded-full bg-white/60 -ml-2 mr-2" />
            <Text className="text-zinc-900 text-xs font-medium">+4</Text>
          </View>
        </Pressable>

        <View className="mt-4 bg-white rounded-full px-2 py-2 flex-row justify-between border border-zinc-200">
          {upcomingDays.map((item) => (
            <View
              key={item.day}
              className={`w-10 h-12 rounded-full items-center justify-center ${
                item.active ? "bg-zinc-900" : "bg-transparent"
              }`}
            >
              <Text className={item.active ? "text-zinc-300 text-[10px]" : "text-zinc-400 text-[10px]"}>
                {item.day}
              </Text>
              <Text className={item.active ? "text-white font-semibold mt-0.5" : "text-zinc-900 font-medium mt-0.5"}>
                {item.date}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-5 flex-row items-center justify-between">
          <Text className="text-zinc-900 text-3xl font-bold">Your plan</Text>
          <Text className="text-zinc-500 text-xs">2 planned</Text>
        </View>

        <View className="mt-3 flex-row">
          <Pressable
            onPress={() => router.push("/(tabs)/learn")}
            className="flex-1 bg-[#f7c66b] rounded-3xl p-4 mr-2 min-h-[174]"
          >
            <View className="self-start rounded-full bg-white/50 px-3 py-1">
              <Text className="text-zinc-800 text-[10px]">Medium</Text>
            </View>
            <Text className="text-zinc-900 text-3xl font-semibold mt-4">Roll Class</Text>
            <Text className="text-zinc-800/80 text-xs mt-2">27 Nov.</Text>
            <Text className="text-zinc-800/80 text-xs">19:00-20:00</Text>
            <Text className="text-zinc-800/80 text-xs">Mat room</Text>

            <View className="mt-auto flex-row items-center">
              <View className="h-6 w-6 rounded-full bg-white/80 mr-2" />
              <Text className="text-zinc-800 text-xs">Trainer Alex</Text>
            </View>
          </Pressable>

          <View className="flex-1 ml-2">
            <Pressable
              onPress={() => router.push("/(tabs)/library")}
              className="bg-[#9dc2f2] rounded-3xl p-4 min-h-[120]"
            >
              <View className="self-start rounded-full bg-white/55 px-3 py-1">
                <Text className="text-zinc-800 text-[10px]">Light</Text>
              </View>
              <Text className="text-zinc-900 text-3xl font-semibold mt-2">Balance</Text>
              <Text className="text-zinc-800/80 text-xs mt-1">27 Nov.</Text>
              <Text className="text-zinc-800/80 text-xs">20:00-20:30</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(tabs)/learn")}
              className="bg-[#ea96e8] rounded-3xl p-4 mt-3 min-h-[50] justify-center"
            >
              <Text className="text-zinc-900 font-semibold">+ Add plan</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-zinc-900 text-2xl font-bold">Notes</Text>
          <Pressable onPress={() => router.push("/(tabs)/log")}>
            <Text className="text-zinc-600 text-xs font-medium">New note</Text>
          </Pressable>
        </View>

        <View className="mt-3 bg-white rounded-3xl p-4 border border-zinc-100">
          <Text className="text-zinc-500 text-xs">Current focus note</Text>
          <Text className="text-zinc-900 text-lg font-semibold mt-1">
            {stats.mostPracticedTechniqueName ?? "Start by logging one session"}
          </Text>
          <Text className="text-zinc-500 text-xs mt-1">
            {stats.sessionsThisWeek} session(s) this week • {stats.totalTechniques} tracked techniques
          </Text>
        </View>

        <View className="mt-3 bg-white rounded-3xl p-4 border border-zinc-100">
          <Text className="text-zinc-500 text-xs">Last session reflection</Text>
          <Text className="text-zinc-900 mt-1">
            Better posture breaks today. Keep knee cut entries tighter and finish with chest pressure.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}