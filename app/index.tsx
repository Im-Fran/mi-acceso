import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

// Paleta oficial UTEM 2025 del archivo utem-credential-mockups.html
const COLORS = {
  blue: '#004EAA',
  green: '#78BF26',
  white: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.6)',
  wmMuted: 'rgba(255,255,255,0.4)',
};

export default function HomeScreen() {
  const { isInitializing, token } = useAuth();

  // ─── Redirección automática si ya hay sesión activa ───────────────────────
  useEffect(() => {
    if (!isInitializing && token !== null) {
      router.replace('/(tabs)');
    }
  }, [isInitializing, token]);

  // ─── Splash de carga mientras se verifica la sesión guardada ─────────────
  if (isInitializing) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  // ─── Pantalla de bienvenida (sin sesión) ──────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Círculos decorativos de fondo */}
      <View style={styles.circleBottomRight} />
      <View style={styles.circleTopLeft} />

      {/* Contenido Principal */}
      <View style={styles.content}>

        {/* Escudo / Shield SVG */}
        <View style={styles.shieldContainer}>
          <Svg viewBox="0 0 44 48" width={56} height={60} fill="none">
            <Path
              d="M22 2L4 9v14c0 12 7.8 22.4 18 25 10.2-2.6 18-13 18-25V9L22 2z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
            />
            <Rect x="12" y="14" width="10" height="10" rx="1" fill="#004EAA" opacity={0.85} />
            <Rect x="20" y="10" width="8" height="8" rx="1" fill="#78BF26" opacity={0.9} />
            <Path d="M28 30c1.8-1.8 2.8-4.2 2.8-6.8" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
            <Path d="M30.5 32.5c3-3 4.5-7 4.5-11" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" />
          </Svg>
        </View>

        {/* Textos Informativos */}
        <Text style={styles.watermark}>Universidad Tecnológica Metropolitana</Text>
        <View style={styles.greenBar} />

        <Text style={styles.title}>UTEM Access</Text>
        <Text style={styles.description}>
          Tu credencial universitaria digital. Abre puertas con tu teléfono mediante BLE y UWB sin necesidad de tarjeta física.
        </Text>

        {/* Botón de Iniciar Sesión */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={() => {
            router.push('/login');
          }}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 28,
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  shieldContainer: {
    width: 76,
    height: 76,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  watermark: {
    color: COLORS.wmMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  greenBar: {
    width: 28,
    height: 3,
    backgroundColor: COLORS.green,
    borderRadius: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: '800',
  },
});
