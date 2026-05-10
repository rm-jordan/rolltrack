import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

export default function SettingsGearButton() {
  const router = useRouter();
  const iconColor = useRolltrackColor("rtIconMuted");

  return (
    <Pressable
      onPress={() => router.push("/settings")}
      accessibilityRole="button"
      accessibilityLabel="Settings"
      p="$1"
      $pressed={{ opacity: 0.85 }}
    >
      <Ionicons name="cog-outline" size={24} color={iconColor} />
    </Pressable>
  );
}
