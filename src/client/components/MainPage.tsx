import React from 'react';
import { Page } from '../App';
import { logout, User } from '../util';

export const MainPage = ({
  setPage,
  user,
} : {
  setPage: React.Dispatch<React.SetStateAction<Page>>,
  user: User,
}): JSX.Element => {

  return (
    <>
      <h1>
        MainPage
      </h1>
      Hi, { user.user }
      <button
        onClick={() => {
          logout();
          setPage('login');
        }}
      >
        Logout
      </button>
    </>
  );
}
