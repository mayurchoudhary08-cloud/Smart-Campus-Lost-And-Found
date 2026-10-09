// ============================================================
// Date Formatting Utilities
// ============================================================

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Format an ISO date string into a readable format.
 * E.g., "2026-09-28" → "28 September 2026"
 */
export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return isoDate;
  }
}

/**
 * Format a date for short display.
 * E.g., "2026-09-28" → "28 Sept"
 */
export function formatDateShort(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return `${d.getDate()} ${MONTHS[d.getMonth()].substring(0, 3)}`;
  } catch {
    return isoDate;
  }
}

/**
 * Get relative time string (e.g., "2 days ago", "Just now").
 */
export function timeAgo(isoDatetime: string): string {
  const now = new Date();
  const then = new Date(isoDatetime);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDateShort(isoDatetime);
}

/**
 * Check if a date is within a range.
 */
export function isWithinRange(
  isoDate: string,
  range: 'today' | 'week' | 'month'
): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  switch (range) {
    case 'today':
      return diffDays < 1;
    case 'week':
      return diffDays < 7;
    case 'month':
      return diffDays < 30;
    default:
      return true;
  }
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
