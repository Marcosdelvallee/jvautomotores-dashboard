'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { addVehicle, uploadVehicleImages, uploadVehicleImage, getVehicles, deleteVehicle, updateVehicle, updateVehicleOrder, updateAllVehiclePositions } from '@/lib/actions';
import { Vehicle } from '@/lib/types';
import {
    LogOut,
    Plus,
    Car,
    Upload,
    CheckCircle,
    XCircle,
    Loader2,
    Trash2,
    Pencil,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        currency: 'ARS',
        km: '',
        status: 'available',
        fuel: 'Nafta',
        details: '',
        images: [] as string[]
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Verificar autenticación
    useEffect(() => {
        checkAuth();
        loadVehicles();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/jv-secure-access-v1');
        }
    };

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const data = await getVehicles();
            setVehicles(data);
        } catch (err) {
            console.error('Error loading vehicles:', err);
            setError('Error al cargar la lista de vehículos. Por favor recarga la página.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/jv-secure-access-v1');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este vehículo?')) return;

        setError('');
        setSuccess('');

        const result = await deleteVehicle(id);
        if (result.success) {
            setSuccess('Vehículo eliminado correctamente');
            loadVehicles();
        } else {
            setError(result.error || 'Error al eliminar vehículo');
        }
    };

    const handleEdit = (vehicle: Vehicle) => {
        setError('');
        setSuccess('');
        setEditingId(vehicle.id);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vehicle.id);
        setFormData({
            id: isUuid ? '' : vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            price: vehicle.price.toLocaleString('es-AR'),
            currency: vehicle.currency,
            km: vehicle.km.toString(),
            status: vehicle.status,
            fuel: vehicle.fuel || 'Nafta',
            details: vehicle.details || '',
            images: vehicle.images || (vehicle.image_url ? [vehicle.image_url] : [])
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMoveUp = async (index: number) => {
        if (index === 0) return;

        const newVehicles = [...vehicles];
        // Swap in array
        [newVehicles[index], newVehicles[index - 1]] = [newVehicles[index - 1], newVehicles[index]];

        // Update positions for ALL vehicles based on new index
        const updates = newVehicles.map((v, i) => ({
            id: v.id,
            position: i
        }));

        // Update local state with new positions
        const updatedVehicles = newVehicles.map((v, i) => ({ ...v, position: i }));
        setVehicles(updatedVehicles);

        // Update in DB
        await updateAllVehiclePositions(updates);
    };

    const handleMoveDown = async (index: number) => {
        if (index === vehicles.length - 1) return;

        const newVehicles = [...vehicles];
        // Swap in array
        [newVehicles[index], newVehicles[index + 1]] = [newVehicles[index + 1], newVehicles[index]];

        // Update positions for ALL vehicles based on new index
        const updates = newVehicles.map((v, i) => ({
            id: v.id,
            position: i
        }));

        // Update local state with new positions
        const updatedVehicles = newVehicles.map((v, i) => ({ ...v, position: i }));
        setVehicles(updatedVehicles);

        // Update in DB
        await updateAllVehiclePositions(updates);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            id: '',
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            price: '',
            currency: 'ARS',
            km: '',
            status: 'available',
            fuel: 'Nafta',
            details: '',
            images: []
        });
        setSelectedFiles([]);
        setError('');
        setSuccess('');
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        // Validar tamaño de archivos (máximo 10MB)
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = fileArray.filter(file => file.size > MAX_SIZE);

        if (oversizedFiles.length > 0) {
            setError(`Algunos archivos superan el límite de 10MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
            // Limpiar el input para permitir nueva selección
            e.target.value = '';
            return;
        }

        setSelectedFiles(fileArray);
        setUploadingImage(true);
        setError('');

        try {
            const newUrls: string[] = [];
            let hasError = false;

            // Subir imágenes una por una para evitar exceder el límite de tamaño de la solicitud
            for (const file of fileArray) {
                const result = await uploadVehicleImage(file);
                if (result.success && result.url) {
                    newUrls.push(result.url);
                } else {
                    hasError = true;
                    console.error('Error uploading file:', file.name, result.error);
                }
            }

            if (newUrls.length > 0) {
                setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
                setSuccess(`${newUrls.length} imágenes subidas correctamente`);
            }

            if (hasError) {
                setError('Algunas imágenes no se pudieron subir. Intenta con menos archivos o archivos más pequeños.');
            } else if (newUrls.length === 0) {
                setError('Error al subir las imágenes.');
            }

        } catch (err: any) {
            setError(err.message || 'Error al subir imágenes');
        } finally {
            setUploadingImage(false);
            // Limpiar el input para permitir subir más imágenes si se desea
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const vehicleData = {
                ...(formData.id ? { id: formData.id } : {}),
                brand: formData.brand,
                model: formData.model,
                year: Number(formData.year),
                price: Number(formData.price.replace(/\./g, '').replace(',', '.')),
                currency: formData.currency,
                km: Number(formData.km),
                status: formData.status,
                fuel: formData.fuel,
                details: formData.details,
                image_url: formData.images[0] || null,
                images: formData.images
            };

            let result;
            if (editingId) {
                result = await updateVehicle(editingId, vehicleData);
            } else {
                result = await addVehicle(vehicleData);
            }

            if (result.success) {
                setSuccess(editingId ? 'Vehículo actualizado correctamente' : 'Vehículo agregado correctamente');
                handleCancel();
                loadVehicles();
            } else {
                setError(result.error || (editingId ? 'Error al actualizar vehículo' : 'Error al agregar vehículo'));
            }
        } catch (err: any) {
            setError(err.message || 'Error al procesar la solicitud');
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency === 'USD' ? 'USD' : 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                                <p className="text-sm text-slate-400">JVautomotores</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Add Vehicle Button */}
                <div className="mb-6">
                    <button
                        onClick={() => {
                            if (showForm) {
                                handleCancel();
                            } else {
                                setShowForm(true);
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                    >
                        <Plus className="w-5 h-5" />
                        {showForm ? 'Cancelar' : 'Agregar Vehículo'}
                    </button>
                </div>

                {/* Add/Edit Vehicle Form */}
                {showForm && (
                    <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingId ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ID (Optional/Manual) */}
                            {(!editingId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(editingId)) && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        ID (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: AUTO-001"
                                    />
                                </div>
                            )}

                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Marca
                                </label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Toyota"
                                />
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Modelo
                                </label>
                                <input
                                    type="text"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Corolla"
                                />
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Año
                                </label>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                    required
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Precio
                                </label>
                                <input
                                    type="text"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: 15.000.000"
                                />
                            </div>

                            {/* Currency */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Moneda
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ARS">ARS (Pesos Argentinos)</option>
                                    <option value="USD">USD (Dólares)</option>
                                </select>
                            </div>

                            {/* Kilometers */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Kilómetros
                                </label>
                                <input
                                    type="number"
                                    value={formData.km}
                                    onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: 50000"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="available">Disponible</option>
                                    <option value="sold">Vendido</option>
                                </select>
                            </div>



                            {/* Details */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Detalles / Descripción
                                </label>
                                <textarea
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Aire acondicionado, dirección asistida, cierre centralizado..."
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Imágenes del Vehículo (Seleccionar múltiples)
                                </label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl cursor-pointer transition">
                                            <Upload className="w-5 h-5" />
                                            Seleccionar Imágenes
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {uploadingImage && (
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Subiendo {selectedFiles.length} imágenes...
                                            </div>
                                        )}
                                        {formData.images.length > 0 && !uploadingImage && (
                                            <span className="text-green-400 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5" />
                                                {formData.images.length} imágenes cargadas
                                            </span>
                                        )}
                                    </div>

                                    {/* Image Preview Slider */}
                                    {formData.images.length > 0 && (
                                        <div className="flex gap-4 mt-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                                            {formData.images.map((url, index) => (
                                                <div key={index} className="relative flex-shrink-0 w-48 h-32 group snap-center">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border border-slate-700"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors transform hover:scale-110"
                                                            title="Eliminar imagen"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={submitting || uploadingImage}
                                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            {editingId ? 'Guardar Cambios' : 'Agregar Vehículo'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Vehicles Table */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700">
                        <h2 className="text-xl font-bold text-white">Vehículos ({vehicles.length})</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                            <p className="text-slate-400">Cargando vehículos...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="p-12 text-center">
                            <Car className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No hay vehículos registrados</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Posición
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Imagen
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Vehículo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Año
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            KM
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {vehicles.map((vehicle, index) => (
                                        <tr key={vehicle.id} className="hover:bg-slate-700/30 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleMoveUp(index)}
                                                        disabled={index === 0}
                                                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <ArrowUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleMoveDown(index)}
                                                        disabled={index === vehicles.length - 1}
                                                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <ArrowDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {vehicle.image_url ? (
                                                    <img
                                                        src={vehicle.image_url}
                                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                                                        <Car className="w-8 h-8 text-slate-500" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{vehicle.brand}</div>
                                                <div className="text-sm text-slate-400">{vehicle.model}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                {vehicle.year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                                                {formatPrice(vehicle.price, vehicle.currency)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                {vehicle.km.toLocaleString('es-AR')} km
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${vehicle.status === 'available'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/50'
                                                    }`}>
                                                    {vehicle.status === 'available' ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" />
                                                            Disponible
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3 h-3" />
                                                            Vendido
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(vehicle)}
                                                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                                                        title="Editar vehículo"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                                                        title="Eliminar vehículo"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
