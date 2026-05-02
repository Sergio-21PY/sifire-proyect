# 🔥 SIFIRE — Sistema Inteligente de Fiscalización y Respuesta ante Emergencias

> **Asignatura:** DSY1106 — Desarrollo Fullstack III  
> **Institución:** Duoc UC  
> **Contexto:** Plataforma web desarrollada para la Municipalidad Valle del Sol, orientada a la gestión, monitoreo y respuesta ante incendios forestales y urbanos.

---

## ¿Qué es SIFIRE?

SIFIRE es una aplicación web de microservicios que permite:

- Que **ciudadanos, brigadistas y funcionarios** reporten incendios desde cualquier dispositivo
- Que los **funcionarios municipales** coordinen brigadas, emitan alertas a la comunidad y hagan seguimiento en tiempo real
- Visualizar focos activos, zonas de riesgo y rutas de evacuación en un **mapa interactivo**

---

## 📁 Estructura del Proyecto

```
sifire-proyect/
├── sifire-frontend/          # Aplicación web (React + Vite)
└── sifire_back/
    ├── ms-bff/               # Puerta de entrada al backend — Puerto 8080
    ├── ms-usuarios/          # Registro, login y roles — Puerto 8081
    ├── ms-reportes/          # Reportes de incendio — Puerto 8082
    ├── ms-monitoreo/         # Mapa, brigadas y zonas de riesgo — Puerto 8083
    └── ms-alertas/           # Alertas a la comunidad — Puerto 8084
```

---

## 🏗️ Arquitectura General

El sistema está construido con **arquitectura de microservicios**. Cada microservicio es independiente, tiene su propia base de datos y se comunica solo a través del **BFF (Backend For Frontend)**.

El frontend **nunca habla directamente** con los microservicios — todo pasa por el BFF, que actúa como intermediario inteligente.

```
  Navegador (React)
        │
        ▼
  ms-bff  :8080   ◄── Circuit Breaker protege cada llamada
  ├──► ms-usuarios  :8081   (autenticación y usuarios)
  ├──► ms-reportes  :8082   (reportes de incendio)
  ├──► ms-monitoreo :8083   (mapa, brigadas, zonas)
  └──► ms-alertas   :8084   (alertas a la comunidad)

  Todos los microservicios ──► MySQL (base de datos: sifire)
```

---

## 🎨 Patrones de Diseño Implementados

El proyecto aplica patrones de diseño de software para organizar la lógica de negocio de forma limpia y extensible:

| Patrón | ¿Dónde? | ¿Para qué sirve? |
|---|---|---|
| **Factory Method** | `ms-reportes` | Crea el reporte con distintas reglas según quién lo reporta (ciudadano, brigadista o funcionario) |
| **Observer** | `ms-reportes` | Cuando se crea o actualiza un reporte, notifica automáticamente a ms-alertas y ms-monitoreo |
| **Factory Method** | `ms-usuarios` | Centraliza la creación de usuarios validando que el rol sea válido |
| **Repository** | Todos los microservicios | Separa la lógica de negocio del acceso a la base de datos |
| **Circuit Breaker** | `ms-bff` | Si un microservicio falla, responde con datos de respaldo en lugar de mostrar un error al usuario |
| **BFF** | `ms-bff` | Combina datos de múltiples microservicios en una sola respuesta para el frontend |

---

## 🚀 Cómo Levantar el Proyecto

### Pre-requisitos

Antes de empezar, asegúrate de tener instalado:

- **Java 21** — [Descargar](https://adoptium.net/)
- **Maven 3.9+** — incluido en cada microservicio como `mvnw`
- **Node.js 20+** — [Descargar](https://nodejs.org/)
- **XAMPP** (o MySQL) corriendo, con la base de datos `sifire` creada

> 💡 **Crear la base de datos:** abre phpMyAdmin y ejecuta `CREATE DATABASE sifire;`. Las tablas se crean automáticamente al levantar cada microservicio.

### 1. Backend (levantar en este orden)

Abrir una terminal por cada microservicio:

```bash
# Terminal 1 — Usuarios (levantar primero)
cd sifire_back/ms-usuarios
./mvnw spring-boot:run

# Terminal 2 — Reportes
cd sifire_back/ms-reportes
./mvnw spring-boot:run

# Terminal 3 — Monitoreo
cd sifire_back/ms-monitoreo
./mvnw spring-boot:run

# Terminal 4 — Alertas
cd sifire_back/ms-alertas
./mvnw spring-boot:run

# Terminal 5 — BFF (levantar último, depende de todos los anteriores)
cd sifire_back/ms-bff
./mvnw spring-boot:run
```

> ⚠️ **Importante:** levantar el BFF de último. Si se levanta antes que los demás, el Circuit Breaker activará los fallbacks hasta que los otros microservicios estén disponibles.

### 2. Frontend

```bash
cd sifire-frontend
npm install       # solo la primera vez
npm run dev
```

Accede en: **http://localhost:5173**

---

## 🗄️ Base de Datos

| Propiedad | Valor |
|---|---|
| Motor | MySQL 8 (XAMPP) |
| Nombre | `sifire` |
| Host | `localhost:3306` |
| Usuario | `root` |
| Contraseña | *(vacía)* |

Cada microservicio crea y actualiza sus propias tablas automáticamente (`ddl-auto=update`).

---

## 👥 Roles de Usuario

| Rol | ¿Quién es? | ¿Qué puede hacer? |
|---|---|---|
| `CIUDADANO` | Vecino de la municipalidad | Reportar incendios, ver mapa |
| `BRIGADISTA` | Integrante de brigada | Reportar incendios, ver mapa, ver sus asignaciones |
| `FUNCIONARIO` | Personal municipal | Todo lo anterior + dashboard, emitir alertas, gestionar brigadas |
| `ADMINISTRADOR` | Administrador del sistema | Mismo acceso que funcionario |

---

## 🔄 Flujo Completo del Sistema

```
1. CIUDADANO / BRIGADISTA / FUNCIONARIO
   └─► Se registra y loguea en /login

2. Crea un reporte de incendio en /reportes
   └─► Factory Method elige el nivel de riesgo según su rol
   └─► Observer notifica automáticamente a:
       ├─► ms-alertas  (crea alerta automática)
       └─► ms-monitoreo (registra foco en el mapa)

3. Cualquier usuario autenticado puede ver el mapa en /monitoreo
   └─► El BFF combina: focos + zonas de riesgo + rutas de evacuación + brigadas

4. FUNCIONARIO gestiona desde /dashboard
   ├─► Cambia estado del reporte: PENDIENTE → EN_PROCESO
   ├─► Asigna una brigada → la brigada pasa a EN_CAMINO
   ├─► Emite alerta manual a la comunidad
   └─► Cierra el caso: estado → RESUELTO o DESCARTADO
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + Vite | 19 / 8 |
| Estilos | Bootstrap | 5.3 |
| Mapas | Leaflet + React-Leaflet | 1.9 / 5.0 |
| HTTP client | Axios | 1.x |
| Navegación | React Router | 7.x |
| Backend | Spring Boot | 3.2.x |
| Lenguaje backend | Java | 21 |
| Persistencia | Spring Data JPA + Hibernate | — |
| Resiliencia | Resilience4j | — |
| Base de datos | MySQL 8 | — |
| Build backend | Maven | 3.9+ |

---

## 👨‍💻 Equipo

Proyecto desarrollado en equipo como parte de la asignatura DSY1106 — Desarrollo Fullstack III, Duoc UC.
