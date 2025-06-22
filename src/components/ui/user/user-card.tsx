'use client';
import { UserDto } from '@/types/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UserCard = ({
  id,
  fullName,
  birthDate,
  citizenId,
  avatar,
  address,
  createdAt,
  deletedAt,
}: UserDto) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/users/${id}`);
  };

  return (
    <div
      className="card bg-base-100 w-full cursor-pointer shadow-sm"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="card-body p-4">
        <div className="flex items-center gap-6">
          <div className="avatar flex flex-col items-center gap-2">
            <div className="relative h-24 w-24 overflow-hidden rounded-full">
              <Image
                src={avatar || '/images/avatar.jpg'}
                alt={fullName}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span
              className={`badge badge-sm ${deletedAt ? 'badge-error' : 'badge-success'} text-white`}
              role="status"
              aria-label={deletedAt ? 'Deleted user' : 'Active user'}
            >
              {deletedAt ? 'Deleted' : 'Active'}
            </span>
          </div>

          <div className="text-base-content flex-1 space-y-1 text-sm">
            <h2 className="text-xl font-semibold">{fullName}</h2>
            <p>
              <strong>Citizen ID:</strong> {citizenId}
            </p>
            <p>
              <strong>Birth Date:</strong>{' '}
              {new Date(birthDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(createdAt).toLocaleString()}
            </p>
            {deletedAt && (
              <p>
                <strong>Deleted At:</strong>{' '}
                {new Date(deletedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
