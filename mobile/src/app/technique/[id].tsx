import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, HStack, Pressable, ScrollView, Text } from "@gluestack-ui/themed";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

export default function TechniqueDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const techniques = useRollTrackStore((state) => state.techniques);
  const deleteTechnique = useRollTrackStore((state) => state.deleteTechnique);
  const technique = techniques.find((item) => item.id === id);
  const level = technique ? techniqueLevel(technique) : null;

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
        <Box px="$5" pt="$6">
          <Pressable
            onPress={() => router.back()}
            mb="$5"
            flexDirection="row"
            alignItems="center"
            $pressed={{ opacity: 0.85 }}
          >
            <Ionicons name="chevron-back" size={20} color="#3f3f46" />
            <Text color="$coolGray700" ml="$1">
              Back
            </Text>
          </Pressable>
          <Text color="$coolGray900" fontSize="$2xl" fontWeight="$bold">
            Technique not found
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
      <ScrollView flex={1} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <Pressable
          onPress={() => router.back()}
          flexDirection="row"
          alignItems="center"
          mb="$4"
          $pressed={{ opacity: 0.85 }}
        >
          <Ionicons name="chevron-back" size={20} color="#3f3f46" />
          <Text color="$coolGray700" ml="$1" fontWeight="$medium">
            Back
          </Text>
        </Pressable>

        <Box
          borderRadius="$3xl"
          borderWidth={1}
          borderColor="#e4e4e7"
          bg="$white"
          p="$6"
          mb="$4"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="layers-outline" size={28} color="#3f3f46" />
          <Text color="$coolGray500" fontSize="$xs" mt="$3">
            Technique level: {level}
          </Text>
        </Box>

        <Box borderRadius="$3xl" borderWidth={1} borderColor="#e4e4e7" bg="$white" p="$5">
          <Text color="$coolGray900" fontSize="$2xl" fontWeight="$bold">
            {technique.name}
          </Text>

          <Text color="$coolGray500" mt="$2">
            {technique.position} • {technique.category}
          </Text>

          <Box mt="$4">
            <Text color="$coolGray500" fontSize="$xs">
              Tags
            </Text>
            <HStack flexWrap="wrap" mt="$2">
              {technique.tags.map((tag) => (
                <Box key={tag} bg="$coolGray100" px="$2" py="$1" borderRadius="$full" mr="$2" mb="$2">
                  <Text color="$coolGray600" fontSize="$xs">
                    {tag}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>

          <Box mt="$2">
            <Text color="$coolGray500" fontSize="$xs">
              Practice history
            </Text>
            <Text color="$coolGray900" mt="$1" fontWeight="$medium">
              Practiced {technique.timesPracticed} times
            </Text>
            <Text color="$coolGray500" mt="$1" fontSize="$sm">
              Last practiced: {technique.lastPracticed ?? "—"}
            </Text>
          </Box>

          <Box mt="$4">
            <Text color="$coolGray500" fontSize="$xs">
              How to perform
            </Text>
            <Text color="$coolGray700" mt="$1">
              {technique.notes ?? "Add step-by-step explanation from Edit."}
            </Text>
          </Box>

          <HStack mt="$6" space="md">
            <Pressable
              onPress={() => router.push(`/technique/edit/${technique.id}` as Href)}
              flex={1}
              borderRadius="$2xl"
              bg="#7c3aed"
              py="$3"
              alignItems="center"
              borderWidth={1}
              borderColor="#8b5cf6"
              $pressed={{ opacity: 0.92 }}
            >
              <Text color="$white" fontWeight="$semibold">
                Edit
              </Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              flex={1}
              borderRadius="$2xl"
              bg="#fef2f2"
              py="$3"
              alignItems="center"
              borderWidth={1}
              borderColor="#fecaca"
              $pressed={{ opacity: 0.92 }}
            >
              <Text color="#b91c1c" fontWeight="$semibold">
                Delete
              </Text>
            </Pressable>
          </HStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
