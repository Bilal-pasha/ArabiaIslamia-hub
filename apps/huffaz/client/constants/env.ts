/**
 * Public env-based constants. Pass NEXT_PUBLIC_HUFFAZ_API_URL at build time.
 */
export const HUFFAZ_API_URL =
  process.env.NEXT_PUBLIC_HUFFAZ_API_URL || 'http://localhost:8001';
