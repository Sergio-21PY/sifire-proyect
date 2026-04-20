# SIFIRE — Frontend React
**Sistema de Información para la Gestión de Incendios**
Municipalidad Valle del Sol, Monte Patria, Coquimbo

---

## Stack Tecnológico

- React 18 + Vite
- React Router DOM (navegación)
- React Leaflet + Leaflet (mapas interactivos)
- Context API (autenticación)

---

## Estructura del Proyecto
src/
├── pages/
│ ├── Login.jsx # Inicio de sesión
│ ├── Registro.jsx # Registro de usuarios
│ ├── Dashboard.jsx # Panel de control con KPIs
│ ├── Reportes.jsx # Gestión de reportes + asignación
│ ├── Monitoreo.jsx # Mapa interactivo de focos
│ ├── Alertas.jsx # Sistema de alertas con filtros
│ ├── GestionBrigadistas.jsx # CRUD de brigadistas
│ ├── MisAsignaciones.jsx # Vista brigadista — sus reportes
│ └── 404.jsx # Página no encontrada
├── components/
│ ├── NavbarComponent.jsx
│ └── FooterComponent.jsx
├── context/
│ └── AuthContext.jsx # Estado global del usuario logueado
├── services/
│ └── mockData.js # Datos de prueba (reemplazar por axios)
└── App.jsx # Rutas principales

text

---

## Rutas Disponibles

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Login | Público |
| `/login` | Login | Público |
| `/registro` | Registro | Público |
| `/dashboard` | Dashboard | Todos |
| `/reportes` | Reportes | Todos |
| `/monitoreo` | Mapa interactivo | Todos |
| `/alertas` | Alertas | Todos |
| `/brigadistas` | Gestión Brigadistas | FUNCIONARIO |
| `/mis-asignaciones` | Mis Asignaciones | BRIGADISTA |

---

## Roles del Sistema

| Rol | Puede hacer |
|-----|-------------|
| `CIUDADANO` | Ver reportes, crear reporte |
| `BRIGADISTA` | Ver sus asignaciones, cambiar estado |
| `FUNCIONARIO` | Todo lo anterior + asignar brigadistas + crear brigadistas |
| `ADMINISTRADOR` | Acceso total |

---

## Páginas — Detalle

### Dashboard.jsx
- Muestra 4 KPIs: Reportes Activos, En Proceso, Brigadas Activas, Controlados Hoy
- Tabla de reportes recientes con nivel y estado
- **Pendiente back:** `GET /bff/dashboard`

### Reportes.jsx
- Lista todos los reportes en tabla
- Formulario para crear nuevo reporte con mapa selector de coordenadas
- Botón **"Asignar"** visible solo para `FUNCIONARIO` en filas `EN_CURSO`
- Modal de asignación con selector de brigadista disponible
- **Pendiente back:** `GET /bff/reportes`, `POST /bff/reportes`, `POST /bff/asignaciones`

### Monitoreo.jsx
- Mapa centrado en Monte Patria (`-30.695, -70.958`, zoom 12)
- Marcadores y círculos de zona de impacto por cada reporte
- Colores por nivel: rojo (alto), naranja (medio), amarillo (bajo), verde (resuelto)
- **Pendiente back:** `GET /bff/mapa/reportes`

### Alertas.jsx
- Lista de alertas con filtros por estado (`TODOS`, `PENDIENTE`, `EN_CURSO`, etc.)
- **Pendiente back:** `GET /bff/alertas`

### GestionBrigadistas.jsx
- Tabla con todos los brigadistas registrados
- Columna **Asignaciones activas** — muestra cuántos reportes tiene asignados
- Formulario para crear brigadista con contraseña temporal
- Botón Activar/Desactivar por brigadista
- **Pendiente back:** `GET /bff/usuarios/brigadistas`, `POST /bff/usuarios/crear-brigadista`, `PATCH /bff/usuarios/:id/estado`

### MisAsignaciones.jsx
- Vista exclusiva del brigadista logueado
- Tarjetas con título, nivel, descripción, fecha y coordenadas de cada reporte asignado
- Botones para avanzar estado: `EN_CURSO → CONTROLADO → CERRADO`
- Las transiciones son unidireccionales (no puede volver atrás)
- **Pendiente back:** `GET /bff/asignaciones/mias`, `PATCH /bff/reportes/:id/estado`

---

## APIs que necesita el Backend
POST /bff/auth/login
POST /bff/auth/registro
GET /bff/dashboard
GET /bff/reportes
POST /bff/reportes
GET /bff/mapa/reportes
GET /bff/alertas
GET /bff/usuarios/brigadistas
POST /bff/usuarios/crear-brigadista
PATCH /bff/usuarios/:id/estado
POST /bff/asignaciones
GET /bff/asignaciones/mias
PATCH /bff/reportes/:id/estado

text

---

## Estados del Sistema

### Reportes
| Estado | Color |
|--------|-------|
| `PENDIENTE` | Amarillo |
| `EN_CURSO` | Rojo |
| `CONTROLADO` | Verde |
| `CERRADO` | Gris |

### Niveles de Riesgo
| Nivel | Color |
|-------|-------|
| `BAJO` | Amarillo |
| `MEDIO` | Naranja |
| `ALTO` | Rojo |
| `CRITICO` | Rojo oscuro |

---

## Notas Importantes

- Todos los mocks están marcados con comentario `// TODO: reemplazar por axios...`
- El mapa usa tiles de **CARTO Voyager** (no requiere API key)
- Las coordenadas de Monte Patria son: `lat: -30.695, lng: -70.958`
- El bug de íconos de Leaflet + Vite está resuelto en todos los mapas
- El estado `EN_CURSO` del frontend debe coincidir con el ENUM de la BD (corregido en `sifire-mysql-3.sql`)

---

## Rama de trabajo

- Rama activa: `dev`
- Repo: [github.com/MatiDroid21/SIFIRE_React](https://github.com/MatiDroid21/SIFIRE_React/tree/dev)