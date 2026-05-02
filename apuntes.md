📚 SIFIRE Backend — Documentación Técnica
¿Qué es este proyecto?
SIFIRE es un sistema de información para incendios forestales. El backend está construido como una arquitectura de microservicios — en vez de tener una sola aplicación gigante, hay 5 aplicaciones independientes que se comunican entre sí. Cada una tiene su propia base de datos, su propio servidor y su propia responsabilidad.

🗺️ Mapa de microservicios
text
FRONTEND
    |
    ↓
[ms-bff :8080]          ← Punto de entrada único
    |
    ├──→ [ms-usuarios  :8081]   ← Gestión de usuarios
    ├──→ [ms-reportes  :8082]   ← Reportes de incendios
    ├──→ [ms-monitoreo :8083]   ← Zonas, brigadas, rutas
    └──→ [ms-alertas   :8084]   ← Alertas del sistema
El frontend nunca habla directamente con ms-reportes o ms-monitoreo — siempre pasa por el BFF. Eso simplifica el frontend y centraliza la lógica de agregación.

🔧 Tecnologías usadas (y por qué)
Tecnología	Para qué sirve
Spring Boot 3.2.5	Framework base de cada microservicio. Levanta el servidor, maneja las rutas HTTP, inyección de dependencias
Spring Data JPA	Permite hablar con la base de datos sin escribir SQL manual. Usas métodos como findAll() o findById()
Hibernate	Se encarga de traducir tus clases Java a tablas SQL automáticamente
MySQL	Base de datos relacional donde se guardan los datos
Spring Cloud	Conjunto de herramientas para microservicios: circuit breaker, load balancer, etc
Resilience4j	Implementa el patrón Circuit Breaker — si un micro cae, el sistema no colapsa
Lombok	Evita código repetitivo: genera getters, setters, constructores con anotaciones (@Data, @NoArgsConstructor)
HikariCP	Pool de conexiones a la BD — reutiliza conexiones en vez de crear una nueva por cada request
📦 Estructura interna de cada microservicio
Todos los micros siguen la misma estructura en capas:

text
src/main/java/cl/sifire/{nombre}/
    ├── controller/    ← Recibe las peticiones HTTP (GET, POST, etc)
    ├── service/       ← Lógica de negocio
    ├── repository/    ← Acceso a la base de datos
    ├── model/         ← Clases que representan las tablas de la BD
    └── config/        ← Configuraciones especiales
¿Por qué estas capas? Cada capa tiene una sola responsabilidad. El controller no sabe nada de SQL, el repository no sabe nada de reglas de negocio. Eso es el patrón de diseño en capas (Layered Architecture).

🔍 Microservicio por microservicio
1. ms-usuarios (Puerto 8081)
Qué hace: Gestiona los usuarios del sistema — ciudadanos, brigadistas y funcionarios.

Cómo se configuró:

Spring Boot + JPA conectado a MySQL

Registrado en Eureka (service discovery) para que los demás micros lo encuentren por nombre en vez de IP

Endpoints principales:

text
GET  /api/usuarios        → lista todos los usuarios
GET  /api/usuarios/{id}   → un usuario específico
POST /api/usuarios        → crear usuario
2. ms-reportes (Puerto 8082)
Qué hace: Gestiona los reportes de incendios que crean los ciudadanos, brigadistas y funcionarios.

Cómo se configuró:

Hibernate hizo ALTER TABLE automático al arrancar — agregó columnas fecha_creacion, fecha_actualizacion, tipo_reportante sin borrar datos

El campo tipo_reportante es un ENUM en MySQL: solo acepta los valores CIUDADANO, BRIGADISTA, FUNCIONARIO

Endpoints principales:

text
GET  /api/reportes              → todos los reportes
GET  /api/reportes?activos=true → solo reportes activos (EN_PROCESO o PENDIENTE)
POST /api/reportes              → crear reporte
Modelo de datos:

java
ReporteIncendio {
    id, usuarioId, descripcion,
    latitud, longitud,          // coordenadas del incendio
    nivelRiesgo,                // BAJO, MEDIO, ALTO
    estado,                     // PENDIENTE, EN_PROCESO, CERRADO
    tipoReportante              // CIUDADANO, BRIGADISTA, FUNCIONARIO
}
3. ms-monitoreo (Puerto 8083)
Qué hace: Gestiona las zonas de riesgo, brigadas de bomberos y rutas de evacuación.

Cómo se configuró:

Tenía un bug: ZonaRiesgo.java importaba @Id de org.springframework.data.annotation (Spring Data, para MongoDB) en vez de jakarta.persistence (JPA, para MySQL) — eso causaba que Hibernate no reconociera el identificador de la entidad

También faltaba @Service en la clase de servicio

