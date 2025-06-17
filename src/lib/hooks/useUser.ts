import { API_URL } from '@/constants/api-urls';
import useFetch from './useFetch';
import { UserDto } from '@/types/user';
import { useMemo } from 'react';

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

  return useMemo(
    () => ({
      ...raw,
      users: raw.data?.data,
      meta: raw.data?.meta,
      links: raw.data?.links,
    }),
    [raw.data, raw.isLoading, raw.error],
  );
}
