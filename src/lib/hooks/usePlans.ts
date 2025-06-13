import { API_URL } from '@/constants/api-urls';
import useFetch from './useFetch';
import type { PlanDto } from '@/types/plans';

export default function usePlans() {
  return useFetch<PlanDto[]>(`${API_URL}/plans`);
}
