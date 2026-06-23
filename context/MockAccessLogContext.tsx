import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Tipos públicos ───────────────────────────────────────────────────────────
// Definidos aquí para evitar dependencia circular con hooks/useMockAccessLog.ts

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

const STORAGE_KEY = 'mock_access_logs';

const PUNTOS_ACCESO = [
  'Puerta Laboratorio Norte',
  'Torniquete Acceso Principal',
  'Sala de Computación 301',
  'Acceso Decanato',
  'Biblioteca Central - Piso 2',
  'Laboratorio de Física',
  'Puerta Estacionamiento',
  'Sala de Reuniones A',
  'Acceso Sala de Servidores',
] as const;

// Estados con peso: ACCESS_GRANTED aparece 3 veces para mayor probabilidad
const ESTADOS_CON_PESO: MockAccessState[] = [
  'ACCESS_GRANTED',
  'ACCESS_GRANTED',
  'ACCESS_GRANTED',
  'ACCESS_DENIED',
  'TIMEOUT',
  'EXPIRED',
];

const PROTOCOLOS: string[] = ['BLE', 'UWB'];

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MockAccessLogContextValue {
  mockLogs: MockLogEntry[];
  addMockLog: (estado: MockAccessState) => void;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

function elementoAleatorio<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function protocoloAleatorio(): string {
  return elementoAleatorio(PROTOCOLOS);
}

function formatearHora(fecha: Date): string {
  return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
}

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

const INDICATOR_COLORS: Record<MockAccessState, string> = {
  ACCESS_GRANTED: '#78BF26',
  ACCESS_DENIED:  '#D32F2F',
  SEARCHING:      '#F59E0B',
  CONNECTED:      '#004EAA',
  TIMEOUT:        '#65676B',
  EXPIRED:        '#F59E0B',
};

// ─── Generador de datos base ───────────────────────────────────────────────────

/**
 * Genera entre 2 y 5 entradas de acceso para un día dado.
 * Las horas son aleatorias entre 07:00 y 19:00 sin repetición.
 */
function generarEntradasParaDia(fecha: Date, indiceBase: number): MockLogEntry[] {
  const cantidadEntradas = 2 + Math.floor(Math.random() * 4); // 2..5
  const horasUsadas = new Set<number>();
  const entradas: MockLogEntry[] = [];

  for (let i = 0; i < cantidadEntradas; i++) {
    // Generar hora única entre 7 y 18 (inclusive)
    let hora: number;
    let intentos = 0;
    do {
      hora = 7 + Math.floor(Math.random() * 12); // 7..18
      intentos++;
    } while (horasUsadas.has(hora) && intentos < 20);
    horasUsadas.add(hora);

    const minuto = Math.floor(Math.random() * 60);
    const fechaEntrada = new Date(fecha);
    fechaEntrada.setHours(hora, minuto, 0, 0);

    const estado = elementoAleatorio(ESTADOS_CON_PESO);
    const protocolo = protocoloAleatorio();
    const timestamp = fechaEntrada.getTime();

    entradas.push({
      id: `base-${timestamp}-${indiceBase}-${i}`,
      title: elementoAleatorio(PUNTOS_ACCESO),
      subtitle: generarSubtitulo(estado, protocolo),
      time: formatearHora(fechaEntrada),
      status: estadoAStatus(estado),
      date: fechaEntrada,
      indicatorColor: INDICATOR_COLORS[estado],
    });
  }

  return entradas;
}

/**
 * Genera datos base para todos los días Lunes–Viernes del último mes (30 días).
 * Resultado ordenado de más reciente a más antiguo.
 */
function generarDatosBase(): MockLogEntry[] {
  const todasLasEntradas: MockLogEntry[] = [];
  const hoy = new Date();

  for (let diasAtras = 0; diasAtras <= 30; diasAtras++) {
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() - diasAtras);
    dia.setHours(0, 0, 0, 0);

    const diaSemana = dia.getDay(); // 0=domingo, 6=sábado
    if (diaSemana === 0 || diaSemana === 6) continue;

    const entradas = generarEntradasParaDia(dia, diasAtras);
    todasLasEntradas.push(...entradas);
  }

  // Ordenar de más reciente a más antiguo
  return todasLasEntradas.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// ─── Serialización ────────────────────────────────────────────────────────────

interface MockLogEntrySerializado extends Omit<MockLogEntry, 'date'> {
  date: string; // ISO string
}

function serializarLogs(logs: MockLogEntry[]): string {
  const serializados: MockLogEntrySerializado[] = logs.map((entry) => ({
    ...entry,
    date: entry.date.toISOString(),
  }));
  return JSON.stringify(serializados);
}

function deserializarLogs(json: string): MockLogEntry[] {
  const serializados: MockLogEntrySerializado[] = JSON.parse(json);
  return serializados.map((entry) => ({
    ...entry,
    date: new Date(entry.date),
  }));
}

// ─── Context ──────────────────────────────────────────────────────────────────

const MockAccessLogContext = createContext<MockAccessLogContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MockAccessLogProvider({ children }: { children: React.ReactNode }) {
  const [mockLogs, setMockLogs] = useState<MockLogEntry[]>([]);

  // Carga inicial desde AsyncStorage; genera datos base si no hay datos persistidos
  useEffect(() => {
    async function cargarLogs() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json !== null && json.length > 2) {
          const logsGuardados = deserializarLogs(json);
          setMockLogs(logsGuardados);
        } else {
          // Primera ejecución: generar datos base y persistirlos
          const datosBase = generarDatosBase();
          setMockLogs(datosBase);
          await AsyncStorage.setItem(STORAGE_KEY, serializarLogs(datosBase));
        }
      } catch {
        // Si falla la lectura, generar datos base en memoria sin persistir
        const datosBase = generarDatosBase();
        setMockLogs(datosBase);
      }
    }
    cargarLogs();
  }, []);

  const addMockLog = useCallback((estado: MockAccessState) => {
    const protocolo = protocoloAleatorio();
    const ahora = new Date();
    const nuevaEntrada: MockLogEntry = {
      id: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: elementoAleatorio(PUNTOS_ACCESO),
      subtitle: generarSubtitulo(estado, protocolo),
      time: formatearHora(ahora),
      status: estadoAStatus(estado),
      date: ahora,
      indicatorColor: INDICATOR_COLORS[estado],
    };

    setMockLogs((prev) => {
      const actualizado = [nuevaEntrada, ...prev];
      // Persistir de forma asíncrona sin bloquear el render
      AsyncStorage.setItem(STORAGE_KEY, serializarLogs(actualizado)).catch(() => {
        // Si falla la escritura, el estado en memoria ya fue actualizado
      });
      return actualizado;
    });
  }, []);

  const value = useMemo<MockAccessLogContextValue>(
    () => ({ mockLogs, addMockLog }),
    [mockLogs, addMockLog],
  );

  return (
    <MockAccessLogContext.Provider value={value}>
      {children}
    </MockAccessLogContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMockAccessLog(): MockAccessLogContextValue {
  const ctx = useContext(MockAccessLogContext);
  if (!ctx) {
    throw new Error('useMockAccessLog debe usarse dentro de <MockAccessLogProvider>');
  }
  return ctx;
}

