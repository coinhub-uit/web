'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useReportsActivity } from '@/lib/hooks/useReport';
import { ActivityDto } from '@/types/activity';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type ViewMode = 'day' | 'month' | 'year';

interface AggregatedData {
  labels: string[];
  users: number[];
  tickets: number[];
  totalPrincipal: number[];
}

const AnalyticsPage = () => {
  const [allData, setAllData] = useState<ActivityDto[]>([]);
  const [nextUrl, setNextUrl] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const {
    reports: pageReports,
    links,
    error: fetchError,
    isLoading,
  } = useReportsActivity({
    limit: 100,
    sortBy: ['date:ASC'],
    nextUrl,
  });

  const appendReports = useCallback((newReports: ActivityDto[] | undefined) => {
    if (!newReports || newReports.length === 0) return;

    const validReports = newReports.filter((report) => {
      if (!report.date || isNaN(Date.parse(report.date))) return false;
      if (
        typeof report.users !== 'number' ||
        typeof report.tickets !== 'number'
      )
        return false;
      const principal = parseFloat(report.totalPrincipal);
      return !isNaN(principal);
    });

    if (validReports.length === 0) return;

    setAllData((prev) => {
      const uniqueReports = validReports.filter(
        (report) => !prev.some((existing) => existing.date === report.date),
      );
      return [...prev, ...uniqueReports];
    });
  }, []);

  useEffect(() => {
    if (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Failed to fetch data',
      );
      setIsFetching(false);
      return;
    }
    if (isLoading) {
      setIsFetching(true);
      return;
    }
    if (pageReports) {
      appendReports(pageReports);
      if (links?.next) {
        setNextUrl(links.next);
      } else {
        setIsFetching(false);
      }
    }
  }, [pageReports, links, fetchError, isLoading, appendReports]);

  const aggregateData = useCallback(
    (data: ActivityDto[]): AggregatedData => {
      const aggregated: {
        [key: string]: {
          users: number;
          tickets: number;
          totalPrincipal: number;
        };
      } = {};

      data.forEach((item) => {
        const date = new Date(item.date);
        if (isNaN(date.getTime())) return;

        let key: string;
        if (viewMode === 'day') {
          key = `${date.getDate().toString().padStart(2, '0')}-${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}-${date.getFullYear()}`;
        } else if (viewMode === 'month') {
          key = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        } else {
          key = date.getFullYear().toString();
        }

        if (!aggregated[key]) {
          aggregated[key] = { users: 0, tickets: 0, totalPrincipal: 0 };
        }

        aggregated[key].users += item.users;
        aggregated[key].tickets += item.tickets;
        aggregated[key].totalPrincipal += parseFloat(item.totalPrincipal);
      });

      const labels = Object.keys(aggregated).sort((a, b) => {
        if (viewMode === 'day') {
          const [dayA, monthA, yearA] = a.split('/').map(Number);
          const [dayB, monthB, yearB] = b.split('/').map(Number);
          return (
            new Date(yearA, monthA - 1, dayA).getTime() -
            new Date(yearB, monthB - 1, dayB).getTime()
          );
        } else if (viewMode === 'month') {
          const [monthA, yearA] = a.split('/').map(Number);
          const [monthB, yearB] = b.split('/').map(Number);
          return (
            new Date(yearA, monthA - 1).getTime() -
            new Date(yearB, monthB - 1).getTime()
          );
        }
        return a.localeCompare(b);
      });

      const users = labels.map((label) => aggregated[label].users);
      const tickets = labels.map((label) => aggregated[label].tickets);
      const totalPrincipal = labels.map(
        (label) => aggregated[label].totalPrincipal,
      );

      return { labels, users, tickets, totalPrincipal };
    },
    [viewMode],
  );

  const aggregatedData = useMemo(
    () => aggregateData(allData),
    [aggregateData, allData],
  );

  const getChartData = useCallback(
    (data: number[], label: string, color: string, labels: string[]) => ({
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.2)'),
          fill: true,
        },
      ],
    }),
    [],
  );

  if (isFetching && !allData.length)
    return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!allData.length && !isFetching)
    return <div className="p-4 text-center">No data available</div>;

  const usersChartData = getChartData(
    aggregatedData.users,
    'Users',
    'rgba(75, 192, 192, 1)',
    aggregatedData.labels,
  );
  const ticketsChartData = getChartData(
    aggregatedData.tickets,
    'Tickets',
    'rgba(255, 99, 132, 1)',
    aggregatedData.labels,
  );
  const totalPrincipalChartData = getChartData(
    aggregatedData.totalPrincipal,
    'Total Principal',
    'rgba(54, 162, 235, 1)',
    aggregatedData.labels,
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: '' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-end">
        <select
          className="select select-bordered"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
        >
          <option value="day">By Day</option>
          <option value="month">By Month</option>
          <option value="year">By Year</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card bg-base-100 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Users Over Time</h2>
          <Line
            data={usersChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { ...chartOptions.plugins.title, text: 'Users' },
              },
            }}
          />
        </div>
        <div className="card bg-base-100 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Tickets Over Time</h2>
          <Line
            data={ticketsChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { ...chartOptions.plugins.title, text: 'Tickets' },
              },
            }}
          />
        </div>
        <div className="card bg-base-100 p-4 shadow-md lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">
            Total Principal Over Time
          </h2>
          <Line
            data={totalPrincipalChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'Total Principal',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
