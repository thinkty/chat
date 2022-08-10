import React from 'react';
import { ChatPage } from './components/ChatPage';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';

export type Page = "login" | "main" | "chat";

// export function getPage(page: Page, setPage: React.Dispatch<React.SetStateAction<Page>>): React.ReactNode {
//   switch (page) {
//     case "login":
//       return <LoginPage setPage={setPage} />;
//     case "chat":
//       return <ChatPage />
//     default:
//       return <MainPage />
//   }
// }

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
