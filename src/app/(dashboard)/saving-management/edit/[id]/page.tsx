'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { interestMap } from '@/constants/interestMap';
import { toast, ToastContainer } from 'react-toastify';
import { useGetPlan, useUpdatePlan } from '@/lib/hooks/usePlans';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface HistoryDto {
  createdAt: string;
  rate: string;
}

interface AggregatedHistory {
  labels: string[];
  rates: number[];
}

const EditSavingPage = () => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const params = useParams();
  const router = useRouter();
  const savingId = params.id ? Number(params.id) : null;

  const { data: plan, isLoading } = useGetPlan(savingId ?? 0);
  const {
    updatePlan,
    loading: updateLoading,
    error: updateError,
  } = useUpdatePlan();

  const [rate, setRate] = useState<string>('');
  const [allHistoryData, setAllHistoryData] = useState<HistoryDto[]>([]);

  const appendHistoryData = useCallback(
    (newHistories: HistoryDto[] | undefined) => {
      if (!newHistories || newHistories.length === 0) return;

      const validHistories = newHistories.filter((history) => {
        if (!history.createdAt || isNaN(Date.parse(history.createdAt)))
          return false;
        const rateValue = parseFloat(history.rate);
        return !isNaN(rateValue);
      });

      if (validHistories.length === 0) return;

      setAllHistoryData((prev) => {
        const uniqueHistories = validHistories.filter(
          (history) =>
            !prev.some((existing) => existing.createdAt === history.createdAt),
        );
        return [...prev, ...uniqueHistories];
      });
    },
    [],
  );

  useEffect(() => {
    if (plan?.planHistories && plan.planHistories.length > 0) {
      const latestHistory = plan.planHistories.reduce((latest, current) =>
        new Date(latest.createdAt) > new Date(current.createdAt)
          ? latest
          : current,
      );
      setRate(latestHistory.rate);
      appendHistoryData(plan.planHistories);
    }
  }, [plan, appendHistoryData]);

  const aggregateHistory = useCallback(
    (data: HistoryDto[]): AggregatedHistory => {
      const aggregated: { [key: string]: { rate: number } } = {};

      data.forEach((item) => {
        const date = new Date(item.createdAt);
        if (isNaN(date.getTime())) return;
        const key = `${date.getDate().toString().padStart(2, '0')}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${date.getFullYear()}`;

        if (!aggregated[key]) {
          aggregated[key] = { rate: 0 };
        }

        aggregated[key].rate = parseFloat(item.rate);
      });

      const labels = Object.keys(aggregated).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('-').map(Number);
        const [dayB, monthB, yearB] = b.split('-').map(Number);
        return (
          new Date(yearA, monthA - 1, dayA).getTime() -
          new Date(yearB, monthB - 1, dayB).getTime()
        );
      });

      const rates = labels.map((label) => aggregated[label].rate);

      return { labels, rates };
    },
    [],
  );

  const aggregatedHistory = useMemo(
    () => aggregateHistory(allHistoryData),
    [aggregateHistory, allHistoryData],
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

  const rateChartData = getChartData(
    aggregatedHistory.rates,
    'Interest Rate (%)',
    'rgba(75, 192, 192, 1)',
    aggregatedHistory.labels,
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Interest Rate History' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Rate (%)' },
      },
    },
  };

  const openModal = () => {
    modalRef.current?.showModal();
  };

  if (isLoading || !plan)
    return <div className="p-4 text-center">Loading...</div>;

  const handleConfirmSave = async () => {
    try {
      await updatePlan(plan.id, parseFloat(rate));
      toast.success('Saved successfully!', {
        onClose: () => {
          router.push('/saving-management');
        },
      });
      modalRef.current?.close();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to save changes.');
    }
  };

  const interestInfo = interestMap[plan.days];

  return (
    <div className="space-y-6 p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Saving</h1>
      <div className="card bg-base-100 p-4 shadow-md">
        <label className="mb-2 block">
          Saving Name: <strong>{interestInfo.name}</strong>
        </label>
        <label htmlFor="interest-rate" className="mb-2 block">
          Interest Rate:
        </label>
        <input
          id="interest-rate"
          type="number"
          step="0.1"
          className="input input-bordered mb-4 w-full"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        {updateError && <p className="text-error mb-4">{updateError}</p>}
        <button className="btn btn-primary w-full" onClick={openModal}>
          Save Changes
        </button>
      </div>

      {allHistoryData.length > 0 ? (
        <div className="card bg-base-100 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Interest Rate History</h2>
          <Line data={rateChartData} options={chartOptions} />
        </div>
      ) : (
        <div className="p-4 text-center">No history data available</div>
      )}

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Save</h3>
          <p className="py-4">Are you sure you want to save these changes?</p>
          <div className="modal-action">
            <form method="dialog" onSubmit={(e) => e.preventDefault()}>
              <button
                type="button"
                className="btn mr-3"
                onClick={() => modalRef.current?.close()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmSave}
                disabled={updateLoading}
              >
                {updateLoading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <ToastContainer />
    </div>
  );
};

export default EditSavingPage;
