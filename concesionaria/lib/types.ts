export interface Car {
    id: string;
    marca: string;
    modelo: string;
    anio: string;
    precio: string;
    moneda: string; // 'USD' or 'ARS'
    kilometraje: string;
    imagen_url: string;
    imagenes: string[]; // Array of image URLs for gallery
    estado: string;
    combustible: string;
    detalles: string;
}

// Interfaz para vehículos en Supabase
export interface Vehicle {
    id: string;
    brand: string; // also known as 'marca'
    model: string; // also known as 'modelo'
    year: number; // 'anio'
    price: number; // 'precio'
    currency: string; // 'moneda'
    km: number; // 'kilometraje'
    image_url: string | null; // primary image URL
    images: string[]; // additional images array (gallery)
    status: string; // 'estado'
    fuel: string; // 'combustible'
    details: string; // 'detalles'
    position?: number; // Order position for display
    created_at?: string;
}

// Tipo para insertar nuevo vehículo (sin created_at, id opcional)
export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at'> & { id?: string };
