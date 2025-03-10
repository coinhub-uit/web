'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

async function fetcher(
  url: string,
  session: Session, // TODO: use the type of session
  init?: RequestInit,
): Promise<Response> {
  if (session !== null) {
    if (init === undefined) {
      init = {};
    }
    init.headers = {
      Authorization: `Bearer ${session}`,
    };
  }
  const response = await fetch(url, init);
  if (response.status === 401) {
    // TODO: check if access token is not expired, try to get new access token
    // if access token is expired too, then redirect
    redirect('/api/auth/signin');
  }
  return response;
}

export default function useSwrWithJwt(url: string, init?: RequestInit) {
  const { data } = useSession();
  if (data === null) {
    redirect('/api/auth/signin');
  }
  return useSWR(url, (url) => fetcher(url, data, init));
}
