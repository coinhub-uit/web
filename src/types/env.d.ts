declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_SERVER_URL: string;
  }
}

interface CloudflareEnv {
  NEXT_PUBLIC_API_SERVER_URL: string;
}
