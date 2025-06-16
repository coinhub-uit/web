import { API_URL } from '@/constants/api-urls';
import useFetch from './useFetch';
import type { PlanAvailableDto, PlanDto } from '@/types/plans';

export function usePlans() {
  return useFetch<PlanDto[]>(`${API_URL}/plans`);
}

export function useAvailablePlans() {
  const raw = useFetch<(Omit<PlanAvailableDto, 'rate'> & { rate: string })[]>(
    `${API_URL}/plans/available-plans`,
  );

  const parsedData = raw.data?.map((item) => ({
    ...item,
    rate: parseFloat(item.rate),
  }));

  return {
    ...raw,
    data: parsedData,
  };
}

export function useGetPlan(id: number) {
  return useFetch<PlanDto>(`${API_URL}/plans/${id}`);
}
