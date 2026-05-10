import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Card, HStack, Pressable, Text } from "@gluestack-ui/themed";
import { useRolltrackColor } from "@/theme/useRolltrackToken";
import type { Technique } from "@rolltrack/shared";

type TechniqueCardProps = {
  technique: Technique;
  onPress?: () => void;
};

const categoryIconMap: Record<Technique["category"], keyof typeof Ionicons.glyphMap> = {
  Submission: "flash-outline",
  Pass: "git-network-outline",
  Sweep: "swap-horizontal-outline",
  Escape: "shield-checkmark-outline",
  Takedown: "trending-down-outline",
  Control: "lock-closed-outline",
};

function CardBody({
  technique,
  explanation,
  showChevron,
}: {
  technique: Technique;
  explanation: string;
  showChevron: boolean;
}) {
  const categoryIcon = useRolltrackColor("rtHeading");
  const mutedHex = useRolltrackColor("rtIconMuted");

  return (
    <>
      <HStack alignItems="center">
        <Ionicons
          name={categoryIconMap[technique.category]}
          size={16}
          color={categoryIcon}
          style={{ marginRight: 6 }}
        />
        <Text color="$rtHeading" fontSize="$lg" fontWeight="$semibold" flex={1}>
          {technique.name}
        </Text>
      </HStack>

      <Text color="$rtBody" mt="$1">
        {technique.position} • {technique.category}
      </Text>

      <Box
        mt="$3"
        borderRadius="$xl"
        borderWidth={1}
        borderColor="$rtBorder"
        bg="$backgroundLightMuted"
        px="$3"
        py="$2.5"
        sx={{
          _dark: { bg: "$backgroundDarkMuted" },
        }}
      >
        <Text color="$rtSubtle" fontSize="$xs">
          How to perform
        </Text>
        <Text color="$rtBody" fontSize="$sm" mt="$1" numberOfLines={3}>
          {explanation}
        </Text>
      </Box>

      <HStack flexWrap="wrap" mt="$3">
        {technique.tags.map((tag) => (
          <Box
            key={tag}
            bg="$backgroundLight200"
            px="$2"
            py="$1"
            borderRadius="$full"
            mr="$2"
            mb="$2"
            sx={{
              _dark: { bg: "$backgroundDark700" },
            }}
          >
            <Text color="$rtBody" fontSize="$xs">
              {tag}
            </Text>
          </Box>
        ))}
      </HStack>

      <HStack alignItems="center" justifyContent="space-between" mt="$2">
        <Text color="$rtSubtle" fontSize="$xs">
          Practiced {technique.timesPracticed}x
        </Text>
        {showChevron ? <Ionicons name="chevron-forward" size={14} color={mutedHex} /> : null}
      </HStack>
    </>
  );
}

export default function TechniqueCard({ technique, onPress }: TechniqueCardProps) {
  const explanation =
    technique.notes?.trim() ||
    `From ${technique.position}, establish control first, off-balance your partner, and finish the ${technique.name} with tight positioning.`;

  const inner = <CardBody technique={technique} explanation={explanation} showChevron={Boolean(onPress)} />;

  if (onPress) {
    return (
      <Pressable onPress={onPress} mb="$3" $pressed={{ opacity: 0.96 }}>
        <Card variant="outline" size="lg" p="$4" borderColor="$rtBorder" bg="$backgroundLight0" sx={{ _dark: { bg: "$backgroundDark900" } }}>
          {inner}
        </Card>
      </Pressable>
    );
  }

  return (
    <Card variant="outline" size="lg" p="$4" mb="$3" borderColor="$rtBorder" bg="$backgroundLight0" sx={{ _dark: { bg: "$backgroundDark900" } }}>
      {inner}
    </Card>
  );
}
