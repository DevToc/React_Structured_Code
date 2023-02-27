import { nanoid } from 'nanoid';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getQueryParam, removeQueryParamFromUrl } from './auth.helpers';

interface AuthContextI {
  token: string;
}
interface AuthProviderProps {
  children: ReactNode;
}

const defaultAuthContext = {
  token: '',
};

const TOKEN_QUERY_KEY = 'authToken';

const AuthContext = createContext<AuthContextI>(defaultAuthContext);

export const generateRandomToken = () => `token-${nanoid()}`;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState('');

  // Token priority:
  // 1. query string - ?authToken=123
  // 2. localstorage - authToken:123
  // 3. Generate random token
  const parseToken = () => {
    const tokenFromQueryParam = getQueryParam(TOKEN_QUERY_KEY);
    if (tokenFromQueryParam) {
      window.localStorage.setItem(TOKEN_QUERY_KEY, tokenFromQueryParam);
      setToken(tokenFromQueryParam);
      return removeQueryParamFromUrl(TOKEN_QUERY_KEY);
    }

    const persistedToken = window.localStorage.getItem(TOKEN_QUERY_KEY);
    if (persistedToken) return setToken(persistedToken);

    const randomGeneratedToken = generateRandomToken();
    setToken(randomGeneratedToken);
    window.localStorage.setItem(TOKEN_QUERY_KEY, randomGeneratedToken);
  };

  useEffect(parseToken, []);

  return <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>;
};

// Get the token:
// const { token } = useAuth()
export const useAuth = (): AuthContextI => {
  const auth = useContext(AuthContext);

  return auth;
};
