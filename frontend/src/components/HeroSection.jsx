import React from 'react';

const HeroSection = () => {
    return (
        // Contenedor Principal con tema oscuro moderno
        <div className="relative h-[550px] bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-lg mb-12 shadow-2xl overflow-hidden border border-gray-700/50">
            
            {/* Imagen de fondo con overlay oscuro */}
            <div className="absolute inset-0 bg-[url('/hero-fondo.webp')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black/40 to-indigo-900/20"></div>

            {/* Contenido del Hero con texto claro */}
            <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-16">
                
                {/* Etiqueta "Limited Edition" con gradiente morado/verde */}
                <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wider shadow-lg border border-purple-500/30">
                    LIMITED EDITION
                </span>
                
                {/* Título con gradiente de colores */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-none">
                    <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">50%</span>
                    <span className="text-white ml-4">OFF</span>
                </h1>
                
                {/* Párrafo de descripción */}
                <p className="text-xl md:text-2xl text-gray-200 max-w-xl mb-8 leading-relaxed">
                    Descubre moda de calidad que refleja tu estilo y haz que cada día sea extraordinario.
                </p>
                
                {/* Botón con gradiente moderno */}
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl transform hover:scale-105 border border-purple-500/30">
                    EXPLORAR PRODUCTO
                </button>
            </div>
            
        </div>
    );
};

export default HeroSection;