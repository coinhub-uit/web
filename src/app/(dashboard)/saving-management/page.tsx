import { savingsTypes } from '@/constants/savings';
import SavingCard from '@/components/ui/saving-management/saving-type-card';
export default function SavingPage() {
  return (
    <>
      {savingsTypes.map((item) => {
        return (
          <SavingCard
            key={item.name}
            name={item.name}
            interestRate={item.interestRate}
            minDeposit={item.minDeposit}
          />
        );
      })}
    </>
  );
}
