import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { formatLogDate, localTodayIso } from "../../lib/date";
import { useRollTrackStore } from "../../lib/store";
import type { SessionGiType, SessionType } from "../../lib/types";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().min(8, "Write a few words about what you learned"),
});

type LogFormValues = z.infer<typeof formSchema>;

const defaultGi: SessionGiType = "Gi";
const defaultSessionType: SessionType = "Class";

export default function LogScreen() {
  const addSessionLog = useRollTrackStore((state) => state.addSessionLog);
  const sessionLogs = useRollTrackStore((state) => state.sessionLogs);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, setValue, reset } = useForm<LogFormValues>({
    defaultValues: {
      date: localTodayIso(),
      notes: "",
    },
  });

  const recentEntries = useMemo(() => sessionLogs.slice(0, 12), [sessionLogs]);

  const onSubmit = (values: LogFormValues) => {
    setSubmitMessage(null);
    setFormError(null);

    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check your entry.");
      return;
    }

    addSessionLog({
      date: parsed.data.date,
      giType: defaultGi,
      sessionType: defaultSessionType,
      techniquesPracticed: [],
      notes: parsed.data.notes.trim(),
      rollNotes: undefined,
    });

    setSubmitMessage("Saved locally with this date.");
    reset({
      date: localTodayIso(),
      notes: "",
    });
  };

  const setToday = () => {
    setValue("date", localTodayIso());
  };

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]" edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}>
        <Text className="text-zinc-900 text-3xl font-bold">Training log</Text>
        <Text className="text-zinc-500 mt-2">
          Write what you learned. Each save stores a date plus your notes (in-memory for now — no server).
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
          className="bg-emerald-500 rounded-2xl py-4 mt-5 border border-emerald-400"
        >
          <Text className="text-white text-center font-semibold text-base">Save entry</Text>
        </Pressable>

        <Text className="text-zinc-900 text-lg font-bold mt-10 mb-3">Recent entries</Text>
        {recentEntries.length === 0 ? (
          <Text className="text-zinc-500">No entries yet.</Text>
        ) : (
          recentEntries.map((entry) => (
            <View
              key={entry.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 mb-3"
            >
              <Text className="text-zinc-900 font-semibold">{formatLogDate(entry.date)}</Text>
              <Text className="text-zinc-600 text-sm mt-2" numberOfLines={6}>
                {entry.notes}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
