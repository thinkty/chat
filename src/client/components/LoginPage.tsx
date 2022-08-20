import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useScript from 'react-script-hook';
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

  // Load Google Sign In script
  const [ gsiScriptLoading, gsiScriptError ] = useScript({
    src: 'https://accounts.google.com/gsi/client',
    onload: () => {
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
    },
  });

  if (gsiScriptError) {
    console.error(gsiScriptError);
    return (
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
        Error
      </div>
    );
  }

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
          gap: 10,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="32" width="32">
          <path xmlns="http://www.w3.org/2000/svg" d="M14 19C13.4477 19 13 19.4477 13 20C13 20.5523 13.4477 21 14 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H14C13.4477 3 13 3.44771 13 4C13 4.55228 13.4477 5 14 5H19V19H14Z" fill="#ffffff"></path>
          <path xmlns="http://www.w3.org/2000/svg" d="M15.7136 12.7005C15.8063 12.6062 15.8764 12.498 15.9241 12.3828C15.9727 12.2657 15.9996 12.1375 16 12.003L16 12L16 11.997C15.9992 11.7421 15.9016 11.4874 15.7071 11.2929L11.7071 7.29289C11.3166 6.90237 10.6834 6.90237 10.2929 7.29289C9.90237 7.68342 9.90237 8.31658 10.2929 8.70711L12.5858 11H3C2.44771 11 2 11.4477 2 12C2 12.5523 2.44771 13 3 13H12.5858L10.2929 15.2929C9.90237 15.6834 9.90237 16.3166 10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L15.7064 12.7078L15.7136 12.7005Z" fill="#ffffff"></path>
        </svg>
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
            style={{ width: '100%', display: gsiScriptLoading ? 'none' : 'block' }}
          />
          <div

          />
        </div>
      </div>
    </>
  );
}
