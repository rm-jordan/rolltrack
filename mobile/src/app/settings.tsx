import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Card, Pressable, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import ScreenCanvas from "@/components/ScreenCanvas";
import ThemeAppearanceControl from "@/components/ThemeAppearanceControl";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

export default function SettingsScreen() {
  const router = useRouter();
  const chevronColor = useRolltrackColor("rtIconMuted");

  return (
    <ScreenCanvas>
      <Box flex={1} px="$4" pt="$3" pb="$5">
        <Pressable
          onPress={() => router.back()}
          flexDirection="row"
          alignItems="center"
          alignSelf="flex-start"
          py="$2"
          pr="$4"
          mb="$2"
          accessibilityRole="button"
          accessibilityLabel="Back"
          $pressed={{ opacity: 0.85 }}
        >
          <Ionicons name="chevron-back" size={22} color={chevronColor} />
          <Text color="$rtHeading" ml="$1" fontWeight="$semibold">
            Back
          </Text>
        </Pressable>

        <Text color="$rtHeading" fontSize="$3xl" fontWeight="$bold">
          Settings
        </Text>
        <Text color="$rtBody" mt="$2" fontSize="$sm">
          Appearance and other preferences.
        </Text>

        <Card
          variant="outline"
          size="lg"
          mt="$6"
          p="$4"
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <Text color="$rtSubtle" fontSize="$xs" fontWeight="$semibold" letterSpacing={1} textTransform="uppercase">
            Theme
          </Text>
          <Text color="$rtBody" fontSize="$sm" mt="$2" mb="$4">
            Match system, or keep a fixed light or dark look.
          </Text>
          <ThemeAppearanceControl variant="panel" />
        </Card>
      </Box>
    </ScreenCanvas>
  );
}
