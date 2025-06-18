'use client';

import { useUser, useUserTickets } from '@/lib/hooks/useUser';
import Image from 'next/image';
import { use } from 'react';
import { useRef, useState } from 'react';
import { LuMoveLeft, LuMoveRight } from 'react-icons/lu';
import TicketCard from '@/components/ui/user/ticket-card';

interface Props {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: Props) {
  const { id } = use(params);
  const { user, isLoading: userLoading, error: userError } = useUser(id);
  const {
    tickets,
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useUserTickets(id);
  const activeScrollRef = useRef<HTMLDivElement | null>(null);
  const closedScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeftActive, setCanScrollLeftActive] = useState(false);
  const [canScrollRightActive, setCanScrollRightActive] = useState(true);
  const [canScrollLeftClosed, setCanScrollLeftClosed] = useState(false);
  const [canScrollRightClosed, setCanScrollRightClosed] = useState(true);

  const checkScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setLeft: (v: boolean) => void,
    setRight: (v: boolean) => void,
  ) => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setLeft(scrollLeft > 0);
    setRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: 'left' | 'right',
    checkFn: () => void,
  ) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -272 : 272,
      behavior: 'smooth',
    });
    setTimeout(checkFn, 300);
  };

  if (userLoading || ticketsLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (userError || !user || ticketsError) {
    return <div className="p-4 text-red-500">User or tickets not found</div>;
  }

  const activeTickets =
    tickets?.filter((ticket) => ticket.status === 'active') || [];
  const closedTickets =
    tickets?.filter((ticket) => ticket.status === 'closed') || [];

  return (
    <div className="w-full max-w-full overflow-x-hidden p-4">
      <div className="card bg-base-100 w-full shadow-md">
        <div className="card-body flex min-h-[300px] flex-row gap-6 p-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative h-40 w-40 overflow-hidden rounded-lg">
              <Image
                src={user.avatar || '/images/avatar.jpg'}
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

      <div className="mt-6 w-full max-w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Active Tickets</h2>
        </div>
        {activeTickets.length === 0 ? (
          <p className="text-gray-500">No active tickets found</p>
        ) : (
          <div className="relative max-w-full">
            <button
              className={`btn btn-circle btn-sm absolute top-1/2 left-0 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 ${!canScrollLeftActive ? 'btn-disabled opacity-50' : ''}`}
              onClick={() =>
                scroll(activeScrollRef, 'left', () =>
                  checkScroll(
                    activeScrollRef,
                    setCanScrollLeftActive,
                    setCanScrollRightActive,
                  ),
                )
              }
              disabled={!canScrollLeftActive}
              aria-label="Scroll left"
            >
              <LuMoveLeft size={16} />
            </button>
            <button
              className={`btn btn-circle btn-sm absolute top-1/2 right-0 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 ${!canScrollRightActive ? 'btn-disabled opacity-50' : ''}`}
              onClick={() =>
                scroll(activeScrollRef, 'right', () =>
                  checkScroll(
                    activeScrollRef,
                    setCanScrollLeftActive,
                    setCanScrollRightActive,
                  ),
                )
              }
              disabled={!canScrollRightActive}
              aria-label="Scroll right"
            >
              <LuMoveRight size={16} />
            </button>
            <div
              className="hide-scrollbar flex min-w-0 snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-4"
              ref={activeScrollRef}
              onScroll={() =>
                checkScroll(
                  activeScrollRef,
                  setCanScrollLeftActive,
                  setCanScrollRightActive,
                )
              }
            >
              {activeTickets.map((ticket) => (
                <div key={ticket.id} className="w-64 flex-shrink-0 snap-start">
                  <TicketCard ticket={ticket} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 w-full max-w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Closed Tickets</h2>
        </div>
        {closedTickets.length === 0 ? (
          <p className="text-gray-500">No closed tickets found</p>
        ) : (
          <div className="relative max-w-full">
            <button
              className={`btn btn-circle btn-sm absolute top-1/2 left-0 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 ${!canScrollLeftClosed ? 'btn-disabled opacity-50' : ''}`}
              onClick={() =>
                scroll(closedScrollRef, 'left', () =>
                  checkScroll(
                    closedScrollRef,
                    setCanScrollLeftClosed,
                    setCanScrollRightClosed,
                  ),
                )
              }
              disabled={!canScrollLeftClosed}
              aria-label="Scroll left"
            >
              <LuMoveLeft size={16} />
            </button>
            <button
              className={`btn btn-circle btn-sm absolute top-1/2 right-0 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 ${!canScrollRightClosed ? 'btn-disabled opacity-50' : ''}`}
              onClick={() =>
                scroll(closedScrollRef, 'right', () =>
                  checkScroll(
                    closedScrollRef,
                    setCanScrollLeftClosed,
                    setCanScrollRightClosed,
                  ),
                )
              }
              disabled={!canScrollRightClosed}
              aria-label="Scroll right"
            >
              <LuMoveRight size={16} />
            </button>
            <div
              className="hide-scrollbar flex min-w-0 snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-4"
              ref={closedScrollRef}
              onScroll={() =>
                checkScroll(
                  closedScrollRef,
                  setCanScrollLeftClosed,
                  setCanScrollRightClosed,
                )
              }
            >
              {closedTickets.map((ticket) => (
                <div key={ticket.id} className="w-64 flex-shrink-0 snap-start">
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
