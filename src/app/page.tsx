import { auth } from '@/lib/auth/next-auth';

export default async function Page() {
  const session = await auth();
  console.log(session);
  return <div>HomePage</div>;
}
