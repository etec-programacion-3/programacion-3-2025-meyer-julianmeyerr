# E-Commerce - Proyecto Full Stack

## Descripción del Proyecto

Sistema de comercio electrónico que permite a los usuarios:
- Registrarse y autenticarse
- Publicar productos para la venta
- Buscar y visualizar productos de otros usuarios
- Iniciar conversaciones con vendedores
- Gestionar sus productos y conversaciones

**Tecnologías utilizadas:**
- **Backend:** Node.js + Express + MongoDB + JWT
- **Frontend:** React + TypeScript + React Router
- **Base de datos:** MongoDB

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Docker](https://www.docker.com/) y Docker Compose
- [Git](https://git-scm.com/)

---

## Configuración de Variables de Entorno

### Backend

El backend utiliza variables de entorno definidas en el archivo `.env`. 

**Ubicación:** `backend/.env`

**Variables requeridas:**

```env
# Puerto en el que corre el backend
PORT=4000

# URI de MongoDB
MONGO_URI=mongodb://localhost:27017/ecommerce

# Secret para JWT (cambiar en producción)
JWT_SECRET=clave_secreta_super_segura_cambiar_en_produccion

# Tiempo de expiración del token JWT
JWT_EXPIRES_IN=1d

# Rondas de encriptación para bcrypt
SALT_ROUNDS=10
```

**⚠️ Importante:** El archivo `.env` ya está incluido en el repositorio para facilitar la evaluación. En un entorno de producción, este archivo debe estar en `.gitignore` y las credenciales deben ser más seguras.

---

## Instrucciones de Ejecución

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd programacion-3-2025-meyer-julianmeyerr
```

### 2. Ejecutar la Base de Datos

La base de datos MongoDB se ejecuta mediante Docker Compose:

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto iniciará MongoDB en el puerto 27017.

**Verificar que MongoDB está corriendo:**

```bash
docker ps
```

Deberías ver un contenedor llamado `ecommerce-mongodb` en estado "Up".

**Para detener MongoDB:**

```bash
docker-compose down
```

**Para detener y eliminar los datos:**

```bash
docker-compose down -v
```

### 3. Ejecutar el Backend

```bash
# Ir a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (con nodemon)
npm run dev

# O ejecutar en modo producción
npm start
```

El backend estará disponible en: `http://localhost:4000`

**Endpoints principales:**
- `http://localhost:4000/api/products` - Productos
- `http://localhost:4000/api/auth/login` - Autenticación
- `http://localhost:4000/api/auth/register` - Registro
- `http://localhost:4000/api/conversations` - Conversaciones
- `http://localhost:4000/api/messages` - Mensajes

### 4. Ejecutar el Frontend

**En otra terminal:**

```bash
# Ir a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

**Para construir para producción:**

```bash
npm run build
```

---

## Pruebas del Backend

Se incluye el archivo `backend/request.http` con ejemplos de todas las operaciones CRUD y endpoints disponibles.

Para ejecutar las peticiones, puedes usar:
- **VS Code:** Instala la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- **IntelliJ IDEA / WebStorm:** Soporte nativo para archivos `.http`

### Ejemplos de Peticiones Incluidas:

1. **Autenticación:**
   - Registro de usuario
   - Login

2. **Productos:**
   - Crear producto
   - Listar todos los productos
   - Obtener producto por ID
   - Actualizar producto
   - Eliminar producto
   - Listar mis productos
   - Buscar productos por vendedor

3. **Conversaciones:**
   - Crear conversación
   - Listar mis conversaciones
   - Obtener conversación por ID

4. **Mensajes:**
   - Enviar mensaje
   - Obtener mensajes de una conversación

5. **Usuarios:**
   - Obtener perfil actual
   - Listar usuarios

---

## Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de DB
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de Mongoose
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Middleware de autenticación
│   │   └── app.js          # Punto de entrada
│   ├── .env                # Variables de entorno
│   ├── package.json
│   └── request.http        # Pruebas de API
├── frontend/
│   ├── src/
│   │   ├── api/            # Configuración de Axios
│   │   ├── pages/          # Componentes de páginas
│   │   ├── App.tsx         # Componente principal
│   │   └── styles.css      # Estilos globales
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml      # Configuración de MongoDB
└── README.md
```

---

## Funcionalidades Principales

### Usuario no autenticado:
- Ver catálogo de productos
- Buscar productos
- Registrarse
- Iniciar sesión

### Usuario autenticado:
- Publicar productos
- Editar/eliminar sus productos
- Iniciar conversaciones con vendedores
- Enviar y recibir mensajes
- Ver perfil de vendedores

---

## API REST - Endpoints Documentados

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |

### Productos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Listar productos (con paginación y búsqueda) | No |
| GET | `/api/products/:id` | Obtener producto por ID | No |
| GET | `/api/products/mine` | Mis productos | Sí |
| GET | `/api/products/seller/:sellerId` | Productos de un vendedor | No |
| POST | `/api/products` | Crear producto | Sí |
| PUT | `/api/products/:id` | Actualizar producto | Sí |
| DELETE | `/api/products/:id` | Eliminar producto | Sí |

### Conversaciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/conversations` | Listar todas | No |
| GET | `/api/conversations/mine` | Mis conversaciones | Sí |
| GET | `/api/conversations/:id` | Obtener conversación con mensajes | Sí |
| POST | `/api/conversations` | Crear conversación | Sí |

### Mensajes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/messages` | Listar mensajes | No |
| POST | `/api/messages` | Enviar mensaje | Sí |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile/me` | Obtener perfil actual | Sí |
| GET | `/api/users` | Listar usuarios | No |
| GET | `/api/users/:id` | Obtener usuario por ID | No |

---

## Solución de Problemas

### Problemas con Docker
```bash
# Probar dandole permisos de administrador para iniciarse (Aplica a otros comandos de Docker utilizando sudo)
sudo docker-compose up -d
```

### MongoDB no se conecta
```bash
# Verificar que el contenedor está corriendo
docker ps

# Ver logs de MongoDB
docker logs ecommerce-mongodb

# Reiniciar el contenedor
docker-compose restart
```

### El backend no inicia
- Verificar que MongoDB esté corriendo
- Verificar que el archivo `.env` existe y tiene las variables correctas
- Verificar que el puerto 4000 no esté ocupado

### El frontend no se conecta al backend
- Verificar que el backend esté corriendo en `http://localhost:4000`
- Verificar la configuración en `frontend/src/api/axiosInstance.ts`

---

## Notas Adicionales

- **Seguridad:** En producción, cambiar `JWT_SECRET` por una clave más segura
- **CORS:** El backend está configurado para aceptar peticiones desde cualquier origen (desarrollo)
- **Paginación:** Los endpoints que listan elementos soportan paginación mediante query params `?page=1&limit=10`
- **Búsqueda:** El endpoint de productos soporta búsqueda mediante `?search=termino`

---

## Autor

Julián Meyer - 5to Informatica
