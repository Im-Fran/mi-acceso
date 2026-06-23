// ─── Imports ──────────────────────────────────────────────────────────────────
// Los tipos canónicos viven en MockAccessLogContext para evitar dependencia circular.

import type { MockAccessState, MockLogEntry } from '@/context/MockAccessLogContext';

// ─── Tipos re-exportados ───────────────────────────────────────────────────────

export type { MockAccessState, MockLogEntry };

// ─── Constantes ───────────────────────────────────────────────────────────────

const PROTOCOLOS: string[] = ['BLE', 'UWB'];

// Mapeo de colores por estado
const INDICATOR_COLORS: Record<MockAccessState, string> = {
  ACCESS_GRANTED: '#78BF26',
  ACCESS_DENIED:  '#D32F2F',
  SEARCHING:      '#F59E0B',
  CONNECTED:      '#004EAA',
  TIMEOUT:        '#65676B',
  EXPIRED:        '#F59E0B',
};

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Genera el subtítulo correspondiente a cada estado de acceso.
 * Los estados que dependen de protocolo usan uno aleatorio.
 */
function generarSubtitulo(estado: MockAccessState, protocolo: string): string {
  switch (estado) {
    case 'ACCESS_GRANTED':
      return `Detectado por ${protocolo} • Acceso Concedido`;
    case 'ACCESS_DENIED':
      return `Detectado por ${protocolo} • Acceso Denegado`;
    case 'SEARCHING':
      return 'Escaneando dispositivos BLE/UWB...';
    case 'CONNECTED':
      return `Detectado por ${protocolo} • Señal establecida`;
    case 'TIMEOUT':
      return 'Sin respuesta del lector • Tiempo agotado';
    case 'EXPIRED':
      return 'Acceso rechazado • Credencial sin vigencia';
  }
}

/**
 * Mapea el estado de acceso a un status legible para la entrada de log.
 */
function estadoAStatus(estado: MockAccessState): MockLogEntry['status'] {
  switch (estado) {
    case 'ACCESS_GRANTED':
    case 'CONNECTED':
      return 'Concedido';
    case 'ACCESS_DENIED':
    case 'TIMEOUT':
    case 'EXPIRED':
      return 'Rechazado';
    case 'SEARCHING':
      return 'Pendiente';
  }
}

export { PROTOCOLOS, INDICATOR_COLORS, generarSubtitulo, estadoAStatus };

// ─── Hook re-exportado desde el contexto ──────────────────────────────────────

/**
 * Hook de historial de accesos mock con persistencia en AsyncStorage.
 * El estado es compartido entre todas las pantallas mediante MockAccessLogContext.
 *
 * Debe usarse dentro de <MockAccessLogProvider> (registrado en app/_layout.tsx).
 */
export { useMockAccessLog } from '@/context/MockAccessLogContext';
