# LLM.md — Guía completa para modelos de lenguaje

> Este archivo existe para que cualquier LLM que trabaje en este repositorio
> entienda exactamente qué es el proyecto, cómo está estructurado, qué
> comandos ejecutar y qué convenciones seguir. Léelo **completo** antes de
> generar cualquier código.

---

## 1. Qué es este proyecto

**Mi Acceso** es la credencial universitaria digital de la
**Universidad Tecnológica Metropolitana (UTEM)**. Permite a estudiantes y
funcionarios abrir puertas del campus desde su teléfono mediante Bluetooth
Low Energy (BLE) y Ultra-Wideband (UWB), sin tarjeta física.

Características principales:
- Autenticación con el **Pasaporte UTEM** (sistema SIGA).
- Credencial digital con código QR escaneable.
- Historial de accesos (mock en esta fase, BLE/UWB real a futuro).
- Modo mock que simula todo el sistema de acceso para desarrollo sin hardware.
- Modo oscuro/claro automático según el sistema operativo.
- Retroalimentación háptica al navegar.

---

## 2. Stack tecnológico exacto

| Capa | Tecnología | Versión exacta |
|---|---|---|
| Framework | React Native | `0.81.5` |
| SDK / tooling | Expo SDK | `~54.0.34` |
| Lenguaje | TypeScript | `~5.9.2` |
| Navegación | Expo Router | `~6.0.23` |
| Navegación base | React Navigation | `^7.x` |
| Animaciones | React Native Reanimated | `~4.1.1` |
| Gestos | React Native Gesture Handler | `~2.28.0` |
| QR | react-native-qrcode-svg | `^6.3.21` |
| SVG | react-native-svg | `15.12.1` |
| Almacenamiento seguro | expo-secure-store | `~15.0.8` |
| Almacenamiento general | @react-native-async-storage | `2.2.0` |
| Iconos (iOS SF Symbols) | expo-symbols | `~1.0.8` |
| Iconos (cross-platform) | @expo/vector-icons | `^15.0.3` |
| Web | react-native-web | `~0.21.0` |
| Runtime JS | React | `19.1.0` |

**Flags de Expo activados:**
- `newArchEnabled: true` — Nueva Arquitectura de React Native habilitada.
- `experiments.typedRoutes: true` — Rutas con tipado TypeScript.
- `experiments.reactCompiler: true` — Compilador de React habilitado.

> **IMPORTANTE**: Siempre consulta la documentación de Expo SDK 54 en
> `https://docs.expo.dev/versions/v54.0.0/` antes de escribir código que
> use APIs de Expo. No uses documentación de versiones anteriores.

---

## 3. Prerequisitos del entorno

Antes de ejecutar cualquier comando, el entorno necesita:

1. **Node.js >= 18** (recomendado: 20 LTS)
   ```bash
   node --version   # debe mostrar v18.x o superior
   ```

2. **npm >= 9** (incluido con Node.js 18+)
   ```bash
   npm --version    # debe mostrar 9.x o superior
   ```

3. **Git**
   ```bash
   git --version
   ```

4. Para probar en dispositivo físico: **Expo Go** instalado en el teléfono.

5. Para compilar iOS nativo: **Xcode** (solo macOS, Xcode 15+).

6. Para compilar Android nativo: **Android Studio** con un AVD configurado.

---

## 4. Instalación del proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/Im-Fran/mi-acceso.git
cd mi-acceso

# 2. Instalar dependencias
npm install

