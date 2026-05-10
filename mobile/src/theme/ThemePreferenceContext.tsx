import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform, useColorScheme } from "react-native";

const STORAGE_KEY = "rolltrack-theme-preference";

export type ThemePreference = "system" | "light" | "dark";

function parsePreference(raw: string | null): ThemePreference | null {
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return null;
}

async function loadStoredPreference(): Promise<ThemePreference | null> {
  try {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      return parsePreference(localStorage.getItem(STORAGE_KEY));
    }
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return parsePreference(raw);
  } catch {
    return null;
  }
}

async function storePreference(p: ThemePreference): Promise<void> {
  try {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, p);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, p);
  } catch {
    /* Native module missing or storage unavailable; in-memory preference still applies */
  }
}

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  resolvedScheme: "light" | "dark";
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("dark");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await loadStoredPreference();
      if (cancelled || stored == null) return;
      setPreferenceState(stored);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    void storePreference(p);
  }, []);

  const resolvedScheme = useMemo((): "light" | "dark" => {
    if (preference === "light" || preference === "dark") return preference;
    return systemScheme === "dark" ? "dark" : "light";
  }, [preference, systemScheme]);

  const value = useMemo(
    () => ({
      preference,
      setPreference,
      resolvedScheme,
    }),
    [preference, resolvedScheme, setPreference],
  );

  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>;
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error("useThemePreference must be used within ThemePreferenceProvider");
  }
  return ctx;
}
