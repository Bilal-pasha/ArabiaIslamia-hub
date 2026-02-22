/**
 * API endpoints for the library app.
 * - PUBLIC: No auth required (e.g. login)
 * - PRIVATE: Require authenticated session
 */

export const publicEndpoints = {
  auth: {
    login: '/api/auth/login',
  },
} as const;

export const privateEndpoints = {
  auth: {
    me: '/api/auth/me',
    logout: '/api/auth/logout',
  },
  books: {
    list: '/api/books',
    byId: (id: string) => `/api/books/${id}`,
  },
  bookAuthors: {
    list: '/api/book-authors',
    byId: (id: string) => `/api/book-authors/${id}`,
  },
  bookCategories: {
    list: '/api/book-categories',
    byId: (id: string) => `/api/book-categories/${id}`,
  },
  bookNashirs: {
    list: '/api/book-nashirs',
    byId: (id: string) => `/api/book-nashirs/${id}`,
  },
  bookIssues: {
    list: '/api/book-issues',
    byId: (id: string) => `/api/book-issues/${id}`,
    return: (id: string) => `/api/book-issues/${id}/return`,
  },
  backup: {
    run: '/api/backup/run',
  },
} as const;