# 3. Verificar que no hay errores de tipos
npx tsc --noEmit
```

No existe ningún archivo `.env` ni archivo de secretos. La URL de la API
de SIGA está hardcodeada en `services/auth.ts`.

---

## 5. Comandos disponibles

Todos los comandos se ejecutan desde la raíz del proyecto.

| Comando | Qué hace |
|---|---|
| `npm start` | Inicia el servidor Metro + muestra QR para Expo Go |
| `npm run ios` | Abre el simulador de iOS (requiere macOS + Xcode) |
| `npm run android` | Abre el emulador Android (requiere Android Studio) |
| `npm run web` | Abre la app en el navegador |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto |
| `npm run reset-project` | Ejecuta `scripts/reset-project.js` — CUIDADO: resetea archivos de la app |

**El comando más usado en desarrollo es:**
```bash
npm start
```
Esto levanta Metro Bundler. Escanear el QR con Expo Go en el teléfono para
ver la app en tiempo real. Presionar `i` en la terminal para abrir iOS,
`a` para Android.

**No hay comando de tests** — no existe suite de pruebas automatizadas en
este momento.

---

## 6. Estructura de directorios

```
mi-acceso/
├── app/                        # Rutas (Expo Router — basado en archivos)
│   ├── _layout.tsx             # Layout raíz: proveedores globales + Stack navigator
│   ├── index.tsx               # Pantalla de bienvenida / splash (redirige según auth)
│   ├── login.tsx               # Pantalla de inicio de sesión con Pasaporte UTEM
│   ├── modal.tsx               # Pantalla modal de ejemplo
│   └── (tabs)/                 # Grupo de rutas con barra de pestañas
│       ├── _layout.tsx         # Layout de tabs: guard de auth + definición de pestañas
│       ├── index.tsx           # Dashboard principal (pestaña "Home")
│       ├── historial.tsx       # Historial completo de accesos (pestaña "Historial")
│       ├── credencial.tsx      # Credencial digital con QR grande (pestaña "Credencial")
│       └── settings.tsx        # Configuración y logout (pestaña "Ajustes")
│
├── components/                 # Componentes reutilizables
│   ├── mock/
│   │   └── MockFAB.tsx         # FAB con Speed Dial para simular estados de acceso
│   ├── ui/
│   │   ├── icon-symbol.tsx     # Iconos cross-platform (Android/web: MaterialIcons)
│   │   ├── icon-symbol.ios.tsx # Iconos iOS (SF Symbols via expo-symbols)
│   │   └── collapsible.tsx     # Acordeón colapsable
│   ├── external-link.tsx       # Link que abre el navegador externo
│   ├── haptic-tab.tsx          # Botón de tab con vibración háptica
│   ├── hello-wave.tsx          # Animación de saludo (onboarding)
│   ├── parallax-scroll-view.tsx# ScrollView con efecto parallax en el header
│   ├── themed-text.tsx         # Text que respeta el tema oscuro/claro
│   └── themed-view.tsx         # View que respeta el tema oscuro/claro
│
├── context/                    # React Contexts (estado global)
│   ├── AuthContext.tsx         # Estado de autenticación (token, user, carreras)
│   ├── SettingsContext.tsx     # Preferencias (manos libres, modo mock)
│   └── MockAccessLogContext.tsx# Historial simulado de accesos BLE/UWB
│
├── hooks/                      # Custom hooks
│   ├── use-color-scheme.ts     # Detecta el tema del sistema (nativo)
│   ├── use-color-scheme.web.ts # Detecta el tema del sistema (web)
│   ├── use-theme-color.ts      # Retorna el color correcto según el tema
│   ├── useMockAccessLog.ts     # Re-exporta el hook de MockAccessLogContext
│   └── useMockBLE.ts           # Simula datos BLE/UWB cíclicos cada 3 segundos
│
├── services/                   # Lógica de negocio / acceso a datos
│   ├── auth.ts                 # loginWithSIGA(), getCarreras() — llama a siga.utem.cl
│   └── storage.ts              # saveCredentials(), loadCredentials(), clearCredentials()
│
├── constants/
│   └── theme.ts                # (inferido) Colores del tema: Colors.light.tint, etc.
│
├── assets/                     # Imágenes, fuentes, splash
├── scripts/
│   └── reset-project.js        # Script de reset del proyecto
│
├── app.json                    # Configuración de Expo (slug, versión, plugins, EAS)
├── package.json                # Dependencias y scripts npm
├── tsconfig.json               # TypeScript: strict mode, alias @/* → ./
├── eslint.config.js            # ESLint con eslint-config-expo (flat config)
└── expo-env.d.ts               # Tipos generados por Expo Router (no editar)
```

---

## 7. Arquitectura de providers (orden obligatorio)

El árbol de providers en `app/_layout.tsx` tiene un orden específico que
**no debe cambiarse**:

```tsx
<AuthProvider>           // 1. Autenticación — otros providers pueden depender del user
  <SettingsProvider>     // 2. Preferencias — MockBLE depende de mockModeEnabled
    <MockAccessLogProvider>  // 3. Logs simulados
      <ThemeProvider>        // 4. Tema de navegación
        ...
      </ThemeProvider>
    </MockAccessLogProvider>
  </SettingsProvider>
