import { getGraphqlUrl } from "./config";

describe("getGraphqlUrl", () => {
  const original = process.env.EXPO_PUBLIC_GRAPHQL_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.EXPO_PUBLIC_GRAPHQL_URL;
    } else {
      process.env.EXPO_PUBLIC_GRAPHQL_URL = original;
    }
  });

  it("returns trimmed URL without trailing slash", () => {
    process.env.EXPO_PUBLIC_GRAPHQL_URL = "  http://127.0.0.1:4000/  ";
    expect(getGraphqlUrl()).toBe("http://127.0.0.1:4000");
  });

  it("throws when env is missing", () => {
    delete process.env.EXPO_PUBLIC_GRAPHQL_URL;
    expect(() => getGraphqlUrl()).toThrow(/Missing EXPO_PUBLIC_GRAPHQL_URL/);
  });

  it("throws when env is blank", () => {
    process.env.EXPO_PUBLIC_GRAPHQL_URL = "   ";
    expect(() => getGraphqlUrl()).toThrow(/Missing EXPO_PUBLIC_GRAPHQL_URL/);
  });
});
