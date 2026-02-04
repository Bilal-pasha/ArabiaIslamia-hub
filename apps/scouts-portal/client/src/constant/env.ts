/**
 * Public env-based constants. Pass NEXT_PUBLIC_SCOUTS_API_URL at build time.
 * Used for both client and server (SSR) in axios baseURL.
 */
export const SCOUTS_API_URL =
  process.env.NEXT_PUBLIC_SCOUTS_API_URL || 'http://localhost:8003';
