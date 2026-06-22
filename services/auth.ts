/**
 * Servicio de autenticación contra la API de Pasaporte UTEM (SIGA).
 */

const SIGA_LOGIN_URL = 'https://siga.utem.cl/servicios/autenticacion/login/';

export interface DatosPersona {
  rut: string;
  nombre_completo: string;
  correo_personal: string;
  correo_utem: string;
  foto: string;
  perfiles: string[];
}

export interface SigaSession {
  token: string;
  datos_persona: DatosPersona;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Autentica al usuario contra SIGA UTEM.
 * @param email  Correo institucional UTEM (ej: usuario@utem.cl)
 * @param password  Contraseña del Pasaporte UTEM
 * @returns SigaSession con token y datos de la persona
 * @throws AuthError con status 401 si las credenciales son incorrectas
 */
export async function loginWithSIGA(
  email: string,
  password: string,
): Promise<SigaSession> {
  const body = new URLSearchParams();
  body.append('username', email.trim());
  body.append('password', password);

  const response = await fetch(SIGA_LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Host: 'siga.utem.cl',
      Cookie: 'SIGA=siga; Path=/',
    },
    body: body.toString(),
  });

  if (response.status === 401) {
    throw new AuthError('Credenciales incorrectas', 401);
  }

  if (!response.ok) {
    throw new AuthError(
      `Error del servidor (${response.status})`,
      response.status,
    );
  }

  const json = await response.json();
  const session: SigaSession = json?.response;

  if (!session?.token || !session?.datos_persona) {
    throw new AuthError('Respuesta inesperada del servidor', 500);
  }

  return session;
}
