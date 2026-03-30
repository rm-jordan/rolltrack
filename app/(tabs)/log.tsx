import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { localTodayIso } from "../../lib/date";
import { useRollTrackStore } from "../../lib/store";
import type { SessionGiType, SessionType } from "../../lib/types";

const giOptions: SessionGiType[] = ["Gi", "No-Gi"];
const sessionOptions: SessionType[] = ["Class", "Open Mat", "Drilling", "Competition"];

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  giType: z.enum(["Gi", "No-Gi"]),
  sessionType: z.enum(["Class", "Open Mat", "Drilling", "Competition"]),
  techniquesPracticed: z.array(z.string()).min(1, "Select at least one technique"),
  notes: z.string().min(3, "Add a short session note"),
  rollNotesText: z.string().optional(),
});

type LogFormValues = z.infer<typeof formSchema>;

const cardClass = "mt-4 rounded-3xl border border-zinc-200 bg-white p-4";
const inputClass = "bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-2xl px-4 py-3";

export default function LogScreen() {
  const addSessionLog = useRollTrackStore((state) => state.addSessionLog);
  const techniques = useRollTrackStore((state) => state.techniques);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, setValue, watch, reset } = useForm<LogFormValues>({
    defaultValues: {
      date: localTodayIso(),
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

    setSubmitMessage("Session saved. Practice counts updated.");
    reset({
      date: localTodayIso(),
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

  const chipInactive = "bg-white border-zinc-200";
  const chipActive = "bg-emerald-500 border-emerald-400";

  return (
    <SafeAreaView className="flex-1 bg-[#efedf8]">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}>
        <Text className="text-zinc-900 text-3xl font-bold">Log session</Text>
        <Text className="text-zinc-500 mt-2">Saved sessions update your technique stats.</Text>

        <View className="mt-4 rounded-3xl border border-emerald-200 bg-white p-4">
          <Text className="text-zinc-500 text-xs uppercase tracking-wide">After class</Text>
          <Text className="text-zinc-700 mt-2 text-sm">
            Log soon so practice counts and “last practiced” stay accurate.
          </Text>
        </View>

        <View className={cardClass}>
          <Text className="text-zinc-700 mb-2 font-medium">Date</Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#a1a1aa"
                className={inputClass}
              />
            )}
          />
        </View>

        <View className={cardClass}>
          <Text className="text-zinc-700 mb-2 font-medium">Gi type</Text>
          <View className="flex-row flex-wrap">
            {giOptions.map((option) => {
              const active = watch("giType") === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setValue("giType", option)}
                  className={`rounded-full px-4 py-2 mr-2 mb-2 border ${active ? chipActive : chipInactive}`}
                >
                  <Text className={active ? "text-white font-medium" : "text-zinc-700"}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className={cardClass}>
          <Text className="text-zinc-700 mb-2 font-medium">Session type</Text>
          <View className="flex-row flex-wrap">
            {sessionOptions.map((option) => {
              const active = watch("sessionType") === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setValue("sessionType", option)}
                  className={`rounded-full px-4 py-2 mr-2 mb-2 border ${active ? chipActive : chipInactive}`}
                >
                  <Text className={active ? "text-white font-medium" : "text-zinc-700"}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className={cardClass}>
          <Text className="text-zinc-700 mb-2 font-medium">Techniques practiced</Text>
          <View className="flex-row flex-wrap">
            {techniques.map((technique) => {
              const active = selectedTechniqueIds.includes(technique.id);
              return (
                <Pressable
                  key={technique.id}
                  onPress={() => toggleTechnique(technique.id)}
                  className={`rounded-full px-3 py-2 mr-2 mb-2 border ${active ? chipActive : chipInactive}`}
                >
                  <Text className={active ? "text-white text-xs font-medium" : "text-zinc-700 text-xs"}>
                    {technique.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className={cardClass}>
          <Text className="text-zinc-700 mb-2 font-medium">Session notes</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={notePlaceholder}
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                className={`${inputClass} min-h-[100]`}
              />
            )}
          />
        </View>

        <View className={cardClass}>
          <Text className="text-zinc-700 mb-2 font-medium">Optional roll notes</Text>
          <Controller
            control={control}
            name="rollNotesText"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Rolls, partners, outcomes…"
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                className={`${inputClass} min-h-[90]`}
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
          <Text className="text-white text-center font-semibold text-base">Save session</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
