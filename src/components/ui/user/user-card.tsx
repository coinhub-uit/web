'use client';
import { UserDto } from '@/types/user';

const UserCard = ({
  fullName,
  birthDate,
  citizenId,
  avatar,
  address,
  createdAt,
}: UserDto) => {
  return (
    <div>
      <div className="card bg-base-100 w-full shadow-sm">
        <div className="card-body p-4">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="h-24 w-24 overflow-hidden rounded-full">
                <img
                  src={avatar || '/images/avatar.jpg'}
                  alt={fullName}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
