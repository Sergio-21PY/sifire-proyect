# Manual de Usuario y Operación — SIFIRE
## Sistema Inteligente de Fiscalización y Respuesta ante Emergencias
## Autor: Equipo CCS
**Versión del documento:** Ambiente de pruebas universitario v1

**Proyecto:** SIFIRE  
**Rama revisada:** `dev`  
**Frontend:** `http://localhost:5173`  
**Contexto:** Plataforma web para la Municipalidad Valle del Sol orientada al reporte, monitoreo y respuesta ante incendios forestales y urbanos [cite:2].

---

## 1. Propósito del sistema

SIFIRE es una plataforma web que permite registrar reportes de incendios, visualizar focos activos en un mapa, coordinar brigadas de respuesta y emitir alertas para la comunidad [cite:2]. El sistema está pensado para simular un entorno municipal donde distintos tipos de usuarios participan en un mismo flujo operativo: detección, reporte, evaluación, asignación, atención y cierre del incidente [cite:2][cite:3].

En términos simples, el sistema busca responder estas preguntas:

- ¿Quién detectó el incendio?
- ¿Dónde está ocurriendo?
- ¿Qué tan grave parece?
- ¿Quién debe atenderlo?
- ¿Cómo se informa a la comunidad?
- ¿En qué estado va el caso?

---

## 2. Tipo de sistema

SIFIRE no es una sola aplicación monolítica. Está construido como una solución de **microservicios**, donde cada servicio tiene una responsabilidad concreta y el frontend no conversa con ellos de forma directa, sino a través de un BFF o **Backend For Frontend** [cite:2][cite:3].

### Componentes principales

| Componente | Puerto | Función |
|---|---:|---|
| `sifire-frontend` | 5173 | Interfaz web para usuarios [cite:2] |
| `ms-bff` | 8080 | Punto de entrada del frontend, orquesta llamadas y aplica Circuit Breaker [cite:2][cite:3] |
| `ms-usuarios` | 8081 | Registro, autenticación y gestión de roles [cite:2][cite:3] |
| `ms-reportes` | 8082 | Creación y seguimiento de reportes de incendio [cite:2][cite:3] |
| `ms-monitoreo` | 8083 | Mapa, brigadas, zonas de riesgo y rutas de evacuación [cite:2][cite:3] |
| `ms-alertas` | 8084 | Alertas automáticas y manuales a la comunidad [cite:2][cite:3] |

### Cómo se conectan

El flujo técnico general es el siguiente [cite:2][cite:3]:

1. El usuario interactúa desde el navegador.
2. El frontend envía solicitudes al `ms-bff`.
3. El BFF decide a qué microservicio consultar.
4. Cuando hace falta, el BFF combina datos de varios servicios en una sola respuesta.
5. El frontend recibe los datos ya organizados y muestra la vista correspondiente.

Esto significa que, por ejemplo, el mapa no necesita consultar por separado focos, brigadas, zonas y rutas desde el frontend; el BFF puede reunir esa información en una sola respuesta [cite:2][cite:3].

---

## 3. Objetivo de cada rol

SIFIRE contempla cuatro perfiles funcionales con permisos distintos [cite:2][cite:3].

### 3.1 Ciudadano

El ciudadano representa a un vecino o persona de la comunidad que detecta un posible incendio y quiere informarlo al sistema [cite:2][cite:3].

**Objetivo del rol:**
- Reportar incidentes.
- Consultar el mapa.
- Revisar alertas activas.

**Puede hacer:**
- Registrarse e iniciar sesión [cite:2].
- Crear reportes de incendio [cite:2][cite:3].
- Ver focos en el mapa [cite:2][cite:3].
- Leer alertas publicadas [cite:3].

**No puede hacer:**
- Asignar brigadas [cite:3].
- Cambiar estados operativos avanzados del reporte [cite:3].
- Emitir alertas manuales [cite:2][cite:3].
- Ver brigadas, zonas de riesgo o rutas de evacuación completas como lo hace un funcionario [cite:3].

### 3.2 Brigadista

El brigadista representa al personal operativo que atiende los incidentes en terreno [cite:2][cite:3].

