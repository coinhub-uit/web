'use client';

import SavingCard from '@/components/ui/saving-management/saving-type-card';
import { interestMap } from '@/constants/interestMap';
import { setAvailablePlans } from '@/lib/features/saving/savingSlice';
import { useAppDispatch } from '@/lib/hooks/redux';
import { useAvailablePlans } from '@/lib/hooks/usePlans';
import { useEffect } from 'react';

export default function SavingPage() {
  const { data, error, isLoading } = useAvailablePlans();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setAvailablePlans(data));
    }
  }, [data, dispatch]);

  if (error) return <>Failed to load data.</>;
  if (isLoading) return <>Loading...</>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {data?.map((plan) => {
        const interestInfo = interestMap[plan.days];
        if (!interestInfo) return null;

        return (
          <SavingCard
            key={plan.planId}
            id={plan.planId}
            name={interestInfo.name}
            interestRate={plan.rate}
          />
        );
      })}
    </div>
  );
}
