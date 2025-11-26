import React from 'react';
import { Car } from '@/lib/types';
import { MessageCircle, Gauge, ArrowRight, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface CarCardProps {
    car: Car;
    onClick: () => void;
}

export function CarCard({ car, onClick }: CarCardProps) {
    const isSold = car.estado === 'Vendido';

    // Format price to currency
    const price = Number(car.precio);
    const formattedPrice = car.moneda === 'ARS'
        ? `AR$ ${price.toLocaleString('es-AR')}`
        : new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: car.moneda,
            minimumFractionDigits: 0
        }).format(price);

    return (
        <div
            onClick={onClick}
            className={clsx(
                "group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 flex flex-col h-full overflow-hidden cursor-pointer relative isolate",
                isSold && "opacity-90 grayscale-[0.3]"
            )}
        >
            <div className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                <img
                    src={car.imagen_url}
                    alt={`${car.marca} ${car.modelo}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out relative z-10"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 z-20 transition-opacity duration-500 group-hover:opacity-70" />

                {isSold && (
                    <div className="absolute inset-0 z-30 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-white text-slate-900 px-8 py-3 font-black text-xl uppercase tracking-[0.2em] transform -rotate-12 shadow-2xl">
                            Vendido
                        </span>
                    </div>
                )}

                <div className="absolute bottom-5 left-5 z-30 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{car.anio}</p>
                    <h3 className="text-2xl font-bold leading-tight tracking-tight">{car.marca} <span className="font-light">{car.modelo}</span></h3>
                </div>
            </div>

            <div className="p-3 md:p-6 flex-1 flex flex-col bg-white relative z-40">
                <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-6">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Precio Contado</p>
                        <p className="text-3xl font-bold text-slate-900 tracking-tight">{formattedPrice}</p>
                    </div>
                </div>

                <div className="mb-8 text-sm text-slate-600">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-blue-600" />
                            <span className="font-medium text-slate-700">{car.anio}</span>
                        </div>
                        <div className="hidden md:block w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <Gauge size={18} className="text-blue-600" />
                            <span className="font-medium text-slate-700">{car.kilometraje} km</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <button className="w-full group/btn bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:bg-blue-700 shadow-lg shadow-slate-900/20 hover:shadow-blue-700/30">
                        Ver Detalles
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
