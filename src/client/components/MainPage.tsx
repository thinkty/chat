import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAlert } from './AlertProvider';
import { useAuth } from './AuthProvider';

export const MainPage = ({
} : {
}): JSX.Element => {
  const auth = useAuth();
  const alert = useAlert();

  if (!auth.user) {
    return <Navigate to='/login' replace />;
  }

  // Fetch user record from database
  React.useEffect(() => {
    if (!auth.user) {
      return;
    }

    fetch(`/api/user?` + new URLSearchParams({ uid: auth.user.uid, name: auth.user.name }), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${auth.user.idToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // TODO: define data.record type and parse it to render on main page
      })
      .catch((error) => {
        // Logout on error
        auth.logout(() => { alert.alert('Signed out', 'info', 3000) });
        console.error(error);
      });
  }, []);

  // TODO: update UI. Start new conversation button
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
