# SIFIRE — Documentación Parcial 2
**Sistema de Información y Respuesta a Incendios**
Rama: `dev` | Fecha: 03-05-2026 | Autores: Matías + Sergio

---

## 1. Arquitectura del sistema

```
[React Frontend :5173]
         ↓
  [ms-bff :8080]  ← Circuit Breaker (Resilience4j)
  ↙    ↓    ↓    ↘
:8081 :8082 :8083 :8084
Users Rep.  Mon.  Alert.
         ↓
    [MySQL :3306]
```

El **BFF (Backend For Frontend)** es el único punto de entrada del frontend. Combina datos de múltiples microservicios en una sola respuesta y protege el sistema con Circuit Breaker.

---

## 2. Microservicios

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| ms-usuarios | 8081 | Autenticación, registro, gestión de cuentas |
| ms-reportes | 8082 | Creación y seguimiento de reportes de incendio |
| ms-monitoreo | 8083 | Brigadas, zonas de riesgo, rutas de evacuación |
| ms-alertas | 8084 | Alertas automáticas y manuales a la comunidad |
| ms-bff | 8080 | Gateway, orquestación, Circuit Breaker |

---

## 3. Patrones de diseño implementados

### 3.1 Factory Method

**ms-reportes — ReporteFactory**

Al crear un reporte, `ReporteFactorySelector` elige la fábrica correcta según el tipo de reportante. Cada fábrica aplica sus propias reglas de negocio sin tocar el resto del código:

- `ReporteCiudadanoFactory` → nivel máximo MEDIO
- `ReporteBrigadistaFactory` → puede crear hasta ALTO
- `ReporteFuncionarioFactory` → puede crear cualquier nivel incluyendo CRITICO

```java
ReporteFactory factory = factorySelector.seleccionar(dto.getTipoReportante());
ReporteIncendio reporte = factory.crear(dto);
```

**ms-usuarios — UsuarioFactory** *(trabajo de Sergio)*

Crea usuarios con las reglas correctas según su tipo. Agregar un nuevo tipo solo requiere un nuevo caso en el factory, sin tocar el resto del sistema:

```java
Usuario nuevo = UsuarioFactory.crear(tipo, nombre, username, email, password, telefono);
```

### 3.2 Observer Pattern

Cuando se crea un reporte, el servicio notifica a dos observers **fuera de la transacción** — si los observers fallan, el reporte igual queda guardado:

- `AlertaObserver` → notifica ms-alertas para crear alerta automática
- `MonitoreoObserver` → notifica ms-monitoreo para sincronizar el foco en el mapa

```java
// ReporteController — la notificación va FUERA de la transacción
ReporteIncendio guardado = reporteService.crearReporte(dto);
reporteService.notificarCreacion(guardado); // falla silenciosamente si ms-alertas cae
```

### 3.3 Repository Pattern

Todas las operaciones de persistencia van a través de repositorios JPA. Los servicios nunca escriben SQL directo. Implementado en todos los microservicios.

### 3.4 Circuit Breaker

Implementado con **Resilience4j** en ms-bff. Si ms-monitoreo o ms-reportes no responden, el BFF retorna un fallback con datos nulos y mensaje amigable en vez de error 500.

```java
@CircuitBreaker(name = "ms-monitoreo", fallbackMethod = "mapaFallback")
public Map<String, Object> getDatosMapa() { ... }
```

---

## 4. Flujo del sistema por rol

### Flujo completo: desde el reporte hasta la resolución

```
1. CIUDADANO crea reporte desde /reportes
   → Factory Method asigna nivel según tipo de reportante
   → Reporte queda en PENDIENTE
   → Observer notifica ms-alertas → alerta automática creada
   → Observer notifica ms-monitoreo → foco aparece en mapa
   → Círculo de color aparece en mapa para todos

2. FUNCIONARIO ve el reporte en Dashboard (con 🔔 en navbar)
   → Filtra por PENDIENTE
   → Selecciona brigada DISPONIBLE
   → Reporte pasa a EN_PROCESO
   → Brigada pasa a EN_CAMINO
   → BFF registra historial del cambio en ms-reportes

3. BRIGADISTA ve la asignación en /mis-asignaciones
   → Se dirige al lugar del foco
   → Marca el reporte como RESUELTO
   → Reporte pasa a RESUELTO
   → BFF automáticamente libera la brigada → vuelve a DISPONIBLE
   → Círculo en mapa cambia a VERDE en el próximo ciclo (10s)
```