**Objetivo del rol:**
- Revisar sus asignaciones.
- Atender reportes asignados.
- Marcar casos como resueltos.

**Puede hacer:**
- Reportar incendios [cite:2][cite:3].
- Ver el mapa [cite:2][cite:3].
- Consultar sus asignaciones activas en `/mis-asignaciones` [cite:3].
- Marcar un reporte asignado como resuelto [cite:3].

**No puede hacer:**
- Emitir alertas manuales [cite:3].
- Administrar usuarios [cite:3].
- Coordinar globalmente las brigadas [cite:3].

### 3.3 Funcionario

El funcionario representa al personal municipal encargado de coordinar la respuesta [cite:2][cite:3].

**Objetivo del rol:**
- Supervisar reportes.
- Priorizar casos.
- Asignar brigadas.
- Emitir alertas a la comunidad.
- Cerrar casos.

**Puede hacer:**
- Ver el dashboard [cite:2][cite:3].
- Filtrar reportes pendientes [cite:3].
- Asignar una brigada disponible a un caso [cite:3].
- Cambiar el estado del reporte a `EN_PROCESO` [cite:2][cite:3].
- Emitir alertas manuales [cite:2][cite:3].
- Ver mapa completo con brigadas, zonas de riesgo y rutas de evacuación [cite:3].
- Cerrar el reporte como `RESUELTO` o `DESCARTADO` [cite:2].

### 3.4 Administrador

El administrador tiene acceso equivalente o superior al funcionario y además controla la gestión de usuarios [cite:2][cite:3].

**Objetivo del rol:**
- Administrar la plataforma.
- Crear o gestionar cuentas.
- Mantener la operación de prueba ordenada.

**Puede hacer:**
- Todo lo del funcionario [cite:2].
- Gestionar cuentas de usuario [cite:3].
- Crear usuarios de distintos tipos [cite:3].

---

## 4. Cuentas de prueba

El documento del proyecto incluye cuentas de prueba para ambiente universitario [cite:3].

| Rol | Email | Contraseña |
|---|---|---|
| ADMINISTRADOR | `admin@sifire.cl` | `1234` [cite:3] |
| FUNCIONARIO | `juan.perez@sifire.cl` | `1234` [cite:3] |
| BRIGADISTA | `carlos.rojas@sifire.cl` | `1234` [cite:3] |
| CIUDADANO | `pedro.silva@sifire.cl` | `1234` [cite:3] |

> Recomendación para pruebas: usar cada cuenta en sesiones separadas o en ventanas distintas del navegador para observar mejor el flujo entre roles [cite:3].

---

## 5. Flujo funcional del sistema

Esta es la parte más importante del manual, porque explica cómo se usa SIFIRE de principio a fin [cite:2][cite:3].

### 5.1 Inicio del proceso

El flujo siempre comienza cuando un usuario detecta un posible incendio y crea un reporte desde la sección `/reportes` [cite:2][cite:3]. Ese usuario puede ser un ciudadano, un brigadista o un funcionario [cite:2].

Al crear el reporte, el sistema aplica reglas según quién reporta; esto es importante porque no todos los perfiles tienen el mismo nivel de autoridad o capacidad para clasificar la gravedad del incidente [cite:3].

### 5.2 Creación del reporte

Cuando el usuario crea un reporte, el sistema genera un caso en estado inicial `PENDIENTE` [cite:3]. Además, el nivel de riesgo permitido depende del tipo de reportante [cite:3]:

- Ciudadano: hasta nivel `MEDIO` [cite:3]
- Brigadista: hasta nivel `ALTO` [cite:3]
- Funcionario: puede llegar a `CRITICO` [cite:3]

Esto permite que la evaluación inicial sea coherente con el perfil de quien informa el incidente [cite:3].

### 5.3 Reacción automática del sistema

Una vez creado el reporte, no solo queda guardado; además, el sistema desencadena acciones automáticas [cite:2][cite:3]:

- Se genera una alerta automática en `ms-alertas` [cite:3].
- Se registra el foco en el mapa por medio de `ms-monitoreo` [cite:3].

Esto es importante porque reduce pasos manuales. El usuario que reporta no tiene que avisar por separado al mapa ni al sistema de alertas; el propio sistema lo hace [cite:2][cite:3].

