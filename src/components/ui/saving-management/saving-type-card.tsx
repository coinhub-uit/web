interface SavingCardProps {
  name: string;
  interestRate: number;
  minDeposit: number;
}

const SavingCard = ({ name, interestRate, minDeposit }: SavingCardProps) => {
  return (
    <div>
      <div className="card bg-base-100 mb-5 w-full shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <span className="text-base-content">
            Interest rate: {interestRate}% per year
          </span>
          <span className="text-base-content">
            Minimum deposit: {minDeposit} VND
          </span>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingCard;
