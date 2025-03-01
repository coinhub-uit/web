'use client';

import useSWR from 'swr';
import { useAppSelector } from '@/lib/hooks/redux';
import { RootState } from '@/lib/store';

async function fetcher(
  url: string,
  adminToken: string | null,
  init?: RequestInit,
): Promise<Response> {
  if (adminToken !== null) {
    if (init === undefined) {
      init = {};
    }
    init.headers = {
      Authorization: `Bearer ${adminToken}`,
    };
  }
  const response = await fetch(url, init);
  return response;
}

export default function useSwrWithJwt(url: string, init?: RequestInit) {
  const adminToken: string | null = useAppSelector(
    (state: RootState) => state.admin.token,
  );
  return useSWR(url, (url) => fetcher(url, adminToken, init));
}
