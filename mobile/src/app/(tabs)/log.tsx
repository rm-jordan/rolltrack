import {
  Box,
  HStack,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Text,
  Textarea,
  TextareaInput,
  VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { formatLogDate, localTodayIso, type SessionGiType, type SessionType } from "@rolltrack/shared";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
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
          ? "Saved. Practice counts updated for tagged techniques."
          : "Saved.",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#efedf8" }} edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
      >
        <ScreenHeader
          title="Training log"
          subtitle="Write what you learned. Entries are saved through the GraphQL API. Optionally tag techniques to update practice stats."
          onBack={goHome}
          backLabel="Home"
        />

        <Box mt="$5" borderRadius="$3xl" borderWidth={1} borderColor="#e4e4e7" bg="$white" p="$4">
          <Text color="$coolGray700" fontWeight="$medium" mb="$2">
            Date for this entry
          </Text>
          <HStack alignItems="center" space="sm">
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <Input
                  flex={1}
                  borderRadius="$2xl"
                  borderWidth={1}
                  borderColor="#e4e4e7"
                  bg="$coolGray50"
                >
                  <InputField
                    value={value}
                    onChangeText={onChange}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#a1a1aa"
                    color="#18181b"
                    py="$3"
                    px="$4"
                  />
                </Input>
              )}
            />
            <Pressable
              onPress={setToday}
              borderRadius="$2xl"
              bg="$emerald500"
              px="$4"
              py="$3"
              borderWidth={1}
              borderColor="$emerald400"
              $pressed={{ opacity: 0.9 }}
            >
              <Text color="$white" fontWeight="$semibold" fontSize="$sm">
                Today
              </Text>
            </Pressable>
          </HStack>
        </Box>

        <Box mt="$4" borderRadius="$3xl" borderWidth={1} borderColor="#e4e4e7" bg="$white" p="$4">
          <Text color="$coolGray700" fontWeight="$medium" mb="$2">
            What did you drill? (optional)
          </Text>
          <Text color="$coolGray500" fontSize="$sm" mb="$3">
            Tap to tag techniques. Leave empty for a simple journal entry.
          </Text>
          {sortedTechniques.length === 0 ? (
            <EmptyStateCard
              title="No techniques available"
              message="Add your first technique in Library to start tagging sessions."
              actionLabel="Go to library"
              onAction={() => router.push("/(tabs)/library")}
            />
          ) : (
            <HStack flexWrap="wrap">
              {sortedTechniques.map((tech) => {
                const selected = techniquesPracticed.includes(tech.id);
                return (
                  <Pressable
                    key={tech.id}
                    onPress={() => toggleTechnique(tech.id)}
                    borderRadius="$full"
                    px="$3"
                    py="$2"
                    mr="$2"
                    mb="$2"
                    borderWidth={1}
                    bg={selected ? "#d1fae5" : "$coolGray50"}
                    borderColor={selected ? "$emerald400" : "#e4e4e7"}
                    $pressed={{ opacity: 0.9 }}
                  >
                    <Text
                      fontSize="$sm"
                      fontWeight="$medium"
                      color={selected ? "#064e3b" : "$coolGray700"}
                      numberOfLines={1}
                    >
                      {tech.name}
                    </Text>
                  </Pressable>
                );
              })}
            </HStack>
          )}
        </Box>

        <Box mt="$4" borderRadius="$3xl" borderWidth={1} borderColor="#e4e4e7" bg="$white" p="$4">
          <Text color="$coolGray700" fontWeight="$medium" mb="$2">
            What did you learn today?
          </Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Textarea borderRadius="$2xl" borderWidth={1} borderColor="#e4e4e7" bg="$coolGray50">
                <TextareaInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Drills, positions, mistakes, wins — anything you want to remember."
                  placeholderTextColor="#a1a1aa"
                  color="#18181b"
                  multiline
                  textAlignVertical="top"
                  minHeight={160}
                  px="$4"
                  py="$3"
                />
              </Textarea>
            )}
          />
        </Box>

        {formError ? (
          <Text color="$red600" mt="$4">
            {formError}
          </Text>
        ) : null}
        {submitMessage ? (
          <Text color="#047857" mt="$4" fontWeight="$medium">
            {submitMessage}
          </Text>
        ) : null}

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={saving}
          opacity={saving ? 0.85 : 1}
          borderRadius="$2xl"
          py="$4"
          mt="$5"
          borderWidth={1}
          bg={saving ? "$emerald300" : "$emerald500"}
          borderColor={saving ? "$emerald200" : "$emerald400"}
          $pressed={{ opacity: 0.92 }}
        >
          <Text color="$white" textAlign="center" fontWeight="$semibold" fontSize="$md">
            {saving ? "Saving…" : "Save entry"}
          </Text>
        </Pressable>

        <Text color="$coolGray900" fontSize="$lg" fontWeight="$bold" mt="$10" mb="$3">
          Recent entries
        </Text>
        {recentEntries.length === 0 ? (
          <EmptyStateCard
            title="No entries yet"
            message="Save your first training entry to start building your history."
          />
        ) : (
          <VStack>
            {recentEntries.map((entry) => {
              const taggedNames = entry.techniquesPracticed
                .map((id) => techniqueNameById[id])
                .filter(Boolean);
              return (
                <Box
                  key={entry.id}
                  borderRadius="$2xl"
                  borderWidth={1}
                  borderColor="#e4e4e7"
                  bg="$white"
                  p="$4"
                  mb="$3"
                >
                  <Text color="$coolGray900" fontWeight="$semibold">
                    {formatLogDate(entry.date)}
                  </Text>
                  <Text color="$coolGray600" fontSize="$sm" mt="$2" numberOfLines={6}>
                    {entry.notes}
                  </Text>
                  {taggedNames.length > 0 ? (
                    <Text color="$coolGray500" fontSize="$xs" mt="$2" numberOfLines={2}>
                      Tagged: {taggedNames.join(", ")}
                    </Text>
                  ) : null}
                </Box>
              );
            })}
          </VStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
