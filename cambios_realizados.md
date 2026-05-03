# Documentación de cambios — rama `dev`

> Fecha: 02-05-2026  
> Autor de los cambios: Matías (MatiDroid21)  
> Propósito: registrar todo lo que se corrigió y agregó para que el equipo entienda por qué funciona el sistema.
> Hola KBROS, aqui un pequeño documento de lo que se trabajó en dev para el proyecto de fullstack
---

## Resumen general

Se corrigieron bugs críticos que impedían el funcionamiento del flujo principal, se completó la integración real entre microservicios, y se agregó la página de gestión de usuarios para el administrador. El sistema ahora funciona de punta a punta: registro → login → reporte → asignación de brigada → resolución.

---

## 1. Flujo de asignación de brigadas — corregido completamente

### Problema
El modal de asignación en la página de Reportes usaba datos hardcodeados (`brigadistasMock` con 3 nombres inventados). Al confirmar una asignación, solo cambiaba el estado del reporte pero **nunca guardaba la asignación** en la tabla `ASIGNACION_BRIGADA` de ms-monitoreo.

### Archivos modificados

**`sifire-frontend/src/hooks/useReportes.js`**
- Se importó `listarBrigadas` y `crearAsignacion` desde `monitoreo.service`
- Se carga la lista de brigadas reales al montar el componente
- `handleAsignar` ahora hace dos llamadas en orden:
  1. `crearAsignacion({ reporteId, brigadaId })` → guarda en `ASIGNACION_BRIGADA`
  2. `cambiarEstadoReporte(id, 'EN_PROCESO')` → actualiza estado del reporte
- Se exporta `brigadas` para que el modal pueda usarlas

**`sifire-frontend/src/components/reportes/ModalAsignar.jsx`**
- Eliminado el import de `brigadistasMock`
- Ahora recibe `brigadas` como prop y filtra solo las con estado `DISPONIBLE`
- Muestra nombre y tipo de cada brigada en el select

**`sifire_back/ms-monitoreo/.../MonitoreoController.java`**
- El endpoint `POST /api/asignaciones` ahora acepta también `/api/asignaciones/crear`
- Era necesario porque el BFF llama a `/api/asignaciones/crear` pero el controller solo tenía `/api/asignaciones`

---

## 2. Dashboard — desacoplado del microservicio directo

### Problema
`Dashboard.jsx` hacía llamadas directas a `http://localhost:8083` (ms-monitoreo) saltándose el BFF. Esto rompía la arquitectura y dejaba sin efecto el Circuit Breaker.

### Archivos modificados

**`sifire-frontend/src/pages/Dashboard.jsx`**
- Eliminada la constante `const API_MONITOREO = 'http://localhost:8083'`
- Importados `listarBrigadas` y `crearAsignacion` desde `monitoreo.service` (que va por BFF)
- Importado `cambiarEstadoReporte` desde `reporte.service`
- `useEffect` ahora carga reportes y brigadas en paralelo con `Promise.all`
- KPI de brigadas ahora cuenta las reales (estado `DISPONIBLE` o `EN_CAMINO`)
- KPI "Controlados Hoy" corregido a `RESUELTO` (el estado real del modelo)
- El modal de asignación solo muestra brigadas `DISPONIBLE`
- El botón "Asignar" solo aparece si el reporte está en `PENDIENTE`
- `usuario?.rol` → `usuario?.tipo` en el header del dashboard

---

## 3. Mapa de monitoreo — rutas y zonas desde la BD

### Problema 1 — Rutas hardcodeadas
Las rutas de evacuación estaban como un array fijo en el código de `Monitoreo.jsx`. La tabla `ruta_evacuacion` existía en la BD y ms-monitoreo tenía el endpoint, pero nunca se llamaba.

### Problema 2 — Rol incorrecto
Las guards del mapa usaban `usuario?.rol` pero la propiedad real del modelo es `usuario?.tipo`. Resultado: ningún funcionario veía las zonas de riesgo ni las rutas de evacuación.

### Problema 3 — Crash de Leaflet
Las coordenadas de zonas y rutas llegan de la BD como texto JSON (string). Leaflet necesita un array. Al intentar dibujarlas, lanzaba `Cannot read properties of null (reading '0')` y el mapa colapsaba.

### Archivos modificados

**`sifire-frontend/src/services/monitoreo.service.js`**
- Agregada función `listarRutas()` que llama a `GET /bff/monitoreo/rutas`
- Manejo de error con `try/catch` que retorna `[]` si el endpoint falla

