import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export const MainPage = ({
} : {
}): JSX.Element => {
  const auth = React.useContext(AuthContext);

  if (!auth.user) {
    return (
      <Link to='login'>
        Login
      </Link>
    );
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
