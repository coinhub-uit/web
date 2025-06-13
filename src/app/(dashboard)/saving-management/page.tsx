'use client';

import SavingCard from '@/components/ui/saving-management/saving-type-card';
import usePlans from '@/lib/hooks/usePlans';

const interestMap: Record<number, { name: string; interestRate: number }> = {
  [-1]: { name: 'Không kỳ hạn', interestRate: 1.2 },
  [30]: { name: '1 tháng', interestRate: 3.5 },
  [90]: { name: '3 tháng', interestRate: 4.2 },
  [180]: { name: '6 tháng', interestRate: 5.0 },
};

export default function SavingPage() {
  const { data, error, isLoading } = usePlans();

  if (error) return <>Đã xảy ra lỗi khi tải dữ liệu.</>;
  if (isLoading) return <>Đang tải...</>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {data?.map((plan) => {
        const interestInfo = interestMap[plan.days];
        if (!interestInfo) return null;

        return (
          <SavingCard
            key={plan.id}
            name={interestInfo.name}
            interestRate={interestInfo.interestRate}
          />
        );
      })}
    </div>
  );
}