### Funciones por rol

| Rol | Rutas disponibles | Funciones principales |
|---|---|---|
| CIUDADANO | Reportes, Mapa, Alertas | Crear reportes con foto y coordenadas, ver focos en mapa, leer alertas de la comunidad |
| BRIGADISTA | Mis Asignaciones, Reportes, Mapa | Ver sus asignaciones activas, marcar resuelto, ver mapa con brigadas |
| FUNCIONARIO | Dashboard, Reportes, Mapa, Alertas, Brigadistas | Asignar brigadas, emitir alertas manuales, ver mapa completo con zonas y rutas |
| ADMINISTRADOR | Todo + Usuarios | Crear cuentas de cualquier tipo, gestión completa del sistema |

### Visibilidad en el mapa

| Elemento del mapa | CIUDADANO | BRIGADISTA | FUNCIONARIO |
|---|---|---|---|
| Focos de incendio (círculos) | ✅ | ✅ | ✅ |
| Brigadas activas | ❌ | ✅ | ✅ |
| Zonas de riesgo | ❌ | ❌ | ✅ |
| Rutas de evacuación | ❌ | ❌ | ✅ |

---

## 5. Sistema de alertas

El sistema tiene dos tipos de alertas:

**Alerta automática:** Se genera sola cuando se crea un reporte. El Observer en ms-reportes notifica ms-alertas sin intervención del funcionario.

**Alerta manual:** El funcionario la emite desde /alertas para comunicar algo específico a la comunidad — evacuaciones, avisos preventivos, situaciones especiales. Estado inicial: `ENVIADA`.

---

## 6. Cómo levantar el sistema

```bash
cd sifire_back
taskkill //F //IM java.exe   # Windows: matar procesos Java previos
sh iniciar_ms.sh             # Levanta los 5 micros en orden
```

El script espera 20 segundos antes de levantar el BFF para que los otros micros estén listos.

```bash
cd sifire-frontend
npm run dev                  # Frontend en localhost:5173
```

### Cuentas de prueba

| Rol | Email | Contraseña |
|---|---|---|
| ADMINISTRADOR | admin@sifire.cl | 1234 |
| FUNCIONARIO | juan.perez@sifire.cl | 1234 |
| BRIGADISTA | carlos.rojas@sifire.cl | 1234 |
| CIUDADANO | pedro.silva@sifire.cl | 1234 |

---

## 7. Base de datos

Ejecutar `sifire_back/db/sifire.sql` en phpMyAdmin. El script crea la base de datos desde cero con todos los datos de prueba incluidos.

---

## 8. Preguntas técnicas frecuentes del profe

**¿Por qué BFF y no API Gateway directo?**
El BFF combina datos de múltiples micros en una sola respuesta — por ejemplo, el mapa junta reportes + zonas + brigadas + rutas en una llamada. Un API Gateway solo enruta, no combina.

**¿Dónde está el Circuit Breaker?**
En ms-bff con Resilience4j. Protege las llamadas a ms-reportes y ms-monitoreo. Si caen, devuelve un fallback con null y mensaje amigable.

**¿Por qué Factory Method y no un if/else?**
Porque agregar un nuevo tipo de reportante (ej: BOMBERO) solo requiere una nueva clase factory sin modificar el código existente. Cumple el principio Open/Closed de SOLID.

**¿Qué pasa si cae un microservicio?**
El Circuit Breaker del BFF tiene fallbacks para ms-reportes y ms-monitoreo. El login (ms-usuarios) devuelve 401 limpio si las credenciales son incorrectas.

**¿Cómo se actualiza el mapa en tiempo real?**
El frontend hace polling cada 10 segundos. No es WebSocket — es un `setInterval` que llama a la API y actualiza el estado de React.

**¿Por qué el Observer está fuera de la transacción?**
Para que si ms-alertas o ms-monitoreo fallan, el reporte igual quede guardado en la BD. Si el Observer estuviera dentro del `@Transactional`, un fallo haría rollback del reporte.

---

## 9. Lo que falta para el Parcial 3

- Pruebas unitarias con JaCoCo (mínimo 60% de cobertura)
- Pipeline CI/CD en `.github/workflows/`
- Docker con `docker-compose.yml` para levantar todo con un comando
- Git Flow con ramas `feature/*`
- `UsuarioFactoryTest.java` con 5 tests (ya generado, falta pegarlo)