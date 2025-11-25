# Configuración de Supabase - JV Automotores

Esta guía te ayudará a configurar Supabase para el panel de administración del catálogo de autos.

## 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta (si no la tienes)
2. Haz clic en "New Project"
3. Completa los datos:
   - **Name**: JV Automotores (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Selecciona la región más cercana (ej: South America)
4. Haz clic en "Create new project" y espera unos minutos

## 2. Configurar Variables de Entorno

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon/public key** (una clave larga que empieza con `eyJ...`)

3. En tu proyecto Next.js, abre el archivo `.env.local` y agrega:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Crear la Tabla de Vehículos

1. En Supabase, ve a **SQL Editor**
2. Haz clic en "New Query"
3. Copia y pega el siguiente código SQL:

```sql
-- Crear tabla de vehículos
create table vehicles (
  id uuid default gen_random_uuid() primary key,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  currency text not null default 'ARS',
  km integer not null,
  image_url text,
  status text not null default 'available',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security
alter table vehicles enable row level security;

-- Política para lectura pública (cualquiera puede ver los vehículos)
create policy "Public vehicles are viewable by everyone"
  on vehicles for select
  using (true);

-- Política para inserción (solo usuarios autenticados)
create policy "Authenticated users can insert vehicles"
  on vehicles for insert
  with check (auth.role() = 'authenticated');

-- Política para actualización (solo usuarios autenticados)
create policy "Authenticated users can update vehicles"
  on vehicles for update
  using (auth.role() = 'authenticated');

-- Política para eliminación (solo usuarios autenticados)
create policy "Authenticated users can delete vehicles"
  on vehicles for delete
  using (auth.role() = 'authenticated');
```

4. Haz clic en "Run" para ejecutar el SQL

## 4. Configurar Storage para Imágenes

1. En Supabase, ve a **Storage**
2. Haz clic en "Create a new bucket"
3. Configura el bucket:
   - **Name**: `vehicles`
   - **Public bucket**: ✅ Activado (importante para que las imágenes sean públicas)
4. Haz clic en "Create bucket"

## 5. Crear Usuario Administrador

1. En Supabase, ve a **Authentication** → **Users**
2. Haz clic en "Add user" → "Create new user"
3. Completa los datos:
   - **Email**: tu email de administrador (ej: `admin@jvautomotores.com`)
   - **Password**: una contraseña segura
   - **Auto Confirm User**: ✅ Activado
4. Haz clic en "Create user"

**Guarda estas credenciales**, las usarás para iniciar sesión en `/admin/login`

## 6. Verificar Configuración

Ejecuta estos pasos para verificar que todo funciona:

1. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Accede al login:**
   - Ve a `http://localhost:3000/admin/login`
   - Ingresa con el email y contraseña del usuario admin que creaste

3. **Prueba agregar un vehículo:**
   - Deberías ver el dashboard
   - Haz clic en "Agregar Vehículo"
   - Completa el formulario y sube una imagen
   - Verifica que aparezca en la tabla

## 7. Usar en el Frontend Público

Para mostrar los vehículos en tu página pública, usa la función `getVehicles()`:

```typescript
import { getVehicles } from '@/lib/actions';

export default async function HomePage() {
  const vehicles = await getVehicles();
  
  return (
    <div>
      {vehicles.map(vehicle => (
        <div key={vehicle.id}>
          <h3>{vehicle.brand} {vehicle.model}</h3>
          <p>{vehicle.year} - {vehicle.km} km</p>
          <p>${vehicle.price} {vehicle.currency}</p>
          {vehicle.image_url && <img src={vehicle.image_url} alt={`${vehicle.brand} ${vehicle.model}`} />}
        </div>
      ))}
    </div>
  );
}
```

## Rutas del Panel de Administración

- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`

## Solución de Problemas

### Error: "Por favor configura NEXT_PUBLIC_SUPABASE_URL..."
- Verifica que las variables de entorno estén en `.env.local`
- Reinicia el servidor de desarrollo (`npm run dev`)

### No puedo iniciar sesión
- Verifica que el usuario esté creado en Supabase → Authentication → Users
- Asegúrate de que "Auto Confirm User" esté activado
- Verifica que el email y contraseña sean correctos

### Las imágenes no se suben
- Verifica que el bucket "vehicles" exista en Storage
- Asegúrate de que el bucket sea público
- Revisa la consola del navegador para ver errores específicos

### Los vehículos no aparecen en la tabla
- Ve a Supabase → Table Editor → vehicles para verificar que los datos estén guardados
- Verifica las políticas RLS (Row Level Security) en Supabase

## Migrar Datos Existentes

Si tienes datos en Excel/CSV, puedes:

1. **Opción 1 - Importar CSV en Supabase:**
   - Ve a Table Editor → vehicles
   - Haz clic en "Insert" → "Import data from CSV"
   - Mapea las columnas correctamente

2. **Opción 2 - Usar el formulario del admin:**
   - Accede al dashboard
   - Agrega cada vehículo manualmente con el formulario

## Próximos Pasos

Una vez configurado, puedes:
- ✅ Agregar vehículos desde el panel admin
- ✅ Subir imágenes automáticamente
- ✅ Mostrar vehículos en tu página pública
- ✅ Gestionar el estado (disponible/vendido)

¡Tu panel de administración está listo! 🚗
