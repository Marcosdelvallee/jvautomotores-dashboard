# 🚀 Instrucciones para Abrir la Aplicación

## Requisitos Previos

Antes de iniciar la aplicación, asegúrate de tener instalado:
- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)

## Pasos para Ejecutar la Aplicación

### 1. Abrir Terminal

Abre una terminal (PowerShell o CMD) y navega al directorio del proyecto:

```bash
cd C:\Users\user\Desktop\jvsupabase\concesionaria
```

### 2. Instalar Dependencias (Solo la primera vez)

Si es la primera vez que ejecutas el proyecto, o si actualizaste las dependencias, ejecuta:

```bash
npm install
```

### 3. Configurar Variables de Entorno

Verifica que el archivo `.env.local` exista en la raíz del proyecto y contenga las credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

> **Nota**: Este archivo ya debería estar configurado. Si no existe, consulta el archivo `SUPABASE_SETUP.md` para más detalles.

### 4. Iniciar el Servidor de Desarrollo

Ejecuta el siguiente comando para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

### 5. Abrir en el Navegador

Una vez que el servidor esté corriendo, verás un mensaje similar a:

```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

Abre tu navegador web y ve a:

**http://localhost:3000**

## 🎯 Rutas Disponibles

- **Página Principal**: [http://localhost:3000](http://localhost:3000) - Catálogo público de vehículos
- **Login Admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) - Acceso al panel de administración
- **Dashboard Admin**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) - Panel de administración (requiere autenticación)

## � Credenciales de Acceso

Para acceder al panel de administración, usa las credenciales que creaste en Supabase:

- **URL de Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: El email que configuraste en Supabase (ej: `admin@jvautomotores.com`)
- **Contraseña**: La contraseña que definiste al crear el usuario admin

> **Nota**: Si olvidaste las credenciales, puedes:
> 1. Ir a tu proyecto en [Supabase](https://supabase.com)
> 2. Navegar a **Authentication** → **Users**
> 3. Ver o editar el usuario administrador
> 4. O crear un nuevo usuario admin si es necesario

## �🛑 Detener el Servidor

Para detener el servidor de desarrollo:
- Presiona `Ctrl + C` en la terminal donde está corriendo

## 📝 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia el servidor en modo producción (después de `build`) |
| `npm run lint` | Ejecuta el linter para verificar el código |

## ❓ Problemas Comunes

### El puerto 3000 ya está en uso

Si obtienes un error de que el puerto está ocupado, puedes:
1. Detener el proceso que usa el puerto 3000
2. O iniciar la app en otro puerto:
   ```bash
   npm run dev -- -p 3001
   ```

### Errores de dependencias

Si encuentras errores relacionados con dependencias:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### La aplicación no muestra datos

Verifica que:
1. Las credenciales de Supabase en `.env.local` sean correctas
2. La base de datos de Supabase esté configurada (ver `SUPABASE_SETUP.md`)
3. La tabla `vehicles` tenga datos

## 📚 Documentación Adicional

- **README.md** - Información general del proyecto
- **README_ADMIN.md** - Guía del panel de administración
- **SUPABASE_SETUP.md** - Configuración de Supabase
- **FRONTEND_INTEGRATION.md** - Detalles de integración frontend

---

**¡Listo!** Tu aplicación debería estar corriendo en [http://localhost:3000](http://localhost:3000) 🎉
