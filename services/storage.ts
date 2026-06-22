/**
 * Servicio de almacenamiento seguro usando expo-secure-store.
 * Persiste credenciales en Keychain (iOS) / Keystore (Android).
 */

import * as SecureStore from 'expo-secure-store';

// ─── Constantes ───────────────────────────────────────────────────────────────

const CREDENTIALS_KEY = 'siga_credentials';

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface StoredCredentials {
  email: string;
  password: string;
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Guarda las credenciales del usuario en el almacenamiento seguro del dispositivo.
 */
export async function saveCredentials(
  email: string,
  password: string,
): Promise<void> {
  const payload: StoredCredentials = { email, password };
  await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(payload));
}

/**
 * Carga las credenciales guardadas. Retorna null si no existen.
 */
export async function loadCredentials(): Promise<StoredCredentials | null> {
  const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredCredentials;
    if (!parsed?.email || !parsed?.password) return null;
    return parsed;
  } catch {
    // JSON malformado — limpiamos y devolvemos null
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
    return null;
  }
}

/**
 * Elimina las credenciales guardadas del almacenamiento seguro.
 */
export async function clearCredentials(): Promise<void> {
  await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
}
