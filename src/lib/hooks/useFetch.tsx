'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useMemo } from 'react';

async function fetcher<T>(
  url: string,
  accessToken: string,
  init?: RequestInit,
): Promise<T> {
  if (!init) init = {};
  init.headers = {
    Authorization: `Bearer ${accessToken}`,
    ...(init.headers || {}),
  };

  const response = await fetch(url, init);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export default function useFetch<T>(url: string, init?: RequestInit) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('api/auth/signin');
    },
  });

  const shouldFetch = status === 'authenticated' && session?.user?.accessToken;
  const swr = useSWR<T>(shouldFetch ? url : null, (url) =>
    fetcher<T>(url, session!.user.accessToken, init),
  );

  return useMemo(
    () => ({
      ...swr,
      isLoading: swr.isLoading ?? status !== 'authenticated',
    }),
    [swr.data, swr.error, swr.isLoading, status],
  );
}
