import { API_URL } from '@/constants/api-urls';
import useFetch from '@/lib/hooks/useFetch';
import { SettingDto } from '@/types/setting';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function useGetSetting() {
  return useFetch<SettingDto>(`${API_URL}/setting`);
}

export function useUpdateSetting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const updateSetting = async (minAmountOpenTicket: string) => {
    if (status !== 'authenticated' || !session?.user?.accessToken) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/setting`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ minAmountOpenTicket }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to update setting: ${res.status} ${errText}`);
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

  return { updateSetting, loading, error };
}
