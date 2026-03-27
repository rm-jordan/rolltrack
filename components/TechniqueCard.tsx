import { Text, View } from "react-native";

type Technique = {
  id: string;
  name: string;
  position: string;
  category: string;
  belt: string;
  tags: string[];
  timesUsed: number;
  lastPracticed: string;
};

type TechniqueCardProps = {
  technique: Technique;
};

export default function TechniqueCard({ technique }: TechniqueCardProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-white text-lg font-semibold">
            {technique.name}
          </Text>

          <Text className="text-zinc-400 mt-1">
            {technique.position} • {technique.category}
          </Text>
        </View>

        <View className="bg-zinc-800 px-3 py-1 rounded-full">
          <Text className="text-zinc-200 text-xs">{technique.belt}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap mt-3">
        {technique.tags.map((tag) => (
          <View key={tag} className="bg-black/30 px-2 py-1 rounded-full mr-2 mb-2">
            <Text className="text-zinc-300 text-xs">{tag}</Text>
          </View>
        ))}
      </View>

      <Text className="text-zinc-500 text-xs mt-2">
        Practiced {technique.timesUsed}x
      </Text>
    </View>
  );
}