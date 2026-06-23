<div align="center">

# 📱 Mi Acceso — UTEM

**Tu credencial universitaria digital. Abre puertas con tu teléfono mediante BLE y UWB sin necesidad de tarjeta física.**

[![License](https://img.shields.io/github/license/Im-Fran/mi-acceso)](LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://docs.expo.dev/versions/v54.0.0/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 Descripción general

**Mi Acceso** es la credencial universitaria digital de la [Universidad Tecnológica Metropolitana (UTEM)](https://www.utem.cl). Reemplaza la tarjeta física de acceso al campus al permitir que estudiantes y funcionarios abran puertas y registren ingresos directamente desde su teléfono mediante tecnología **BLE (Bluetooth Low Energy)** y **UWB (Ultra-Wideband)**.

La app autentica a los usuarios con el **Pasaporte UTEM** (sistema SIGA), muestra la credencial digital con código QR, y lleva un historial de accesos. Está construida con [Expo](https://expo.dev) SDK 54 y React Native, lo que le permite correr de forma nativa en **iOS y Android** desde una sola base de código en TypeScript.

La navegación está implementada con **Expo Router** (enrutamiento basado en archivos), la autenticación persiste de forma segura con `expo-secure-store`, y la interfaz se adapta automáticamente al modo oscuro o claro del dispositivo.

---

## ✨ Características

- **🔐 Autenticación con Pasaporte UTEM** — Inicio de sesión con las credenciales institucionales del sistema SIGA, con persistencia segura de la sesión entre aperturas de la app.
- **📲 Credencial digital con QR** — Visualiza tu carnet universitario digital con código QR escaneable desde cualquier lector del campus.
- **🚪 Acceso por BLE y UWB** — Desbloqueo de puertas con el teléfono como llave digital, sin depender de tarjeta física.
- **📋 Historial de accesos** — Registro completo de entradas y salidas con marca de tiempo.
- **🌗 Modo oscuro y claro** — La interfaz se adapta automáticamente al sistema del dispositivo.
- **📳 Retroalimentación háptica** — Vibración sutil al navegar entre pestañas en dispositivos compatibles.
- **🏗 Nueva Arquitectura de React Native** — Habilitada por defecto (`newArchEnabled: true`) para mejor rendimiento.
- **🧪 Sistema mock integrado** — Simulación de BLE/UWB para desarrollo y pruebas sin hardware físico.

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework móvil | React Native 0.81 |
| SDK y herramientas | Expo SDK 54 |
| Lenguaje | TypeScript 5.9 |
| Navegación | Expo Router 6 + React Navigation 7 |
| Autenticación | SIGA UTEM + expo-secure-store |
| Animaciones | React Native Reanimated 4 |
| Gestos | React Native Gesture Handler 2 |
| Gráficos / QR | react-native-svg + react-native-qrcode-svg |
| Iconos | Expo Symbols + @expo/vector-icons 15 |
| Web | React Native Web 0.21 |

---

## 📋 Requisitos previos

Antes de comenzar necesitas tener instalado:

- **Node.js** >= 18 (se recomienda la versión **20 LTS** o superior)
- **npm** >= 9 (viene incluido con Node.js)
- **Git**
- **Expo Go** en tu dispositivo físico — la forma más rápida de probar la app (ver más abajo)
- Para iOS nativo: **Xcode** (solo macOS)
- Para Android nativo: **Android Studio** con un emulador AVD configurado

---

## 🔧 Instalación de Node.js

Node.js es el entorno de ejecución necesario para correr las herramientas de desarrollo. Elige las instrucciones según tu sistema operativo:

### 🪟 Windows

**Opción A — Instalador oficial (recomendado para principiantes):**

1. Ve a [https://nodejs.org](https://nodejs.org) y descarga el instalador de la versión **LTS** (Long Term Support).
2. Ejecuta el archivo `.msi` descargado y sigue el asistente (deja todas las opciones por defecto).
3. Reinicia la terminal (PowerShell o CMD) y verifica la instalación:

```powershell
node --version
npm --version
```

**Opción B — Con `winget` (Windows 10/11):**

```powershell
winget install OpenJS.NodeJS.LTS
```

**Opción C — Con `nvm-windows` (para gestionar múltiples versiones):**

1. Descarga el instalador desde [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases) (`nvm-setup.exe`).
2. Instálalo y luego en PowerShell:

```powershell
nvm install 20
nvm use 20
```

---

### 🍎 macOS

**Opción A — Con Homebrew (recomendado):**

```bash
# Si no tienes Homebrew, instálalo primero:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Luego instala Node.js LTS:
brew install node@20
```

**Opción B — Con `nvm` (para gestionar múltiples versiones):**

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reinicia la terminal, luego:
nvm install 20
nvm use 20
nvm alias default 20
```

**Opción C — Instalador oficial:**

Descarga el paquete `.pkg` desde [https://nodejs.org](https://nodejs.org) (versión **LTS**) y sigue el asistente.

**Verifica la instalación:**

```bash
node --version   # debe mostrar v20.x.x o superior
npm --version    # debe mostrar 9.x.x o superior
```

---

### 🐧 Linux

**Ubuntu / Debian:**

```bash
# Usando el script oficial de NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

**Fedora / RHEL / CentOS:**

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

**Arch Linux:**

```bash
sudo pacman -S nodejs npm
```

**Con `nvm` (funciona en cualquier distribución):**

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reinicia la terminal, luego:
nvm install 20
nvm use 20
nvm alias default 20
```

---

## 📲 Expo Go — La forma más rápida de probar la app

> **¿No quieres instalar Xcode ni Android Studio?** Expo Go es la solución perfecta.

**Expo Go** es una app gratuita que te permite ejecutar cualquier proyecto Expo en tu teléfono real en segundos, sin compilación nativa. Solo escaneas el código QR que aparece en la terminal al correr `npm start` y la app se abre directamente en tu dispositivo.

| Plataforma | Descarga |
|-----------|---------|
| 📱 iOS | [Expo Go en App Store](https://apps.apple.com/app/expo-go/id982107779) |
| 🤖 Android | [Expo Go en Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) |

**Cómo usarlo:**

1. Instala **Expo Go** en tu teléfono desde la tienda correspondiente.
2. Corre `npm start` en la terminal de tu computador.
3. **iOS:** escanea el QR con la **cámara nativa** del iPhone (sin abrir ninguna app).
4. **Android:** abre **Expo Go** → toca **"Scan QR code"** → apunta al código QR.
5. ¡La app se carga en tu teléfono en segundos!

> ⚠️ Tu teléfono y tu computador deben estar conectados a la **misma red Wi-Fi** para que funcione.

---

## 🚀 Instalación del proyecto

Con Node.js instalado, sigue estos pasos:

### 1. Clona el repositorio

```bash
git clone https://github.com/Im-Fran/mi-acceso.git
cd mi-acceso
```

### 2. Instala las dependencias

```bash
npm install
```

> Este comando descarga todas las librerías necesarias en la carpeta `node_modules/`. Puede tardar un minuto la primera vez.

### 3. Inicia el servidor de desarrollo

```bash
npm start
```

Esto arranca **Metro Bundler** y muestra un código QR en la terminal. Desde aquí puedes elegir dónde abrir la app:

| Tecla | Acción |
|-------|--------|
| `i` | Abrir en simulador de iOS (requiere macOS + Xcode) |
| `a` | Abrir en emulador de Android (requiere Android Studio) |
| `w` | Abrir en el navegador web |
| `r` | Recargar la app |
| `m` | Alternar el menú de desarrollo |

**Con Expo Go:** escanea el código QR directamente con tu teléfono (ver sección Expo Go arriba).

---

## 🖥 Comandos disponibles

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia Metro Bundler con selector interactivo de plataforma |
| `npm run ios` | Abre directamente en simulador de iOS |
| `npm run android` | Abre directamente en emulador de Android |
| `npm run web` | Abre en el navegador web |
| `npm run lint` | Ejecuta ESLint para revisar el estilo del código |
| `npm run reset-project` | Limpia el código de plantilla inicial y deja el proyecto vacío |

---

## 🏗 Build para producción

La app usa [EAS Build](https://docs.expo.dev/build/introduction/) de Expo para generar los binarios de producción (`.ipa` / `.apk` / `.aab`) sin necesitar Xcode ni Android Studio instalados localmente.

### Con EAS Build (recomendado)

```bash
# Instalar EAS CLI globalmente (solo una vez)
npm install -g eas-cli

# Iniciar sesión en tu cuenta Expo
eas login

# Compilar para Android
eas build --platform android

# Compilar para iOS
eas build --platform ios
```

### Web estática

```bash
npx expo export --platform web
```

Los archivos generados quedan en `dist/` y pueden servirse con cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, etc.).

---

## 🗂 Estructura del proyecto

```
mi-acceso/
├── app/                          # Rutas de la app (Expo Router)
│   ├── _layout.tsx               # Layout raíz: providers y navegación
│   ├── index.tsx                 # Pantalla de bienvenida / splash
│   ├── login.tsx                 # Inicio de sesión con Pasaporte UTEM
│   ├── modal.tsx                 # Pantalla modal
│   └── (tabs)/                   # Pestañas principales
│       ├── _layout.tsx           # Barra de pestañas + guard de autenticación
│       ├── index.tsx             # Home
│       ├── credencial.tsx        # Credencial digital con QR
│       ├── historial.tsx         # Historial de accesos
│       └── settings.tsx          # Ajustes
├── components/                   # Componentes reutilizables
│   ├── mock/                     # Componentes del sistema de simulación BLE/UWB
│   └── ui/                       # Componentes base (iconos, collapsible)
├── context/                      # Contextos globales de React
│   ├── AuthContext.tsx           # Estado de autenticación
│   ├── MockAccessLogContext.tsx  # Log de accesos simulados
│   └── SettingsContext.tsx       # Preferencias del usuario
├── hooks/                        # Hooks personalizados
│   ├── use-color-scheme.ts       # Detección de tema del sistema
│   ├── use-theme-color.ts        # Color según tema activo
│   ├── useMockBLE.ts             # Simulación de BLE
│   └── useMockAccessLog.ts       # Log de accesos mock
├── services/                     # Capa de servicios externos
│   ├── auth.ts                   # Integración con SIGA UTEM
│   └── storage.ts                # Persistencia con expo-secure-store
├── constants/
│   └── theme.ts                  # Paleta de colores y tipografías UTEM
├── assets/images/                # Ícono, splash y recursos gráficos
├── app.json                      # Configuración de Expo
├── tsconfig.json                 # Configuración de TypeScript
└── package.json                  # Dependencias y scripts
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para proponer cambios:

1. Haz un fork del repositorio
2. Crea una rama descriptiva: `git checkout -b feat/nombre-funcionalidad`
3. Realiza tus cambios y confírmalos: `git commit -m "feat: descripción del cambio"`
4. Sube la rama: `git push origin feat/nombre-funcionalidad`
5. Abre un Pull Request hacia `dev`

---

## 🔗 Recursos útiles

- [Documentación Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Router — Guía de inicio](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Descargar Expo Go para iOS](https://apps.apple.com/app/expo-go/id982107779)
- [Descargar Expo Go para Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU General Public License v3.0** — consulta el archivo [LICENSE](LICENSE) para más detalles.

---

