import { useCallback, useState } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Estados de acceso simulables desde el FAB Speed Dial.
 */
export type MockAccessState =
  | 'ACCESS_GRANTED'
  | 'ACCESS_DENIED'
  | 'SEARCHING'
  | 'CONNECTED'
  | 'TIMEOUT'
  | 'EXPIRED';

export interface MockLogEntry {
  id: string;
  title: string;          // nombre del punto de acceso
  subtitle: string;       // ej: "Detectado por BLE • Acceso Concedido"
  time: string;           // hora formateada: "08:15"
  status: 'Concedido' | 'Rechazado' | 'Pendiente';
  date: Date;             // fecha real del evento
  indicatorColor: string; // color hex del estado para el indicador visual
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAX_LOGS = 10;

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

/**
 * Crea una fecha relativa al día de hoy desplazada por `diasAtras` días.
 * Se le asigna la hora indicada en formato "HH:MM".
 */
function crearFecha(diasAtras: number, hora: string): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);
  const [horas, minutos] = hora.split(':').map(Number);
  fecha.setHours(horas, minutos, 0, 0);
  return fecha;
}

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

// ─── Datos estáticos mock ─────────────────────────────────────────────────────

/**
 * Array estático de 15 entradas de acceso distribuidas en 4 días,
 * con variedad de estados y puntos de acceso.
 */
export const STATIC_MOCK_LOGS: MockLogEntry[] = [
  // Hoy
  {
    id: 'static-01',
    title: 'Puerta Laboratorio Norte',
    subtitle: 'Detectado por UWB • Acceso Concedido',
    time: '09:42',
    status: 'Concedido',
    date: crearFecha(0, '09:42'),
    indicatorColor: '#78BF26',
  },
  {
    id: 'static-02',
    title: 'Torniquete Acceso Principal',
    subtitle: 'Detectado por BLE • Acceso Concedido',
    time: '08:15',
    status: 'Concedido',
    date: crearFecha(0, '08:15'),
    indicatorColor: '#78BF26',
  },
  {
    id: 'static-03',
    title: 'Sala de Computación 301',
    subtitle: 'Detectado por BLE • Acceso Rechazado',
    time: '07:55',
    status: 'Rechazado',
    date: crearFecha(0, '07:55'),
    indicatorColor: '#D32F2F',
  },
  {
    id: 'static-04',
    title: 'Acceso Decanato',
    subtitle: 'Detectado por UWB • Acceso Pendiente',
    time: '07:30',
    status: 'Pendiente',
    date: crearFecha(0, '07:30'),
    indicatorColor: '#F59E0B',
  },
  // Ayer
  {
    id: 'static-05',
    title: 'Biblioteca Central - Piso 2',
    subtitle: 'Detectado por BLE • Acceso Concedido',
    time: '17:10',
    status: 'Concedido',
    date: crearFecha(1, '17:10'),
    indicatorColor: '#78BF26',
  },
  {
    id: 'static-06',
    title: 'Laboratorio de Física',
    subtitle: 'Detectado por UWB • Acceso Concedido',
    time: '14:45',
    status: 'Concedido',
    date: crearFecha(1, '14:45'),
    indicatorColor: '#78BF26',
  },
  {
    id: 'static-07',
    title: 'Puerta Estacionamiento',
    subtitle: 'Detectado por BLE • Acceso Rechazado',
    time: '13:20',
    status: 'Rechazado',
    date: crearFecha(1, '13:20'),
    indicatorColor: '#D32F2F',
  },
  {
    id: 'static-08',
    title: 'Torniquete Acceso Principal',
    subtitle: 'Detectado por BLE • Acceso Concedido',
    time: '08:05',
    status: 'Concedido',
    date: crearFecha(1, '08:05'),
    indicatorColor: '#78BF26',
  },
  // Hace 2 días
  {
    id: 'static-09',
    title: 'Sala de Computación 301',
    subtitle: 'Detectado por UWB • Acceso Concedido',
    time: '16:30',
    status: 'Concedido',
    date: crearFecha(2, '16:30'),
    indicatorColor: '#78BF26',
  },
  {
    id: 'static-10',
    title: 'Acceso Decanato',
    subtitle: 'Detectado por UWB • Acceso Pendiente',
    time: '15:00',
    status: 'Pendiente',
    date: crearFecha(2, '15:00'),
    indicatorColor: '#F59E0B',
  },
  {
    id: 'static-11',
    title: 'Biblioteca Central - Piso 2',
    subtitle: 'Detectado por BLE • Acceso Concedido',
    time: '11:25',
    status: 'Concedido',
    date: crearFecha(2, '11:25'),
    indicatorColor: '#78BF26',
  },
  {
    id: 'static-12',
    title: 'Puerta Laboratorio Norte',
    subtitle: 'Detectado por UWB • Acceso Rechazado',
    time: '09:10',
    status: 'Rechazado',
    date: crearFecha(2, '09:10'),
    indicatorColor: '#D32F2F',
  },
  // Hace 3 días
  {
    id: 'static-13',
    title: 'Laboratorio de Física',
    subtitle: 'Detectado por BLE • Acceso Concedido',
    time: '18:00',
    status: 'Concedido',
    date: crearFecha(3, '18:00'),
    indicatorColor: '#78BF26',
  },
  {
    id: 'static-14',
    title: 'Puerta Estacionamiento',
    subtitle: 'Detectado por UWB • Acceso Pendiente',
    time: '12:40',
    status: 'Pendiente',
    date: crearFecha(3, '12:40'),
    indicatorColor: '#F59E0B',
  },
  {
    id: 'static-15',
    title: 'Torniquete Acceso Principal',
    subtitle: 'Detectado por BLE • Acceso Concedido',
    time: '08:00',
    status: 'Concedido',
    date: crearFecha(3, '08:00'),
    indicatorColor: '#78BF26',
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Gestiona el historial de accesos simulados en memoria (no persiste entre navegaciones).
 * addMockLog(estado) inserta una entrada al inicio según el estado seleccionado,
 * manteniendo un máximo de 10 entradas (FIFO).
 */
export function useMockAccessLog(): {
  mockLogs: MockLogEntry[];
  addMockLog: (estado: MockAccessState) => void;
} {
  const [mockLogs, setMockLogs] = useState<MockLogEntry[]>([]);

  const addMockLog = useCallback((estado: MockAccessState) => {
    const protocolo = protocoloAleatorio();
    const ahora = new Date();
    const nuevaEntrada: MockLogEntry = {
      id: generarId(),
      title: 'Puerta Mock (Simulación)',
      subtitle: generarSubtitulo(estado, protocolo),
      time: formatearHoraActual(),
      status: estadoAStatus(estado),
      date: ahora,
      indicatorColor: INDICATOR_COLORS[estado],
    };

    setMockLogs((prev) => {
      const actualizado = [nuevaEntrada, ...prev];
      // Mantener máximo MAX_LOGS entradas (FIFO: eliminar las más antiguas del final)
      return actualizado.slice(0, MAX_LOGS);
    });
  }, []);

  return { mockLogs, addMockLog };
}