</AuthProvider>
```

Cada provider expone su propio hook:
- `useAuth()` — desde `context/AuthContext`
- `useSettings()` — desde `context/SettingsContext`
- `useMockAccessLog()` — desde `context/MockAccessLogContext` o `hooks/useMockAccessLog`

**Regla**: Estos hooks solo funcionan dentro de sus respectivos providers.
Si se usan fuera, lanzan un error descriptivo en español.

---

## 8. Sistema de rutas (Expo Router)

Expo Router usa el sistema de archivos como definición de rutas. Las reglas:

| Archivo | URL / ruta |
|---|---|
| `app/index.tsx` | `/` (pantalla inicial) |
| `app/login.tsx` | `/login` |
| `app/(tabs)/index.tsx` | `/(tabs)` o simplemente `/` dentro del grupo |
| `app/(tabs)/historial.tsx` | `/(tabs)/historial` |
| `app/(tabs)/credencial.tsx` | `/(tabs)/credencial` |
| `app/(tabs)/settings.tsx` | `/(tabs)/settings` |
| `app/modal.tsx` | `/modal` |

**Paréntesis en el nombre de carpeta** (`(tabs)`) = grupo de rutas. El
nombre de la carpeta NO aparece en la URL, solo agrupa pantallas bajo el
mismo layout.

**Navegación programática:**
```tsx
import { router } from 'expo-router';
import { useRouter } from 'expo-router';

router.replace('/(tabs)');          // reemplaza sin historial
router.push('/(tabs)/credencial'); // agrega al historial
router.back();                     // vuelve atrás

// O con el hook:
const router = useRouter();
router.push('/login');
```

**Redirección declarativa** (preferida dentro de componentes):
```tsx
import { Redirect } from 'expo-router';
if (!token) return <Redirect href="/login" />;
```

---

## 9. Flujo de autenticación

```
App arranca
    │
    ▼
AuthProvider monta → llama restaurarSesion()
    │
    ├─ loadCredentials() retorna null → isInitializing=false → app/index.tsx → /login
    │
    └─ loadCredentials() retorna {email, password}
          │
          ├─ loginWithSIGA(email, password) falla → clearCredentials() → /login
          │
          └─ loginWithSIGA OK → setState(token, user, carreras) → /(tabs)
                                        (isInitializing=false)
```

**Guard de autenticación** en `app/(tabs)/_layout.tsx`:
```tsx
const { token } = useAuth();
if (!token) return <Redirect href="/login" />;
```

Si `token` es null, el usuario no puede acceder a ninguna pestaña.

**Para hacer logout:**
```tsx
const { logout } = useAuth();
await logout(); // borra SecureStore + resetea estado → redirige a /login automáticamente
```

---

## 10. Servicios externos

### SIGA UTEM (autenticación)

Archivo: `services/auth.ts`

```typescript
// Login
const session = await loginWithSIGA('usuario@utem.cl', 'contraseña');
// session.token: string
// session.datos_persona: { rut, nombre_completo, correo_personal, correo_utem, foto, perfiles }

