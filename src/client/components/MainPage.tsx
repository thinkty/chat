import React from 'react';
import { Page } from '../App';

export const MainPage = ({
  setPage,
} : {
  setPage: React.Dispatch<React.SetStateAction<Page>>
}): JSX.Element => {
  return (
    <>
      MainPage

      <button
        onClick={() => { setPage("login"); }}
      >
        Login
      </button>
    </>
  );
}
