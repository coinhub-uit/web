// Users.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import UserCard from '@/components/ui/user/user-card';
import { useUsers } from '@/lib/hooks/useUser';
import { UserDto } from '@/types/user';

const Users = () => {
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [nextUrl, setNextUrl] = useState<string | undefined>(undefined);
  const [nextPageUrl, setNextPageUrl] = useState<string | undefined>(undefined);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { users, isLoading, error, links } = useUsers({
    limit: 30,
    sortBy: ['createdAt:ASC'],
    nextUrl,
  });

  useEffect(() => {
    if (users && users.length > 0) {
      setAllUsers((prevUsers) => {
        const newUsers = users.filter(
          (user) => !prevUsers.some((prevUser) => prevUser.id === user.id),
        );
        return [...prevUsers, ...newUsers];
      });
    }
  }, [users]);

  useEffect(() => {
    setNextPageUrl(links?.next);
  }, [links]);

  useEffect(() => {
    if (!observerRef.current || !nextPageUrl || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setNextUrl(nextPageUrl);
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [nextPageUrl, isLoading]);

  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {allUsers.map((user: UserDto) => (
          <UserCard key={user.id} {...user} />
        ))}
      </div>
      {isLoading && <div className="mt-4 text-center">Loading...</div>}
      {nextPageUrl && !isLoading && (
        <div ref={observerRef} className="h-10"></div>
      )}
      {!nextPageUrl && !isLoading && allUsers.length > 0 && (
        <div className="mt-4 text-center">No more users to load</div>
      )}
    </div>
  );
};

export default Users;
