import { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface MockBLEData {
  rssi: number;
  distance: number;
  deviceId: string;
  status: 'CONECTADO' | 'BUSCANDO';
}

// ─── Valores cíclicos simulados ───────────────────────────────────────────────

// Valores fijos que se ciclan para RSSI (dBm): rango -45 a -90
const RSSI_CYCLE: number[] = [-45, -52, -58, -63, -71, -78, -84, -90, -82, -75, -67, -55];

// Valores fijos que se ciclan para distancia (metros): rango 0.5 a 5.0
const DISTANCE_CYCLE: number[] = [0.5, 0.8, 1.2, 1.7, 2.3, 2.9, 3.5, 4.1, 4.7, 5.0, 4.3, 3.1];

const DEVICE_ID = 'MOCK-BLE-001';
const INTERVALO_MS = 3000;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Provee datos BLE/UWB simulados cuando el modo mock está activo.
 * Cicla por valores fijos cada 3 segundos.
 * Devuelve null cuando mockModeEnabled === false.
 */
export function useMockBLE(): MockBLEData | null {
  const { mockModeEnabled } = useSettings();
  const indexRef = useRef(0);

  const [data, setData] = useState<MockBLEData>({
    rssi: RSSI_CYCLE[0],
    distance: DISTANCE_CYCLE[0],
    deviceId: DEVICE_ID,
    status: 'CONECTADO',
  });

  useEffect(() => {
    if (!mockModeEnabled) return;

    // Arrancamos en el primer valor al activarse
    indexRef.current = 0;
    setData({
      rssi: RSSI_CYCLE[0],
      distance: DISTANCE_CYCLE[0],
      deviceId: DEVICE_ID,
      status: 'CONECTADO',
    });

    const intervalo = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % RSSI_CYCLE.length;
      const i = indexRef.current;
      // El estado alterna entre CONECTADO y BUSCANDO al llegar al final del ciclo
      const status: 'CONECTADO' | 'BUSCANDO' = i % 4 === 3 ? 'BUSCANDO' : 'CONECTADO';
      setData({
        rssi: RSSI_CYCLE[i],
        distance: DISTANCE_CYCLE[i],
        deviceId: DEVICE_ID,
        status,
      });
    }, INTERVALO_MS);

    return () => clearInterval(intervalo);
  }, [mockModeEnabled]);

  if (!mockModeEnabled) return null;

  return data;
}
