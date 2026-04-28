import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import type { Technique } from "@rolltrack/shared";

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
  const explanation =
    technique.notes?.trim() ||
    `From ${technique.position}, establish control first, off-balance your partner, and finish the ${technique.name} with tight positioning.`;

  return (
    <Container
      className="bg-white rounded-2xl p-4 mb-3 border border-zinc-200 shadow-sm"
      {...(onPress ? { onPress } : {})}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={categoryIconMap[technique.category]}
          size={16}
          color="#7c3aed"
          style={{ marginRight: 6 }}
        />
        <Text className="text-zinc-900 text-lg font-semibold flex-1">{technique.name}</Text>
      </View>

      <Text className="text-zinc-500 mt-1">
        {technique.position} • {technique.category}
      </Text>

      <View className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <Text className="text-zinc-500 text-xs">How to perform</Text>
        <Text className="text-zinc-700 text-sm mt-1" numberOfLines={3}>
          {explanation}
        </Text>
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