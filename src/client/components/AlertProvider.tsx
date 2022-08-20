import React from 'react';

type AlertType = 'info' | 'error';

interface AlertContextType {
  alert: (message: string, type: AlertType, duration: number) => void;
};

const AlertContext = React.createContext<AlertContextType>({} as AlertContextType);
export const useAlert = () => (React.useContext(AlertContext));

/**
 * An alert context provider for the React application
 * 
 * @param {React.ReactNode} children
 * @returns {JSX.Element}
 */
export const AlertProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {

  const [message, setMessage] = React.useState<string | null>(null);
  const [type, setType] = React.useState<AlertType | null>(null);

  const reset = () => {
    setMessage(null);
    setType(null);
  }

  const alert = (message: string, type: AlertType, duration: number) => {
    setMessage(message);
    setType(type);
    setTimeout(reset, duration);
  }

  let value = { alert };

  return (
    <AlertContext.Provider value={value}>
      {
        message &&
        <div
          style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            padding: 10,
            backgroundColor: type == 'info' ? 'green' : 'red',
            color: 'white',
            fontFamily: 'Verdana, Geneva, sans-serif',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div>
            { message }
          </div>
          <div
            onClick={reset}
            style={{
              cursor: 'pointer',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
              <path xmlns="http://www.w3.org/2000/svg" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#ffffff"></path>
            </svg>
          </div>
        </div>
      }
      { children }
    </AlertContext.Provider>
  );
}