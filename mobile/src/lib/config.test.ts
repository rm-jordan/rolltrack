import { getGraphqlUrl } from "./config";

const envKey = "EXPO_PUBLIC_GRAPHQL_URL";

describe("getGraphqlUrl", () => {
  const original = process.env[envKey];

  afterEach(() => {
    if (original === undefined) {
      delete process.env[envKey];
    } else {
      process.env[envKey] = original;
    }
  });

  it("returns trimmed URL without trailing slash", () => {
    process.env[envKey] = "  http://127.0.0.1:4000/  ";
    expect(getGraphqlUrl()).toBe("http://127.0.0.1:4000");
  });

  it("throws when env is missing", () => {
    delete process.env[envKey];
    expect(() => getGraphqlUrl()).toThrow(/Missing EXPO_PUBLIC_GRAPHQL_URL/);
  });

  it("throws when env is blank", () => {
    process.env[envKey] = "   ";
    expect(() => getGraphqlUrl()).toThrow(/Missing EXPO_PUBLIC_GRAPHQL_URL/);
  });
});
