import Ionicons from "@expo/vector-icons/Ionicons";
import {
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
import { SafeAreaView } from "react-native-safe-area-context";
import type { TechniqueCategory, TechniqueLevel } from "@rolltrack/shared";
import { LEVELS, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <Pressable
            onPress={() => router.back()}
            mb="$4"
            flexDirection="row"
            alignItems="center"
            $pressed={{ opacity: 0.85 }}
          >
            <Ionicons name="chevron-back" size={22} color="#3f3f46" />
            <Text color="#27272a" ml="$1">
              Back
            </Text>
          </Pressable>
          <Text color="$coolGray900" fontSize="$lg">
            Technique not found.
          </Text>
        </ScrollView>
      </SafeAreaView>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
      <ScrollView flex={1} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <Pressable
          onPress={() => router.back()}
          flexDirection="row"
          alignItems="center"
          mb="$4"
          $pressed={{ opacity: 0.85 }}
        >
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text color="#27272a" ml="$1" fontWeight="$medium">
            Cancel
          </Text>
        </Pressable>

        <Text color="$coolGray900" fontSize="$2xl" fontWeight="$bold">
          Edit technique
        </Text>

        <Text color="$coolGray700" fontWeight="$medium" mt="$5" mb="$2">
          Name
        </Text>
        <Input borderRadius="$2xl" borderWidth={1} borderColor="#e4e4e7" bg="$white">
          <InputField
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#a1a1aa"
            color="#18181b"
            py="$3"
            px="$4"
          />
        </Input>

        <Text color="$coolGray700" fontWeight="$medium" mt="$4" mb="$2">
          Position / context
        </Text>
        <Input borderRadius="$2xl" borderWidth={1} borderColor="#e4e4e7" bg="$white">
          <InputField
            value={position}
            onChangeText={setPosition}
            placeholder="Position"
            placeholderTextColor="#a1a1aa"
            color="#18181b"
            py="$3"
            px="$4"
          />
        </Input>

        <Text color="$coolGray700" fontWeight="$medium" mt="$4" mb="$2">
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
                bg={active ? "#7c3aed" : "$white"}
                borderColor={active ? "#8b5cf6" : "#e4e4e7"}
                $pressed={{ opacity: 0.9 }}
              >
                <Text fontSize="$sm" fontWeight="$medium" color={active ? "$white" : "$coolGray700"}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$coolGray700" fontWeight="$medium" mt="$4" mb="$2">
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
                bg={active ? chip.bg : "$white"}
                borderColor={active ? chip.borderColor : "#e4e4e7"}
                $pressed={{ opacity: 0.9 }}
              >
                <Text fontSize="$sm" fontWeight="$medium" color={active ? "$white" : "$coolGray700"}>
                  {candidate}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        <Text color="$coolGray700" fontWeight="$medium" mt="$4" mb="$2">
          Tags
        </Text>
        <Input borderRadius="$2xl" borderWidth={1} borderColor="#e4e4e7" bg="$white">
          <InputField
            value={tagsRaw}
            onChangeText={setTagsRaw}
            placeholder="comma-separated"
            placeholderTextColor="#a1a1aa"
            color="#18181b"
            py="$3"
            px="$4"
          />
        </Input>

        <Text color="$coolGray700" fontWeight="$medium" mt="$4" mb="$2">
          How to perform
        </Text>
        <Textarea borderRadius="$2xl" borderWidth={1} borderColor="#e4e4e7" bg="$white">
          <TextareaInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Step-by-step cue (setup, off-balance, finish)..."
            placeholderTextColor="#a1a1aa"
            color="#18181b"
            multiline
            textAlignVertical="top"
            minHeight={100}
            px="$4"
            py="$3"
          />
        </Textarea>

        <Pressable
          onPress={onSave}
          disabled={saving}
          opacity={saving ? 0.85 : 1}
          mt="$6"
          borderRadius="$2xl"
          py="$4"
          borderWidth={1}
          bg={saving ? "$emerald300" : "$emerald500"}
          borderColor={saving ? "$emerald200" : "$emerald400"}
          $pressed={{ opacity: 0.92 }}
        >
          <Text color="$white" textAlign="center" fontWeight="$semibold" fontSize="$md">
            {saving ? "Saving…" : "Save changes"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
