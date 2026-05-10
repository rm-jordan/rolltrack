import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Button,
  ButtonText,
  Card,
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
import ScreenCanvas from "@/components/ScreenCanvas";
import { z } from "zod";
import { formatLogDate, localTodayIso, type SessionGiType, type SessionType } from "@rolltrack/shared";
import EmptyStateCard from "@/components/EmptyStateCard";
import ScreenHeader from "@/components/ScreenHeader";
import { useRollTrackStore } from "@/state/store";
import { useRolltrackColor } from "@/theme/useRolltrackToken";

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
  const logAccent = useRolltrackColor("rtLogAccent");
  const sectionBrandIcon = useRolltrackColor("primary500");
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
    <ScreenCanvas>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
      >
        <ScreenHeader
          title="Training log"
          subtitle="Write what you learned. Entries are saved through the GraphQL API. Optionally tag techniques to update practice stats."
          onBack={goHome}
          backLabel="Home"
          appearanceToggle
        />

        <HStack alignItems="center" mt="$4">
          <Ionicons name="calendar-outline" size={18} color={sectionBrandIcon} />
          <Text color="$rtSubtle" fontSize="$xs" textTransform="uppercase" ml="$2" letterSpacing={1}>
            New entry
          </Text>
        </HStack>

        <Card
          variant="outline"
          size="lg"
          mt="$3"
          p="$4"
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <Text color="$rtHeading" fontWeight="$medium" mb="$2">
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
                  borderColor="$rtBorder"
                  bg="$backgroundLightMuted"
                  sx={{ _dark: { bg: "$backgroundDarkMuted" } }}
                >
                  <InputField
                    value={value}
                    onChangeText={onChange}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="$rtSubtle"
                    color="$rtHeading"
                    py="$3"
                    px="$4"
                  />
                </Input>
              )}
            />
            <Button
              size="sm"
              action="primary"
              variant="solid"
              borderRadius="$md"
              onPress={setToday}
            >
              <ButtonText>Today</ButtonText>
            </Button>
          </HStack>
        </Card>

        <Card
          variant="outline"
          size="lg"
          mt="$4"
          p="$4"
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <Text color="$rtHeading" fontWeight="$medium" mb="$2">
            What did you drill? (optional)
          </Text>
          <Text color="$rtBody" fontSize="$sm" mb="$3">
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
                    borderColor={selected ? "$primary400" : "$rtBorder"}
                    bg={selected ? "$primary500" : "$backgroundLightMuted"}
                    sx={{
                      _dark: {
                        bg: selected ? "$primary500" : "$backgroundDarkMuted",
                        borderColor: selected ? "$primary400" : "$rtBorder",
                      },
                    }}
                    $pressed={{ opacity: 0.9 }}
                  >
                    <Text
                      fontSize="$sm"
                      fontWeight="$medium"
                      color={selected ? "$rtOnPrimary" : "$rtHeading"}
                      numberOfLines={1}
                    >
                      {tech.name}
                    </Text>
                  </Pressable>
                );
              })}
            </HStack>
          )}
        </Card>

        <Card
          variant="outline"
          size="lg"
          mt="$4"
          p="$4"
          borderColor="$rtBorder"
          bg="$backgroundLight0"
          sx={{ _dark: { bg: "$backgroundDark900" } }}
        >
          <Text color="$rtHeading" fontWeight="$medium" mb="$2">
            What did you learn today?
          </Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Textarea
                borderRadius="$2xl"
                borderWidth={1}
                borderColor="$rtBorder"
                bg="$backgroundLightMuted"
                sx={{ _dark: { bg: "$backgroundDarkMuted" } }}
              >
                <TextareaInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Drills, positions, mistakes, wins — anything you want to remember."
                  placeholderTextColor="$rtSubtle"
                  color="$rtHeading"
                  multiline
                  textAlignVertical="top"
                  minHeight={160}
                  px="$4"
                  py="$3"
                />
              </Textarea>
            )}
          />
        </Card>

        {formError ? (
          <Text color="$red600" mt="$4">
            {formError}
          </Text>
        ) : null}
        {submitMessage ? (
          <Text color="$success600" mt="$4" fontWeight="$medium">
            {submitMessage}
          </Text>
        ) : null}

        <Button
          size="lg"
          action="primary"
          variant="solid"
          borderRadius="$md"
          mt="$5"
          onPress={handleSubmit(onSubmit)}
          disabled={saving}
          opacity={saving ? 0.85 : 1}
        >
          <ButtonText>{saving ? "Saving…" : "Save entry"}</ButtonText>
        </Button>

        <HStack alignItems="center" mt="$10" mb="$3">
          <Ionicons name="reader-outline" size={22} color={logAccent} />
          <Text color="$rtHeading" fontSize="$lg" fontWeight="$bold" ml="$2">
            Recent entries
          </Text>
        </HStack>
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
                <Card
                  key={entry.id}
                  variant="outline"
                  size="md"
                  p="$4"
                  mb="$3"
                  borderColor="$rtBorder"
                  bg="$backgroundLight0"
                  sx={{ _dark: { bg: "$backgroundDark900" } }}
                >
                  <Text color="$rtHeading" fontWeight="$semibold">
                    {formatLogDate(entry.date)}
                  </Text>
                  <Text color="$rtBody" fontSize="$sm" mt="$2" numberOfLines={6}>
                    {entry.notes}
                  </Text>
                  {taggedNames.length > 0 ? (
                    <Text color="$rtSubtle" fontSize="$xs" mt="$2" numberOfLines={2}>
                      Tagged: {taggedNames.join(", ")}
                    </Text>
                  ) : null}
                </Card>
              );
            })}
          </VStack>
        )}
      </ScrollView>
    </ScreenCanvas>
  );
}
