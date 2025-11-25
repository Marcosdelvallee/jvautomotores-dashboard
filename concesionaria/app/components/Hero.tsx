'use client';

import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

export function Hero() {
    const scrollToCatalog = () => {
        // Placeholder for scroll logic
        const catalogSection = document.getElementById('catalogo');
        if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Brand Watermark */}
            <div className="absolute inset-0 z-0 bg-slate-950 flex items-start md:items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 z-10" />
                <img
                    src="/logo-final.png"
                    alt="JV Automotores Background"
                    className="w-[75%] md:w-[80%] h-auto object-contain opacity-20 grayscale mt-32 md:mt-0"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">


                <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl animate-fade-in-up delay-100">
                    Tu próximo auto <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">
                        te está esperando
                    </span>
                </h1>

                <p className="text- -2xl md:text-1xl text-slate-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200 drop-shadow-md">
                    Descubre la mejor selección de vehículos con financiación a tu medida.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300">
                    <button
                        onClick={scrollToCatalog}
                        className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/40 flex items-center gap-3"
                    >
                        Ver Catálogo
                        <ChevronDown className="group-hover:translate-y-1 transition-transform" size={24} />
                    </button>
                    <a
                        href="https://wa.me/5493416406736"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 hover:shadow-xl hover:border-white/50"
                    >
                        Contactar Asesor
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                    </a>
                </div>
            </div>
        </div>
    );
}
