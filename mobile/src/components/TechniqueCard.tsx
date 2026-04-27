import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import BeltIcon from "./BeltIcon";
import type { Technique } from "@rolltrack/shared";
import { techniqueLevel } from "@/lib/techniqueLevel";

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
  const level = techniqueLevel(technique);

  return (
    <Container
      className="bg-white rounded-2xl p-4 mb-3 border border-zinc-200 shadow-sm"
      {...(onPress ? { onPress } : {})}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center">
            <Ionicons
              name={categoryIconMap[technique.category]}
              size={16}
              color="#7c3aed"
              style={{ marginRight: 6 }}
            />
            <Text className="text-zinc-900 text-lg font-semibold">{technique.name}</Text>
          </View>

          <Text className="text-zinc-500 mt-1">
            {technique.position} • {technique.category}
          </Text>
        </View>

        <View className="flex-row items-center bg-zinc-50 border border-zinc-200 pl-2 pr-2 py-1 rounded-full">
          <BeltIcon belt={technique.beltGuideline} size="xs" />
          <Text className="text-zinc-800 text-xs font-medium ml-1.5">{level}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap mt-3">
        {technique.tags.map((tag) => (
          <View key={tag} className="bg-zinc-100 px-2 py-1 rounded-full mr-2 mb-2">
            <Text className="text-zinc-600 text-xs">{tag}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-zinc-400 text-xs">Practiced {technique.timesPracticed}x</Text>
        {onPress ? <Ionicons name="chevron-forward" size={14} color="#a1a1aa" /> : null}
      </View>
    </Container>
  );
}