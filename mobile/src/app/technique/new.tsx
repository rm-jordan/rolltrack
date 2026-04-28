import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TechniqueCategory, TechniqueLevel } from "@rolltrack/shared";
import { LEVELS } from "@/lib/techniqueLevel";
import { useRollTrackStore } from "@/state/store";

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

export default function NewTechniqueScreen() {
  const router = useRouter();
  const createTechnique = useRollTrackStore((s) => s.createTechnique);
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
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <Pressable onPress={() => router.back()} className="flex-row items-center mb-4">
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text className="text-zinc-800 ml-1 font-medium">Cancel</Text>
        </Pressable>

        <Text className="text-zinc-900 text-2xl font-bold">New technique</Text>
        <Text className="text-zinc-500 mt-1 text-sm">Saved to the GraphQL API (server database).</Text>

        <Text className="text-zinc-700 font-medium mt-5 mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Triangle from Guard"
          placeholderTextColor="#a1a1aa"
          className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900"
        />

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Position / context</Text>
        <TextInput
          value={position}
          onChangeText={setPosition}
          placeholder="e.g. Closed Guard, Top Passing"
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

        <Text className="text-zinc-700 font-medium mt-4 mb-2">Tags (optional, comma-separated)</Text>
        <TextInput
          value={tagsRaw}
          onChangeText={setTagsRaw}
          placeholder="choke, fundamental"
          placeholderTextColor="#a1a1aa"
          className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900"
        />

        <Text className="text-zinc-700 font-medium mt-4 mb-2">How to perform</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Step-by-step cue (setup, off-balance, finish)..."
          placeholderTextColor="#a1a1aa"
          multiline
          textAlignVertical="top"
          className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900 min-h-[100]"
        />

        <Pressable
          onPress={onSave}
          disabled={saving}
          className={`mt-6 rounded-2xl py-4 items-center border ${saving ? "bg-emerald-300 border-emerald-200" : "bg-emerald-500 border-emerald-400"}`}
        >
          <Text className="text-white font-semibold text-base">{saving ? "Saving…" : "Save technique"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
