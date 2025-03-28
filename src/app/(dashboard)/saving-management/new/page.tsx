'use client';
import { useRef } from 'react';

export default function NewSavingPage() {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  return (
    <div className="p-3">
      <h1 className="mb-4 text-2xl font-bold">New saving</h1>
      <label className="mb-2 block">Saving name:</label>
      <input
        type="text"
        className="input input-bordered mb-4 w-full"
        placeholder="Saving name"
      />
      <label className="mb-2 block">Interest Rate:</label>
      <input
        type="number"
        className="input input-bordered mb-4 w-full"
        placeholder="Interest rate"
      />

      <label className="mb-2 block">Minimum Deposit:</label>
      <input
        type="number"
        className="input input-bordered mb-4 w-full"
        placeholder="Minimum deposit"
      />

      <label className="mb-2 block">Effective Date:</label>
      <input type="date" className="input input-bordered mb-4 w-full" />

      <button className="btn btn-primary w-full" onClick={openModal}>
        Save Changes
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Save</h3>
          <p className="py-4">Are you sure you want to add new saving type?</p>
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
