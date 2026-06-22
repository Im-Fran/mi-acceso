import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  // Aquí volvimos a declarar los estados que se habían borrado
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}> 
        <Text style={styles.title}>Bienvenido a Mi Acceso</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        
        {/* Input de RUT */}
        <TextInput
          style={styles.input}
          placeholder="RUT usuario"
          placeholderTextColor="rgba(0, 78, 170, 0.4)"
          value={rut}
          onChangeText={setRut}
          autoCapitalize="none"
        />
        
        {/* Input de Contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña Pasaporte"
          placeholderTextColor="rgba(0, 78, 170, 0.4)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Botón Ingresar */}
        <Pressable 
          style={styles.button}
          onPress={() => {
            alert('¡Simulando ingreso con RUT: ' + rut + '!');
            router.replace('/(tabs)');
          }}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>

        {/* Botón Volver */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
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
  button: {
    width: '100%',
    backgroundColor: '#004EAA',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
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