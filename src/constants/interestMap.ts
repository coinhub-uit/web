export const interestMap: Record<
  number,
  { name: string; interestRate: number }
> = {
  [-1]: { name: 'Demand deposit', interestRate: 1.2 },
  [30]: { name: '1 month', interestRate: 3.5 },
  [90]: { name: '3 months', interestRate: 4.2 },
  [180]: { name: '6 months', interestRate: 5.0 },
};
