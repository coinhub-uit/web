'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useReportsActivity,
  useReportTicket,
  useRevenueTicket,
} from '@/lib/hooks/useReport';
import { ActivityDto } from '@/types/activity';
import { TicketReportDto } from '@/types/ticketReport';
import { RevenueReportDto } from '@/types/revenue';
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
import * as XLSX from 'xlsx';

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
type TabType =
  | 'analytics'
  | 'activityReport'
  | 'ticketReport'
  | 'revenueReport';

interface AggregatedData {
  labels: string[];
  users: number[];
  tickets: number[];
  totalPrincipal: number[];
}

interface MonthlyActivityReport {
  month: string;
  users: number;
  tickets: number;
  totalPrincipal: number;
}

interface TermReport {
  termType: string;
  openedCount: number;
  closedCount: number;
}

interface RevenueTermReport {
  termType: string;
  income: number;
  expense: number;
  netIncome: number;
}

const AnalyticsPage = () => {
  const [allActivityData, setAllActivityData] = useState<ActivityDto[]>([]);
  const [allTicketData, setAllTicketData] = useState<TicketReportDto[]>([]);
  const [allRevenueData, setAllRevenueData] = useState<RevenueReportDto[]>([]);
  const [activityNextUrl, setActivityNextUrl] = useState<string | undefined>(
    undefined,
  );
  const [ticketNextUrl, setTicketNextUrl] = useState<string | undefined>(
    undefined,
  );
  const [revenueNextUrl, setRevenueNextUrl] = useState<string | undefined>(
    undefined,
  );
  const [isFetchingActivity, setIsFetchingActivity] = useState(false);
  const [isFetchingTickets, setIsFetchingTickets] = useState(false);
  const [isFetchingRevenue, setIsFetchingRevenue] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const {
    reports: activityReports,
    links: activityLinks,
    error: activityFetchError,
    isLoading: activityIsLoading,
  } = useReportsActivity({
    limit: 100,
    sortBy: ['date:ASC'],
    nextUrl: activityNextUrl,
  });

  const {
    reports: ticketReports,
    links: ticketLinks,
    error: ticketFetchError,
    isLoading: ticketIsLoading,
  } = useReportTicket({
    limit: 100,
    sortBy: ['date:ASC'],
    nextUrl: ticketNextUrl,
  });

  const {
    reports: revenueReports,
    links: revenueLinks,
    error: revenueFetchError,
    isLoading: revenueIsLoading,
  } = useRevenueTicket({
    limit: 100,
    sortBy: ['date:ASC'],
    nextUrl: revenueNextUrl,
  });

  const appendActivityReports = useCallback(
    (newReports: ActivityDto[] | undefined) => {
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

      setAllActivityData((prev) => {
        const uniqueReports = validReports.filter(
          (report) => !prev.some((existing) => existing.date === report.date),
        );
        return [...prev, ...uniqueReports];
      });
    },
    [],
  );

  const appendTicketReports = useCallback(
    (newReports: TicketReportDto[] | undefined) => {
      if (!newReports || newReports.length === 0) return;

      const validReports = newReports.filter((report) => {
        if (!report.date || isNaN(Date.parse(report.date))) return false;
        if (
          typeof report.openedCount !== 'number' ||
          typeof report.closedCount !== 'number'
        )
          return false;
        return true;
      });

      if (validReports.length === 0) return;

      setAllTicketData((prev) => {
        const uniqueReports = validReports.filter(
          (report) =>
            !prev.some(
              (existing) =>
                existing.date === report.date && existing.days === report.days,
            ),
        );
        return [...prev, ...uniqueReports];
      });
    },
    [],
  );

  const appendRevenueReports = useCallback(
    (newReports: RevenueReportDto[] | undefined) => {
      if (!newReports || newReports.length === 0) return;

      const validReports = newReports.filter((report) => {
        if (!report.date || isNaN(Date.parse(report.date))) return false;
        if (
          typeof report.income !== 'string' ||
          typeof report.expense !== 'string' ||
          typeof report.netIncome !== 'string'
        )
          return false;
        const income = parseFloat(report.income);
        const expense = parseFloat(report.expense);
        const netIncome = parseFloat(report.netIncome);
        return !isNaN(income) && !isNaN(expense) && !isNaN(netIncome);
      });

      if (validReports.length === 0) return;

      setAllRevenueData((prev) => {
        const uniqueReports = validReports.filter(
          (report) =>
            !prev.some(
              (existing) =>
                existing.date === report.date && existing.days === report.days,
            ),
        );
        return [...prev, ...uniqueReports];
      });
    },
    [],
  );

  useEffect(() => {
    if (activityFetchError || ticketFetchError || revenueFetchError) {
      setError(
        activityFetchError instanceof Error
          ? activityFetchError.message
          : ticketFetchError instanceof Error
            ? ticketFetchError.message
            : revenueFetchError instanceof Error
              ? revenueFetchError.message
              : 'Failed to fetch data',
      );
      setIsFetchingActivity(false);
      setIsFetchingTickets(false);
      setIsFetchingRevenue(false);
      return;
    }
    if (activityIsLoading) {
      setIsFetchingActivity(true);
    } else if (activityReports) {
      appendActivityReports(activityReports);
      if (activityLinks?.next) {
        setActivityNextUrl(activityLinks.next);
      } else {
        setIsFetchingActivity(false);
      }
    }
    if (ticketIsLoading) {
      setIsFetchingTickets(true);
    } else if (ticketReports) {
      appendTicketReports(ticketReports);
      if (ticketLinks?.next) {
        setTicketNextUrl(ticketLinks.next);
      } else {
        setIsFetchingTickets(false);
      }
    }
    if (revenueIsLoading) {
      setIsFetchingRevenue(true);
    } else if (revenueReports) {
      appendRevenueReports(revenueReports);
      if (revenueLinks?.next) {
        setRevenueNextUrl(revenueLinks.next);
      } else {
        setIsFetchingRevenue(false);
      }
    }
  }, [
    activityReports,
    activityLinks,
    activityFetchError,
    activityIsLoading,
    ticketReports,
    ticketLinks,
    ticketFetchError,
    ticketIsLoading,
    revenueReports,
    revenueLinks,
    revenueFetchError,
    revenueIsLoading,
    appendActivityReports,
    appendTicketReports,
    appendRevenueReports,
  ]);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    const datasets = [allTicketData, allRevenueData];
    datasets.forEach((data) => {
      data.forEach((item) => {
        const date = new Date(item.date);
        if (!isNaN(date.getTime())) {
          years.add(date.getFullYear().toString());
        }
      });
    });
    return Array.from(years).sort((a, b) => Number(a) - Number(b));
  }, [allTicketData, allRevenueData]);

  const availableMonths = useMemo(() => {
    const months = [
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' },
    ];
    return months.filter((month) =>
      allRevenueData.some((item) => {
        const date = new Date(item.date);
        return (
          !isNaN(date.getTime()) &&
          date.getMonth() + 1 === Number(month.value) &&
          (!selectedYear || date.getFullYear().toString() === selectedYear)
        );
      }),
    );
  }, [allRevenueData, selectedYear]);

  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0].value);
    }
  }, [availableYears, availableMonths, selectedYear, selectedMonth]);

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
    () => aggregateData(allActivityData),
    [aggregateData, allActivityData],
  );

  const monthlyActivityReportData = useMemo(() => {
    if (!selectedYear) return [];

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const monthlyAggregated: { [month: number]: MonthlyActivityReport } = {};
    for (let i = 0; i < 12; i++) {
      monthlyAggregated[i] = {
        month: months[i],
        users: 0,
        tickets: 0,
        totalPrincipal: 0,
      };
    }

    allActivityData.forEach((item) => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return;
      if (date.getFullYear().toString() !== selectedYear) return;

      const monthIndex = date.getMonth();
      monthlyAggregated[monthIndex].users += item.users;
      monthlyAggregated[monthIndex].tickets += item.tickets;
      monthlyAggregated[monthIndex].totalPrincipal += parseFloat(
        item.totalPrincipal,
      );
    });

    return Object.values(monthlyAggregated);
  }, [allActivityData, selectedYear]);

  const termReportData = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    const termTypes: { [key: number]: string } = {
      '-1': 'No Term',
      '30': '1 Month',
      '90': '3 Months',
      '180': '6 Months',
    };

    const termAggregated: { [days: number]: TermReport } = {};
    [-1, 30, 90, 180].forEach((days) => {
      termAggregated[days] = {
        termType: termTypes[days] || `${days} Days`,
        openedCount: 0,
        closedCount: 0,
      };
    });

    allTicketData.forEach((item) => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return;
      if (date.getFullYear().toString() !== selectedYear) return;
      if ((date.getMonth() + 1).toString().padStart(2, '0') !== selectedMonth)
        return;

      if (termAggregated[item.days]) {
        termAggregated[item.days].openedCount += item.openedCount;
        termAggregated[item.days].closedCount += item.closedCount;
      }
    });

    return Object.values(termAggregated).map((item) => ({
      ...item,
      difference: item.openedCount - item.closedCount,
    }));
  }, [allTicketData, selectedYear, selectedMonth]);

  const revenueTermReportData = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    const termTypes: { [key: number]: string } = {
      '-1': 'No Term',
      '30': '1 Month',
      '90': '3 Months',
      '180': '6 Months',
    };

    const termAggregated: { [days: number]: RevenueTermReport } = {};
    [-1, 30, 90, 180].forEach((days) => {
      termAggregated[days] = {
        termType: termTypes[days] || `${days} Days`,
        income: 0,
        expense: 0,
        netIncome: 0,
      };
    });

    allRevenueData.forEach((item) => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return;
      if (date.getFullYear().toString() !== selectedYear) return;
      if ((date.getMonth() + 1).toString().padStart(2, '0') !== selectedMonth)
        return;

      if (termAggregated[item.days]) {
        termAggregated[item.days].income += parseFloat(item.income);
        termAggregated[item.days].expense += parseFloat(item.expense);
        termAggregated[item.days].netIncome += parseFloat(item.netIncome);
      }
    });

    return Object.values(termAggregated).map((item) => ({
      ...item,
      netIncome: item.netIncome,
    }));
  }, [allRevenueData, selectedYear, selectedMonth]);

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

  const usersChartData = getChartData(
    aggregatedData.users,
    'New Users',
    'rgba(75, 192, 192, 1)',
    aggregatedData.labels,
  );
  const ticketsChartData = getChartData(
    aggregatedData.tickets,
    'New Tickets',
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const exportActivityToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      monthlyActivityReportData.map((row, index) => ({
        No: index + 1,
        Month: row.month,
        'New Users': row.users,
        'New Tickets': row.tickets,
        'Total Principal (VND)': Math.round(row.totalPrincipal).toLocaleString(
          'en-US',
        ),
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Report');
    XLSX.writeFile(wb, `Monthly_Activity_Report_${selectedYear}.xlsx`);
  };

  const exportTermToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      termReportData.map((row, index) => ({
        No: index + 1,
        'Term Type': row.termType,
        'Opened Tickets': row.openedCount,
        'Closed Tickets': row.closedCount,
        'Difference Open/Close': row.difference,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Term Report');
    XLSX.writeFile(
      wb,
      `Term_Ticket_Report_${selectedYear}_${selectedMonth}.xlsx`,
    );
  };

  const exportRevenueToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      revenueTermReportData.map((row, index) => ({
        No: index + 1,
        'Term Type': row.termType,
        'Income (VND)': Math.round(row.income).toLocaleString('en-US'),
        'Expense (VND)': Math.round(row.expense).toLocaleString('en-US'),
        'Difference Income/Expense (VND)': Math.round(
          row.netIncome,
        ).toLocaleString('en-US'),
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Revenue Report');
    XLSX.writeFile(wb, `Revenue_Report_${selectedYear}_${selectedMonth}.xlsx`);
  };

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
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
          <h2 className="mb-4 text-xl font-semibold">New Users Over Time</h2>
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
          <h2 className="mb-4 text-xl font-semibold">New Tickets Over Time</h2>
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

  const renderActivityReportContent = () => (
    <div className="card bg-base-100 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Monthly Activity Report</h2>
        <div className="flex space-x-2">
          <select
            className="select select-bordered"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={exportActivityToExcel}
            disabled={!selectedYear}
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No.</th>
              <th>Month</th>
              <th>New Users</th>
              <th>New Tickets</th>
              <th>Total Principal (VND)</th>
            </tr>
          </thead>
          <tbody>
            {monthlyActivityReportData.map((row, index) => (
              <tr key={row.month}>
                <td>{index + 1}</td>
                <td>{row.month}</td>
                <td>{row.users}</td>
                <td>{row.tickets}</td>
                <td>
                  {Math.round(row.totalPrincipal).toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTicketReportContent = () => (
    <div className="card bg-base-100 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ticket Report</h2>
        <div className="flex space-x-2">
          <select
            className="select select-bordered"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedMonth('');
            }}
          >
            <option value="">Choose year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={!selectedYear}
          >
            <option value="">Choose month</option>
            {availableMonths.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={exportTermToExcel}
            disabled={!selectedYear || !selectedMonth}
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Term</th>
              <th>Opened ticket</th>
              <th>Closed ticket</th>
              <th>Difference Open/Close</th>
            </tr>
          </thead>
          <tbody>
            {termReportData.map((row, index) => (
              <tr key={row.termType}>
                <td>{index + 1}</td>
                <td>{row.termType}</td>
                <td>{row.openedCount}</td>
                <td>{row.closedCount}</td>
                <td>{row.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRevenueReportContent = () => (
    <div className="card bg-base-100 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Revenue Report</h2>
        <div className="flex space-x-2">
          <select
            className="select select-bordered"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedMonth('');
            }}
          >
            <option value="">Choose year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={!selectedYear}
          >
            <option value="">Choose month</option>
            {availableMonths.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={exportRevenueToExcel}
            disabled={!selectedYear || !selectedMonth}
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Term</th>
              <th>Income (VND)</th>
              <th>Expense (VND)</th>
              <th>Difference Income/Expense (VND)</th>
            </tr>
          </thead>
          <tbody>
            {revenueTermReportData.map((row, index) => (
              <tr key={row.termType}>
                <td>{index + 1}</td>
                <td>{row.termType}</td>
                <td>{Math.round(row.income).toLocaleString('en-US')}</td>
                <td>{Math.round(row.expense).toLocaleString('en-US')}</td>
                <td>{Math.round(row.netIncome).toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (
    (isFetchingActivity || isFetchingTickets || isFetchingRevenue) &&
    !allActivityData.length &&
    !allTicketData.length &&
    !allRevenueData.length
  )
    return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (
    !allActivityData.length &&
    !allTicketData.length &&
    !allRevenueData.length &&
    !isFetchingActivity &&
    !isFetchingTickets &&
    !isFetchingRevenue
  )
    return <div className="p-4 text-center">There is no data</div>;

  return (
    <div className="space-y-6 p-4">
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('analytics')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              e.preventDefault();
              handleTabChange('analytics');
            }
          }}
          tabIndex={0}
          href="#" // Add href or use <button> if no navigation
        >
          Analytics
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 'activityReport' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('activityReport')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              e.preventDefault();
              handleTabChange('activityReport');
            }
          }}
          tabIndex={0}
          href="#"
        >
          Activity Report
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 'ticketReport' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('ticketReport')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              e.preventDefault();
              handleTabChange('ticketReport');
            }
          }}
          tabIndex={0}
          href="#"
        >
          Ticket Report
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 'revenueReport' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('revenueReport')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              e.preventDefault();
              handleTabChange('revenueReport');
            }
          }}
          tabIndex={0}
          href="#"
        >
          Revenue Report
        </a>
      </div>
      {activeTab === 'analytics'
        ? renderAnalyticsContent()
        : activeTab === 'activityReport'
          ? renderActivityReportContent()
          : activeTab === 'ticketReport'
            ? renderTicketReportContent()
            : renderRevenueReportContent()}
    </div>
  );
};

export default AnalyticsPage;
