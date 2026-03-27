import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { useRollTrackStore } from "../../lib/store";
import type { SessionGiType, SessionType } from "../../lib/types";

const giOptions: SessionGiType[] = ["Gi", "No-Gi"];
const sessionOptions: SessionType[] = ["Class", "Open Mat", "Drilling", "Competition"];

const todayDate = () => new Date().toISOString().slice(0, 10);

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  giType: z.enum(["Gi", "No-Gi"]),
  sessionType: z.enum(["Class", "Open Mat", "Drilling", "Competition"]),
  techniquesPracticed: z.array(z.string()).min(1, "Select at least one technique"),
  notes: z.string().min(3, "Add a short session note"),
  rollNotesText: z.string().optional(),
});

type LogFormValues = z.infer<typeof formSchema>;

export default function LogScreen() {
  const addSessionLog = useRollTrackStore((state) => state.addSessionLog);
  const techniques = useRollTrackStore((state) => state.techniques);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, setValue, watch, reset } = useForm<LogFormValues>({
    defaultValues: {
      date: todayDate(),
      giType: "Gi",
      sessionType: "Class",
      techniquesPracticed: [],
      notes: "",
      rollNotesText: "",
    },
  });

  const selectedTechniqueIds = watch("techniquesPracticed");
  const notePlaceholder = useMemo(
    () => "What stood out today? Wins, mistakes, and adjustments.",
    [],
  );

  const onSubmit = (values: LogFormValues) => {
    setSubmitMessage(null);
    setFormError(null);

    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check your inputs.");
      return;
    }

    addSessionLog({
      date: parsed.data.date,
      giType: parsed.data.giType,
      sessionType: parsed.data.sessionType,
      techniquesPracticed: parsed.data.techniquesPracticed,
      notes: parsed.data.notes,
      rollNotes: parsed.data.rollNotesText?.trim()
        ? [{ partner: "General", rounds: 1, notes: parsed.data.rollNotesText.trim() }]
        : undefined,
    });

    setSubmitMessage("Session saved.");
    reset({
      date: todayDate(),
      giType: parsed.data.giType,
      sessionType: parsed.data.sessionType,
      techniquesPracticed: [],
      notes: "",
      rollNotesText: "",
    });
  };

  const toggleTechnique = (id: string) => {
    const current = selectedTechniqueIds ?? [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    setValue("techniquesPracticed", next, { shouldValidate: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 36 }}>
        <Text className="text-white text-3xl font-bold">Log Session</Text>
        <Text className="text-zinc-400 mt-2">Track class details and key takeaways.</Text>

        <View className="mt-4 rounded-2xl border border-emerald-500/30 bg-zinc-900 p-4">
          <Text className="text-zinc-300 text-xs uppercase">Session Quality</Text>
          <Text className="text-zinc-100 mt-2">
            Capture details right after class for better review later.
          </Text>
        </View>

        <View className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <Text className="text-zinc-300 mb-2">Date</Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#71717a"
                className="bg-zinc-900 text-white border border-zinc-800 rounded-xl px-4 py-3"
              />
            )}
          />
        </View>

        <View className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <Text className="text-zinc-300 mb-2">Gi Type</Text>
          <View className="flex-row flex-wrap">
            {giOptions.map((option) => {
              const active = watch("giType") === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setValue("giType", option)}
                  className={`rounded-full px-4 py-2 mr-2 mb-2 border ${active ? "bg-emerald-500 border-emerald-400" : "bg-zinc-900 border-zinc-700"}`}
                >
                  <Text className={active ? "text-white font-medium" : "text-zinc-200"}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <Text className="text-zinc-300 mb-2">Session Type</Text>
          <View className="flex-row flex-wrap">
            {sessionOptions.map((option) => {
              const active = watch("sessionType") === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setValue("sessionType", option)}
                  className={`rounded-full px-4 py-2 mr-2 mb-2 border ${active ? "bg-emerald-500 border-emerald-400" : "bg-zinc-900 border-zinc-700"}`}
                >
                  <Text className={active ? "text-white font-medium" : "text-zinc-200"}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <Text className="text-zinc-300 mb-2">Techniques Practiced</Text>
          <View className="flex-row flex-wrap">
            {techniques.map((technique) => {
              const active = selectedTechniqueIds.includes(technique.id);
              return (
                <Pressable
                  key={technique.id}
                  onPress={() => toggleTechnique(technique.id)}
                  className={`rounded-full px-3 py-2 mr-2 mb-2 border ${active ? "bg-emerald-500 border-emerald-400" : "bg-zinc-900 border-zinc-700"}`}
                >
                  <Text className={active ? "text-white text-xs font-medium" : "text-zinc-200 text-xs"}>
                    {technique.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <Text className="text-zinc-300 mb-2">Session Notes</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={notePlaceholder}
                placeholderTextColor="#71717a"
                multiline
                textAlignVertical="top"
                className="bg-zinc-900 text-white border border-zinc-800 rounded-xl px-4 py-3 min-h-[100]"
              />
            )}
          />
        </View>

        <View className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <Text className="text-zinc-300 mb-2">Optional Roll Notes</Text>
          <Controller
            control={control}
            name="rollNotesText"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Short note on rolls, partners, or outcomes."
                placeholderTextColor="#71717a"
                multiline
                textAlignVertical="top"
                className="bg-zinc-900 text-white border border-zinc-800 rounded-xl px-4 py-3 min-h-[90]"
              />
            )}
          />
        </View>

        {formError ? <Text className="text-red-400 mt-4">{formError}</Text> : null}
        {submitMessage ? <Text className="text-emerald-400 mt-4">{submitMessage}</Text> : null}

        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="bg-emerald-500 rounded-xl py-3 mt-5 border border-emerald-300"
        >
          <Text className="text-white text-center font-semibold">Save Session</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}