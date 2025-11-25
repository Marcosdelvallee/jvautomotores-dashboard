'use client';

import React, { useState, useMemo } from 'react';
import { Car } from '@/lib/types';
import { CarCard } from './CarCard';
import { CarDetailsModal } from './CarDetailsModal';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

interface CatalogProps {
    initialCars: Car[];
}

export function Catalog({ initialCars }: CatalogProps) {
    const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('Todas');
    const [maxPrice, setMaxPrice] = useState<number>(100000000);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    // Extract unique brands
    const brands = useMemo(() => {
        const uniqueBrands = Array.from(new Set(initialCars.map(car => car.marca)));
        return ['Todas', ...uniqueBrands.sort()];
    }, [initialCars]);

    // Calculate max price based on selected currency
    const absoluteMaxPrice = useMemo(() => {
        const filteredByCurrency = selectedCurrency === 'Todas'
            ? initialCars
            : initialCars.filter(c => c.moneda === selectedCurrency);

        if (filteredByCurrency.length === 0) return 100000000;

        return Math.max(...filteredByCurrency.map(c => Number(c.precio)), 50000);
    }, [initialCars, selectedCurrency]);

    // Filter cars
    const filteredCars = useMemo(() => {
        return initialCars.filter(car => {
            const matchesBrand = selectedBrand === 'Todas' || car.marca === selectedBrand;
            const matchesCurrency = selectedCurrency === 'Todas' || car.moneda === selectedCurrency;
            const price = Number(car.precio);
            const matchesPrice = price <= maxPrice;
            const matchesSearch =
                car.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.modelo.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesBrand && matchesCurrency && matchesPrice && matchesSearch;
        });
    }, [initialCars, selectedBrand, selectedCurrency, maxPrice, searchTerm]);

    // Reset max price when currency changes
    React.useEffect(() => {
        setMaxPrice(absoluteMaxPrice);
    }, [absoluteMaxPrice]);

    return (
        <section id="catalogo" className="py-20 px-4 md:px-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">Nuestro Catálogo</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                        Explora nuestra exclusiva selección de vehículos. <span className="font-medium text-slate-900">Calidad garantizada</span> en cada unidad.
                    </p>
                </div>

                {/* Filters Container */}
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/60 mb-16 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800"></div>
                    <div className="flex flex-col gap-8">
                        {/* First Row: Search */}
                        <div className="relative w-full group">
                            <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 ml-1">Búsqueda</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search size={22} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por marca o modelo..."
                                    className="pl-14 w-full p-5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-slate-50/50 focus:bg-white text-lg placeholder:text-slate-400 text-slate-900 font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Second Row: Brand, Currency, and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Brand Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 ml-1">Marca</label>
                                <div className="relative group">
                                    <select
                                        className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none bg-slate-50/50 focus:bg-white appearance-none cursor-pointer text-slate-700 font-medium transition-all hover:border-blue-300"
                                        value={selectedBrand}
                                        onChange={(e) => setSelectedBrand(e.target.value)}
                                    >
                                        {brands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-500 group-hover:text-blue-600 transition-colors">
                                        <SlidersHorizontal size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Currency Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 ml-1">Moneda</label>
                                <div className="relative group">
                                    <select
                                        className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none bg-slate-50/50 focus:bg-white appearance-none cursor-pointer text-slate-700 font-medium transition-all hover:border-blue-300"
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                    >
                                        <option value="Todas">Todas</option>
                                        <option value="USD">USD (Dólares)</option>
                                        <option value="ARS">ARS (Pesos)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-500 group-hover:text-blue-600 transition-colors">
                                        <SlidersHorizontal size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className={selectedCurrency === 'Todas' ? 'opacity-50 pointer-events-none grayscale' : ''}>
                                <div className="flex justify-between mb-3 px-1">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                        Precio Máximo {selectedCurrency === 'Todas' && <span className="text-[10px] font-normal text-red-500 ml-2 normal-case tracking-normal">(Selecciona moneda)</span>}
                                    </label>
                                    <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                        {selectedCurrency === 'USD' ? 'US$' : selectedCurrency === 'ARS' ? 'AR$' : '$'} {isNaN(maxPrice) ? '0' : maxPrice.toLocaleString()}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={isNaN(absoluteMaxPrice) ? 100000 : absoluteMaxPrice}
                                    step={selectedCurrency === 'ARS' ? 100000 : 1000}
                                    value={isNaN(maxPrice) ? 0 : maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    disabled={selectedCurrency === 'Todas'}
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:cursor-not-allowed hover:accent-blue-700 transition-all"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-3 px-1 font-medium">
                                    <span>$0</span>
                                    <span>{selectedCurrency === 'USD' ? 'US$' : selectedCurrency === 'ARS' ? 'AR$' : '$'}{isNaN(absoluteMaxPrice) ? '0' : absoluteMaxPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {filteredCars.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {filteredCars.map((car) => (
                            <CarCard
                                key={car.id}
                                car={car}
                                onClick={() => setSelectedCar(car)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
                            <Filter size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">No se encontraron vehículos</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Intenta ajustar tus filtros de búsqueda para encontrar lo que necesitas.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedBrand('Todas');
                                setSelectedCurrency('Todas');
                                setMaxPrice(absoluteMaxPrice);
                                setSearchTerm('');
                            }}
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline flex items-center justify-center gap-2 mx-auto transition-colors"
                        >
                            <X size={20} /> Limpiar todos los filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Car Details Modal */}
            {selectedCar && (
                <CarDetailsModal
                    car={selectedCar}
                    isOpen={!!selectedCar}
                    onClose={() => setSelectedCar(null)}
                />
            )}
        </section>
    );
}
