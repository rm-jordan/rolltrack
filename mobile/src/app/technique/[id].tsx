import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Button, ButtonText, Card, HStack, Pressable, ScrollView, Text } from "@gluestack-ui/themed";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import ScreenCanvas from "@/components/ScreenCanvas";
import ThemeAppearanceControl from "@/components/ThemeAppearanceControl";
import { techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

export default function TechniqueDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);
  const deleteTechnique = useRollTrackStore((state) => state.deleteTechnique);
  const technique = techniques.find((item) => item.id === id);
  const level = technique ? techniqueLevel(technique) : null;
  const iconMuted = useRolltrackColor("rtIconMuted");
  const brandIcon = useRolltrackColor("primary500");

  const onDelete = () => {
    if (!id) return;
    Alert.alert("Delete technique?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTechnique(id);
            router.replace("/(tabs)/library");
          } catch (e) {
            Alert.alert("Error", e instanceof Error ? e.message : "Unknown error");
          }
        },
      },
    ]);
  };

  if (!technique) {
    return (
      <ScreenCanvas>
        <Box px="$5" pt="$6">
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <Pressable
              onPress={() => router.back()}
              flexDirection="row"
              alignItems="center"
              $pressed={{ opacity: 0.85 }}
            >
              <Ionicons name="chevron-back" size={20} color={iconMuted} />
              <Text color="$rtBody" ml="$1">
                Back
              </Text>
            </Pressable>
            <ThemeAppearanceControl />
          </HStack>
          <Text color="$rtHeading" fontSize="$2xl" fontWeight="$bold">
            Technique not found
          </Text>
        </Box>
      </ScreenCanvas>
    );
  }

  return (
    <ScreenCanvas>
      <ScrollView flex={1} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <HStack justifyContent="space-between" alignItems="center" mb="$4">
          <Pressable
            onPress={() => router.back()}
            flexDirection="row"
            alignItems="center"
            $pressed={{ opacity: 0.85 }}
          >
            <Ionicons name="chevron-back" size={20} color={iconMuted} />
            <Text color="$rtBody" ml="$1" fontWeight="$medium">
              Back
            </Text>
          </Pressable>
          <ThemeAppearanceControl />
        </HStack>

        <Card
          variant="outline"
          size="lg"
          p="$6"
          mb="$4"
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="layers-outline" size={28} color={brandIcon} />
          <Text color="$rtSubtle" fontSize="$xs" mt="$3">
            Technique level: {level}
          </Text>
        </Card>

        <Card
          variant="outline"
          size="lg"
          p="$5"
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <Text color="$rtHeading" fontSize="$2xl" fontWeight="$bold">
            {technique.name}
          </Text>

          <Text color="$rtBody" mt="$2">
            {technique.position} • {technique.category}
          </Text>

          <Box mt="$4">
            <Text color="$rtSubtle" fontSize="$xs">
              Tags
            </Text>
            <HStack flexWrap="wrap" mt="$2">
              {technique.tags.map((tag) => (
                <Box
                  key={tag}
                  bg="$backgroundLight200"
                  px="$2"
                  py="$1"
                  borderRadius="$full"
                  mr="$2"
                  mb="$2"
                  sx={{ _dark: { bg: "$backgroundDark700" } }}
                >
                  <Text color="$rtBody" fontSize="$xs">
                    {tag}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>

          <Box mt="$2">
            <Text color="$rtSubtle" fontSize="$xs">
              Practice history
            </Text>
            <Text color="$rtHeading" mt="$1" fontWeight="$medium">
              Practiced {technique.timesPracticed} times
            </Text>
            <Text color="$rtBody" mt="$1" fontSize="$sm">
              Last practiced: {technique.lastPracticed ?? "—"}
            </Text>
          </Box>

          <Box mt="$4">
            <Text color="$rtSubtle" fontSize="$xs">
              How to perform
            </Text>
            <Text color="$rtBody" mt="$1">
              {technique.notes ?? "Add step-by-step explanation from Edit."}
            </Text>
          </Box>

          <HStack mt="$6" space="md">
            <Button
              flex={1}
              size="md"
              action="primary"
              variant="solid"
              borderRadius="$md"
              onPress={() => router.push(`/technique/edit/${technique.id}` as Href)}
            >
              <ButtonText>Edit</ButtonText>
            </Button>
            <Button flex={1} size="md" action="negative" variant="outline" borderRadius="$md" onPress={onDelete}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </HStack>
        </Card>
      </ScrollView>
    </ScreenCanvas>
  );
}
