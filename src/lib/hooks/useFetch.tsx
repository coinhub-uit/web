'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { API_URL } from '@/constants/api-urls';

async function fetcher(
  url: string,
  accessToken: string,
  init?: RequestInit,
): Promise<Response> {
  if (!init) {
    init = {};
  }
  init.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Access-Control-Allow-Origin': API_URL,
  };
  return await fetch(url, init);
}

export default function useFetch(url: string, init?: RequestInit) {
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('api/auth/signin');
    },
  });
  return useSWR(url, (url) => fetcher(url, data!.user.accessToken, init));
}