// Carreras del estudiante
const carreras = await getCarreras(session.token);
// carreras[]: { id, codigo, nombre, estado, orden }
```

Endpoints reales:
- `POST https://siga.utem.cl/servicios/autenticacion/login/` — body: `username` + `password` (form-encoded)
- `POST https://siga.utem.cl/servicios/estudiante/carreras/` — body: `token` (form-encoded)

Errores: lanza `AuthError` con `.status` (número HTTP) y `.message`.

### Almacenamiento seguro

Archivo: `services/storage.ts`

```typescript
await saveCredentials(email, password);       // guarda en Keychain/Keystore
const creds = await loadCredentials();        // null si no hay nada guardado
await clearCredentials();                     // borra credenciales
```

La clave interna de SecureStore es `'siga_credentials'`.

---

## 11. Sistema Mock (desarrollo sin hardware BLE/UWB)

El modo mock permite probar toda la app **sin hardware físico** y sin
credenciales SIGA reales. Se activa desde **Ajustes → Modo Mock BLE/UWB**.

### Activar el modo mock

1. Iniciar sesión (o usar credenciales reales de UTEM).
2. Ir a la pestaña **Ajustes**.
3. Activar el toggle **"Modo Mock BLE/UWB"**.
4. Volver al **Dashboard (Home)**.

Cuando el modo mock está activo:
- Aparece un **panel amarillo** con datos BLE simulados (RSSI, distancia, device ID).
- Aparece un **FAB azul** con ícono 🔑 en la esquina inferior derecha.
- Presionar el FAB expande un **Speed Dial** con 6 opciones de estado.

### Estados simulables con el FAB

| Estado | Emoji | Resultado en historial |
|---|---|---|
| `ACCESS_GRANTED` | ✅ | Entrada "Concedido" |
| `ACCESS_DENIED` | ❌ | Entrada "Rechazado" |
| `SEARCHING` | 🔍 | Entrada "Pendiente" |
| `CONNECTED` | 📡 | Entrada "Concedido" |
| `TIMEOUT` | ⏱ | Entrada "Rechazado" |
| `EXPIRED` | ⚠️ | Entrada "Rechazado" |

### Hooks del sistema mock

```typescript
// En cualquier componente dentro de los providers:

const bleData = useMockBLE();
// null si mockModeEnabled === false
// { rssi: number, distance: number, deviceId: string, status: 'CONECTADO' | 'BUSCANDO' }
// Cambia cada 3 segundos con valores cíclicos predefinidos

const { mockLogs, addMockLog } = useMockAccessLog();
// mockLogs: MockLogEntry[] — ordenados de más reciente a más antiguo
// addMockLog('ACCESS_GRANTED') — agrega una entrada al historial
```

### Persistencia del mock

- Los logs se guardan en **AsyncStorage** con la clave `'mock_access_logs'`.
- La primera vez que abre la app, genera datos base para los últimos 30 días
  (solo lunes a viernes, 2–5 entradas por día).
- Las preferencias (`manos_libres_enabled`, `mock_mode_enabled`) también se
  guardan en AsyncStorage.

---

## 12. Alias de importación

El `tsconfig.json` define el alias `@/*` que apunta a la raíz del proyecto:

```json
"paths": {
  "@/*": ["./*"]
}
```

**Siempre usar el alias en lugar de rutas relativas:**

```typescript
// ✅ Correcto
import { useAuth } from '@/context/AuthContext';
import { saveCredentials } from '@/services/storage';
import { MockFAB } from '@/components/mock/MockFAB';

// ❌ Incorrecto — no usar rutas relativas
import { useAuth } from '../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
```

---

## 13. Convenciones de código

### TypeScript

- `strict: true` está habilitado. Todo debe estar tipado.
- No usar `any`. Usar tipos concretos o genéricos.
- Exportar interfaces y tipos cuando otros archivos los necesiten.

### Componentes

- Componentes funcionales con arrow functions o `function` declaraciones.
- Un componente por archivo (los sub-componentes pequeños pueden ir en el
  mismo archivo si son internos).
