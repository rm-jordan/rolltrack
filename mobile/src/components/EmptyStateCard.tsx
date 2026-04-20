import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type EmptyStateCardProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyStateCard({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  return (
    <View className="rounded-3xl border border-zinc-200 bg-white p-5 mt-2">
      <View className="flex-row items-center">
        <Ionicons name="sparkles-outline" size={18} color="#6b7280" />
        <Text className="text-zinc-900 font-semibold ml-2">{title}</Text>
      </View>
      <Text className="text-zinc-500 text-sm mt-2">{message}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          className="self-start mt-4 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2"
        >
          <Text className="text-zinc-700 text-sm font-medium">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
