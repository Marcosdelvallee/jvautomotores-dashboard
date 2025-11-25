import { Car } from './types';
import { getVehicles } from './actions';

export async function getCars(): Promise<Car[]> {
    try {
        const vehicles = await getVehicles();

        return vehicles.map(vehicle => ({
            id: vehicle.id,
            marca: vehicle.brand,
            modelo: vehicle.model,
            anio: vehicle.year.toString(),
            precio: vehicle.price.toString(),
            moneda: vehicle.currency,
            kilometraje: vehicle.km.toString(),
            imagen_url: vehicle.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
            imagenes: vehicle.images || (vehicle.image_url ? [vehicle.image_url] : []),
            estado: vehicle.status === 'sold' ? 'Vendido' : 'Disponible',
            combustible: vehicle.fuel || 'Nafta',
            detalles: vehicle.details || '',
        }));
    } catch (error) {
        console.error('Error fetching cars from Supabase:', error);
        return [];
    }
}
