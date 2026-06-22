import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) return;

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      // El error ya está en el contexto, no hace falta hacer nada más
    }
  };

  const handleEmailChange = (text: string) => {
    if (error) clearError();
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    if (error) clearError();
    setPassword(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido a Mi Acceso</Text>
        <Text style={styles.subtitle}>
          Inicia sesión con tu Pasaporte UTEM
        </Text>

        {/* Input de correo UTEM */}
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Correo UTEM (usuario@utem.cl)"
          placeholderTextColor="rgba(0, 78, 170, 0.4)"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!isLoading}
        />

        {/* Input de contraseña */}
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Contraseña Pasaporte"
          placeholderTextColor="rgba(0, 78, 170, 0.4)"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
          autoComplete="password"
          editable={!isLoading}
        />

        {/* Mensaje de error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Botón Ingresar */}
        <Pressable
          style={[
            styles.button,
            (isLoading || !email.trim() || !password) && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading || !email.trim() || !password}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>

        {/* Botón Volver */}
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Volver atrás</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#004EAA',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 78, 170, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 14,
    color: '#004EAA',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorContainer: {
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#004EAA',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#78BF26',
    fontSize: 14,
    fontWeight: '700',
  },
});
