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
const DEFAULT_VALUE = true;

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SettingsContextValue {
  manoLibresEnabled: boolean;
  setManoLibresEnabled: (val: boolean) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [manoLibresEnabled, setManoLibresEnabledState] = useState<boolean>(DEFAULT_VALUE);

  // Carga el valor persistido al iniciar
  useEffect(() => {
    async function cargarPreferencia() {
      try {
        const stored = await AsyncStorage.getItem(MANOS_LIBRES_KEY);
        if (stored !== null) {
          setManoLibresEnabledState(stored === 'true');
        }
      } catch {
        // Si falla la lectura, usamos el valor por defecto
      }
    }
    cargarPreferencia();
  }, []);

  const setManoLibresEnabled = useCallback(async (val: boolean) => {
    setManoLibresEnabledState(val);
    try {
      await AsyncStorage.setItem(MANOS_LIBRES_KEY, String(val));
    } catch {
      // Si falla la escritura, el estado en memoria ya fue actualizado
    }
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ manoLibresEnabled, setManoLibresEnabled }),
    [manoLibresEnabled, setManoLibresEnabled],
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
