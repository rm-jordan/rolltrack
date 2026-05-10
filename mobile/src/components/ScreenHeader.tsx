import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Button, ButtonText, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";
import { useRolltrackColor } from "@/theme/useRolltrackToken";
import SettingsGearButton from "@/components/SettingsGearButton";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
  /** Cog icon → Settings (theme, etc.). */
  settingsGear?: boolean;
};

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  backLabel = "Back",
  rightAction,
  settingsGear = false,
}: ScreenHeaderProps) {
  const chevronColor = useRolltrackColor("rtIconMuted");

  return (
    <Box>
      {onBack ? (
        <Pressable
          onPress={onBack}
          flexDirection="row"
          alignItems="center"
          alignSelf="flex-start"
          py="$2"
          pr="$4"
          mb="$2"
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          $pressed={{ opacity: 0.85 }}
        >
          <Ionicons name="chevron-back" size={22} color={chevronColor} />
          <Text color="$rtHeading" ml="$1" fontWeight="$semibold">
            {backLabel}
          </Text>
        </Pressable>
      ) : null}

      <HStack alignItems="flex-start" justifyContent="space-between" space="md">
        <VStack flex={1}>
          <Text color="$rtHeading" fontSize="$3xl" fontWeight="$bold">
            {title}
          </Text>
          {subtitle ? (
            <Text color="$rtBody" mt="$2">
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        <VStack alignItems="flex-end" space="sm">
          {settingsGear ? <SettingsGearButton /> : null}
          {rightAction ? (
            <Button
              size="sm"
              action="primary"
              variant="solid"
              borderRadius="$md"
              onPress={rightAction.onPress}
            >
              <ButtonText>{rightAction.label}</ButtonText>
            </Button>
          ) : null}
        </VStack>
      </HStack>
    </Box>
  );
}
