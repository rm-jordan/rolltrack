import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BeltLevel, TechniqueCategory, TechniqueLevel } from "@rolltrack/shared";
import BeltIcon from "@/components/BeltIcon";
import { LEVELS, levelFromBelt, techniqueLevel } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

const BELTS: BeltLevel[] = ["White", "Blue", "Purple", "Brown", "Black"];
const LEVEL_BG: Record<TechniqueLevel, string> = {
  Beginner: "bg-emerald-600 border-emerald-500",
  Intermediate: "bg-cyan-600 border-cyan-500",
  Advanced: "bg-violet-600 border-violet-500",
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
  const [belt, setBelt] = useState<BeltLevel>(technique?.beltGuideline ?? "White");
  const [level, setLevel] = useState<TechniqueLevel>(
    technique ? techniqueLevel(technique) : "Beginner",
  );
  const [tagsRaw, setTagsRaw] = useState(technique?.tags.join(", ") ?? "");
  const [notes, setNotes] = useState(technique?.notes ?? "");
  const [saving, setSaving] = useState(false);

  if (!technique) {
    return (
      <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
        <View className="px-5 pt-6">
          <Pressable onPress={() => router.back()} className="mb-4 flex-row items-center">
            <Ionicons name="chevron-back" size={22} color="#3f3f46" />
            <Text className="text-zinc-800 ml-1">Back</Text>
          </Pressable>
          <Text className="text-zinc-900 text-lg">Technique not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onSave = async () => {
    const n = name.trim();
    const p = position.trim();
    if (n.length < 2 || p.length < 2) {
      Alert.alert("Check fields", "Name and position are required.");
      return;
    }
    setSaving(true);
    try {
      await updateTechnique(id, {
        name: n,
        position: p,
        category,
        beltGuideline: belt,
        level,
        tags: parseTags(tagsRaw),
        notes: notes.trim() || null,
      });
      router.back();
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <Pressable onPress={() => router.back()} className="flex-row items-center mb-4">
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text className="text-zinc-800 ml-1 font-medium">Cancel</Text>
        </Pressable>

        <Text className="text-zinc-900 text-2xl font-bold">Edit technique</Text>

        <Text className="text-zinc-700 font-medium mt-5 mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#a1a1aa"
          className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900"
        />

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Position / context</Text>
        <TextInput
          value={position}
          onChangeText={setPosition}
          placeholder="Position"
          placeholderTextColor="#a1a1aa"
          className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900"
        />

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Category</Text>
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                className={`rounded-full px-3 py-2 border ${active ? "bg-violet-600 border-violet-500" : "bg-white border-zinc-200"}`}
              >
                <Text className={`text-sm font-medium ${active ? "text-white" : "text-zinc-700"}`}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Belt guideline</Text>
        <View className="flex-row flex-wrap gap-2">
          {BELTS.map((b) => {
            const active = belt === b;
            return (
              <Pressable
                key={b}
                onPress={() => {
                  setBelt(b);
                  setLevel(levelFromBelt(b));
                }}
                className={`flex-row items-center rounded-full px-3 py-2 border ${
                  active ? "bg-emerald-600 border-emerald-500" : "bg-white border-zinc-200"
                }`}
              >
                <BeltIcon belt={b} size="xs" />
                <Text className={`ml-1.5 text-sm font-medium ${active ? "text-white" : "text-zinc-700"}`}>
                  {b}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Technique level</Text>
        <View className="flex-row flex-wrap gap-2">
          {LEVELS.map((candidate) => {
            const active = level === candidate;
            return (
              <Pressable
                key={candidate}
                onPress={() => setLevel(candidate)}
                className={`rounded-full px-3 py-2 border ${active ? LEVEL_BG[candidate] : "bg-white border-zinc-200"}`}
              >
                <Text className={`text-sm font-medium ${active ? "text-white" : "text-zinc-700"}`}>
                  {candidate}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Tags</Text>
        <TextInput
          value={tagsRaw}
          onChangeText={setTagsRaw}
          placeholder="comma-separated"
          placeholderTextColor="#a1a1aa"
          className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900"
        />

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
          className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900 min-h-[100]"
        />

        <Pressable
          onPress={onSave}
          disabled={saving}
          className={`mt-6 rounded-2xl py-4 items-center border ${saving ? "bg-emerald-300 border-emerald-200" : "bg-emerald-500 border-emerald-400"}`}
        >
          <Text className="text-white font-semibold text-base">{saving ? "Saving…" : "Save changes"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
