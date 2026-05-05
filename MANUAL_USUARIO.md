# Manual de Usuario y Operación — SIFIRE
## Sistema Inteligente de Fiscalización y Respuesta ante Emergencias

**Autor:** Equipo CCS  
**Versión:** Ambiente de pruebas universitario v1  
**Proyecto:** SIFIRE  
**Rama revisada:** `feature/database-per-service`  
**Frontend:** `http://localhost:5173`

---

## 1. Propósito del sistema

SIFIRE es una plataforma web que permite registrar reportes de incendios, visualizar focos activos en un mapa, coordinar brigadas de respuesta y emitir alertas para la comunidad. El sistema simula un entorno municipal donde distintos tipos de usuarios participan en un flujo operativo completo: detección, reporte, evaluación, asignación, atención y cierre del incidente.

El sistema responde estas preguntas:
- ¿Quién detectó el incendio?
- ¿Dónde está ocurriendo?
- ¿Qué tan grave parece?
- ¿Quién debe atenderlo?
- ¿Cómo se informa a la comunidad?
- ¿En qué estado va el caso?

---

## 2. Arquitectura del sistema

SIFIRE está construido como una solución de **microservicios**, donde cada servicio tiene una responsabilidad concreta. El frontend se comunica directamente con cada microservicio según la función requerida.

### Componentes principales

| Componente | Puerto | Función |
|---|---:|---|
| `sifire-frontend` | 5173 | Interfaz web para usuarios |
| `ms-usuarios` | 8081 | Registro, autenticación y gestión de roles |
| `ms-reportes` | 8082 | Creación y seguimiento de reportes de incendio |
| `ms-monitoreo` | 8083 | Mapa, brigadas, zonas de riesgo y rutas de evacuación |
| `ms-alertas` | 8084 | Alertas manuales y automáticas a la comunidad |

### Bases de datos

| Microservicio | Base de datos |
|---|---|
| ms-usuarios | `sifire_usuarios` |
| ms-reportes | `sifire_reportes` |
| ms-monitoreo | `sifire_monitoreo` |
| ms-alertas | `sifire_alertas` |

---

## 3. Cómo levantar el sistema

```bash
# ms-usuarios
cd sifire_back/ms-usuarios && mvn spring-boot:run

# ms-reportes
cd sifire_back/ms-reportes && mvn spring-boot:run

# ms-monitoreo
cd sifire_back/ms-monitoreo && mvn spring-boot:run

# ms-alertas
cd sifire_back/ms-alertas && mvn spring-boot:run

# frontend
cd sifire-frontend && npm run dev
```

Abrir `http://localhost:5173`.

---

## 4. Cuentas de prueba

| Rol | Email | Contraseña |
|---|---|---|
| ADMINISTRADOR | `admin@sifire.cl` | `admin1234` |
| FUNCIONARIO | `carlos@sifire.cl` | `funcion123` |
| FUNCIONARIO | `laura@sifire.cl` | `funcion123` |
| BRIGADISTA | `pedro@sifire.cl` | `brigada123` |
| BRIGADISTA | `ana@sifire.cl` | `brigada123` |
| CIUDADANO | `maria@gmail.com` | `ciudadano1` |
| CIUDADANO | `jorge@gmail.com` | `ciudadano1` |

> **Tip:** Abrir cada rol en una ventana distinta o en modo incógnito para simular el flujo completo.

---

## 5. Roles y permisos

### Ciudadano
- ✅ Crear reportes (nivel máximo: `MEDIO`)
- ✅ Ver focos en el mapa
- ✅ Leer alertas publicadas
- ❌ Asignar brigadas ni emitir alertas

### Brigadista
- ✅ Crear reportes (nivel máximo: `ALTO`)
- ✅ Ver el mapa
- ✅ Consultar `/mis-asignaciones`
- ✅ Marcar reporte como `RESUELTO` o `DESCARTADO`
- ❌ Emitir alertas manuales

### Funcionario
- ✅ Ver dashboard con todos los reportes
- ✅ Asignar brigadas disponibles
- ✅ Emitir alertas manuales (con mapa integrado)
- ✅ Ver mapa completo con brigadas, zonas y rutas
- ✅ Cambiar estado a `RESUELTO` o `DESCARTADO`

### Administrador
- ✅ Todo lo del funcionario
- ✅ Gestionar y crear cuentas de usuario
- ✅ Asignar brigadistas a alertas

---

## 6. Flujo operativo completo

