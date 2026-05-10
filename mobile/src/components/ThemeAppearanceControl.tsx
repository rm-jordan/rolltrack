import { HStack, Pressable, Text } from "@gluestack-ui/themed";
import type { ThemePreference } from "@/theme/ThemePreferenceContext";
import { useThemePreference } from "@/theme/ThemePreferenceContext";

const options: { key: ThemePreference; label: string }[] = [
  { key: "system", label: "Auto" },
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
];

type ThemeAppearanceControlProps = {
  /** Wider layout for the Settings screen (default: compact for header). */
  variant?: "compact" | "panel";
};

export default function ThemeAppearanceControl({ variant = "compact" }: ThemeAppearanceControlProps) {
  const { preference, setPreference } = useThemePreference();
  const panel = variant === "panel";

  return (
    <HStack
      alignItems="center"
      justifyContent={panel ? "space-between" : "flex-start"}
      borderRadius="$full"
      borderWidth={1}
      borderColor="$rtBorder"
      p="$0.5"
      alignSelf={panel ? "stretch" : "flex-end"}
      bg="$backgroundLightMuted"
      sx={{
        _dark: {
          bg: "$backgroundDarkMuted",
          borderColor: "$rtBorder",
        },
      }}
    >
      {options.map(({ key, label }) => {
        const active = preference === key;
        return (
          <Pressable
            key={key}
            onPress={() => setPreference(key)}
            borderRadius="$full"
            px={panel ? "$3" : "$2.5"}
            py="$1.5"
            flex={panel ? 1 : undefined}
            bg={active ? "$primary500" : "transparent"}
            $pressed={{ opacity: 0.88 }}
            accessibilityRole="button"
            accessibilityLabel={`Theme ${label}`}
            accessibilityState={{ selected: active }}
          >
            <Text
              fontSize="$xs"
              fontWeight="$semibold"
              color={active ? "$rtOnPrimary" : "$rtBody"}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
}
