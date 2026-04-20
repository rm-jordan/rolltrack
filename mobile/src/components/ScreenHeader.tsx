import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
};

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  backLabel = "Back",
  rightAction,
}: ScreenHeaderProps) {
  return (
    <View>
      {onBack ? (
        <Pressable
          onPress={onBack}
          className="flex-row items-center self-start py-2 pr-4 mb-2"
          accessibilityRole="button"
          accessibilityLabel={backLabel}
        >
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text className="text-zinc-800 ml-1 font-semibold">{backLabel}</Text>
        </Pressable>
      ) : null}

      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-zinc-900 text-3xl font-bold">{title}</Text>
          {subtitle ? <Text className="text-zinc-500 mt-2">{subtitle}</Text> : null}
        </View>
        {rightAction ? (
          <Pressable
            onPress={rightAction.onPress}
            className="rounded-2xl bg-emerald-500 px-4 py-3 border border-emerald-400"
          >
            <Text className="text-white font-semibold text-sm">{rightAction.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
