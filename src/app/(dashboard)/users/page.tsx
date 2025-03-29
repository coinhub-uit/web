'use client';

import { API_URL } from '@/constants/api-urls';
import useFetch from '@/lib/hooks/useFetch';

const Users = () => {
  const { data, error, isLoading } = useFetch(`${API_URL}/admins`);

  if (error) {
    return <>failed to load</>;
  }
  if (isLoading) {
    return <>...loading</>;
  }
  return <div>{JSON.stringify(data)}</div>;
};

export default Users;
