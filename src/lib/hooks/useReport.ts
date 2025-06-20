import { API_URL } from '@/constants/api-urls';
import useFetch from './useFetch';
import { useMemo } from 'react';
import { ActivityDto } from '@/types/activity';
import { TicketReportDto } from '@/types/ticketReport';

interface ReportActivityResponse {
  data: ActivityDto[];
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

interface ReportTicketResponse {
  data: TicketReportDto[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPages: number;
    totalPages: number;
    sortBy: [string, string][];
  };
  links: {
    previous?: string;
    current: string;
    next?: string;
  };
}

export function useReportsActivity(params: {
  page?: number;
  limit?: number;
  sortBy?: string[];
  nextUrl?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.sortBy) {
    for (const sort of params.sortBy) {
      query.append('sortBy', sort);
    }
  }

  const url =
    params.nextUrl || `${API_URL}/reports/activity?${query.toString()}`;
  const raw = useFetch<ReportActivityResponse>(url);

  return useMemo(() => {
    return {
      ...raw,
      reports: raw.data?.data,
      meta: raw.data?.meta,
      links: raw.data?.links,
    };
  }, [raw]);
}

export function useReportTicket(params: {
  page?: number;
  limit?: number;
  sortBy?: string[];
  nextUrl?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.sortBy) {
    for (const sort of params.sortBy) {
      query.append('sortBy', sort);
    }
  }

  const url = params.nextUrl || `${API_URL}/reports/ticket?${query.toString()}`;
  const raw = useFetch<ReportTicketResponse>(url);

  return useMemo(() => {
    return {
      ...raw,
      reports: raw.data?.data,
      meta: raw.data?.meta,
      links: raw.data?.links,
    };
  }, [raw]);
}
