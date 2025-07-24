const ApiUrlEnv = process.env.NEXT_PUBLIC_API_SERVER_URL;

export const API_URL =
  typeof ApiUrlEnv === 'string'
    ? ApiUrlEnv.endsWith('/')
      ? ApiUrlEnv.slice(0, -1)
      : ApiUrlEnv
    : undefined;

export const API_URL_SIGNIN = API_URL ? `${API_URL}/admins/login` : '';
export const API_URL_REFRESH_ACCESS_TOKEN = API_URL
  ? `${API_URL}/admins/refresh`
  : '';
