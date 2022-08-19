import React from 'react';
import { getUserFromSessionStorage, Provider, removeUserSession, saveUserSession, User } from '../util';

interface AuthContextType {
  user: User | null;
  login: (idToken: string, name: string, provider: Provider, cb: VoidFunction) => void;
  logout: (cb: VoidFunction) => void;
};

// @see https://stackoverflow.com/a/67957976
const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => (React.useContext(AuthContext));

/**
 * An authentication context provider for the React application
 * 
 * @param {React.ReactNode} children
 * @returns {JSX.Element}
 * @see https://reactrouter.com/docs/en/v6/examples/auth
 */
export const AuthProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {

  // Check user validity
  const parsedUser = getUserFromSessionStorage();
  const [user, setUser] = React.useState<User | null>(parsedUser);

  const login = (idToken: string, name: string, provider: Provider, cb: VoidFunction) => {
    saveUserSession({ idToken, name, provider });
    setUser({ idToken, name, provider });
    cb();
  }

  const logout = (cb: VoidFunction) => {
    removeUserSession();
    setUser(null);
    cb();
  }

  let value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}