### 5.4 Revisión por funcionario

Luego, el funcionario entra al dashboard y revisa los reportes pendientes [cite:2][cite:3]. Desde esa vista puede priorizar la atención, revisar el caso y elegir una brigada disponible [cite:3].

Al asignar una brigada [cite:3]:
- El reporte pasa de `PENDIENTE` a `EN_PROCESO`.
- La brigada cambia a `EN_CAMINO`.

Además, si la situación lo amerita, el funcionario puede emitir una alerta manual a la comunidad con instrucciones adicionales, como evacuación o prevención [cite:3].

### 5.5 Atención por brigadista

El brigadista ve la asignación desde `/mis-asignaciones` [cite:3]. Desde ahí identifica el caso activo, se desplaza al lugar y, una vez terminada la intervención, puede marcar el incidente como `RESUELTO` [cite:3].

Cuando eso ocurre, el sistema libera automáticamente la brigada y la devuelve a estado `DISPONIBLE` [cite:3]. El mapa refleja luego ese cambio en el siguiente ciclo de actualización, que ocurre cada 10 segundos por polling desde el frontend [cite:3].

### 5.6 Cierre del caso

El ciclo termina cuando el funcionario confirma el resultado final del caso [cite:2]. Puede dejarlo como `RESUELTO` si efectivamente fue atendido o como `DESCARTADO` si el incidente no correspondía o no requería intervención real [cite:2].

---

## 6. Qué debe hacer cada usuario en una prueba

Esta sección sirve como guía práctica para una demo o ensayo.

### 6.1 Prueba como Ciudadano

1. Iniciar sesión con la cuenta de ciudadano [cite:3].
2. Ir a `/reportes` [cite:2][cite:3].
3. Crear un reporte con la información solicitada, incluyendo ubicación y, si el formulario lo permite, imagen [cite:3].
4. Ir a `/monitoreo` y comprobar que el foco aparece en el mapa tras la actualización [cite:2][cite:3].
5. Ir a `/alertas` y verificar si se creó una alerta automática [cite:3].

**Qué debe observarse:**
- El reporte queda registrado [cite:3].
- El estado inicial es `PENDIENTE` [cite:3].
- El ciudadano puede ver el foco, pero no brigadas ni zonas avanzadas [cite:3].

### 6.2 Prueba como Funcionario

1. Iniciar sesión con la cuenta de funcionario [cite:3].
2. Entrar al dashboard [cite:2][cite:3].
3. Buscar el reporte recién creado y filtrarlo por estado `PENDIENTE` [cite:3].
4. Seleccionar una brigada `DISPONIBLE` [cite:3].
5. Asignarla al reporte [cite:3].
6. Verificar que el reporte pase a `EN_PROCESO` y que la brigada quede `EN_CAMINO` [cite:3].
7. Opcionalmente, crear una alerta manual desde `/alertas` [cite:3].

**Qué debe observarse:**
- El funcionario ve más información operativa que el ciudadano [cite:3].
- Puede coordinar la atención sin tener que editar manualmente todas las piezas del sistema [cite:2][cite:3].

### 6.3 Prueba como Brigadista

1. Iniciar sesión con la cuenta de brigadista [cite:3].
2. Ir a `/mis-asignaciones` [cite:3].
3. Verificar que aparezca la asignación realizada por el funcionario [cite:3].
4. Simular la atención del caso [cite:3].
5. Marcar el reporte como `RESUELTO` [cite:3].

**Qué debe observarse:**
- La brigada vuelve a estado `DISPONIBLE` [cite:3].
- El mapa se actualiza en el próximo ciclo [cite:3].

### 6.4 Prueba como Administrador

1. Iniciar sesión con la cuenta de administrador [cite:3].
2. Acceder al módulo de usuarios [cite:3].
3. Revisar o crear cuentas de distintos roles [cite:3].
4. Verificar que el acceso dependa del rol asignado [cite:2][cite:3].

**Qué debe observarse:**
- El administrador puede mantener el ambiente de prueba preparado para demo y validación [cite:3].

---

## 7. Vistas del sistema y comportamiento esperado

### Login y registro

