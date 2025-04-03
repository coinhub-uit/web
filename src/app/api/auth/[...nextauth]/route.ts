import { handlers } from '@/lib/auth/next-auth';

export const runtime = 'edge';

export const { GET, POST } = handlers;