- Nombres de archivos: **kebab-case** para componentes generales
  (`haptic-tab.tsx`), **PascalCase** para componentes específicos de una
  feature (`MockFAB.tsx`).

### Estilos

- Usar `StyleSheet.create({})` **siempre**. No pasar objetos de estilo
  inline a props (salvo valores dinámicos como colores calculados).
- Los estilos van al **final del archivo**, después del componente.
- Tokens de color: cada pantalla define su propio objeto `COLORS` local.
  Los colores del tema global están en `constants/theme.ts`.

### Colores del proyecto

| Uso | Hex |
|---|---|
| Azul principal UTEM | `#004EAA` |
| Verde UTEM | `#78BF26` |
| Fondo claro | `#F4F6F9` |
| Texto oscuro | `#1C1E21` |
| Texto atenuado | `#65676B` |
| Error / rojo | `#D32F2F` |
| Advertencia / ámbar | `#F59E0B` |

### Strings

- Todos los textos visibles al usuario están en **español**.
- Los comentarios de código también están en español.
- Los nombres de variables, funciones y tipos están en **inglés o español
  descriptivo** (el proyecto mezcla ambos — seguir el estilo del archivo
  que se esté editando).

### Hooks

- Los hooks personalizados van en `/hooks/`.
- Nomenclatura: `useCamelCase`.
- Si un hook depende de un context, debe verificar que el context no sea
  null y lanzar un error descriptivo si se usa fuera del provider.

### Imports

Orden de imports (de arriba a abajo):
1. React y hooks de React
2. React Native
3. Expo packages
4. Librerías de terceros
5. Imports internos con alias `@/`

---

## 14. Patrones que NO debes usar

| ❌ Incorrecto | ✅ Correcto |
|---|---|
| `router.replace()` antes de que el Stack esté montado | `<Redirect href="..." />` |
| Estilos inline `style={{ flex: 1 }}` (para estilos estáticos) | `styles.container` vía `StyleSheet.create` |
| Importaciones relativas `../context/AuthContext` | `@/context/AuthContext` |
| `useContext(AuthContext)` directamente | `useAuth()` |
| Componentes de clase | Componentes funcionales |
| `router.navigate()` para cambiar de tab | `router.push('/(tabs)/historial')` |
| Modificar `expo-env.d.ts` manualmente | Dejar que Expo Router lo genere |

---

## 15. Cómo agregar una nueva pantalla

### Pantalla independiente (modal o flow)

1. Crear `app/nueva-pantalla.tsx` con un componente `export default`.
2. Si necesita header, configurarlo en `app/_layout.tsx` con `<Stack.Screen name="nueva-pantalla" options={{ title: 'Mi Pantalla' }} />`.
3. Navegar con `router.push('/nueva-pantalla')`.

### Nueva pestaña en el tab bar

1. Crear `app/(tabs)/nueva-pestaña.tsx` con un componente `export default`.
2. Agregar en `app/(tabs)/_layout.tsx`:
   ```tsx
   <Tabs.Screen
     name="nueva-pestaña"
     options={{
       title: 'Mi Pestaña',
       tabBarIcon: ({ color }) => <IconSymbol size={28} name="nombre.sf.symbol" color={color} />,
     }}
   />
   ```

---

## 16. Cómo agregar un nuevo context / provider

1. Crear `context/MiContext.tsx`:
   ```typescript
   const MiContext = createContext<MiContextValue | null>(null);

   export function MiProvider({ children }: { children: React.ReactNode }) {
     // ... estado y lógica
     return <MiContext.Provider value={value}>{children}</MiContext.Provider>;
   }

   export function useMi(): MiContextValue {
     const ctx = useContext(MiContext);
     if (!ctx) throw new Error('useMi debe usarse dentro de <MiProvider>');
     return ctx;
   }
   ```

2. Envolver en `app/_layout.tsx` **dentro del orden correcto** de providers.

---

## 17. Íconos

