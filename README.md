# Catbreeds - Mobile App (Prueba Técnica Pragma)

![Pragma](https://img.shields.io/badge/Pragma-Prueba%20T%C3%A9cnica-yellow?style=for-the-badge)
![Ionic](https://img.shields.io/badge/Ionic-9.0.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-22.1.7-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8.5.3-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/NgRx%20Signals-22.0.1-BA68C8?style=for-the-badge&logo=ngrx&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.0.18-729B1B?style=for-the-badge&logo=vitest&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.9.9-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Commitlint](https://img.shields.io/badge/Commitlint-21.2.3-121212?style=for-the-badge&logo=commitlint&logoColor=white)
![Lefthook](https://img.shields.io/badge/Lefthook-2.2.1-red?style=for-the-badge)

Aplicación móvil multiplataforma desarrollada como solución integral a la **Prueba Técnica para Desarrolladores de Aplicaciones Móviles** de **Pragma**. Permite explorar, buscar y consultar información detallada de razas felinas consumiendo la API de [TheCatAPI](https://thecatapi.com/).

---

## 🎯 Cumplimiento de Requerimientos

De acuerdo con el documento de especificaciones (`docs/prueba-desarrolladores-de-aplicaciones-en-dispositivos-moviles.pdf`), la aplicación implementa el 100% de los puntos solicitados:

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
    - **Intersector HTTP Funcional**: `catApiKeyInterceptor` inyecta automáticamente el header `x-api-key: live_99Qe...` en cada petición saliente a TheCatAPI.
    - **`httpResource`**: Consumo GET 100% reactivo mediante la nueva primitiva de Angular 22, eliminando suscripciones manuales a `HttpClient`.
    - **Gestor de Estado `@ngrx/signals`**: Store global reactivo (`CatBreedsStore`) con `withEntities`, `withState`, `withProps`, `withComputed`, `withMethods` y `withHooks`.

5. **Repositorio Público y Entrega**:
    - Repositorio público en GitHub: [https://github.com/gacc94/mobile-pragma](https://github.com/gacc94/mobile-pragma).
    - Componentes nativos de Ionic 9 y Capacitor 8 compilados y validados para **Android**, **iOS** y **Web**.

---

## 🛠️ Stack Tecnológico

- **Framework Móvil**: [Ionic](https://ionicframework.com/) (v9.0.0)
- **Plataforma / Framework**: [Angular](https://angular.dev/) (v22.1.7 Zoneless, Standalone Components, Signal inputs)
- **State Management**: [@ngrx/signals](https://ngrx.io/guide/signals) (v22.0.1)
- **Runtime Nativo**: [Capacitor](https://capacitorjs.com/) (v8.5.3)
- **Testing**: [Vitest](https://vitest.dev/) (v4.0.18) + Angular Testing Library
- **Calidad de Código**: ESLint + Prettier + Lefthook Git Hooks + Commitlint (Conventional Commits con emojis)

---

## 🧪 Pruebas Unitarias y Calidad

El proyecto cuenta con **35 pruebas unitarias automatizadas** que cubren servicios, interceptores, store reactivo y componentes:

```bash
# Ejecutar todas las pruebas unitarias
npm test -- --watch=false

# Linter de código
npm run lint

# Validación de formato de código
npm run format:check

# Compilación de producción (0 advertencias de budget)
npm run build
```

---

## 🚀 Puesta en Marcha

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Ejecución en Modo Web

```bash
npm start
```

La aplicación se abrirá en `http://localhost:4200/`.

### 3. Sincronización y Compilación Nativa

```bash
# Compilar recursos web
npm run build

# Sincronizar plataformas nativas (Android e iOS)
npx cap sync
```

#### Android:

```bash
npx cap open android
# O compilar directamente el APK debug:
cd android && ./gradlew assembleDebug
```

#### iOS:

```bash
npx cap open ios
# O compilar mediante xcodebuild:
xcodebuild -project ios/App/App.xcodeproj -scheme App -destination 'generic/platform=iOS' build CODE_SIGNING_ALLOWED=NO
```
