import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const MainPage = ({
} : {
}): JSX.Element => {
  const auth = useAuth();

  if (!auth.user) {
    return <Navigate to='/login' replace />;
  }

  // TODO: update UI
  return (
    <>
      Hi, { auth.user.name }
      <button
        onClick={() => {
          auth.logout(() => {
            // No op since it will automatically redirect to login page
          });
        }}
      >
        Logout
      </button>
    </>
  );
}
