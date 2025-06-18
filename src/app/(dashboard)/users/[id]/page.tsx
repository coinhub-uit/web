'use client';
import { useUser } from '@/lib/hooks/useUser';
import Image from 'next/image';
import { use } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: Props) {
  const { id } = use(params);
  const { user, isLoading, error } = useUser(id);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error || !user) {
    return <div className="p-4 text-red-500">User not found</div>;
  }

  return (
    <div className="w-full p-4">
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
    </div>
  );
}
