import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, HStack, Pressable, Text } from "@gluestack-ui/themed";
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
  return (
    <>
      <HStack alignItems="center">
        <Ionicons
          name={categoryIconMap[technique.category]}
          size={16}
          color="#7c3aed"
          style={{ marginRight: 6 }}
        />
        <Text color="$coolGray900" fontSize="$lg" fontWeight="$semibold" flex={1}>
          {technique.name}
        </Text>
      </HStack>

      <Text color="$coolGray500" mt="$1">
        {technique.position} • {technique.category}
      </Text>

      <Box mt="$3" borderRadius="$xl" borderWidth={1} borderColor="#e4e4e7" bg="$coolGray50" px="$3" py="$2.5">
        <Text color="$coolGray500" fontSize="$xs">
          How to perform
        </Text>
        <Text color="$coolGray700" fontSize="$sm" mt="$1" numberOfLines={3}>
          {explanation}
        </Text>
      </Box>

      <HStack flexWrap="wrap" mt="$3">
        {technique.tags.map((tag) => (
          <Box key={tag} bg="$coolGray100" px="$2" py="$1" borderRadius="$full" mr="$2" mb="$2">
            <Text color="$coolGray600" fontSize="$xs">
              {tag}
            </Text>
          </Box>
        ))}
      </HStack>

      <HStack alignItems="center" justifyContent="space-between" mt="$2">
        <Text color="$coolGray400" fontSize="$xs">
          Practiced {technique.timesPracticed}x
        </Text>
        {showChevron ? <Ionicons name="chevron-forward" size={14} color="#a1a1aa" /> : null}
      </HStack>
    </>
  );
}

export default function TechniqueCard({ technique, onPress }: TechniqueCardProps) {
  const explanation =
    technique.notes?.trim() ||
    `From ${technique.position}, establish control first, off-balance your partner, and finish the ${technique.name} with tight positioning.`;

  const shellProps = {
    bg: "$white" as const,
    borderRadius: "$2xl" as const,
    p: "$4" as const,
    mb: "$3" as const,
    borderWidth: 1 as const,
    borderColor: "#e4e4e7" as const,
  };

  if (onPress) {
    return (
      <Pressable {...shellProps} onPress={onPress} $pressed={{ opacity: 0.96 }}>
        <CardBody technique={technique} explanation={explanation} showChevron />
      </Pressable>
    );
  }

  return (
    <Box {...shellProps}>
      <CardBody technique={technique} explanation={explanation} showChevron={false} />
    </Box>
  );
}
