/**
 * Public env-based constants. Pass NEXT_PUBLIC_SECONDARY_API_URL at build time.
 */
export const SECONDARY_API_URL =
  process.env.NEXT_PUBLIC_SECONDARY_API_URL || 'http://localhost:8002';
