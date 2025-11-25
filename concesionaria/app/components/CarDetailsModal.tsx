import React, { useState } from 'react';
import { Car } from '@/lib/types';
import { X, MessageCircle, Calendar, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface CarDetailsModalProps {
    car: Car;
    isOpen: boolean;
    onClose: () => void;
}

export function CarDetailsModal({ car, isOpen, onClose }: CarDetailsModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isOpen) return null;

    const isSold = car.estado === 'Vendido';
    const hasMultipleImages = car.imagenes && car.imagenes.length > 1;

    // Format price
    const price = Number(car.precio);
    const formattedPrice = car.moneda === 'ARS'
        ? `AR$ ${price.toLocaleString('es-AR')}`
        : new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: car.moneda,
            minimumFractionDigits: 0
        }).format(price);

    // WhatsApp link
    const whatsappMessage = `Hola, estoy interesado en el ${car.marca} ${car.modelo} (${car.anio}) que vi en la web.`;
    const whatsappLink = `https://wa.me/5493416406736?text=${encodeURIComponent(whatsappMessage)}`;

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? car.imagenes.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === car.imagenes.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Image Section with Thumbnails */}
                <div className="w-full md:w-3/5 bg-slate-100 flex flex-col">
                    {/* Main Image */}
                    <div className="relative w-full flex-grow h-[400px] md:h-[500px]">
                        <img
                            src={car.imagenes[currentImageIndex]}
                            alt={`${car.marca} ${car.modelo} - Imagen ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
                            }}
                        />

                        {/* Navigation Arrows (only if multiple images) */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Sold Overlay */}
                        {isSold && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-8 py-3 font-bold text-2xl uppercase tracking-widest transform -rotate-12 border-4 border-white shadow-lg">
                                    Vendido
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {hasMultipleImages && (
                        <div className="p-4 bg-white border-t border-slate-100 overflow-x-auto">
                            <div className="flex gap-3">
                                {car.imagenes.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={clsx(
                                            "relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-200",
                                            currentImageIndex === index
                                                ? "ring-2 ring-blue-600 ring-offset-2 opacity-100"
                                                : "opacity-60 hover:opacity-100 hover:ring-2 hover:ring-slate-300 hover:ring-offset-1"
                                        )}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-2/5 p-8 flex flex-col bg-white">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                isSold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            )}>
                                {car.estado}
                            </span>
                            {!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(car.id) && (
                                <span className="text-slate-400 text-sm font-medium">ID: {car.id}</span>
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{car.marca} {car.modelo}</h2>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{formattedPrice}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Calendar size={18} />
                                <span className="text-sm font-medium">Año</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">{car.anio}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Gauge size={18} />
                                <span className="text-sm font-medium">Kilometraje</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">{car.kilometraje} km</p>
                        </div>
                    </div>

                    {car.detalles && (
                        <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h3 className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-wide">Detalles Adicionales</h3>
                            <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                                {car.detalles}
                            </p>
                        </div>
                    )}

                    <div className="mt-auto">
                        {isSold ? (
                            <button
                                disabled
                                className="w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                No disponible
                            </button>
                        ) : (
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-green-200 flex items-center justify-center gap-3 group"
                            >
                                <MessageCircle className="group-hover:scale-110 transition-transform" />
                                Consultar por WhatsApp
                            </a>
                        )}
                        <p className="text-center text-slate-400 text-xs mt-4">
                            Al consultar, menciona el código del vehículo para una atención más rápida.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
