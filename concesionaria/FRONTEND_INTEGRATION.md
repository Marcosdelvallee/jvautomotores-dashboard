# Integración de Supabase con el Frontend Público

Esta guía te muestra cómo integrar los vehículos de Supabase en tu página pública existente.

## Opción 1: Usar Server Component (Recomendado)

Si tu página actual es un Server Component, simplemente importa y usa `getVehicles()`:

```typescript
// app/page.tsx
import { getVehicles } from '@/lib/actions';
import { Vehicle } from '@/lib/types';

export default async function HomePage() {
  // Obtener vehículos desde Supabase
  const vehicles = await getVehicles();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catálogo de Autos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Imagen */}
            {vehicle.image_url && (
              <img 
                src={vehicle.image_url} 
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
            )}
            
            {/* Contenido */}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">
                {vehicle.brand} {vehicle.model}
              </h3>
              
              <div className="space-y-2 text-gray-600">
                <p>Año: {vehicle.year}</p>
                <p>Kilómetros: {vehicle.km.toLocaleString('es-AR')} km</p>
                <p className="text-2xl font-bold text-blue-600">
                  {vehicle.currency === 'USD' ? 'USD' : 'AR$'} {vehicle.price.toLocaleString('es-AR')}
                </p>
              </div>

              {/* Badge de estado */}
              {vehicle.status === 'sold' && (
                <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  Vendido
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Opción 2: Usar Client Component con useEffect

Si necesitas un Client Component (por ejemplo, para filtros interactivos):

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getVehicles } from '@/lib/actions';
import { Vehicle } from '@/lib/types';

export default function CatalogPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    const data = await getVehicles();
    setVehicles(data);
    setLoading(false);
  };

  if (loading) {
    return <div>Cargando vehículos...</div>;
  }

  return (
    <div>
      {/* Tu código de catálogo aquí */}
      {vehicles.map(vehicle => (
        <div key={vehicle.id}>
          {/* Renderizar vehículo */}
        </div>
      ))}
    </div>
  );
}
```

## Opción 3: Filtrar Solo Vehículos Disponibles

Si solo quieres mostrar vehículos disponibles (no vendidos):

```typescript
import { getVehicles } from '@/lib/actions';

export default async function HomePage() {
  const allVehicles = await getVehicles();
  
  // Filtrar solo disponibles
  const availableVehicles = allVehicles.filter(v => v.status === 'available');

  return (
    <div>
      {availableVehicles.map(vehicle => (
        // Tu código aquí
      ))}
    </div>
  );
}
```

## Mapeo de Campos

Si tu código actual usa la interfaz `Car` con campos en español, puedes mapear así:

```typescript
import { getVehicles } from '@/lib/actions';
import { Car } from '@/lib/types';

export default async function HomePage() {
  const vehicles = await getVehicles();
  
  // Convertir Vehicle a Car (mapeo de campos)
  const cars: Car[] = vehicles.map(v => ({
    id: v.id,
    marca: v.brand,
    modelo: v.model,
    anio: v.year.toString(),
    precio: v.price.toString(),
    moneda: v.currency,
    kilometraje: v.km.toString(),
    imagen_url: v.image_url || '',
    imagenes: v.image_url ? [v.image_url] : [],
    estado: v.status === 'sold' ? 'Vendido' : 'Disponible',
    combustible: '', // Si no tienes este campo en Supabase
    detalles: ''     // Si no tienes este campo en Supabase
  }));

  // Ahora puedes usar 'cars' con tu código existente
  return (
    <div>
      {cars.map(car => (
        // Tu código existente que usa la interfaz Car
      ))}
    </div>
  );
}
```

## Revalidación de Datos

Para que los cambios en el admin se reflejen inmediatamente:

```typescript
// app/page.tsx
import { getVehicles } from '@/lib/actions';

// Revalidar cada 60 segundos
export const revalidate = 60;

export default async function HomePage() {
  const vehicles = await getVehicles();
  // ...
}
```

O para revalidación bajo demanda:

```typescript
// lib/actions.ts
import { revalidatePath } from 'next/cache';

export async function addVehicle(vehicle: VehicleInsert) {
  // ... código existente ...
  
  // Revalidar la página principal
  revalidatePath('/');
  
  return { success: true, data };
}
```

## Ejemplo Completo con Filtros

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getVehicles } from '@/lib/actions';
import { Vehicle } from '@/lib/types';

export default function CatalogPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (brandFilter === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter(v => v.brand === brandFilter));
    }
  }, [brandFilter, vehicles]);

  const loadVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data.filter(v => v.status === 'available'));
    setFilteredVehicles(data.filter(v => v.status === 'available'));
  };

  const brands = [...new Set(vehicles.map(v => v.brand))];

  return (
    <div>
      {/* Filtro */}
      <select 
        value={brandFilter} 
        onChange={(e) => setBrandFilter(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      >
        <option value="all">Todas las marcas</option>
        {brands.map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>

      {/* Catálogo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.id} className="border rounded-lg p-4">
            <h3>{vehicle.brand} {vehicle.model}</h3>
            <p>{vehicle.year} - {vehicle.km} km</p>
            <p className="font-bold">{vehicle.currency} {vehicle.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Próximos Pasos

1. Reemplaza tu código actual de obtención de datos con `getVehicles()`
2. Ajusta el mapeo de campos según tu interfaz existente
3. Prueba que los datos se muestren correctamente
4. Agrega vehículos desde el panel admin y verifica que aparezcan

¡Listo! Ahora tu catálogo público está conectado a Supabase. 🚗
