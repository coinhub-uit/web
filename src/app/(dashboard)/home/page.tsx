const HomePage = () => {
  return (
    <div>
      <div className="stats bg-base-100 w-full shadow">
        <div className="stat place-items-center">
          <div className="stat-title">Users</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↗︎ 40 (2% more than last month)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">New Ticket</div>
          <div className="stat-value">5000</div>
          <div className="stat-desc">↗︎ 40 (2% more than last month)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Savings Total</div>
          <div className="stat-value">1.200.000.000 Đ</div>
          <div className="stat-desc">↘︎ 90 (14% less than last month)</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
