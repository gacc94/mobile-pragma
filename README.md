# Catbreeds - Mobile App (Prueba Técnica Pragma)

![Pragma](https://img.shields.io/badge/Pragma-Prueba%20T%C3%A9cnica-yellow?style=for-the-badge)
![Ionic](https://img.shields.io/badge/Ionic-9.0.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-22.1.7-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8.5.3-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.9.9-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Commitlint](https://img.shields.io/badge/Commitlint-21.2.3-121212?style=for-the-badge&logo=commitlint&logoColor=white)
![Lefthook](https://img.shields.io/badge/Lefthook-2.2.1-red?style=for-the-badge)

Aplicación móvil desarrollada como solución a la **Prueba Técnica para Desarrolladores de Aplicaciones Móviles** de **Pragma**. Permite explorar, buscar y consultar información detallada de razas felinas consumiendo la API de [TheCatAPI](https://thecatapi.com/).

---

## 🎯 Alcance del Proyecto

De acuerdo con el documento de requerimientos, la aplicación cubre los siguientes componentes:

1. **Splash Screen**:
    - Pantalla de bienvenida con identidad visual _Catbreeds_.
    - Imagen temática alusiva.

2. **Landing / Listado de Razas**:
    - Barra de búsqueda funcional por nombre de raza (en inglés).
    - Listado en tarjetas (_Cards_) con:
        - Nombre de la raza
        - Imagen representativa
        - País de origen
        - Nivel de inteligencia
        - Botón de navegación a detalle (_Más..._)

3. **Detalle de Raza**:
    - Encabezado con el nombre de la raza.
    - Imagen superior fija (sin scroll).
    - Sección inferior deslizable (_scrollable_) con información completa:
        - Descripción de la raza
        - País de origen
        - Inteligencia
        - Adaptabilidad
        - Esperanza / tiempo de vida

4. **Integración con TheCatAPI**:
    - Consumo del endpoint oficial: `GET https://api.thecatapi.com/v1/breeds`.
    - Autenticación mediante header `x-api-key` / parámetro `api_key`.

---

## 🛠️ Tecnologías

- **Framework**: [Ionic](https://ionicframework.com/) (v9)
- **Core / Plataforma**: [Angular](https://angular.dev/) (v22)
- **Runtime Nativo**: [Capacitor](https://capacitorjs.com/) (v8)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **API Externa**: [TheCatAPI](https://developers.thecatapi.com/)

---

## 🚀 Puesta en Marcha

### Instalación

```bash
npm install
```

### Desarrollo Web

```bash
npm start
```

### Compilación y Sincronización Móvil

```bash
# Compilar recursos web
npm run build

# Sincronizar plataformas nativas
npx cap sync

# Abrir entorno nativo
npx cap open android
# o
npx cap open ios
```
