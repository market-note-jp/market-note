export const FEED_URL: string;
export function latestClosedSession(calendar: {years: number[]; closedDates: string[]}, now?: Date): string | null;
export function validateFeed(value: unknown, saved: unknown, now?: Date, diagnose?: (stage: string) => void): boolean;
