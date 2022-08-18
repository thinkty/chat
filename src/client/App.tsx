import React from 'react';
import { MemoryRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';

/**
 * TODO:
 * 
 * @see https://reactrouter.com/docs/en/v6/routers/memory-router
 * @see https://reactrouter.com/docs/en/v6/examples/auth
 * @returns {JSX.Element}
 */
export const App = (): JSX.Element => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <Routes>
          <Route element={<CommonLayout />}>
            <Route path='/' element={<MainPage />} />
            <Route path='/login' element={<LoginPage />} />

            {/* TODO: What will happen when I navigate to an api endpoint? */}
            <Route path='*' element={<Navigate to='/' />} />
          </Route>
        </Routes>
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
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'start',
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
