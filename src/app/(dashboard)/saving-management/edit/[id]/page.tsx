'use client';
import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { interestMap } from '@/constants/interestMap';
import { useAppSelector } from '@/lib/hooks/redux';

export default function EditSavingPage() {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const params = useParams();
  const savingId = params.id ? Number(params.id) : null;

  const plan = useAppSelector((state) =>
    state.saving.availablePlans.find((p) => p.planId === savingId),
  );

  if (!plan) return <>Đã xảy ra lỗi khi tải dữ liệu.</>;

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const interestInfo = interestMap[plan.days];

  return (
    <div className="p-3">
      <h1 className="mb-4 text-2xl font-bold">Edit saving</h1>
      <label className="mb-2 block">Saving name: {interestInfo.name}</label>
      <label className="mb-2 block">Interest Rate:</label>
      <input
        type="number"
        className="input input-bordered mb-4 w-full"
        defaultValue={interestInfo.interestRate}
      />

      <button className="btn btn-primary w-full" onClick={openModal}>
        Save Changes
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Save</h3>
          <p className="py-4">Are you sure you want to save these changes?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-3">Cancel</button>
              <button className="btn btn-primary">Save</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
