# ms-reportes — Gestión de Reportes de Incendio

## ¿Qué hace este microservicio?

Es el corazón del sistema. Gestiona el ciclo de vida completo de los reportes de incendio: desde que un usuario lo crea hasta que se cierra el caso. Implementa tres patrones de diseño clave del proyecto.

---

## Configuración

| Propiedad | Valor |
|---|---|
| Puerto | `8082` |
| Nombre app | `ms-reportes` |
| Base de datos | MySQL — `sifire` en `localhost:3306` |
| Usuario DB | `root` / sin contraseña |
| Carpeta de fotos | `uploads/` (máx. 10MB por archivo) |

---

## Patrones de Diseño Implementados

### 1. 🏭 Factory Method — Creación de Reportes

Cuando se crea un reporte, el sistema necesita saber qué nivel de riesgo asignar y cómo clasificarlo. En lugar de poner toda esa lógica en un solo lugar con muchos `if/else`, se usa una fábrica distinta para cada tipo de usuario:

| Tipo de reportante | Clase fábrica | Nivel de riesgo asignado |
|---|---|---|
| `CIUDADANO` | `ReporteCiudadanoFactory` | `MEDIO` |
| `BRIGADISTA` | `ReporteBrigadistaFactory` | Evaluado según contexto del reporte |
| `FUNCIONARIO` | `ReporteFuncionarioFactory` | `ALTO` o `CRITICO` |

`ReporteFactorySelector` recibe el `tipoReportante` y elige la fábrica correcta automáticamente.

### 2. 👁️ Observer — Notificaciones Automáticas

Cada vez que se **crea un reporte** o se **cambia su estado**, `ReporteEventPublisher` notifica automáticamente a dos observadores:

- **`AlertaObserver`** → llama a ms-alertas para crear una alerta automática asociada al reporte
- **`MonitoreoObserver`** → llama a ms-monitoreo para registrar o actualizar el foco en el mapa

Gracias a este patrón, ms-reportes no necesita saber los detalles de ms-alertas ni ms-monitoreo — solo lanza el evento y cada observador hace su trabajo.

### 3. 🗃️ Repository Pattern

Toda la comunicación con la base de datos pasa por interfaces JPA:
- `ReporteRepository`
- `HistorialRepository` — guarda cada cambio de estado
- `MultimediaRepository` — almacena referencias a fotos

---

## Modelo de Datos

### ReporteIncendio

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `titulo` | String | Título descriptivo del reporte |
| `descripcion` | String | Descripción detallada |
| `latitud` / `longitud` | Double | Coordenadas GPS del foco |
| `estado` | Enum | Estado actual del reporte |
| `nivelRiesgo` | Enum | Nivel de peligrosidad evaluado |
| `tipoReportante` | Enum | Rol del usuario que creó el reporte |
| `usuarioId` | Long | ID del usuario que reportó |
| `fechaCreacion` | LocalDateTime | Generado automáticamente |

**Estados posibles:** `PENDIENTE` → `EN_PROCESO` → `RESUELTO` o `DESCARTADO`

**Niveles de riesgo:** `BAJO`, `MEDIO`, `ALTO`, `CRITICO`

---

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/reportes/crear` | Crear nuevo reporte (activa Factory Method + Observer) |
| GET | `/api/reportes` | Listar todos los reportes |
| GET | `/api/reportes/{id}` | Obtener un reporte por ID |
| GET | `/api/reportes?activos=true` | Listar solo reportes activos (PENDIENTE + EN_PROCESO) |
| PUT | `/api/reportes/{id}/estado` | Cambiar estado (guarda historial + notifica observers) |
| GET | `/api/reportes/{id}/historial` | Ver historial completo de cambios de estado |
| POST | `/api/reportes/{id}/subir-foto` | Adjuntar imagen multimedia al reporte |

---

## Levantar

```bash
cd sifire_back/ms-reportes
./mvnw spring-boot:run
```
