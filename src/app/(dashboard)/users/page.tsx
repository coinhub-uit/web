'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import UserCard from '@/components/ui/user/user-card';
import { useUsers } from '@/lib/hooks/useUser';
import { UserDto } from '@/types/user';

const Users = () => {
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [nextUrl, setNextUrl] = useState<string | undefined>(undefined);
  const [nextPageUrl, setNextPageUrl] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { users, isLoading, error, links } = useUsers({
    limit: 30,
    sortBy: [`createdAt:${sortOrder}`],
    nextUrl,
  });

  const resetUsers = useCallback(() => {
    setAllUsers([]);
    setNextUrl(undefined);
  }, []);

  const updateUsers = useCallback((newUsers: UserDto[] | undefined) => {
    if (!newUsers || newUsers.length === 0) return;
    setAllUsers((prevUsers) => {
      const uniqueUsers = newUsers.filter(
        (user) => !prevUsers.some((prevUser) => prevUser.id === user.id),
      );
      return [...prevUsers, ...uniqueUsers];
    });
  }, []);

  const updateNextPageUrl = useCallback((newLinks: typeof links) => {
    setNextPageUrl(newLinks?.next);
  }, []);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading && nextPageUrl) {
        setNextUrl(nextPageUrl);
      }
    },
    [isLoading, nextPageUrl],
  );

  const setupInfiniteScroll = useCallback(() => {
    if (!observerRef.current || !nextPageUrl || isLoading) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 1.0,
    });
    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleIntersection, isLoading, nextPageUrl]);

  useEffect(() => {
    resetUsers();
  }, [resetUsers, sortOrder]);

  useEffect(() => {
    updateUsers(users);
  }, [updateUsers, users]);

  useEffect(() => {
    updateNextPageUrl(links);
  }, [updateNextPageUrl, links]);

  useEffect(() => {
    const cleanup = setupInfiniteScroll();
    return cleanup || (() => {});
  }, [setupInfiniteScroll]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 p-4">
      <div className="flex justify-end">
        <select
          className="select select-bordered"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
        >
          <option value="ASC">Create Date Ascending</option>
          <option value="DESC">Created Date Descending</option>
        </select>
      </div>
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
