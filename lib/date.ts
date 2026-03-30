/** Local calendar date YYYY-MM-DD (avoids UTC day-shift from toISOString). */
export function localTodayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** e.g. "Mon, Mar 30" for greeting line */
export function formatTodayGreeting(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** e.g. "Mar 30" for plan cards */
export function formatMonthDay(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type WeekStripDay = {
  day: string;
  date: number;
  iso: string;
  active: boolean;
};

/** Sun–Sat strip for the week containing today (matches common calendar mockups). */
export function getWeekStripSundayStart(): WeekStripDay[] {
  const now = new Date();
  const todayIso = localTodayIso();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const strip: WeekStripDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    strip.push({
      day: labels[d.getDay()],
      date: d.getDate(),
      iso,
      active: iso === todayIso,
    });
  }

  return strip;
}
