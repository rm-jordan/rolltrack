import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Button,
  ButtonText,
  HStack,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Text,
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import ScreenCanvas from "@/components/ScreenCanvas";
import SettingsGearButton from "@/components/SettingsGearButton";
import type { TechniqueCategory, TechniqueLevel } from "@rolltrack/shared";
import { LEVELS } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

const CATEGORIES: TechniqueCategory[] = [
  "Submission",
  "Pass",
  "Sweep",
  "Escape",
  "Takedown",
  "Control",
];

function parseTags(raw: string): string[] {
  return raw
    .split(/[,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function NewTechniqueScreen() {
  const router = useRouter();
  const createTechnique = useRollTrackStore((s) => s.createTechnique);
  const iconMuted = useRolltrackColor("rtIconMuted");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [category, setCategory] = useState<TechniqueCategory>("Submission");
  const [level, setLevel] = useState<TechniqueLevel>("Beginner");
  const [tagsRaw, setTagsRaw] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    const n = name.trim();
    const p = position.trim();
    const explanation = notes.trim();
    if (n.length < 2) {
      Alert.alert("Name required", "Enter a technique name.");
      return;
    }
    if (p.length < 2) {
      Alert.alert("Position required", "Enter a position or context (e.g. Closed Guard).");
      return;
    }
    if (explanation.length < 12) {
      Alert.alert("Explanation required", "Add a short how-to explanation for how this move is performed.");
      return;
    }
    setSaving(true);
    try {
      await createTechnique({
        name: n,
        position: p,
        category,
        level,
        tags: parseTags(tagsRaw),
        notes: explanation,
      });
      router.back();
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

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
            <Ionicons name="chevron-back" size={22} color={iconMuted} />
            <Text color="$rtHeading" ml="$1" fontWeight="$medium">
              Cancel
            </Text>
          </Pressable>
          <SettingsGearButton />
        </HStack>

        <Text color="$rtHeading" fontSize="$2xl" fontWeight="$bold">
          New technique
        </Text>
        <Text color="$rtBody" mt="$1" fontSize="$sm">
          Saved to the GraphQL API (server database).
        </Text>

        <Text color="$rtHeading" fontWeight="$medium" mt="$5" mb="$2">
          Name
        </Text>
        <Input
          borderRadius="$2xl"
          borderWidth={1}
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <InputField
            value={name}
            onChangeText={setName}
            placeholder="e.g. Triangle from Guard"
            placeholderTextColor="$rtSubtle"
            color="$rtHeading"
            py="$3"
            px="$4"
          />
        </Input>

        <Text color="$rtHeading" fontWeight="$medium" mt="$4" mb="$2">
          Position / context
        </Text>
        <Input
          borderRadius="$2xl"
          borderWidth={1}
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <InputField
            value={position}
            onChangeText={setPosition}
            placeholder="e.g. Closed Guard, Top Passing"
            placeholderTextColor="$rtSubtle"
            color="$rtHeading"
            py="$3"
            px="$4"
          />
        </Input>

        <Text color="$rtHeading" fontWeight="$medium" mt="$4" mb="$2">
          Category
        </Text>
        <HStack flexWrap="wrap">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                borderRadius="$full"
                px="$3"
                py="$2"
                mr="$2"
                mb="$2"
                borderWidth={1}
                borderColor={active ? "$primary400" : "$rtBorder"}
                bg={active ? "$primary500" : "$backgroundLightMuted"}
                sx={{
                  _dark: {
                    bg: active ? "$primary500" : "$backgroundDarkMuted",
                    borderColor: active ? "$primary400" : "$rtBorder",
                  },
                }}
                $pressed={{ opacity: 0.9 }}
              >
                <Text fontSize="$sm" fontWeight="$medium" color={active ? "$rtOnPrimary" : "$rtHeading"}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$rtHeading" fontWeight="$medium" mt="$4" mb="$2">
          Technique level
        </Text>
        <HStack flexWrap="wrap">
          {LEVELS.map((candidate) => {
            const active = level === candidate;
            return (
              <Pressable
                key={candidate}
                onPress={() => setLevel(candidate)}
                borderRadius="$full"
                px="$3"
                py="$2"
                mr="$2"
                mb="$2"
                borderWidth={1}
                borderColor={active ? "$primary400" : "$rtBorder"}
                bg={active ? "$primary500" : "$backgroundLightMuted"}
                sx={{
                  _dark: {
                    bg: active ? "$primary500" : "$backgroundDarkMuted",
                    borderColor: active ? "$primary400" : "$rtBorder",
                  },
                }}
                $pressed={{ opacity: 0.9 }}
              >
                <Text fontSize="$sm" fontWeight="$medium" color={active ? "$rtOnPrimary" : "$rtHeading"}>
                  {candidate}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$rtHeading" fontWeight="$medium" mt="$4" mb="$2">
          Tags (optional, comma-separated)
        </Text>
        <Input
          borderRadius="$2xl"
          borderWidth={1}
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <InputField
            value={tagsRaw}
            onChangeText={setTagsRaw}
            placeholder="choke, fundamental"
            placeholderTextColor="$rtSubtle"
            color="$rtHeading"
            py="$3"
            px="$4"
          />
        </Input>

        <Text color="$rtHeading" fontWeight="$medium" mt="$4" mb="$2">
          How to perform
        </Text>
        <Textarea
          borderRadius="$2xl"
          borderWidth={1}
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <TextareaInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Step-by-step cue (setup, off-balance, finish)..."
            placeholderTextColor="$rtSubtle"
            color="$rtHeading"
            multiline
            textAlignVertical="top"
            minHeight={100}
            px="$4"
            py="$3"
          />
        </Textarea>

        <Button
          size="lg"
          action="primary"
          variant="solid"
          mt="$6"
          borderRadius="$md"
          onPress={onSave}
          disabled={saving}
          opacity={saving ? 0.85 : 1}
        >
          <ButtonText>{saving ? "Saving…" : "Save technique"}</ButtonText>
        </Button>
      </ScrollView>
    </ScreenCanvas>
  );
}
