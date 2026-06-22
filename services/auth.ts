/**
 * Servicio de autenticación contra la API de Pasaporte UTEM (SIGA).
 */

const SIGA_LOGIN_URL = 'https://siga.utem.cl/servicios/autenticacion/login/';
const SIGA_CARRERAS_URL = 'https://siga.utem.cl/servicios/estudiante/carreras/';

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

export interface Carrera {
  id: number;
  codigo: string;
  nombre: string;
  estado: string;
  orden: number;
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

/**
 * Obtiene las carreras del estudiante autenticado.
 * @param token  Token de sesión SIGA
 * @returns Array de Carrera. Retorna [] si la respuesta viene vacía o nula.
 */
export async function getCarreras(token: string): Promise<Carrera[]> {
  const body = new URLSearchParams();
  body.append('token', token);

  const response = await fetch(SIGA_CARRERAS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new AuthError(
      `Error al obtener carreras (${response.status})`,
      response.status,
    );
  }

  const json = await response.json();
  const rawCarreras = json?.response;

  if (!rawCarreras || !Array.isArray(rawCarreras) || rawCarreras.length === 0) {
    return [];
  }

  return rawCarreras.map((item: {
    carrera_id: number;
    codigo_carrera: number;
    nombre_carrera: string;
    situacion_academica: string;
    orden: number;
  }): Carrera => ({
    id: item.carrera_id,
    codigo: item.codigo_carrera.toString(),
    nombre: item.nombre_carrera,
    estado: item.situacion_academica.trim(),
    orden: item.orden,
  }));
}
