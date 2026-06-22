import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { loginWithSIGA, type DatosPersona, type AuthError } from '@/services/auth';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  user: DatosPersona | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const session = await loginWithSIGA(email, password);
      setState({
        token: session.token,
        user: session.datos_persona,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const authErr = err as AuthError;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: authErr.message ?? 'Error al iniciar sesión',
      }));
      throw err; // re-lanzamos para que la pantalla pueda reaccionar
    }
  }, []);

  const logout = useCallback(() => {
    setState({ token: null, user: null, isLoading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, clearError }),
    [state, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
