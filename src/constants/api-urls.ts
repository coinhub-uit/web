export const API_URL = process.env.API_SERVER_URL.endsWith('/')
  ? process.env.API_SERVER_URL.slice(0, -1)
  : process.env.API_SERVER_URL;
export const API_URL_SIGNIN = `${API_URL}/admins/login`;
export const API_URL_REFRESH_ACCESS_TOKEN = `${API_URL}/admins/refresh`;
