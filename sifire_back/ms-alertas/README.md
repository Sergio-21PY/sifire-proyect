# ms-alertas — Sistema de Alertas a la Comunidad

## ¿Qué hace este microservicio?

Gestiona las alertas que se emiten hacia la comunidad cuando hay una emergencia. Las alertas pueden generarse de dos formas:

1. **Automáticamente**, cuando ms-reportes detecta un nuevo reporte (vía patrón Observer)
2. **Manualmente**, cuando un funcionario decide emitir una alerta desde el dashboard

Además permite asignar brigadistas a una alerta, consultando a ms-usuarios quiénes tienen el rol `BRIGADISTA`.

---

## Configuración

| Propiedad | Valor |
|---|---|
| Puerto | `8084` |
| Nombre app | `ms-alertas` |
| Base de datos | MySQL — `sifire` en `localhost:3306` |
| Usuario DB | `root` / sin contraseña |

---

## Modelo de Datos

### Alerta

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `titulo` | String | Título de la alerta |
| `mensaje` | String (TEXT) | Contenido completo del mensaje |
| `tipo` | String | Clasificación de la alerta |
| `canal` | Enum | Canal de envío: `EMAIL`, `SMS` o `PUSH` |
| `estado` | Enum | Estado actual de la alerta |
| `latitud` / `longitud` | Double | Ubicación del evento relacionado |
| `reporteId` | Long | ID del reporte que originó esta alerta (si aplica) |
| `usuariosAsignadosIds` | Set\<Long\> | IDs de brigadistas asignados a atender esta alerta |
| `createdAt` | LocalDateTime | Generado automáticamente al crear |

**Estados posibles:** `PENDIENTE` → `ENVIADA` / `FALLIDA` / `ASIGNADA`

---

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/alertas/crear` | Crear nueva alerta (manual o desde Observer) |
| GET | `/api/alertas` | Listar todas las alertas |
| GET | `/api/alertas/historial` | Historial completo de alertas emitidas |
| GET | `/api/alertas/estado/{estado}` | Filtrar alertas por estado (ej: PENDIENTE) |
| GET | `/api/alertas/reporte/{id}` | Ver alertas asociadas a un reporte específico |
| PUT | `/api/alertas/{id}/estado` | Actualizar estado de una alerta |
| POST | `/api/alertas/{id}/asignar-brigadistas` | Asignar brigadistas a la alerta (consulta ms-usuarios y cambia estado a ASIGNADA) |

---

## Integración con ms-usuarios

El endpoint `/asignar-brigadistas` realiza una llamada interna a ms-usuarios para obtener la lista de usuarios con rol `BRIGADISTA`. Sus IDs se almacenan en la tabla `alerta_asignaciones` y el estado de la alerta pasa a `ASIGNADA`.

> **Nota técnica:** En la rama `dev`, esta comunicación se realiza a través del BFF con `RestTemplate`. La versión de Sergio en `master` usaba Feign directamente — ambos enfoques son válidos.

---

## Levantar

```bash
cd sifire_back/ms-alertas
./mvnw spring-boot:run
```
