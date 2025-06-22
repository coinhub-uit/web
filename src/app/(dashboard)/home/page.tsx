'use client';

import { useState, useEffect, useMemo } from 'react';
import { UserDto } from '@/types/user';
import { useReportTicket, useRevenueTicket } from '@/lib/hooks/useReport';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { TicketReportDto } from '@/types/ticketReport';
import { RevenueReportDto } from '@/types/revenue';
import { useUsers } from '@/lib/hooks/useUser';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const HomePage = () => {
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [allRevenueData, setAllRevenueData] = useState<RevenueReportDto[]>([]);
  const [allTicketData, setAllTicketData] = useState<TicketReportDto[]>([]);
  const [nextUserUrl, setNextUserUrl] = useState<string | undefined>(undefined);
  const [nextRevenueUrl, setNextRevenueUrl] = useState<string | undefined>(
    undefined,
  );
  const [nextTicketUrl, setNextTicketUrl] = useState<string | undefined>(
    undefined,
  );
  const [isFetching, setIsFetching] = useState(false);

  const {
    users,
    links: userLinks,
    isLoading: userIsLoading,
    error: userError,
  } = useUsers({
    limit: 100,
    sortBy: ['createdAt:ASC'],
    nextUrl: nextUserUrl,
  });

  const {
    reports: revenueReports,
    links: revenueLinks,
    isLoading: revenueIsLoading,
    error: revenueError,
  } = useRevenueTicket({
    limit: 100,
    sortBy: ['date:ASC'],
    nextUrl: nextRevenueUrl,
  });

  const {
    reports: ticketReports,
    links: ticketLinks,
    isLoading: ticketIsLoading,
    error: ticketError,
  } = useReportTicket({
    limit: 100,
    sortBy: ['date:ASC'],
    nextUrl: nextTicketUrl,
  });

  useEffect(() => {
    if (!userIsLoading && !userError && users?.length) {
      setAllUsers((prev) => {
        const unique = users.filter(
          (u) => !prev.some((existing) => existing.id === u.id),
        );
        return [...prev, ...unique];
      });
      setNextUserUrl(userLinks?.next);
    }
  }, [users, userIsLoading, userError, userLinks]);

  useEffect(() => {
    if (!revenueIsLoading && !revenueError && revenueReports?.length) {
      setAllRevenueData((prev) => {
        const unique = revenueReports.filter(
          (r) => !prev.some((existing) => existing.date === r.date),
        );
        return [...prev, ...unique];
      });
      setNextRevenueUrl(revenueLinks?.next);
    }
  }, [revenueReports, revenueIsLoading, revenueError, revenueLinks]);

  useEffect(() => {
    if (!ticketIsLoading && !ticketError && ticketReports?.length) {
      setAllTicketData((prev) => {
        const unique = ticketReports.filter(
          (r) => !prev.some((existing) => existing.date === r.date),
        );
        return [...prev, ...unique];
      });
      setNextTicketUrl(ticketLinks?.next);
    }
  }, [ticketReports, ticketIsLoading, ticketError, ticketLinks]);

  useEffect(() => {
    const isAnyLoading = userIsLoading || revenueIsLoading || ticketIsLoading;
    const hasNext = nextUserUrl || nextRevenueUrl || nextTicketUrl;
    setIsFetching(isAnyLoading || !!hasNext);
  }, [
    userIsLoading,
    revenueIsLoading,
    ticketIsLoading,
    nextUserUrl,
    nextRevenueUrl,
    nextTicketUrl,
  ]);

  const { totalUsers, growthCount, growthPercentage, newUsersThisMonth } =
    useMemo(() => {
      const now = new Date('2025-06-21T03:50:00+07:00');
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const currentTotalUsers = allUsers.filter((user) => {
        const createdAt = new Date(user.createdAt);
        return createdAt <= now;
      }).length;

      const prevTotalUsers = allUsers.filter((user) => {
        const createdAt = new Date(user.createdAt);
        const lastDayOfPrevMonth = new Date(prevYear, prevMonth + 1, 0);
        return createdAt <= lastDayOfPrevMonth;
      }).length;

      const newUsersThisMonth = allUsers.filter((user) => {
        const createdAt = new Date(user.createdAt);
        return (
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        );
      }).length;

      const growthCount = currentTotalUsers - prevTotalUsers;
      const growthPercentage =
        prevTotalUsers > 0
          ? ((growthCount / prevTotalUsers) * 100).toFixed(1)
          : prevTotalUsers === 0 && currentTotalUsers > 0
            ? 'N/A'
            : prevTotalUsers === 0 && currentTotalUsers === 0
              ? '0'
              : 'N/A';

      return {
        totalUsers: currentTotalUsers,
        growthCount,
        growthPercentage,
        newUsersThisMonth,
      };
    }, [allUsers]);

  const revenueChartData = useMemo(() => {
    const now = new Date('2025-06-21T03:50:00+07:00');
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    const filteredRevenueData = allRevenueData.filter((report) => {
      const reportDate = new Date(report.date);
      return reportDate >= sixMonthsAgo && reportDate <= now;
    });

    const monthlyData = filteredRevenueData.reduce(
      (acc, report) => {
        const reportDate = new Date(report.date);
        const monthYear = reportDate.toLocaleString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        if (!acc[monthYear]) {
          acc[monthYear] = { income: 0, expense: 0, count: 0 };
        }
        acc[monthYear].income += parseFloat(report.income.toString());
        acc[monthYear].expense += parseFloat(report.expense.toString());
        acc[monthYear].count += 1;
        return acc;
      },
      {} as Record<string, { income: number; expense: number; count: number }>,
    );

    const labels = Object.keys(monthlyData).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
    const incomeData = labels.map(
      (month) => monthlyData[month].income / (monthlyData[month].count ?? 1),
    );
    const expenseData = labels.map(
      (month) => monthlyData[month].expense / (monthlyData[month].count ?? 1),
    );

    return {
      income: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
        ],
      },
      expense: {
        labels,
        datasets: [
          {
            label: 'Expense',
            data: expenseData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
          },
        ],
      },
    };
  }, [allRevenueData]);

  const ticketChartData = useMemo(() => {
    const now = new Date('2025-06-21T03:50:00+07:00');
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const openedCounts = allTicketData.reduce(
      (acc, report) => {
        const createdAt = new Date(report.date);
        if (
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        ) {
          const term = report.days;
          const termLabel =
            term === -1
              ? 'No Term'
              : `${term / 30} Month${term / 30 > 1 ? 's' : ''}`;
          acc[termLabel] = (acc[termLabel] ?? 0) + report.openedCount;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const labels = Object.keys(openedCounts);
    const data = Object.values(openedCounts);
    const totalOpened = data.reduce((sum, count) => sum + count, 0);
    const normalizedData =
      totalOpened > 0 ? data.map((count) => (count / totalOpened) * 100) : data;

    return {
      labels,
      datasets: [
        {
          data: normalizedData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverOffset: 4,
        },
      ],
    };
  }, [allTicketData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: '' },
    },
    scales: { y: { beginAtZero: true } },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Opened Tickets Distribution This Month' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
  };

  if (
    isFetching &&
    allUsers.length === 0 &&
    allRevenueData.length === 0 &&
    allTicketData.length === 0
  ) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (userError || revenueError || ticketError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error:{' '}
        {(userError ?? revenueError ?? ticketError) instanceof Error
          ? (userError ?? revenueError ?? ticketError).message
          : 'Failed to fetch data'}
      </div>
    );
  }

  return (
    <div>
      <div className="stats bg-base-100 mb-6 w-full shadow">
        <div className="stat place-items-center">
          <div className="stat-title">Users</div>
          <div className="stat-value">{totalUsers.toLocaleString('en-US')}</div>
          <div className="stat-desc">
            {growthCount >= 0 ? '↗︎' : '↘︎'} {Math.abs(growthCount)} (
            {growthPercentage !== 'N/A' ? `${growthPercentage}%` : 'N/A'}{' '}
            compared to last month)
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">New User This Month</div>
          <div className="stat-value">
            {newUsersThisMonth.toLocaleString('en-US')}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
        <div>
          <div className="grid grid-cols-1 gap-6">
            <div className="card bg-base-100 p-4 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">
                Income Past 6 Months
              </h2>
              <Line
                data={revenueChartData.income}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: 'Income' },
                  },
                }}
              />
            </div>
            <div className="card bg-base-100 p-4 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">
                Expense Past 6 Months
              </h2>
              <Line
                data={revenueChartData.expense}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: 'Expense' },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            Opened Tickets Distribution This Month
          </h2>
          <Pie data={ticketChartData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