La autenticación y el registro son responsabilidad del microservicio `ms-usuarios` [cite:2][cite:3]. Desde aquí se controla el acceso y el rol de cada usuario [cite:2].

### Reportes

La pantalla de reportes permite crear incidentes y consultar su estado [cite:2][cite:3]. Es una de las vistas centrales del sistema, porque desencadena casi todo el flujo operativo [cite:2][cite:3].

### Monitoreo

La vista de monitoreo muestra el mapa interactivo con focos, y según el rol también puede mostrar brigadas, zonas de riesgo y rutas de evacuación [cite:2][cite:3]. El frontend actualiza esta vista con polling cada 10 segundos [cite:3].

### Alertas

La vista de alertas permite revisar mensajes para la comunidad [cite:3]. En el caso del funcionario, también permite emitir nuevas alertas manuales [cite:2][cite:3].

### Dashboard

Es la vista de coordinación para el funcionario [cite:2][cite:3]. Desde ahí puede revisar notificaciones, priorizar casos y asignar brigadas [cite:3].

### Mis asignaciones

Es la vista operativa del brigadista [cite:3]. Debe mostrar las tareas que tiene activas y permitirle cerrar la intervención según la lógica del sistema [cite:3].

---

## 8. Estados importantes del sistema

Para entender SIFIRE, conviene seguir dos tipos de estados: el del reporte y el de la brigada [cite:2][cite:3].

### 8.1 Estados del reporte

- `PENDIENTE`: el caso fue creado y aún no ha sido atendido [cite:2][cite:3].
- `EN_PROCESO`: ya fue tomado por el equipo coordinador y tiene gestión activa [cite:2][cite:3].
- `RESUELTO`: el incidente fue atendido correctamente [cite:2][cite:3].
- `DESCARTADO`: el caso no corresponde o no requiere acción [cite:2].

### 8.2 Estados de la brigada

- `DISPONIBLE`: lista para ser asignada [cite:3].
- `EN_CAMINO`: fue asignada a un incidente y está en desplazamiento o intervención [cite:3].

Estos estados no son solo etiquetas visuales; ayudan a que el sistema mantenga coherencia operativa entre dashboard, mapa y asignaciones [cite:3].

---

## 9. Patrones de diseño usados

El proyecto declara varios patrones de diseño implementados en su arquitectura y lógica [cite:2][cite:3]. A continuación te los explico no solo por nombre, sino por utilidad real.

### 9.1 BFF

El patrón **BFF** centraliza la comunicación entre frontend y microservicios [cite:2][cite:3]. Se usa porque el frontend necesita respuestas ya armadas para vistas complejas, especialmente el mapa y el dashboard [cite:2][cite:3].

**Por qué tiene sentido aquí:**  
Porque el sistema mezcla información de varios dominios; sin BFF, el frontend tendría que hacer muchas llamadas, manejar más errores y duplicar lógica de composición [cite:2][cite:3].

### 9.2 Circuit Breaker

El **Circuit Breaker** está implementado en `ms-bff` con Resilience4j y protege llamadas a microservicios como monitoreo y reportes [cite:2][cite:3]. Si uno falla, el usuario recibe un fallback amigable en vez de un error crítico [cite:2][cite:3].

**Por qué tiene sentido aquí:**  
Porque en una arquitectura distribuida un servicio puede fallar sin que todo el sistema deba colapsar; este patrón mejora la resiliencia, especialmente útil en un proyecto de laboratorio donde pueden levantarse servicios en distinto orden [cite:2][cite:3].

### 9.3 Factory Method

El **Factory Method** aparece en `ms-reportes` para crear reportes con reglas distintas según el tipo de reportante, y también en `ms-usuarios` para crear usuarios válidos por rol [cite:2][cite:3].

**Por qué tiene sentido aquí:**  
Porque el sistema claramente tiene comportamientos distintos por tipo de usuario; usar factories evita llenar el código de condicionales grandes y deja el sistema más preparado para agregar nuevos perfiles, como un posible rol futuro de bombero o supervisor [cite:3].

### 9.4 Observer

El patrón **Observer** se usa cuando la creación o actualización de un reporte debe notificar a otros módulos, como alertas y monitoreo [cite:2][cite:3]. La documentación indica además que esa notificación se hace fuera de la transacción, para que un fallo externo no impida guardar el reporte [cite:3].

