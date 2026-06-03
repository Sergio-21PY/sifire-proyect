# 🔥 SIFIRE — Frontend

> **Asignatura:** DSY1106 — Desarrollo Fullstack III  
> **Institución:** Duoc UC  
> **Equipo:** Keiton Chaves · Sergio Soto · Matías Chávez

Aplicación web React para el Sistema Inteligente de Fiscalización y Respuesta ante Emergencias de la Municipalidad Valle del Sol. Permite reportar incendios, coordinar brigadas, monitorear focos en tiempo real y emitir alertas a la comunidad.

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19 | Framework de UI |
| Vite | 8 | Bundler y servidor de desarrollo |
| React Router DOM | 7 | Enrutamiento SPA |
| Axios | 1.15 | Llamadas HTTP a la API |
| Leaflet + React Leaflet | 1.9 / 5 | Mapa interactivo de monitoreo |
| Bootstrap | 5.3 | Estilos base |
| Vitest | 4 | Framework de testing |
| Testing Library | 16 | Utilidades de testing para React |
| V8 Coverage | 4 | Reporte de cobertura de código |

---

## 📁 Estructura del proyecto

```
sifire-frontend/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── brigadistas/     # BrigadistaForm, BrigadistasTabla
│   │   ├── reportes/        # ReporteForm, MapaSelector, Modales
│   │   ├── FooterComponent.jsx
│   │   └── RutaProtegida.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Contexto global de autenticación
│   ├── hooks/
│   │   ├── useBrigadas.js
│   │   ├── useGestionBrigadistas.js
│   │   └── useReportes.js
│   ├── pages/               # Vistas principales
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Alertas.jsx
│   │   ├── GestionBrigadistas.jsx
│   │   ├── GestionUsuarios.jsx
│   │   ├── MisAsignaciones.jsx
│   │   ├── Monitoreo.jsx
│   │   └── NoAutorizado.jsx
│   ├── services/            # Comunicación con los microservicios
│   │   ├── alerta.service.js
│   │   ├── monitoreo.service.js
│   │   ├── reporte.service.js
│   │   └── usuario.service.js
│   ├── styles/              # Estilos por componente
│   └── test/                # Pruebas unitarias
│       ├── views/           # Tests de páginas
│       ├── setup.js
│       └── utils.jsx
├── package.json
└── vite.config.js
```

---

## ✅ Pre-requisitos

Antes de instalar, asegúrate de tener:

- **Node.js 20+** — [Descargar](https://nodejs.org/)
- **npm 10+** — incluido con Node.js
- Los **4 microservicios del backend corriendo** (ver sección de microservicios)

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Sergio-21PY/sifire-proyect.git
cd sifire-proyect/sifire-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

> El servidor de desarrollo incluye un proxy que redirige las llamadas `/api/*` a los microservicios correspondientes. No se necesita configuración adicional para desarrollo local.

---

## 🔌 Proxy de desarrollo

El `vite.config.js` redirige automáticamente las rutas de API:

| Ruta frontend | Microservicio destino |
|---|---|
| `/api/usuarios/*` | `http://localhost:8081` |
| `/api/reportes/*` | `http://localhost:8082` |
| `/api/monitoreo/*` | `http://localhost:8083` |
| `/api/alertas/*` | `http://localhost:8084` |

---

## 🌐 Variables de entorno (opcional)

Para apuntar a un backend en otra URL (por ejemplo, en producción), crea un archivo `.env` en la raíz del frontend:

```env
VITE_MS_USUARIOS_URL=http://localhost:8081
VITE_MS_REPORTES_URL=http://localhost:8082
VITE_MS_MONITOREO_URL=http://localhost:8083
VITE_MS_ALERTAS_URL=http://localhost:8084
```

Si no se definen, el sistema usa `localhost` con los puertos por defecto.

---

## 👥 Roles y accesos

| Rol | Acceso a páginas |
|---|---|
| **CIUDADANO** | Login, Registro, Reportes (crear y ver propios) |
| **BRIGADISTA** | Mis Asignaciones, Monitoreo, Reportes |
| **FUNCIONARIO** | Dashboard, Reportes (gestión), Alertas (emitir), Gestión de Brigadistas, Monitoreo |
| **ADMINISTRADOR** | Gestión de Usuarios, Alertas (asignar brigadas), Dashboard |

---

## 🧪 Pruebas unitarias

### Correr todos los tests

```bash
npm test
```

### Correr tests con reporte de cobertura

```bash
npm run test:coverage
```

Genera la tabla de cobertura en la terminal y un reporte HTML en `coverage/index.html`.

### Ver reporte visual interactivo

```bash
npm run test:ui
```

Abre una interfaz web en `http://localhost:51204/__vitest__/` con el resultado de cada test.

### Abrir el reporte HTML de cobertura

```bash
# Mac / Linux
open coverage/index.html

# Windows
start coverage/index.html
```

> **Nota:** Para que los tests de Alertas y Registro corran sin timeouts, los microservicios del backend deben estar levantados.

---

## 📊 Cobertura actual de tests

| Métrica | Resultado |
|---|---|
| Archivos de test | 11 |
| Total de casos | 160 |
| Statements | 91.1% |
| Branches | 73.62% |
| Functions | 84.74% |
| Lines | 93.45% |

### Distribución de tests por módulo

| Módulo | Archivo de test | Casos |
|---|---|---|
| Login | `views/Login.test.jsx` | 18 |
| Registro | `views/Registro.test.jsx` | 16 |
| Monitoreo | `views/Monitoreo.test.jsx` | 18 |
| Dashboard | `views/Dashboard.test.jsx` | 17 |
| Alertas | `views/Alertas.test.jsx` | 18 |
| GestionBrigadistas | `views/GestionBrigadistas.test.jsx` | 14 |
| RutaProtegida | `views/RutaProtegida.test.jsx` | 8 |
| AuthContext | `AuthContext.test.jsx` | 10 |
| NoAutorizado | `views/NoAutorizado.test.jsx` | 5 |
| useBrigadas | `useBrigadas.test.js` | 17 |
| usuario.service | `usuario.service.test.jsx` | 16 |
| useGestionBrigadistas | `useGestionBrigadista.test.js` | 20 |
| **Total** | | **160** |

---

## 📦 Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos estáticos listos para desplegar.

```bash
# Vista previa del build
npm run preview
```

---

## 🔗 Repositorio

[https://github.com/Sergio-21PY/sifire-proyect](https://github.com/Sergio-21PY/sifire-proyect)
