# Panel de Administración - Guía Rápida

## 📁 Archivos Creados

### Configuración
- `lib/supabaseClient.ts` - Cliente de Supabase
- `lib/types.ts` - Tipos TypeScript (actualizado)
- `lib/actions.ts` - Server Actions para CRUD

### Panel Admin
- `app/admin/login/page.tsx` - Página de login
- `app/admin/dashboard/page.tsx` - Dashboard con gestión de vehículos
- `middleware.ts` - Protección de rutas

### Documentación
- `SUPABASE_SETUP.md` - Guía completa de configuración
- `FRONTEND_INTEGRATION.md` - Ejemplos de integración

## 🚀 Inicio Rápido

### 1. Configurar Supabase
```bash
# Ver SUPABASE_SETUP.md para instrucciones detalladas
```

Necesitas:
- ✅ Proyecto en Supabase
- ✅ Variables en `.env.local`
- ✅ Tabla `vehicles` creada
- ✅ Bucket `vehicles` en Storage
- ✅ Usuario admin creado

### 2. Variables de Entorno
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Ejecutar la App
```bash
npm run dev
```

## 🔐 Acceso al Panel

- **URL Login**: `http://localhost:3000/admin/login`
- **URL Dashboard**: `http://localhost:3000/admin/dashboard`

## 📊 Esquema de Base de Datos

```sql
create table vehicles (
  id uuid primary key,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  currency text not null default 'ARS',
  km integer not null,
  image_url text,
  status text not null default 'available',
  created_at timestamp with time zone
);
```

## 🎨 Funcionalidades del Dashboard

### Login
- ✅ Autenticación con email/password
- ✅ Validación de errores
- ✅ Redirección automática

### Dashboard
- ✅ Tabla de vehículos
- ✅ Formulario para agregar vehículos
- ✅ Subida de imágenes al Storage
- ✅ Indicadores de estado (disponible/vendido)
- ✅ Formateo de precios
- ✅ Protección de rutas

## 🔌 Integración con Frontend

### Uso Básico
```typescript
import { getVehicles } from '@/lib/actions';

export default async function HomePage() {
  const vehicles = await getVehicles();
  
  return (
    <div>
      {vehicles.map(v => (
        <div key={v.id}>
          <h3>{v.brand} {v.model}</h3>
          <p>{v.year} - {v.km} km</p>
          <p>{v.currency} {v.price}</p>
        </div>
      ))}
    </div>
  );
}
```

Ver `FRONTEND_INTEGRATION.md` para más ejemplos.

## 📝 Funciones Disponibles

### `getVehicles()`
Obtiene todos los vehículos desde Supabase.
```typescript
const vehicles = await getVehicles();
```

### `addVehicle(vehicle)`
Agrega un nuevo vehículo (requiere autenticación).
```typescript
const result = await addVehicle({
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  price: 15000000,
  currency: 'ARS',
  km: 50000,
  status: 'available',
  image_url: null
});
```

### `uploadVehicleImage(file)`
Sube una imagen al Storage de Supabase.
```typescript
const result = await uploadVehicleImage(file);
if (result.success) {
  console.log(result.url);
}
```

## 🛡️ Seguridad

- ✅ Row Level Security (RLS) habilitado
- ✅ Lectura pública de vehículos
- ✅ Escritura solo para usuarios autenticados
- ✅ Middleware de protección de rutas
- ✅ Validación de sesión

## 🔧 Solución de Problemas

### Error de variables de entorno
```bash
# Reiniciar el servidor
npm run dev
```

### No puedo iniciar sesión
- Verifica que el usuario exista en Supabase Auth
- Asegúrate de que "Auto Confirm User" esté activado

### Las imágenes no se suben
- Verifica que el bucket "vehicles" sea público
- Revisa la consola del navegador

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✅ Checklist de Implementación

- [ ] Crear proyecto en Supabase
- [ ] Configurar variables de entorno
- [ ] Ejecutar SQL para crear tabla
- [ ] Crear bucket de Storage
- [ ] Crear usuario admin
- [ ] Probar login
- [ ] Agregar vehículo de prueba
- [ ] Integrar con frontend público

¡Tu panel de administración está listo para usar! 🎉
