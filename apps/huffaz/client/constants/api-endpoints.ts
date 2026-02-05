/**
 * API endpoints used by services.
 * Services import from here; axios instance is in utils/axios-instance.
 */

export const authEndpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
} as const;
