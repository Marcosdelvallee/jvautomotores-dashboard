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
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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

                <div className="relative">
                    {/* Filter Toggle Button */}
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center gap-2 bg-white px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-bold text-base md:text-lg hover:bg-slate-50 hover:border-blue-300 transition-all group"
                        >
                            <Filter size={24} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                            Filtrar Vehículos
                        </button>
                        <p className="text-slate-500 text-sm font-medium">
                            Mostrando <span className="text-slate-900 font-bold">{filteredCars.length}</span> vehículos
                        </p>
                    </div>

                    {/* Filter Drawer/Modal */}
                    <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${isFilterOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsFilterOpen(false)}
                        />

                        {/* Drawer Panel */}
                        <div className={`absolute top-0 left-0 h-full w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <Filter size={24} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-xl">Filtros</h3>
                                    </div>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-8">
                                    {/* Search */}
                                    <div className="relative w-full group">
                                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 ml-1">Búsqueda</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Search size={20} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Marca o modelo..."
                                                className="pl-12 w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-slate-50/50 focus:bg-white text-base placeholder:text-slate-400 text-slate-900 font-medium"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Brand Filter */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 ml-1">Marca</label>
                                        <div className="relative group">
                                            <select
                                                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none bg-slate-50/50 focus:bg-white appearance-none cursor-pointer text-slate-700 font-medium text-base transition-all hover:border-blue-300"
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
                                                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none bg-slate-50/50 focus:bg-white appearance-none cursor-pointer text-slate-700 font-medium text-base transition-all hover:border-blue-300"
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
                                                Precio Máximo
                                            </label>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-lg font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 block text-center">
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
                                        {selectedCurrency === 'Todas' && <p className="text-xs text-red-500 mt-3 text-center font-medium">Selecciona una moneda para filtrar por precio</p>}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-6 mt-auto flex flex-col gap-3">
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30"
                                        >
                                            Ver {filteredCars.length} Vehículos
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedBrand('Todas');
                                                setSelectedCurrency('Todas');
                                                setMaxPrice(absoluteMaxPrice);
                                                setSearchTerm('');
                                            }}
                                            className="w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X size={18} /> Limpiar Filtros
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="w-full">
                        {filteredCars.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
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
                </div>
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
