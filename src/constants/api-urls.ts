export const API_URL = process.env.NEXT_PUBLIC_API_SERVER_URL.endsWith('/')
  ? process.env.NEXT_PUBLIC_API_SERVER_URL.slice(0, -1)
  : process.env.NEXT_PUBLIC_API_SERVER_URL;
export const API_URL_SIGNIN = `${API_URL}/admins/login`;
export const API_URL_REFRESH_ACCESS_TOKEN = `${API_URL}/admins/refresh`;
