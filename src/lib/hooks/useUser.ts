import { API_URL } from '@/constants/api-urls';
import useFetch from './useFetch';
import { UserDto } from '@/types/user';
import { useMemo } from 'react';
import { TicketDto } from '@/types/ticket';
import { SourceDto } from '@/types/source';

interface UserListResponse {
  data: UserDto[];
  meta: {
    itemsPerPage: number;
    sortBy: [string, string][];
  };
  links: {
    previous?: string;
    current: string;
    next?: string;
  };
}

export type UseUserTicketsResponse = {
  tickets: TicketDto[] | undefined;
  isLoading: boolean;
  data: TicketDto[] | undefined;
  error: unknown;
  mutate: unknown;
  isValidating: boolean;
};

export type UseUserSourcesResponse = {
  sources: SourceDto[] | undefined;
  isLoading: boolean;
  data: SourceDto[] | undefined;
  error: unknown;
  mutate: unknown;
  isValidating: boolean;
};

export function useUsers(params: {
  page?: number;
  limit?: number;
  sortBy?: string[];
  nextUrl?: string;
}) {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.sortBy) {
    for (const sort of params.sortBy) {
      query.append('sortBy', sort);
    }
  }

  const url = params.nextUrl || `${API_URL}/users?${query.toString()}`;
  const raw = useFetch<UserListResponse>(url);

  return useMemo(() => {
    return {
      ...raw,
      users: raw.data?.data,
      meta: raw.data?.meta,
      links: raw.data?.links,
    };
  }, [raw]);
}

export function useUser(id: string) {
  const url = `${API_URL}/users/${id}`;
  const raw = useFetch<UserDto>(url);

  return useMemo(() => {
    return {
      ...raw,
      user: raw.data,
    };
  }, [raw]);
}

export function useUserTickets(id: string): UseUserTicketsResponse {
  const url = `${API_URL}/users/${id}/tickets`;
  const raw = useFetch<TicketDto[]>(url);

  return useMemo(() => {
    return {
      ...raw,
      tickets: raw.data,
    };
  }, [raw]);
}

export function useUserSources(id: string): UseUserSourcesResponse {
  const url = `${API_URL}/users/${id}/sources`;
  const raw = useFetch<SourceDto[]>(url);

  return useMemo(() => {
    return {
      ...raw,
      sources: raw.data,
    };
  }, [raw]);
}
