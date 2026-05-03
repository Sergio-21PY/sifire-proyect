# ms-bff — Backend For Frontend

## ¿Qué hace este microservicio?

El BFF es la **puerta de entrada única** entre el frontend y todos los microservicios del sistema. Su trabajo es:

- Recibir las peticiones del frontend
- Consultar uno o más microservicios según sea necesario
- Combinar los datos en una respuesta única y lista para usar
- Proteger al frontend de fallos en los microservicios gracias al **Circuit Breaker**

Sin el BFF, el frontend tendría que hacer múltiples llamadas a distintos puertos, lo que haría el código más complejo y frágil.

---

## Configuración

| Propiedad | Valor |
|---|---|
| Puerto | `8080` |
| Nombre app | `ms-bff` |
| Eureka | Deshabilitado (no se usa service discovery) |

---

## URLs de los microservicios

El BFF sabe dónde encontrar a cada microservicio. Por defecto usa `localhost`, pero se puede cambiar mediante variables de entorno para despliegues en producción:

| Microservicio | URL por defecto | Variable de entorno para sobreescribir |
|---|---|---|
| ms-usuarios | `http://localhost:8081` | `ms.usuarios.url` |
| ms-reportes | `http://localhost:8082` | `ms.reportes.url` |
| ms-monitoreo | `http://localhost:8083` | `ms.monitoreo.url` |
| ms-alertas | `http://localhost:8084` | `ms.alertas.url` |

---

## Patrón Circuit Breaker (Resilience4j)

Si uno de los microservicios no responde o falla, el Circuit Breaker evita que el error se propague al usuario. En su lugar, devuelve una respuesta de respaldo (fallback) con un mensaje amigable.

**Configuración aplicada a todos los microservicios:**

| Parámetro | Valor | Significado |
|---|---|---|
| `sliding-window-size` | 5 | Evalúa las últimas 5 llamadas |
| `failure-rate-threshold` | 50% | Si más del 50% fallan, activa el circuit breaker |
| `wait-duration-in-open-state` | 10s | Espera 10 segundos antes de volver a intentar |

---

## Endpoints disponibles

### 🗺️ Mapa y Dashboard

| Método | Endpoint | Descripción | Fuentes de datos |
|---|---|---|---|
| GET | `/bff/mapa` | Datos completos para el mapa | ms-reportes + ms-monitoreo (zonas, rutas, brigadas) |
| GET | `/bff/dashboard` | Datos del panel de control | ms-reportes + ms-alertas |

### 👤 Usuarios

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/bff/usuarios/login` | Autenticación con username y password |
| POST | `/bff/usuarios/registro` | Crear nuevo usuario (normaliza el username automáticamente) |
| GET | `/bff/usuarios/listar` | Listar todos los usuarios registrados |

### 🔥 Reportes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/bff/reportes` | Listar todos los reportes |
| POST | `/bff/reportes/crear` | Crear reporte (aplica Factory Method según tipo de reportante) |
| PUT | `/bff/reportes/{id}/estado` | Cambiar estado del reporte (PENDIENTE → EN_PROCESO → RESUELTO) |
| POST | `/bff/reportes/{id}/subir-foto` | Adjuntar imagen al reporte (máx. 10MB) |

### 🔔 Alertas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/bff/alertas` | Listar todas las alertas |
| POST | `/bff/alertas/crear` | Emitir alerta manual a la comunidad |
| POST | `/bff/alertas/{id}/asignar-brigadistas` | Asignar brigadistas a una alerta |

### 📍 Monitoreo

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/bff/monitoreo/zonas` | Listar zonas de riesgo activas |
| GET | `/bff/monitoreo/brigadas` | Listar brigadas y su disponibilidad |
| GET | `/bff/monitoreo/asignaciones` | Asignaciones activas (incluye datos del reporte cruzados) |
| POST | `/bff/monitoreo/asignaciones/crear` | Asignar una brigada a un reporte |

---

## Monitoreo del Circuit Breaker (Actuator)

Puedes verificar el estado de los circuit breakers en tiempo real:

```
GET http://localhost:8080/actuator/health
GET http://localhost:8080/actuator/circuitbreakers
```

---

## Levantar

> ⚠️ Levantar este microservicio **de último**, después de que todos los demás estén corriendo.

```bash
cd sifire_back/ms-bff
./mvnw spring-boot:run
```
