import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="log" />
      <Stack.Screen name="library" />
    </Stack>
  );
}
