import React from 'react';

const HeroSection = () => {
    return (
        // Contenedor Principal: 
        // 1. Usamos bg-gradient-to-r from-purple-100 to-pink-100 como color base pastel.
        // 2. Altura fija y grande (h-[550px]).
        // 3. La imagen de fondo ('hero-fondo.webp') se pone primero para que el texto sea legible.
        <div className="relative h-[550px] bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-12 shadow-xl overflow-hidden">
            
            {/* Imagen de fondo que se mezcla con el degradado pastel */}
            {/* Si la imagen tiene partes transparentes, se verá el degradado morado/rosa */}
            <div className="absolute inset-0 bg-[url('/hero-fondo.webp')] bg-cover bg-center"></div>

            {/* Contenido del Hero: El texto ahora será oscuro para contrastar */}
            <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-16 text-gray-900">
                
                {/* Etiqueta "Limited Edition": Fondo oscuro, texto blanco, siguiendo el estilo de la referencia */}
                <span className="inline-block bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider shadow-md">
                    LIMITED EDITION
                </span>
                
                {/* Título "50% OFF": Color de texto principal oscuro, "50%" en un morado fuerte */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-none">
                    <span className="text-purple-700">50%</span> OFF
                </h1>
                
                {/* Párrafo de descripción */}
                <p className="text-xl md:text-2xl text-gray-700 max-w-xl mb-8">
                    Descubre moda de calidad que refleja tu estilo y haz que cada día sea extraordinario.
                </p>
                
                {/* Botón: Fondo oscuro (negro) y texto blanco como en la referencia */}
                <button className="bg-gray-900 text-white px-10 py-3 rounded-md font-bold text-lg hover:bg-gray-800 transition duration-300 shadow-xl">
                    EXPLORAR PRODUCTO
                </button>
            </div>
            
        </div>
    );
};

export default HeroSection;