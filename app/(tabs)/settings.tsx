import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ─── Tokens de color ──────────────────────────────────────────────────────────

const COLORS = {
  blue:        '#004EAA',
  green:       '#78BF26',
  white:       '#FFFFFF',
  bgLight:     '#F4F6F9',
  textDark:    '#1C1E21',
  textMuted:   '#65676B',
  borderLight: 'rgba(0, 78, 170, 0.1)',
  danger:      '#D32F2F',
  dangerBg:    'rgba(211, 47, 47, 0.08)',
  avatarBg:    'rgba(0, 78, 170, 0.1)',
  toggleOff:   '#D1D5DB',
};

// ─── Utilidades ───────────────────────────────────────────────────────────────

function getInitials(nombreCompleto: string): string {
  const parts = nombreCompleto.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

// ─── Componentes internos ─────────────────────────────────────────────────────

interface ProfileCardProps {
  nombreCompleto: string;
  correoUtem: string;
  rut: string;
  fotoUrl: string | null;
}

function ProfileCard({ nombreCompleto, correoUtem, rut, fotoUrl }: ProfileCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const mostrarFoto = fotoUrl !== null && !avatarError;

  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        {mostrarFoto ? (
          <Image
            source={{ uri: fotoUrl as string }}
            style={styles.avatarImage}
            resizeMode="cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <Text style={styles.avatarInitials}>{getInitials(nombreCompleto)}</Text>
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{nombreCompleto}</Text>
        <Text style={styles.profileEmail}>{correoUtem}</Text>
        <Text style={styles.profileRut}>{rut}</Text>
      </View>
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

interface ToggleRowProps {
  iconName: 'antenna.radiowaves.left.and.right' | 'location.viewfinder';
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

function ToggleRow({ iconName, title, subtitle, value, onValueChange }: ToggleRowProps) {
  const iconContainerStyle = value
    ? [styles.iconContainer, styles.iconContainerOn]
    : [styles.iconContainer, styles.iconContainerOff];

  const iconColor = value ? COLORS.blue : COLORS.textMuted;
  const titleColor = value ? COLORS.textDark : COLORS.textMuted;

  return (
    <View style={styles.toggleRow}>
      <View style={iconContainerStyle}>
        <IconSymbol name={iconName} size={22} color={iconColor} />
      </View>
      <View style={styles.toggleTextBlock}>
        <Text style={[styles.toggleTitle, { color: titleColor }]}>{title}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.toggleOff, true: 'rgba(0, 78, 170, 0.35)' }}
        thumbColor={value ? COLORS.blue : COLORS.white}
        ios_backgroundColor={COLORS.toggleOff}
      />
    </View>
  );
}

function RowSeparator() {
  return <View style={styles.rowSeparator} />;
}

interface ActionRowProps {
  onPress: () => void;
}

function ActionRow({ onPress }: ActionRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.6 : 1 }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, styles.iconContainerDanger]}>
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color={COLORS.danger} />
      </View>
      <Text style={styles.actionText}>Cerrar Sesión</Text>
    </Pressable>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { manoLibresEnabled, setManoLibresEnabled } = useSettings();

  const version = Constants.expoConfig?.version ?? '1.0.0';

  const nombreCompleto = user?.nombre_completo ?? '';
  const correoUtem = user?.correo_utem ?? '';
  const rut = user?.rut ?? '';
  const fotoUrl = user?.foto && user.foto.trim() !== '' ? user.foto : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ProfileCard
        nombreCompleto={nombreCompleto}
        correoUtem={correoUtem}
        rut={rut}
        fotoUrl={fotoUrl}
      />

      <SectionHeader title="ACCESO INTELIGENTE" />
      <View style={styles.settingsCard}>
        <ToggleRow
          iconName="antenna.radiowaves.left.and.right"
          title="Acceso Manos Libres"
          subtitle="Transmite señal BLE/UWB en segundo plano"
          value={manoLibresEnabled}
          onValueChange={setManoLibresEnabled}
        />
      </View>

      <SectionHeader title="CUENTA" />
      <View style={styles.settingsCard}>
        <ActionRow onPress={logout} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Mi Acceso · v{version}</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ProfileCard
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 28,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.avatarBg,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 72,
    height: 72,
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.blue,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  profileRut: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },

  // SectionHeader
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  // SettingsCard
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 24,
    overflow: 'hidden',
  },

  // ToggleRow
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerOn: {
    backgroundColor: 'rgba(0, 78, 170, 0.1)',
  },
  iconContainerOff: {
    backgroundColor: 'rgba(101, 103, 107, 0.1)',
  },
  iconContainerDanger: {
    backgroundColor: COLORS.dangerBg,
  },
  toggleTextBlock: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // RowSeparator
  rowSeparator: {
    height: 1,
    backgroundColor: COLORS.bgLight,
    marginHorizontal: 16,
  },

  // ActionRow
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
