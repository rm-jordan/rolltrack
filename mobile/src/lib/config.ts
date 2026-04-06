/**
 * GraphQL HTTP endpoint (same machine: http://127.0.0.1:4000 or http://localhost:4000).
 * Android emulator: use http://10.0.2.2:4000 to reach the host machine.
 */
export function getGraphqlUrl(): string {
  const url = process.env.EXPO_PUBLIC_GRAPHQL_URL?.trim();
  if (!url) {
    throw new Error(
      "Missing EXPO_PUBLIC_GRAPHQL_URL. Add it to mobile/.env (see mobile/.env.example).",
    );
  }
  return url.replace(/\/$/, "");
}