```
[CIUDADANO]          [FUNCIONARIO]         [BRIGADISTA]
     │                     │                     │
     ▼                     │                     │
Crea reporte               │                     │
(estado: PENDIENTE)        │                     │
     │                     │                     │
     ├──► ms-alertas crea alerta automática       │
     └──► ms-monitoreo registra foco en mapa      │
                           │                     │
                    Revisa dashboard              │
                    Asigna brigada DISPONIBLE     │
                           │                     │
               Reporte → EN_PROCESO              │
               Brigada → EN_CAMINO               │
                           │                     │
                    Emite alerta manual           │
                    (opcional)                   │
                           │                     │
                           │              Ve /mis-asignaciones
                           │              Marca: RESUELTO
                           │                     │
                           │              Brigada → DISPONIBLE
                           │
                    Confirma: RESUELTO o DESCARTADO
```

---

## 7. Guía paso a paso por rol

### Ciudadano
1. Login con `maria@gmail.com` / `ciudadano1`
2. **Informes** → crear reporte con ubicación en el mapa
3. **Mapa** → verificar que aparece el foco
4. **Alertas** → verificar alerta automática generada

### Funcionario
1. Login con `carlos@sifire.cl` / `funcion123`
2. **Dashboard** → filtrar `PENDIENTE`
3. Asignar brigada `DISPONIBLE` al reporte
4. Reporte pasa a `EN_PROCESO`, brigada a `EN_CAMINO`
5. **Alertas** → emitir alerta manual marcando el mapa

### Brigadista
1. Login con `pedro@sifire.cl` / `brigada123`
2. **Mis Asignaciones** → ver card con datos del reporte
3. Marcar como `RESUELTO`
4. Brigada vuelve a `DISPONIBLE`

### Administrador
1. Login con `admin@sifire.cl` / `admin1234`
2. **Gestión de Brigadistas** → revisar o crear cuentas
3. **Alertas** → botón "👥 Asignar Brigada"

---

## 8. Estados del sistema

### Reporte
| Estado | Significado |
|---|---|
| `PENDIENTE` | Creado, sin atender |
| `EN_PROCESO` | Brigada asignada |
| `RESUELTO` | Incidente atendido |
| `DESCARTADO` | No requirió intervención |

### Brigada
| Estado | Significado |
|---|---|
| `DISPONIBLE` | Lista para asignar |
| `EN_CAMINO` | Asignada y en desplazamiento |
| `INTERVINIENDO` | En intervención activa |
| `INACTIVA` | Fuera de servicio |

### Alerta
| Estado | Significado |
|---|---|
| `PENDIENTE` | Creada, no enviada |
| `ENVIADA` | Despachada |
| `FALLIDA` | Error en el envío |
| `ASIGNADA` | Brigadistas asignados |

---

## 9. Patrones de diseño implementados

### Factory Method — `ms-reportes`
Crea reportes con reglas distintas según el tipo de reportante. Ciudadano → nivel `MEDIO` máximo. Funcionario → puede llegar a `CRITICO`.

### Observer — `ms-reportes`
Al crear un reporte, notifica automáticamente a `ms-alertas` y `ms-monitoreo`. La notificación ocurre **fuera de la transacción principal**, por lo que si falla el envío a alertas, el reporte igual queda guardado.

### Repository — todos los microservicios
Encapsula el acceso a base de datos mediante JPA. Separa lógica de negocio del acceso a datos.

### Circuit Breaker — declarado en arquitectura
Protege la comunicación entre servicios ante fallos. Si un microservicio no responde, el sistema entrega un fallback amigable.

---

## 10. Problemas esperables

| Síntoma | Causa probable | Solución |
|---|---|---|
| `ERR_CONNECTION_REFUSED` | Un microservicio no está corriendo | Revisar y levantar el MS faltante |
| Mapa no actualiza al instante | Polling cada 10 segundos | Esperar un momento |
| Login da 401 | Email o contraseña incorrectos | Usar cuentas exactas de sección 4 |
| Mis Asignaciones vacío | No hay asignaciones aún | Funcionario debe asignar primero |
| Alertas no cargan | ms-alertas no está corriendo | Levantar ms-alertas en puerto 8084 |

---

## 11. Resumen operativo

| Rol | Qué hace | Resultado esperado |
|---|---|---|
| Ciudadano | Reporta un incendio | Caso en `PENDIENTE` |
| Funcionario | Coordina y asigna brigadas | Flujo avanza |
| Brigadista | Atiende y cierra el caso | Brigada liberada |
| Administrador | Mantiene el entorno | Ambiente controlado |
