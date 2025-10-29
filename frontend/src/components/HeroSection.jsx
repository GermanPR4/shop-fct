import React from 'react';

const HeroSection = () => {
    return (
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-8 md:p-12 rounded-lg mb-12 flex flex-col md:flex-row items-center shadow-md">
            {/* Columna Izquierda: Texto y Descuento */}
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                <span className="inline-block bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">Limited Edition</span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                    <span className="text-red-600">50%</span> OFF
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Descubre moda de calidad que refleja tu estilo y haz que cada día sea extraordinario.
                </p>
                <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-300 shadow-lg">
                    Explorar Producto
                </button>
            </div>

            {/* Columna Derecha: Imagen Principal */}
            <div className="md:w-1/2 flex justify-center">
                {/* Reemplaza con tu imagen */}
                // Dentro de HeroSection.jsx
                <img
                    src="https://placehold.co/400x400/E9D5FF/8B5CF6?text=Modelo+OmniStyle" // <-- URL CORREGIDA
                    alt="Modelo OmniStyle"
                    className="rounded-lg shadow-xl max-w-xs md:max-w-sm lg:max-w-md"
                />
            </div>
        </div>
    );
};

export default HeroSection;