Entidades principales:

text
ZonaRiesgo    → polígono geográfico con nivel de riesgo (BAJO/MEDIO/ALTO/CRÍTICO)
Brigada       → equipo de respuesta con ubicación GPS y estado
RutaEvacuacion → camino seguro para evacuar una zona
AsignacionBrigada → qué brigada está asignada a qué reporte
Endpoints principales:

text
GET /api/zonas-riesgo      → todas las zonas
GET /api/brigadas          → todas las brigadas
GET /api/rutas-evacuacion  → todas las rutas
4. ms-alertas (Puerto 8084)
Qué hace: Gestiona las alertas generadas por el sistema cuando se detecta un incendio o situación de riesgo.

Endpoints principales:

text
GET /api/alertas/historial  → historial completo de alertas
POST /api/alertas           → crear alerta
5. ms-bff (Puerto 8080) ⭐ El más importante
Qué hace: Backend For Frontend — es el único punto de contacto con el frontend. Agrega datos de múltiples microservicios en una sola respuesta.

Por qué existe: Sin BFF, el frontend tendría que hacer 4 requests separados para mostrar el mapa (reportes + zonas + brigadas + rutas). Con BFF hace 1 solo request y recibe todo junto.

Cómo funciona internamente:

java
// Cuando el frontend pide GET /bff/mapa:
public Map<String, Object> getDatosMapa() {
    datos.put("reportesActivos", llamar a ms-reportes)
    datos.put("zonas",           llamar a ms-monitoreo)
    datos.put("rutas",           llamar a ms-monitoreo)
    datos.put("brigadas",        llamar a ms-monitoreo)
    return datos  // todo junto en una respuesta
}
Patrón Circuit Breaker aplicado aquí:

java
@CircuitBreaker(name = "ms-monitoreo", fallbackMethod = "mapaFallback")
public Map<String, Object> getDatosMapa() { ... }

// Si ms-monitoreo no responde, se ejecuta esto en vez de lanzar error:
public Map<String, Object> mapaFallback(Exception e) {
    return Map.of("mensaje", "servicio no disponible, intente mas tarde")
}
¿Qué es el Circuit Breaker? Imagina un interruptor eléctrico de la casa — si hay un cortocircuito, se corta automáticamente para no dañar todo. Aquí, si ms-monitoreo tarda mucho o falla, el "interruptor" se abre y en vez de que el BFF también falle, ejecuta el método fallbackMethod devolviendo una respuesta controlada.

Endpoints:

text
GET /bff/mapa        → datos combinados para el mapa (zonas + brigadas + rutas + reportes)
GET /bff/dashboard   → datos combinados para el dashboard (reportes + alertas)
🌿 Estrategia de ramas (Git Branching)
text
main
 └── dev
      ├── feature/ms-usuarios
      ├── feature/ms-reportes
      ├── feature/ms-monitoreo
      ├── feature/ms-alertas
      └── feature/ms-bff     ← rama de integración actual
La lógica: cada microservicio se desarrolló en su propia rama feature/. Nadie toca el trabajo del otro. Cuando un microservicio está listo, se mergea a dev. Cuando dev está estable y probado, se mergea a main.

🏗️ Patrones de diseño aplicados
1. BFF (Backend For Frontend)
Problema que resuelve: El frontend necesita datos de múltiples fuentes. Sin BFF haría múltiples requests lentos.

Solución: Un microservicio dedicado que agrega y adapta los datos según lo que necesita el frontend.

2. Circuit Breaker
Problema que resuelve: Si ms-monitoreo cae, sin Circuit Breaker el BFF también falla, y el frontend queda sin respuesta.

Solución: Si el servicio falla, se ejecuta un método alternativo (fallback) que devuelve una respuesta parcial pero controlada.

3. Repository Pattern
Problema que resuelve: El servicio no debería saber cómo se accede a la BD (si es MySQL, MongoDB, etc).

Solución: Cada micro tiene una interfaz Repository que abstrae el acceso a datos. Spring Data JPA implementa esa interfaz automáticamente.

4. Layered Architecture (Capas)
Problema que resuelve: Código mezclado donde el mismo método recibe el HTTP, valida, procesa y guarda en BD — imposible de mantener.

Solución: Controller → Service → Repository → Model. Cada capa con una sola responsabilidad.

🚀 Cómo levantar el proyecto
bash
# 1. Matar procesos Java anteriores
taskkill /F /IM java.exe

# 2. Entrar a la carpeta del backend
cd sifire_back

# 3. Levantar todos los microservicios
bash iniciar_ms.sh
Verificar que todo levantó:


http://localhost:8080/bff/mapa        → datos del mapa
http://localhost:8080/bff/dashboard   → datos del dashboard
