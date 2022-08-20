import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * Response from server after sending the JWT (idToken)
 *
 * @see auth.ts src/server/auth.ts
 */
 type FirebaseAuthResponse = {
  name: string,
  uid: string,
  idToken: string,
};

export const LoginPage = ({
} : {
}): JSX.Element => {
  const auth = useAuth();
  const navigate = useNavigate();

  // Send back to main page if user is authenticated
  if (auth.user) {
    return <Navigate to='/' replace />;
  }

  // Send the Id Token to the server to authenticate with Firebase
  function handleGoogleLogin(response: google.accounts.id.CredentialResponse) {

    fetch('/auth-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: response.credential }),
    })
      .then((response) => {
        if (response.ok || response.status == 200) {
          return response.json();
        }
        
        throw new Error(response.statusText);
      })
      .then((data: FirebaseAuthResponse) => {
        auth.login(data.idToken, data.name, data.uid, 'google', () => {

          // Send user to main page after login complete
          navigate('/', { replace: true });
        });
      })
      .catch((error) => {
        alert('Failed to login. Check console for details');

        // 400 - bad request : Missing or malformed idToken
        // 40X - Invalid JWT (idToken) or something else idk...
        console.error(error);
      });
  }

  React.useEffect(() => {
    google.accounts.id.initialize({
      client_id: '950484081367-5u480vk65qg38kogmka1ptaqpacrhpnj.apps.googleusercontent.com',
      auto_select: false,
      context: 'signin',
      callback: handleGoogleLogin,
    });
    google.accounts.id.renderButton(
      document.getElementById('googleAuthButton')!,
      {theme: 'filled_blue', size: 'medium', type: 'standard', width: '300px' }
    );
  }, []);

  // TODO: update UI
  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>
          Login
        </h1>

        <div
          style={{
            border: 'thin solid white',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            width: 300,
          }}
        >
          <div
            id='googleAuthButton'
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </>
  );
}
