# ms-usuarios — Gestión de Usuarios y Autenticación

## ¿Qué hace este microservicio?

Maneja todo lo relacionado con los usuarios del sistema: registro, inicio de sesión, consulta por rol y validación de identidad. Es el primer microservicio que debe estar corriendo porque los demás dependen de él para verificar usuarios.

---

## Configuración

| Propiedad | Valor |
|---|---|
| Puerto | `8081` |
| Nombre app | `ms-usuarios` |
| Base de datos | MySQL — `sifire` en `localhost:3306` |
| Usuario DB | `root` / sin contraseña |

---

## Patrón de Diseño: Factory Method — UsuarioFactory

En lugar de crear usuarios directamente con `new Usuario(...)` en cada parte del código, se usa una fábrica centralizada que:

1. Recibe los datos del usuario y su rol deseado
2. Valida que el rol sea uno de los permitidos (`FUNCIONARIO`, `BRIGADISTA`, `CIUDADANO`, `ADMINISTRADOR`)
3. Lanza `IllegalArgumentException` si el rol no existe
4. Devuelve el objeto `Usuario` correctamente configurado

Esto hace el código más fácil de mantener: si en el futuro se agrega un nuevo rol, solo se modifica la fábrica.

> ✅ Esta clase cuenta con **pruebas unitarias** completas en JUnit 5 que validan los casos de éxito, error y sensibilidad a mayúsculas/minúsculas.

---

## Modelo de Datos

### Usuario

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `username` | String | Nombre de usuario, debe ser único |
| `nombre` | String | Nombre real del usuario |
| `email` | String | Correo electrónico |
| `password` | String | Contraseña |
| `rol` | String | `CIUDADANO`, `BRIGADISTA`, `FUNCIONARIO` o `ADMINISTRADOR` |

> **Nota:** El BFF transforma automáticamente el nombre en username al registrarse. Por ejemplo, `"María González"` se convierte en `"maria.gonzalez"` (sin tildes, espacios reemplazados por puntos).

---

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/usuarios/registro` | Registrar nuevo usuario |
| POST | `/api/usuarios/login` | Autenticar usuario (retorna datos del usuario si las credenciales son correctas) |
| GET | `/api/usuarios/listar` | Listar todos los usuarios registrados |
| GET | `/api/usuarios/por-rol/{rol}` | Buscar usuarios por rol (usado por ms-alertas para asignar brigadistas) |

---

## Consideraciones de Seguridad

Por decisión del equipo, en esta versión académica no se implementa JWT ni sesiones con tokens. La autenticación es simple: se validan credenciales y se retorna la información del usuario al frontend, que la guarda en `localStorage` para controlar el acceso a las rutas.

---

## Levantar

> ⚠️ Levantar **primero** que los demás microservicios.

```bash
cd sifire_back/ms-usuarios
./mvnw spring-boot:run
```
