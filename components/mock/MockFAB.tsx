import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MockAccessState } from '@/hooks/useMockAccessLog';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface MockFABProps {
  onSelect: (estado: MockAccessState) => void;
}

interface SpeedDialItem {
  estado: MockAccessState;
  label: string;
  emoji: string;
  indicatorColor: string;
  chipBg: string;
}

// ─── Configuración de opciones del Speed Dial ─────────────────────────────────

const SPEED_DIAL_ITEMS: SpeedDialItem[] = [
  {
    estado: 'ACCESS_GRANTED',
    label: 'Acceso Concedido',
    emoji: '✅',
    indicatorColor: '#78BF26',
    chipBg: 'rgba(120,191,38,0.12)',
  },
  {
    estado: 'ACCESS_DENIED',
    label: 'Acceso Denegado',
    emoji: '❌',
    indicatorColor: '#D32F2F',
    chipBg: 'rgba(211,47,47,0.10)',
  },
  {
    estado: 'SEARCHING',
    label: 'Buscando Beacon',
    emoji: '🔍',
    indicatorColor: '#F59E0B',
    chipBg: 'rgba(245,158,11,0.12)',
  },
  {
    estado: 'CONNECTED',
    label: 'Conectado a Beacon',
    emoji: '📡',
    indicatorColor: '#004EAA',
    chipBg: 'rgba(0,78,170,0.10)',
  },
  {
    estado: 'TIMEOUT',
    label: 'Timeout/Sin respuesta',
    emoji: '⏱',
    indicatorColor: '#65676B',
    chipBg: 'rgba(101,103,107,0.10)',
  },
  {
    estado: 'EXPIRED',
    label: 'Credencial Vencida',
    emoji: '⚠️',
    indicatorColor: '#F59E0B',
    chipBg: 'rgba(245,158,11,0.12)',
  },
];

// ─── Constantes de animación ──────────────────────────────────────────────────

const CHIP_STAGGER_MS = 40;
const OPEN_DURATION_MS = 180;
const CLOSE_DURATION_MS = 100;
const FAB_COLOR_DURATION_MS = 200;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * FAB con Speed Dial de 6 estados de acceso simulables.
 * Gestiona internamente la visibilidad del menú y las animaciones.
 * Al seleccionar un estado: cierra el menú, dispara haptic y llama onSelect.
 */
