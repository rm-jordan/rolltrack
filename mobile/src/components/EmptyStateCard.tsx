import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, HStack, Pressable, Text } from "@gluestack-ui/themed";

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
    <Box borderRadius="$3xl" borderWidth={1} borderColor="#e4e4e7" bg="$white" p="$5" mt="$2">
      <HStack alignItems="center">
        <Ionicons name="sparkles-outline" size={18} color="#6b7280" />
        <Text color="$coolGray900" fontWeight="$semibold" ml="$2">
          {title}
        </Text>
      </HStack>
      <Text color="$coolGray500" fontSize="$sm" mt="$2">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          alignSelf="flex-start"
          mt="$4"
          borderRadius="$xl"
          borderWidth={1}
          borderColor="#d4d4d8"
          bg="$coolGray50"
          px="$3"
          py="$2"
          $pressed={{ opacity: 0.9 }}
        >
          <Text color="$coolGray700" fontSize="$sm" fontWeight="$medium">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </Box>
  );
}