**Por qué tiene sentido aquí:**  
Porque reportar un incendio genera consecuencias en más de un área; el mapa debe enterarse, las alertas deben enterarse y quizás en el futuro otros módulos también. Observer permite desacoplar esa reacción del acto principal de guardar el reporte [cite:3].

### 9.5 Repository

El patrón **Repository** está presente en todos los microservicios para encapsular el acceso a datos mediante JPA [cite:2][cite:3].

**Por qué tiene sentido aquí:**  
Porque separa la lógica de negocio del acceso a base de datos y vuelve más limpia la estructura del backend [cite:2][cite:3].

---

## 10. Razones de diseño del sistema

Viendo la estructura del proyecto, SIFIRE parece estar pensado no solo para “funcionar”, sino también para demostrar decisiones de arquitectura propias de una asignatura de desarrollo fullstack avanzado [cite:2][cite:3]. En ese sentido, el diseño apunta a varios objetivos [cite:2][cite:3]:

- Separar responsabilidades por dominio: usuarios, reportes, monitoreo y alertas [cite:2][cite:3].
- Simular operación real municipal con varios actores [cite:2][cite:3].
- Demostrar patrones de diseño clásicos aplicados a un caso concreto [cite:2][cite:3].
- Mejorar tolerancia a fallos por medio de Circuit Breaker [cite:2][cite:3].
- Mantener flexible el crecimiento del sistema con Factory Method y Observer [cite:3].

Dicho de forma simple: no es solo una app para “crear reportes”, sino una maqueta funcional de un sistema coordinado de respuesta a emergencias [cite:2][cite:3].

---

## 11. Recomendaciones para usarlo en demo o evaluación

Para una prueba ordenada, conviene ejecutar el sistema en el orden sugerido por la documentación: primero los microservicios base y al final el BFF, ya que este depende de los demás y activa fallbacks si se levanta antes [cite:2]. La documentación parcial también menciona un script para levantar los cinco microservicios y esperar antes de iniciar el BFF [cite:3].

### Sugerencia de demostración

1. Entrar como ciudadano y crear un reporte [cite:2][cite:3].
2. Mostrar el mapa y la alerta automática [cite:3].
3. Entrar como funcionario y asignar brigada [cite:3].
4. Entrar como brigadista y resolver el caso [cite:3].
5. Volver al mapa y mostrar el cambio de estado [cite:3].

Ese recorrido permite mostrar casi todo el valor del sistema en pocos minutos [cite:2][cite:3].

---

## 12. Problemas esperables en ambiente de pruebas

Como el sistema depende de varios servicios, si alguno no está arriba pueden verse respuestas parciales o fallbacks desde el BFF [cite:2][cite:3]. Esto no necesariamente significa que todo esté roto; puede indicar que el Circuit Breaker está protegiendo la experiencia mientras un microservicio no responde [cite:2][cite:3].

También puede haber una pequeña espera visual en el mapa, porque la actualización se realiza por polling cada 10 segundos y no mediante WebSocket [cite:3].

---

## 13. Resumen operativo por rol

| Rol | Qué hace en la práctica | Resultado esperado |
|---|---|---|
| Ciudadano | Reporta un incendio y revisa mapa/alertas | El caso queda creado y visible [cite:2][cite:3] |
| Brigadista | Revisa asignaciones y marca resolución | El incidente atendido se cierra operativamente [cite:3] |
| Funcionario | Coordina, asigna brigadas y emite alertas | El flujo avanza y se ordena la respuesta [cite:2][cite:3] |
| Administrador | Mantiene usuarios y acceso al sistema | El ambiente de pruebas queda controlado [cite:3] |

---

## 14. Conclusión de uso

Para usar bien SIFIRE hay que entender que cada rol participa en una etapa distinta del mismo proceso: el ciudadano detecta, el funcionario coordina y el brigadista ejecuta la respuesta, mientras el administrador sostiene la operación del entorno [cite:2][cite:3]. Si se sigue esa lógica, el sistema se entiende rápido y la prueba resulta mucho más clara para quien observa la demo [cite:2][cite:3].