import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MANOS_LIBRES_KEY = 'manos_libres_enabled';
const MOCK_MODE_KEY = 'mock_mode_enabled';

const DEFAULT_MANOS_LIBRES = true;
const DEFAULT_MOCK_MODE = false;

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SettingsContextValue {
  manoLibresEnabled: boolean;
  setManoLibresEnabled: (val: boolean) => void;
  mockModeEnabled: boolean;
  setMockModeEnabled: (val: boolean) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [manoLibresEnabled, setManoLibresEnabledState] = useState<boolean>(DEFAULT_MANOS_LIBRES);
  const [mockModeEnabled, setMockModeEnabledState] = useState<boolean>(DEFAULT_MOCK_MODE);

  // Carga los valores persistidos al iniciar
  useEffect(() => {
    async function cargarPreferencias() {
      try {
        const [storedManosLibres, storedMockMode] = await Promise.all([
          AsyncStorage.getItem(MANOS_LIBRES_KEY),
          AsyncStorage.getItem(MOCK_MODE_KEY),
        ]);
        if (storedManosLibres !== null) {
          setManoLibresEnabledState(storedManosLibres === 'true');
        }
        if (storedMockMode !== null) {
          setMockModeEnabledState(storedMockMode === 'true');
        }
      } catch {
        // Si falla la lectura, usamos los valores por defecto
      }
    }
    cargarPreferencias();
  }, []);

  const setManoLibresEnabled = useCallback(async (val: boolean) => {
    setManoLibresEnabledState(val);
    try {
      await AsyncStorage.setItem(MANOS_LIBRES_KEY, String(val));
    } catch {
      // Si falla la escritura, el estado en memoria ya fue actualizado
    }
  }, []);

  const setMockModeEnabled = useCallback(async (val: boolean) => {
    setMockModeEnabledState(val);
    try {
      await AsyncStorage.setItem(MOCK_MODE_KEY, String(val));
    } catch {
      // Si falla la escritura, el estado en memoria ya fue actualizado
    }
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      manoLibresEnabled,
      setManoLibresEnabled,
      mockModeEnabled,
      setMockModeEnabled,
    }),
    [manoLibresEnabled, setManoLibresEnabled, mockModeEnabled, setMockModeEnabled],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings debe usarse dentro de <SettingsProvider>');
  }
  return ctx;
}
