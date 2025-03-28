'use client';
import { savingsTypes } from '@/constants/savings';
import SavingCard from '@/components/ui/saving-management/saving-type-card';
import { LuCirclePlus } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

export default function SavingPage() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        className="btn btn-primary card h-full w-full shadow-sm"
        onClick={() => router.push(`/saving-management/new`)}
      >
        <LuCirclePlus size={32} /> New
      </button>
      {savingsTypes.map((item) => (
        <SavingCard
          key={item.name}
          name={item.name}
          interestRate={item.interestRate}
          minDeposit={item.minDeposit}
        />
      ))}
    </div>
  );
}
