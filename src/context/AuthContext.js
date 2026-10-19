
import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export default AuthContext;

export function useAuth() {
  return useContext(AuthContext);
}
