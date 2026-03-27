import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import type { Technique } from "../lib/types";

type TechniqueCardProps = {
  technique: Technique;
  onPress?: () => void;
};

const categoryIconMap: Record<Technique["category"], keyof typeof Ionicons.glyphMap> = {
  Submission: "flash-outline",
  Pass: "git-network-outline",
  Sweep: "swap-horizontal-outline",
  Escape: "shield-checkmark-outline",
  Takedown: "trending-down-outline",
  Control: "lock-closed-outline",
};

export default function TechniqueCard({ technique, onPress }: TechniqueCardProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800"
      {...(onPress ? { onPress } : {})}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center">
            <Ionicons
              name={categoryIconMap[technique.category]}
              size={16}
              color="#a78bfa"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white text-lg font-semibold">{technique.name}</Text>
          </View>

          <Text className="text-zinc-400 mt-1">
            {technique.position} • {technique.category}
          </Text>
        </View>

        <View className="bg-violet-500/20 border border-violet-400/40 px-3 py-1 rounded-full">
          <Text className="text-zinc-200 text-xs">{technique.beltGuideline}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap mt-3">
        {technique.tags.map((tag) => (
          <View key={tag} className="bg-black/30 px-2 py-1 rounded-full mr-2 mb-2">
            <Text className="text-zinc-300 text-xs">{tag}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-zinc-500 text-xs">Practiced {technique.timesPracticed}x</Text>
        {onPress ? <Ionicons name="chevron-forward" size={14} color="#71717a" /> : null}
      </View>
    </Container>
  );
}