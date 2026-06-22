//index que esta en tabs

//este index.tsx sera el que de acceso con las credenciales a las pestañas de la app, es decir, a la parte principal de la app
import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useMockBLE, MockBLEData } from '@/hooks/useMockBLE';
import { useMockAccessLog, MockLogEntry, STATIC_MOCK_LOGS } from '@/hooks/useMockAccessLog';
import { MockFAB } from '@/components/mock/MockFAB';

const COLORS = {
  blue: '#004EAA',
  green: '#78BF26',
  white: '#FFFFFF',
  bgLight: '#F4F6F9',
  textDark: '#1C1E21',
  textMuted: '#65676B',
  cardBg: '#004EAA',
  borderLight: 'rgba(0, 78, 170, 0.1)',
  amber: '#F59E0B',
  amberBg: 'rgba(245, 158, 11, 0.1)',
  amberBorder: 'rgba(245, 158, 11, 0.4)',
};

/**
 * Extrae los dígitos del RUT descartando el DV.
 * Entrada:  "12.345.678-9"
 * Salida:   "12345678"
 */
function parseRutForQr(rut: string | number | null | undefined): string {
  if (rut == null) return '';
  return String(rut).replace(/\./g, '').split('-')[0];
}

// ─── MockBLEPanel ─────────────────────────────────────────────────────────────

interface MockBLEPanelProps {
  data: MockBLEData;
}

