'use client';

import { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { interestMap } from '@/constants/interestMap';
import { toast, ToastContainer } from 'react-toastify';
import { useGetPlan, useUpdatePlan } from '@/lib/hooks/usePlans';

export default function EditSavingPage() {
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

  useEffect(() => {
    if (plan?.planHistories && plan.planHistories.length > 0) {
      const latestHistory = plan.planHistories.reduce((latest, current) =>
        new Date(latest.createdAt) > new Date(current.createdAt)
          ? latest
          : current,
      );
      setRate(latestHistory.rate);
    }
  }, [plan]);

  if (isLoading || !plan) return <>Loading...</>;

  const openModal = () => {
    modalRef.current?.showModal();
  };

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
    <div className="p-3">
      <h1 className="mb-4 text-2xl font-bold">Edit saving</h1>
      <label className="mb-2 block">
        Saving name: <strong>{interestInfo.name}</strong>
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
}
