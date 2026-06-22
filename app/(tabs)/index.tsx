//index que esta en tabs



//este index.lsx sera el que de acceso con las credenciales a las pestañas de la app, es decir, a la parte principal de la app
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

const COLORS = {
  blue: '#004EAA',
  green: '#78BF26',
  white: '#FFFFFF',
  bgLight: '#F4F6F9',
  textDark: '#1C1E21',
  textMuted: '#65676B',
  cardBg: '#004EAA',
  borderLight: 'rgba(0, 78, 170, 0.1)',
};

export default function StudentDashboard() {
  const { user, carreras } = useAuth();

  const carreraPrincipal = carreras.find((c) => c.orden === 1) ?? carreras[0] ?? null;

  const nombreCompleto = user?.nombre_completo ?? 'Cargando...';
  const rut = user?.rut ?? '—';
  const nombreCarrera = carreraPrincipal?.nombre ?? '—';
  const sello = carreraPrincipal?.estado ?? '—';
  const fotoUrl = user?.foto && user.foto.trim() !== '' ? user.foto : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* 1. Radar de Estado BLE/UWB (Manos Libres) */}
      <View style={styles.statusBanner}>
        <View style={styles.radarContainer}>
          <View style={styles.radarPulseOuter} />
          <View style={styles.radarDot} />
        </View>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusTitle}>Acceso Manos Libres Activo</Text>
          <Text style={styles.statusSubtitle}>Transmitiendo señal BLE/UWB en segundo plano</Text>
        </View>
      </View>

      {/* Título de Sección */}
      <Text style={styles.sectionTitle}>Tu Credencial Digital</Text>

      {/* 2. Tarjeta de Identificación Universitaria Estilizada */}
      <View style={styles.credentialCard}>
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
          {/* Foto de Perfil */}
          <View style={styles.photoPlaceholder}>
            {fotoUrl ? (
              <Image
                source={{ uri: fotoUrl }}
                style={styles.photoImage}
                resizeMode="cover"
              />
            ) : (
              <Svg viewBox="0 0 24 24" width={44} height={44} fill="none" stroke="rgba(0, 78, 170, 0.4)" strokeWidth={1.5}>
                <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </Svg>
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
        
        <View style={styles.cardFooterBar} />
      </View>

      {/* 3. Historial de Puertas Abiertas Automáticamente */}
      <Text style={styles.sectionTitle}>Accesos Recientes (Manos Libres)</Text>
      
      <View style={styles.logsContainer}>
        <View style={styles.logRow}>
          <View style={[styles.logIndicator, { backgroundColor: COLORS.green }]} />
          <View style={styles.logInfo}>
            <Text style={styles.logTitle}>Puerta Laboratorio Norte</Text>
            <Text style={styles.logSubtitle}>Detectado por UWB • Acceso Concedido</Text>
          </View>
          <Text style={styles.logTime}>Hace 3 min</Text>
        </View>

        <View style={styles.logSeparator} />

        <View style={styles.logRow}>
          <View style={[styles.logIndicator, { backgroundColor: COLORS.green }]} />
          <View style={styles.logInfo}>
            <Text style={styles.logTitle}>Torniquete Acceso Principal</Text>
            <Text style={styles.logSubtitle}>Detectado por BLE • Acceso Concedido</Text>
          </View>
          <Text style={styles.logTime}>08:15 AM</Text>
        </View>

        <View style={styles.logSeparator} />

        <View style={styles.logRow}>
          <View style={[styles.logIndicator, { backgroundColor: COLORS.green }]} />
          <View style={styles.logInfo}>
            <Text style={styles.logTitle}>Biblioteca Central - Piso 2</Text>
            <Text style={styles.logSubtitle}>Detectado por BLE • Acceso Concedido</Text>
          </View>
          <Text style={styles.logTime}>Ayer</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 30,
  },
  statusBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 28,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 14,
    letterSpacing: -0.3,
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
  photoPlaceholder: {
    width: 80,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  photoImage: {
    width: 80,
    height: 100,
  },
  studentData: {
    flex: 1,
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 16,
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
