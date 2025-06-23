'use client';

import {
  useUser,
  useUserSources,
  useUserTickets,
  deleteUser,
} from '@/lib/hooks/useUser';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { use, useRef, useState } from 'react';
import TicketCard from '@/components/ui/user/ticket-card';
import SourceCard from '@/components/ui/user/source-card';
import { useSWRConfig } from 'swr';
import { API_URL } from '@/constants/api-urls';
import { useSession } from 'next-auth/react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('api/auth/signin');
    },
  });
  const { user, isLoading: userLoading, error: userError } = useUser(id);
  const {
    tickets,
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useUserTickets(id);
  const {
    sources,
    isLoading: sourcesLoading,
    error: sourcesError,
  } = useUserSources(id);
  const sourcesScrollRef = useRef<HTMLDivElement | null>(null);
  const activeScrollRef = useRef<HTMLDivElement | null>(null);
  const closedScrollRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (status !== 'authenticated' || !session?.user?.accessToken) {
      setDeleteError('You must be logged in to delete a user.');
      return;
    }

    try {
      await deleteUser(id, session.user.accessToken);
      await Promise.all([
        mutate(`${API_URL}/users`, undefined, { revalidate: true }),
        mutate(`${API_URL}/users/${id}`, undefined, { revalidate: false }),
      ]);
      window.location.href = '/users';
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Failed to delete user',
      );
    }
  };

  if (status === 'loading' || userLoading || ticketsLoading || sourcesLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (userError || !user || ticketsError || sourcesError) {
    return (
      <div className="p-4 text-red-500">
        User, tickets, or sources not found
      </div>
    );
  }

  const activeTickets =
    tickets?.filter((ticket) => ticket.status === 'active') || [];
  const closedTickets =
    tickets?.filter(
      (ticket) =>
        ticket.status === 'earlyWithdrawn' ||
        ticket.status === 'maturedWithdrawn',
    ) || [];
  const safeSources = sources || [];

  return (
    <div className="w-full max-w-full overflow-x-hidden p-4">
      <div className="card bg-base-100 relative w-full shadow-md">
        {user.deletedAt ? null : (
          <button
            onClick={openModal}
            className="btn btn-sm btn-error absolute top-4 right-4 text-white"
            aria-label="Delete User"
          >
            Delete
          </button>
        )}

        <div className="card-body flex min-h-[300px] flex-row gap-6 p-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative h-40 w-40 overflow-hidden rounded-lg">
              <Image
                src={user.avatar ?? '/images/avatar.jpg'}
                alt={user.fullName}
                fill
                className="object-cover"
              />
            </div>
            <span
              className={`badge ${user.deletedAt ? 'badge-error' : 'badge-success'} text-xs text-white`}
              role="status"
              aria-label={user.deletedAt ? 'Deleted user' : 'Active user'}
            >
              {user.deletedAt ? 'Deleted' : 'Active'}
            </span>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-sm text-gray-500">
                ID: <span className="font-mono">{user.id}</span>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-base">
              <p>
                <strong className="font-semibold">Citizen ID:</strong>{' '}
                {user.citizenId}
              </p>
              <p>
                <strong className="font-semibold">Birth Date:</strong>{' '}
                {new Date(user.birthDate).toLocaleDateString()}
              </p>
              <p>
                <strong className="font-semibold">Address:</strong>{' '}
                {user.address}
              </p>
              <p>
                <strong className="font-semibold">Created At:</strong>{' '}
                {new Date(user.createdAt).toLocaleString()}
              </p>
              <p>
                <strong className="font-semibold">Delete At:</strong>{' '}
                {user.deletedAt
                  ? new Date(user.deletedAt).toLocaleString()
                  : 'Not deleted'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal modal-open"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="modal-box max-w-md">
            <h3 id="modal-title" className="text-lg font-bold">
              Confirm Deletion
            </h3>
            <p id="modal-description" className="py-4">
              Are you sure you want to delete user {user?.fullName ?? id}?
            </p>
            {deleteError && (
              <p className="text-sm text-red-500">{deleteError}</p>
            )}
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDelete}
                aria-label="Confirm Delete"
              >
                Yes
              </button>
              <button className="btn" onClick={closeModal} aria-label="Cancel">
                No
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={closeModal}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Escape' && closeModal()}
            aria-label="Close modal"
          />
        </div>
      )}

      <div className="mt-6 w-full max-w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sources</h2>
        </div>
        {safeSources.length === 0 ? (
          <p className="text-gray-500">No sources found</p>
        ) : (
          <div className="relative max-w-full">
            <div
              className="flex min-w-0 snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-4"
              ref={sourcesScrollRef}
            >
              {safeSources.map((source) => (
                <div
                  key={source.id}
                  className="w-48 flex-shrink-0 snap-start sm:w-64"
                >
                  <SourceCard source={source} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 w-full max-w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Active Tickets</h2>
        </div>
        {activeTickets.length === 0 ? (
          <p className="text-gray-500">No active tickets found</p>
        ) : (
          <div className="relative max-w-full">
            <div
              className="flex min-w-0 snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-4"
              ref={activeScrollRef}
            >
              {activeTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="w-48 flex-shrink-0 snap-start sm:w-64"
                >
                  <TicketCard ticket={ticket} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 w-full max-w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Withdrawn Tickets</h2>
        </div>
        {closedTickets.length === 0 ? (
          <p className="text-gray-500">No withdrawn tickets found</p>
        ) : (
          <div className="relative max-w-full">
            <div
              className="flex min-w-0 snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-4"
              ref={closedScrollRef}
            >
              {closedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="w-48 flex-shrink-0 snap-start sm:w-64"
                >
                  <TicketCard ticket={ticket} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
