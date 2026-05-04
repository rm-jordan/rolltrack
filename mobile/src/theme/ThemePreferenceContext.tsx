import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

const STORAGE_KEY = "rolltrack-theme-preference";

export type ThemePreference = "system" | "light" | "dark";

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  resolvedScheme: "light" | "dark";
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw === "light" || raw === "dark" || raw === "system") {
          setPreferenceState(raw);
        }
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    void AsyncStorage.setItem(STORAGE_KEY, p);
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
