import { API_URL } from '@/constants/api-urls';
import useFetch from './useFetch';
import type { PlanAvailableDto, PlanDto } from '@/types/plans';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

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

export function useUpdatePlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const updatePlan = async (planId: number, rate: number) => {
    if (status !== 'authenticated' || !session?.user?.accessToken) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/plans/histories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ planId, rate }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to update plan: ${res.status} ${errText}`);
      }

      return await res.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePlan, loading, error };
}
