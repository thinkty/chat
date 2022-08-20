import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useAlert } from './AlertProvider';

export const LoginPage = ({
} : {
}): JSX.Element => {
  const auth = useAuth();
  const alert = useAlert();
  const navigate = useNavigate();

  // Send back to main page if user is authenticated
  if (auth.user) {
    return <Navigate to='/' replace />;
  }

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (email == '' || password == '') {
      return;
    }

    try {
      // Check if email exists, and create one if it doesn't
      await fetch('/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // At this point, the user definitely exists, but the password could be wrong
      const { user } = await signInWithEmailAndPassword(getAuth(), email, password);

      // Fetch JWT
      const idToken = await user.getIdToken(false);

      auth.login(idToken, user.displayName || 'Anonymous', user.uid, () => {
        setEmail('');
        setPassword('');
        alert.alert('Successfully signed in', 'info', 3000);
        navigate('/', { replace: true });
      });

    } catch (error) {
        console.error(error);
        alert.alert('Failed to sign in with email and password', 'error', 5000); 
    }
  }

  return (
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
      <div
        style={{
          // border: 'thin solid white',
          // borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          width: 300,
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              flex: '1 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => { setEmail(e.target.value) }}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                borderBottom: 'thin solid white',
              }}
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => { setPassword(e.target.value) }}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                borderBottom: 'thin solid white',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              height: '100%',
              borderRadius: 100,
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="32" width="32">
              <path xmlns="http://www.w3.org/2000/svg" d="M14 19C13.4477 19 13 19.4477 13 20C13 20.5523 13.4477 21 14 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H14C13.4477 3 13 3.44771 13 4C13 4.55228 13.4477 5 14 5H19V19H14Z" fill="#ffffff"></path>
              <path xmlns="http://www.w3.org/2000/svg" d="M15.7136 12.7005C15.8063 12.6062 15.8764 12.498 15.9241 12.3828C15.9727 12.2657 15.9996 12.1375 16 12.003L16 12L16 11.997C15.9992 11.7421 15.9016 11.4874 15.7071 11.2929L11.7071 7.29289C11.3166 6.90237 10.6834 6.90237 10.2929 7.29289C9.90237 7.68342 9.90237 8.31658 10.2929 8.70711L12.5858 11H3C2.44771 11 2 11.4477 2 12C2 12.5523 2.44771 13 3 13H12.5858L10.2929 15.2929C9.90237 15.6834 9.90237 16.3166 10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L15.7064 12.7078L15.7136 12.7005Z" fill="#ffffff"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
