export const SECONDARY_APP_URL = process.env.NEXT_PUBLIC_SECONDARY_APP_URL || '#';
export const HUFFAZ_APP_URL = process.env.NEXT_PUBLIC_HUFFAZ_APP_URL || '#';
export const SCOUTS_APP_URL = process.env.NEXT_PUBLIC_SCOUTS_APP_URL || '#';

/** API base URL for main-website (forms, etc.). Pass NEXT_PUBLIC_MAIN_WEBSITE_API_URL at build time. */
export const MAIN_WEBSITE_API_URL =
  process.env.NEXT_PUBLIC_MAIN_WEBSITE_API_URL || 'http://localhost:8000';