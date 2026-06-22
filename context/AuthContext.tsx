import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loginWithSIGA, getCarreras, type DatosPersona, type Carrera, type AuthError } from '@/services/auth';
import { saveCredentials, loadCredentials, clearCredentials } from '@/services/storage';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  user: DatosPersona | null;
  carreras: Carrera[];
  isLoading: boolean;
  isInitializing: boolean; // true mientras se verifica si hay sesión guardada
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    carreras: [],
    isLoading: false,
    isInitializing: true, // empieza en true hasta que verifiquemos credenciales guardadas
    error: null,
  });

  // ─── Restauración de sesión al montar ────────────────────────────────────────
  useEffect(() => {
    async function restaurarSesion() {
      try {
        const credenciales = await loadCredentials();

        if (!credenciales) {
          // No hay credenciales guardadas — pasamos a pantalla de bienvenida
          setState((prev) => ({ ...prev, isInitializing: false }));
          return;
        }

        // Intentamos re-autenticar silenciosamente con las credenciales guardadas
        try {
          const session = await loginWithSIGA(credenciales.email, credenciales.password);

          let carreras: Carrera[] = [];
          try {
            carreras = await getCarreras(session.token);
          } catch {
            carreras = [];
          }

          setState({
            token: session.token,
            user: session.datos_persona,
            carreras,
            isLoading: false,
            isInitializing: false,
            error: null,
          });
        } catch {
          // El token puede haber expirado o la contraseña cambió —
          // limpiamos las credenciales y mostramos la pantalla de login
          await clearCredentials();
          setState((prev) => ({ ...prev, isInitializing: false }));
        }
      } catch {
        // Error inesperado al leer secure store — no bloqueamos la app
        setState((prev) => ({ ...prev, isInitializing: false }));
      }
    }

    restaurarSesion();
  }, []);

  // ─── Acciones ─────────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const session = await loginWithSIGA(email, password);

      let carreras: Carrera[] = [];
      try {
        carreras = await getCarreras(session.token);
      } catch {
        // Si falla la carga de carreras, no bloqueamos el login
        carreras = [];
      }

      // Guardamos las credenciales para la próxima apertura
      await saveCredentials(email, password);

      setState({
        token: session.token,
        user: session.datos_persona,
        carreras,
        isLoading: false,
        isInitializing: false,
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

  const logout = useCallback(async () => {
    await clearCredentials();
    setState({ token: null, user: null, carreras: [], isLoading: false, isInitializing: false, error: null });
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
