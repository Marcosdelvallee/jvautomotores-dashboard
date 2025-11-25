'use server';

import { createServerClient } from './supabaseClient';
import { Vehicle, VehicleInsert } from './types';

/**
 * Obtener todos los vehículos desde Supabase
 * Esta función puede ser usada en Server Components
 */
export async function getVehicles(): Promise<Vehicle[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching vehicles:', error);
        return [];
    }

    return data || [];
}

/**
 * Agregar un nuevo vehículo
 * Requiere autenticación
 */
export async function addVehicle(vehicle: VehicleInsert): Promise<{ success: boolean; error?: string; data?: Vehicle }> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicle])
        .select()
        .single();

    if (error) {
        console.error('Error adding vehicle:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Subir imagen de vehículo al Storage
 * Retorna la URL pública de la imagen
 */
export async function uploadVehicleImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const supabase = createServerClient();

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return { success: false, error: uploadError.message };
    }

    // Obtener URL pública
    const { data } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
}

// Upload multiple images and return array of URLs
export async function uploadVehicleImages(files: File[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    const supabase = createServerClient();
    const urls: string[] = [];

    for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('vehicles')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return { success: false, error: uploadError.message };
        }

        const { data } = supabase.storage
            .from('vehicles')
            .getPublicUrl(filePath);

        if (data?.publicUrl) {
            urls.push(data.publicUrl);
        }
    }

    return { success: true, urls };
}

// Delete a vehicle by id
export async function deleteVehicle(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting vehicle:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Update a vehicle
export async function updateVehicle(id: string, vehicle: Partial<VehicleInsert>): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('vehicles')
        .update(vehicle)
        .eq('id', id);

    if (error) {
        console.error('Error updating vehicle:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
