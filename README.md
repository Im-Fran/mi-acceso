<div align="center">

# Mi Acceso

**Aplicacion movil multiplataforma construida con Expo y React Native.**

[![License](https://img.shields.io/github/license/Im-Fran/mi-acceso)](LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://docs.expo.dev/versions/v54.0.0/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## Descripcion general

**Mi Acceso** es una aplicacion movil desarrollada con [Expo](https://expo.dev) SDK 54 y React Native. Corre de forma nativa en iOS y Android, y tambien como aplicacion web estatica, todo desde una unica base de codigo en TypeScript.

La navegacion esta construida con [Expo Router](https://docs.expo.dev/router/introduction/), que implementa enrutamiento basado en archivos al estilo de Next.js. La interfaz cuenta con soporte completo de modo oscuro y claro, animaciones mediante `react-native-reanimated`, retroalimentacion haptica en las pestanas de navegacion, y una arquitectura de componentes tematizados lista para escalar.

El proyecto tiene habilitada la Nueva Arquitectura de React Native (`newArchEnabled: true`) y el React Compiler experimental, lo que lo posiciona sobre las bases mas modernas del ecosistema.

---

## Caracteristicas

- **Navegacion por archivos** — Expo Router convierte la estructura de carpetas en rutas de navegacion, sin configuracion manual de navegadores.
- **Soporte iOS, Android y web** — Una sola base de codigo que compila para las tres plataformas.
- **Modo oscuro y claro automatico** — El hook `useColorScheme` adapta la interfaz al sistema del dispositivo sin configuracion adicional.
- **Animaciones con Reanimated** — `react-native-reanimated` 4.x integrado para animaciones fluidas en el hilo de UI.
- **Retroalimentacion haptica** — Las pestanas de navegacion emiten feedback tactil en dispositivos que lo soportan.
- **Iconos nativos** — `expo-symbols` e `@expo/vector-icons` disponibles para iconografia multiplataforma.
- **Nueva Arquitectura de React Native** — Habilitada por defecto para mejor rendimiento y compatibilidad futura.
- **TypeScript estricto** — Configuracion `strict: true` y alias de rutas (`@/*`) preconfigurados.

---

## Stack tecnologico

| Capa | Tecnologia |
|------|-----------|
| Framework movil | React Native 0.81 |
| SDK y herramientas | Expo SDK 54 |
| Lenguaje | TypeScript 5.9 |
| Navegacion | Expo Router 6 + React Navigation 7 |
| Animaciones | React Native Reanimated 4 |
| Gestos | React Native Gesture Handler 2 |
| Iconos | Expo Symbols + @expo/vector-icons 15 |
| Web | React Native Web 0.21 |

---

## Requisitos previos

Antes de comenzar, asegurate de tener instalado:

- **Node.js** >= 18 (recomendado 20 LTS o superior)
- **npm** >= 9
- **Git**
- **Expo Go** en tu dispositivo fisico ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), o un simulador/emulador configurado localmente
- Para iOS nativo: **Xcode** (solo macOS)
- Para Android nativo: **Android Studio** con un emulador AVD configurado

---

## Instalacion

### 1. Clonar el repositorio

```bash
git clone git@github.com:Im-Fran/mi-acceso.git
cd mi-acceso
```

### 2. Instalar dependencias

```bash
npm install
```

---

## Ejecucion en desarrollo

### Iniciar el servidor de desarrollo

```bash
npm start
```

Esto inicia **Metro Bundler**. Desde la terminal podras elegir donde abrir la app:

| Tecla | Accion |
|-------|--------|
| `i` | Abrir en simulador de iOS |
| `a` | Abrir en emulador de Android |
| `w` | Abrir en el navegador web |
| `r` | Recargar la app |
| `m` | Alternar el menu de desarrollo |

### Abrir directamente en una plataforma

```bash
# Solo iOS (requiere macOS y Xcode)
npm run ios

# Solo Android (requiere Android Studio o dispositivo fisico)
npm run android

# Solo web
npm run web
```

### Escanear con Expo Go

Al ejecutar `npm start`, aparecera un codigo QR en la terminal. Escanéalo con la camara de tu iPhone (iOS) o con la app Expo Go (Android) para previsualizar la app en tu dispositivo fisico sin compilacion nativa.

---

## Estructura del proyecto

```
mi-acceso/
├── app/                    # Rutas de la aplicacion (Expo Router)
│   ├── _layout.tsx         # Layout raiz: providers, navegacion de pila
│   ├── modal.tsx           # Pantalla modal de ejemplo
│   └── (tabs)/             # Grupo de pestanas (tab navigator)
│       ├── _layout.tsx     # Configuracion de la barra de pestanas
│       ├── index.tsx       # Pantalla principal (Home)
│       └── explore.tsx     # Pantalla Explore
├── components/             # Componentes reutilizables
│   ├── external-link.tsx   # Enlace que abre el navegador del sistema
│   ├── haptic-tab.tsx      # Boton de pestana con feedback haptico
│   ├── hello-wave.tsx      # Animacion de saludo (Reanimated)
│   ├── parallax-scroll-view.tsx  # ScrollView con efecto parallax en cabecera
│   ├── themed-text.tsx     # Texto adaptado al tema claro/oscuro
│   ├── themed-view.tsx     # Contenedor adaptado al tema claro/oscuro
│   └── ui/
│       ├── collapsible.tsx       # Seccion expandible/colapsable
│       ├── icon-symbol.tsx       # Icono multiplataforma (Android/Web)
│       └── icon-symbol.ios.tsx   # Icono nativo SF Symbols (iOS)
├── constants/
│   └── theme.ts            # Paleta de colores y tipografias del sistema
├── hooks/
│   ├── use-color-scheme.ts      # Hook para detectar tema del sistema
│   ├── use-color-scheme.web.ts  # Variante para web
│   └── use-theme-color.ts       # Hook para obtener color segun el tema activo
├── assets/
│   └── images/             # Iconos, splash screen y recursos graficos
├── scripts/
│   └── reset-project.js    # Script para limpiar el proyecto de plantilla
├── app.json                # Configuracion de la app para Expo
├── tsconfig.json           # Configuracion de TypeScript
└── package.json            # Dependencias y scripts
```

---

## Scripts disponibles

| Script | Comando | Descripcion |
|--------|---------|-------------|
| `start` | `npm start` | Inicia Metro Bundler con opciones interactivas |
| `ios` | `npm run ios` | Abre directamente en simulador de iOS |
| `android` | `npm run android` | Abre directamente en emulador de Android |
| `web` | `npm run web` | Abre en el navegador web |
| `lint` | `npm run lint` | Ejecuta ESLint sobre el proyecto |
| `reset-project` | `npm run reset-project` | Limpia el codigo de plantilla y deja el proyecto en blanco |

### Sobre `reset-project`

Este script interactivo mueve todo el codigo de ejemplo (directorios `app`, `components`, `hooks`, `constants` y `scripts`) a una carpeta `app-example`, y genera un nuevo directorio `app` minimo con un `index.tsx` y `_layout.tsx` en blanco. Usalo cuando estes listo para comenzar a desarrollar tu propia app desde cero.

```bash
npm run reset-project
```

> Despues de ejecutarlo puedes eliminar el script del `package.json` y borrar el archivo `scripts/reset-project.js`.

---

## Construccion para produccion

Expo recomienda usar [EAS Build](https://docs.expo.dev/build/introduction/) para compilar binarios de produccion (`.ipa` / `.apk` / `.aab`) sin necesidad de entorno nativo local.

### Con EAS Build (recomendado)

```bash
# Instalar EAS CLI globalmente (una sola vez)
npm install -g eas-cli

# Iniciar sesion en tu cuenta Expo
eas login

# Configurar el proyecto para EAS (primera vez)
eas build:configure

# Compilar para Android
eas build --platform android

# Compilar para iOS
eas build --platform ios

# Compilar para ambas plataformas
eas build --platform all
```

### Web estatica

La salida web esta configurada como `static` en `app.json`. Para exportar:

```bash
npx expo export --platform web
```

Los archivos generados quedan en `dist/` y pueden servirse con cualquier hosting estatico (Vercel, Netlify, Cloudflare Pages, etc.).

---

## Contribucion

Las contribuciones son bienvenidas. Para proponer cambios:

1. Haz un fork del repositorio
2. Crea una rama descriptiva: `git checkout -b feat/nombre-de-la-funcionalidad`
3. Realiza tus cambios y confirmalos: `git commit -m "feat: descripcion del cambio"`
4. Sube la rama: `git push origin feat/nombre-de-la-funcionalidad`
5. Abre un Pull Request hacia `main`

---

## Recursos utiles

- [Documentacion de Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [Guia de Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Navigation](https://reactnavigation.org/)

---

