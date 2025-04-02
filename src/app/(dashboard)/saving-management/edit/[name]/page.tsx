'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { savingsTypes } from '@/constants/savings';

export default function EditSavingPage() {
  const router = useRouter();
  const params = useParams();
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const [saving, setSaving] = useState<{
    name: string;
    interestRate: number;
  } | null>(null);

  useEffect(() => {
    if (params.name) {
      const savingName = decodeURIComponent(params.name as string);

      const foundSaving = savingsTypes.find((s) => s.name === savingName);
      if (foundSaving) {
        setSaving(foundSaving);
      } else {
        router.push('/saving-management');
      }
    }
  }, [params.name, router]);

  if (!saving) return <p>Loading...</p>;

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-2xl font-bold">Edit saving</h1>
      <label className="mb-2 block">Saving name:</label>
      <input
        type="text"
        className="input input-bordered mb-4 w-full"
        defaultValue={saving.name}
      />
      <label className="mb-2 block">Interest Rate:</label>
      <input
        type="number"
        className="input input-bordered mb-4 w-full"
        defaultValue={saving.interestRate}
      />

      <label className="mb-2 block">Effective Date:</label>
      <input type="date" className="input input-bordered mb-4 w-full" />

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