**`sifire-frontend/src/pages/Monitoreo.jsx`**
- Eliminado el array hardcodeado `rutasEvacuacion`
- Corregidas las guards: `usuario?.rol` → `usuario?.tipo`
- Agregado estado `rutas` y carga en el `Promise.all` junto a zonas y brigadas
- Agregada función helper `parseCoords` para convertir strings JSON a arrays:
  ```js
  const parseCoords = (valor) => {
      if (!valor) return null;
      if (Array.isArray(valor)) return valor;
      try { return JSON.parse(valor); } catch { return null; }
  };
  ```
- Brigadas solo se renderizan si tienen `latitud` y `longitud` (evita crash)

**`sifire_back/ms-bff/.../BffController.java`**
- Agregado endpoint `GET /bff/monitoreo/rutas`

**`sifire_back/ms-bff/.../BffService.java`**
- Agregado método `listarRutas()` que llama a `ms-monitoreo/api/rutas-evacuacion`

---

## 4. Formulario de brigadas — select de estado corregido

### Problema
En `GestionBrigadistas.jsx` había 4 `<option>` de estado flotando en el JSX sin un `<select>` padre. React las ignoraba y no se podía seleccionar el estado al crear una brigada.

### Archivo modificado

**`sifire-frontend/src/pages/GestionBrigadistas.jsx`**
- Las opciones sueltas fueron envueltas correctamente en un `<div>` + `<label>` + `<select name="estado">`

---

## 5. Login — manejo de error 401 corregido

### Problema
Cuando ms-usuarios devolvía `401 Unauthorized` (credenciales incorrectas), el `RestTemplate` del BFF lanzaba una excepción no capturada, que se propagaba como `500 Internal Server Error` al frontend. El usuario veía "Error en el inicio de sesión" genérico en vez de "Email o contraseña incorrectos".

### Archivo modificado

**`sifire_back/ms-bff/.../BffService.java`**
- El método `login()` ahora captura `HttpClientErrorException.Unauthorized`
- Relanza como `ResponseStatusException` con `HttpStatus.UNAUTHORIZED`
- El frontend recibe el 401 limpio y muestra el mensaje correcto

---

## 6. Registro de usuarios — campo `tipo` corregido

### Problema
`Registro.jsx` mandaba `rol: 'CIUDADANO'` al registrar, pero el modelo Java `Usuario` usa el campo `tipo`. El campo `rol` era ignorado y el usuario quedaba sin tipo asignado.

### Archivo modificado

**`sifire-frontend/src/pages/Registro.jsx`**
- `rol: 'CIUDADANO'` → `tipo: 'CIUDADANO'`

---

## 7. Página de gestión de usuarios — nueva

### Motivación
El navbar del ADMINISTRADOR tenía el link `/usuarios` que daba 404 porque la página no existía. El administrador necesita poder crear cuentas de funcionarios municipales y brigadistas, ya que esos roles no pueden auto-registrarse.

### Archivos creados/modificados

**`sifire-frontend/src/pages/GestionUsuarios.jsx`** ← nuevo
- Lista todos los usuarios del sistema con filtros por tipo
- Formulario para crear usuarios de cualquier tipo (FUNCIONARIO, BRIGADISTA, CIUDADANO)
- Badges de color por tipo y estado
- Solo accesible para el rol ADMINISTRADOR

**`sifire-frontend/src/App.jsx`**
- Importado `GestionUsuarios`
- Eliminadas las rutas duplicadas de `/dashboard` y `/brigadistas` que existían dos veces
- Agregada ruta `/usuarios` protegida solo para `ADMINISTRADOR`

**`sifire-frontend/src/components/NavbarComponent.jsx`**
- `usuario?.rol` → `usuario?.tipo` en el texto del header (mostraba vacío antes)

---

## 8. Visibilidad del mapa por rol

El mapa muestra información diferente según el tipo de usuario. Esto está controlado en `Monitoreo.jsx`:

| Elemento | CIUDADANO | BRIGADISTA | FUNCIONARIO |
|---|---|---|---|
| Focos de incendio (círculos) | ✅ | ✅ | ✅ |
| Brigadas activas (marcadores) | ❌ | ✅ | ✅ |
| Zonas de riesgo (polígonos) | ❌ | ❌ | ✅ |
| Rutas de evacuación (líneas) | ❌ | ❌ | ✅ |

---

## 9. Datos de prueba — BD

Para la demo se necesitan datos en la BD. Ejecutar en phpMyAdmin:

```sql
-- Limpiar y poblar desde cero
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE asignacion_brigada;
TRUNCATE TABLE alerta_asignaciones;
TRUNCATE TABLE alerta;
TRUNCATE TABLE reporte_multimedia;
TRUNCATE TABLE historial_reporte;
TRUNCATE TABLE reporte_incendio;
TRUNCATE TABLE zona_riesgo;
TRUNCATE TABLE ruta_evacuacion;
TRUNCATE TABLE brigada;
TRUNCATE TABLE usuario;
SET FOREIGN_KEY_CHECKS = 1;

-- Usuarios (contraseña: 1234)
INSERT INTO usuario (nombre, email, password, tipo, activo, username, telefono) VALUES
('Admin SIFIRE',  'admin@sifire.cl',  '1234', 'ADMINISTRADOR', 1, 'admin',  NULL),
('Juan Pérez',    'juan@sifire.cl',   '1234', 'CIUDADANO',     1, 'juan',   '+56912345678'),
('Carlos Muñoz',  'carlos@sifire.cl', '1234', 'FUNCIONARIO',   1, 'carlos', '+56912345679'),
('María González','maria@sifire.cl',  '1234', 'BRIGADISTA',    1, 'maria',  '+56912345670'),
('Pedro Soto',    'pedro@sifire.cl',  '1234', 'BRIGADISTA',    1, 'pedro',  '+56912345671');

-- Brigadas en sector San Joaquín / Duoc
INSERT INTO brigada (nombre, tipo, estado, latitud, longitud) VALUES
('Brigada San Joaquín',  'URBANA',   'DISPONIBLE',    -33.4969, -70.6168),
('Brigada Vicuña Mac.',  'FORESTAL', 'DISPONIBLE',    -33.4990, -70.6130),
('Brigada Sur',          'MIXTA',    'INTERVINIENDO', -33.5010, -70.6180);

-- Zonas de riesgo
INSERT INTO zona_riesgo (nombre, nivel_riesgo, coordenadas, activo) VALUES
('Sector Duoc - Zona Industrial', 'ALTO',
 '[[-33.4960,-70.6180],[-33.4980,-70.6180],[-33.4980,-70.6150],[-33.4960,-70.6150]]', 1),
('Sector Parque Felipe Camiroaga', 'MEDIO',
 '[[-33.5000,-70.6200],[-33.5020,-70.6200],[-33.5020,-70.6160],[-33.5000,-70.6160]]', 1);

-- Rutas de evacuación
INSERT INTO ruta_evacuacion (nombre, trazado, descripcion, activo) VALUES
('Ruta Vicuña Mackenna Norte',
 '[[-33.4969,-70.6168],[-33.4956,-70.6147],[-33.4930,-70.6130],[-33.4900,-70.6110]]',
 'Evacuación por Av. Vicuña Mackenna hacia el norte', 1),
('Ruta Walker Martínez Oriente',
 '[[-33.4969,-70.6168],[-33.4975,-70.6140],[-33.4980,-70.6110],[-33.4990,-70.6080]]',
 'Evacuación por Walker Martínez hacia el oriente', 1);
```

---

## 10. Cómo levantar el backend

```bash
cd sifire_back
taskkill //F //IM java.exe   # matar procesos Java previos (Windows)
sh iniciar_ms.sh
```

Orden de arranque (el script lo hace automático):
1. `ms-usuarios` → puerto 8081
2. `ms-reportes` → puerto 8082
3. `ms-monitoreo` → puerto 8083
4. `ms-alertas` → puerto 8084
5. `ms-bff` → puerto 8080 (depende de todos los anteriores)

---

## 11. Cuentas de prueba para la demo

| Rol | Email | Contraseña | Qué puede hacer |
|---|---|---|---|
| ADMINISTRADOR | `admin@sifire.cl` | `1234` | Crear usuarios de cualquier tipo |
| FUNCIONARIO | `carlos@sifire.cl` | `1234` | Dashboard, asignar brigadas, alertas, mapa completo |
| BRIGADISTA | `maria@sifire.cl` | `1234` | Ver asignaciones, marcar resuelto, mapa con brigadas |
| CIUDADANO | `juan@sifire.cl` | `1234` | Crear reportes, ver mapa básico |

---

## Pendiente para Parcial 3

- Eliminar `console.log` de debug en `RutaProtegida.jsx`
- Eliminar `System.out.println` de debug en `UsuarioService.java`
- Pruebas unitarias con mínimo 60% de cobertura (JaCoCo + SonarQube)
- Pipeline de CI/CD en `.github/workflows/`
- Estrategia de branching (Git Flow): crear ramas `feature/*` desde `dev`