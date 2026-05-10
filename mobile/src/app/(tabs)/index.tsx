import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Button, ButtonText, Card, HStack, Text, VStack } from "@gluestack-ui/themed";
import { useRolltrackColor } from "@/theme/useRolltrackToken";
import { useRouter } from "expo-router";
import ScreenCanvas from "@/components/ScreenCanvas";
import ThemeAppearanceControl from "@/components/ThemeAppearanceControl";
import type { TechniqueLevel } from "@rolltrack/shared";

const levels: { level: TechniqueLevel; subtitle: string }[] = [
  { level: "Beginner", subtitle: "Core fundamentals and base movement" },
  { level: "Intermediate", subtitle: "Combinations, timing, and transitions" },
  { level: "Advanced", subtitle: "Refinement, pressure, and chain attacks" },
];

export default function HomeScreen() {
  const router = useRouter();
  const libraryAccent = useRolltrackColor("rtLibraryAccent");
  const logAccent = useRolltrackColor("rtLogAccent");
  const iconMuted = useRolltrackColor("rtIconMuted");
  const brandIcon = useRolltrackColor("primary500");
  const onPrimary = useRolltrackColor("rtOnPrimary");

  const openLevelTechniques = (level: TechniqueLevel) => {
    router.push(`/(tabs)/learn/${level}`);
  };

  return (
    <ScreenCanvas>
      <Box flex={1} px="$4" pt="$3" pb="$5">
        <HStack justifyContent="flex-end" mb="$2">
          <ThemeAppearanceControl />
        </HStack>
        <Text color="$rtHeading" fontSize="$3xl" fontWeight="$bold" mt="$1" textAlign="center">
          RollTrack
        </Text>
        <Box
          h="$12"
          w="$12"
          borderRadius="$2xl"
          bg="$primary500"
          alignItems="center"
          justifyContent="center"
          mt="$3"
          alignSelf="center"
          borderWidth={1}
          borderColor="$rtBorder"
          sx={{
            _dark: {
              borderColor: "$rtBorder",
            },
          }}
        >
          <Ionicons name="fitness" size={24} color={onPrimary} />
        </Box>
        <Text color="$rtHeading" fontSize="$xl" fontWeight="$bold" mt="$5" mb="$2">
          Technique levels
        </Text>

        <VStack flex={1} space="md" minHeight="$32">
          {levels.map(({ level, subtitle }) => (
            <Card
              key={level}
              variant="outline"
              size="lg"
              p="$0"
              overflow="hidden"
              borderColor="$rtBorder"
              bg="$backgroundLight0"
              sx={{
                _dark: { bg: "$backgroundDark900" },
              }}
            >
              <Button
                variant="link"
                p="$0"
                h="auto"
                onPress={() => openLevelTechniques(level)}
                justifyContent="flex-start"
              >
                <HStack flex={1} alignItems="center" px="$4" py="$5" w="$full">
                  <Box
                    h={48}
                    w={48}
                    borderRadius="$xl"
                    bg="$rtCardIconBg"
                    borderWidth={1}
                    borderColor="$rtBorder"
                    alignItems="center"
                    justifyContent="center"
                    mr="$3"
                  >
                    <Ionicons name="layers-outline" size={22} color={brandIcon} />
                  </Box>
                  <VStack flex={1} mr="$2" alignItems="flex-start">
                    <Text color="$rtHeading" fontSize="$xl" fontWeight="$semibold">
                      {level}
                    </Text>
                    <Text color="$rtBody" fontSize="$md" mt="$1" numberOfLines={2} textAlign="left">
                      {subtitle}
                    </Text>
                  </VStack>
                  <Ionicons name="chevron-forward" size={22} color={iconMuted} />
                </HStack>
              </Button>
            </Card>
          ))}
        </VStack>

        <VStack mt="$3" space="md">
          <HStack space="sm">
            <Card variant="outline" size="md" flex={1} mr="$1" p="$4" borderColor="$rtBorder" bg="$backgroundLight0" sx={{ _dark: { bg: "$backgroundDark900" } }}>
              <Button
                variant="link"
                p="$0"
                h="auto"
                onPress={() => router.push("/(tabs)/library")}
                justifyContent="flex-start"
              >
                <Box alignItems="flex-start">
                  <Ionicons name="albums-outline" size={22} color={libraryAccent} />
                  <Text color="$rtHeading" fontWeight="$semibold" fontSize="$md" mt="$2" textAlign="left">
                    Library
                  </Text>
                  <Text color="$rtBody" fontSize="$sm" mt="$1" textAlign="left">
                    Search techniques
                  </Text>
                </Box>
              </Button>
            </Card>
            <Card variant="outline" size="md" flex={1} ml="$1" p="$4" borderColor="$rtBorder" bg="$backgroundLight0" sx={{ _dark: { bg: "$backgroundDark900" } }}>
              <Button
                variant="link"
                p="$0"
                h="auto"
                onPress={() => router.push("/(tabs)/log")}
                justifyContent="flex-start"
              >
                <Box alignItems="flex-start">
                  <Ionicons name="create-outline" size={22} color={logAccent} />
                  <Text color="$rtHeading" fontWeight="$semibold" fontSize="$md" mt="$2" textAlign="left">
                    Log
                  </Text>
                  <Text color="$rtBody" fontSize="$sm" mt="$1" textAlign="left">
                    Track session notes
                  </Text>
                </Box>
              </Button>
            </Card>
          </HStack>

          <Button
            size="md"
            action="primary"
            variant="outline"
            borderColor="$rtBorder"
            borderRadius="$md"
            onPress={() => router.push("/(tabs)/learn")}
          >
            <ButtonText color="$rtHeading">Browse Learn (all filters)</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScreenCanvas>
  );
}
