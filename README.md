# Prueba técnica — Rick & Morty Characters (React)
Aplicación en **React** que consume  **The Rick and Morty API** para **listar personajes**, **ver detalle**, **filtrar/buscar** , sistema de **favoritos** y sistema de **internacionalización**.

---

## Funcionalidades
**Listado de personajes**
  - Nombre, avatar, **origen** y ubicación actual, estado y especie.

**Detalle del personaje** 
  - Nombre, estado, especie, tipo, género, origen y ubicación actual.
  - Lista de “otros residentes” relacionados con el personaje (ver nota más abajo).

**Búsqueda / filtrado**
  - Nombre, especie y localización (con debounce para evitar recargas y peticiones excesivas).

**Extra: Favoritos**
  - Marcar/desmarcar personajes como favoritos desde el listado y desde el detalle.
  - Persistencia en `localStorage`. 

**i18n (ES/EN)**
  - Selector de idioma con banderas en el layout.
  - Traducciones vía `i18next` cargadas desde `/public/locales`. 

> Nota sobre “otros residentes”:
> Cuando un personaje tiene origen desconocido, no se muestra sugerencias, ya que no se conoce su origen. 

---

## Stack / Librerías
**React + Vite** (dev server, build, preview).
**React Router** para enrutado.
**@tanstack/react-query** para fetching/cache/estados de carga y error. 
**MUI (Material UI)** para UI/tema. 
**Zustand + persist** para favoritos.
**i18next + react-i18next** para internacionalización. 

---

## Cómo ejecutar el proyecto
Requisitos
    - Node.js 18+ recomendado

Instalación
    - npm install

Ejecución
    - npm run dev

Build
    - npm run build

Preview del build
    - npm run preview

---

## Arquitectura y decisiones técnicas
**Estructura** (por features)
    src/features/characters/
        pages/ 
            listado
            detalle
            favoritos
        components/
            grid
            tarjeta
            filtros
        hooks/ 
            usePersonaje
            usePersonajes
            usePersonajesPorLocalizacion
            usePersonajesPorLocalizacionNombre
            useResidentesPorUrl
    src/api/
        rmApi
    src/shared/
        components/
            loading
            error
            layout
        state/
            favoritos
        utils
        debounce
        extracción de ids

**Enrutado**
Rutas principales:
    / listado
    /personajes/:id detalle
    /favoritos favoritos 

**Data fetching, caché y UX**
    - Se centraliza el acceso a datos con React Query y hooks específicos (single responsibility).
    - En listado se usa keepPreviousData para una paginación más suave. 
    - En filtros se aplica debounce a nombre/especie/localización para evitar “recargas” y peticiones por cada tecla.
    - Manejo consistente de estados:
        - Cargando para loading. 
        - ErrorEstado para errores (incluye botón retry). 

**Favoritos (extra)**
    - Implementado con Zustand y middleware persist.
    - Estructura en diccionario favoritosById para acceso O(1).
    - Se guarda un “snapshot” del personaje para listar favoritos sin refetch.

**i18n (ES/EN)**
    - Configuración con i18next-http-backend cargando traducciones desde: /public/locales/{{lng}}/{{ns}}.json 
    - Detección y persistencia de idioma mediante localStorage.
    - Selector de idioma en el layout con banderas.

---

## Mejoras y extensiones
    - Ahora al buscar por localización se toma la primera coincidencia; se podría mostrar dropdown de resultados de locations.
    - Implementación de selector de varios modos de visualización (modo oscuro, alto contraste)
    - Comparador de personajes