# Catbreeds - Mobile App (Prueba Técnica Pragma)

![Pragma](https://img.shields.io/badge/Pragma-Prueba%20T%C3%A9cnica-yellow?style=for-the-badge)
![Ionic](https://img.shields.io/badge/Ionic-9.0.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-22.1.7-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8.5.3-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/NgRx%20Signals-22.0.1-BA68C8?style=for-the-badge&logo=ngrx&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-51%20Tests%20Passing-729B1B?style=for-the-badge&logo=vitest&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.9.9-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Commitlint](https://img.shields.io/badge/Commitlint-21.2.3-121212?style=for-the-badge&logo=commitlint&logoColor=white)
![Lefthook](https://img.shields.io/badge/Lefthook-2.2.1-red?style=for-the-badge)

Aplicación móvil multiplataforma desarrollada como solución integral a la **Prueba Técnica para Desarrolladores de Aplicaciones Móviles** de **Pragma**. Permite explorar, buscar y consultar información detallada de razas felinas consumiendo la API de [TheCatAPI](https://thecatapi.com/).

---

## 📱 Demostración en Android

<div align="center">
  <video src="docs/assets/android_demo.mp4" controls="controls" width="300" style="max-height: 600px; border-radius: 12px;"></video>
  <p><em>Demostración en video: splash nativo, búsqueda en tiempo real, scroll infinito optimizado, selector de tema (Claro/Oscuro/Sistema) y pantalla de detalle con panel scrollable independiente.</em></p>
</div>

---

## 🎯 Cumplimiento de Requerimientos y Características

De acuerdo con el documento de especificaciones (`docs/prueba-desarrolladores-de-aplicaciones-en-dispositivos-moviles.pdf`), la aplicación implementa el 100% de los puntos solicitados junto con optimizaciones de nivel de producción:

1. **Pantalla de Splash (Paso 1)**:
    - Identidad visual _Catbreeds_ con tipografía moderna y centrada.
    - Ilustración felina temática y spinner nativo de precarga.
    - Inicialización en segundo plano de la lista de razas para navegación inmediata.
    - Ocultamiento automático del splash nativo con `@capacitor/splash-screen`.

2. **Pantalla de Landing / Catbreeds (Paso 2)**:
    - Header nativo con título _Catbreeds_ y barra de búsqueda reactiva (`ion-searchbar`).
    - Búsqueda en tiempo real por el nombre de la raza en inglés con debounce optimizado.
    - Presentación en tarjetas (_Cards_) conforme al wireframe:
        - Línea superior: Nombre de la raza y botón/enlace _"Más..."_.
        - Centro: Imagen representativa con lazy loading y fallback ante fallos de red.
        - Línea inferior: _"País de origen"_ con icono y _"Inteligencia"_ con badge/rating.
    - **Paginación progresiva con `<ion-infinite-scroll>`**: Carga inicial por lotes (12 elementos) con slicing en memoria (0 ms de latencia) y `content-visibility: auto` para eliminar retrasos de renderizado (_checkerboarding_) durante scroll rápido.
    - **Selector de Tema Dinámico**: Modo Claro, Oscuro y Sistema con `ion-popover` y persistencia nativa multiplataforma mediante `@capacitor/preferences`.
    - _Pull to Refresh_ nativo (`ion-refresher`) para recargar datos frescos.
    - Estados de skeleton animado (`ion-skeleton-text`), estado vacío y manejo de errores.

3. **Pantalla de Detalle de Raza (Paso 3 y 3.1)**:
    - Header con botón de retorno (`ion-back-button`) y nombre de la raza.
    - **Mitad superior fija (45vh)**: Imagen de la raza que **no se mueve ni hace scroll**.
    - **Mitad inferior con scroll independiente**: Contenedor scrollable vertical con:
        - _Descripción_: Descripción completa provista por el servicio.
        - _Nombre del País_: País de origen de la raza.
        - _Inteligencia_: Nivel numérico y barra de progreso animada (`ion-progress-bar`).
        - _Adaptabilidad_: Nivel numérico y barra de progreso.
        - _Tiempo de vida_: Rango de esperanza de vida en años.
        - _Temperamento_: Etiquetas descriptivas del comportamiento.

4. **Consumo de API con Arquitectura Moderna**:
    - Endpoint: `https://api.thecatapi.com/v1/breeds`.
    - **Interceptor HTTP Funcional**: `catApiKeyInterceptor` inyecta automáticamente el header `x-api-key: live_99Qe...` en cada petición saliente a TheCatAPI.
    - **`httpResource`**: Consumo GET 100% reactivo mediante la primitiva de Angular 22, eliminando suscripciones manuales a `HttpClient`.
    - **Gestor de Estado `@ngrx/signals`**: Store global reactivo (`CatBreedsStore`) y store de tema (`ThemeStore`) con arquitectura declarativa y signals.

5. **Resiliencia Visual y Manejo de Imágenes**:
    - Directiva `ImageFallbackDirective` y pipe `ImageUrlFallbackPipe` con fallback automático ante URLs rotas o sin conectividad.

---

## 🛠️ Stack Tecnológico

- **Framework Móvil**: [Ionic](https://ionicframework.com/) (v9.0.0)
- **Framework Web**: [Angular](https://angular.dev/) (v22.1.7 Zoneless, Standalone Components, Signals)
- **Gestión de Estado**: [@ngrx/signals](https://ngrx.io/guide/signals) (v22.0.1)
- **Runtime Nativo**: [Capacitor](https://capacitorjs.com/) (v8.5.3) con plugins oficiales (`@capacitor/preferences`, `@capacitor/splash-screen`, `@capacitor/status-bar`, etc.)
- **Testing**: [Vitest](https://vitest.dev/) (v4.0.18) + Angular Testing Library
- **Calidad y Formato**: ESLint + Prettier + Lefthook Git Hooks + Commitlint (Conventional Commits con emojis)

---

## ⚡ Guía Rápida de Puesta en Marcha

### Prerrequisitos

- **Node.js**: `>= 20.x` (recomendado v22 o v24)
- **npm**: `>= 10.x`
- **JDK**: `Java 21` y **Android SDK** (únicamente si se compila para Android)

### 1. Clonar e Instalar

```bash
git clone https://github.com/gacc94/mobile-pragma.git
cd mobile-pragma
npm install
```

### 2. Ejecutar en Modo Web (Desarrollo)

```bash
npm start
```

> La aplicación estará disponible en `http://localhost:4200/`.

### 3. Pruebas Unitarias y Calidad de Código

El proyecto incluye **51 pruebas unitarias automatizadas** con 100% de éxito:

```bash
# Ejecutar todas las pruebas unitarias
npm test -- --watch=false

# Linter de código (ESLint)
npm run lint

# Validación de formato (Prettier)
npm run format:check

# Compilación de producción (0 advertencias de budget de estilos)
npm run build
```

---

## 📱 Compilación y Ejecución Nativa

### Android

```bash
# 1. Compilar los recursos web y sincronizar con Android
npm run build
npx cap sync android

# 2. Abrir el proyecto en Android Studio
npx cap open android

# 3. O compilar directamente el APK Debug desde terminal:
cd android && ./gradlew assembleDebug
```

> El archivo APK generado se ubica en:  
> `android/app/build/outputs/apk/debug/app-debug.apk`

### iOS (macOS)

```bash
# Compilar recursos y sincronizar con iOS
npm run build
npx cap sync ios

# Abrir el proyecto en Xcode
npx cap open ios

# O compilar por consola con xcodebuild:
xcodebuild -project ios/App/App.xcodeproj -scheme App -destination 'generic/platform=iOS' build CODE_SIGNING_ALLOWED=NO
```

---

## 📂 Estructura del Proyecto

```text
mobile-pragma/
├── android/                   # Proyecto nativo Android (Capacitor)
├── ios/                       # Proyecto nativo iOS (Capacitor)
├── docs/
│   ├── assets/                # Video demostrativo (android_demo.mp4)
│   └── prueba-...pdf          # Especificaciones de la prueba técnica
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── interceptors/  # Interceptor funcional x-api-key
│   │   │   ├── models/        # Interfaces TypeScript (CatBreed)
│   │   │   ├── services/      # CatBreedsService con httpResource
│   │   │   └── store/         # CatBreedsStore y ThemeStore (@ngrx/signals)
│   │   ├── features/
│   │   │   ├── splash/        # Pantalla de Splash nativa / animada
│   │   │   ├── home/          # Catbreeds landing con Infinite Scroll
│   │   │   └── detail/        # Pantalla de Detalle (mitad fija / mitad scroll)
│   │   └── shared/            # Directivas y pipes de fallback
│   └── theme/                 # Paleta de variables CSS (Light/Dark themes)
└── capacitor.config.ts        # Configuración Capacitor
```
