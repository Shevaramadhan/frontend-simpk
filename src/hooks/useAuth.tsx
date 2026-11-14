import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '../services/authService';
import { tokenAuth } from '../services/tokenAuth';
import type { AuthResult, RegisterInput, User } from '../types';

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  loginWithGoogle: (credential: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(tokenAuth.get()));

  useEffect(() => {
    if (!tokenAuth.get()) return;
    authService
      .me()
      .then(setUser)
      .catch(() => tokenAuth.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    tokenAuth.set(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const startSession = useCallback((result: AuthResult) => {
    tokenAuth.set(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => startSession(await authService.register(input)), [startSession]);

  const loginWithGoogle = useCallback(
    async (credential: string) => startSession(await authService.loginWithGoogle(credential)),
    [startSession],
  );

  const logout = useCallback(() => {
    tokenAuth.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, loginWithGoogle, logout }),
    [user, loading, login, register, loginWithGoogle, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth harus dipakai di dalam AuthProvider.');
  return value;
}

// Untuk halaman di balik ProtectedRoute: pengguna dijamin sudah masuk.
export function useCurrentUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('Halaman ini memerlukan pengguna yang sudah masuk.');
  return user;
}