export function MockFAB({ onSelect }: MockFABProps): React.ReactElement {
  const [menuVisible, setMenuVisible] = useState(false);

  // Animaciones individuales por chip: opacidad + translateY
  const chipAnims = useRef<{ opacity: Animated.Value; translateY: Animated.Value }[]>(
    SPEED_DIAL_ITEMS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  // Animación del backdrop
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Animación del color del FAB (0 = cerrado/azul, 1 = abierto/amber)
  const fabColorAnim = useRef(new Animated.Value(0)).current;

  const openMenu = useCallback(() => {
    setMenuVisible(true);

    // Backdrop fade in
    Animated.timing(backdropOpacity, {
      toValue: 1,
      duration: OPEN_DURATION_MS,
      useNativeDriver: true,
    }).start();

    // FAB color change
    Animated.timing(fabColorAnim, {
      toValue: 1,
      duration: FAB_COLOR_DURATION_MS,
      useNativeDriver: false,
    }).start();

    // Chips: stagger de entrada
    const chipAnimations = SPEED_DIAL_ITEMS.map((_, index) =>
      Animated.parallel([
        Animated.timing(chipAnims[index].opacity, {
          toValue: 1,
          duration: OPEN_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(chipAnims[index].translateY, {
          toValue: 0,
          duration: OPEN_DURATION_MS,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(CHIP_STAGGER_MS, chipAnimations).start();
  }, [backdropOpacity, chipAnims, fabColorAnim]);

  const closeMenu = useCallback((callback?: () => void) => {
    // Fade out rápido de todos los chips en paralelo
    const chipFadeOuts = SPEED_DIAL_ITEMS.map((_, index) =>
      Animated.parallel([
        Animated.timing(chipAnims[index].opacity, {
          toValue: 0,
          duration: CLOSE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(chipAnims[index].translateY, {
          toValue: 20,
          duration: CLOSE_DURATION_MS,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: CLOSE_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(fabColorAnim, {
        toValue: 0,
        duration: FAB_COLOR_DURATION_MS,
        useNativeDriver: false,
      }),
      ...chipFadeOuts,
    ]).start(() => {
      setMenuVisible(false);
      callback?.();
    });
  }, [backdropOpacity, chipAnims, fabColorAnim]);

  const handleFabPress = useCallback(() => {
    if (menuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [menuVisible, closeMenu, openMenu]);

  const handleChipSelect = useCallback(
    (estado: MockAccessState) => {
      closeMenu(() => {
        onSelect(estado);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      });
    },
    [closeMenu, onSelect]
  );

  // Interpolación del color de fondo del FAB: azul → amber
  const fabBackgroundColor = fabColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#004EAA', '#F59E0B'],
  });

  return (
    <>
      {/* Backdrop — montado solo cuando el menú está visible */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => closeMenu()}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Speed Dial chips — montados solo cuando el menú está visible */}
      {menuVisible && (
        <View style={styles.speedDialContainer} pointerEvents="box-none">
          {/* Badge "SIMULACION" encima de todos los chips */}
          <View style={styles.simulacionBadge}>
            <Text style={styles.simulacionBadgeText}>SIMULACION</Text>
          </View>

          {SPEED_DIAL_ITEMS.map((item, index) => (
            <Animated.View
              key={item.estado}
              style={[
                styles.chipWrapper,
                {
                  opacity: chipAnims[index].opacity,
                  transform: [{ translateY: chipAnims[index].translateY }],
                },
              ]}
            >
              <Pressable
                onPress={() => handleChipSelect(item.estado)}
                style={[styles.chip, { backgroundColor: item.chipBg }]}
              >
                {/* Etiqueta a la izquierda */}
                <Text style={[styles.chipLabel, { color: item.indicatorColor }]}>
                  {item.label}
                </Text>
                {/* Círculo con emoji a la derecha */}
                <View style={[styles.chipEmojiCircle, { backgroundColor: item.chipBg, borderColor: item.indicatorColor }]}>
                  <Text style={styles.chipEmoji}>{item.emoji}</Text>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      )}

      {/* FAB principal */}
      <Animated.View
        style={[
          styles.fab,
          { backgroundColor: fabBackgroundColor },
        ]}
      >
        <Pressable
          onPress={handleFabPress}
          style={styles.fabPressable}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {menuVisible ? (
            <Text style={styles.fabIconClose}>✕</Text>
          ) : (
            <Text style={styles.fabIcon}>🔑</Text>
          )}
        </Pressable>
      </Animated.View>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Backdrop semitransparente
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 30, 33, 0.35)',
    zIndex: 10,
  },

  // Contenedor de los chips: alineado a la derecha, empuja chips hacia arriba desde el FAB
  speedDialContainer: {
    position: 'absolute',
    right: 24,
    bottom: 96, // 24 (bottom FAB) + 60 (FAB height) + 12 (gap)
    alignItems: 'flex-end',
    zIndex: 20,
  },

  // Badge "SIMULACION" encima de los chips
  simulacionBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  simulacionBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Wrapper de cada chip (para la animación)
  chipWrapper: {
    marginBottom: 8,
    alignItems: 'flex-end',
  },

  // Chip pill
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    paddingLeft: 16,
    paddingRight: 4,
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 8,
    letterSpacing: -0.2,
  },

  // Círculo 40px con emoji
  chipEmojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  chipEmoji: {
    fontSize: 18,
  },

  // FAB principal
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  fabIcon: {
    fontSize: 26,
  },
  fabIconClose: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
