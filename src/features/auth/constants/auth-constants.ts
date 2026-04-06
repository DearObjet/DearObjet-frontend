export const AUTH_ENDPOINTS = {
  GET_CURRENT_USER: '/users/me',
  REFRESH_TOKEN: '/auth/token/refresh',
  LOGOUT: '/auth/logout',
} as const;
