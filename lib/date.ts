/** Local calendar date YYYY-MM-DD (avoids UTC day-shift from toISOString). */
export function localTodayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Display an ISO date string for lists (e.g. "Mar 30, 2026"). */
export function formatLogDate(isoDate: string): string {
  const [y, mo, da] = isoDate.split("-").map(Number);
  if (!y || !mo || !da) return isoDate;
  const d = new Date(y, mo - 1, da);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
