'use client';

import { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { interestMap } from '@/constants/interestMap';
import { useAppSelector } from '@/lib/hooks/redux';
import { toast, ToastContainer } from 'react-toastify';
import { useUpdatePlan } from '@/lib/hooks/usePlans';

export default function EditSavingPage() {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const params = useParams();
  const router = useRouter();
  const savingId = params.id ? Number(params.id) : null;

  const plan = useAppSelector((state) =>
    state.saving.availablePlans.find((p) => p.planId === savingId),
  );

  const [rate, setRate] = useState<string>(plan?.rate?.toString() ?? '');
  const { updatePlan, loading } = useUpdatePlan();

  if (!plan) return <>Failed to load data.</>;

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const handleConfirmSave = async () => {
    try {
      await updatePlan(plan.planId, parseFloat(rate));
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
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <ToastContainer />
    </div>
  );
}
