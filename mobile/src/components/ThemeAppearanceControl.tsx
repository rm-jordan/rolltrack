import { HStack, Pressable, Text } from "@gluestack-ui/themed";
import type { ThemePreference } from "@/theme/ThemePreferenceContext";
import { useThemePreference } from "@/theme/ThemePreferenceContext";

const options: { key: ThemePreference; label: string }[] = [
  { key: "system", label: "Auto" },
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
];

export default function ThemeAppearanceControl() {
  const { preference, setPreference } = useThemePreference();

  return (
    <HStack
      alignItems="center"
      borderRadius="$full"
      borderWidth={1}
      borderColor="$rtBorder"
      p="$0.5"
      alignSelf="flex-end"
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
            px="$2.5"
            py="$1.5"
            bg={active ? "$primary500" : "transparent"}
            $pressed={{ opacity: 0.88 }}
            accessibilityRole="button"
            accessibilityLabel={`Theme ${label}`}
            accessibilityState={{ selected: active }}
          >
            <Text
              fontSize="$xs"
              fontWeight="$semibold"
              color={active ? "$white" : "$rtBody"}
              sx={{
                _dark: {
                  color: active ? "$white" : "$rtBody",
                },
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
}
