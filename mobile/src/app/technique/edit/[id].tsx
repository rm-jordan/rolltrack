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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import ScreenCanvas from "@/components/ScreenCanvas";
import ThemeAppearanceControl from "@/components/ThemeAppearanceControl";
import type { TechniqueCategory, TechniqueLevel } from "@rolltrack/shared";
import { LEVELS, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

const LEVEL_CHIP_ACTIVE: Record<TechniqueLevel, { bg: string; borderColor: string }> = {
  Beginner: { bg: "#059669", borderColor: "#10b981" },
  Intermediate: { bg: "#0891b2", borderColor: "#06b6d4" },
  Advanced: { bg: "#7c3aed", borderColor: "#8b5cf6" },
};
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

export default function EditTechniqueScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const techniques = useRollTrackStore((s) => s.techniques);
  const updateTechnique = useRollTrackStore((s) => s.updateTechnique);
  const iconMuted = useRolltrackColor("rtIconMuted");

  const technique = useMemo(() => techniques.find((t) => t.id === id), [techniques, id]);

  const [name, setName] = useState(technique?.name ?? "");
  const [position, setPosition] = useState(technique?.position ?? "");
  const [category, setCategory] = useState<TechniqueCategory>(technique?.category ?? "Submission");
  const [level, setLevel] = useState<TechniqueLevel>(
    technique ? techniqueLevel(technique) : "Beginner",
  );
  const [tagsRaw, setTagsRaw] = useState(technique?.tags.join(", ") ?? "");
  const [notes, setNotes] = useState(technique?.notes ?? "");
  const [saving, setSaving] = useState(false);

  if (!technique) {
    return (
      <ScreenCanvas>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <Pressable
              onPress={() => router.back()}
              flexDirection="row"
              alignItems="center"
              $pressed={{ opacity: 0.85 }}
            >
              <Ionicons name="chevron-back" size={22} color={iconMuted} />
              <Text color="$rtHeading" ml="$1">
                Back
              </Text>
            </Pressable>
            <ThemeAppearanceControl />
          </HStack>
          <Text color="$rtHeading" fontSize="$lg">
            Technique not found.
          </Text>
        </ScrollView>
      </ScreenCanvas>
    );
  }

  const onSave = async () => {
    const n = name.trim();
    const p = position.trim();
    const explanation = notes.trim();
    if (n.length < 2 || p.length < 2) {
      Alert.alert("Check fields", "Name and position are required.");
      return;
    }
    if (explanation.length < 12) {
      Alert.alert("Explanation required", "Add a short how-to explanation for how this move is performed.");
      return;
    }
    setSaving(true);
    try {
      await updateTechnique(id, {
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
          <ThemeAppearanceControl />
        </HStack>

        <Text color="$rtHeading" fontSize="$2xl" fontWeight="$bold">
          Edit technique
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
            placeholder="Name"
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
            placeholder="Position"
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
                <Text fontSize="$sm" fontWeight="$medium" color={active ? "$white" : "$rtHeading"}>
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
            const chip = LEVEL_CHIP_ACTIVE[candidate];
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
                bg={active ? chip.bg : "$backgroundLightMuted"}
                borderColor={active ? chip.borderColor : "$rtBorder"}
                sx={{
                  _dark: {
                    bg: active ? chip.bg : "$backgroundDarkMuted",
                    borderColor: active ? chip.borderColor : "$rtBorder",
                  },
                }}
                $pressed={{ opacity: 0.9 }}
              >
                <Text fontSize="$sm" fontWeight="$medium" color={active ? "$white" : "$rtHeading"}>
                  {candidate}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$rtHeading" fontWeight="$medium" mt="$4" mb="$2">
          Tags
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
            placeholder="comma-separated"
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
          action="positive"
          variant="solid"
          mt="$6"
          borderRadius="$2xl"
          onPress={onSave}
          disabled={saving}
          opacity={saving ? 0.85 : 1}
        >
          <ButtonText>{saving ? "Saving…" : "Save changes"}</ButtonText>
        </Button>
      </ScrollView>
    </ScreenCanvas>
  );
}
