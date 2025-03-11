import { auth } from '@/lib/auth/next-auth';

export default async function Page() {
  const session = await auth();
  return <div>HomePage</div>;
}
