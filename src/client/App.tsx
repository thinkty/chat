import React from 'react';
import { ChatPage } from './components/ChatPage';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';

/**
 * I initially wanted to use the react-router-dom for switching between pages but it was making the server-side code
 * look ugly (wow. what an excuse) due to the uri not being handled. It would redirect to a 404 page if the user
 * refreshed the page manually since '/login' doesn't really exist. Since there are only 3 pages, I could just let those
 * paths redirect to index.html but I feared that it might interfere with the future implements.
 */
export type Page = "login" | "main" | "chat";

export const App = (): JSX.Element => {

  // Check user session
  let auth = true;

  const [page, setPage] = React.useState<Page>(auth ? "main" : "login");

  function getPage(page: Page, setPage: React.Dispatch<React.SetStateAction<Page>>): React.ReactNode {
    switch (page) {
      case "login":
        return <LoginPage setPage={setPage} />;
      case "chat":
        return <ChatPage setPage={setPage} />
      default:
        return <MainPage setPage={setPage} />
    }
  }

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
      { getPage(page, setPage) }
    </div>
  );
}
