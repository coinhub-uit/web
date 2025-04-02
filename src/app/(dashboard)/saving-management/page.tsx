'use client';
import { savingsTypes } from '@/constants/savings';
import SavingCard from '@/components/ui/saving-management/saving-type-card';

export default function SavingPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {savingsTypes.map((item) => (
        <SavingCard
          key={item.name}
          name={item.name}
          interestRate={item.interestRate}
        />
      ))}
    </div>
  );
}
