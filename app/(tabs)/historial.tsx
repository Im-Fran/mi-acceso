import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMockAccessLog, STATIC_MOCK_LOGS, MockLogEntry } from '@/hooks/useMockAccessLog';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type FilterOption = 'Todos' | 'Concedido' | 'Rechazado' | 'Pendiente';

interface SectionData {
  title: string;
  data: MockLogEntry[];
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const COLORS = {
  blue: '#004EAA',
  green: '#78BF26',
  red: '#D32F2F',
  white: '#FFFFFF',
  bgLight: '#F4F6F9',
  textDark: '#1C1E21',
  textMuted: '#65676B',
  borderLight: 'rgba(0, 78, 170, 0.1)',
  amber: '#F59E0B',
};

const FILTER_OPTIONS: FilterOption[] = ['Todos', 'Concedido', 'Rechazado', 'Pendiente'];

// Color de indicador por status, usado en las píldoras de filtro
const STATUS_DOT_COLORS: Record<MockLogEntry['status'], string> = {
  Concedido: COLORS.green,
  Rechazado: COLORS.red,
  Pendiente: COLORS.amber,
};

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Normaliza una fecha a medianoche para comparaciones de día.
 */
function normalizarDia(fecha: Date): number {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Formatea una fecha como encabezado de sección en español:
 * - "Hoy" si es el día de hoy
 * - "Ayer" si es el día anterior
 * - "lunes, 16 jun" para fechas anteriores
 */
function formatearEncabezadoDia(fecha: Date): string {
  const hoy = normalizarDia(new Date());
  const diaFecha = normalizarDia(fecha);
  const diffMs = hoy - diaFecha;
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return 'Hoy';
  if (diffDias === 1) return 'Ayer';

  const diaSemana = fecha.toLocaleDateString('es-CL', { weekday: 'long' });
  const dia = fecha.getDate();
  const mes = fecha.toLocaleDateString('es-CL', { month: 'short' });
  return `${diaSemana}, ${dia} ${mes}`;
}

/**
 * Agrupa una lista de entradas por día (fecha calendario) y ordena los grupos
 * de más reciente a más antiguo.
 */
function agruparPorDia(entradas: MockLogEntry[]): SectionData[] {
  const mapaGrupos = new Map<number, MockLogEntry[]>();

  for (const entrada of entradas) {
    const claveDia = normalizarDia(entrada.date);
    const grupo = mapaGrupos.get(claveDia) ?? [];
    grupo.push(entrada);
    mapaGrupos.set(claveDia, grupo);
  }

  // Ordenar grupos por fecha descendente
  const clavesOrdenadas = Array.from(mapaGrupos.keys()).sort((a, b) => b - a);

  return clavesOrdenadas.map((clave) => {
    const entradaRepresentativa = mapaGrupos.get(clave)![0];
    return {
      title: formatearEncabezadoDia(entradaRepresentativa.date),
      data: mapaGrupos.get(clave)!,
    };
  });
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

interface FilterPillProps {
  label: FilterOption;
  active: boolean;
  color?: string;
  onPress: () => void;
}

function FilterPill({ label, active, color, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.filterPill, active && styles.filterPillActive]}
    >
      {color && !active && (
        <View style={[styles.filterPillDot, { backgroundColor: color }]} />
      )}
      <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface LogRowProps {
  entry: MockLogEntry;
}

function LogRow({ entry }: LogRowProps) {
  // Usa el color del indicador calculado en el hook (incluye estados extendidos)
  const indicadorColor = entry.indicatorColor;

  return (
    <View style={styles.logRow}>
      <View style={[styles.logIndicator, { backgroundColor: indicadorColor }]} />
      <View style={styles.logInfo}>
        <Text style={styles.logTitle}>{entry.title}</Text>
        <Text style={styles.logSubtitle}>{entry.subtitle}</Text>
      </View>
      <Text style={styles.logTime}>{entry.time}</Text>
    </View>
  );
}

// ─── Pantalla Principal ───────────────────────────────────────────────────────

export default function HistorialScreen() {
  const { mockLogs } = useMockAccessLog();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('Todos');

  // Combinamos logs dinámicos + estáticos, ordenados por fecha desc
  const todasLasEntradas = useMemo<MockLogEntry[]>(() => {
    const combinado = [...mockLogs, ...STATIC_MOCK_LOGS];
    return combinado.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [mockLogs]);

  // Aplicar filtros
  const entradasFiltradas = useMemo<MockLogEntry[]>(() => {
    let resultado = todasLasEntradas;

    if (activeFilter !== 'Todos') {
      resultado = resultado.filter((e) => e.status === activeFilter);
    }

    if (searchText.trim() !== '') {
      const busqueda = searchText.toLowerCase().trim();
      resultado = resultado.filter((e) => e.title.toLowerCase().includes(busqueda));
    }

    return resultado;
  }, [todasLasEntradas, activeFilter, searchText]);

  // Agrupar por día para SectionList
  const secciones = useMemo<SectionData[]>(() => {
    return agruparPorDia(entradasFiltradas);
  }, [entradasFiltradas]);

  const hayResultados = secciones.length > 0;

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial de Accesos</Text>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por punto de acceso..."
            placeholderTextColor={COLORS.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
        </View>

        {/* Filtros en píldoras */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScrollView}
          contentContainerStyle={styles.filtersContentContainer}
        >
          {FILTER_OPTIONS.map((opcion) => {
            const colorDot =
              opcion !== 'Todos'
                ? STATUS_DOT_COLORS[opcion as MockLogEntry['status']]
                : undefined;

            return (
              <FilterPill
                key={opcion}
                label={opcion}
                active={activeFilter === opcion}
                color={colorDot}
                onPress={() => setActiveFilter(opcion)}
              />
            );
          })}
        </ScrollView>

        {/* Lista o estado vacío */}
        {hayResultados ? (
          <SectionList
            sections={secciones}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({ item, index, section }) => {
              const isFirst = index === 0;
              const isLast = index === section.data.length - 1;
              return (
                <React.Fragment>
                  <View
                    style={[
                      styles.logsCard,
                      isFirst && styles.logsCardFirst,
                      isLast && styles.logsCardLast,
                    ]}
                  >
                    <LogRow entry={item} />
                  </View>
                  {!isLast && <View style={styles.logSeparator} />}
                </React.Fragment>
              );
            }}
            renderSectionFooter={() => <View style={styles.sectionFooter} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📭</Text>
            <Text style={styles.emptyStateText}>
              No hay accesos que coincidan con los filtros
            </Text>
          </View>
        )}

      </SafeAreaView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },

  // Encabezado
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },

  // Búsqueda
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    padding: 0,
  },

  // Filtros
  filtersScrollView: {
    flexGrow: 0,
    marginBottom: 8,
  },
  filtersContentContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterPillActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  filterPillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterPillTextActive: {
    color: COLORS.white,
  },

  // Lista
  listContentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionFooter: {
    height: 8,
  },
  logsCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.borderLight,
  },
  logsCardFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
  },
  logsCardLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 1,
  },
  logSeparator: {
    height: 1,
    backgroundColor: COLORS.bgLight,
    marginHorizontal: 0,
    // borde lateral continuo
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.borderLight,
  },

  // Fila de entrada
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  logSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  logTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginLeft: 8,
  },

  // Estado vacío
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
});
