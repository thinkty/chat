import { initializeApp } from 'firebase/app';
import React from 'react';
import { MemoryRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AlertProvider } from './components/AlertProvider';
import { AuthProvider } from './components/AuthProvider';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';

/**
 * By using the MemoryRouter instead of the normal BrowserRouter, the URL of the
 * browser is not manipulated, thus, even if the user refreshes the page, it
 * will work.
 * 
 * @see https://reactrouter.com/docs/en/v6/routers/memory-router
 * @see https://reactrouter.com/docs/en/v6/examples/auth
 * @returns {JSX.Element}
 */
export const App = (): JSX.Element => {

  // Initialize Firebase
  initializeApp({
    apiKey: "AIzaSyD5Srw6nOoPmOgQsE_tgrLYxkmHX7cj8Gw",
    authDomain: "chat-60518.firebaseapp.com",
    projectId: "chat-60518",
    storageBucket: "chat-60518.appspot.com",
    appId: "1:950484081367:web:2bc0f30dc5e0cbf3986e92",
  });

  return (
    <MemoryRouter>
      <AuthProvider>
        <AlertProvider>
          <Routes>
            <Route element={<CommonLayout />}>
              <Route path='/' element={<MainPage />} />
              <Route path='/login' element={<LoginPage />} />

              {/*
              
              When navigating to a non-existent page via the react-router-dom API,
              it will be caught by the Route element below and be redirected.

              When navigating to a page (via manipulating the URL section of the 
              browser) that does not exist, the request to the server is sent, so
              it will not reach the 404 Route below.
              
              However, if navigating to an API route that actually exists
              (ex: api/), the response from the server will be shown instead of
              the React application since the server did not send the html.

              */}
              <Route path='*' element={<Navigate to='/' />} />
            </Route>
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

/**
 * The common layout used throughout the React application
 *
 * @returns {JSX.Element}
 */
const CommonLayout = (): JSX.Element => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
        padding: 0,
        margin: 0,
        fontFamily: 'Verdana, Geneva, sans-serif',
      }}
    >
      <Outlet />
    </div>
  );
}
