import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, ButtonText, Card, HStack, Text } from "@gluestack-ui/themed";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

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
  const iconColor = useRolltrackColor("primary500");

  return (
    <Card
      variant="outline"
      size="lg"
      p="$5"
      mt="$2"
      borderColor="$rtBorder"
      bg="$backgroundLight0"
      sx={{ _dark: { bg: "$backgroundDark900" } }}
    >
      <HStack alignItems="center">
        <Ionicons name="sparkles-outline" size={18} color={iconColor} />
        <Text color="$rtHeading" fontWeight="$semibold" ml="$2">
          {title}
        </Text>
      </HStack>
      <Text color="$rtBody" fontSize="$sm" mt="$2">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button
          size="sm"
          action="secondary"
          variant="outline"
          alignSelf="flex-start"
          mt="$4"
          borderColor="$rtBorder"
          onPress={onAction}
        >
          <ButtonText color="$rtHeading">{actionLabel}</ButtonText>
        </Button>
      ) : null}
    </Card>
  );
}
