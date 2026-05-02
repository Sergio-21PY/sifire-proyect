# ms-monitoreo — Monitoreo Geográfico y Gestión de Brigadas

## ¿Qué hace este microservicio?

Provee toda la información geográfica que necesita el mapa interactivo del frontend: zonas de riesgo, rutas de evacuación, brigadas y sus asignaciones a reportes activos. También recibe las notificaciones del Observer de ms-reportes para mantener los focos actualizados.

---

## Configuración

| Propiedad | Valor |
|---|---|
| Puerto | `8083` |
| Nombre app | `ms-monitoreo` |
| Base de datos | MySQL — `sifire` en `localhost:3306` |
| Usuario DB | `root` / sin contraseña |

---

## Modelos de Datos

### Brigada
Representa un equipo de respuesta ante emergencias.

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | String | Nombre de la brigada |
| `estado` | Enum | `DISPONIBLE`, `EN_CAMINO`, `EN_ZONA`, `INACTIVA` |
| `latitud` / `longitud` | Double | Posición GPS actual |

> Cuando se crea una asignación, la brigada cambia automáticamente a `EN_CAMINO`.

### AsignacionBrigada
Vincula una brigada con un reporte activo.

| Campo | Descripción |
|---|---|
| `brigadaId` | ID de la brigada asignada |
| `reporteId` | ID del reporte al que fue asignada |
| `fechaAsignacion` | Timestamp de la asignación |

### ZonaRiesgo
Zona geográfica marcada con un nivel de peligro. Se muestra en el mapa como polígono o área.

### RutaEvacuacion
Ruta definida para guiar a la población en caso de emergencia. Se muestra en el mapa como línea.

---

## Endpoints

### Zonas y Rutas (datos del mapa)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/zonas-riesgo` | Listar todas las zonas de riesgo activas |
| GET | `/api/rutas-evacuacion` | Listar todas las rutas de evacuación activas |

### Brigadas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/brigadas` | Listar brigadas con su estado y posición |
| POST | `/api/brigadas/crear` | Registrar nueva brigada |
| PUT | `/api/brigadas/{id}` | Actualizar posición GPS y/o estado |

### Asignaciones

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/asignaciones` | Listar todas las asignaciones activas |
| POST | `/api/asignaciones/crear` | Asignar brigada a un reporte (cambia brigada a EN_CAMINO) |
| GET | `/api/asignaciones/reporte/{id}` | Ver asignaciones de un reporte específico |

### Focos (integración Observer)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/focos/sincronizar` | Recibe notificación del Observer de ms-reportes para actualizar el mapa |

---

## Levantar

```bash
cd sifire_back/ms-monitoreo
./mvnw spring-boot:run
```
