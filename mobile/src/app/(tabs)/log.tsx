import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { formatLogDate, localTodayIso, type SessionGiType, type SessionType } from "@rolltrack/shared";
import { useRollTrackStore } from "@/state/store";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().min(8, "Write a few words about what you learned"),
  techniquesPracticed: z.array(z.string()),
});

type LogFormValues = z.infer<typeof formSchema>;

const defaultGi: SessionGiType = "Gi";
const defaultSessionType: SessionType = "Class";

export default function LogScreen() {
  const router = useRouter();
  const addSessionLog = useRollTrackStore((state) => state.addSessionLog);
  const sessionLogs = useRollTrackStore((state) => state.sessionLogs);
  const techniques = useRollTrackStore((state) => state.techniques);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, setValue, reset, watch } = useForm<LogFormValues>({
    defaultValues: {
      date: localTodayIso(),
      notes: "",
      techniquesPracticed: [],
    },
  });

  const techniquesPracticed = watch("techniquesPracticed");

  const sortedTechniques = useMemo(
    () => [...techniques].sort((a, b) => a.name.localeCompare(b.name)),
    [techniques],
  );

  const techniqueNameById = useMemo(
    () => Object.fromEntries(techniques.map((t) => [t.id, t.name])),
    [techniques],
  );

  const recentEntries = useMemo(() => sessionLogs.slice(0, 12), [sessionLogs]);

  const toggleTechnique = (id: string) => {
    const current = watch("techniquesPracticed");
    if (current.includes(id)) {
      setValue(
        "techniquesPracticed",
        current.filter((x) => x !== id),
      );
    } else {
      setValue("techniquesPracticed", [...current, id]);
    }
  };

  const onSubmit = async (values: LogFormValues) => {
    setSubmitMessage(null);
    setFormError(null);

    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check your entry.");
      return;
    }

    setSaving(true);
    try {
      await addSessionLog({
        date: parsed.data.date,
        giType: defaultGi,
        sessionType: defaultSessionType,
        techniquesPracticed: parsed.data.techniquesPracticed,
        notes: parsed.data.notes.trim(),
        rollNotes: undefined,
      });

      setSubmitMessage(
        parsed.data.techniquesPracticed.length > 0
          ? "Saved locally (SQLite). Practice counts updated for tagged techniques."
          : "Saved locally (SQLite).",
      );
      reset({
        date: localTodayIso(),
        notes: "",
        techniquesPracticed: [],
      });
    } catch {
      setFormError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const setToday = () => {
    setValue("date", localTodayIso());
  };

  const goHome = () => {
    router.navigate("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
        <Pressable
          onPress={goHome}
          className="flex-row items-center self-start py-2 pr-4 mb-2"
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Ionicons name="chevron-back" size={22} color="#3f3f46" />
          <Text className="text-zinc-800 ml-1 font-semibold">Home</Text>
        </Pressable>

        <Text className="text-zinc-900 text-3xl font-bold">Training log</Text>
        <Text className="text-zinc-500 mt-2">
          Write what you learned. Entries are stored in a local SQLite database on this device (no server).
          Optionally tag techniques to update practice stats.
        </Text>

        <View className="mt-5 rounded-3xl border border-zinc-200 bg-white p-4">
          <Text className="text-zinc-700 font-medium mb-2">Date for this entry</Text>
          <View className="flex-row items-center">
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#a1a1aa"
                  className="flex-1 mr-2 bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-2xl px-4 py-3"
                />
              )}
            />
            <Pressable
              onPress={setToday}
              className="rounded-2xl bg-emerald-500 px-4 py-3 border border-emerald-400"
            >
              <Text className="text-white font-semibold text-sm">Today</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-4 rounded-3xl border border-zinc-200 bg-white p-4">
          <Text className="text-zinc-700 font-medium mb-2">What did you drill? (optional)</Text>
          <Text className="text-zinc-500 text-sm mb-3">
            Tap to tag techniques. Leave empty for a simple journal entry.
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {sortedTechniques.map((tech) => {
              const selected = techniquesPracticed.includes(tech.id);
              return (
                <Pressable
                  key={tech.id}
                  onPress={() => toggleTechnique(tech.id)}
                  className={`rounded-full px-3 py-2 border ${
                    selected ? "bg-emerald-100 border-emerald-400" : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${selected ? "text-emerald-900" : "text-zinc-700"}`}
                    numberOfLines={1}
                  >
                    {tech.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-3xl border border-zinc-200 bg-white p-4">
          <Text className="text-zinc-700 font-medium mb-2">What did you learn today?</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Drills, positions, mistakes, wins — anything you want to remember."
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                className="bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-2xl px-4 py-3 min-h-[160]"
              />
            )}
          />
        </View>

        {formError ? <Text className="text-red-600 mt-4">{formError}</Text> : null}
        {submitMessage ? <Text className="text-emerald-700 mt-4 font-medium">{submitMessage}</Text> : null}

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={saving}
          className={`rounded-2xl py-4 mt-5 border ${
            saving ? "bg-emerald-300 border-emerald-200" : "bg-emerald-500 border-emerald-400"
          }`}
        >
          <Text className="text-white text-center font-semibold text-base">
            {saving ? "Saving…" : "Save entry"}
          </Text>
        </Pressable>

        <Text className="text-zinc-900 text-lg font-bold mt-10 mb-3">Recent entries</Text>
        {recentEntries.length === 0 ? (
          <Text className="text-zinc-500">No entries yet.</Text>
        ) : (
          recentEntries.map((entry) => {
            const taggedNames = entry.techniquesPracticed
              .map((id) => techniqueNameById[id])
              .filter(Boolean);
            return (
              <View
                key={entry.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 mb-3"
              >
                <Text className="text-zinc-900 font-semibold">{formatLogDate(entry.date)}</Text>
                <Text className="text-zinc-600 text-sm mt-2" numberOfLines={6}>
                  {entry.notes}
                </Text>
                {taggedNames.length > 0 ? (
                  <Text className="text-zinc-500 text-xs mt-2" numberOfLines={2}>
                    Tagged: {taggedNames.join(", ")}
                  </Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
