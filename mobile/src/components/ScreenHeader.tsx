import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";

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
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text color="$coolGray800" ml="$1" fontWeight="$semibold">
            {backLabel}
          </Text>
        </Pressable>
      ) : null}

      <HStack alignItems="flex-start" justifyContent="space-between" space="md">
        <VStack flex={1}>
          <Text color="$coolGray900" fontSize="$3xl" fontWeight="$bold">
            {title}
          </Text>
          {subtitle ? (
            <Text color="$coolGray500" mt="$2">
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        {rightAction ? (
          <Pressable
            onPress={rightAction.onPress}
            borderRadius="$2xl"
            bg="$emerald500"
            px="$4"
            py="$3"
            borderWidth={1}
            borderColor="$emerald400"
            $pressed={{ opacity: 0.9 }}
          >
            <Text color="$white" fontWeight="$semibold" fontSize="$sm">
              {rightAction.label}
            </Text>
          </Pressable>
        ) : null}
      </HStack>
    </Box>
  );
}
