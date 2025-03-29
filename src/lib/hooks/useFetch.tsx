'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

async function fetcher(url: string, accessToken: string, init?: RequestInit) {
  if (!init) {
    init = {};
  }
  init.headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  return await (await fetch(url, init)).json();
}

export default function useFetch(url: string, init?: RequestInit) {
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('api/auth/signin');
    },
  });
  console.log('data', data);
  return useSWR(status === 'authenticated' ? url : null, (url) =>
    fetcher(url, data!.user.accessToken, init),
  );
}
