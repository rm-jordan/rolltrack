import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Box, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TechniqueLevel } from "@rolltrack/shared";

const levelButtons: { level: TechniqueLevel; subtitle: string; cardBg: string }[] = [
  { level: "Beginner", subtitle: "Core fundamentals and base movement", cardBg: "#eefaf3" },
  { level: "Intermediate", subtitle: "Combinations, timing, and transitions", cardBg: "#eff6ff" },
  { level: "Advanced", subtitle: "Refinement, pressure, and chain attacks", cardBg: "#f5f3ff" },
];

export default function HomeScreen() {
  const router = useRouter();

  const openLevelTechniques = (level: TechniqueLevel) => {
    router.push(`/(tabs)/learn/${level}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
      <Box flex={1} px="$4" pt="$3" pb="$5">
        <Text color="$coolGray900" fontSize="$3xl" fontWeight="$bold" mt="$2" textAlign="center">
          RollTrack
        </Text>
        <Box
          h="$12"
          w="$12"
          borderRadius="$2xl"
          bg="$violet500"
          alignItems="center"
          justifyContent="center"
          mt="$3"
          alignSelf="center"
        >
          <Ionicons name="fitness" size={24} color="#ffffff" />
        </Box>
        <Text color="$coolGray900" fontSize="$xl" fontWeight="$bold" mt="$5" mb="$2">
          Technique levels
        </Text>

        <VStack flex={1} space="md" minHeight="$32">
          {levelButtons.map(({ level, subtitle, cardBg }) => (
            <Pressable
              key={level}
              flex={1}
              onPress={() => openLevelTechniques(level)}
              bg={cardBg}
              borderRadius="$2xl"
              borderWidth={1}
              borderColor="#e4e4e7"
              $pressed={{ opacity: 0.92 }}
            >
              <HStack flex={1} alignItems="center" px="$4" py="$5">
                <Box
                  h={48}
                  w={48}
                  borderRadius="$xl"
                  bg="rgba(255,255,255,0.92)"
                  borderWidth={1}
                  borderColor="#e4e4e7"
                  alignItems="center"
                  justifyContent="center"
                  mr="$3"
                >
                  <Ionicons name="layers-outline" size={22} color="#52525b" />
                </Box>
                <VStack flex={1} mr="$2">
                  <Text color="$coolGray900" fontSize="$xl" fontWeight="$semibold">
                    {level}
                  </Text>
                  <Text color="$coolGray500" fontSize="$md" mt="$1" numberOfLines={2}>
                    {subtitle}
                  </Text>
                </VStack>
                <Ionicons name="chevron-forward" size={22} color="#a1a1aa" />
              </HStack>
            </Pressable>
          ))}
        </VStack>

        <VStack mt="$3" space="md">
          <HStack space="sm">
            <Pressable
              flex={1}
              mr="$1"
              borderRadius="$2xl"
              bg="$white"
              borderWidth={1}
              borderColor="#e4e4e7"
              p="$4"
              onPress={() => router.push("/(tabs)/library")}
              $pressed={{ opacity: 0.92 }}
            >
              <Ionicons name="albums-outline" size={22} color="#0891b2" />
              <Text color="$coolGray900" fontWeight="$semibold" fontSize="$md" mt="$2">
                Library
              </Text>
              <Text color="$coolGray500" fontSize="$sm" mt="$1">
                Search techniques
              </Text>
            </Pressable>
            <Pressable
              flex={1}
              ml="$1"
              borderRadius="$2xl"
              bg="$white"
              borderWidth={1}
              borderColor="#e4e4e7"
              p="$4"
              onPress={() => router.push("/(tabs)/log")}
              $pressed={{ opacity: 0.92 }}
            >
              <Ionicons name="create-outline" size={22} color="#059669" />
              <Text color="$coolGray900" fontWeight="$semibold" fontSize="$md" mt="$2">
                Log
              </Text>
              <Text color="$coolGray500" fontSize="$sm" mt="$1">
                Track session notes
              </Text>
            </Pressable>
          </HStack>

          <Pressable
            py="$4"
            borderRadius="$2xl"
            bg="$white"
            borderWidth={1}
            borderColor="#e4e4e7"
            onPress={() => router.push("/(tabs)/learn")}
              $pressed={{ opacity: 0.92 }}
          >
            <Text color="$coolGray700" textAlign="center" fontSize="$md" fontWeight="$semibold">
              Browse Learn (all filters)
            </Text>
          </Pressable>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