### iOS (SF Symbols)
Usar `<IconSymbol>` desde `@/components/ui/icon-symbol`:
```tsx
<IconSymbol name="house.fill" size={28} color="#004EAA" />
```
Los nombres son SF Symbol names (ej: `house.fill`, `clock.fill`, `qrcode`,
`gearshape.fill`, `antenna.radiowaves.left.and.right`, `wifi`).

### Android y Web
El mismo componente `<IconSymbol>` usa MaterialIcons en Android/web
(definidos en `components/ui/icon-symbol.tsx`). Si agregas un ícono nuevo,
actualiza el mapeo en **ambos** archivos: `icon-symbol.tsx` y
`icon-symbol.ios.tsx`.

---

## 18. Modo oscuro / claro

- Usar `useColorScheme()` de `@/hooks/use-color-scheme` para detectar el tema.
- Usar `useThemeColor()` de `@/hooks/use-theme-color` para obtener colores adaptativos.
- Usar `<ThemedText>` y `<ThemedView>` para componentes que deben adaptarse
  automáticamente.
- El tema se aplica automáticamente según `userInterfaceStyle: "automatic"` en `app.json`.

---

## 19. Datos del usuario autenticado

Cuando el usuario está autenticado, `useAuth()` retorna:

```typescript
const {
  token,          // string | null — JWT de SIGA
  user,           // DatosPersona | null
  carreras,       // Carrera[]
  isLoading,      // boolean — true durante login
  isInitializing, // boolean — true mientras se restaura la sesión al inicio
  error,          // string | null — mensaje de error del último login
  login,          // (email, password) => Promise<void>
  logout,         // () => Promise<void>
  clearError,     // () => void
} = useAuth();
```

`user` tiene la forma:
```typescript
interface DatosPersona {
  rut: string;              // "12.345.678-9" (formateado con puntos y guión)
  nombre_completo: string;  // "NOMBRE APELLIDO APELLIDO" (mayúsculas)
  correo_personal: string;  // "correo@gmail.com"
  correo_utem: string;      // "nombre.apellido@utem.cl"
  foto: string;             // URL de la foto o string vacío
  perfiles: string[];       // ej: ["ALUMNO"]
}
```

`carreras[0]` o la carrera con `orden === 1` es la carrera principal del alumno.

---

## 20. Configuración de EAS Build

El proyecto tiene EAS configurado con el proyecto ID:
`de01dfd6-7d39-4c8a-94c4-be6c6fa56042` (owner: `exdevutem`).

Para builds de producción se usa EAS Build. En desarrollo local, Expo Go
es suficiente para la mayoría de funcionalidades (excepto BLE/UWB nativo).

---

## 21. Qué falta implementar (contexto para el LLM)

Las siguientes características son simuladas (mock) y **no tienen
implementación real** todavía:

- **BLE y UWB real**: `useMockBLE.ts` simula datos. La implementación real
  requeriría librerías nativas de BLE (como `react-native-ble-plx`) y UWB
  SDK específico del hardware de las puertas UTEM.
- **Backend de acceso**: Los logs de acceso son generados aleatoriamente en
  `MockAccessLogContext`. En producción se consumiría una API real.
- **Push notifications**: No implementadas.
- **Actualización de foto de perfil**: No implementada.

---

## 22. Checklist antes de hacer commit

- [ ] `npx tsc --noEmit` no muestra errores de TypeScript.
- [ ] `npm run lint` no muestra errores de ESLint.
- [ ] Los imports usan el alias `@/` (no rutas relativas).
- [ ] Los estilos están en `StyleSheet.create({})`.
- [ ] Los textos visibles al usuario están en español.
- [ ] Los nuevos hooks verifican el context y lanzan un error si está fuera del provider.
- [ ] No se agregaron dependencias innecesarias.
- [ ] Si se agregó una nueva pantalla de tab, se actualizó `(tabs)/_layout.tsx`.
- [ ] Si se agregó un nuevo ícono, se actualizó tanto `icon-symbol.tsx` como `icon-symbol.ios.tsx`.