function MockBLEPanel({ data }: MockBLEPanelProps) {
  return (
    <View style={styles.mockPanel}>
      <View style={styles.mockPanelHeader}>
        <View style={styles.mockBadge}>
          <Text style={styles.mockBadgeText}>SIMULACIÓN</Text>
        </View>
        <Text style={styles.mockPanelTitle}>Panel BLE/UWB Mock</Text>
      </View>

      <View style={styles.mockDataGrid}>
        <View style={styles.mockDataItem}>
          <Text style={styles.mockDataLabel}>RSSI</Text>
          <Text style={styles.mockDataValue}>{data.rssi} dBm</Text>
        </View>
        <View style={styles.mockDataItem}>
          <Text style={styles.mockDataLabel}>DISTANCIA</Text>
          <Text style={styles.mockDataValue}>{data.distance.toFixed(1)} m</Text>
        </View>
        <View style={styles.mockDataItem}>
          <Text style={styles.mockDataLabel}>DEVICE ID</Text>
          <Text style={styles.mockDataValue}>{data.deviceId}</Text>
        </View>
        <View style={styles.mockDataItem}>
          <Text style={styles.mockDataLabel}>ESTADO</Text>
          <Text
            style={[
              styles.mockDataValue,
              { color: data.status === 'CONECTADO' ? COLORS.green : COLORS.amber },
            ]}
          >
            {data.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const router = useRouter();
  const { user, carreras } = useAuth();
  const { manoLibresEnabled, mockModeEnabled } = useSettings();
  const mockBLEData = useMockBLE();
  const { mockLogs, addMockLog } = useMockAccessLog();

  const carreraPrincipal = carreras.find((c) => c.orden === 1) ?? carreras[0] ?? null;

  const nombreCompleto = user?.nombre_completo ?? 'Cargando...';
  const rut = user?.rut ?? '—';
  const nombreCarrera = carreraPrincipal?.nombre ?? '—';
  const sello = carreraPrincipal?.estado ?? '—';
  const fotoUrl = user?.foto && user.foto.trim() !== '' ? user.foto : null;

  const qrValue = useMemo(() => parseRutForQr(user?.rut), [user?.rut]);

  const bannerBorderColor = manoLibresEnabled
    ? COLORS.borderLight
    : 'rgba(211, 47, 47, 0.2)';
  const radarPulseOuterStyle = manoLibresEnabled
    ? { backgroundColor: 'rgba(120, 191, 38, 0.15)', borderColor: '#78BF26' }
    : { backgroundColor: 'rgba(211, 47, 47, 0.15)', borderColor: '#D32F2F' };
  const radarDotColor = manoLibresEnabled ? '#78BF26' : '#D32F2F';
  const bannerTitle = manoLibresEnabled
    ? 'Acceso Manos Libres Activo'
    : 'Acceso Manos Libres Inactivo';
  const bannerSubtitle = manoLibresEnabled
    ? 'Transmitiendo señal BLE/UWB en segundo plano'
    : 'Activa BLE/UWB en Configuración para el acceso automático';

  // Combinar logs dinámicos + estáticos y mostrar solo los 5 más recientes
  const accesoRecientes = useMemo<MockLogEntry[]>(() => {
    const dinamicos = mockModeEnabled ? mockLogs : [];
    return [...dinamicos, ...STATIC_MOCK_LOGS].slice(0, 5);
  }, [mockLogs, mockModeEnabled]);

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          {/* 1. Radar de Estado BLE/UWB (Manos Libres) */}
          <View style={[styles.statusBanner, { borderColor: bannerBorderColor }]}>
            <View style={styles.radarContainer}>
              <View style={[styles.radarPulseOuter, radarPulseOuterStyle]} />
              <View style={[styles.radarDot, { backgroundColor: radarDotColor }]} />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>{bannerTitle}</Text>
              <Text style={styles.statusSubtitle}>{bannerSubtitle}</Text>
            </View>
          </View>

          {/* 2. Panel Mock BLE/UWB — solo visible en modo mock */}
          {mockModeEnabled && mockBLEData !== null && (
            <MockBLEPanel data={mockBLEData} />
          )}

          {/* Título de Sección */}
          <Text style={styles.sectionTitle}>Tu Credencial Digital</Text>

          {/* 3. Tarjeta de Identificación Universitaria — presionable → pestaña Credencial */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/credencial')}
            style={styles.credentialCard}
          >
            <View style={styles.cardCircleBg} />

            <View style={styles.cardHeader}>
              <View style={styles.cardLogoContainer}>
                <Svg viewBox="0 0 44 48" width={28} height={30} fill="none">
                  <Path
                    d="M22 2L4 9v14c0 12 7.8 22.4 18 25 10.2-2.6 18-13 18-25V9L22 2z"
                    fill="rgba(255,255,255,0.15)"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.5"
                  />
                  <Rect x="12" y="14" width="10" height="10" rx="1" fill="#FFFFFF" opacity={0.9} />
                  <Rect x="20" y="10" width="8" height="8" rx="1" fill="#78BF26" opacity={1} />
                </Svg>
              </View>
              <View>
                <Text style={styles.cardInstitution}>UNIVERSIDAD TECNOLÓGICA</Text>
                <Text style={styles.cardSubInstitution}>METROPOLITANA</Text>
              </View>
              <View style={styles.badgePregrado}>
                <Text style={styles.badgeText}>ALUMNO</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              {/* QR a la izquierda */}
              <View style={styles.qrWrapper}>
                {qrValue ? (
                  <QRCode
                    value={qrValue}
                    size={82}
                    color={COLORS.blue}
                    backgroundColor="white"
                  />
                ) : (
                  <View style={styles.qrFallback} />
                )}
                {/* Pequeña foto sobre el QR (avatar circular) */}
                {fotoUrl && (
                  <Image
                    source={{ uri: fotoUrl }}
                    style={styles.qrAvatar}
                    resizeMode="cover"
                  />
                )}
              </View>

              {/* Datos del Alumno */}
              <View style={styles.studentData}>
                <Text style={styles.studentName}>{nombreCompleto}</Text>
                <Text style={styles.studentLabel}>Carrera</Text>
                <Text style={styles.studentValue}>{nombreCarrera}</Text>

                <View style={styles.rowGrid}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentLabel}>RUT</Text>
                    <Text style={styles.studentValue}>{rut}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentLabel}>Sello</Text>
                    <Text style={styles.studentValue}>{sello}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Indicador de que es tappeable */}
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>Toca para ver credencial completa →</Text>
            </View>

            <View style={styles.cardFooterBar} />
          </TouchableOpacity>

          {/* 4. Historial de Accesos Recientes */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Accesos Recientes (Manos Libres)</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/historial')}>
              <Text style={styles.sectionLink}>Ver más</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logsContainer}>
            {accesoRecientes.map((entry: MockLogEntry, index: number) => (
              <React.Fragment key={entry.id}>
                <View style={styles.logRow}>
                  <View style={[styles.logIndicator, { backgroundColor: entry.indicatorColor }]} />
                  <View style={styles.logInfo}>
                    <Text style={styles.logTitle}>{entry.title}</Text>
                    <Text style={styles.logSubtitle}>{entry.subtitle}</Text>
                  </View>
                  <Text style={styles.logTime}>{entry.time}</Text>
                </View>
                {index < accesoRecientes.length - 1 && (
                  <View style={styles.logSeparator} />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Padding inferior para que el FAB no tape el último item */}
          {mockModeEnabled && <View style={{ height: 80 }} />}

        </ScrollView>
      </SafeAreaView>

      {/* FAB Speed Dial — solo visible en modo mock, fuera del ScrollView */}
      {mockModeEnabled && (
        <MockFAB onSelect={addMockLog} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  radarContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radarPulseOuter: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(120, 191, 38, 0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.green,
  },
  radarDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.green,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // MockBLEPanel
  mockPanel: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.amberBorder,
  },
  mockPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mockBadge: {
    backgroundColor: COLORS.amber,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
  },
  mockBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mockPanelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  mockDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mockDataItem: {
    width: '45%',
  },
  mockDataLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  mockDataValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  sectionLink: {
    fontSize: 13,
    color: COLORS.blue,
    fontWeight: '600',
  },
  credentialCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 32,
  },
  cardCircleBg: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 14,
    marginBottom: 16,
  },
  cardLogoContainer: {
    marginRight: 10,
  },
  cardInstitution: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardSubInstitution: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  badgePregrado: {
    marginLeft: 'auto',
    backgroundColor: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },

  // QR a la izquierda
  qrWrapper: {
    width: 90,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  qrFallback: {
    width: 82,
    height: 82,
    backgroundColor: '#E8EEF6',
    borderRadius: 6,
  },
  qrAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
  },

  studentData: {
    flex: 1,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  studentLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  studentValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  rowGrid: {
    flexDirection: 'row',
    marginTop: 2,
  },

  // Indicador tap
  tapHint: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 6,
  },
  tapHintText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontStyle: 'italic',
  },

  cardFooterBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: COLORS.green,
  },
  logsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
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
  },
  logSeparator: {
    height: 1,
    backgroundColor: COLORS.bgLight,
    marginVertical: 12,
  },
});
