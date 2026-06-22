import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { useAuth } from '@/context/AuthContext';

// ─── Colores UTEM ─────────────────────────────────────────────────────────────

const UTEM_BLUE = '#004EAA';
const UTEM_GREEN = '#78BF26';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extrae los dígitos del RUT descartando el DV.
 * Entrada:  "12.345.678-9"
 * Salida:   "12345678"
 */
function parseRutForQr(rut: string): string {
  // Eliminar puntos, luego tomar solo la parte antes del guion
  return rut.replace(/\./g, '').split('-')[0];
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export default function CredencialScreen() {
  const { user, carreras } = useAuth();

  const carrera = useMemo(
    () => carreras.find((c) => c.orden === 1) ?? carreras[0] ?? null,
    [carreras],
  );

  const qrValue = useMemo(
    () => (user?.rut ? parseRutForQr(user.rut) : ''),
    [user?.rut],
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={UTEM_BLUE} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* ── Tarjeta ── */}
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerAccent} />
            <Text style={styles.headerTitle}>Credencial Digital</Text>
            <Text style={styles.headerSubtitle}>Universidad Tecnológica Metropolitana</Text>
          </View>

          {/* Foto */}
          {user.foto ? (
            <Image
              source={{ uri: user.foto }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
              <Text style={styles.photoPlaceholderText}>
                {user.nombre_completo?.charAt(0) ?? '?'}
              </Text>
            </View>
          )}

          {/* Nombre */}
          <Text style={styles.name}>{user.nombre_completo}</Text>

          {/* Carrera */}
          {carrera && (
            <View style={styles.carreraContainer}>
              <Text style={styles.carreraLabel}>Carrera</Text>
              <Text style={styles.carreraName}>{carrera.nombre}</Text>
            </View>
          )}

          {/* Divisor */}
          <View style={styles.divider} />

          {/* RUT */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>RUT</Text>
            <Text style={styles.infoValue}>{user.rut}</Text>
          </View>

          {/* Estado */}
          {carrera?.estado && (
            <View style={styles.estadoBadge}>
              <Text style={styles.estadoText}>{carrera.estado}</Text>
            </View>
          )}

          {/* Divisor */}
          <View style={styles.divider} />

          {/* QR */}
          <View style={styles.qrContainer}>
            <Text style={styles.qrLabel}>Código QR de identificación</Text>
            {qrValue ? (
              <QRCode
                value={qrValue}
                size={200}
                color={UTEM_BLUE}
                backgroundColor="white"
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrPlaceholderText}>Sin datos</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerAccent} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Tarjeta
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  // Header
  header: {
    backgroundColor: UTEM_BLUE,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: UTEM_GREEN,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  // Foto
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    marginTop: 24,
    borderWidth: 3,
    borderColor: UTEM_BLUE,
  },
  photoPlaceholder: {
    backgroundColor: '#E8EEF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 40,
    fontWeight: '700',
    color: UTEM_BLUE,
  },

  // Nombre
  name: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 14,
    marginHorizontal: 24,
  },

  // Carrera
  carreraContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 24,
  },
  carreraLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  carreraName: {
    fontSize: 14,
    fontWeight: '600',
    color: UTEM_BLUE,
    textAlign: 'center',
    marginTop: 2,
  },

  // Divisor
  divider: {
    height: 1,
    backgroundColor: '#E8EEF6',
    marginHorizontal: 24,
    marginVertical: 16,
  },

  // Fila info
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  // Estado badge
  estadoBadge: {
    alignSelf: 'center',
    backgroundColor: '#EAF6D5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: UTEM_GREEN,
  },
  estadoText: {
    color: '#3A6B0C',
    fontSize: 13,
    fontWeight: '600',
  },

  // QR
  qrContainer: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingHorizontal: 24,
  },
  qrLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  qrPlaceholderText: {
    color: '#888',
    fontSize: 14,
  },

  // Footer
  footer: {
    marginTop: 20,
  },
  footerAccent: {
    height: 6,
    backgroundColor: UTEM_GREEN,
  },
});
