# sifire-frontend — Interfaz de Usuario

## ¿Qué es?

Aplicación web construida con **React 19 + Vite** que permite a los distintos usuarios de la municipalidad interactuar con el sistema SIFIRE. Se comunica **exclusivamente** con el `ms-bff` en `http://localhost:8080` — nunca habla directamente con los microservicios individuales.

---

## Stack Tecnológico

| Tecnología | Versión | ¿Para qué se usa? |
|---|---|---|
| React | 19.x | Framework principal de la UI |
| Vite | 8.x | Servidor de desarrollo y build |
| React Router | 7.x | Navegación y rutas protegidas por rol |
| Axios | 1.x | Llamadas HTTP al BFF |
| Bootstrap | 5.3 | Estilos y componentes visuales |
| Leaflet + React-Leaflet | 1.9 / 5.0 | Mapa interactivo de focos y zonas |
| Leaflet Cluster | 4.x | Agrupación de marcadores en el mapa |
| Lucide React | 1.8 | Íconos SVG |

---

## Estructura de Carpetas

```
sifire-frontend/
└── src/
    ├── pages/                   # Pantallas principales
    │   ├── Login.jsx            # Inicio de sesión
    │   ├── Registro.jsx         # Registro de nuevo usuario
    │   ├── Dashboard.jsx        # Panel de control (solo FUNCIONARIO/ADMIN)
    │   ├── Reportes.jsx         # Crear y listar reportes (todos los roles)
    │   ├── Monitoreo.jsx        # Mapa interactivo (todos los roles)
    │   ├── Alertas.jsx          # Gestión de alertas (solo FUNCIONARIO/ADMIN)
    │   ├── GestionBrigadistas.jsx  # Asignar brigadas (solo FUNCIONARIO/ADMIN)
    │   ├── MisAsignaciones.jsx  # Ver mis asignaciones (solo BRIGADISTA)
    │   ├── NoAutorizado.jsx     # Página de acceso denegado
    │   └── 404.jsx              # Página no encontrada
    ├── services/                # Funciones de llamadas al BFF
    │   ├── usuario.service.js
    │   ├── reporte.service.js
    │   ├── alerta.service.js
    │   └── monitoreo.service.js
    └── components/              # Componentes reutilizables
        ├── NavbarComponent.jsx
        ├── FooterComponent.jsx
        └── RutaProtegida.jsx    # Valida el rol del usuario antes de mostrar la página
```

---

## Rutas y Control de Acceso

El componente `RutaProtegida` lee el rol del usuario desde `localStorage` y redirige a `/no-autorizado` si el rol no tiene permiso para esa ruta.

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` y `/login` | Público | Pantalla de inicio de sesión |
| `/registro` | Público | Formulario de registro |
| `/reportes` | Todos los roles | Crear y ver reportes de incendio |
| `/monitoreo` | Todos los roles | Mapa con focos, zonas y brigadas |
| `/dashboard` | FUNCIONARIO, ADMINISTRADOR | Panel de gestión y estadísticas |
| `/alertas` | FUNCIONARIO, ADMINISTRADOR | Emitir y gestionar alertas |
| `/brigadistas` | FUNCIONARIO, ADMINISTRADOR | Asignar brigadas a reportes |
| `/mis-asignaciones` | BRIGADISTA | Ver los reportes asignados |

---

## Levantar en desarrollo

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Accede en: **http://localhost:5173**

> ⚠️ Asegúrate de que el `ms-bff` esté corriendo en `http://localhost:8080` antes de usar la aplicación.

## Generar build de producción

```bash
npm run build
npm run preview   # Para revisar el build localmente
```
