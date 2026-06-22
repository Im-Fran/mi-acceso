import { useCallback, useState } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface MockLogEntry {
  id: string;
  title: string;
  subtitle: string;
  time: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAX_LOGS = 10;

const PROTOCOLOS: string[] = ['BLE', 'UWB'];

// ─── Utilidades ───────────────────────────────────────────────────────────────

function formatearHoraActual(): string {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  return `${horas}:${minutos}`;
}

function generarId(): string {
  return `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function protocoloAleatorio(): string {
  return PROTOCOLOS[Math.floor(Math.random() * PROTOCOLOS.length)];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Gestiona el historial de accesos simulados en memoria (no persiste entre navegaciones).
 * addMockLog() inserta una entrada al inicio, manteniendo un máximo de 10 entradas (FIFO).
 */
export function useMockAccessLog(): {
  mockLogs: MockLogEntry[];
  addMockLog: () => void;
} {
  const [mockLogs, setMockLogs] = useState<MockLogEntry[]>([]);

  const addMockLog = useCallback(() => {
    const protocolo = protocoloAleatorio();
    const nuevaEntrada: MockLogEntry = {
      id: generarId(),
      title: 'Puerta Mock (Simulacion)',
      subtitle: `Detectado por ${protocolo} • Acceso Concedido`,
      time: formatearHoraActual(),
    };

    setMockLogs((prev) => {
      const actualizado = [nuevaEntrada, ...prev];
      // Mantener máximo MAX_LOGS entradas (FIFO: eliminar las más antiguas del final)
      return actualizado.slice(0, MAX_LOGS);
    });
  }, []);

  return { mockLogs, addMockLog };
}
