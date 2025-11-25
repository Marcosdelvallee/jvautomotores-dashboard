import React from 'react';

export function Header() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 py-4 md:py-6">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/logo-final.png"
                        alt="JV Automotores"
                        className="h-24 md:h-25 w-auto object-contain transition-all duration-300"
                    />
                </div>
                <nav>
                    <ul className="flex gap-8">
                        <li>
                            <a href="#catalogo" className="text-white/90 hover:text-white font-medium transition-colors">Catálogo</a>
                        </li>
                        <li>
                            <a href="https://wa.me/5493416406736" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white font-medium transition-colors">Contacto</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
