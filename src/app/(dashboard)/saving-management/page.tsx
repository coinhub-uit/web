'use client';

import SavingCard from '@/components/ui/saving-management/saving-type-card';
import { interestMap } from '@/constants/interestMap';
import { useAvailablePlans } from '@/lib/hooks/usePlans';
import { useGetSetting, useUpdateSetting } from '@/lib/hooks/useSetting';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function SavingPage() {
  const {
    data: plans,
    error: plansError,
    isLoading: plansLoading,
  } = useAvailablePlans();
  const {
    data: setting,
    error: settingError,
    isLoading: settingLoading,
  } = useGetSetting();
  const {
    updateSetting,
    loading: updateLoading,
    error: updateError,
  } = useUpdateSetting();
  const [minAmount, setMinAmount] = useState<string>('');

  useEffect(() => {
    if (setting?.minAmountOpenTicket) {
      setMinAmount(setting.minAmountOpenTicket);
    }
  }, [setting]);

  const handleSave = async () => {
    try {
      await updateSetting(minAmount);
      toast.success('Saved successfully!');
    } catch (err) {
      console.error('Failed to update setting:', err);
    }
  };

  if (plansError || settingError) return <>Failed to load data.</>;
  if (plansLoading || settingLoading) return <>Loading...</>;

  return (
    <div className="p-3">
      <div className="card bg-base-100 mb-4 w-full shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Min Amount to Open Ticket</h2>
          <div className="form-control mb-2 w-full">
            <label htmlFor="min-amount" className="label mb-1">
              <span className="label-text">Minimum Amount</span>
            </label>
            <label className="input input-bordered flex w-full items-center gap-2">
              <input
                id="min-amount"
                type="number"
                step="10000"
                className="grow"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
              VNĐ
            </label>
          </div>
          {updateError && <p className="text-error mb-4">{updateError}</p>}
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={updateLoading}
            >
              {updateLoading ? 'Saving...' : 'Save change'}
            </button>
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Plan Management</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {plans?.map((plan) => {
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
      <ToastContainer />
    </div>
  );
}
